import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
    bootstrapInput: {
        borderRadius: 1,
        backgroundColor: theme.palette.common.white,
        border: '0px solid #ced4da',
        fontSize: 14,
        color:'#000',
        padding: '0px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
      },
  });

  
class TextAreaControl extends Component {
    render() {
        const { classes } = this.props;

        return (
            <TextField {...this.props.input}
                id="standard-multiline-static"
                error={this.props.meta.touched ? this.props.meta.invalid : false}
                helperText={this.props.meta.touched ? this.props.meta.error : ''}
                className={classes.textField}
                multiline
                rows="4"
                margin="normal"
                fullWidth={true}
                InputProps={{
                    classes: {
                      input: classes.bootstrapInput,
                    },
                  }}
            />
        )
    }
}

TextAreaControl.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(TextAreaControl);