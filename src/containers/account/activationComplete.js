//react-redux
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

//redux-form
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

//Components
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader'

import {resendVerificationMail, activateUserAccount, clearResendMailResponse} from '../../actions/accountAction';
import { appName } from '../../app.config';

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

class ActivationComplete extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            message:'',
            errorCode:'',
        }
    }

    componentWillMount() {
        if (this.props.match.params.token) {
            this.setState({showLoader:true})
            this.props.activateUserAccount(this.props.match.params.token);
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
            if (nextProps.activateUserResponse){
                if (nextProps.activateUserResponse.status === 200) {
                    this.setState({errorCode: nextProps.activateUserResponse.status})
                    this.setState({showLoader:false})
                }
                else{
                    this.setState({errorCode: nextProps.activateUserResponse.status})
                    this.setState({message: nextProps.activateUserResponse.message})
                    this.setState({showLoader:false})
                }
            }

            if (nextProps.resendEmailResponse){
                if (nextProps.resendEmailResponse.status === 200) {
                    this.setState({message: nextProps.resendEmailResponse.message})
                    this.setState({ dialogOpen: true });
                    this.setState({showLoader:false})
                }
                else{
                    this.setState({message: nextProps.resendEmailResponse.message})
                    this.setState({ dialogOpen: true });
                    this.setState({showLoader:false})
                }

                this.props.clearResendMailResponse();
            }
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
    };

    cancelClick(){
        this.props.history.goBack();
    }

    resendMailClick(){
        this.setState({showLoader:true})
        this.props.resendVerificationMail(this.props.location.state !== undefined ? this.props.location.state.detail : undefined)
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
            <div className="row">
                <div className="col-md-6 pageContainer">
                    <Paper className="pagePaper">
                        <div className="formContent">

                            <div className="logo">
                                <img src="../images/logo.png" alt="Logo" />
                            </div>
                            <form size='large' className="form-horizontal" onSubmit={this.props.handleSubmit((event) => this.onSubmit(event))}>
                                <div className="titleLabel">
                                    WELCOME TO {appName}
                                </div>

                                {
                                    this.state.errorCode === 200 ?
                                        <React.Fragment>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div style={styles.greenBox}>
                                                        <img src="../images/greenTick.png" alt="" style={{paddingRight:'10px'}} />
                                                        <span>Verification Complete</span>
                                                    </div>
                                                </div>    
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    Great! You've successfully verified your account and can continue with the login. 
                                                </div>    
                                                <div className="col-md-12">
                                                    Please login via {appName} mobile app. 
                                                </div> 
                                            </div> 
                                        </React.Fragment>      
                                    :
                                    <div className="row">
                                            <div className="col-md-12 errorDiv">
                                                {this.state.message}
                                            </div>    
                                    </div>
                                }
                                
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
            activateUserResponse: state.account.activateUser,
            resendEmailResponse: state.account.resendEmail,
        }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ resendVerificationMail, activateUserAccount, clearResendMailResponse }, dispatch)
}

export default reduxForm({
    form: 'FrmActivationComplete'
}
)(connect(mapStateToProps, mapDispatchToProps)(ActivationComplete))
