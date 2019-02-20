//react redux
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, FieldArray } from 'redux-form';

//material-ui
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

//Components
import DialogBox from '../../components/alertDialog'
import InputField from '../../components/inputField';
import Loader from '../../components/loader'
import {renderSelectField} from '../../components/selectControl';

//Actions
import { updateRedeemMode, clearUpdateRedeemDetailsResponse } from '../../actions/redeemAction';

//Validation
import {required, dropDownRequired, between1to100} from '../../utilities/validation'

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
        flexBasis: '100.0%',
      },
      buttonColumn: {
        flexBasis: '10.0%',
        float:'right',
        padding:'0px',
      },
  };

  let renderOptions = ({ fields, meta: { touched, error, submitFailed } }) => {

    return(  
    <React.Fragment>
        {   
         fields.map((member, idx) =>
            <div style={styles.root} key={'fragment' + idx}>
                <Paper style={{width:'60%', padding:'15px'}}>

                    <div style={styles.buttonColumn}>
                        <button
                        type="button"
                        title="Remove Member"
                        onClick={() => fields.remove(idx)}
                        > 
                            <DeleteIcon />
                        </button>
                    </div>
                    <div className="row middle-md">
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            Option { idx+1 }*
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6">
                            <Field 
                                myType="text" 
                                name={`${member}.optionName`} 
                                fullWidth={true} 
                                component={InputField} 
                                validate={[required, between1to100]}
                            />  
                        </div>
                    </div>
                 </Paper>
            </div>
        )}
        <div style={{marginTop:'10px'}}>
            <button 
                type="button" 
                onClick={() => fields.push({})} 
                className="button"
                style={{backgroundColor:'#27A24F'}}>
                + Add additional option
            </button>           
        </div>
    </React.Fragment>
    )
}

class UpdateRedeemMode extends Component {

    state = {
        dialogOpen: false,
    };

    componentWillMount() {
        errorMessage = "";
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (nextProps.updateRedeemResponse){
              if(nextProps.updateRedeemResponse.status === 200){
                  this.setState({message: nextProps.updateRedeemResponse.message})
                  this.setState({ dialogOpen: true });
                  this.setState({showLoader:false})
              }
              else{
                errorMessage =
                <div 
                    className="errorDiv"
                >{nextProps.updateRedeemResponse.message}</div>
                this.setState({showLoader:false})
              }

              this.props.clearUpdateRedeemDetailsResponse();
            }
        }
    }  

    cancelClick(){
        this.props.history.goBack();
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.props.history.push('/manageredeemmode');
    };

    onSubmit(values) {
        errorMessage = "";
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.updateRedeemMode(values, this.props.userData.user.responseData.token)
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
                            <FormLabel component="legend">UPDATE REDEEM MODE</FormLabel>
                            </div>                            
                        </div>

                        <Divider style={{marginBottom:'20px'}}/>

                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-3 col-md-2">
                                    Mode Name*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="modeName" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={[required,between1to100]}
                                    disabled={true}
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
                        <div className="row">
                            <div className="col-md-12">
                                <Divider style={{marginBottom:'20px'}} />
                                <FieldArray name="options" component={renderOptions}/>
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
    return bindActionCreators({ updateRedeemMode, clearUpdateRedeemDetailsResponse }, dispatch)
  }

  UpdateRedeemMode = reduxForm({
    form: 'frmUpdateRedeemMode',
})(UpdateRedeemMode)

UpdateRedeemMode = connect(
    state => ({
       userData: state.accountValidate === undefined ? undefined : state.accountValidate,
       initialValues: state.redeem.redeemModeDetails === undefined ? undefined : state.redeem.redeemModeDetails.responseData,
       updateRedeemResponse : state.redeem.updateRedeemMode === undefined ? undefined : state.redeem.updateRedeemMode,
    }),
    mapDispatchToProps,
    null,
    { pure: false },
  )(UpdateRedeemMode)

export default UpdateRedeemMode;