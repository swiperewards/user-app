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
import InputField from '../../components/inputField';
import TablePaginationActions from '../../components/tableGrid';
import {renderSelectField} from '../../components/selectControl';
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader'

//Actions
import { 
    getRedeemRequestList, 
    getRedeemRequestDetails, 
    approveRedeemRequest, 
    rejectRedeemRequest,
    getRedeemModeList,
    clearRejectRedeemResponse,
    clearApproveRedeemResponse,
} from '../../actions/redeemAction';

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

class RedeemRequestList extends Component {

    state = {
        redeemList:undefined,
        redeemSummary:'',
        redeemModeList:undefined,
        errorMessage:'',
        redeemModeId:'',
        page: 0,
        rowsPerPage: 5,
        dialogOpen: false,
        disableReset: true,
        permissionDisplayBox: false,
        openApproveRequestPopUp: false,
        openRejectRequestPopUp: false,
    };

    //Get status text based on status value 
    statusText(status) {
        switch(status) {
          case 2:
            return "Approved";
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
        this.props.onRef(this)
        if(this.props.userData.user.responseData.token){
            this.props.getRedeemModeList(this.props.userData.user.responseData.token)
        }

        this.getAllRedeemRequests();
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
     }
     
    componentWillReceiveProps(nextProps) {

        if (nextProps) {

          if (nextProps.redeemRequestPayload){
            if(nextProps.redeemRequestPayload.status === 200){
                if (nextProps.redeemRequestPayload.responseData){
                    this.setState({showLoader:false})
                    this.setState({redeemList: nextProps.redeemRequestPayload.responseData.redeemRequests})
                    this.setState({redeemSummary: nextProps.redeemRequestPayload.responseData.summary})
                }
            }
          }

          if (nextProps.redeemModePayload){
            if(nextProps.redeemModePayload.status === 200){
                if (nextProps.redeemModePayload.responseData){
                    this.setState({showLoader:false})
                    this.setState({redeemModeList: nextProps.redeemModePayload.responseData})
                }
            }
          }

          if (nextProps.approveRedeemPayload){
            this.setState({showLoader:false})
            this.setState({ dialogOpen: true });
            this.setState({errorMessage: nextProps.approveRedeemPayload.message})
            this.props.clearApproveRedeemResponse();
            this.getAllRedeemRequests();
          }

          if (nextProps.rejectRedeemPayload){
            this.setState({showLoader:false})
            this.setState({ dialogOpen: true });
            this.setState({errorMessage: nextProps.rejectRedeemPayload.message})
            this.props.clearRejectRedeemResponse();
            this.getAllRedeemRequests();
          }

          if( nextProps.initialValues && nextProps.initialValues !== this.props.initialValues){
            this.setState({showLoader:false})
            this.props.change('fullName',nextProps.initialValues.fullName)
            this.props.change('amount', (nextProps.initialValues.amount).toString())
            this.props.change('modeName', nextProps.initialValues.redeemModeId)
            this.props.change('details', nextProps.initialValues.details)
            this.props.change('extraField', nextProps.initialValues.extraField)
            this.props.change('modeOption', nextProps.initialValues.redeemModeOptionId)
            this.setState({redeemModeId : nextProps.initialValues.redeemModeId})

            }
        }
    }

    resetRedeemFields = (redeemId) => {
        this.props.change('fullName', '')
        this.props.change('amount', '')
        this.props.change('modeName', '')
        this.props.change('note','')
        this.props.change('details','')
        this.props.change('extraField','')
        this.props.change('modeOption','')

        this.setState({redeemId: redeemId})

        if(this.props.userData.user.responseData.token){
            this.props.getRedeemRequestDetails(redeemId, this.props.userData.user.responseData.token)
        }
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    getAllRedeemRequests(){
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getRedeemRequestList(this.props.name, this.props.status, this.props.mode, this.props.fromDate, this.props.toDate, this.props.userData.user.responseData.token)
        }
        else{
            //#TODO : Handle token expire case
        }
    }

    searchHandler(){
        this.getAllRedeemRequests();
    }

    resetHandler(){
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getRedeemRequestList("", "", "", "", "", this.props.userData.user.responseData.token)
        }    
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.setState({ permissionDisplayBox: false });
        this.setState({ openApproveRequestPopUp: false });
        this.setState({ openRejectRequestPopUp: false});
        if(this.props.action !== undefined){
            this.props.action()
            this.getAllRedeemRequests();
        }
    };

    rejectRedeemRequest = (redeemId) => {
        if(this.props.userData.user.responseData.token){
            this.resetRedeemFields(redeemId);
            this.setState({ openRejectRequestPopUp: true });
        }
    }

    approveRedeemRequest = (redeemId) => {
        if(this.props.userData.user.responseData.token){
            this.resetRedeemFields(redeemId);
            this.setState({ openApproveRequestPopUp: true });
        }
    }

