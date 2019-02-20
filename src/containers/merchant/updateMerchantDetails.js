//react redux
import React, { Component } from 'react';
import { reduxForm } from 'redux-form'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import FormLabel from '@material-ui/core/FormLabel';

//Containers
import UpdateBusinessDetails from '../../containers/merchant/updateMerchantBusiness';
import UpdateOwnerDetails from '../../containers/merchant/updateMerchantOwners';
import UpdateAccountSetup from '../../containers/merchant/updateMerchantAccountSetup';
import UpdateBankAccount from '../../containers/merchant/updateMerchantBankAccount';

//Components
import Loader from '../../components/loader'

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
  
  //Function to navigate to respective step based on active index
  function getStepContent(stepIndex, merchantId) {
    switch (stepIndex) {
      case 0:
        return (<UpdateBusinessDetails merchant= {merchantId}/>);
      case 1:
        return (<UpdateOwnerDetails merchant= {merchantId}/>);
      case 2:
        return (<UpdateAccountSetup merchant= {merchantId}/>);
      case 3:
        return (<UpdateBankAccount merchant= {merchantId}/>);
      default:
        return 'Uknown stepIndex';
    }
  }

  let errorMessage

class UpdateMerchant extends Component {

    state = {
        activeStep: 0,
        completed: new Set(),
      };

      handleStep = step => () => {
        this.setState({
          activeStep: step,
        });
      };

      isStepComplete(step) {
        return this.state.completed.has(step);
      }

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;

        return (
            <div>
                <Loader status={this.state.showLoader} />
                <div>
                    <Paper className="pagePaper">
                        <div className="formContent">
                                <div className="appTitleLabel">
                                  <FormLabel component="legend">UPDATE MERCHANT</FormLabel>
                                </div>

                                <div className={classes.root}>
                                    <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                                        {steps.map((label, index) => {
                                            return (
                                            <Step key={label}>
                                                <StepButton
                                                  onClick={this.handleStep(index)}
                                                  completed={this.isStepComplete(index)}
                                                >
                                                  {label}
                                                </StepButton>
                                            </Step>
                                            );
                                        })}
                                    </Stepper>
                                    <div>
                                       {
                                          getStepContent(activeStep, 
                                          this.props.location.state !== undefined ? this.props.location.state.detail : undefined)
                                        }
                                    </div>
                                </div>
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

UpdateMerchant.propTypes = {
    classes : PropTypes.object,
}

UpdateMerchant = connect(
  state => ({
    userData: state.accountValidate === undefined ? undefined : state.accountValidate,
  }),
)(UpdateMerchant)

export default reduxForm({
  form: 'FrmUpdateMerchant',
})(withStyles(styles)(UpdateMerchant))