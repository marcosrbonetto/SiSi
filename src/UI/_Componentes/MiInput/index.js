import React from "react";
import _ from "lodash";
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
import FormHelperText from '@material-ui/core/FormHelperText';

import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';

class MiInput extends React.Component {

  constructor(props) {
    super(props);

    this.dateByInput = false;

    this.state = {
      checkDate: props.disabled != undefined ? !props.disabled : true
    }
  }

  handleInputOnCange = (event) => {
    this.props.onChange && this.props.onChange(event.target.value, 'value', event, this.props);
  }

  handleInputDateOnCange = (event) => {
    
    var dateTime = event;
    if(this.dateByInput) {
      dateTime.setDate(dateTime.getDate()+365);
      this.dateByInput = false;
    }

    this.props.onChange && this.props.onChange(event, 'value', undefined, this.props);
  }

  handleInputOnFocusOut = (event) => {
    this.dateByInput = true;
    this.props.onFocusOut && this.props.onFocusOut(event, this.props);
  }

  handleCheckDateOnCange = (event) => {
    this.setState({
      checkDate: !this.state.checkDate
    }, () => {
      this.props.onChange && this.props.onChange(!this.state.checkDate, 'disabled', event, this.props);
    });
  }

  render() {
    const {
      checkDate
    } = this.state;

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
      disabled,
      preInput,
      postInput,
      error,
      mensajeError,
      withDisabled,
      maxLength,
      multiline
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
                  error={error || false}
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
                  onChange={this.handleInputOnCange}
                  onBlur={this.handleInputOnFocusOut}
                  helperText={error && mensajeError}
                  FormHelperTextProps={{
                    className: classes.errorText
                  }}
                  inputProps={{
                    maxLength: maxLength,
                  }}
                  multiline={multiline || false}
                />
              </React.Fragment>
            }

            {tipoInput && tipoInput == 'textarea' &&
              <React.Fragment>
                <TextField
                  error={error || false}
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
                    className: classNames(classes.wideWidth),
                    classes: {
                      root: classes.textArea
                    },
                    maxLength: maxLength,
                  }}
                  onChange={this.handleInputOnCange}
                  onBlur={this.handleInputOnFocusOut}
                  helperText={error && mensajeError}
                  FormHelperTextProps={{
                    className: classes.errorText
                  }}
                  multiline={true}
                />
              </React.Fragment>
            }

            {tipoInput && tipoInput == 'select' &&
              <React.Fragment>
                <FormControl className={classNames(classes.formControl, classes.wideWidth)}>
                  <InputLabel shrink htmlFor={randomId + '-label-placeholder'}>{label}</InputLabel>
                  <Select
                    error={error || false}
                    value={value || 0}
                    input={<Input name={randomId} id={randomId + '-label-placeholder'} />}
                    displayEmpty
                    name={randomId}
                    className={classInput}
                    placeholder={placeholder}
                    onChange={this.handleInputOnCange}
                    onBlur={this.handleInputOnFocusOut}
                  >

                    {itemsSelect && itemsSelect.map((item) => {
                      return <MenuItem value={item.value}>{item.label}</MenuItem>;
                    })}
                  </Select>
                  <FormHelperText className={classes.errorText}>{error && mensajeError}</FormHelperText>
                </FormControl>
              </React.Fragment>
            }

            {tipoInput && tipoInput == 'checkbox' &&
              <React.Fragment>
                <div className={classes.classCheckbox}>
                  <Checkbox
                    error={error || false}
                    checked={checked}
                    tabIndex={-1}
                    disableRipple
                    color="primary"
                    onChange={this.handleInputOnCange}
                  />
                  <ListItemText primary={label} className={classes.labelCheckbox} />
                </div>
                <FormHelperText className={classes.errorText}>{error && mensajeError}</FormHelperText>
              </React.Fragment>
            }

            {tipoInput && tipoInput == 'date' &&
              <React.Fragment>
                {withDisabled && <Checkbox
                  checked={checkDate}
                  tabIndex={-1}
                  disableRipple
                  color="primary"
                  onClick={this.handleCheckDateOnCange}
                />}
                <DatePicker
                  disabled={withDisabled ? !checkDate : false}
                  keyboard
                  label={label}
                  // format={props.getFormatString({
                  //   moment: "DD/MM/YYYY",
                  //   dateFns: "dd/MM/yyyy",
                  // })}
                  format={'dd/MM/YYYY'}
                  margin="normal"
                  placeholder="Ej.: 10/10/2018"
                  mask={value =>
                    // handle clearing outside if value can be changed outside of the component
                    value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : []
                  }
                  value={value}
                  onChange={this.handleInputDateOnCange}
                  onBlur={this.handleInputOnFocusOut}
                  helperText={error && mensajeError}
                  error={error || false}
                  disableOpenOnEnter
                  animateYearScrolling={false}
                />
              </React.Fragment>
            }

            {tipoInput && tipoInput == 'date2' &&
              <React.Fragment>
                <TextField
                  error={error || false}
                  type={'date'}
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
                  onChange={this.handleInputOnCange}
                  onBlur={this.handleInputOnFocusOut}
                  helperText={error && mensajeError}
                  FormHelperTextProps={{
                    className: classes.errorText
                  }}
                  inputProps={{
                    maxLength: maxLength,
                  }}
                  className={classes.inputDate}
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
    padding: '0px 4px',
    width: '100%'
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
  },
  errorText: {
    marginTop: '2px'
  },
  textArea: {
    minHeight: '100px',
    overflowY: 'scroll',
  },
  inputDate: {
    width: '150px'
  }
});

export default withStyles(styles)(MiInput);





//Validaciones Inputs by Form
export const onInputChangeValidateForm = (form, param) => {
  let formInputs = _.cloneDeep(form);

  const inputChanged = _.find(formInputs, { id: param.props.id });
  if (!inputChanged) return false;

  if (inputChanged[param.type] != undefined || inputChanged[param.type] == null) //inputChanged[param.type] == null en caso de fechas
    inputChanged[param.type] = param.value != undefined ? param.value : inputChanged.value;

  inputChanged.error = false;

  return formInputs;
}

export const onInputFocusOutValidateForm = (form, param) => {
  let formInputs = _.cloneDeep(form);
  const inputValue = param.props.tipoInput == 'date' ? param.input : param.input.target.value;

  const inputChanged = _.find(formInputs, { id: param.props.id });
  if (!inputChanged) return false;

  if (!(!inputChanged.required && inputValue == '')) {
    if (inputChanged.valiateCondition && !inputChanged.valiateCondition.test(inputValue)) {
      inputChanged.error = true;

      return formInputs;
    }
  }

  return form;
}

export const validateForm = (form) => {
  let formHayError = false;
  let formInputs = _.cloneDeep(form);

  formInputs.map((input) => {
    if (
      (input.required && (input.value == '' || input.value == null)) ||
      ((input.disabled  != undefined && input.disabled == false) && (input.value == '' || input.value == null)) ||
      (input.required && (input.value == '' || input.value == null) && input.disabled != undefined && !input.disabled) ||
      (input.required && input.checked != undefined && !input.checked) ||
      ((input.value != null && input.value != '') && input.valiateCondition && !input.valiateCondition.test(input.value))
    ) {
      input.error = true;
      formHayError = true;
    }
  });

  return {
    formInputs: formInputs,
    formHayError: formHayError
  };
}