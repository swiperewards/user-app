//react-redux
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

//redux-form
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

//material-ui
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

//Action
import {forgotPassword} from '../../actions/accountAction';

//Components
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader'

const styles = {
    signUpTxt :{
        color:'#424242',
        textDecorator:'none',
        fontSize:'12px',
        fontWeight:'normal'
    },
    signupLink:{
        textDecoration: 'none', 
        color:'#3895D8'
    },
    accountTxt:{
        marginTop:'10px',
        fontStyle:'italic',
    },
    greenBox:{
        border:'solid rgb(36, 160, 39)',
        borderWidth:'0.5px', 
        background:'rgb(234,255,230)', 
        padding:'10px',
    },
    emailText:{
        color:'rgb(0,120,200)',
    }
};

class ResetPassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            message:'',
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
            if (nextProps.forgotPasswordResponse){
                if (nextProps.forgotPasswordResponse.status === 200) {
                    this.setState({message: nextProps.forgotPasswordResponse.message})
                    this.setState({ dialogOpen: true });
                    this.setState({showLoader:false})
                }
                else{
                    this.setState({message: nextProps.forgotPasswordResponse.message})
                    this.setState({ dialogOpen: true });
                    this.setState({showLoader:false})
                }
            }
        }
    }

    resendMailClick(){
        this.props.forgotPassword(this.props.location.state !== undefined ? this.props.location.state.detail : undefined)
    }
    
    handleClose = () => {
        this.setState({ dialogOpen: false });
    };


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
            <div className="row">
                <div className="col-md-6 pageContainer">
                    <Paper className="pagePaper">
                        <div className="formContent">

                            <div className="logo">
                                <img src="../images/logo.png" alt="Logo" />
                            </div>
                            <form size='large' className="form-horizontal" onSubmit={this.props.handleSubmit((event) => this.onSubmit(event))}>
                                <div className="titleLabel">
                                    RESET YOUR PASSWORD
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        We have sent a reset password email to <span style={styles.emailText}>{this.props.location.state !== undefined ? this.props.location.state.detail : undefined}</span> 
                                        <br/>Please click the reset password link to set your new password.
                                    </div>    
                                </div>
                                <div className="row">   
                                    <div className="col-md-9 start-md">
                                        <div>
                                            <span>Didn't receive the email yet?</span>
                                            <span> Please check your spam folder, or
                                            <button 
                                            type="button"
                                            onClick={this.resendMailClick.bind(this)}
                                            style={{color:'#3895D8', fontStyle:'italic', fontSize:'12px'}}
                                        > 
                                            Resend
                                        </button>
                                        the email.</span>
                                    </div>
                                    </div>  
                                    <div className="col-md-3 end-md bottom-md"> 
                                        <Link className="gradient-text" to='/logout'>Proceed to Login</Link>
                                    </div>
                                </div>        
                            </form>
                        </div>            
                    </Paper>
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
    form: 'FrmResetPassword'
}
)(connect(mapStateToProps, mapDispatchToProps)(ResetPassword))
