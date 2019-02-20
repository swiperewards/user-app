import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import purple from '@material-ui/core/colors/purple';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
    marginLeft: '0px',
  },
  cssRoot: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
  },
  bootstrapRoot: {
    borderRadius: 1,
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: '14px',
    padding: '6px 12px',
    border: '0px solid',
    backgroundColor: '#53c1ff',
    borderColor: '#53c1ff',
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
    '&:hover': {
      backgroundColor: '#337ab7',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#337ab7',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.0)',
    },
  },
});

function CustomizedInputs(props) {
  const { classes } = props;
  const actionUrl = props.actionLink ? props.actionLink : ""
  const actionLink = props => <Link to={actionUrl} {...props} />


  return (
      <Button
        variant="contained"
        color={"primary"}
        type={props.type}
        component={props.type === "button" ? actionLink : undefined}
        fullWidth={props.isFullWidth}
        disableRipple
        className={classNames(classes.margin, classes.bootstrapRoot)}
      >
        {props.label}
      </Button>
  );
}

CustomizedInputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedInputs);