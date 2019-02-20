//react redux
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';

//material-ui
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

//Components
import DialogBox from '../../components/alertDialog'
import InputField from '../../components/inputField';
import Loader from '../../components/loader'

//Actions
import { createTicketType, clearNewTicketTypeResponse } from '../../actions/ticketAction';

//Validation
import {required, between1to100} from '../../utilities/validation'

let errorMessage

class AddNewTicket extends Component {

    state = {
        dialogOpen: false,
    };

    componentWillMount() {
        errorMessage = "";
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (nextProps.newTicketResponse){
              if(nextProps.newTicketResponse.status === 200){
                this.setState({showLoader:false})
                  this.setState({message: nextProps.newTicketResponse.message})
                  this.setState({ dialogOpen: true });
              }
              else{
                errorMessage =
                <div 
                    className="errorDiv"
                >{nextProps.newTicketResponse.message}</div>
                this.setState({showLoader:false})
              }

              this.props.clearNewTicketTypeResponse();
            }
        }
    }   

    onSubmit(values) {
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.createTicketType(values, this.props.userData.user.responseData.token)
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.props.history.push('/managetickets');
    };

    cancelClick(){
        this.props.history.goBack();
    }

    render() {
        const {  dialogOpen } = this.state;

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
                            <FormLabel component="legend">ADD TICKET TYPE</FormLabel>
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
                                    name="ticketName" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    validate={[required, between1to100]}
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
    return bindActionCreators({ createTicketType, clearNewTicketTypeResponse }, dispatch)
  }

  AddNewTicket = reduxForm({
    form: 'frmAddNewTicket',
})(AddNewTicket)

AddNewTicket = connect(
    state => ({
       userData: state.accountValidate === undefined ? undefined : state.accountValidate,
       newTicketResponse: state.ticket.createTicketType === undefined ? undefined : state.ticket.createTicketType,
    }),
    mapDispatchToProps,
    null,
    { pure: false },
  )(AddNewTicket)

export default AddNewTicket;