//react redux
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NumberFormat from "react-number-format";

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
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';

//Components
import InputField from '../../components/inputField';
import TablePaginationActions from '../../components/tableGrid';
import {renderSelectField} from '../../components/selectControl';
import DialogBox from '../../components/alertDialog'
import Loader from '../../components/loader'

//Actions
import { getAdminListWithFilter, deleteAdmin, getAdminDetails } from '../../actions/adminAction';

//Data
import Data from '../../staticData';

const styles = {
    formControl: {
        minWidth: '100%',
        marginLeft:'0px',
      },
      selectControl:{
        fontSize: '12px',
      },
};

class ManageAdmins extends Component {

    state = {
        name:'',
        status: '',
        adminList:undefined,
        page: 0,
        rowsPerPage: 5,
        dialogOpen: false,
        disableReset: true,
        permissionDisplayBox: false,
    };

    componentWillMount()
    {
        this.getAllAdmins();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
          if (nextProps.adminPayload){
            if(nextProps.adminPayload.status === 200){
                this.setState({adminList: nextProps.adminPayload.responseData})
                this.setState({showLoader:false})
            }
          }
          
          if(nextProps.adminDelete){
            if(nextProps.adminDelete.status === 200){
                this.setState({ dialogOpen: true });
                this.getAllAdmins();
                this.setState({showLoader:false})
            }
          }
        }
    }

    //Method to handle change event for dropdown
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });

        if(event.target.value !== undefined || event.target.value !== ""){
            this.setState({disableReset:false});
        }
        else{
            this.setState({disableReset:true});
        }
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    getAllAdmins(){
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getAdminListWithFilter(this.state.name, this.state.status, this.props.userData.user.responseData.token)
        }
        else{
            //#TODO : Handle token expire case
        }
    }

    onHandleSearch(){
        this.getAllAdmins();
    }

    deleteAdminById = (adminId) => {

        if (this.state.permissionDisplayBox) {
            this.handleClose();
            if(this.props.userData.user.responseData.token){
                this.setState({showLoader:true})
                this.props.deleteAdmin(this.state.adminId, this.props.userData.user.responseData.token);
            }
            else{
                //#TODO: Handle token expire case here
            }
        }
        else{
            this.setState({ permissionDisplayBox: true, adminId: adminId });
        }
    }

    updateAdmin = (adminId) => {

        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getAdminDetails(adminId, this.props.userData.user.responseData.token)
            this.props.history.push('/updateAdmin')
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.setState({ permissionDisplayBox: false });
    };

    addNewAdmin(){
        this.props.history.push('/addNewAdmin')
    }

    onHandleReset(){
        this.setState({name:''});
        this.setState({status:''});
        this.setState({location:''});
        this.setState({disableReset:true});
        this.props.reset();

        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:false})
            this.props.getAdminListWithFilter("", "", this.props.userData.user.responseData.token)
        }
    
    }

    render() {

        const { adminList, rowsPerPage, page, dialogOpen, permissionDisplayBox } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, (adminList !== undefined ? adminList.length : 0) - page * rowsPerPage);

        const actions = [
            <Button key="ok" onClick={this.handleClose} color="primary" autoFocus>
                OK
            </Button>
        ];

        const permissionActions = [
            <Button key="no" onClick={this.handleClose} color="primary">
                No
            </Button>,
            <Button key="yes" onClick={this.deleteAdminById} color="primary" autoFocus>
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
                    message="Admin deleted successfully" 
                    actions={actions} 
                />

                <DialogBox 
                    displayDialogBox={permissionDisplayBox} 
                    message="Are you sure to delete admin?" 
                    actions={permissionActions} 
                />
            </div> 

            <div className="row">
            <div className="col-xs-12">
            <Paper className="pagePaper">
                <form size='large' className="form-horizontal">
                    <div className="row appTitleLabel">
                        MANAGE ADMIN
                    </div>
                    <div className="row middle-md">
                        <div className="col-xs-12 col-sm-6 col-md-2">
                            <Field 
                            type="text"
                            name="name" 
                            myPlaceHolder="Name" 
                            fullWidth={true} 
                            component={InputField} 
                            onChange={this.handleChange}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-2">
                            <FormControl style={styles.formControl}>
                                <Field
                                    name="status"
                                    component={renderSelectField}
                                    fullWidth={true}
                                    onChange={this.handleChange}
                                    displayEmpty
                                    >
                                    <MenuItem value="" disabled>
                                        Status
                                    </MenuItem>
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
                        <div className="col-xs-12 col-sm-6 col-md-5">
                            <button 
                                type="button"
                                onClick={this.onHandleReset.bind(this)}
                                style={{backgroundColor:'#BCBCBC'}}
                                disabled={this.state.disableReset}
                                className={this.state.disableReset ? "disabledButton button" : "enabledButton button"}
                                > Reset
                            </button>
                            <button 
                                type="button"
                                onClick={this.onHandleSearch.bind(this)}
                                className="button"
                                > Search
                            </button> 
                        </div>       
                        <div className="col-xs-12 col-sm-6 col-md-3 end-md">
                            <Button 
                            variant="fab"
                            type="button"
                            color="primary"
                            onClick={this.addNewAdmin.bind(this)}
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
                                <TableCell>Photo</TableCell>
                                <TableCell>Admin Name</TableCell>
                                <TableCell>Email Address</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { 
                            (adminList !== undefined) ? (
                            (adminList.length === 0) ? 
                                (
                                    <TableRow style={{ height: 48 * emptyRows}}>
                                        <TableCell colSpan={7}>
                                            <div className="dashboardText" style={{textAlign:"center", width:"100%"}} ><b>No Record Found</b></div>
                                        </TableCell>
                                    </TableRow>                                
                                )
                                : (
                                adminList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((object, index) => {
                                    return (
                                    <TableRow className="tableRow" key={object.userId}>
                                        <TableCell numeric>{object.serial_number}</TableCell>
                                        <TableCell>
                                            <Avatar
                                                alt="profile"
                                                src={object.profilePicUrl !== null ? object.profilePicUrl :  "../images/profile.png"}
                                                className="bigAvatar"
                                            />
                                        </TableCell>
                                        <TableCell>{object.fullName}</TableCell>
                                        <TableCell>{object.emailId}</TableCell>
                                        <TableCell><NumberFormat value={object.contactNumber} displayType={'text'} format="+1 (###) ###-####" /></TableCell>
                                        <TableCell>
                                            <div className={object.status === 0 ? "titleRed" : "titleGreen"}><FormLabel component="label" style={{color:'white', fontSize:'12px'}}>{object.status === 0 ? "Deactive" : "Active"}</FormLabel></div>
                                        </TableCell>
                                        <TableCell> 
                                        <div className="row start-xs" style={{marginRight:'0px',marginBottom:'0px'}}>
                                                <div className="col-xs-6">
                                                    <button 
                                                        type="button" 
                                                        disabled={object.inactive_v === 1 ? true : false} 
                                                        onClick={() => this.updateAdmin(object.userId)}
                                                        className="enabledButton"
                                                        style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                        > 
                                                        <img src="../images/ic_edit.svg" alt="" /> 
                                                    </button>
                                                </div>
                                                <div className="col-xs-6">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => this.deleteAdminById(object.userId)} 
                                                        className="enabledButton"
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
                                count={(adminList !== undefined) ? adminList.length : 0}
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
    return bindActionCreators({ getAdminListWithFilter, deleteAdmin, getAdminDetails }, dispatch)
  }
  
  ManageAdmins = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      adminPayload: state.admin.adminList === undefined ? undefined : state.admin.adminList,
      adminDelete: state.admin.deleteAdmin === undefined ? undefined : state.admin.deleteAdmin
    }),
    mapDispatchToProps,
  )(ManageAdmins)
  
  export default reduxForm({form: 'FrmManageAdmins'})(ManageAdmins)