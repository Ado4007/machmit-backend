import {Component} from 'react';
import React from 'react';
import Modal from "react-responsive-modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form";
import ValidatedFormComponent from "../ValidatedFormComponent";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class FormDialog extends Component {
    constructor(props) {
        /*
            props:
                - titleText
                - submitText
                - notification

                - inputs (array of objects for ValidatedFormComponent)

                - open

                - onClose
                - onSubmit

                - loading

        */
        super(props);
    }

    submit() {

        const obj = {};

        for(let property in this.inputRefs) {
            if(this.inputRefs.hasOwnProperty(property)) {
                const inputRef = this.inputRefs[property];
                if(!inputRef.validated()) return;
                obj[property] = inputRef.value;
            }
        }

        this.props.onSubmit(obj);

    }
    
    render() {

        this.inputRefs = {};
        this.renderInputs = [];

        for(let input of this.props.inputs) {
            if(input!=null) {
                if(React.isValidElement(input)) {
                    this.renderInputs.push(input);
                    continue;
                }
                if(typeof input === "object") this.renderInputs.push((
                    <ValidatedFormComponent key={input.name}
                                            onValidate={input.onValidate}
                                            inputRef={(ref) => {
                                                if(input.inputRef!=null) input.inputRef(ref);
                                                this.inputRefs[input.name] = ref;
                                            }}
                                            onChange={input.onChange}
                                            bsSize={input.bsSize}
                                            value={input.value}
                                            disableFeedback={input.disableFeedback}
                                            name={input.name}
                                            type={input.type}
                                            placeholder={input.placeholder}
                                            value_key={input.value_key}
                                            display_name_key={input.display_name_key}
                                            options={input.options}
                                            emptyAllowed={input.emptyAllowed}
                                            min={input.min}
                                            max={input.max}
                                            step={input.step}
                                            decimal={input.decimal}/>
                ));
            }
        }

        return (
            <Modal open={this.props.open} onClose={this.props.onClose} styles={{
                modal: {
                    minWidth: '200px',
                    width: this.props.width ? this.props.width+"px" : '400px'
                }
            }} >
                <h2>{this.props.titleText}</h2>

                {this.props.notification}

                <Form horizontal>

                    {this.renderInputs}

                    <Col sm={4}/>
                    <Col sm={4} componentClass={Button} className="btn-primary"
                         bsStyle="primary"
                         disabled={this.props.loading}
                         onClick={this.submit.bind(this)}>
                        {this.props.submitText}
                    </Col>
                    <Col sm={4}/>
                </Form>

                {this.props.loading ? (<Col sm={12}><br/><ProgressBar  active now={100}/></Col>) : ""}

            </Modal>
        );
    }
}

export default FormDialog;