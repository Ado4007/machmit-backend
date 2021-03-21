import {Component} from 'react';
import React from 'react';
import Modal from "react-responsive-modal";
import Button from "react-bootstrap/Button";

class YesNoDialog extends Component {
    constructor(props) {
        /*
            props:
                - open
                - title
                - text
                - onYes
                - onNo
        */
        super(props);
    }
    
    render() {
        return (
            <Modal open={this.props.open} onClose={this.props.onNo} styles={{
                modal: {
                    minWidth: '200px',
                    width: '400px'
                }
            }} >
                <h2>{this.props.title}</h2>
                {typeof this.props.text === "string" ? (<p>{this.props.text}</p>) : this.props.text}

                <Button bsStyle="success" onClick={this.props.onYes}>
                    Yes
                </Button>
                <Button className="ml-2" bsStyle="danger" onClick={this.props.onNo}>
                    No
                </Button>
            </Modal>
        );
    }
}

export default YesNoDialog;