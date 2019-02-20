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
import DialogBox from '../../components/alertDialog';
import Loader from '../../components/loader';

//Actions
import { getRedeemModeList, deleteRedeemMode, clearDeleteRedeemModeResponse, getRedeemModeDetails, clearGetRedeemModeDetailResponse } from '../../actions/redeemAction';

class ManageRedeemModes extends Component {

    state = {
        redeemModeList:undefined,
        page: 0,
        rowsPerPage: 5,
        dialogOpen: false,
        disableReset: true,
        permissionDisplayBox: false,
    };

    componentWillMount()
    {
        this.getAllRedeemModes();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {
          if (nextProps.redeemModePayload){
            if(nextProps.redeemModePayload.status === 200){
                this.setState({showLoader:false})
                this.setState({redeemModeList: nextProps.redeemModePayload.responseData})
            }
          }
        
          if(nextProps.deleteRedeemModeResponse){
            if(nextProps.deleteRedeemModeResponse.status === 200){
                this.setState({showLoader:false})
                this.setState({ dialogOpen: true });
                this.getAllRedeemModes();
            }
            this.props.clearDeleteRedeemModeResponse();
          }
        }
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    getAllRedeemModes(){
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getRedeemModeList(this.props.userData.user.responseData.token)
        }
        else{
            //#TODO : Handle token expire case
        }
    }

    onHandleSearch(){
        this.getAllRedeemModes();
    }

    deleteRedeemOption = (modeId) => {

        if (this.state.permissionDisplayBox) {
            this.handleClose();
            if(this.props.userData.user.responseData.token){
                this.setState({showLoader:true})
                this.props.deleteRedeemMode(this.state.modeId, this.props.userData.user.responseData.token);
            }
            else{
                //#TODO: Handle token expire case here
            }
        }
        else{
            this.setState({ permissionDisplayBox: true, modeId: modeId });
        }
    }

    updateRedeemMode = (modeId) => {

        if(this.props.userData.user.responseData.token){
            this.props.getRedeemModeDetails(modeId, this.props.userData.user.responseData.token)
            this.props.clearGetRedeemModeDetailResponse()
            this.props.history.push('/updateRedeemMode')
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false });
        this.setState({ permissionDisplayBox: false });
    };


    addNewMode(){
        this.props.history.push('/addNewRedeemMode')
    }

    render() {

        const { redeemModeList, rowsPerPage, page, dialogOpen, permissionDisplayBox } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, (redeemModeList !== undefined ? redeemModeList.length : 0) - page * rowsPerPage);
        const actions = [
            <Button key="ok" onClick={this.handleClose} color="primary" autoFocus>
                OK
            </Button>
        ];

        const permissionActions = [
            <Button key="no" onClick={this.handleClose} color="primary">
                No
            </Button>,
            <Button key="yes" onClick={this.deleteRedeemOption} color="primary" autoFocus>
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
                    message="Redeem mode deleted successfully" 
                    actions={actions} 
                />
                <DialogBox 
                    displayDialogBox={permissionDisplayBox} 
                    message="Are you sure to delete redeem mode?" 
                    actions={permissionActions} 
                />
            </div> 

            <div className="row">
            <div className="col-xs-12">
            <Paper className="pagePaper">
                <form size='large' className="form-horizontal">
                    <div className="row appTitleLabel">
                        MANAGE REDEEM MODES
                    </div>
                    <div className="row middle-md">
                        <div className="col-xs-12 col-sm-6 col-md-9">
                            Number of Modes : <b>{redeemModeList !== undefined ? redeemModeList.length : "0"}</b>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3 end-md">
                            <Button 
                            variant="fab"
                            type="button"
                            color="primary"
                            onClick={this.addNewMode.bind(this)}
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
                                <TableCell>Mode</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { 
                            (redeemModeList !== undefined) ? (
                            (redeemModeList.length === 0) ? 
                                (
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                        <TableCell colSpan={5}>
                                            <div className="dashboardText" style={{textAlign:"center", width:"100%"}} ><b>No Record Found</b></div>
                                        </TableCell>
                                    </TableRow>                                
                                )
                                : (
                                redeemModeList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((object, index) => {
                                    return (
                                    <TableRow className="tableRow" key={object.modeId}>
                                        <TableCell numeric>{object.serial_number}</TableCell>
                                        <TableCell>{object.mode}</TableCell>
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
                                                        onClick={() => this.updateRedeemMode(object.modeId)} 
                                                        className="enabledButton"
                                                        style={ ((index%2 !== 0) ? {backgroundColor:'#ffffff', height: '100%'} : {backgroundColor:'#f2f6f2', height:'100%'})}
                                                        > 
                                                        <img src="../images/ic_edit.svg" alt="" /> 
                                                    </button>
                                                </div>
                                                <div className="col-xs-6">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => this.deleteRedeemOption(object.modeId)} 
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
                                count={(redeemModeList !== undefined) ? redeemModeList.length : 0}
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
    return bindActionCreators({ getRedeemModeList, deleteRedeemMode, clearDeleteRedeemModeResponse, getRedeemModeDetails, clearGetRedeemModeDetailResponse }, dispatch)
  }
  
  ManageRedeemModes = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      redeemModePayload: state.redeem.redeemModeList === undefined ? undefined : state.redeem.redeemModeList,
      deleteRedeemModeResponse: state.redeem.deleteRedeemMode === undefined ? undefined : state.redeem.deleteRedeemMode,
    }),
    mapDispatchToProps,
  )(ManageRedeemModes)
  
  export default reduxForm({form: 'FrmManageRedeemModes'})(ManageRedeemModes)