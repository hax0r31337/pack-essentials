package pack

import (
	"archive/zip"
	"bytes"
	"errors"
	"io"

	"github.com/buger/jsonparser"
)

type EncryptedResourcePack struct {
	Data []byte
	Key  []byte
}

var encryptionExclude = []string{"manifest.json", "pack_icon.png", "bug_pack_icon.png"}

func EncryptPack(data []byte) (*EncryptedResourcePack, error) {
	r, err := zip.NewReader(bytes.NewReader(data), int64(len(data)))
	if err != nil {
		return nil, err
	}

	// Read manifest to verify if its a valid pack and to find content id
	var uuid string
	for _, f := range r.File {
		if f.Name == "manifest.json" {
			uuid, err = readManifest(f)
			if err != nil {
				return nil, err
			}
		}
	}
	if uuid == "" {
		return nil, errors.New("no manifest found")
	}

	var output bytes.Buffer
	w := zip.NewWriter(&output)
	defer w.Close()

	// encrypt resources
	contents := make(packContent)
	for _, f := range r.File {
		if !f.Mode().IsRegular() {
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

		if !excludeRequired(f.Name) {
			println("encrypting:", f.Name)
			key, iv := generateKey()
			data, err = aes256cfbEncrypt(data, key, iv)
			if err != nil {
				return nil, err
			}

			contents[f.Name] = key
		}

		println("writing:", f.Name)
		_, err = outputFile.Write(data)
		if err != nil {
			return nil, err
		}
	}

	// generate content.json
	contentsJson, err := w.Create("contents.json")
	if err != nil {
		return nil, err
	}
	// magic
	contentsJson.Write([]byte{0x00, 0x00, 0x00, 0x00, 0xfc, 0xb9, 0xcf, 0x9b, 0x00, 0x00})
	// content uuid
	contentsJson.Write([]byte{byte(len(uuid))})
	contentsJson.Write([]byte(uuid))
	// empty region
	contentsJson.Write(make([]byte, 0x100-11-len(uuid)))
	// encrypted json
	contentData := toContentsJson(contents)
	key, iv := generateKey()
	contentData, err = aes256cfbEncrypt(contentData, key, iv)
	if err != nil {
		return nil, err
	}
	contentsJson.Write(contentData)

	err = w.Close()
	if err != nil {
		return nil, err
	}

	return &EncryptedResourcePack{
		Data: output.Bytes(),
		Key:  key,
	}, nil
}

func readFile(f *zip.File) ([]byte, error) {
	file, err := f.Open()
	if err != nil {
		return nil, err
	}
	data, err := io.ReadAll(file)
	file.Close()
	if err != nil {
		return nil, err
	}
	return data, nil
}

func readManifest(f *zip.File) (string, error) {
	data, err := readFile(f)
	if err != nil {
		return "", err
	}

	var value []byte
	value, _, _, err = jsonparser.Get(data, "header", "uuid")
	if err != nil {
		return "", err
	}

	return string(value), nil
}

func excludeRequired(path string) bool {
	for _, p := range encryptionExclude {
		if p == path {
			return true
		}
	}
	return false
}
