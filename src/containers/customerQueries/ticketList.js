//react redux
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextAreaControl from '../../components/textAreaControl';

//Components
import TablePaginationActions from '../../components/tableGrid';
import {renderSelectField} from '../../components/selectControl';
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader'

//Actions
import 
{ 
    getQueryType, 
    getCustomerQueryList, 
    getCustomerQueryDetails, 
    clearCustomerQueryDetailsResponse,
    manageCustomerQueryDetails, 
    resolveCustomerQueryDetails,
    clearResolveCustomerQueryResponse,
    clearManageCustomerQueryResponse,
} from '../../actions/ticketAction';

//Data
import Data from '../../staticData';

import {between1to500} from '../../utilities/validation'

const styles = {
    formControl: {
        minWidth: '100%',
        marginLeft:'0px',
      },
      selectControl:{
        fontSize: '12px',
      },
};

class TicketList extends Component {

    state = {
        ticketList:undefined,
        queryTypeList:'',
        responseMessage: '',
        page: 0,
        rowsPerPage: 5,
        dialogOpen: false,
        disableReset: true,
        openManageTicketPopUp: false,
        openResolveTicketPopUp: false,
    };

    //Get status text based on status value 
    statusText(status) {
        switch(status) {
          case 2:
            return "Resolved";
          case 1:
            return "Pending";  
          case 3:
            return "Rejected";
          default:
            return "Pending";
        }
      }

    //Get status color based on status value 
    statusColor(status) {
        switch(status) {
          case 2:
            return "titleGreen";
          case 1:
            return "titleOrange";  
          case 3:
            return "titleRed";
          default:
            return "titleOrange";
        }
      }

    componentWillMount()
    {
        this.props.onRef(this);
        if(this.props.userData.user.responseData.token){
            this.props.getQueryType(this.props.userData.user.responseData.token);
            this.getAllCustomerQueries()
        }
    }

    componentWillUnmount() {
       this.props.onRef(undefined)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {

            if (nextProps.CustomerQueriesResponse){
                if(nextProps.CustomerQueriesResponse.status === 200){
                    this.setState({showLoader:false})
                    this.setState({ticketList: nextProps.CustomerQueriesResponse.responseData})
                }
            }

            if (nextProps.queryTypeResponse){
                if(nextProps.queryTypeResponse.status === 200){
                    this.setState({showLoader:false})
                    this.setState({queryTypeList: nextProps.queryTypeResponse.responseData})
                }
            }

            if (nextProps.manageQueryResponse){
                this.setState({showLoader:false})
                this.setState({dialogOpen: true});
                this.setState({responseMessage: nextProps.manageQueryResponse.message});
                this.props.clearManageCustomerQueryResponse();
            }

            if (nextProps.resolveQueryResponse){
                this.setState({showLoader:false})
                this.setState({dialogOpen: true});
                this.setState({responseMessage: nextProps.resolveQueryResponse.message});
                this.props.clearResolveCustomerQueryResponse();
                this.getAllCustomerQueries();
            }

            if( nextProps.initialValues && nextProps.initialValues !== this.props.initialValues){
                this.setState({showLoader:false})
                this.props.change('description',nextProps.initialValues.feedback)
                this.props.change('ticketTypeId', nextProps.initialValues.ticketTypeId)
                this.props.change('ticketStatus', (nextProps.initialValues.status).toString())
                this.props.change('feedback', nextProps.initialValues.replyDescription)
                this.props.change('reply', nextProps.initialValues.replyMessage)
            }
        }
    }

    searchHandler(){
        this.getAllCustomerQueries();
    }

