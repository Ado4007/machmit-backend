import {Component} from "react/cjs/react.production.min";
import Col from "react-bootstrap/Col";
import React from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import ScanModal from "../modals/ScanModal";

class ScanQRView extends Component {

    /*
        Props:
            - setPrivKey
     */
    constructor(props) {
        super(props);
        this.state = {
            dialogOpened: false
        }
    }

    render() {
        return (
            <div id="myVoting">

                <ScanModal
                    open={this.state.dialogOpened}
                    onClose={() => {
                        this.setState({
                            dialogOpened: false
                        });
                    }}
                    onScan={(scanned) => {
                        this.props.setPrivKey(scanned);
                    }}
                />

                <h2 className="mainHeader">My Voting</h2>

                <p className="accSubtitle mt-3">You have to authenticate before you can vote. We sent all our citizens a QR code by mail. Continue by scanning this code with your device.</p>

                <Button variant={"info"} className={"konovaBtn mt-3 px-5"}onClick={() => {
                    this.setState({
                        dialogOpened: true
                    });
                }}>Scan QR</Button><Button variant={"light"} className="cancelBtn px-5 mt-3 ml-3">How to vote</Button>
            </div>
        );
    }
}

export default ScanQRView;