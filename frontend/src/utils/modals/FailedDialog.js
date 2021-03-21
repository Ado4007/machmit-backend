import {Component} from 'react';
import React from 'react';
import Modal from "react-responsive-modal";
import Button from "react-bootstrap/Button";

class FailedDialog extends Component {
    constructor(props) {
        /*
            props:
                - open
                - onClose
                - title
                - text
        */
        super(props);
    }

    render() {
        return (
            <Modal open={this.props.open} onClose={this.props.onClose} styles={{
                modal: {
                    minWidth: '200px',
                    width: '400px'
                }
            }} >
                <h2><i className="fa fa-times-circle text-danger"/> {this.props.title}</h2>
                <p>{this.props.text}</p>
                <Button bsStyle="danger" onClick={this.props.onClose}>
                    OK
                </Button>
            </Modal>
        );
    }
}

export default FailedDialog;