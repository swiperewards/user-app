//react redux
import React, { Component } from 'react';
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Pie} from 'react-chartjs-2';
import TicketList from '../../containers/customerQueries/ticketList';

//material-ui
import Paper from '@material-ui/core/Paper';

//Actions
import { getDashboardDetails } from '../../actions/dashboardAction';

class AdminDashboard extends Component {

    state = {
        status:'1'
    };

    componentWillMount()
    {
        this.getAllDashboardDetails();
    }

    getAllDashboardDetails(){
        if(this.props.userData.user.responseData.token){
            this.props.getDashboardDetails(this.props.userData.user.responseData.token)
            this.setState({status:"1"});
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
                                            <span className="dashboardText"> Open </span>
                                            <div className="dashboardText"> <b>TICKETS</b> </div>
                                            <div className="dashboardCountText">{this.props.initialValues !== undefined ? (this.props.initialValues.responseData ? this.props.initialValues.responseData.openTicketsCount : "0")  : "0"}</div>
                                            <div><hr className="dashboardLine"/></div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-3">
                                        <div className="dashboardBox">
                                            <span className="dashboardText"> Total </span>
                                            <div className="dashboardText"> <b>USERS</b></div>
                                            <div className="dashboardCountText">{this.props.initialValues !== undefined ? (this.props.initialValues.responseData ? this.props.initialValues.responseData.totalRegisteredUsersCount : "0") : "0"}</div>
                                            <div><hr className="dashboardLine"/></div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-3">
                                        <div className="dashboardBox">
                                            <span className="dashboardText"> Total </span>
                                            <div className="dashboardText"> <b>MERCHANTS</b></div>
                                            <div className="dashboardCountText">{this.props.initialValues !== undefined ? (this.props.initialValues.responseData ? this.props.initialValues.responseData.totalMerchantsCount : "0") : "0"}</div>
                                            <div><hr className="dashboardLine"/></div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-3">
                                        <div className="dashboardBox">
                                            <span className="dashboardText"> Active </span>
                                            <div className="dashboardText"> <b>DEALS</b></div>
                                            <div className="dashboardCountText">{this.props.initialValues !== undefined ? (this.props.initialValues.responseData ? this.props.initialValues.responseData.activeDealsCount : "0") : "0"}</div>
                                            <div><hr className="dashboardLine"/></div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </Paper> 
                    </div>
                </div>

                <div className="row center-xs">
                    <div className="col-xs-12 col-sm-6 col-md-6">
                        <span>Tickets</span>
                        {
                            this.props.initialValues ?
                                (
                                    this.props.initialValues.responseData ?
                                        <Pie data={this.props.initialValues.responseData.tickets} />
                                    :   null
                                )
                            :   null
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                            <div className="appTitleLabel">Open Tickets</div>
                            <TicketList 
                                username=""
                                status={this.state.status}
                                userType="" 
                                ticketType=""
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
  
  AdminDashboard = connect(
    state => ({
      userData: state.accountValidate === undefined ? undefined : state.accountValidate,
      initialValues: state.dashboard.dashboardDetails === undefined ? undefined : state.dashboard.dashboardDetails,
    }),
    mapDispatchToProps,
  )(AdminDashboard)
  
  export default reduxForm({form: 'FrmAdminDashboard'})(AdminDashboard)