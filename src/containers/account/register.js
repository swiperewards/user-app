//react-redux
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

//redux-form
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';


//material-ui
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

//Components
import InputField from '../../components/inputField';
import RaiseButton from '../../components/raiseButton';
import Recaptcha from 'react-grecaptcha';
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader';

//Validation
import {required, email, minimum8} from '../../utilities/validation'
import {recaptchaSiteKey, appName} from '../../app.config'

//Actions
import {registerUser, clearRegisterUserState} from '../../actions/accountAction'


let errorMessage
const validate = values => {
    const errors = {}

    if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Confirm password must be the same as password"
    }

    return errors;
}

var verifyCallback = function (response) {
    this.setState({ invalidRecaptcha: false, showError: false })
};

var expiredCallback = function (response) {
    this.setState({ invalidRecaptcha: true })
};

class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loadStatus: false,
            invalidRecaptcha: true,
            showError: false,
            dialogOpen: false,
            message:'',
        }
    }

    componentWillMount() {
        errorMessage="";
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
            if (nextProps.registerUserResponse){
                if (nextProps.registerUserResponse.status === 200) {
                    errorMessage = undefined
                    this.setState({showLoader:false})
                    if(this.props.userData){
                        if(this.props.userData.user){
                            if(this.props.userData.user.responseData.role !== 'merchant'){
                                this.props.dismissPopUp()
                            }
                        }
                        else{
                            this.props.history.push({pathname:'/accountActivate',state: { detail: nextProps.registerUserResponse.responseData.emailId }})
                        }
                    }                
                }
                else{
                    errorMessage =
                        <div 
                            className="errorDiv"
                        >{nextProps.registerUserResponse.message}</div>
                        this.setState({message: nextProps.registerUserResponse.message})
                        this.setState({ dialogOpen: true });
                        this.setState({showLoader:false})
                }

                this.props.clearRegisterUserState()
            }
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
    };

    onSubmit(values) {
        errorMessage = undefined

        if (this.state.invalidRecaptcha) {
            this.setState({ showError: true });
        } else {
            this.setState({showLoader:true})
            this.props.registerUser(values);
            this.setState({ showError: false });
        }
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
                                <div className="titleLabel">CREATE YOUR {appName} ACCOUNT
                                </div>
                                <div className="formGroup">
                                    <label className="controlLabel">Email Address</label>
                                    <Field name="emailId" fullWidth={true} component={InputField} validate={[required, email]} />
                                </div>
                                <div className="formGroup">
                                    <label className="controlLabel">Full Name</label>
                                    <Field name="fullName" fullWidth={true} component={InputField} validate={required} />
                                </div>
                                <div className="formGroup">
                                    <label className="controlLabel">Password</label>
                                    <Field name="password" myType="password" fullWidth={true} component={InputField} validate={[required, minimum8]} />
                                </div>
                                <div className="formGroup">
                                    <label className="controlLabel">Confirm Password</label>
                                    <Field name="confirmPassword" myType="password" fullWidth={true} component={InputField} validate={required} />
                                </div>
                                <div className="formGroup">
                                    <Recaptcha
                                        sitekey={recaptchaSiteKey}
                                        callback={verifyCallback.bind(this)}
                                        expiredCallback={expiredCallback.bind(this)}
                                        className="recaptcha"
                                    />
                                    <div className="row">
                                        <div className="col-md-12" style={{color:'rgb(244, 67, 54)'}}>  
                                            {this.state.showError ? 
                                                "required"
                                                :
                                                null
                                            }
                                        </div>
                                    </div>
                                </div>    
                                <div style={{paddingTop:'10px', textAlign:'center'}}> 
                                    <RaiseButton type="submit" variant="contained" color="primary" isFullWidth={true} label="CREATE YOUR NOUVO ACCOUNT"/>
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

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ registerUser, clearRegisterUserState }, dispatch)
  }

Register = reduxForm({
    form: 'frmRegister',
    validate
})(Register)

Register = connect(
    state => ({
       userData: state.accountValidate === undefined ? undefined : state.accountValidate,
       registerUserResponse: state.account.registerUser,
    }),
    mapDispatchToProps,
  )(Register)

export default Register;