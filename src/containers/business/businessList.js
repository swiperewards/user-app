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
import { getMerchantListWithFilter, deleteMerchant } from '../../actions/merchantAction';

class BusinessList extends Component {

    state = {
        merchantList:undefined,
        page: 0,
        rowsPerPage: 5,
        dialogOpen: false,
        permissionDisplayBox: false,
        disableReset: true,
        merchantId:'',
        message:'',
    };

    componentWillMount()
    {
        this.props.onRef(this)
        this.getAllMerchants();
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
     }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
          if (nextProps.merchantPayload){
            if(nextProps.merchantPayload.status === 200){
                this.setState({showLoader:false})
                this.setState({merchantList: nextProps.merchantPayload.responseData})
            }
            else{
                this.setState({showLoader:false})
            }
          }
        
          if(nextProps.merchantDelete){
            if(nextProps.merchantDelete.status === 200){
                this.setState({showLoader:false})
                this.setState({ dialogOpen: true });
                this.setState({message:nextProps.merchantDelete.message});
                this.getAllMerchants();
            }
            else{                
                this.setState({showLoader:false})
            }
          }
        }
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    getAllMerchants(){
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getMerchantListWithFilter(this.props.userId,this.props.name,this.props.status,this.props.location,this.props.userData.user.responseData.token)
        }
        else{
            //#TODO : Handle token expire case
        }
    }

    searchHandler(){
        this.getAllMerchants();
    }


    deleteMerchant = (merchantId, inactive) => {
        if (this.state.permissionDisplayBox) {
            this.handleClose();
            if(this.props.userData.user.responseData.token){
                this.setState({showLoader:true})
                this.props.deleteMerchant(this.state.merchantId, this.state.inactive, this.props.userData.user.responseData.token);
            }
            else{
                //#TODO: Handle token expire case here
            }
        }
        else{
            this.setState({ permissionDisplayBox: true, merchantId: merchantId, inactive : inactive });
        }
        
    }

    updateMerchant = (merchantId) => {
        this.props.history.push({pathname:'/updateMerchant',state: { detail: merchantId }})
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.setState({ permissionDisplayBox: false });
    };

    resetHandler(){

        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getMerchantListWithFilter(this.props.userId,"", "", "",this.props.userData.user.responseData.token)
        }
    
    }

    

    render() {

        const { merchantList, rowsPerPage, page, dialogOpen, permissionDisplayBox, inactive } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, (merchantList !== undefined ? merchantList.length : 0) - page * rowsPerPage);

        const actions = [
            <Button key="ok" onClick={this.handleClose} color="primary" autoFocus>
                OK
            </Button>
        ];

        const permissionActions = [
            <Button key="no" onClick={this.handleClose} color="primary">
                No
            </Button>,
            <Button key="yes" onClick={this.deleteMerchant} color="primary" autoFocus>
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
                    message=  {inactive === true ? "Are you sure to deactivate merchant account?" : "Are you sure to activate merchant account?"}
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
                                <TableCell>Merchant Name</TableCell>
                                <TableCell>Business Name</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Email Address</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { 
                            (merchantList !== undefined) ? (
                            (merchantList.length === 0) ? 
                                (
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                        <TableCell colSpan={7}>
                                            <div className="dashboardText" style={{textAlign:"center", width:"100%"}} ><b>No Record Found</b></div>
                                        </TableCell>
                                    </TableRow>                                
                                )
                                : (
                                merchantList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((object, index) => {
                                    return (
                                    <TableRow 
                                        className="tableRow" 
                                        key={object.id}                                        
                                    >
                                        <TableCell numeric>{object.serial_number}</TableCell>
                                        <TableCell>{object.first_v + " " + object.last_v}</TableCell>
                                        <TableCell>{object.name_v}</TableCell>
                                        <TableCell>{object.city_v}</TableCell>
                                        <TableCell>{object.email_v}</TableCell>
                                        <TableCell><NumberFormat value={object.phone_v} displayType={'text'} format="+1 (###) ###-####" /></TableCell>
                                        <TableCell>
                                            <div className={object.inactive_v === 1 ? "titleRed" : "titleGreen"}><FormLabel component="label" style={{color:'white', fontSize:'12px'}}>{object.status}</FormLabel></div>
                                        </TableCell>
                                        <TableCell> 
                                            <div className="row start-xs" style={{marginRight:'0px',marginBottom:'0px'}}>
                                                <div className="col-xs-6">
                                                    <button 
                                                        type="button" 
                                                        disabled={object.inactive_v === 1 ? true : false} 
                                                        onClick={() => this.updateMerchant(object.id)} 
                                                        className={object.inactive_v === 1 ? "disabledButton" : "enabledButton"}
                                                        style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                        > 
                                                        <img src="../images/ic_edit.svg" alt="" /> 
                                                    </button>
                                                </div>
                                                <div className="col-xs-6">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => this.deleteMerchant(object.id, !object.inactive_v)} 
                                                        className="enabledButton"
                                                        style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                        > 
                                                        {
                                                            object.inactive_v === 1 ?
                                                                <img src="../images/switch_off.svg" alt="" />
                                                            :
                                                                <img src="../images/switch_on.svg" alt="" />
                                                        }
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
                                count={(merchantList !== undefined) ? merchantList.length : 0}
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
    return bindActionCreators({ getMerchantListWithFilter, deleteMerchant }, dispatch)
  }
  
  BusinessList = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      merchantPayload: state.merchant.merchantList === undefined ? undefined : state.merchant.merchantList,
      merchantDelete: state.merchant.deleteMerchant === undefined ? undefined : state.merchant.deleteMerchant
    }),
    mapDispatchToProps,
  )(BusinessList)
  
  export default reduxForm({form: 'FrmBusinessList'})(BusinessList)