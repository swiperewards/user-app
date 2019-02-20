//react redux
import React, { Component } from 'react';
import { reduxForm, formValueSelector } from 'redux-form'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import DialogBox from '../../components/alertDialog'


//Containers
import BusinessDetails from '../../containers/merchant/merchantBusinessDetails';
import OwnerDetails from '../../containers/merchant/merchantOwnerDetails';
import AccountSetup from '../../containers/merchant/merchantAccountSetup';
import BankAccount from '../../containers/merchant/merchantBankAccount';

//Components
import Loader from '../../components/loader'

//Actions
import { addNewMerchant, ClearMerchantState } from '../../actions/merchantAction';
import { getUserProfile } from '../../actions/accountAction';

const styles = theme => ({
    root: {
      width: '100%',
    },
    backButton: {
      marginRight: theme.spacing.unit,
    },
    instructions: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
    bootstrapRoot: {
    borderRadius: 1,
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: '14px',
    padding: '6px 12px',
    border: '1px solid',
    backgroundColor: '#53c1ff',
    borderColor: '#53c1ff',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#337ab7',
      borderColor: '#2e6da4',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#337ab7',
      borderColor: '#2e6da4',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  },
  });

  function getSteps() {
    return ['About the Business', 'About the Owners', 'Account Setup', 'Add Bank Account'];
  }
  
  let errorMessage

class AddMerchant extends Component {

    state = {
        status: '',
        location:'',
        activeStep: 0,
        open: false,
        merchantLogo: undefined,
      };

      onImageChange = (file) =>{

        this.setState({merchantLogo: file});
      }

      //Function to navigate to respective step based on active index
      getStepContent(stepIndex) {
        switch (stepIndex) {
          case 0:            
            return (<BusinessDetails imageData={this.onImageChange} />);
          case 1:
            return (<OwnerDetails myProps={this.props.businessType} />);
          case 2:
            return (<AccountSetup myProps={this.props} />);
          case 3:
            return (<BankAccount />);
          default:
            return 'Uknown stepIndex';
        }
      }

      handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

      handleNext = () => {
        const { activeStep } = this.state;
        this.setState({
          activeStep: activeStep + 1,
        });
      };
    
      handleBack = () => {
        const { activeStep } = this.state;
        this.setState({
          activeStep: activeStep - 1,
        });
      };
    
      handleReset = () => {
        this.setState({
          activeStep: 0,
        });
      };

      onSubmit(values) {
        const steps = getSteps();
        const { activeStep } = this.state;
        if (activeStep < steps.length-1){
          this.setState({
            activeStep: activeStep + 1,
          });
        }
        else{
          this.setState({showLoader:true})
          let registerEmailId
          if(this.props.userData.user.responseData.role === 'merchant'){
            registerEmailId = this.props.userData.user.responseData.emailId
          }
          else{
            registerEmailId = this.props.location.state ? this.props.location.state.emailId : ""
          }

          this.props.addNewMerchant(values, registerEmailId, this.state.merchantLogo, this.props.userData.user.responseData.token)
        }
      }

      handleClickOpen = () => {
        this.setState({ open: true });
      };
    
      handleClose = () => {
        this.setState({ open: false });
        if(this.props.userData.user.responseData.role === 'merchant'){
          this.props.history.push('/paymentprocessing');
        }
        else{
          this.props.history.push('/managemerchants');
        }
      };

    componentWillMount()
    {
        //to clear old payment state
        this.props.ClearMerchantState();
        this.setState({open: false});
        errorMessage="";
    }

    componentWillReceiveProps(nextProps) {

      if (nextProps) {
        if (nextProps.merchantPayload){
          if(nextProps.merchantPayload.data){
            if(nextProps.merchantPayload.data.status === 200){
                errorMessage = undefined
                if(this.props.userData.user.responseData.role === 'merchant'){
                  if(this.props.userData.user.responseData.token){
                    this.props.getUserProfile(this.props.userData.user.responseData.token);
                  }
                }
                this.handleClickOpen()
            }
            else{
              if(nextProps.merchantPayload.data.status === 1082){
                errorMessage =
                nextProps.merchantPayload.data.responseData.map((error, index) =>
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
                      {nextProps.merchantPayload.data.message}
                    </div>
                }
            }
          }
        }
      }
      this.setState({showLoader:false})
    }

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;
        const actions = [
          <Button key="ok" onClick={this.handleClose} color="primary" autoFocus>
              OK
          </Button>
        ];
        return (
            <div>
                <Loader status={this.state.showLoader} />
                <div>
                  <DialogBox 
                      displayDialogBox={this.state.open} 
                      message="Congratulations! You've successfully created a new merchant account." 
                      actions={actions} 
                  />
                </div> 
                <div>
                    <Paper className="pagePaper">
                        <div className="formContent">
                            <form size='large' className="form-horizontal" autoComplete="off" onSubmit={this.props.handleSubmit((event) => this.onSubmit(event))}>
                                <div className="appTitleLabel">
                                  <FormLabel component="legend">ADD MERCHANT</FormLabel>
                                </div>

                                <div className={classes.root}>
                                    <Stepper activeStep={activeStep} alternativeLabel>
                                        {steps.map(label => {
                                            return (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                            );
                                        })}
                                    </Stepper>
                                    <div>
                                       {
                                          this.getStepContent(activeStep)
                                        }
                                    {this.state.activeStep === steps.length-1 ? (
                                        <div>
                                            <Button
                                            disabled={activeStep === 0}
                                            onClick={this.handleBack}
                                            className={classes.backButton}>
                                                Back
                                            </Button>
                                            <Button 
                                              type="submit"  
                                              variant="contained" 
                                              color='primary' 
                                              className={classNames(classes.margin, classes.bootstrapRoot)}
                                              onClick={this.props.handleSubmit((event) => this.onSubmit(event))}
                                              >
                                                 ADD NEW MERCHANT
                                            </Button>
                                        </div>
                                    ) : (                                            
                                        <div>
                                            <Button
                                            disabled={activeStep === 0}
                                            onClick={this.handleBack}
                                            className={classes.backButton}>
                                                Back
                                            </Button>
                                            <Button type="submit" variant="contained" color='primary' className={classNames(classes.margin, classes.bootstrapRoot)}>
                                                 Next
                                            </Button>
                                        </div>
                                    )}
                                    </div>
                                </div>
                            </form>
                        </div>            
                    </Paper>                    
                    <div>
                        {errorMessage}
                    </div>
                </div>
            </div>
        );
    }
}

AddMerchant.propTypes = {
    classes : PropTypes.object,
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addNewMerchant, ClearMerchantState, getUserProfile }, dispatch)
}

const selector = formValueSelector('FrmAddMerchant') // <-- same as form name

AddMerchant = connect(
  state => ({
    userData: state.accountValidate === undefined ? undefined : state.accountValidate,
    merchantPayload: state.merchant === undefined ? undefined : state.merchant,
    businessType: selector(state, 'businessType'),
  }),
  mapDispatchToProps,
  null,
    { pure: false },
)(AddMerchant)

export default reduxForm({form: 'FrmAddMerchant'})(withStyles(styles)(AddMerchant))