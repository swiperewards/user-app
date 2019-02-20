//react redux
import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form'

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
import DeleteIcon from '@material-ui/icons/Delete';

//Validation
import {required, dropDownRequired, email, ssnMask, phoneMask, zipMask, percentage, drivingLicense, between1to50, between1to100} from '../../utilities/validation'

//Components
import InputField from '../../components/inputField';
import {renderSelectField} from '../../components/selectControl';

//Data
import Data from '../../staticData';

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
        flexBasis: '100.0%',
      },
      buttonColumn: {
        flexBasis: '10.0%',
        float:'right',
        padding:'0px',
      },
  };

  let renderOwners = ({ fields, businessType, meta: { touched, error, submitFailed } }) => {
    if(fields.length === 0){
        fields.push({})
    }

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
                    { idx !== 0 ?
                        <div style={styles.buttonColumn}>
                            <button
                            type="button"
                            title="Remove Member"
                            onClick={() => fields.remove(idx)}
                            > 
                                <DeleteIcon />
                            </button>
                        </div>
                        : null
                    }
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Paper style={{width:'100%', padding:'15px'}}>

                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                First Name*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field myType="text" name={`${member}.ownerFirstName`} fullWidth={true} component={InputField} validate={[required, between1to50]}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Last Name*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field myType="text" name={`${member}.ownerLastName`} fullWidth={true} component={InputField} validate={[required, between1to50]}/>  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                DOB(dd/mm/yyyy)*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field myType="date" name={`${member}.ownerDob`} fullWidth={true} component={InputField} validate={required}/>  
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
                                <Field myType="text" name={`${member}.ownerBusinessTitle`} fullWidth={true} component={InputField} validate={[required, between1to50]}/>  
                            </div>
                            {
                                businessType !== "0"
                                ?
                                    <React.Fragment>
                                        <div className="col-xs-12 col-sm-6 col-md-3">
                                            OwnerShip %*
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-3">    
                                            <Field myType="number" name={`${member}.ownership`} fullWidth={true} component={InputField} validate={[required, percentage]}/>  
                                        </div>
                                    </React.Fragment>    
                                :
                                    null
                            }
                            
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
                                <Field myType="text" name={`${member}.ownerAddress`} fullWidth={true} component={InputField} validate={required}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Address 2
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field myType="text" name={`${member}.ownerAddress2`} fullWidth={true} component={InputField} />  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                City*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field myType="text" name={`${member}.ownerCity`} fullWidth={true} component={InputField} validate={[required, between1to100]}/>  
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
                                <Field myType="text" name={`${member}.ownerEmail`} fullWidth={true} component={InputField} validate={[required, email]}/>  
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
        {
            businessType !== "0"
            ?
                <div style={{marginTop:'10px'}}>
                    <button 
                        type="button" 
                        onClick={() => fields.push({})} 
                        className="button"
                        style={{backgroundColor:'#27A24F'}}>
                        + Add additional owner
                    </button>           
                </div>
            :
                null
        }
        
    </React.Fragment>
    )
}

class OwnerDetails extends Component {

    state = {
        account: '',
        name: '',
        stateName: '',
        dlStateName: '',
        businessType:'',
        expanded: false,
      };

      componentWillMount(){
          this.setState({businessType:this.props.myProps});
      }

      handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

    render() {

        const { businessType } = this.state;

        return (
            <div style={{paddingBottom:'20px'}}>
                <Paper className="pagePaper">
                    <div className="formContent">
                        <div className="row">

                            <div className="appTitleLabel col-md-2">
                                <FormLabel component="legend">OWNERS DETAILS</FormLabel>
                            </div>
                            <div className="appDescriptionLabel col-md-10">
                                Please submit all owners with at least 25% ownership in the company. Public companies, submit an executive officer
                            </div> 
                        </div>
                        <Divider style={{marginBottom:'20px'}} />

                        <FieldArray name="owners" businessType={businessType} component={renderOwners}/>
                    </div>
                </Paper>                    
            </div>
        );
    }
}

export default OwnerDetails;