import {Component} from "react/cjs/react.production.min";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import React from "react";

class Navbar extends Component {
    render() {
        return (
            <div>
                <a href="/" className="float-left" style={{
                    height: "72px"
                }}>
                    <img src={"https://www.stadt.sg.ch/apps/apps/stsg/clientlibs/stsgLibs/images/design/stsg/logo-stsg.png"} style={{
                        height: "72px",
                        padding: "16px"
                    }}/>
                </a>
                <Nav variant="pills" className="justify-content-end" defaultActiveKey="/home" style={{
                    padding: "16px"
                }}>
                    <Nav.Item className="float-right">
                        <Nav.Link className={"sg-navbar-link colorBlack"}>Projects</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="float-right">
                        <Nav.Link className={"sg-navbar-link colorBlack"}>Rules for Submission</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="float-right">
                        <Nav.Link className={"sg-navbar-link colorBlack"}>FAQ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="float-right">
                        <Button variant={"info"} className={"sg-navbar-link konovaBtn"} style={{
                            width: "200px"
                        }}>
                            Submit project
                        </Button>
                    </Nav.Item>
                </Nav>
            </div>
        );
    }
}

export default Navbar;