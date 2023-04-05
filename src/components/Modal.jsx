import React, { createRef } from 'react'
import * as ReactDOM from 'react-dom';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.dialogRef = createRef();
    }

    handleClickOutside(event) {
        const modalBox = event.target;
        if (!this.dialogRef?.current?.contains(modalBox) && this.props.isOpen) {
            this.props.onClose(false);
        }
    }

    handleKeydown(ev) {
        if (ev.key === "Escape") {
            this.props.onClose(false);
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            this.dialogRef?.current?.focus();
        }
    }

    render() {
        let portalRoot = document.getElementById("modal");
        if (!portalRoot) {
            portalRoot = document.createElement("div");
            portalRoot.setAttribute("id", "modal");
            document.body.appendChild(portalRoot);
        }
        const displayClass = this.props.isOpen ? "block" : "hidden";

        return ReactDOM.createPortal(
            <div
                id="modal-comp"
                className={displayClass}
                onKeyDown={(e) => this.handleKeydown(e)}
                onClick={(e) => this.handleClickOutside(e)}
            >
                <div
                    className="bg-gray-700 text-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 rounded-lg shadow-md p-9 outline-none"
                    ref={this.dialogRef}
                    tabIndex={1}
                    onKeyDown={(e) => this.handleKeydown(e)}
                >
                    {this.props.children}
                </div>
            </div>,
            portalRoot
        );
    }
}