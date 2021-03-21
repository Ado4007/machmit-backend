import {Component} from "react/cjs/react.production.min";
import request from "request-promise-native";
import Button from "react-bootstrap/Button";
import React from "react";
import Card from "react-bootstrap/Card";
import Comment from "../components/Comment";
import VoteModal from "../modals/VoteModal";
import Spinner from "react-bootstrap/Spinner";

const GET_PROJECT = "https://vmi254279.contaboserver.net:5000/projects/";

const statusURL = 'https://api.blockcypher.com/v1/ltc/main/addrs';

class Project extends Component {

    async getProject() {
        let options = {
            method: 'GET',
            uri: GET_PROJECT+this.props.id,
            json: true,
            resolveWithFullResponse: true,
            simple: false
        };
        let response = await request(options);
        if(response.statusCode===200) {

            const project = response.body.project;

            options = {
                method: 'GET',
                uri: statusURL+"/"+project.litecoin_address+"/balance",
                json: true,
                resolveWithFullResponse: true,
                simple: false
            };

            response = await request(options);

            if(response.statusCode===200) {
                project.votes = response.body.final_balance/1000;
                this.setState({
                    votes: project.votes,
                    comments: project.comments,
                    longDescription: project.long_description,
                    description: project.description,
                    image: project.image,
                    budget: project.budget,
                    user: project.user,
                    location: project.location
                });
            }
        } else {
            console.log("Err: ", response.body);
        }
    }


    /*
        Props:
            - name
            - id
            - votes
            - givenVotes
            - remainingVotes
            - vote(amount)
            - hasPrivKey
     */
    constructor(props) {
        super(props);
        this.state = {
            longDescription: null,
            comments: null,
            voteOpen: false
        }
    }

    componentDidMount() {
        //Fetch project
        this.getProject();
    }

    render() {

        const commentRender = [];

        if(this.state.comments!=null) {
            for(let comment of this.state.comments) {
                commentRender.push((
                    <Comment
                        author={comment.name}
                        text={comment.text}
                    />
                ));
            }
        }

        return (
            <div>
                <VoteModal
                    name={this.props.name}
                    open={this.state.voteOpen}
                    onClose={() => {
                        this.setState({
                            voteOpen: false
                        });
                    }}
                    givenVotes={this.props.givenVotes}
                    remainingVotes={this.props.remainingVotes}
                    vote={async (arg) => {
                        this.setState({
                            loading: true
                        });
                        await this.props.vote(arg);
                        console.log("Sending request");
                        this.getProject();
                        this.setState({
                            loading: false
                        });
                    }}
                />

                <div className={"banner"}>
                    <img className="bannerImg" style={{width: "612px"}} src={this.state.image}/>
                    <h2 className="text-white projectMainTitle">{this.props.name}</h2>

                    <div className="align-middle">
                        {this.state.loading ? (<Spinner className="align-middle" variant="light" animation="border" />) : ""} <span className="projectLikeCount align-middle">{this.state.votes}</span> <img className="projectLikeImg align-middle" src="/LikeBig.png"/>
                    </div>

                    <Button className="bannerButton" style={{marginTop: "45px", marginBottom: "19px"}} disabled={!this.props.hasPrivKey} variant={"danger"} onClick={() => {
                        this.setState({
                            voteOpen: true
                        });
                    }}>Vote</Button>

                    <p className="bannerVoting"><b>Your voting:</b> {this.props.remainingVotes} / {this.props.remainingVotes+this.props.givenVotes} votes remaining</p>
                </div>

                <div className="projectDescription">
                    <div>
                        <div className="projectDescPane">
                            <img src="/EuroCircle.png"/><span className="projectData">{this.state.budget==null ? "" :  this.state.budget+" €"}</span>
                        </div>
                        <div className="projectDescPane">
                            <img src="/Environment.png"/><span className="projectData">{this.state.location}</span>
                        </div>
                        <div className="projectDescPane">
                            <img src="/User.png"/><span className="projectData">{this.state.user}</span>
                        </div>
                    </div>

                    <h2 className="projectDescHeader">DESCRIPTION</h2>
                    <span className="projectShortDescription">{this.state.description}</span>
                    <p className="projectLongDescription">{this.state.longDescription}</p>
                </div>

                <div className="projectDescription commentBg">
                    <div className="commentsTopPane">
                        <Button variant={"info"} className="konovaBtn float-right px-5" onClick={() => {
                            if(this.props.onShowMore!=null) {
                                this.props.onShowMore(this.props.id);
                            }
                        }}>Add comment</Button>
                        <h2 className="commentsHeader">COMMENTS</h2>
                    </div>

                    <div>
                        {commentRender}
                    </div>
                </div>
            </div>
        );
    }

}

export default Project;