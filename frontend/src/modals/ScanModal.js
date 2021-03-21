import {Component} from "react/cjs/react.production.min";
import React from "react";
import Modal from "react-bootstrap/Modal";
import QrReader from "react-qr-reader";

class ScanModal extends Component {

    /*
        Props:
            - open
            - onClose()
            - onScan(qrCode)
     */
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Modal show={this.props.open} size="lg" onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <QrReader
                        delay={300}
                        onError={(err) => {
                            console.log(err);
                        }}
                        onScan={(str) => {
                            if(str!=null) {
                                console.log(str);
                                const url = new URL(str);
                                if(url.host==="machmit.stadt.sg.ch" && url.searchParams.has("wif")) {
                                    this.props.onScan(url.searchParams.get("wif"));
                                }
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                </Modal.Header>
            </Modal>
        );
    }
}

export default ScanModal;