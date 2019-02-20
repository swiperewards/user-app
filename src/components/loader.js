import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

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
    spinnerStyle: {
        
    },
    refresh: {
        //display: 'inline-block',
        position: 'fixed',
    }
}

const Loader = (props) => {
    let { status } = props;
    var loader;
    if (status) {
        loader = <div style={styles.container}>
            <CircularProgress/>
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

export default Loader;