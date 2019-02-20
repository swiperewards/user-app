//react-redux
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

//redux-form
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';


//material-ui
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

//Components
import InputField from '../../components/inputField'
import RaiseButton from '../../components/raiseButton'
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader';

//Validation
import {required, email} from '../../utilities/validation'

//Actions
import { forgotPassword } from '../../actions/accountAction'

import {appName} from '../../app.config'

let errorMessage

const styles = {
    signUpTxt :{
        color:'#424242',
        textDecorator:'none',
        fontSize:'14px',
        fontWeight:'normal'
    },
    signupLink:{
        textDecoration: 'none', 
        color:'#3895D8'
    },
    accountTxt:{
        marginTop:'10px',
        textAlign:'center'
    }
};

class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            message:'',
        }
    }

    componentWillMount() {
        errorMessage="";
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
            if (nextProps.forgotPasswordResponse){
                if (nextProps.forgotPasswordResponse.status === 200) {
                    errorMessage = undefined
                    this.setState({showLoader:false})
                    this.props.history.push({pathname:'/resetPasswordMail',state: { detail: nextProps.forgotPasswordResponse.responseData.emailId }})
                }
                else{
                    errorMessage =
                        <div 
                            className="errorDiv"
                        >{nextProps.forgotPasswordResponse.message}</div>
                        this.setState({showLoader:false})
                }
            }
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
    };

    onSubmit(values) {
        errorMessage = ""

        this.setState({showLoader:true})
        this.props.forgotPassword(values.email);
    }

    render() {

        const {  dialogOpen } = this.state;

        const actions = [
            <Button key="ok" onClick={this.handleClose} color="primary" autoFocus>
                OK
            </Button>
        ];

        return (
            
            <div>
                <Loader status={this.state.showLoader} />
                <DialogBox 
                    displayDialogBox={dialogOpen} 
                    message={this.state.message} 
                    actions={actions} 
                />
                <div className="pageContainer">
                    <Paper className="pagePaper">
                        <div className="logo">
                            <img src="../images/logo.png" alt="Logo" />
                        </div>
                        <div className="formContent">
                            <form size='large' className="form-horizontal" onSubmit={this.props.handleSubmit((event) => this.onSubmit(event))}>
                                <div className="titleLabel">Forgot your Password?
                                </div>
                                <div className="formGroup">
                                    <label className="controlLabel">Don't worry. Resetting your password is easy, just enter the email registered with {appName}.</label>
                                    <Field name="email" fullWidth={true} component={InputField} validate={[required, email]} />
                                </div>
                                <div style={{paddingTop:'10px', textAlign:'center'}}> 
                                    <RaiseButton type="submit" style={{display:'inline-block' , float:'none'}} variant="contained" color="primary" label="SEND"/>
                                </div>        
                                <div style={styles.accountTxt}>
                                        <span className="controlLabel">Don’t have an account?</span><span style={styles.signUpTxt}><Link to='/register' style={styles.signupLink}> Register Now</Link>
                                        </span>
                                </div>
                            </form>
                        </div>            
                        
                    </Paper>
                    <div>
                        {errorMessage}
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {

    return {
            forgotPasswordResponse: state.account.forgotPassword,
        }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ forgotPassword }, dispatch)
}

export default reduxForm({
    form: 'FrmForgotPassword',
}
)(connect(mapStateToProps, mapDispatchToProps)(ForgotPassword))
