import {Component} from 'react';
import React from 'react';
import YesNoDialog from "../YesNoDialog";
import LoadingModal from "../LoadingModal";
import FailedDialog from "../FailedDialog";
import SuccessDialog from "../SuccessDialog";
import request from "request-promise-native";

class DeleteDialog extends Component {
    constructor(props) {
        /*
            Props:
                - access_code
                - logout
                - url

                - questionTitle
                - questionText

                - successTitle
                - successText

                - failedTitle
                - failedText

                - loadingTitle

                - sendParams

                - onSuccess

                - dialogRef
        */
        super(props);

        if(this.props.dialogRef!=null) this.props.dialogRef({
            open: this.open.bind(this)
        });

        this.state = {
            object: null,
            open: false,
            deleting: false,
            success: false,
            failed: false
        };

    }

    open(object) {
        console.log("Open called: ",object);
        this.setState({
            object: object,
            open: true,
            deleting: false,
            success: false,
            failed: false
        })
    }

    async submit(object) {

        const obj = {};

        for(let param of this.props.sendParams) {
            obj[param] = object[param];
        }
        obj["access_code"] = this.props.access_code;

        const options = {
            method: 'POST',
            uri: this.props.url,
            body: obj,
            json: true,
            resolveWithFullResponse: true,
            simple: false
        };

        const response = await request(options);

        console.log("DeleteDialog, response body",response.body);

        if(response.statusCode===200) {
            this.setState({
                success: true,
                deleting: false
            });
            if(this.props.onSuccess!=null) this.props.onSuccess(object);
            return;
        }

        if(response.statusCode===404) {
            this.props.logout();
            return;
        }

        this.setState({
            failed: true,
            deleting: false
        });

    }

    render() {
        return (
            <div>
                <YesNoDialog open={this.state.open}
                             title={this.props.questionTitle}
                             text={this.props.questionText}
                             onYes={() => {
                                 this.submit.bind(this)(this.state.object);
                                 this.setState({
                                     open: false,
                                     object: null,
                                     deleting: true
                                 });
                             }}
                             onNo={() => {
                                 this.setState({
                                     open: false,
                                     object: null
                                 });
                             }}
                />
                <LoadingModal open={this.state.deleting}
                              title={this.props.loadingTitle}
                />
                <FailedDialog open={this.state.failed}
                              onClose={() => this.setState({failed:false})}
                              title={this.props.failedTitle}
                              text={this.props.failedText}/>
                <SuccessDialog open={this.state.success}
                               onClose={() => this.setState({success:false})}
                               title={this.props.successTitle}
                               text={this.props.successText}/>
            </div>
        );
    }
}

export default DeleteDialog;