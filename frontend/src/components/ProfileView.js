import {Component} from "react/cjs/react.production.min";
import Col from "react-bootstrap/Col";
import React from "react";

class ProfileView extends Component {

    /*
        Props:
            - givenVotes
            - remainingVotes
     */
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div id="myVoting">
                <h2 className="mainHeader">My Voting</h2>

                <p className="accSubtitle">You have 10 votes in total that you can distribute to several projects you like.</p>

                <img className="accPic float-left" src="/AccPhoto.png"/>

                <div className="profilePane">
                    <div className="pt-2">
                        <div className="align-middle likesGivenPane">
                            <span className="likeCount align-middle" style={{color: "#055D2D"}}>{this.props.givenVotes}</span> <img className="likeImgSmall align-middle" src="/LikeGreen.png"/>
                            <p className="givenText">given</p>
                        </div>
                        <div className="align-middle likesRemainingPane">
                            <span className="likeCount align-middle">{this.props.remainingVotes}</span> <img className="likeImgSmall align-middle" src="/Like.png"/>
                            <p className="remainingText">remaining</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileView;