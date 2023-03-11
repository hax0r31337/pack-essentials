package main

import (
	"fmt"
	"libresourcepack/pack"
	"strconv"
	"syscall/js"
)

func createUint8Array(data []byte) js.Value {
	arr := js.Global().Call("eval", "new Uint8Array("+strconv.Itoa(len(data))+")")
	js.CopyBytesToJS(arr, data)
	return arr
}

func errorHandler(err error) {
	js.Global().Call("errorHandler", err.Error())
}

func downloadBlobFile(name string, mime string, data []byte) {
	js.Global().Call("downloadFileHandler", name, mime, createUint8Array(data))
}

func encryptPackJsWrapper(this js.Value, args []js.Value) any {
	if len(args) != 3 {
		panic("Invalid arguments")
	}
	dataSize := args[1].Int()
	data := make([]byte, dataSize)
	js.CopyBytesToGo(data, args[0])

	result, err := pack.EncryptPack(data)
	if err != nil {
		errorHandler(err)
		return js.Undefined()
	}

	name := args[2].String()
	downloadBlobFile(name, "application/zip", result.Data)
	downloadBlobFile(name+".key", "application/octet-stream", result.Key)

	return js.Undefined()
}

func decryptPackJsWrapper(this js.Value, args []js.Value) any {
	if len(args) != 5 {
		panic("Invalid arguments")
	}
	packDataSize := args[1].Int()
	packData := make([]byte, packDataSize)
	js.CopyBytesToGo(packData, args[0])
	keyDataSize := args[3].Int()
	keyData := make([]byte, keyDataSize)
	js.CopyBytesToGo(keyData, args[2])

	result, err := pack.DecryptPack(&pack.EncryptedResourcePack{
		Data: packData,
		Key:  keyData,
	})
	if err != nil {
		errorHandler(err)
		return js.Undefined()
	}

	name := args[4].String()
	downloadBlobFile(name, "application/zip", result)

	return js.Undefined()
}

func main() {
	fmt.Println("Go Web Assembly")
	js.Global().Set("encryptPack", js.FuncOf(encryptPackJsWrapper))
	js.Global().Set("decryptPack", js.FuncOf(decryptPackJsWrapper))

	// this is essential to keep wasm process alive
	<-make(chan bool)
}
