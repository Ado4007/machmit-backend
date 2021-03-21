import {Component} from "react/cjs/react.production.min";
import Button from "react-bootstrap/Button";
import React from "react";

class Navbar extends Component {
    render() {
        return (
                <div className={"banner"}>
                    <img className="bannerImg" src="/Banner_img.png"/>
                    <h3 className="text-white bannerSubtitle">Participatory budget program 2022</h3>
                    <h2 className="text-white bannerMainTitle">Ideas for better living</h2>
                    <p className="text-white bannerDescription">Join us on our journey to make St.Gallen the best city to live in. Vote for projects of your fellow citizens or submit your own project.</p>
                    <Button className="bannerButton" variant={"danger"}>How it works?</Button>
                </div>
        );
    }
}

export default Navbar;