    onSubmit(values) {
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.handleClose()
            if(this.state.openApproveRequestPopUp){
                this.props.approveRedeemRequest(this.state.redeemId, values, this.props.userData.user.responseData.token)
            }
            else{
                this.props.rejectRedeemRequest(this.state.redeemId, values, this.props.userData.user.responseData.token)
            }
        }
    }

    render() {
        const { redeemList, rowsPerPage, page, dialogOpen, permissionDisplayBox, errorMessage, openApproveRequestPopUp, openRejectRequestPopUp, redeemModeId } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, (redeemList !== undefined ? redeemList.length : 0) - page * rowsPerPage);

        const actions = [
            <Button key="ok" onClick={this.handleClose.bind(this)} color="primary" autoFocus>
                OK
            </Button>
        ];

        const permissionActions = [
            <Button key="no" onClick={this.handleClose.bind(this)} color="primary">
                No
            </Button>,
            <Button key="yes" onClick={this.rejectRedeemRequestById} color="primary" autoFocus>
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
                    message={errorMessage} 
                    actions={actions} 
                />
            </div> 

            <DialogBox 
                    displayDialogBox={permissionDisplayBox} 
                    message="Are you sure to reject redeem request?" 
                    actions={permissionActions} 
                />

            <div>
                <Dialog
                    open={openApproveRequestPopUp || openRejectRequestPopUp}
                    onClose={this.handleClose.bind(this)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth = {'xs'}
                >
                <div>
                    <form onSubmit={this.props.handleSubmit((event) => this.onSubmit(event))}>

                    <DialogContent>
                        <div className="row center-xs">
                            <div className="appTitleLabel">
                                {openApproveRequestPopUp ? "APPROVAL" : "REJECTION"}
                            </div>
                        </div>
                        <div className="row middle-xs">
                            <div className="col-xs-4 end-xs"> 
                                User Name :  
                            </div>
                            <div className="col-xs-8 start-xs"> 
                                <Field 
                                type="text"
                                name="fullName" 
                                fullWidth={true} 
                                component={InputField} 
                                onChange={this.handleChange}
                                disabled={true}
                                />
                            </div>
                        </div>   
                        <div className="row middle-xs">
                            <div className="col-xs-4 end-xs"> 
                                Amount :
                            </div>
                            <div className="col-xs-8 start-xs"> 
                                <Field 
                                    type="text"
                                    name="amount" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    onChange={this.handleChange}
                                    disabled={true}
                                    />
                            </div>
                        </div>   
                        <div className="row middle-xs">
                            <div className="col-xs-4 end-xs"> 
                                Mode :
                            </div>
                            <div className="col-xs-8 start-xs">
                                <FormControl style={styles.formControl}>
                                    <Field
                                        name="modeName"
                                        component={renderSelectField}
                                        fullWidth={true}
                                        onChange={this.handleChange}
                                        disabled={true}

                                        >                                            
                                        {
                                            this.state.redeemModeList ?
                                                this.state.redeemModeList.map((item) =>{
                                                return <MenuItem 
                                                    style={styles.selectControl}
                                                    key={item.modeId}
                                                    value={item.modeId}>
                                                    {item.mode}
                                                </MenuItem>
                                                })
                                            : null    
                                        }
                                    </Field>    
                                </FormControl> 
                            </div>    
                        </div>
                        {
                            redeemModeId === 16 || redeemModeId ===  19 ?
                                <div className="row middle-xs">
                                    <div className="col-xs-4 end-xs"> 
                                        Option :
                                    </div>
                                    <div className="col-xs-8 start-xs">
                                        <FormControl style={styles.formControl}>
                                            <Field
                                                name="modeOption"
                                                component={renderSelectField}
                                                fullWidth={true}
                                                onChange={this.handleChange}
                                                disabled={true}

                                                >                                            
                                                {
                                                    this.state.redeemModeList ?
                                                        this.state.redeemModeList.map(element => {
                                                            return (
                                                                element.modeId === redeemModeId ?
                                                                element.modeOptions.map(mode => {
                                                                        return <MenuItem 
                                                                            style={styles.selectControl}
                                                                            key={mode.modeSubId}
                                                                            value={mode.modeSubId}>
                                                                            {mode.name}
                                                                        </MenuItem>
                                                                    })
                                                                : null
                                                            )
                                                        })   
                                                    : null    
                                                }
                                            </Field>    
                                        </FormControl> 
                                    </div>
                                </div>    
                                : null  
                        }
                        <div className="row middle-xs">
                            <div className="col-xs-4 end-xs"> 
                                {
                                    this.props.initialValues?
                                        redeemModeId === 16 ? "Wallet Address :"
                                        : redeemModeId === 17 ? "Full Name :"
                                        : redeemModeId === 19 ? "Account Number :"
                                        : redeemModeId === 26 ? "Email :"
                                        : "Details"
                                    : null    
                                }
                            </div>
                            <div className="col-xs-8 start-xs">
                                <Field 
                                    type="text"
                                    name="details" 
                                    fullWidth={true} 
                                    component={InputField} 
                                    onChange={this.handleChange}
                                    disabled={true}
                                />
                                
                            </div>
                        </div>
                        {
                            redeemModeId === 17 || redeemModeId ===  19 ?
                                <div className="row middle-xs">
                                    <div className="col-xs-4 end-xs"> 
                                        {
                                            this.props.initialValues?
                                                redeemModeId === 17 ? "Address :"
                                                : redeemModeId === 19 ? "Routing Number :"
                                                : "Details"
                                            : null    
                                        }
                                    </div>
                                    <div className="col-xs-8 start-xs">
                                        <Field 
                                            type="text"
                                            name="extraField" 
                                            fullWidth={true} 
                                            component={InputField} 
                                            onChange={this.handleChange}
                                            disabled={true}
                                        />
                                        
                                    </div>
                                </div>
                                : null
                        }    
                        <div className="row middle-xs">
                            <div className="col-xs-4 end-xs"> 
                                Note :
                            </div>
                            <div className="col-xs-8 start-xs">
                                <Field 
                                    name="note" 
                                    fullWidth={true} 
                                    component={TextAreaControl} 
                                    validate={between1to500}
                                />
                            </div>
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
                            > {openApproveRequestPopUp ? "Approve" : "Reject"}
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
                                <TableCell>User Name</TableCell>
                                <TableCell>Email Address</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Mode</TableCell>
                                <TableCell>Transaction No</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { 
                            (redeemList !== undefined) ? (
                            (redeemList.length === 0) ? 
                                (
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                        <TableCell colSpan={8}>
                                            <div className="dashboardText" style={{textAlign:"center", width:"100%"}} ><b>No Record Found</b></div>
                                        </TableCell>
                                    </TableRow>
                                )
                                : (
                                redeemList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((object, index) => {
                                    return (
                                    <TableRow className="tableRow" key={object.serial_number}>
                                        <TableCell numeric>{object.serial_number}</TableCell>
                                        <TableCell>{object.fullName}</TableCell>
                                        <TableCell>{object.emailId}</TableCell>
                                        <TableCell>$ {object.amount}</TableCell>
                                        <TableCell>{object.mode}</TableCell>
                                        <TableCell>{object.transactionNumber}</TableCell>
                                        <TableCell>
                                            <div className={this.statusColor(object.status)}><FormLabel component="label" style={{color:'white', fontSize:'12px'}}>{this.statusText(object.status)}</FormLabel></div>
                                        </TableCell>
                                        <TableCell> 
                                            <div className="row start-xs" style={{marginRight:'0px',marginBottom:'0px'}}>
                                                <div className="col-xs-6">
                                                        <button 
                                                            type="button" 
                                                            disabled={object.status === 2 ? true : false} 
                                                            onClick={() => this.approveRedeemRequest(object.id)} 
                                                            className={object.status === 2 ? "disabledButton" : "enabledButton"}
                                                            style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                            > 
                                                            <img src="../images/ic_approve.svg" alt="" /> 
                                                        </button>
                                                    </div>
                                                    <div className="col-xs-6">
                                                        <button 
                                                            type="button" 
                                                            disabled={object.status === 3 ? true : false}
                                                            onClick={() => this.rejectRedeemRequest(object.id)} 
                                                            className={object.status === 3 ? "disabledButton" : "enabledButton"}
                                                            style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                            > 
                                                            <img src="../images/ic_reject.svg" alt="" />
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
                                count={(redeemList !== undefined) ? redeemList.length : 0}
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
        getRedeemRequestList, 
        getRedeemRequestDetails, 
        approveRedeemRequest, 
        rejectRedeemRequest, 
        getRedeemModeList,
        clearRejectRedeemResponse,
        clearApproveRedeemResponse,
    }, dispatch)
  }
  
  RedeemRequestList = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      redeemRequestPayload: state.redeem.redeemRequestList === undefined ? undefined : state.redeem.redeemRequestList,
      redeemModePayload: state.redeem.redeemModeList === undefined ? undefined : state.redeem.redeemModeList,
      initialValues: state.redeem.redeemRequestDetails === undefined ? undefined : state.redeem.redeemRequestDetails.responseData,
      approveRedeemPayload: state.redeem.approveRedeemRequest === undefined ? undefined : state.redeem.approveRedeemRequest,
      rejectRedeemPayload: state.redeem.rejectRedeemRequest === undefined ? undefined : state.redeem.rejectRedeemRequest,
    }),
    mapDispatchToProps,
  )(RedeemRequestList)
  
  export default reduxForm({form: 'FrmRedeemRequestList'})(RedeemRequestList)