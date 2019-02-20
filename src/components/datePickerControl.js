import React, {Component} from 'react';
import { DatePicker } from 'material-ui-pickers';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import moment from 'moment'

  class DatePickerControl extends Component {

    handleChange = (date) => {
      this.props.input.onChange(moment(date))
    }
  
    render () {
      const { input, keyboard, disabled, className, input: { value }, meta: { invalid, error, touched }, required, ...other } = this.props
  
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                {...input}
                {...other}
                error={touched ? invalid : false}
                helperText={touched && error &&  error }
                value={value}
                keyboard = {keyboard}
                label=""
                format="MM/dd/yyyy"
                mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
                disablePast = {true}
                animateYearScrolling={false}
                onChange={this.handleChange}
                disabled={disabled}
            />  
        </MuiPickersUtilsProvider>
        )
    }
}

export default DatePickerControl;
