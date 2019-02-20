import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout, userLogout } from '../../actions/accountAction';

class Logout extends Component {


    componentWillMount() {
        this.props.logout();
        window.history.pushState("", "", window.location.pathname);
        this.props.history.push('/login');

        if(this.props.authError === false){
            if(this.props.userData.user){
                if(this.props.userData.user.responseData.token){
                    this.props.userLogout(this.props.userData.user.responseData.token)
                }
            }
            
        }
    }

    render() {
        return (
            <div></div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logout, userLogout }, dispatch)
}

Logout = connect(
    state => ({
       userData: state.accountValidate === undefined ? undefined : state.accountValidate,
       authError: state.account.authError === undefined ? false : state.account.authError,
    }),
    mapDispatchToProps,
    null,
    { pure: false },
  )(Logout)


export default Logout;