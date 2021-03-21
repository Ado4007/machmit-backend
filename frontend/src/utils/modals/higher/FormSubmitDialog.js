import {Component} from 'react';
import React from 'react';
import request from "request-promise-native";
import YesNoDialog from "../YesNoDialog";
import LoadingModal from "../LoadingModal";
import FailedDialog from "../FailedDialog";
import SuccessDialog from "../SuccessDialog";
import FormDialog from "../FormDialog";
import Alert from 'react-bootstrap/lib/Alert';

class FormSubmitDialog extends Component {
    constructor(props) {
        /*
            Props:
                - access_code
                - logout
                - url

                - formDialogTitle
                - formDialogButton

                - inputs

                - sendParams

                - onSuccess

                - dialogRef

                - onSubmit => should return params that should be sent to the server along with access_code
        */
        super(props);

        if(this.props.dialogRef!=null) this.props.dialogRef({
            open: this.open.bind(this),
            close: this.close.bind(this)
        });

        this.state = {
            open: false,
            loading: null,
            success: null,
            failed: false
        };

    }

    close() {
        console.log("Close called");
        this.setState({
            open: false,
            loading: null,
            success: null,
            failed: false
        })
    }

    open() {
        console.log("Open called");
        this.setState({
            open: true,
            loading: null,
            success: null,
            failed: false
        })
    }

    async submit(object) {

        const obj = {};

        for(let param in object) {
            obj[param] = object[param];
        }
        obj["access_code"] = this.props.access_code;

        console.log("Sending request with body: ",obj);

        this.setState({
            loading: true,
            failed: null,
            success: null
        });

        const options = {
            method: 'POST',
            uri: this.props.url,
            body: obj,
            json: true,
            resolveWithFullResponse: true,
            simple: false
        };

        const response = await request(options);

        if(response.statusCode===200) {
            this.setState({
                success: response.body.msg,
                loading: false
            });
            if(this.props.onSuccess!=null) this.props.onSuccess(obj, response.body);
            return;
        }

        if(response.statusCode===404) {
            this.props.logout();
            return;
        }

        this.setState({
            failed: response.body.msg,
            loading: false
        });

    }

    render() {
        return (
            <div>
                <FormDialog open={this.state.open}
                            titleText={this.props.formDialogTitle}
                            submitText={this.props.formDialogButton}
                            notification={this.state.failed ? (<Alert bsStyle="danger">{this.state.failed}</Alert>) : this.state.success ? (<Alert bsStyle="success">{this.state.success}</Alert>) : ""}
                            inputs={this.props.inputs}
                            onClose={() => {
                                this.setState({
                                    open: false,
                                    failed: false,
                                    loading: false,
                                    success: false
                                });
                            }}
                            onSubmit={(obj) => {
                                const toSend = this.props.onSubmit(obj);
                                this.submit.bind(this)(toSend);
                            }}
                            loading={this.state.loading}
                            />
            </div>
        );
    }
}

export default FormSubmitDialog;