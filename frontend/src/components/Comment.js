import {Component} from "react/cjs/react.production.min";
import React from "react";

class Comment extends Component {

    /*
        Props:
            - author
            - text
     */
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="p-4 commentPane">
                <div className="commentHead">
                    <img src="/Message.png"/><span className="commentAuthor">{this.props.author}</span>
                </div>
                <p>{this.props.text}</p>
            </div>
        );
    }
}

export default Comment;