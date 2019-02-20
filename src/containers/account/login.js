//react-redux
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

//redux-form
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';


//material-ui
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';

//Components
import InputField from '../../components/inputField'
import RaiseButton from '../../components/raiseButton'
import Loader from '../../components/loader'
import RenderCheckbox from '../../components/renderCheckbox';

//Validation
import {required} from '../../utilities/validation'

//Actions
import { validateUser, logout, clearValidateUserResponse } from '../../actions/accountAction';


const styles = {
    loginTxt:{
        fontFamily: 'open_sansbold',
        paddingBottom:'10px',
        fontSize: 17,
        marginTop:'0px',
        textAlign: 'left',
        textTransform:'uppercase'
    },
    forgotTxt :{
        color:'#424242',
        float:'right',
        fontStyle:'italic',
        textDecorator:'underline',
        fontSize:'14px',
        fontWeight:'normal'
    },
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
        float:'right',
        marginTop:'10px'
    }
};

let errorMessage

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showError: false
        }
    }

    componentWillMount() {

        errorMessage="";

        //This will be case for remember me option
        if(this.props.validateAction_Data){
            if(this.props.validateAction_Data.user){
                if(this.props.validateAction_Data.user.rememberme === true){
                    if (this.props.validateAction_Data.user.responseData.role === 'superadmin') {
                        this.props.history.push(`/superadmindashboard`);
                    }
                    else if(this.props.validateAction_Data.user.responseData.role === 'admin'){
                        this.props.history.push(`/admindashboard`);
                    }
                    else if(this.props.validateAction_Data.user.responseData.role === 'merchant'){
                        this.props.history.push(`/merchantdashboard`);
                    }
                }
                else{
                    //Not checked remember me option
                    localStorage.clear();
                    this.props.clearValidateUserResponse()
                    errorMessage="";
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
            if (nextProps.validateAction_Data){
                if (nextProps.validateAction_Data.user) {
                    if (nextProps.validateAction_Data.user.status === 200) {
                        if (nextProps.validateAction_Data.user.responseData.role === 'superadmin') {
                            this.props.history.push(`/superadmindashboard`);
                        }
                        else if(nextProps.validateAction_Data.user.responseData.role === 'admin'){
                            this.props.history.push(`/admindashboard`);
                        }
                        else if(nextProps.validateAction_Data.user.responseData.role === 'merchant'){
                            this.props.history.push(`/merchantdashboard`);
                        }
                        this.setState({showLoader:false})
                    }
                    else{
                        if(nextProps.validateAction_Data.user.status === 1002){
                            this.props.history.push({pathname:'/verificationPending',state: { detail: nextProps.validateAction_Data.user.responseData.email }})
                        }    

                        errorMessage =
                            <div 
                                className="errorDiv"
                            >{nextProps.validateAction_Data.user.message}</div>
                            this.setState({showLoader:false})

                    }
                }
            }
        }
    }

    onSubmit(values) {
        this.setState({showLoader:true})
        this.props.validateUser(values);
    }

    render() {

        return (
            <div>
                <Loader status={this.state.showLoader} />

                <div className="loginPageContainer">
                    <Paper className="pagePaper">
                        <div className="logo">
                            <img src="../images/logo.png" alt="Logo" />
                        </div>
                        <div className="formContent">
                            <form size='large' className="form-horizontal" onSubmit={this.props.handleSubmit((event) => this.onSubmit(event))}>
                                <div className="titleLabel">LOGIN
                                </div>
                                <div className="formGroup">
                                    <label className="controlLabel">Email Address</label>
                                    <Field name="username"  fullWidth={true} component={InputField} validate={required} />
                                </div>
                                <div className="formGroup">
                                    <label  className="controlLabel">Password</label>
                                    <Field name="password" myType="password" fullWidth={true} component={InputField} validate={required} />
                                </div>
                                <div className="checkbox">
                                <FormControlLabel
                                                    control={
                                                        <Field 
                                                            name="rememberMe" 
                                                            id="rememberMe" 
                                                            myStyle={styles} 
                                                            component={RenderCheckbox} />
                                                    }
                                                    label="Remember me"
                                />                 
                                    <Link style={styles.forgotTxt} to={'/resetPassword'}> Forgot Password?</Link> 	
                                </div>
                                <div style={{paddingTop:'10px'}}> 
                                    <RaiseButton type="submit"  style={{display:'inline-block' , float:'none'}} variant="contained" color="primary" label="SIGN IN"/>
                                    <div style={styles.accountTxt}>
                                        <span className="controlLabel">Don’t have an account? </span><span style={styles.signUpTxt}><Link to='/register' style={styles.signupLink}>Sign Up</Link>
                                        </span>
                                    </div>
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
            validateAction_Data: state.accountValidate,
            loadStatus: state.common.data
        }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ validateUser, logout, clearValidateUserResponse }, dispatch)
}

export default reduxForm({
    form: 'FrmLogin'
}
)(
    connect(mapStateToProps, mapDispatchToProps)(Login)
)
