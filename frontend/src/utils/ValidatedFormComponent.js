import {Component} from 'react';
import React from 'react';
import FormGroup from "react-bootstrap/FormGroup";
import Col from "react-bootstrap/Col";
import ControlLabel from "react-bootstrap/ControlLabel";
import FormControl from "react-bootstrap/FormControl";
import HelpBlock from "react-bootstrap/HelpBlock";
import Switch from "react-switch";

class ValidatedFormComponent extends Component {

    constructor(props) {
        /*
            Props:
             - onValidate (function(input))
             - inputRef (function(ref)) - ref contains .validated() function to determine if input is validated OK
             - onChange (function(value))

             - bsSize
             - validationState
             - validationMessage

             - value
             - disableFeedback

             - name
             - type (text,number,boolean,password,select,textarea,file,checkbox)
             - placeholder

             #IF type=='select'
                - value_key
                - display_name_key
                - disabled_key
                - options
                  - value
                  - display_name
             #ENDIF

             #IF type=='checkbox'
                - indeterminate
             #ENDIF

             #IF type=='number'
                - emptyAllowed
                - min
                - max
                - step
                - decimal
             #ENDIF

         */
        super(props);

        if(this.props.onValidate==null) {
            this.props.onValidate = function() {
                return null;
            }
        }

        if(this.props.type==='boolean') {
            this.state = {
                value: props.value==null ? 'false' : props.value,
                errMsg: null
            };
            if(this.props.inputRef!=null) {
                const ref = {
                    validated: this.validated.bind(this),
                    value: this.state.value
                }
                this.props.inputRef(ref);
            }
            return;
        }

        this.state = {
            value: props.value==null ? '' : props.value,
            errMsg: null
        };
    }

    validated() {
        if(this.props.type==='number') {
            const numValid = this.numberValidator(this.state.value);
            if(numValid!=null) {
                this.setState({
                    errMsg: numValid
                });
                return false;
            }
        }
        const errMsg = this.props.onValidate(this.state.value);
        this.setState({
            errMsg: errMsg
        })
        return errMsg==null;
    }

    numberValidator(value) {
        if(this.props.emptyAllowed && value==='') return null;
        if(value==='') return 'Value cannot be empty!';
        const val = this.props.decimal ? parseFloat(value) : parseInt(value);
        if(isNaN(val)) return 'Value is not a number!';
        if(this.props.min!=null && val<this.props.min) return 'Value cannot be lower than '+this.props.min+'!';
        if(this.props.max!=null && val>this.props.max) return 'Value cannot be higher than '+this.props.max+'!';
        return null;
    }

    componentDidMount() {
        if(this.inputRef!=null) {
            this.inputRef.indeterminate = this.props.indeterminate;
        }
    }

    componentDidUpdate() {
        if(this.inputRef!=null) {
            this.inputRef.indeterminate = this.props.indeterminate;
        }
    }

