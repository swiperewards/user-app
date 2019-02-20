import React,{Component} from 'react';
import NumberFormat from "react-number-format";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import purple from '@material-ui/core/colors/purple';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  cssLabel: {
    '&$cssFocused': {
      color: purple[500],
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500],
    },
  },
  bootstrapRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {
    borderRadius: 1,
    backgroundColor: theme.palette.common.white,
    border: '0px solid #ced4da',
    fontSize: 14,
    color:'#000',
    padding: '10px 12px',
    height: '17px',
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
  bootstrapFormLabel: {
    fontSize: 18,
  },
});

class CustomizedInputs extends Component {
    render(){
      const { classes } = this.props;

      return(
        this.props.masked ?
          (this.props.myMaskType === "text" ?
            <NumberFormat {...this.props.input} 
              error={this.props.meta.touched ? this.props.meta.invalid : false}
              helperText={this.props.meta.touched ? this.props.meta.error : ''}
              inputRef = {(el) => this.inputElem = el}
              placeholder={this.props.myPlaceHolder}
              id={this.props.id}
              type={this.props.myType === undefined ? "text" : this.props.myType}
              fullWidth = {this.props.fullWidth}
              width = {this.props.minWidth} 
              customInput={TextField} 
              disabled={this.props.disabled ? true : false}
              InputProps={{
                disableUnderline: false,
                classes: {
                  root: classes.bootstrapRoot,
                  input: classes.bootstrapInput,
                },
              }}
              format={this.props.maskReg}
              mask="_"
            />
            :
            <NumberFormat {...this.props.input} 
              error={this.props.meta.touched ? this.props.meta.invalid : false}
              helperText={this.props.meta.touched ? this.props.meta.error : ''}
              inputRef = {(el) => this.inputElem = el}
              placeholder={this.props.myPlaceHolder}
              id={this.props.id}
              type={this.props.myType === undefined ? "text" : this.props.myType}
              fullWidth = {this.props.fullWidth}
              width = {this.props.minWidth} 
              customInput={TextField} 
              disabled={this.props.disabled ? true : false}
              InputProps={{
                disableUnderline: false,
                classes: {
                  root: classes.bootstrapRoot,
                  input: classes.bootstrapInput,
                },
              }}
              thousandSeparator
            />)
          :
          <TextField {...this.props.input}
            error={this.props.meta.touched ? this.props.meta.invalid : false}
            helperText={this.props.meta.touched ? this.props.meta.error : ''}
            placeholder={this.props.myPlaceHolder}
            id={this.props.id}
            type={this.props.myType === undefined ? "text" : this.props.myType}
            fullWidth = {this.props.fullWidth}
            width = {this.props.minWidth}
            disabled={this.props.disabled ? true : false}
            InputProps={{
              disableUnderline: false,
              classes: {
                root: classes.bootstrapRoot,
                input: classes.bootstrapInput,
              },
            }}
          >
          </TextField>
      )
    }
}

export default withStyles(styles)(CustomizedInputs);