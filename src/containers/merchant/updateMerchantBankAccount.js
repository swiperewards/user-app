//react redux
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

//Validation
import {required, dropDownRequired, between5to16, between5to9} from '../../utilities/validation'

//Components
import InputField from '../../components/inputField';
import DialogBox from '../../components/alertDialog';
import {renderSelectField} from '../../components/selectControl';
import Loader from '../../components/loader'

//Actions
import { getMerchantDetailsAPI, updateMerchantDetails, clearMerchantUpdateState } from '../../actions/merchantAction';

//Data
import Data from '../../staticData'

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

class UpdateBankAccount extends Component {

    state = {
        account: '',
        merchantObject:'',
        openAlert:false,
      };

      handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

      componentWillMount(){
        this.setState({ openAlert: false });
        this.props.clearMerchantUpdateState()
        errorMessage = undefined

        this.getMerchantDetails()
      }
    
      componentWillReceiveProps(nextProps) {

        if (nextProps) {
          if (nextProps.updateBankResponse){
            this.setState({showLoader:false})
            nextProps.updateBankResponse.forEach(response => {
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
                this.getMerchantDetails()
                this.handleOpenAlert()
            }

            this.props.clearMerchantUpdateState()

          }
        }
        
      }

      getMerchantDetails(){
        if(this.props.userData.user.responseData.token && this.props.merchant){
            this.props.getMerchantDetailsAPI(this.props.merchant, this.props.userData.user.responseData.token)
        }
      }

      handleOpenAlert = () => {
        this.setState({ openAlert: true });
      };

      handleCloseAlert = () => {
        this.setState({ openAlert: false });
      };

      onSubmit(values) {

        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            errorMessage = undefined
            this.props.updateMerchantDetails(values, "bankAccount", "", this.props.userData.user.responseData.token)
        }
      }

    render() {
        const { pristine, submitting } = this.props
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
                            <FormLabel component="legend">ADD BANK ACCOUNT</FormLabel>
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
                    <Divider style={{marginBottom:'20px'}}/>
                    <div className="row middle-md">
                        <div className="col-xs-12 col-sm-6 col-md-3" >
                            Bank Account Type*
                        </div>    
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <FormControl style={styles.formControl}>
                                    <Field
                                        name="bankAccountType"
                                        component={renderSelectField}
                                        fullWidth={true}
                                        validate={dropDownRequired}
                                    >
                                    {
                                        Data.bankAccountType.map((item) =>{
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
                            Bank Routing Number*
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <Field 
                                myType="number" 
                                name="routeNumber" 
                                fullWidth={true} 
                                component={InputField} 
                                validate={[required, between5to9]}/>  
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            Bank Account Number*
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">    
                            <Field 
                                myType="number" 
                                name="accountNumber" 
                                fullWidth={true} 
                                component={InputField} 
                                validate={[required, between5to16]}/>  
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
    return bindActionCreators({ getMerchantDetailsAPI, updateMerchantDetails, clearMerchantUpdateState }, dispatch)
  }

UpdateBankAccount = reduxForm({
    form: 'frmUpdateBankAccount',
})(UpdateBankAccount)

UpdateBankAccount = connect(
    state => ({
        userData: state.accountValidate === undefined ? undefined : state.accountValidate,
        updateBankResponse: state.merchant.updateMerchant === undefined ? undefined : state.merchant.updateMerchant.responseData,
        initialValues: state.merchant.merchantDetails === undefined ? undefined : state.merchant.merchantDetails.responseData
    }),
    mapDispatchToProps,
    null,
    { pure: false },
  )(UpdateBankAccount)


export default UpdateBankAccount