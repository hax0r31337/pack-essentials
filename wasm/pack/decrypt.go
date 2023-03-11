package pack

import (
	"archive/zip"
	"bytes"
	"errors"
)

func DecryptPack(pack *EncryptedResourcePack) ([]byte, error) {
	if len(pack.Key) != 32 {
		return nil, errors.New("key must be 32 bytes long")
	}

	r, err := zip.NewReader(bytes.NewReader(pack.Data), int64(len(pack.Data)))
	if err != nil {
		return nil, err
	}

	var contents packContent
	for _, f := range r.File {
		if f.Name == "contents.json" {
			data, err := readFile(f)
			if err != nil {
				return nil, err
			}
			// decrypt
			data = data[0x100:]
			data, err = aes256cfbDecrypt(data, pack.Key, pack.Key[:16])
			if err != nil {
				return nil, err
			}
			contents, err = fromContentsJson(data)
			if err != nil {
				return nil, err
			}
		}
	}
	if contents == nil {
		return nil, errors.New("no contents table found")
	}

	// decrypt data
	var output bytes.Buffer
	w := zip.NewWriter(&output)
	defer w.Close()

	for _, f := range r.File {
		if !f.Mode().IsRegular() || f.Name == "contents.json" {
			continue
		}
		data, err := readFile(f)
		if err != nil {
			return nil, err
		}
		outputFile, err := w.Create(f.Name)
		if err != nil {
			return nil, err
		}

		if key, ok := contents[f.Name]; ok {
			println("decrypting:", f.Name)
			data, err = aes256cfbDecrypt(data, key, key[:16])
			if err != nil {
				return nil, err
			}
		}

		println("writing:", f.Name)
		_, err = outputFile.Write(data)
		if err != nil {
			return nil, err
		}
	}

	err = w.Close()
	if err != nil {
		return nil, err
	}

	return output.Bytes(), nil
}
