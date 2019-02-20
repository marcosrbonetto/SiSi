import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import { Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

class MiInput extends React.PureComponent {
  render() {
    let {
      classes,
      tipoInput,
      label,
      itemsSelect,
      icono,
      iconoSvg,
      defaultValue,
      placeholder
    } = this.props;

    const randomId = (new Date()).getTime() + parseInt(1 + Math.random() * (10 - 1));

    return (
      <React.Fragment>
        <div className={classes.classContainer}>
          {(this.props.icono || this.props.iconoSvg) &&
          <i className={classNames("material-icons", classes.classIcono)}>{this.props.icono || this.props.iconoSvg || 'assignment'}</i>}
          <div className={classNames(classes.classTextos, classes.wideWidth)}>

            {tipoInput && tipoInput == 'text' &&
            <React.Fragment>
              <TextField
                label={label}
                className={classNames(classes.wideWidth, this.props.classInput)}
                value={defaultValue || ''}
                margin="none"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder={placeholder}
                inputProps={{
                  className: classes.wideWidth
                }}
              />
              </React.Fragment>
            }


            {tipoInput && tipoInput == 'select' &&
            <React.Fragment>
              <FormControl className={classNames(classes.formControl, classes.wideWidth)}>
                <InputLabel shrink htmlFor={randomId+'-label-placeholder'}>{label}</InputLabel>
                <Select
                  value={defaultValue || 0}
                  input={<Input name={randomId} id={randomId+'-label-placeholder'} />}
                  displayEmpty
                  name={randomId}
                  className={this.props.classInput}
                  placeholder={placeholder}
                >

                  {itemsSelect && itemsSelect.map((item) => {
                    return <MenuItem value={item.value}>{item.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              </React.Fragment>
            }

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
    marginTop: '12px'
  },
  wideWidth: {
    width: '100%'
  }
});

export default withStyles(styles)(MiInput);
