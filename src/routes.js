import React, { Component } from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom'

// CONTAINERS
import Login from './containers/account/login'
import ForgetPassword from './containers/account/forgotPassword'
import Register from './containers/account/register'
import Logout from './containers/account/logout'
import UserProfile from './containers/account/editUserProfile'
import AccountActivate from './containers/account/accountActivate'
import ActivationComplete from './containers/account/activationComplete'
import ResetPassword from './containers/account/resetPasswordMail'
import ChangePassword from './containers/account/changePassword'
import UpdateUserDetails from './containers/user/updateUserDetails'
import VerificationPending from './containers/account/verificationPending'

import ManageAdmins from './containers/admin/manageAdmins'
import AddAdmin from './containers/admin/addNewAdmin'
import AdminDashboard from './containers/admin/adminDashboard'
import UpdateAdmin from './containers/admin/updateAdmin'

import MerchantDashboard from './containers/merchant/merchantDashboard'
import ManageMerchants from './containers/merchant/manageMerchants'
import ManageUsers from './containers/user/manageUsers'
import AddMerchant from './containers/merchant/addNewMerchant'
import UpdateMerchant from './containers/merchant/updateMerchantDetails'
import MerchantsList from './containers/merchant/merchantList'

import ManageDeals from './containers/deals/manageDeals'
import AddNewDeal from './containers/deals/addNewDeal'
import UpdateDeal from './containers/deals/updateDeal'

import ManageRedeemModes from './containers/redeem/manageRedeemModes'
import AddNewRedeemMode from './containers/redeem/addNewRedeemMode'
import UpdateRedeemMode from './containers/redeem/updateRedeemMode'

import ManageRedemption from './containers/redemption/manageRedemption'
import CustomerQueries from './containers/customerQueries/customerQueries'

import ManageTickets from './containers/ticket/manageTickets'
import AddNewTicket from './containers/ticket/addNewTicket'
import UpdateTicket from './containers/ticket/updateTicket'

import SuperAdminDashboard from './containers/superAdmin/superAdminDashboard'

import ManageBusiness from './containers/business/manageBusiness'

//Ticket
import ContactUs from './containers/ticket/contactUs'

import PaymentProcessing from './containers/paymentProcessing/paymentProcessing'

import App from './App'

class Routes extends Component {


    render() {
        return (

            <HashRouter>
                <div>
                    <Switch>
                        <Route exact path="/resetPassword" component={ForgetPassword} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/" component={Login} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/logout" component={Logout} />
                        <Route exact path="/accountActivate" component={AccountActivate} />
                        <Route exact path="/activateAccount/:token" component={ActivationComplete} />
                        <Route exact path="/activateAccount" component={ActivationComplete} />
                        <Route exact path="/resetPasswordMail" component={ResetPassword} />
                        <Route exact path="/setPassword" component={ChangePassword}/> 
                        <Route exact path="/setPassword/:token" component={ChangePassword} />
                        <Route exact path="/verificationPending" component={VerificationPending} />

                        <App>
                            <Route exact path="/admindashboard" component={AdminDashboard} />
                            <Route exact path="/superAdminDashboard" component={SuperAdminDashboard} />
                            <Route exact path="/merchantdashboard" component={MerchantDashboard} />
                            <Route exact path="/managemerchants" component={ManageMerchants} />
                            <Route exact path="/managedeals" component={ManageDeals} />
                            <Route exact path="/manageadmins" component={ManageAdmins} />
                            <Route exact path="/manageusers" component={ManageUsers} />
                            <Route exact path="/addNewAdmin" component={AddAdmin} />
                            <Route exact path="/addNewMerchant" component={AddMerchant} />
                            <Route exact path="/updateMerchant" component={UpdateMerchant}/>
                            <Route exact path="/addNewDeal" component={AddNewDeal}/>
                            <Route exact path="/updateDeal" component={UpdateDeal} />
                            <Route exact path="/editUserProfile" component={UserProfile}/>
                            <Route exact path="/merchantList" component={MerchantsList}/>
                            <Route exact path="/manageredeemmode" component={ManageRedeemModes}/>
                            <Route exact path="/addNewRedeemMode" component={AddNewRedeemMode}/>
                            <Route exact path="/managetickets" component={ManageTickets}/>
                            <Route exact path="/addNewTicket" component={AddNewTicket}/>
                            <Route exact path="/manageredemption" component={ManageRedemption}/>
                            <Route exact path="/customerqueries" component={CustomerQueries}/>
                            <Route exact path="/updateAdmin" component={UpdateAdmin} />
                            <Route exact path="/paymentprocessing" component={PaymentProcessing} />
                            <Route exact path="/contactus" component={ContactUs} />
                            <Route exact path="/updateUser" component={UpdateUserDetails} />
                            <Route exact path="/updateTicket" component={UpdateTicket} />
                            <Route exact path="/updateRedeemMode" component={UpdateRedeemMode} />
                            <Route exact path="/manageBusiness" component={ManageBusiness} />
                        </App>
                    </Switch>
                </div>
            </HashRouter>

        )
    }
}

export default Routes;