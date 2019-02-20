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

import Button from '@material-ui/core/Button';

//Components
import DialogBox from '../../components/alertDialog'
import InputField from '../../components/inputField';
import {renderSelectField} from '../../components/selectControl';
import Loader from '../../components/loader'
import DatePickerControl from '../../components/datePickerControl';

//Actions
import { updateDeal, getCitiesList } from '../../actions/dealAction';

//Validation
import {required, dropDownRequired, dateRequired, normalizedPhone} from '../../utilities/validation'

//Data
import Data from '../../staticData';
import moment from 'moment'

const intMaxRangeMatch = (value) => parseFloat(value.replace(normalizedPhone,'')) > 2147483647 ? 'Invalid pool amount' : undefined;

let errorMessage

const styles = {
    formControl: {
        minWidth: '100%',
        marginLeft:'0px',
      },
      selectControl:{
        fontSize: '12px',
      }
};

class UpdateDeal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            message:'',
            citiesList:'',
        }
    }

    componentWillMount(){
        errorMessage = "";

        this.props.change('startDate', new Date());
        this.props.change('endDate', moment().add(2, 'weeks').calendar());

        if(this.props.userData.user.responseData.token){
            this.props.getCitiesList(this.props.userData.user.responseData.token)
        }
    }

      handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

      componentWillReceiveProps(nextProps) {
        if (nextProps) {

          if (nextProps.updateDealResponse){
            this.setState({showLoader:false})
            if(nextProps.updateDealResponse.status === 200){
                this.setState({message: nextProps.updateDealResponse.message})
                this.setState({ dialogOpen: true });
            }
            else{
                errorMessage =
                    <div 
                        className="errorDiv"
                    >{nextProps.updateDealResponse.message}</div>
            }
          }

          if(nextProps.citiesPayload){
            if(nextProps.citiesPayload.status === 200){
                this.setState({citiesList:nextProps.citiesPayload.responseData})
            }
          }
        }
    }

      onSubmit(values) {

        if(this.props.userData.user.responseData.token){
            let merchantId = this.props.initialValues !== undefined ? this.props.initialValues.merchantId : undefined
            if(merchantId !== undefined){
                this.setState({showLoader:true})
                this.props.updateDeal(values, this.props.userData.user.responseData.token)
            }
        }
      }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.props.history.push('/managedeals');
    };

    handleDateChange = (date) => {
        if(date){
            this.props.change('endDate',moment(date).add(2, 'weeks').calendar())
        }
    }

    cancelClick(){
        this.props.history.goBack();
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
                            <FormLabel component="legend">UPDATE DEAL</FormLabel>
                            </div>                            
                        </div>

                        <Divider style={{marginBottom:'20px'}}/>

                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Business Name
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                {this.props.initialValues !== undefined ? this.props.initialValues.entityName : ""}
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                City
                            </div>    
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <FormControl style={styles.formControl}>
                                    <Field
                                        name="location"
                                        component={renderSelectField}
                                        fullWidth={true}
                                        onChange={this.handleChange}
                                        validate={dropDownRequired}
                                    >
                                    {
                                        (this.state.citiesList) ? 
                                        this.state.citiesList.map((item) =>{
                                        return <MenuItem 
                                                style={styles.selectControl}
                                                key={item.id}
                                                value={item.name}>
                                                {item.name}
                                            </MenuItem>
                                        })
                                    : null  
                                    }
                                    </Field>    
                                </FormControl>  
                            </div>  
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Store Location
                            </div> 
                            <div className="col-xs-12 col-sm-6 col-md-3">      
                                <Field 
                                    myType="text" 
                                    name="storeLocation" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    disabled={true}
                                /> 
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Pool Amount*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="cashBonus" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={[required, intMaxRangeMatch]}
                                    masked={true}
                                    myMaskType="number"
                                    disabled={true}
                                />  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                From Date*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    name="startDate" 
                                    fullWidth={true} 
                                    keyboard={true}
                                    disabled={false}
                                    component={DatePickerControl} 
                                    onChange={this.handleDateChange}
                                    validate={dateRequired}
                                />   
                            </div>
                        </div>
                        <div className="row middle-md">
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
                                            Data.dealStatus.map((item) =>{
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
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                To Date*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    name="endDate" 
                                    fullWidth={true} 
                                    keyboard={false}
                                    disabled={true}
                                    component={DatePickerControl} 
                                    onChange={this.handleDateChange}
                                />  
                            </div>
                        </div> 
                        <div className="row end-xs">
                            <div className="col-xs-12 col-sm-6 col-md-6">
                                <button 
                                    type="button"
                                    style={{backgroundColor:'#BCBCBC'}}
                                    className="enabledButton button"
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
    return bindActionCreators({ updateDeal, getCitiesList }, dispatch)
  }

  UpdateDeal = reduxForm({
    form: 'frmUpdateDeal',
})(UpdateDeal)

UpdateDeal = connect(
    state => ({
       userData: state.accountValidate === undefined ? undefined : state.accountValidate,
       updateDealResponse: state.deal === undefined ? undefined : state.deal.updateDeal, 
       initialValues: state.deal.dealDetails === undefined ? undefined : state.deal.dealDetails.responseData,
       citiesPayload: state.deal.citiesList === undefined ? undefined : state.deal.citiesList,

    }),
    mapDispatchToProps,
    null,
    { pure: false },
  )(UpdateDeal)

export default UpdateDeal;