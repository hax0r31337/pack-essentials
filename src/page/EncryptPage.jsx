import React, { useRef } from 'react'
import { Link } from 'react-router-dom'

export default function EncryptPage() {
    const inputFile = useRef(null)
    const onInputFileChange = (e) => {
        let fileReader = new FileReader()
        fileReader.onload = (event) => {
            let uint8Arr = new Uint8Array(event.target.result)
            let numBytes = uint8Arr.length * uint8Arr.BYTES_PER_ELEMENT
            encryptPack(uint8Arr, numBytes, event.target.filename)
        };
        fileReader.filename = e.target.files[0].name
        fileReader.mime_type = e.target.files[0].type
        fileReader.readAsArrayBuffer(e.target.files[0])
    }

    return (
        <div className="bg-gray-800 flex flex-col justify-center h-full" style={{ 'paddingLeft': '5%', 'paddingRight': '5%' }}>
            <h1 className="text-5xl font-extrabold tracking-tight text-blue-100 leading-10">encrypt my pack.</h1>
            <p style={{ 'maxWidth': '600px' }} className="text-clip text-base text-blue-100 font-regular pt-6">
                select the pack you want to encrypt and we'll encrypt it <b>inside your browser</b>.
                you'll receive the encrypted pack and the encryption key.
            </p>
            <div className="pt-5 flex flex-row gap-3">
                <input className="hidden" type="file" name="name" accept=".zip,.mcpack" ref={inputFile} onChange={onInputFileChange} />
                <button
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-blue-100 font-bold py-2 px-4 rounded-xl transition ease-in-out duration-150"
                    onClick={() => inputFile.current.click()}>
                    select a pack</button>
                <Link className="bg-blue-300 hover:bg-blue-200 text-blue-900 font-bold py-2 px-4 rounded-xl transition ease-in-out duration-150"
                    to="/decrypt">
                    decrypt</Link>
            </div>
        </div>
    )
}