//react redux
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';

//material-ui
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

//Components
import InputField from '../../components/inputField';
import RenderSwitch from '../../components/switchControl';
import {renderSelectField} from '../../components/selectControl';
import Loader from '../../components/loader'
import DialogBox from '../../components/alertDialog'

//Actions
import {updateUserDetails, clearUserUpdateResponse} from '../../actions/userAction'

//Validation
import { required, minimum8, email, phoneMask, zipMask, between1to100, between1to50} from '../../utilities/validation'

//Data
import Data from '../../staticData';

let errorMessage

const styles = {
    formControl: {
        minWidth: '100%',
        marginLeft:'0px',
      },
      selectControl:{
        fontSize: '12px',
      },
      bigAvatar: {
        width: 60,
        height: 60,
      }
};

const passwordsMatch = (value, allValues) => 
  value !== allValues.newPassword ? 'Passwords don\'t match' : undefined;

class UpdateUserDetails extends Component {

    state = {
        businessType: '',
        stateName:'',
        dialogOpen: false,
      };

      handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

      handleCheckboxChange = name => event => {
        this.setState({[name]: event.target.checked});
      };

    componentWillMount() {

        errorMessage = ""
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (nextProps.updateUserResponse){
              if(nextProps.updateUserResponse.status === 200){
                  this.setState({message: nextProps.updateUserResponse.message})
                  this.setState({ dialogOpen: true });
                  this.setState({showLoader:false})
              }
              else{
                  errorMessage =
                    <div 
                        className="errorDiv"
                    >{nextProps.updateUserResponse.message}</div>
                    this.setState({showLoader:false})
              }

              this.props.clearUserUpdateResponse();
            }
          }
    } 

    cancelClick(){
        this.props.history.goBack();
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.cancelClick()
    };

      onSubmit(values) {

        var isEmailUpdated = (this.props.initialValues.emailId !== values.emailId) ? true : false;
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.updateUserDetails(values, isEmailUpdated, this.props.userData.user.responseData.token)
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
                            <FormLabel component="legend">Update User Details</FormLabel>
                            </div>                            
                        </div>
                        <Divider style={{marginBottom:'20px'}}/>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Name *
                            </div>    
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="fullName" 
                                    fullWidth={true} 
                                    component={InputField}
                                    validate={[required, between1to50]} 
                                /> 
                            </div>  
                        </div>   
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Email ID *
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="emailId" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={[required, email]}
                                />  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Contact Number
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="contactNumber" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    masked={true}
                                    myMaskType="text"
                                    maskReg={phoneMask}
                                />  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                City
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="city" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={between1to100}
                                />  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                ZipCode
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="pincode" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    masked={true}
                                    myMaskType="text"
                                    maskReg={zipMask}
                                />  
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Status
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <FormControl style={styles.formControl}>
                                        <Field
                                            name="status"
                                            component={renderSelectField}
                                            fullWidth={true}
                                            onChange={this.handleChange}
                                        >
                                        {
                                            Data.userStatus.map((item) =>{
                                               return <MenuItem 
                                                    style={styles.selectControl}
                                                    key={item.id}
                                                    value={item.id}>
                                                    {item.name}
                                               </MenuItem>
                                            })
                                        }
                                    </Field>    
                                </FormControl>  
                            </div>
                        </div>
                        {
                            this.props.initialValues ?
                            !this.props.initialValues.isSocialLogin ?
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
                        : null
                        : null
                        }
                        <div className="row end-xs">
                            <div className="col-xs-12 col-sm-6 col-md-6">
                                <button 
                                    type="button"
                                    style={{backgroundColor:'#BCBCBC'}}
                                    disabled={this.state.disableReset}
                                    className={this.state.disableReset ? "disabledButton button" : "enabledButton button"}
                                    onClick={this.cancelClick.bind(this)}
                                    > Cancel
                                </button>

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
    return bindActionCreators({ updateUserDetails, clearUserUpdateResponse }, dispatch)
  }

UpdateUserDetails = reduxForm({
    form: 'frmUpdateUserDetails',
})(UpdateUserDetails)

UpdateUserDetails = connect(
    state => ({
        userData: state.accountValidate === undefined ? undefined : state.accountValidate,
        initialValues: state.userAccount.userDetails === undefined ? undefined : state.userAccount.userDetails.responseData,
        updateUserResponse : state.userAccount.updateUser === undefined ? undefined : state.userAccount.updateUser,

    }),
    mapDispatchToProps,
  )(UpdateUserDetails)

export default UpdateUserDetails;