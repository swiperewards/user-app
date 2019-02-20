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
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

//Components
import DialogBox from '../../components/alertDialog'
import InputField from '../../components/inputField';
import TextField from '@material-ui/core/TextField';
import {renderSelectField} from '../../components/selectControl';
import Loader from '../../components/loader'
import DatePickerControl from '../../components/datePickerControl';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

//Actions
import { getMerchantListWithFilter } from '../../actions/merchantAction';
import { addNewDeal, getCitiesList } from '../../actions/dealAction';

//Validation
import {required, dropDownRequired, dateRequired, normalizedPhone} from '../../utilities/validation'

//Data
import moment from 'moment'
import Data from '../../staticData';

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

const isObject = val => {
    return typeof val === 'object' && val !== null;
  };
  
  export const classnames = (...args) => {
    const classes = [];
    args.forEach(arg => {
      if (typeof arg === 'string') {
        classes.push(arg);
      } else if (isObject(arg)) {
        Object.keys(arg).forEach(key => {
          if (arg[key]) {
            classes.push(key);
          }
        });
      } else {
        throw new Error(
          '`classnames` only accepts string or object as arguments'
        );
      }
    });
  
    return classes.join(' ');
  };


class AddNewDeal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            message:'',
            citiesList:'',
            fromDate: new Date(),
            toDate:'',
            merchantList:undefined,
            openStoreLocator: false,
            address: '',
            storeErrorMessage: '',
            latitude: null,
            longitude: null,
            isGeocoding: false,
            anchorEl: null,
        }
    }

    componentWillMount(){
        errorMessage = "";
        this.props.change('fromDate', new Date());
        this.props.change('toDate', moment().add(2, 'weeks').calendar());

        if(this.props.userData.user.responseData.token){
            this.props.getCitiesList(this.props.userData.user.responseData.token)
            var userId
            if(this.props.userData.user.responseData.role === 'merchant'){
                userId = this.props.userData.user.responseData.userId
            }
            else{
                userId = this.props.location.state !== undefined ? this.props.location.state.userId : undefined
            }

            this.props.getMerchantListWithFilter(userId,"","0","",this.props.userData.user.responseData.token);
        }
    }

      handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

      handleStoreLocation = (event) => {
        event.target.blur()
        this.props.change('searchStore','');
        this.setState({ openStoreLocator: true });
    };

    handleClosePopup = () => {
        this.setState({ openStoreLocator: false });
    };

      componentWillReceiveProps(nextProps) {
        if (nextProps) {

            if (nextProps.merchantPayload){
                if(nextProps.merchantPayload.status === 200){
                    this.setState({showLoader:false})
                    this.setState({merchantList: nextProps.merchantPayload.responseData})
                }
                else{
                    this.setState({showLoader:false})
                }
            }

          if (nextProps.newDealResponse){
            if(nextProps.newDealResponse.status === 200){
                this.setState({message: nextProps.newDealResponse.message})
                this.setState({ dialogOpen: true });
                this.setState({showLoader:false})
            }
            else{
                errorMessage =
                            <div 
                                className="errorDiv"
                            >{nextProps.newDealResponse.message}</div>
                this.setState({showLoader:false})
            }
          }

          if(nextProps.citiesPayload){
            if(nextProps.citiesPayload.status === 200){
                this.setState({citiesList:nextProps.citiesPayload.responseData})
            }
          }

        }
    }

    handleDateChange = (date) => {
        if(date){
            this.props.change('toDate',moment(date).add(2, 'weeks').calendar())
        }
    }

      onSubmit(values) {

        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.addNewDeal(values, this.state.latitude, this.state.longitude, this.props.userData.user.responseData.token)
        }
      }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.props.history.push('/managedeals');
    };

    cancelClick(){
        this.props.history.goBack();
    }

    handleStoreChange = address => {
        this.setState({
          address,
          latitude: null,
          longitude: null,
          storeErrorMessage: '',
        });
      };
    
      handleSelect = selected => {
        this.setState({ openStoreLocator: false });
        this.props.change('storeLocation',selected)
        this.setState({ isGeocoding: true, address: selected });
        geocodeByAddress(selected)
          .then(res => getLatLng(res[0]))
          .then(({ lat, lng }) => {
            this.setState({
              latitude: lat,
              longitude: lng,
              isGeocoding: false,
            });
          })
          .catch(error => {
            this.setState({ isGeocoding: false });
            console.log('error', error); // eslint-disable-line no-console
          });
      };
    
      handleCloseClick = () => {
        this.setState({
          address: '',
          latitude: null,
          longitude: null,
        });
      };
    
      handleError = (status, clearSuggestions) => {
        console.log('Error from Google Maps API', status); // eslint-disable-line no-console
        this.setState({ storeErrorMessage: status }, () => {
          clearSuggestions();
        });
      };
    
      handleClick = event => {
        this.setState({
          anchorEl: event.currentTarget,
        });
      };
    

    render() {
        const {  dialogOpen,
                address,
                storeErrorMessage,
                latitude,
                longitude,
                isGeocoding, 
            } = this.state;

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
                            <FormLabel component="legend">ADD DEAL</FormLabel>
                            </div>                            
                        </div>

                        <Divider style={{marginBottom:'20px'}}/>

                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                Business Name*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <FormControl style={styles.formControl}>
                                    <Field
                                        name="merchantId"
                                        component={renderSelectField}
                                        fullWidth={true}
                                        onChange={this.handleChange}
                                        validate={dropDownRequired}
                                    >
                                    {
                                            (this.state.merchantList) ? 
                                            this.state.merchantList.map((item) =>{
                                                return <MenuItem 
                                                        style={styles.selectControl}
                                                        key={item.id}
                                                        value={item.id}>
                                                        {item.name_v}
                                                </MenuItem>
                                                })
                                            :
                                            null
                                    }
                                    </Field>    
                                </FormControl>
                            </div>
                        </div>
                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                City*
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
                                    id="storeLocation"
                                    ref="storeLocation"
                                    fullWidth={true}
                                    onFocus={this.handleStoreLocation}
                                    component={InputField}
                                />
                                <Dialog
                                    open={this.state.openStoreLocator}
                                    onClose={this.handleClosePopup}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    fullWidth={true}
                                >
                                    <DialogTitle id="alert-dialog-title">{"Store Locator"}</DialogTitle>
                                    <DialogContent>
                                        <div>
                                            <PlacesAutocomplete
                                            name="searchStore"
                                            onChange={this.handleStoreChange}
                                            value={address}
                                            onSelect={this.handleSelect}
                                            onError={this.handleError}
                                            shouldFetchSuggestions={address.length > 2}
                                            >
                                            {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                                                return (
                                                    <div>
                                                        <div>
                                                            <TextField {...this.props.input}
                                                                {...getInputProps({
                                                                    placeholder: 'Search Store ...',
                                                                    className: 'location-search-input',
                                                                })}
                                                                fullWidth={true}
                                                            />
                                                        </div>
                                                            
                                                        {suggestions.length > 0 && (
                                                            <div className="autocomplete-container">
                                                            {
                                                                suggestions.map((suggestion, index) => {
                                                                    const className = classnames('suggestion-item', {
                                                                        'suggestion-item--active': suggestion.active,
                                                                    });

                                                                return (                                
                                                                <div
                                                                    {...getSuggestionItemProps(suggestion, { className })}>
                                                                    <strong>
                                                                        {suggestion.formattedSuggestion.mainText}
                                                                    </strong>{' '}
                                                                    <small>
                                                                        {suggestion.formattedSuggestion.secondaryText}
                                                                    </small>
                                                                </div>
                                                                                
                                                                );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }}
                                            </PlacesAutocomplete>
                                            {storeErrorMessage.length > 0 && (
                                            <div className="Demo__error-message">{this.state.storeErrorMessage}</div>
                                            )}

                                            {((latitude && longitude) || isGeocoding) && (
                                            <div>
                                                <h3 className="Demo__geocode-result-header">Geocode result</h3>
                                                {isGeocoding ? (
                                                <div>
                                                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw Demo__spinner" />
                                                </div>
                                                ) : (
                                                <div>
                                                    <div className="Demo__geocode-result-item--lat">
                                                    <label>Latitude:</label>
                                                    <span>{latitude}</span>
                                                    </div>
                                                    <div className="Demo__geocode-result-item--lng">
                                                    <label>Longitude:</label>
                                                    <span>{longitude}</span>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
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
                                />  
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                From Date*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3 picker">
                                <Field 
                                    name="fromDate" 
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
                                    name="toDate" 
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
                                    className="button"
                                    > Add
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
    return bindActionCreators({ addNewDeal, getCitiesList, getMerchantListWithFilter }, dispatch)
  }

  AddNewDeal = reduxForm({
    form: 'frmAddNewDeal',
})(AddNewDeal)

AddNewDeal = connect(
    state => ({
       userData: state.accountValidate === undefined ? undefined : state.accountValidate,
       newDealResponse: state.deal === undefined ? undefined : state.deal.addDeal,
       citiesPayload: state.deal.citiesList === undefined ? undefined : state.deal.citiesList,
       merchantPayload: state.merchant.merchantList === undefined ? undefined : state.merchant.merchantList,
    }),
    mapDispatchToProps,
    null,
    { pure: false },
  )(AddNewDeal)

export default AddNewDeal;