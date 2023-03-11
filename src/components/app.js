import React from 'react'
import EncryptPage from './encrypt';
import Spinner from './spinner';

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true
        }
    }
    componentDidMount() {
        const go = new Go(); // Defined in wasm_exec.js
        const WASM_URL = 'libresourcepack.wasm';

        if ('instantiateStreaming' in WebAssembly) {
            WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then((obj) => {
                go.run(obj.instance)
                this.setState({ isLoading: false })
            })
        } else {
            fetch(WASM_URL).then(resp =>
                resp.arrayBuffer()
            ).then(bytes =>
                WebAssembly.instantiate(bytes, go.importObject).then((obj) => {
                    go.run(obj.instance)
                    this.setState({ isLoading: false })
                })
            )
        }

        // setup global handlers
        window.downloadFileHandler = function(fileName, mimeType, data) {
            var a = document.createElement('a')
            a.download = fileName
            a.href = URL.createObjectURL(new Blob([data], { type: mimeType }))
            a.click()
        }

        window.errorHandler = function(error) {
            console.error(error)
        }
    }
    render() {
        return this.state.isLoading ? (
            <div className="bg-gray-800 flex items-center justify-center h-full">
                <Spinner className="h-36 w-36" />
            </div>
        ) : (
            <EncryptPage />
        )
    }
}