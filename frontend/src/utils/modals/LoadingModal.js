import {Component} from 'react';
import React from 'react';

import Modal from 'react-responsive-modal';
import ProgressBar from 'react-bootstrap/ProgressBar';

class LoadingModal extends Component {
    constructor(props) {
        /*
            Props:
             - open
             - title
             - text
        */
        super(props);
    }
    
    render() {
        return (
            <Modal open={this.props.open}
                   styles={{
                       modal: {
                           minWidth: '200px',
                           width: '400px'
                       }
                   }}
                   showCloseIcon={false}
                   onClose={()=>{}}>
                <h2>{this.props.title ? this.props.title : "Loading..."}</h2>
                {this.props.text ? (<p>{this.props.text}</p>) : ""}
                <ProgressBar  active now={100}/>
            </Modal>
        );
    }
}

export default LoadingModal;