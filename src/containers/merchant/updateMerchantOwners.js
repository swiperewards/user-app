//react redux
import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

//Validation
import {required, dropDownRequired, email, ssnMask, phoneMask, zipMask, percentage, drivingLicense} from '../../utilities/validation'

//Components
import InputField from '../../components/inputField';
import {renderSelectField} from '../../components/selectControl';
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader'

//Actions
import { getMerchantDetailsAPI, updateMerchantDetails, clearMerchantUpdateState } from '../../actions/merchantAction';

//Data
import Data from '../../staticData';

let errorMessage

const styles = {
    root: {
      width: '100%',
    },
    heading: {
        fontSize: '14px',
        fontWeight: 'bold',
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    formControl: {
        minWidth: '100%',
        marginLeft:'0px',
    },
    selectControl:{
        fontSize: '12px',
    },
    column: {
        flexBasis: '90.0%',
      },
      buttonColumn: {
        flexBasis: '10.0%',
      },
  };

  let renderOwners = ({ fields, meta: { touched, error, submitFailed } }) => {

    return(  
    <React.Fragment>

        {      
         fields.map((member, idx) =>
            <div style={styles.root} key={'fragment' + idx}>
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div style={styles.column}>
                        <Typography style={styles.heading}>{idx === 0 ? "Primary Owner" : "Additional Owner"}</Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Paper style={{width:'100%', padding:'15px'}}>

                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                First Name*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name={`${member}.ownerFirstName`} 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Last Name*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field 
                                    myType="text" 
                                    name={`${member}.ownerLastName`} 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}/>  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                DOB(dd/mm/yyyy)*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="date" 
                                    name={`${member}.ownerDob`} 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                SSN*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field 
                                    myType="text" 
                                    name={`${member}.ownerSsn`} 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}
                                    masked={true}
                                    myMaskType="text"
                                    maskReg={ssnMask}
                                />  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                            Business Title*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name={`${member}.ownerBusinessTitle`} 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                OwnerShip %*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field 
                                    myType="number" 
                                    name={`${member}.ownership`} 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={[required, percentage]}/>  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Driver License
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name={`${member}.ownerDrivingLicense`}
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={drivingLicense}
                                />  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                DL State
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <FormControl style={styles.formControl}>
                                        <Field
                                            name={`${member}.ownerDlState`}
                                            component={renderSelectField}
                                            fullWidth={true}
                                        >
                                        {
                                            Data.states.map((item) =>{
                                                return <MenuItem 
                                                    style={styles.selectControl}
                                                    key={item.id}
                                                    value={item.prefix}>
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
                                Address*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name={`${member}.ownerAddress`} 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Address 2
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field 
                                    myType="text" 
                                    name={`${member}.ownerAddress2`} 
                                    fullWidth={true} 
                                    component={InputField} />  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                City*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name={`${member}.ownerCity`} 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                State*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <FormControl style={styles.formControl}>
                                        <Field
                                            name={`${member}.ownerState`}
                                            component={renderSelectField}
                                            fullWidth={true}
                                            validate={dropDownRequired}
                                        >
                                        {
                                            Data.states.map((item) =>{
                                                return <MenuItem 
                                                    style={styles.selectControl}
                                                    key={item.id}
                                                    value={item.prefix}>
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
                                Zip*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name={`${member}.ownerZip`}
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}
                                    masked={true}
                                    myMaskType="text"
                                    maskReg={zipMask}
                                />  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Email*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name={`${member}.ownerEmail`} 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={[required, email]}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Phone*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field 
                                    myTpe="text"
                                    name={`${member}.ownerPhone`}
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}
                                    masked={true}
                                    myMaskType="text"
                                    maskReg={phoneMask}
                                />  
                            </div>
                        </div>
                    </Paper>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            </div>
        )}
    </React.Fragment>
    )
}

class UpdateOwnerDetails extends Component {

    state = {
        account: '',
        name: '',
        stateName: '',
        dlStateName: '',
    };

    componentWillMount(){
        this.setState({ openAlert: false });
        this.props.clearMerchantUpdateState()
        errorMessage = undefined
      }
    
      componentWillReceiveProps(nextProps) {

        if (nextProps) {
          if (nextProps.updateOwnerResponse){
            this.setState({showLoader:false})
            nextProps.updateOwnerResponse.forEach(response => {
                if(response.code === 200 || response.code === 201){
                    errorMessage = errorMessage !== undefined ? errorMessage : undefined
                }
                else{
                    if(response.code === 1084){
                        errorMessage =
                        response.data.map((error, index) =>
                            <div 
                                key={index} 
                                className="errorDiv"
                            >
                            {error.field + ' : ' + error.msg}
                            </div >
                        )
                    }
                    else{
                        errorMessage =
                            <div 
                                className="errorDiv"
                            >
                            {response.description}
                            </div >
                    }
                }
            })

            if(errorMessage === undefined){
                this.handleOpenAlert()
            }
            this.props.clearMerchantUpdateState()
          }
        }
        
      }

      handleOpenAlert = () => {
        this.setState({ openAlert: true });
      };

      handleCloseAlert = () => {
        this.setState({ openAlert: false });
      };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit(values) {
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            errorMessage=undefined
            this.props.updateMerchantDetails(values, "memberDetails", "", this.props.userData.user.responseData.token)
        }
    }

    render() {
        const { pristine, submitting } = this.props
        const { expanded } = this.state;
        const actions = [
            <Button key="ok" onClick={this.handleCloseAlert} color="primary" autoFocus>
                OK
            </Button>
        ];
        
        return (
            <div style={{paddingBottom:'20px'}}>
                <Loader status={this.state.showLoader} />
                <DialogBox 
                    displayDialogBox={this.state.openAlert} 
                    message="Merchant details updated successfully" 
                    actions={actions} 
                />
                <form onSubmit={this.props.handleSubmit((event) => this.onSubmit(event))}>
                <Paper className="pagePaper">
                    <div className="formContent">
                    <div className="appTitleLabel row">
                            <div className="col-xs-10 col-md-10">
                                <FormLabel component="legend">OWNER DETAILS</FormLabel>
                            </div>
                            <div className="col-xs-2 col-md-2">
                            <button 
                                type="submit"
                                disabled={pristine || submitting}
                                className={(pristine || submitting) === true ? "disabledButton button" : "enabledButton button"}
                            >
                                Update
                            </button>
                            </div>
                        </div>
                        <Divider style={{marginBottom:'20px'}} />

                        <FieldArray name="owners" component={renderOwners} expand={expanded}/>
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
    return bindActionCreators({ getMerchantDetailsAPI, updateMerchantDetails, clearMerchantUpdateState }, dispatch)
}

UpdateOwnerDetails = reduxForm({
    form: 'frmUpdateOwnerDetails',
})(UpdateOwnerDetails)

UpdateOwnerDetails = connect(
    state => ({
        userData: state.accountValidate === undefined ? undefined : state.accountValidate,
        updateOwnerResponse: state.merchant.updateMerchant === undefined ? undefined : state.merchant.updateMerchant.responseData,
        initialValues: {
            owners: state.merchant.merchantDetails === undefined 
            ? undefined 
            : state.merchant.merchantDetails.responseData.members.sort(((a,b) => a.primary < b.primary))
          }
    }),
    mapDispatchToProps,
    null,
    { pure: false },
  )(UpdateOwnerDetails)

export default UpdateOwnerDetails;