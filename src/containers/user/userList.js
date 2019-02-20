//react redux
import React, { Component } from 'react';
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NumberFormat from "react-number-format";

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

//Components
import TablePaginationActions from '../../components/tableGrid';
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader'

//Actions
import { getUsersByFilter, deleteUser, getUserDetails, clearUserDetails, clearUserDeleteResponse } from '../../actions/userAction';

class UserList extends Component {

    state = {
        usersList:undefined,
        page: 0,
        rowsPerPage: 5,
        dialogOpen: false,
        disableReset: true,
        permissionDisplayBox: false,
        message:'',
    };

    componentWillMount()
    {
        this.props.onRef(this)
        this.getAllUsers();
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
          if (nextProps.userPayload){
            if(nextProps.userPayload.status === 200){
                this.setState({showLoader:false})
                this.setState({usersList: nextProps.userPayload.responseData})
            }
          }
          
          if(nextProps.deleteUserResponse){
            if(nextProps.deleteUserResponse.status === 200){
                this.setState({message:nextProps.deleteUserResponse.message});
                this.setState({showLoader:false})
                this.setState({ dialogOpen: true });
                this.getAllUsers();
            }
            this.props.clearUserDeleteResponse();
          }
        }
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    getAllUsers(){
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getUsersByFilter(this.props.name, this.props.status, this.props.userType, this.props.userData.user.responseData.token)
        }
        else{
            //#TODO : Handle token expire case
        }
    }

    searchHandler(){
        this.getAllUsers();
    }

    deleteUserById = (userId, inactive) => {

        if (this.state.permissionDisplayBox) {
            this.handleClose();
            if(this.props.userData.user.responseData.token){
                this.setState({showLoader:true})
                this.props.deleteUser(this.state.userId, this.state.inactive, this.props.userData.user.responseData.token);
            }
            else{
                //#TODO: Handle token expire case here
            }
        }
        else{
            this.setState({ permissionDisplayBox: true, userId: userId, inactive : inactive });
        }
    }

    updateUser = (userId) => {

        this.props.clearUserDetails();

        if(this.props.userData.user.responseData.token){
            this.props.getUserDetails(userId, this.props.userData.user.responseData.token)
        }

        this.props.history.push('/updateUser')
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.setState({ permissionDisplayBox: false });
    };

    resetHandler(){

        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getUsersByFilter("", this.props.resetStatus === true ? "" : "1", this.props.resetUserType === true ? "" : "Merchant" ,this.props.userData.user.responseData.token)
        }
    }

    handleClick = (event, id, email, source, businessCount) => {
        if(source === "ManageMerchant"){
            this.props.history.push({pathname:'/manageBusiness',state: { userId: id, emailId: email }})
        }
        else if(source === "MerchantList"){
            if(businessCount > 0){
                this.props.history.push({pathname:'/addNewDeal',state: { userId: id, emailId: email }})
            }
            else{
                this.setState({message:"Business unavailable for selected user, user should have an active business to add new deal."});
                this.setState({ dialogOpen: true })
            }
        }
    }

    render() {

        const { usersList, rowsPerPage, page, dialogOpen, permissionDisplayBox,inactive } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, (usersList !== undefined ? usersList.length : 0) - page * rowsPerPage);
        
        const actions = [
            <Button key="ok" onClick={this.handleClose} color="primary" autoFocus>
                OK
            </Button>
        ];

        const permissionActions = [
            <Button key="no" onClick={this.handleClose} color="primary">
                No
            </Button>,
            <Button key="yes" onClick={this.deleteUserById} color="primary" autoFocus>
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
                    message={this.state.message} 
                    actions={actions} 
                />

                <DialogBox 
                    displayDialogBox={permissionDisplayBox} 
                    message={inactive === false ? "Are you sure to deactivate user?" : "Are you sure to activate user?"}
                    actions={permissionActions} 
                />
            </div> 

            <div className="row">
            <div className="col-xs-12">
                    <Paper className="pagePaper">
                    <div className="tableWrapperMaterial">
                    <Table className="tableMaterial">
                        <TableHead>
                            <TableRow>
                                <TableCell numeric>#</TableCell>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email Address</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>User Type</TableCell>
                                <TableCell>Status</TableCell>
                                {
                                    this.props.source === "ManageUsers" ?
                                        <TableCell>Actions</TableCell>
                                    :
                                    null
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { 
                            (usersList !== undefined) ? (
                            (usersList.length === 0) ? 
                                (
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                        <TableCell colSpan={7}>
                                            <div className="dashboardText" style={{textAlign:"center", width:"100%"}} ><b>No Record Found</b></div>
                                        </TableCell>
                                    </TableRow>
                                )
                                : (
                                usersList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((object, index) => {
                                    return (
                                    <TableRow 
                                        className="tableRow" 
                                        key={object.serial_number}
                                        hover={this.props.isClick ? true : false}
                                        onClick={this.props.isClick ? event => this.handleClick(event, object.userId, object.emailId, this.props.source, object.businessCount) : null} 
                                    >
                                        <TableCell numeric>{object.serial_number}</TableCell>
                                        <TableCell>{object.fullName}</TableCell>
                                        <TableCell>{object.emailId}</TableCell>
                                        <TableCell><NumberFormat value={object.contactNumber} displayType={'text'} format="+1 (###) ###-####" /></TableCell>
                                        <TableCell>{object.roleId === 3 ? "Merchant" : "Customer"}</TableCell>
                                        <TableCell>
                                            <div className={object.status === 0 ? "titleRed" : "titleGreen"}>
                                                <FormLabel component="label" style={{color:'white', fontSize:'12px'}}>{object.status === 0 ? "Deactive" : "Active"}</FormLabel>
                                            </div>
                                        </TableCell>

                                        {
                                            this.props.source === "ManageUsers" ?
                                                <TableCell> 
                                                    <div className="row start-xs" style={{marginRight:'0px',marginBottom:'0px'}}>
                                                        <div className="col-xs-6">
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => this.updateUser(object.userId)} 
                                                                    className="enabledButton"
                                                                    style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                                    > 
                                                                    <img src="../images/ic_edit.svg" alt="" /> 
                                                                </button>
                                                            </div>
                                                            <div className="col-xs-6">
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => this.deleteUserById(object.userId, !object.status)} 
                                                                    className="enabledButton"
                                                                    style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                                    > 
                                                                    {
                                                                        object.status === 0 ?
                                                                            <img src="../images/switch_off.svg" alt="" />
                                                                        :
                                                                            <img src="../images/switch_on.svg" alt="" />
                                                                    }
                                                                </button>
                                                            </div>
                                                        </div>
                                                </TableCell>    
                                            :
                                            null
                                        }
                                         
                                    </TableRow>
                                    );
                                })
                                )
                                ):(
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                        <TableCell colSpan={7}>
                                            <div className="dashboardText" style={{textAlign:"center", width:"100%"}} ><b>No Record Available</b></div>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                colSpan={7}
                                count={(usersList !== undefined) ? usersList.length : 0}
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
    return bindActionCreators({ getUsersByFilter, deleteUser, getUserDetails, clearUserDetails, clearUserDeleteResponse }, dispatch)
  }
  
  UserList = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      deleteUserResponse: state.userAccount.deleteUser === undefined ? undefined : state.userAccount.deleteUser,
      userPayload: state.userAccount.userList === undefined ? undefined : state.userAccount.userList,
    }),
    mapDispatchToProps,
  )(UserList)
  
  export default reduxForm({form: 'FrmUserList'})(UserList)