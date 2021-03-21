import {Component} from "react/cjs/react.production.min";
import Banner from "../components/Banner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import ProjectCard from "../components/ProjectCard";
import ProfileView from "../components/ProfileView";
import ScanQRView from "../components/ScanQRView";

class Gallery extends Component {

    /*
        Props:
            - givenVotes
            - remainingVotes
            - projects
            - openProject
     */
    constructor(props) {
        super(props);

    }


    render() {

        const projectList = [];

        if(this.props.projects!=null) {
            for(let project of this.props.projects) {
                projectList.push((
                    <ProjectCard
                        key={"Project"+project.id}
                        id={project.id}
                        name={project.name}
                        description={project.description}
                        litecoin_address={project.litecoin_address}
                        image={project.image}
                        votes={project.votes}
                        onShowMore={this.props.openProject}
                    />
                ));
            }
        }

        return (
            <div>
                <Banner/>

                <div className="pageWrapper">

                    <Row>
                        <Col sm={4}>
                            {this.props.hasPrivKey ? (
                                <ProfileView
                                    givenVotes={this.props.givenVotes}
                                    remainingVotes={this.props.remainingVotes}
                                />
                            ) : (
                                <ScanQRView
                                    setPrivKey={this.props.setPrivKey}
                                />
                            )}
                        </Col>

                        <Col sm={8}>
                            <div id="votingProgress">
                                <h2 className="mainHeader">Voting progress</h2>
                                <div>
                                    <Row>
                                        <Col sm={3}>
                                            <div className="votingProgressSmall">
                                                <p className="votingTitle">22</p>
                                                <p className="votingSubtitle">Projects</p>
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="votingProgressBig">
                                                <p className="votingTitle">1 400 000 €</p>
                                                <p className="votingSubtitle">In the project budget</p>
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className="votingProgressSmall">
                                                <p className="votingTitle">1200</p>
                                                <p className="votingSubtitle">Citizens voted</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <h2 className="mainHeader" style={{
                        marginBottom: "26px"
                    }}>Projects</h2>
                    <Row className="px-1">
                        {projectList}
                    </Row>
                </div>
            </div>
        );
    }
}

export default Gallery;