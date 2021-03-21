import {Component} from "react/cjs/react.production.min";
import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class ProjectCard extends Component {

    /*
        Props:
            - id
            - name
            - description
            - litecoin_address
            - image
            - votes
     */
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <Col sm={3}>
                <Card>
                    <Card.Body>
                        <Card.Title className="panelTitle" style={{
                        }}>{this.props.name}</Card.Title>
                        <Card.Text>
                            <p className="panelSubtitle">{this.props.description}</p>
                        </Card.Text>
                        <Card.Img className="panelImg" src={this.props.image}/>
                        <div className="likePane justify-content-center align-self-center">
                            <img className="likeImg align-middle" src="/Like.png"/>
                            <span className="likeCount align-middle">{this.props.votes}</span>
                        </div>

                        <Button variant={"info"} className="konovaBtn" style={{width: "100%"}} onClick={() => {
                            if(this.props.onShowMore!=null) {
                                this.props.onShowMore({
                                    id: this.props.id,
                                    name: this.props.name,
                                    votes: this.props.votes,
                                    litecoin_address: this.props.litecoin_address
                                });
                            }
                        }}>Project details</Button>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

}

export default ProjectCard;