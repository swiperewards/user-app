import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
const locationHelper = locationHelperBuilder({})
export const userIsAuthenticated = connectedRouterRedirect({
    // If selector is true, wrapper will not redirect
    authenticatedSelector: state => state.account.user.responseData !== null && state.account.user.responseData.role === 'superadmin',
    // The url to redirect user to if they fail
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/dashboard',
    allowRedirectBack: false,
    // A nice display name for this check
    wrapperDisplayName: 'UserIsAuthenticated'
})