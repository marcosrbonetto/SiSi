import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';

class MiInput extends React.PureComponent {
  render() {
    let {
      classes,
      tipoInput,
      label,
      itemsSelect,
      icono,
      iconoSvg,
      value,
      placeholder,
      classInput,
      type,
      checked,
      preInput,
      postInput,
      onChange,
    } = this.props;

    const randomId = (new Date()).getTime() + parseInt(1 + Math.random() * (10 - 1));

    return (
      <React.Fragment>
        <div className={classes.classContainer}>
          {icono &&
            <i className={classNames("material-icons", classes.classIcono, label && classes.conLabel)}>{icono || 'assignment'}</i>}
          {iconoSvg &&
            <div className={classNames(classes.classIconoSvg, label && classes.conLabelSvg)}>{iconoSvg}</div>}

          <div className={classNames(classes.containerInput, classes.wideWidth)}>
            <Typography variant="body1" className={classes.textoAdicional}>{preInput}</Typography>

            {tipoInput && tipoInput == 'input' &&
              <React.Fragment>
                <TextField
                  type={type || 'text'}
                  label={label}
                  className={classNames(classes.wideWidth, classInput)}
                  value={value || ''}
                  margin="none"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder={placeholder}
                  inputProps={{
                    className: classes.wideWidth
                  }}
                  onChange={onChange}
                />
              </React.Fragment>
            }

            {tipoInput && tipoInput == 'select' &&
              <React.Fragment>
                <FormControl className={classNames(classes.formControl, classes.wideWidth)}>
                  <InputLabel shrink htmlFor={randomId + '-label-placeholder'}>{label}</InputLabel>
                  <Select
                    value={value || 0}
                    input={<Input name={randomId} id={randomId + '-label-placeholder'} />}
                    displayEmpty
                    name={randomId}
                    className={classInput}
                    placeholder={placeholder}
                    onChange={onChange}
                  >

                    {itemsSelect && itemsSelect.map((item) => {
                      return <MenuItem value={item.value}>{item.label}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </React.Fragment>
            }

            {tipoInput && tipoInput == 'checkbox' &&
              <React.Fragment>
                <div className={classes.classCheckbox}>
                  <Checkbox
                    checked={checked}
                    tabIndex={-1}
                    disableRipple
                    color="primary"
                    onChange={onChange}
                  />
                  <ListItemText primary={label} className={classes.labelCheckbox} />
                </div>
              </React.Fragment>
            }

            {tipoInput && tipoInput == 'date' &&
              <React.Fragment>
                <DatePicker
                  margin="normal"
                  label={label}
                  value={value || new Date()}
                  format={'dd/MM/YYYY'}
                  onChange={onChange}
                />
              </React.Fragment>
            }

            <Typography variant="body1" className={classes.textoAdicional}>{postInput}</Typography>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  classContainer: {
    display: 'flex',
    padding: '0px 4px'
  },
  formControl: {
    margin: '0px'
  },
  classIcono: {
    margin: '6px',
    color: theme.color.block.main,
  },
  conLabel: {
    marginTop: '18px !important'
  },
  conLabelSvg: {
    marginTop: '21px !important',
    marginBottom: '0px !important',
  },
  wideWidth: {
    width: '100%'
  },
  classIconoSvg: {
    width: '27px',
    height: '27px',
    margin: '8px',
    fill: '#737373',
    marginTop: '13px'
  },
  classCheckbox: {
    display: 'flex',
    alignItems: 'center',
  },
  labelCheckbox: {
    padding: '0px'
  },
  containerInput: {
    display: 'flex',
    alignItems: 'baseline',
    fontSize: '18px',
  },
  textoAdicional: {
    fontSize: '16px',
  }
});

export default withStyles(styles)(MiInput);
