import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

// component
import DialogBox from '../../components/alertDialog'
import Button from '@material-ui/core/Button';

class AuthError extends Component {

    render() {

        const actions = [
            <Link to='/logout' key="1" style={{textDecoration:'none', color:'#fff'}}>
                <Button color="primary" autoFocus>
                    OK
                </Button>
            </Link>
        ];

        return(
            <div>
                <DialogBox 
                    displayDialogBox={this.props.authError} 
                    message={"Your session has been expired. Please login again!"} 
                    actions={actions} 
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authError: state.account.authError === undefined ? false : state.account.authError
    }
}
export default connect(mapStateToProps)(AuthError)
