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
import InputField from '../../components/inputField'
import RaiseButton from '../../components/raiseButton'
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader';

//Validation
import {required, minimum8} from '../../utilities/validation'

//Actions
import { resetPassword, clearsetPasswordResponse } from '../../actions/accountAction'

let errorMessage

const validate = values => {
    const errors = {}

    if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Confirm password must be the same as password"
    }

    return errors;
}

class ChangePassword extends Component {
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
            if (nextProps.setPasswordResponse){
                if (nextProps.setPasswordResponse.status === 200) {
                    errorMessage = undefined
                    this.setState({message:nextProps.setPasswordResponse.message});
                    this.setState({dialogOpen:true})
                    this.setState({showLoader:false})
                }
                else{
                    errorMessage =
                        <div 
                            className="errorDiv"
                        >{nextProps.setPasswordResponse.message}</div>
                        this.setState({showLoader:false})
                }

                this.props.clearsetPasswordResponse()
            }
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.props.history.push('/logout')
    };

    onSubmit(values) {
        errorMessage = undefined
        if (this.props.match.params.token) {
            this.setState({showLoader:true})
            this.props.resetPassword(values.password, this.props.match.params.token);
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
                                <div className="titleLabel">CHANGE PASSWORD
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        Please enter a new password in the fields below.
                                    </div>    
                                </div>    
                                <div className="formGroup">
                                    <label className="controlLabel">Password</label>
                                    <Field name="password" myType="password" fullWidth={true} component={InputField} validate={[required, minimum8]} />
                                </div>
                                <div className="formGroup">
                                    <label className="controlLabel">Confirm Password</label>
                                    <Field name="confirmPassword" myType="password" fullWidth={true} component={InputField} validate={required} />
                                </div>
                                <div style={{paddingTop:'10px', textAlign:'center'}}> 
                                    <RaiseButton type="submit" style={{display:'inline-block' , float:'none'}} variant="contained" color="primary" label="CHANGE PASSWORD"/>
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
            setPasswordResponse: state.account.setPassword,
        }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ resetPassword, clearsetPasswordResponse }, dispatch)
}

export default reduxForm({
    form: 'FrmChangePassword',
    validate
}
)(connect(mapStateToProps, mapDispatchToProps)(ChangePassword))
