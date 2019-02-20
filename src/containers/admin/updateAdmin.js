//react redux
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';

//material-ui
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

//Components
import DialogBox from '../../components/alertDialog'
import InputField from '../../components/inputField';
import {renderSelectField} from '../../components/selectControl';
import Loader from '../../components/loader'

//Actions
import { updateAdminDetails } from '../../actions/adminAction';

//Validation
import {required, dropDownRequired, phoneMask, email, between1to100, between1to50} from '../../utilities/validation'

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
};

class updateAdmin extends Component {

    state = {
        image:'',
        dialogOpen: false,
      };

      handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

    componentWillMount() {

        errorMessage = "";
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (nextProps.updateAdminResponse){
              if(nextProps.updateAdminResponse.status === 200){
                  this.setState({message: nextProps.updateAdminResponse.message})
                  this.setState({ dialogOpen: true });
                  this.setState({showLoader:false})
              }
              else{
                  errorMessage =
                    <div 
                        className="errorDiv"
                    >{nextProps.updateAdminResponse.message}</div>
                    this.setState({showLoader:false})
              }
            }
          }
    }  

      onSubmit(values) {
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.updateAdminDetails(values, this.state.image, this.props.userData.user.responseData.token)
        }
      }

      cancelClick(){
        this.props.history.goBack();
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.props.history.push('/manageadmins');
    };

    onImageChange(event) {

        errorMessage = ""

        if (event.target.files && event.target.files[0]) {
            var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
            if (FileSize > 2) {
                errorMessage =
                        <div 
                            className="errorDiv"
                        >{"File size exceeds 2 MB"}</div>
                        event.target.value = null;
                        this.setState({image: this.state.defaultImage});
            } else {
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.setState({image: e.target.result});
                    this.props.change('submitting',true);
                };
                reader.readAsDataURL(event.target.files[0]);
            }
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
                            <FormLabel component="legend">UPDATE ADMIN</FormLabel>
                            </div>                            
                        </div>

                        <Divider style={{marginBottom:'20px'}}/>

                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Admin Name*
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
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Email*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="emailId" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={[required, email, between1to100]}
                                />  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Phone
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
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Status*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <FormControl style={styles.formControl}>
                                        <Field
                                            name="status"
                                            component={renderSelectField}
                                            fullWidth={true}
                                            onChange={this.handleChange}
                                            validate={dropDownRequired}
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
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <span>Upload Profile Picture</span>
                                <Avatar
                                    alt="Adelle Charles"
                                    src={this.state.image === '' ? (this.props.initialValues !== undefined ? this.props.initialValues.profilePicUrl : "../images/profile.png") : this.state.image} 
                                    className="bigAvatar"
                                />
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <input 
                                    type="file" 
                                    onChange={this.onImageChange.bind(this)} 
                                    accept=".jpg"
                                    />
                                <span style={{fontSize:'8pt', color:'grey'}}>File must be less than 2 MB</span>
                            </div>            
                        </div>
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
    return bindActionCreators({ updateAdminDetails }, dispatch)
  }

  updateAdmin = reduxForm({
    form: 'frmUpdateAdmin',
})(updateAdmin)

updateAdmin = connect(
    state => ({
       userData: state.accountValidate === undefined ? undefined : state.accountValidate,
       updateAdminResponse: state.admin.updateAdmin === undefined ? undefined : state.admin.updateAdmin,
       initialValues: state.admin.adminDetails === undefined ? undefined : state.admin.adminDetails.responseData,
    }),
    mapDispatchToProps,
    null,
    { pure: false },
  )(updateAdmin)

export default updateAdmin;