//react redux
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//material-ui
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

//Components
import InputField from '../../components/inputField';
import {renderSelectField} from '../../components/selectControl';
import Loader from '../../components/loader'
import RedeemRequestList from '../../containers/redemption/redeemRequestList'

//Actions
import { 
    getRedeemRequestList, 
    getRedeemModeList,
} from '../../actions/redeemAction';

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

class ManageRedemption extends Component {

    state = {
        name:'',
        status: '',
        mode:'',
        fromDate:'',
        toDate:'',
        redeemList:'',
        redeemSummary:'',
        redeemModeList:'',
    };

    componentWillMount()
    {
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getRedeemModeList(this.props.userData.user.responseData.token)
        }

        this.getAllRedeemRequests();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps) {

          if (nextProps.redeemRequestPayload){
            if(nextProps.redeemRequestPayload.status === 200){
                if(nextProps.redeemRequestPayload.responseData){
                    this.setState({showLoader:false})
                    this.setState({redeemList: nextProps.redeemRequestPayload.responseData.redeemRequests})
                    this.setState({redeemSummary: nextProps.redeemRequestPayload.responseData.summary})
                }
            }
          }

          if (nextProps.redeemModePayload){
            if(nextProps.redeemModePayload.status === 200){
                this.setState({showLoader:false})
                this.setState({redeemModeList: nextProps.redeemModePayload.responseData})
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

    getAllRedeemRequests(){
        if(this.props.userData.user.responseData.token){
            this.setState({showLoader:true})
            this.props.getRedeemRequestList(this.state.name, this.state.status, this.state.mode, this.state.fromDate, this.state.toDate, this.props.userData.user.responseData.token)
        }
        else{
            //#TODO : Handle token expire case
        }
    }

    onHandleSearch(){
        this.child.searchHandler();
    }

    onHandleReset(){
        this.setState({name:''});
        this.setState({status:''});
        this.setState({mode:''});
        this.setState({fromDate:''});
        this.setState({toDate:''});
        this.setState({disableReset:true});
        this.props.reset();
        this.child.resetHandler();
    }

    render() {
        return (
          <div className="row">
            <div className="col-xs-12">
            <Loader status={this.state.showLoader} />

            <div className="row">
            <div className="col-xs-12">
            <Paper className="pagePaper">
                <div className="row appTitleLabel">
                    REDEEM REQUESTS
                </div>
                <div className="row middle-md">
                    <div className="col-xs-12 col-sm-6 col-md-2">
                        Pending : &nbsp; <span style={{color:"#E77F25"}}><b>{this.state.redeemSummary.pending === undefined ? "0" : this.state.redeemSummary.pending}</b></span>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-2">
                        Approved : &nbsp; <span style={{color:"#2EC55D"}}><b>{this.state.redeemSummary.approved === undefined ? "0" : this.state.redeemSummary.approved}</b></span>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-2">
                        Rejected : &nbsp; <span style={{color:"#DE3630"}}><b>{this.state.redeemSummary.rejected === undefined ? "0" : this.state.redeemSummary.rejected}</b></span>
                    </div>
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
                                Data.redeemStatus.map((item) =>{
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
                    <div className="col-xs-12 col-sm-6 col-md-2">
                        <FormControl style={styles.formControl}>
                            <Field
                                name="mode"
                                component={renderSelectField}
                                fullWidth={true}
                                onChange={this.handleChange}
                                displayEmpty
                                >
                                <MenuItem value="" disabled>
                                    Mode
                                </MenuItem>
                                {
                                    this.state.redeemModeList ?
                                        this.state.redeemModeList.map((item) =>{
                                            return <MenuItem 
                                                style={styles.selectControl}
                                                key={item.modeId}
                                                value={item.mode}>
                                                {item.mode}
                                            </MenuItem>
                                        })
                                    : null    
                                }
                            </Field>    
                        </FormControl>  
                    </div>    
                    <div className="col-xs-12 col-sm-6 col-md-2">
                        <Field 
                        myType="date"
                        name="fromDate" 
                        fullWidth={true} 
                        component={InputField} 
                        onChange={this.handleChange}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-2">
                        <Field 
                        myType="date"
                        name="toDate" 
                        myPlaceHolder="To Date" 
                        fullWidth={true} 
                        component={InputField} 
                        onChange={this.handleChange}
                        />
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-2">
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
                </div>
            </Paper> 
            </div>
            </div>

            <RedeemRequestList 
                name={this.state.name}
                status={this.state.status}
                mode={this.state.mode}
                fromDate={this.state.fromDate}
                toDate={this.state.toDate}
                onRef={ref => (this.child = ref)} 
            />

        </div> 
        </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({  
        getRedeemRequestList, 
        getRedeemModeList,
    }, dispatch)
  }
  
  ManageRedemption = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      redeemRequestPayload: state.redeem.redeemRequestList === undefined ? undefined : state.redeem.redeemRequestList,
      redeemModePayload: state.redeem.redeemModeList === undefined ? undefined : state.redeem.redeemModeList,
    }),
    mapDispatchToProps,
  )(ManageRedemption)
  
  export default reduxForm({form: 'FrmManageRedemption'})(ManageRedemption)