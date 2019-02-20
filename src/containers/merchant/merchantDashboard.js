//react redux
import React, { Component } from 'react';
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DealList from '../../containers/deals/dealList';

//material-ui
import Paper from '@material-ui/core/Paper';

//Actions
import { getDashboardDetails } from '../../actions/dashboardAction';

class MerchantDashboard extends Component {

    state = {
    };

    componentWillMount()
    {
        this.getAllDashboardDetails();
    }

    getAllDashboardDetails(){
        if(this.props.userData.user.responseData.token){
            this.props.getDashboardDetails(this.props.userData.user.responseData.token)
        }
        else{
            //#TODO : Handle token expire case
        }
    }

    render() {

        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <Paper className="pagePaper">
                            <form size='large' className="form-horizontal">
                                <div className="row">
                                    <div className="col-xs-12 col-sm-12 col-md-3">
                                        <div className="dashboardBox">
                                            <span className="dashboardText"> Total </span>
                                            <div className="dashboardText"> <b>REGISTERED USERS</b> </div>
                                            <div className="dashboardCountText">{this.props.initialValues !== undefined ? (this.props.initialValues.responseData ? this.props.initialValues.responseData.totalRegisteredUsersCount : "0")  : "0"}</div>
                                            <div><hr className="dashboardLine"/></div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-3">
                                        <div className="dashboardBox">
                                            <span className="dashboardText"> Transactions </span>
                                            <div className="dashboardText"> <b>IN ACTIVE POOL</b></div>
                                            <div className="dashboardCountText">{this.props.initialValues !== undefined ? (this.props.initialValues.responseData ? this.props.initialValues.responseData.transactionsInActivePool : "0") : "0"}</div>
                                            <div><hr className="dashboardLine"/></div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-3">
                                        <div className="dashboardBox">
                                            <span className="dashboardText"> Total </span>
                                            <div className="dashboardText"> <b>POOL AMOUNT</b></div>
                                            <div className="dashboardCountText">{this.props.initialValues !== undefined ? (this.props.initialValues.responseData ? this.props.initialValues.responseData.totalPoolAmount : "0") : "0"}</div>
                                            <div><hr className="dashboardLine"/></div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-3">
                                        <div className="dashboardBox">
                                            <span className="dashboardText"> Total </span>
                                            <div className="dashboardText"> <b>DEALS</b></div>
                                            <div className="dashboardCountText">{this.props.initialValues !== undefined ? (this.props.initialValues.responseData ? this.props.initialValues.responseData.totalDealsCount : "0") : "0"}</div>
                                            <div><hr className="dashboardLine"/></div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </Paper> 
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                            <div className="appTitleLabel">Recent Deals</div>
                            <DealList 
                                name=""
                                status=""
                                location="" 
                                fromDate=""
                                toDate=""
                                history={this.props.history}
                                onRef={ref => (this.child = ref)} 
                                action={this.getAllDashboardDetails.bind(this)}
                            />
                    </div>
                </div>
            </div>
        ) 
    }
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ getDashboardDetails }, dispatch)
  }
  
  MerchantDashboard = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      initialValues: state.dashboard.dashboardDetails === undefined ? undefined : state.dashboard.dashboardDetails,
    }),
    mapDispatchToProps,
  )(MerchantDashboard)
  
  export default reduxForm({form: 'FrmMerchantDashboard'})(MerchantDashboard)