    resetHandler(){
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:false})
            this.props.getCustomerQueryList("", "", "", "", this.props.userData.user.responseData.token)
        }    
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    getAllCustomerQueries(){

        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getCustomerQueryList(this.props.username, this.props.status, this.props.userType, this.props.ticketType, this.props.userData.user.responseData.token)
        }
        else{
            //#TODO : Handle token expire case
        }
    }

    resolveTicket = (ticketId) => {
        if(this.props.userData.user.responseData.token){
            this.resetTicketFields(ticketId)
            this.setState({ openResolveTicketPopUp: true});
        }
        else{
            //#TODO: Handle token expire case here
        }
    }

    manageTicket = (ticketId) => {
        if(this.props.userData.user.responseData.token){
            this.resetTicketFields(ticketId)
            this.setState({ openManageTicketPopUp: true });
        }
    }

    resetTicketFields = (ticketId) => {
        this.props.clearCustomerQueryDetailsResponse();
        this.props.change('description', '')
        this.props.change('ticketTypeId', '')
        this.props.change('ticketStatus', '')
        this.props.change('feedback', '')
        this.props.change('reply', '')
        this.setState({ticketId: ticketId})
        this.props.getCustomerQueryDetails(ticketId, this.props.userData.user.responseData.token)

    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.setState({ openManageTicketPopUp: false });
        this.setState({ openResolveTicketPopUp: false});

        if(this.props.action !== undefined){
            this.props.action()
            this.getAllCustomerQueries();
        }
    };

    onSubmit(values) {
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.handleClose()
            if(this.state.openManageTicketPopUp){
                this.props.manageCustomerQueryDetails(this.state.ticketId, values, this.props.userData.user.responseData.token)
            }
            else{
                this.props.resolveCustomerQueryDetails(this.state.ticketId, values, this.props.userData.user.responseData.token)
            }
        }
    }

    render() {
        const { ticketList, rowsPerPage, page, dialogOpen, openManageTicketPopUp, openResolveTicketPopUp, responseMessage } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, (ticketList !== undefined ? ticketList.length : 0) - page * rowsPerPage);

        const actions = [
            <Button key="ok" onClick={this.handleClose.bind(this)} color="primary" autoFocus>
                OK
            </Button>
        ];

        return (
  
          <div className="row">
            <div className="col-xs-12">
            <Loader status={this.state.showLoader} />

            <div>
                <DialogBox 
                    displayDialogBox={dialogOpen} 
                    message={responseMessage} 
                    actions={actions} 
                />
            </div> 
            <div>
                <Dialog
                    open={openManageTicketPopUp || openResolveTicketPopUp}
                    onClose={this.handleClose.bind(this)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth = {'sm'}
                >
                <div>
                    <form onSubmit={this.props.handleSubmit((event) => this.onSubmit(event))}>

                    <DialogContent>
                        <div className="row center-xs">
                            <div className="appTitleLabel">
                                {this.state.openManageTicketPopUp ? "MANAGE TICKET" : "RESOLVE TICKET"}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6 end-xs"> 
                                Ticket No   :
                            </div>
                            <div className="col-xs-6"> 
                                <b>{this.props.initialValues !== undefined ? this.props.initialValues.ticketNumber : ""}</b> 
                            </div>
                        </div>   
                        <div className="row">
                            <div className="col-xs-6 end-xs"> 
                                User ID    : 
                            </div>
                            <div className="col-xs-6"> 
                                <b>{this.props.initialValues !== undefined ? this.props.initialValues.userId : ""}</b> 
                            </div>
                        </div>   
                        {
                            openResolveTicketPopUp ? 
                                <div className="row center-xs">
                                    <div className="col-xs-6">
                                        <FormControl style={styles.formControl}>
                                            <Field
                                                name="ticketStatus"
                                                component={renderSelectField}
                                                fullWidth={true}
                                                onChange={this.handleChange}
                                                displayEmpty
                                                >
                                                <MenuItem value="" disabled>
                                                    Status
                                                </MenuItem>
                                                {
                                                Data.queryStatus.map((item) =>{
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
                            : null
                        }    
                        <div className="row center-xs">
                            <div className="col-xs-6"> 
                                <FormControl style={styles.formControl}>
                                    <Field
                                        name="ticketTypeId"
                                        component={renderSelectField}
                                        onChange={this.handleChange}
                                        fullWidth={true} 
                                        displayEmpty
                                        >
                                        <MenuItem value="" disabled>
                                            Ticket Type
                                        </MenuItem>
                                        {
                                        (this.state.queryTypeList) ? 
                                            this.state.queryTypeList.map((item) =>{
                                                return <MenuItem 
                                                    style={styles.selectControl}
                                                    key={item.id}
                                                    value={item.id}>
                                                    {item.ticketTypeName}
                                                </MenuItem>
                                            }) : null
                                        }
                                    </Field>    
                                </FormControl>  
                            </div>
                            
                        </div>  
                        <div className="row center-xs">
                            <div className="col-xs-6">
                                <label className="controlLabel">Description</label>
                                <Field 
                                    name="description" 
                                    fullWidth={true} 
                                    component={TextAreaControl} 
                                    validate={between1to500}
                                />
                            </div>
                            {
                                openResolveTicketPopUp ?
                                <div className="col-xs-6">
                                    <label className="controlLabel">Note</label>
                                    <Field 
                                        name="reply" 
                                        fullWidth={true} 
                                        component={TextAreaControl} 
                                        validate={between1to500}
                                    />
                                </div> : 
                                    <div className="col-xs-6">
                                    <label className="controlLabel">Note</label>
                                    <Field 
                                        name="feedback" 
                                        fullWidth={true} 
                                        component={TextAreaControl} 
                                        validate={between1to500}
                                    />
                                </div>
                            }
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button 
                            type="button"
                            style={{backgroundColor:'#BCBCBC'}}
                            className="enabledButton button"
                            onClick={this.handleClose.bind(this)}
                            > Cancel
                        </button>
                        <button 
                            type="submit"
                            className="enabledButton button"
                            > Submit
                        </button> 
                    </DialogActions>
                    </form>
                </div> 
                </Dialog>
            </div>
            <div className="row">
            <div className="col-xs-12">
                <Paper className="pagePaper">
                    <div className="tableWrapperMaterial">
                    <Table className="tableMaterial">
                        <TableHead>
                            <TableRow>
                                <TableCell numeric>#</TableCell>
                                <TableCell>Ticket No</TableCell>
                                <TableCell>User Name</TableCell>
                                <TableCell>Email Address</TableCell>
                                <TableCell>User Type</TableCell>
                                <TableCell>Ticket Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { 
                            (ticketList !== undefined) ? (
                            (ticketList.length === 0) ? 
                                (
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                        <TableCell colSpan={8}>
                                            <div className="dashboardText" style={{textAlign:"center", width:"100%"}} ><b>No Record Found</b></div>
                                        </TableCell>
                                    </TableRow>                                
                                )
                                : (
                                ticketList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((object, index) => {
                                    return (
                                    <TableRow className="tableRow" key={object.serial_number}>
                                        <TableCell numeric>{object.serial_number}</TableCell>
                                        <TableCell>{object.ticketNumber}</TableCell>
                                        <TableCell>{object.fullName}</TableCell>
                                        <TableCell>{object.emailId}</TableCell>
                                        <TableCell>{object.userCategory}</TableCell>
                                        <TableCell>{object.ticketTypeName}</TableCell>
                                        <TableCell>
                                            <div className={this.statusColor(object.status)}><FormLabel component="label" style={{color:'white', fontSize:'12px'}}>{this.statusText(object.status)}</FormLabel></div>
                                        </TableCell>
                                        <TableCell> 
                                            <div className="row start-xs" style={{marginRight:'0px',marginBottom:'0px'}}>
                                                <div className="col-xs-6">
                                                    <button 
                                                        type="button" 
                                                        disabled={object.status === 2 ? true : false}  
                                                        onClick={() => this.manageTicket(object.id)} 
                                                        className={object.status === 2 ? "disabledButton" : "enabledButton"}
                                                        style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                        > 
                                                        <img src="../images/ic_edit.svg" alt="" /> 
                                                    </button>
                                                </div>
                                                <div className="col-xs-6">
                                                    <button 
                                                        type="button" 
                                                        disabled={object.status === 2 ? true : false}
                                                        onClick={() => this.resolveTicket(object.id)} 
                                                        className={object.status === 2 ? "disabledButton" : "enabledButton"}
                                                        style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                        > 
                                                        <img src="../images/ic_respond.svg" alt="" />
                                                    </button>
                                                </div>
                                            </div>
                                        </TableCell>    
                                    </TableRow>
                                    );
                                })
                                )
                                ):(
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                        <TableCell colSpan={8}>
                                            <div className="dashboardText" style={{textAlign:"center", width:"100%"}} ><b>No Record Available</b></div>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                colSpan={8}
                                count={(ticketList !== undefined) ? ticketList.length : 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                    </div>
                </Paper>
              </div>
            </div>   
        </div> 
        </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ 
        getQueryType, 
        getCustomerQueryList, 
        getCustomerQueryDetails, 
        clearCustomerQueryDetailsResponse, 
        manageCustomerQueryDetails, 
        resolveCustomerQueryDetails,
        clearResolveCustomerQueryResponse,
        clearManageCustomerQueryResponse, 
    }, dispatch)
  }
  
  TicketList = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      queryTypeResponse: state.ticket === undefined ? undefined : state.ticket.queryType,
      CustomerQueriesResponse: state.ticket.customerQueriesList === undefined ? undefined : state.ticket.customerQueriesList,
      initialValues: state.ticket.customerQueryDetails === undefined ? undefined : state.ticket.customerQueryDetails.responseData,
      manageQueryResponse: state.ticket.manageCustomerQuery === undefined ? undefined : state.ticket.manageCustomerQuery,
      resolveQueryResponse: state.ticket.resolveCustomerQuery === undefined ? undefined : state.ticket.resolveCustomerQuery, 
    }),
    mapDispatchToProps,
  )(TicketList)
  
  export default reduxForm({form: 'FrmTicketList'})(TicketList)