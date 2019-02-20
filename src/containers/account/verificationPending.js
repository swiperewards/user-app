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

import {resendVerificationMail, clearResendMailResponse} from '../../actions/accountAction';
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

class VerificationPending extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            message:'',
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
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

    cancelClick(){
        this.props.history.push('/logout')
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
    };

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
                                        THANK YOU FOR REGISTERING WITH {appName}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            Account verification pending.
                                            To activate your account with {appName}, click the link contained in the email.
                                        </div>    
                                    </div>
                                    <div className="row">
                                        <div className="col-md-9 start-md">
                                            <div style={styles.accountTxt}>
                                                <span>Didn't receive the email yet?,</span>
                                                <button 
                                                type="button"
                                                onClick={this.resendMailClick.bind(this)}
                                                style={{color:'#3895D8', fontStyle:'italic',fontSize:'12px'}}
                                            > 
                                            Resend activation mail
                                            </button>
                                            
                                            </div>
                                        </div>    
                                        <div className="col-md-3 end-md"> 
                                            <button 
                                                type="button"
                                                className="button"
                                                onClick={this.cancelClick.bind(this)}
                                            > 
                                            CLOSE
                                            </button>
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
            resendEmailResponse: state.account.resendEmail,
        }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ resendVerificationMail, clearResendMailResponse }, dispatch)
}

export default reduxForm({
    form: 'FrmVerificationPending'
}
)(connect(mapStateToProps, mapDispatchToProps)(VerificationPending))
