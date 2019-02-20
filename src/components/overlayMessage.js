import React, { Component } from 'react';

//Material UI
import Paper from '@material-ui/core/Paper';
import { appName } from '../app.config';

const styles = {
    container: {

        display: 'flex',
        flexDirection: 'column',
        justifyContent : 'center',
        alignItems : 'center',
        position: 'fixed',
        height: '100%',
        width: '100%',
        top: '0px',
        left: '0px',
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.54)',
        willChange: 'opacity',
        transform: 'translateZ(0px)',
        transition: 'left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        zIndex: 99999999999999

    },
    greenBox:{
        border:'solid rgb(36, 160, 39)',
        borderWidth:'0.5px', 
        background:'rgb(234,255,230)', 
        padding:'10px',
    },
    refresh: {
        position: 'fixed',
    }
}

class OverLayMessage extends Component {

    handleRegister(){
        this.props.history.push('/paymentprocessing');
    }

    handleClose(){
        this.props.history.push('/merchantdashboard');
    }
    render() {

        let { status } = this.props;
        var loader;
        if (status) {
            loader = 
                <div style={styles.container}>
                    <div className="row">
                        <div className="col-md-6 pageContainer">
                            <Paper className="pagePaper">
                                    <div className="row">
                                        <div className="col-xs-12 center-xs">
                                            <img src="../images/logo.png" alt="Logo" />
                                        </div>
                                    </div>      
                                    <div className="row">
                                        <div className="col-xs-12 center-xs">
                                           <span className="controlLabel"> <b>REGISTRATION</b> </span>
                                        </div>
                                    </div>        
                                    <div className="row">
                                        <div className="col-xs-12 center-xs">
                                            <span>Register for {appName} to begin boosting your sales.</span>

                                        </div>    
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12 center-xs"> 
                                            <button 
                                                type="button"
                                                style={{backgroundColor:'#BCBCBC'}}
                                                className="enabledButton button"
                                                onClick={this.handleClose.bind(this)}
                                                > SKIP
                                            </button>
                                            <button 
                                                type="button"
                                                className="button"
                                                onClick={this.handleRegister.bind(this)}
                                            > 
                                            REGISTER
                                            </button>
                                        </div>
                                    </div>        
                            </Paper>
                        </div>
                    </div>
                </div>
        }
        else {
            loader = <div></div>
        }
        return (
            <div>
                {loader}
            </div>
        );
    }

}

export default OverLayMessage;