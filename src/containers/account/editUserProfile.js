//react redux
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';

//material-ui
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

//Components
import InputField from '../../components/inputField';
import RenderSwitch from '../../components/switchControl';
import Loader from '../../components/loader';
import DialogBox from '../../components/alertDialog';

//Action
import { updateUserProfile, clearUpdateProfileResponse } from '../../actions/accountAction';
import { getUserDetails } from '../../actions/userAction';

//Validation
import {required, minimum8} from '../../utilities/validation'

let errorMessage

const styles = {
      bigAvatar: {
        width: 60,
        height: 60,
      }
};

const passwordsMatch = (value, allValues) => 
  value !== allValues.newPassword ? 'Passwords don\'t match' : undefined;

class UserProfile extends Component {
    
    state = {
        passwordUpdate: false,
        dialogOpen: false,
    };

    componentWillMount() {
        errorMessage = ""
        this.fetchUserDetails()
    }

    fetchUserDetails(){
        if(this.props.userData.user.responseData.token){
            this.props.getUserDetails(this.props.userData.user.responseData.userId, this.props.userData.user.responseData.token)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (nextProps.updateProfileResponse){
              if(nextProps.updateProfileResponse.status === 200){
                  this.setState({message: nextProps.updateProfileResponse.message})
                  this.setState({ dialogOpen: true });
                  this.setState({ showLoader: false });
                  this.fetchUserDetails()
              }
              else{
                  errorMessage =
                    <div 
                        className="errorDiv"
                    >{nextProps.updateProfileResponse.message}</div>
                    this.setState({showLoader:false})
              }

              this.props.clearUpdateProfileResponse();
            }
          }
    } 

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleCheckboxChange = name => event => {
        this.setState({[name]: event.target.checked});
    };

    handleClose = () => {
        this.setState({ dialogOpen: false });
    };
     
    onSubmit(values) {

        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.updateUserProfile(values, this.props.userData.user.responseData.token)
        }
    }

    render() {
        const {  dialogOpen } = this.state;
        const { pristine, submitting } = this.props

        const actions = [
            <Button key="ok" onClick={this.handleClose} color="primary" autoFocus>
                OK
            </Button>
        ];

        return (
            <div style={{paddingBottom:'20px'}}>
                <Loader status={this.state.showLoader} />
                <DialogBox 
                        displayDialogBox={dialogOpen} 
                        message={this.state.message} 
                        actions={actions} 
                />
                <form onSubmit={this.props.handleSubmit((event) => this.onSubmit(event))}>
                <Paper className="pagePaper">
                    <div className="formContent">
                        <div className="appTitleLabel row">
                            <div className="col-xs-12 col-md-12">
                            <FormLabel component="legend">EDIT PROFILE</FormLabel>
                            </div>                            
                        </div>

                        <Divider style={{marginBottom:'20px'}}/>
                        <div className="row center-xs">
                            <div className="col-xs-1">
                                <Avatar src={this.props.userData.user.responseData.profilePicUrl} style={styles.bigAvatar} />
                            </div>
                        </div>
                        <Divider style={{marginBottom:'20px'}}/>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Name
                            </div>    
                            <div className="col-xs-12 col-sm-6 col-md-4">
                                <Field 
                                    myType="text" 
                                    name="fullName" 
                                    fullWidth={true} 
                                    component={InputField} 
                                /> 
                            </div>  
                        </div>   
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Email ID
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-4">
                                <Field 
                                    myType="text" 
                                    name="emailId" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    disabled={true}
                                /> 
                            </div>
                        </div>
                        <div className="row start-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Update Password
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">  
                                <Field
                                    name="passwordUpdate" 
                                    ref="passwordUpdate"
                                    id="passwordUpdate" 
                                    component={RenderSwitch}
                                    onChange={this.handleCheckboxChange('passwordUpdate')}
                                />                             
                            </div>
                        </div>    
                        <div className="row start-md">
                            <div className="col-xs-12 col-sm-6 col-md-6">
                                {this.state.passwordUpdate === true ? (
                                <React.Fragment>  
                                <div className="row">
                                    <div className="col-xs-6">
                                        New Password
                                    </div>
                                    <div className="col-xs-6">
                                        <Field 
                                            name="newPassword" 
                                            myType="password" 
                                            fullWidth={true} 
                                            component={InputField} 
                                            validate={[required, minimum8]} 
                                        />
                                    </div>
                                </div>
                                <div className="row">                            
                                    <div className="col-xs-6">
                                        Confirm Password
                                    </div>
                                    <div className="col-xs-6">
                                        <Field 
                                            name="confirmPassword" 
                                            myType="password" 
                                            fullWidth={true} 
                                            component={InputField} 
                                            validate={[required, passwordsMatch]} 
                                        />
                                    </div>
                                </div>
                                </React.Fragment>
                                ) : null
                            }
                            </div>
                        </div>
                        <div className="row start-xs">
                            <div className="col-xs-12 col-sm-6 col-md-6">
                                <button 
                                    type="submit"
                                    disabled={pristine || submitting}
                                    className={(pristine || submitting) === true ? "disabledButton button" : "enabledButton button"}
                                    > Update
                                </button>  
                            </div>
                        </div>                       
                    </div>            
                </Paper> 
                </form>
                <div>
                    {errorMessage}
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateUserProfile, clearUpdateProfileResponse, getUserDetails }, dispatch)
  }

UserProfile = reduxForm({
    form: 'frmUserProfile',
})(UserProfile)

UserProfile = connect(
    state => ({
        userData: state.accountValidate === undefined ? undefined : state.accountValidate,
        initialValues : state.userAccount.userDetails === undefined ? undefined : state.userAccount.userDetails.responseData,
        updateProfileResponse: state.account.updateProfile === undefined ? undefined : state.account.updateProfile
    }),
    mapDispatchToProps,
  )(UserProfile)

export default UserProfile;