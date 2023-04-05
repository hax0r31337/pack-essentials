# Pack Essentials
An open-source alternative to [encryptmypack](encryptmypack.com), which allows you encrypt and decrypt Minecraft: BE resource packs inside your browser

## Build
1. Install go and npm
2. Run `./build_wasm.sh` to build wasm library for resource pack encryption and decryption
3. Run `npm install` and `npm run build`
4. The site is ready in `./dist`

## Todo
 - not freeze the website while processing

## Credits
[mcrputils](https://github.com/valaphee/mcrputil/) for the encryption and decryption algorithm   