    render() {
        const errMsg = this.state.errMsg;
        const options = [];
        if(this.props.type==='select') {
            if(this.props.options!=null && this.props.options.length>0) {
                if (this.props.value != null) {
                    if (this.props.options.find(e => e[this.props.value_key] === this.props.value) == null) {
                        this.props.onChange(this.props.options[0][this.props.value_key]);
                    }
                } else {
                    if (this.state.value != null && this.props.options.find(e => e[this.props.value_key] === this.state.value) == null) {
                        this.state.value = this.props.options[0][this.props.value_key];
                    }
                }
            }
            let i = 0;
            if(this.props.options!=null && this.props.value_key!=null && this.props.display_name_key!=null) for(let opt of this.props.options) {
                options.push(
                    (
                        <option key={'key'+i} value={opt[this.props.value_key]} disabled={this.props.disabled_key==null ? false : opt[this.props.disabled_key]}>{opt[this.props.display_name_key]}</option>
                    )
                )
                i++;
            }
        }

        return (
            <FormGroup controlId={this.props.name} bsStyle={this.props.bsStyle} validationState={this.props.validationState==null ? errMsg==null ? null : 'error' : this.props.validationState}>
                {this.props.name!=null ? (
                    <Col componentClass={ControlLabel} sm={4}>
                        {this.props.name}
                    </Col>
                    ) : ''}

                <Col sm={this.props.name!=null ? 8 : 12} style={
                    this.props.name==null ? {
                        paddingRight: '0px',
                        paddingLeft: '0px'
                    } : {}
                }>
                    {
                        this.props.type==='checkbox' ?
                            (
                                <FormControl type="checkbox" bsSize={this.props.bsSize} bsStyle={this.props.bsStyle} checked={this.props.value!=null ? this.props.value : this.state.value} onChange={(evnt) => {
                                    const errMsg = this.props.onValidate(evnt.target.checked);
                                    this.setState({
                                        value: evnt.target.checked,
                                        errMsg: errMsg
                                    });
                                    if(this.props.onChange!=null) this.props.onChange(evnt.target.checked);
                                }} style={{
                                    height: "initial"
                                }} inputRef={ref => {
                                    this.inputRef = ref;
                                    if(ref==null || this.props.inputRef==null) return;
                                    ref.validated = this.validated.bind(this);
                                    this.props.inputRef(ref);
                                }} />
                            ) :
                        this.props.type==='text' ?
                            (
                                <FormControl type="text" bsSize={this.props.bsSize} bsStyle={this.props.bsStyle} value={this.props.value!=null ? this.props.value : this.state.value} onChange={(evnt) => {
                                    const errMsg = this.props.onValidate(evnt.target.value);
                                    this.setState({
                                        value: evnt.target.value,
                                        errMsg: errMsg
                                    });
                                    if(this.props.onChange!=null) this.props.onChange(evnt.target.value);
                                }} placeholder={this.props.placeholder} inputRef={ref => {
                                    if(ref==null || this.props.inputRef==null) return;
                                    ref.validated = this.validated.bind(this);
                                    this.props.inputRef(ref);
                                }} />
                            ) :
                        this.props.type==='file' ? (
                                <FormControl type="file" bsSize={this.props.bsSize} bsStyle={this.props.bsStyle} value={this.props.value!=null ? this.props.value : this.state.value} onChange={(evnt) => {
                                    const errMsg = this.props.onValidate(evnt.target.value);
                                    this.setState({
                                        value: evnt.target.value,
                                        errMsg: errMsg
                                    });
                                    if(this.props.onChange!=null) this.props.onChange(evnt.target.value);
                                }} placeholder={this.props.placeholder} inputRef={ref => {
                                    if(ref==null || this.props.inputRef==null) return;
                                    ref.validated = this.validated.bind(this);
                                    this.props.inputRef(ref);
                                }} />
                            ) :
                        this.props.type==='textarea' ? (
                                <FormControl componentClass="textarea" bsSize={this.props.bsSize} bsStyle={this.props.bsStyle} value={this.props.value!=null ? this.props.value : this.state.value} onChange={(evnt) => {
                                    const errMsg = this.props.onValidate(evnt.target.value);
                                    this.setState({
                                        value: evnt.target.value,
                                        errMsg: errMsg
                                    });
                                    if(this.props.onChange!=null) this.props.onChange(evnt.target.value);
                                }} placeholder={this.props.placeholder} inputRef={ref => {
                                    if(ref==null || this.props.inputRef==null) return;
                                    ref.validated = this.validated.bind(this);
                                    this.props.inputRef(ref);
                                }} />
                            ) :
                        this.props.type==='select' ?
                            (
                                <FormControl componentClass="select" bsSize={this.props.bsSize} bsStyle={this.props.bsStyle} value={this.props.value!=null ? this.props.value : this.state.value} onChange={(evnt) => {
                                    const errMsg = this.props.onValidate(evnt.target.value);
                                    this.setState({
                                        value: evnt.target.value,
                                        errMsg: errMsg
                                    });
                                    if(this.props.onChange!=null) this.props.onChange(evnt.target.value);
                                }} placeholder={this.props.placeholder} inputRef={ref => {
                                    if(ref==null || this.props.inputRef==null) return;
                                    ref.validated = this.validated.bind(this);
                                    this.props.inputRef(ref);
                                }} >
                                    {options}
                                </FormControl>
                            ) :
                        this.props.type==='password' ?
                            (
                                <FormControl type="password" bsSize={this.props.bsSize} bsStyle={this.props.bsStyle} value={this.props.value!=null ? this.props.value : this.state.value} onChange={(evnt) => {
                                    const errMsg = this.props.onValidate(evnt.target.value);
                                    this.setState({
                                        value: evnt.target.value,
                                        errMsg: errMsg
                                    });
                                    if(this.props.onChange!=null) this.props.onChange(evnt.target.value);
                                }} placeholder={this.props.placeholder} inputRef={ref => {
                                    if(ref==null || this.props.inputRef==null) return;
                                    ref.validated = this.validated.bind(this);
                                    this.props.inputRef(ref);
                                }} />
                            ) :
                        this.props.type==='number' ?
                            (
                                <FormControl type="number"
                                             bsSize={this.props.bsSize}
                                             bsStyle={this.props.bsStyle}
                                             value={this.props.value!=null ? (isNaN(this.props.value) ? "" : this.props.value) : this.state.value}
                                             min={isNaN(this.props.min) ? "" : this.props.min}
                                             max={isNaN(this.props.max) ? "" : this.props.max}
                                             step={isNaN(this.props.step) ? "" : this.props.step}
                                             onChange={(evnt) => {
                                                 const numValid = this.numberValidator(evnt.target.value);
                                                 if(numValid!=null) {
                                                     this.setState({
                                                         value: evnt.target.value,
                                                         errMsg: numValid
                                                     });
                                                     if(this.props.onChange!=null) this.props.onChange(evnt.target.value);
                                                     return;
                                                 }
                                                 const errMsg = this.props.onValidate(evnt.target.value);
                                                 this.setState({
                                                     value: evnt.target.value,
                                                     errMsg: errMsg
                                                 });
                                                 if(this.props.onChange!=null) this.props.onChange(evnt.target.value);
                                }} placeholder={this.props.placeholder} inputRef={ref => {
                                    if(ref==null || this.props.inputRef==null) return;
                                    ref.validated = this.validated.bind(this);
                                    this.props.inputRef(ref);
                                }} />
                            ) :
                        this.props.type==='boolean' ?
                            (
                                <Switch
                                    onChange={(checked) => {
                                        const value = checked ? 'true' : 'false';
                                        if(this.props.inputRef!=null) {
                                            const ref = {
                                                validated: this.validated.bind(this),
                                                value: value
                                            }
                                            this.props.inputRef(ref);
                                        }
                                        const errMsg = this.props.onValidate(value);
                                        this.setState({
                                            value: value,
                                            errMsg: errMsg
                                        })
                                        if(this.props.onChange!=null) this.props.onChange(value);
                                    }}
                                    checked={(this.props.value!=null ? this.props.value : this.state.value)==='true'}
                                    id={this.props.name}
                                />
                            ) : ''
                    }

                    {this.props.disableFeedback ? '' : (<FormControl.Feedback />)}

                    {(errMsg!=null || this.props.validationMessage!=null) ? (<HelpBlock>{this.props.validationMessage==null ? errMsg : this.props.validationMessage}</HelpBlock>) : ''}
                </Col>
            </FormGroup>
        );
    }
}

export default ValidatedFormComponent;