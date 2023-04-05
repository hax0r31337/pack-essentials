import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal'

export default function EncryptPage() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isInputMode, setInputMode] = useState(false);
    const [resourcePack, setResourcePack] = useState(null);
    const [resourcePackKey, setResourcePackKey] = useState(new Uint8Array());
    const [resourcePackKeyStr, setResourcePackKeyStr] = useState("");
    const inputFile = useRef(null)
    const onInputFileChange = (e) => {
        let fileReader = new FileReader()
        fileReader.onload = (event) => {
            setResourcePack(event.target)
            setModalOpen(true)
        }
        fileReader.readAsArrayBuffer(e.target.files[0])
    }
    const inputKeyFile = useRef(null)
    const onInputKeyFileChange = (e) => {
        if (resourcePack == null) throw "resource pack failed to load";
        let fileReader = new FileReader()
        fileReader.readAsArrayBuffer(e.target.files[0])
        fileReader.onload = (event) => {
            setResourcePackKey(new Uint8Array(event.target.result))
        }
        setResourcePackKey(fileReader)
    }
    const doDecrypt = () => {
        if (resourcePack == null) throw "resource pack failed to load";
        if (resourcePackKey == null) {
            setResourcePackKey(new TextEncoder().encode(atob(resourcePackKeyStr)))
        }
        let pack = new Uint8Array(resourcePack.result)
        decryptPack(pack, pack.length * pack.BYTES_PER_ELEMENT,
            resourcePackKey, resourcePackKey.length * resourcePackKey.BYTES_PER_ELEMENT,
            pack.filename)
        setModalOpen(false)
    }

    return (
        <div className="bg-gray-800 flex flex-col justify-center h-full" style={{ 'paddingLeft': '5%', 'paddingRight': '5%' }}>
            <h1 className="text-5xl font-extrabold tracking-tight text-blue-100 leading-10">decrypt my pack.</h1>
            <p style={{ 'maxWidth': '600px' }} className="text-clip text-base text-blue-100 font-regular pt-6">
                select the pack you want to decrypt and we'll decrypt it <b>inside your browser</b>.
                you'll receive the decrypted pack.
            </p>
            <div className="pt-5 flex flex-row gap-3">
                <input className="hidden" type="file" name="name" accept=".zip,.mcpack" ref={inputFile} onChange={onInputFileChange} />
                <button
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-blue-100 font-bold py-2 px-4 rounded-xl transition ease-in-out duration-150"
                    onClick={() => inputFile.current.click()}>
                    select a pack</button>
                <Link className="bg-blue-300 hover:bg-blue-200 text-blue-900 font-bold py-2 px-4 rounded-xl transition ease-in-out duration-150"
                    to="/encrypt">
                    encrypt</Link>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex justify-between items-center">
                    <div className="font-semibold">Select the decryption key</div>
                    <Close className="w-5 cursor-pointer" onClick={() => setModalOpen(false)} />
                </div>
                <div className="pt-3">
                    <input type="file" style={{ 'display': isInputMode ? 'none' : 'block' }}
                        ref={inputKeyFile} onChange={onInputKeyFileChange} />

                    <input className="bg-gray-700 rounded-lg border border-gray-300 px-4 py-2" style={{ 'display': isInputMode ? 'block' : 'none' }}
                        type="text" value={resourcePackKeyStr} onChange={(e) => setResourcePackKeyStr(e.target.value)} />

                    <div className="pt-3 flex flex-row gap-3 float-right">
                        <button className="bg-blue-300 hover:bg-blue-200 text-blue-900 font-bold py-2 px-4 rounded-xl transition ease-in-out duration-150"
                            onClick={() => setInputMode(!isInputMode)}>
                            {isInputMode ? "select" : "input"}</button>
                        <button
                            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-blue-100 font-bold py-2 px-4 rounded-xl transition ease-in-out duration-150"
                            onClick={doDecrypt}>
                            proceed</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

function Close(props) {
    return (
        <svg viewBox="0 0 24 24" {...props}>
            <path fillRule="evenodd" fill="white" d="M13.414 12l5.657-5.657a.999.999 0 10-1.414-1.414L12 10.586 6.343 4.929a1 1 0 00-1.414 1.414L10.586 12 4.93 17.657a1 1 0 001.414 1.414L12 13.414l5.657 5.657a.997.997 0 001.414 0 .999.999 0 000-1.414L13.414 12z" />
        </svg>
    );
}