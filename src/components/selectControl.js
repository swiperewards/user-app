import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = {
    selectControl:{
      fontSize: '14px',
    },
};

const renderSelectField = ({
  input,
  label,
  meta: { touched, error, invalid },
  children,
  ...custom
}) => (
  <FormControl style={styles.formControl} error>   
    <Select
      style={styles.selectControl}
      error= {touched && invalid}
      {...input}
      children={children}
      {...custom}
      inputProps={{
              name: input.name,
        }
      }
    />
    {(touched && invalid) ? <FormHelperText>{error}</FormHelperText> : null}
  </FormControl>
)

export{
  renderSelectField
}