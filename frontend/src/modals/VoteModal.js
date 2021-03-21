import {Component} from "react/cjs/react.production.min";
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class ProjectCard extends Component {

    /*
        Props:
            - name
            - givenVotes
            - remainingVotes
            - open
            - vote(amount)
            - onClose()
     */
    constructor(props) {
        super(props);
        this.state = {
            count: "1"
        }
    }


    render() {
        return (
            <Modal show={this.props.open} size="lg" onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <div className="p-4">
                        <h4 className="projectVoteSubtitle">Project you are voting for</h4>
                        <h2 className="projectVoteTitle">{this.props.name}</h2>
                        <p className="projectVoteQuestion">How many votes would you like to give to this project?</p>
                        <p className="projectVoteInfo">You have {this.props.givenVotes+this.props.remainingVotes} votes in total that you can distribute between the projects you want to support. You have {this.props.remainingVotes} out of {this.props.givenVotes+this.props.remainingVotes} votes remaining.</p>
                        <Form.Group controlId="formBasicNumber">
                            <Form.Control className="voteCountInput" type="number" value={this.state.count} min={1} max={this.props.remainingVotes} onChange={(val) => {
                                console.log(val.target.value);
                                this.setState({
                                    count: val.target.value
                                });
                            }} placeholder="Votes" />
                        </Form.Group>
                        <Button variant={"info"} className="konovaBtn px-5" onClick={() => {
                            if(this.props.vote!=null) {
                                this.props.vote(parseInt(this.state.count));
                            }
                            if(this.props.onClose!=null) {
                                this.props.onClose();
                            }
                        }}>Submit votes</Button><Button variant={"light"} className="cancelBtn px-5 ml-3" onClick={() => {
                            if(this.props.onClose!=null) {
                                this.props.onClose();
                            }
                        }}>Cancel</Button>
                    </div>
                </Modal.Header>
            </Modal>
        );
    }
}

export default ProjectCard;