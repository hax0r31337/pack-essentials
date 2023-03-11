mkdir -p wasm/build

# js glue for wasm library
cp -R -u -p "$(go env GOROOT)/misc/wasm/wasm_exec.js" wasm/build/wasm_exec.js

# build wasm library
 GOOS=js GOARCH=wasm go build -C wasm -v -trimpath -ldflags "-s -w -buildid=" -o build/libresourcepack.wasm 