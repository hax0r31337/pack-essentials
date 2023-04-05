mkdir -p public/assets

# js glue for wasm library
cp -R -u -p "$(go env GOROOT)/misc/wasm/wasm_exec.js" ./public/assets/wasm_exec.js

# build wasm library
cd wasm
GOOS=js GOARCH=wasm go build -v -trimpath -ldflags "-s -w -buildid=" -o ../public/assets/libresourcepack.wasm 
