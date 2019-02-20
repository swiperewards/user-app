//react redux
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';

//material-ui
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

//Components
import DialogBox from '../../components/alertDialog'
import InputField from '../../components/inputField';
import {renderSelectField} from '../../components/selectControl';
import Loader from '../../components/loader'
import TextAreaControl from '../../components/textAreaControl';

//Actions
import { getMerchantListWithFilter } from '../../actions/merchantAction';
import { getQueryType, generateTicket, clearGenerateTicketResponse } from '../../actions/ticketAction';

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

class ContactUs extends Component {

    constructor(props) {
        super(props)
        this.state = {
            merchantList:undefined,
            dialogOpen: false,
            message:'',
            showLoader: false,
            queryTypeList:'',
        }
    }

    componentWillMount(){
        errorMessage = "";

        if(this.props.userData.user.responseData.token){
            this.props.getQueryType(this.props.userData.user.responseData.token);
            this.props.getMerchantListWithFilter(this.props.userData.user.responseData.userId,"","","",this.props.userData.user.responseData.token);
        }
    }

      handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

      componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (nextProps.merchantPayload){
                if(nextProps.merchantPayload.status === 200){
                    this.setState({merchantList: nextProps.merchantPayload.responseData})
                }
            }

          if (nextProps.queryTypeResponse){
            if(nextProps.queryTypeResponse.status === 200){
                this.setState({queryTypeList: nextProps.queryTypeResponse.responseData})
            }
          }

          if (nextProps.generateTicketResponse){
            if(nextProps.generateTicketResponse.status === 200){
                this.setState({message: nextProps.generateTicketResponse.message})
                this.setState({ dialogOpen: true });
                this.setState({showLoader:false})
            }
            else{
                errorMessage =
                    <div 
                        className="errorDiv"
                    >{nextProps.generateTicketResponse.message}</div>
                    this.setState({showLoader:false})
            }

            this.props.clearGenerateTicketResponse()
          }
        }
    }

      onSubmit(values) {

        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.generateTicket(values, this.props.userData.user.responseData.token)
        }
      }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        window.location.reload();
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

                <Paper className="pagePaper" style={{backgroundImage: `url(${"/images/map.png"})`, backgroundSize: "100%"}}>
                    <Paper className="pagePaper" style={{margin:"10% 15%"}}>
                          <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-xs-12 titleLabel">
                                            Contact us
                                        </div> 
                                    </div>   
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <span>
                                                We help make your business succeed. That includes immediate support. Have an issue? Send a ticket, and get it resolved fast.
                                            </span>
                                        </div> 
                                    </div>  
                                    <div className="row">
                                        <div className="col-xs-12 titleLabel">
                                            Details
                                        </div> 
                                    </div> 
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <span>
                                                <a href="mailto:contact@nouvo.io">contact@nouvo.io</a><br/>
                                                <span className="dashboardText">
                                                323-386-9100<br/>
                                                1433 N Harper Ave,<br/>
                                                West Hollywood, CA 90046
                                                </span>

                                            </span>
                                        </div> 
                                    </div>  
                                </div>
                                <div className="col-xs-6">
                                    <div className="row">
                                        <div className="col-xs-12 titleLabel">
                                            Send a Message
                                        </div>
                                    </div>    
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <label className="controlLabel">Name</label>
                                            <Field 
                                                name="fullName" 
                                                fullWidth={true} 
                                                component={InputField} 
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <label className="controlLabel">Email</label>
                                            <Field 
                                                name="emailId" 
                                                fullWidth={true} 
                                                component={InputField} 
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    {
                                        (this.state.merchantList) ? 
                                            (this.state.merchantList.length !== 0) ? 
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <label className="controlLabel">Business Name</label>

                                                        <FormControl style={styles.formControl}>
                                                            <Field
                                                                name="merchantId"
                                                                component={renderSelectField}
                                                                fullWidth={true}
                                                                onChange={this.handleChange}
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
                                                                        <MenuItem 
                                                                                style={styles.selectControl}
                                                                                key="none"
                                                                                value="None">
                                                                                {"None"}
                                                                        </MenuItem>
                                                            }
                                                            </Field>    
                                                        </FormControl>  
                                                    </div>
                                                </div>
                                            :
                                                null
                                        :
                                            null
                                    }
                                    <div className="row">
                                        <div className="col-xs-12">
                                             <label className="controlLabel">Query Type</label>

                                            <FormControl style={styles.formControl}>
                                                <Field
                                                    name="ticketType"
                                                    component={renderSelectField}
                                                    fullWidth={true}
                                                    onChange={this.handleChange}
                                                >
                                                {
                                                     (this.state.queryTypeList) ? 
                                                        this.state.queryTypeList.map((item) =>{
                                                            return <MenuItem 
                                                                    style={styles.selectControl}
                                                                    key={item.id}
                                                                    value={item.id}>
                                                                    {item.ticketTypeName}
                                                            </MenuItem>
                                                            })
                                                        :
                                                        null
                                                }
                                                </Field>    
                                            </FormControl>  
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <label className="controlLabel">Message</label>
                                            <Field 
                                                name="message" 
                                                fullWidth={true} 
                                                component={TextAreaControl} 
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <button 
                                                type="submit"
                                                className="button"
                                                > Send Message
                                            </button> 
                                        </div>
                                    </div>
                                </div>
                          </div>          
                    </Paper>
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
    return bindActionCreators({ getQueryType, generateTicket, clearGenerateTicketResponse, getMerchantListWithFilter }, dispatch)
  }

  ContactUs = reduxForm({
    form: 'frmContactUs',
})(ContactUs)

ContactUs = connect(
    state => ({
       initialValues: state.accountValidate === undefined ? undefined : state.accountValidate.user.responseData,
       userData: state.accountValidate === undefined ? undefined : state.accountValidate,
       queryTypeResponse: state.ticket === undefined ? undefined : state.ticket.queryType,
       generateTicketResponse : state.ticket.generateTicket === undefined ? undefined : state.ticket.generateTicket, 
       merchantPayload: state.merchant.merchantList === undefined ? undefined : state.merchant.merchantList,
    }),
    mapDispatchToProps,
    null,
    { pure: false },
  )(ContactUs)

export default ContactUs;