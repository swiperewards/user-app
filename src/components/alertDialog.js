import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

/**
 * Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation.
 */

const DialogBox = (props) => {
    let { displayDialogBox, message, actions } = props;
    return (
        <div>
            <Dialog
                open={displayDialogBox}
                aria-labelledby="alert-dialog-title"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}                        
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    {actions}
                </DialogActions>
            </Dialog>
        </div>
    );

}

export default DialogBox;