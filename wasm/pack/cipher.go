package pack

import (
	"crypto/aes"
	"math/rand"
	"time"
)

var random = rand.New(rand.NewSource(time.Now().UnixMilli()))

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")

func randomString(length int) string {
	b := make([]rune, length)
	for i := range b {
		b[i] = letterRunes[random.Intn(len(letterRunes))]
	}
	return string(b)
}

func generateKey() (key []byte, iv []byte) {
	key = []byte(randomString(32))
	iv = key[:16]
	return
}

func aes256cfbEncrypt(data []byte, key []byte, iv []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	encrypted := make([]byte, len(data))

	stream := newCFB8Encrypt(block, iv)
	stream.XORKeyStream(encrypted, data)

	return encrypted, nil
}

func aes256cfbDecrypt(data []byte, key []byte, iv []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	decrypted := make([]byte, len(data))

	stream := newCFB8Decrypt(block, iv)
	stream.XORKeyStream(decrypted, data)

	return decrypted, nil
}
