//react redux
import React, { Component } from 'react';
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import AddIcon from '@material-ui/icons/Add';

//Components
import TablePaginationActions from '../../components/tableGrid';
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader'

//Actions
import { getTicketTypes, getTicketTypeDetails, clearGetTicketTypeResponse, deleteTicketType, clearDeleteTicketTypeResponse } from '../../actions/ticketAction';

class ManageTickets extends Component {

    state = {
        ticketTypeList:undefined,
        page: 0,
        rowsPerPage: 5,
        dialogOpen: false,
        disableReset: true,
        permissionDisplayBox: false,
    };

    componentWillMount()
    {
        this.getTicketTypeList();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
          if (nextProps.ticketTypePayload){
            if(nextProps.ticketTypePayload.status === 200){
                this.setState({showLoader:false})
                this.setState({ticketTypeList: nextProps.ticketTypePayload.responseData})
            }
          }
          
          if(nextProps.deleteTicketResponse){
            this.setState({showLoader:false})
            if(nextProps.deleteTicketResponse.status === 200){
                this.setState({ dialogOpen: true });
                this.getTicketTypeList();
            }

            this.props.clearDeleteTicketTypeResponse()
          }
        }
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    getTicketTypeList(){
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getTicketTypes(this.props.userData.user.responseData.token)
        }
        else{
            //#TODO : Handle token expire case
        }
    }

    deleteTicketType = (ticketId) => {

        if (this.state.permissionDisplayBox) {
            this.handleClose();
            if(this.props.userData.user.responseData.token){
                this.setState({showLoader:true})
                this.props.deleteTicketType(this.state.ticketId, this.props.userData.user.responseData.token);
            }
            else{
                //#TODO: Handle token expire case here
            }
        }
        else{
            this.setState({ permissionDisplayBox: true, ticketId: ticketId });
        }
    }

    updateTicket = (ticketId) => {

        if(this.props.userData.user.responseData.token){
            this.props.getTicketTypeDetails(ticketId, this.props.userData.user.responseData.token)
            this.props.clearGetTicketTypeResponse()
            this.props.history.push('/updateTicket')
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.setState({ permissionDisplayBox: false });
    };

    addNewTicket(){
        this.props.history.push('/addNewTicket')
    }

    render() {

        const { ticketTypeList, rowsPerPage, page, dialogOpen, permissionDisplayBox } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, (ticketTypeList !== undefined ? ticketTypeList.length : 0) - page * rowsPerPage);

        const actions = [
            <Button key="ok" onClick={this.handleClose} color="primary" autoFocus>
                OK
            </Button>
        ];

        const permissionActions = [
            <Button key="no" onClick={this.handleClose} color="primary">
                No
            </Button>,
            <Button key="yes" onClick={this.deleteTicketType} color="primary" autoFocus>
                Yes
            </Button>,
        ];

        return (
          <div className="row">
            <div className="col-xs-12">
            <Loader status={this.state.showLoader} />

            <div>
                <DialogBox 
                    displayDialogBox={dialogOpen} 
                    message="Ticket deleted successfully" 
                    actions={actions} 
                />
                <DialogBox 
                    displayDialogBox={permissionDisplayBox} 
                    message="Are you sure to delete ticket type?" 
                    actions={permissionActions} 
                />
            </div> 

            <div className="row">
            <div className="col-xs-12">
            <Paper className="pagePaper">
                <form size='large' className="form-horizontal">
                    <div className="row appTitleLabel">
                        MANAGE TICKET TYPE
                    </div>
                    <div className="row middle-md">
                        <div className="col-xs-12 col-sm-6 col-md-9">
                            Number of Types : <b>{ticketTypeList !== undefined ? ticketTypeList.length : "0"}</b>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3 end-md">
                            <Button 
                            variant="fab"
                            type="button"
                            color="primary"
                            onClick={this.addNewTicket.bind(this)}
                            style={{backgroundColor:'#27A24F'}}
                            > <AddIcon /></Button> 
                        </div>
                    </div>
                </form>
            </Paper> 
            </div>
            </div>
            <div className="row">
            <div className="col-xs-12">
                    <Paper className="pagePaper">
                    <div className="tableWrapperMaterial">
                    <Table className="tableMaterial">
                        <TableHead>
                            <TableRow>
                                <TableCell numeric>#</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { 
                            (ticketTypeList !== undefined) ? (
                            (ticketTypeList.length === 0) ? 
                                (
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                        <TableCell colSpan={5}>
                                            <div className="dashboardText" style={{textAlign:"center", width:"100%"}} ><b>No Record Found</b></div>
                                        </TableCell>
                                    </TableRow>
                                )
                                : (
                                ticketTypeList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((object, index) => {
                                    return (
                                    <TableRow className="tableRow" key={object.id}>
                                        <TableCell numeric>{object.serial_number}</TableCell>
                                        <TableCell>{object.ticketTypeName}</TableCell>
                                        <TableCell>
                                            <div className={object.status === 0 ? "titleRed" : "titleGreen"}>
                                                <FormLabel component="label" style={{color:'white', fontSize:'12px'}}>{object.status === 0 ? "Deactive" : "Active"}</FormLabel>
                                            </div>
                                        </TableCell>
                                        <TableCell> 

                                            <div className="row start-xs" style={{marginRight:'0px',marginBottom:'0px'}}>
                                                <div className="col-xs-6">
                                                    <button 
                                                        type="button" 
                                                        disabled={object.inactive_v === 1 ? true : false} 
                                                        onClick={() => this.updateTicket(object.id)} 
                                                        className={object.inactive_v === 1 ? "disabledButton" : "enabledButton"}
                                                        style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                        > 
                                                        <img src="../images/ic_edit.svg" alt="" /> 
                                                    </button>
                                                </div>
                                                <div className="col-xs-6">
                                                    <button 
                                                        type="button" 
                                                        disabled={object.inactive_v === 1 ? true : false}
                                                        onClick={() => this.deleteTicketType(object.id)} 
                                                        className={object.inactive_v === 1 ? "disabledButton" : "enabledButton"}
                                                        style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                        > 
                                                        <img src="../images/ic_delete.svg" alt="" />
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
                                        <TableCell colSpan={5}>
                                            <div className="dashboardText" style={{textAlign:"center", width:"100%"}} ><b>No Record Available</b></div>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                colSpan={5}
                                count={(ticketTypeList !== undefined) ? ticketTypeList.length : 0}
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
    return bindActionCreators({ getTicketTypes, getTicketTypeDetails, clearGetTicketTypeResponse, deleteTicketType, clearDeleteTicketTypeResponse }, dispatch)
  }
  
  ManageTickets = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      ticketTypePayload: state.ticket.ticketTypeList === undefined ? undefined : state.ticket.ticketTypeList,
      deleteTicketResponse: state.ticket.deleteTicketType === undefined ? undefined : state.ticket.deleteTicketType
    }),
    mapDispatchToProps,
  )(ManageTickets)
  
  export default reduxForm({form: 'FrmManageTickets'})(ManageTickets)