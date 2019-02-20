//react redux
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';

//material-ui
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

//Components
import {renderSelectField} from '../../components/selectControl';
import DialogBox from '../../components/alertDialog'
import InputField from '../../components/inputField';
import Loader from '../../components/loader'

//Actions
import { updateTicketType, clearNewTicketTypeResponse } from '../../actions/ticketAction';

//Validation
import {required, dropDownRequired, between1to100} from '../../utilities/validation'

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

class UpdateTicket extends Component {

    state = {
        dialogOpen: false,
    };

    componentWillMount() {
        errorMessage = "";
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (nextProps.updateTicketResponse){
              if(nextProps.updateTicketResponse.status === 200){
                  this.setState({message: nextProps.updateTicketResponse.message})
                  this.setState({ dialogOpen: true });
                  this.setState({showLoader:false})
              }
              else{
                errorMessage =
                <div 
                    className="errorDiv"
                >{nextProps.updateTicketResponse.message}</div>
                this.setState({showLoader:false})
              }

              this.props.clearNewTicketTypeResponse();
            }
        }
    }   

    onSubmit(values) {
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.updateTicketType(values, this.props.userData.user.responseData.token)
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.props.history.push('/managetickets');
    };

    cancelClick(){
        this.props.history.push('/managetickets');
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
                            <FormLabel component="legend">UPDATE TICKET TYPE</FormLabel>
                            </div>                            
                        </div>

                        <Divider style={{marginBottom:'20px'}}/>

                        <div className="row middle-md">
                            <div className="col-xs-12 col-sm-3 col-md-3">
                                    Ticket Name*
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-3">
                                <Field 
                                    myType="text" 
                                    name="ticketTypeName" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={[required, between1to100]}
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
    return bindActionCreators({ updateTicketType, clearNewTicketTypeResponse }, dispatch)
  }

  UpdateTicket = reduxForm({
    form: 'frmUpdateTicket',
})(UpdateTicket)

UpdateTicket = connect(
    state => ({
       userData: state.accountValidate === undefined ? undefined : state.accountValidate,
       initialValues: state.ticket.ticketTypeDetails === undefined ? undefined : state.ticket.ticketTypeDetails.responseData,
       updateTicketResponse: state.ticket.updateTicketType === undefined ? undefined : state.ticket.updateTicketType,
    }),
    mapDispatchToProps,
    null,
    { pure: false },
  )(UpdateTicket)

export default UpdateTicket;