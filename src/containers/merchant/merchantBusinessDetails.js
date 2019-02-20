//react redux
import React, { Component } from 'react';
import { Field } from 'redux-form';

//material-ui
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Avatar from '@material-ui/core/Avatar';

//Components
import InputField from '../../components/inputField';
import {renderSelectField} from '../../components/selectControl';
import RenderCheckbox from '../../components/renderCheckbox';
import RenderSwitch from '../../components/switchControl';
import FieldFileInput from '../../components/fieldFileInput';

//Validation
import {required, exact9, between1to100, dropDownRequired, email, website, phoneMask, taxNumberMask, zipMask, normalizedPhone} from '../../utilities/validation'

//Data
import Data from '../../staticData';

const intMaxRangeMatch = (value) => parseFloat(value.replace(normalizedPhone,'')) > 2147483647 ? 'Invalid sales amount' : undefined;


const styles = {
    formControl: {
        minWidth: '100%',
        marginLeft:'0px',
      },
      selectControl:{
        fontSize: '12px',
      }
};
  
var errorMessage

class BusinessDetails extends Component {

    state = {
        image:'',
        defaultImage:'../images/profile.png',
        businessType: '',
        stateName:'',
        creditCheckedNo: true,
        creditCheckedYes: false,
      };

      handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

      handleCheckboxChange = name => event => {
        this.setState({[name]: event.target.checked});
      };

      //Enables "Public Company" option if not following cases
      availPublic(param) {
        switch(param) {
          case '0':
            return true;
          case '5':
            return true;  
          case '6':
            return true;
          default:
            return false;
        }
      }

      componentDidMount(){
        if(this.refs.isCreditCardYes){
            this.setState({isCreditCardYes:this.refs.isCreditCardYes.value})
        }

        if(this.refs.businessType){
            this.setState({businessType:this.refs.businessType.value})
        }
    }

    onImageChange = (file) =>{

        errorMessage = ""

        if (file) {
            var FileSize = file.size / 1024 / 1024; // in MB
            if (FileSize > 2) {
                errorMessage =
                        <div 
                            className="errorDiv"
                        >{"File size exceeds 2 MB"}</div>
                        //event.target.value = null;
                        this.setState({image: this.state.defaultImage});
            } else {
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.setState({image: e.target.result});
                    this.props.imageData(e.target.result); 
                };
                reader.readAsDataURL(file);
            }
        }
    }

    render() {

        return (
            <div style={{paddingBottom:'20px'}}>
                <Paper className="pagePaper">
                    <div className="formContent">
                        <div className="appTitleLabel">
                            <FormLabel component="legend">BUSINESS DETAILS</FormLabel>
                        </div>
                        <Divider style={{marginBottom:'20px'}}/>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Business Type (e.g. LLC)*
                            </div>    
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <FormControl style={styles.formControl}>
                                        <Field
                                            name="businessType"
                                            ref="businessType"
                                            component={renderSelectField}
                                            fullWidth={true}
                                            onChange={this.handleChange}
                                            validate={dropDownRequired}
                                        >
                                        {
                                            Data.businessType.map((item) =>{
                                               return <MenuItem 
                                               style={styles.selectControl}
                                               key={item.id}
                                               value={item.prefix}>
                                               {item.name.toUpperCase()}
                                               </MenuItem>
                                            })
                                        }
                                        {
                                            !this.availPublic(this.state.businessType) ?(
                                            <MenuItem>
                                                <FormControlLabel
                                                    control={
                                                        <Field 
                                                            name="isPublicCompany" 
                                                            id="publicCompany" 
                                                            myStyle={styles} 
                                                            component={RenderCheckbox} />
                                                    }
                                                    label="Public Company"
                                                />
                                            </MenuItem>
                                            ): null
                                        }
                                    </Field>    
                                </FormControl>  
                            </div>  
                        </div>
                        {
                            this.state.businessType !== "0" ?(
                                <div className="row middle-md">
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        Legal Business Name*
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <Field 
                                            myType="text" 
                                            name="businessName" 
                                            fullWidth={true} 
                                            component={InputField} 
                                            validate={[required,between1to100]}
                                        />  
                                    </div>
                                </div>
                            ) : null
                        }
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                DBA - Statement Descriptor
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="dba" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={between1to100}
                                    />  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Tax ID Number*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                        myType="text" 
                                        name="taxId" 
                                        fullWidth={true} 
                                        component={InputField} 
                                        validate={[required,exact9]}
                                        masked={true}
                                        myMaskType="text"
                                        maskReg={taxNumberMask}
                                />  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Customer Service Phone
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field 
                                    myType="text" 
                                    name="servicePhone" 
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
                                Start Date of Business
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field myType="date" name="businessPeriod" fullWidth={true} component={InputField}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Website
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field 
                                    myType="text" 
                                    name="businessWebsite" 
                                    myPlaceHolder="http://www.example.com"
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={website}
                                />  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Currently Accept Credit Cards
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">  
                                <Field
                                    name="isCreditCardYes" 
                                    ref="isCreditCardYes"
                                    id="creditCardYes" 
                                    component={RenderSwitch}
                                    onChange={this.handleCheckboxChange('isCreditCardYes')}
                                />                             
                            </div>
                            {this.state.isCreditCardYes === true ? (
                                <React.Fragment>
                                <div className="col-xs-12 col-sm-6 col-md-3">
                                        Annual CC Sales*
                                </div>    
                                <div className="col-xs-12 col-sm-6 col-md-3">
                                    <Field 
                                        myType="text" 
                                        name="ccSale" 
                                        ref="ccSale"
                                        fullWidth={true} 
                                        component={InputField} 
                                        validate={[required, intMaxRangeMatch]}
                                        masked={true}
                                        myMaskType="number"
                                    />    
                                </div>
                                </React.Fragment>
                                ) : ( null
                            )}
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Phone*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="businessPhone" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}
                                    masked={true}
                                    myMaskType="text"
                                    maskReg={phoneMask}
                                />  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Fax
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">   
                                <Field 
                                    myType="text" 
                                    name="businessFax" 
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
                                Address*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field myType="text" name="businessAddress" fullWidth={true} component={InputField} validate={[required,between1to100]}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Address 2
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field myType="text" name="businessAddress2" fullWidth={true} component={InputField} />  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                City*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field myType="text" name="businessCity" fullWidth={true} component={InputField} validate={[required,between1to100]}/>  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                State*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <FormControl style={styles.formControl}>
                                        <Field
                                            name="businessStateName"
                                            component={renderSelectField}
                                            fullWidth={true}
                                            label={this.state.businessStateName}
                                            onChange={this.handleChange}
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
                                    name="businessZip" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={required}
                                    masked={true}
                                    myMaskType="text"
                                    maskReg={zipMask}
                                />  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Email*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">    
                                <Field 
                                myType="text" 
                                name="businessEmail" 
                                fullWidth={true} 
                                component={InputField} 
                                validate={[required, email, between1to100]}
                                />  
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <span>Upload Business Logo</span>
                                <Avatar
                                    alt="profile"
                                    src={this.state.image === '' ? this.state.defaultImage : this.state.image} 
                                    className="bigAvatar"
                                />
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    name="businessLogo" 
                                    label="" 
                                    type="file" 
                                    component={FieldFileInput} 
                                    imageChange={this.onImageChange} 
                                />
                                <span style={{fontSize:'8pt', color:'grey'}}>File must be less than 2 MB</span>
                            </div>            
                        </div>
                    </div>            
                </Paper>  
                <div>
                    {errorMessage}
                </div>                  
            </div>
        );
    }
}

export default BusinessDetails;