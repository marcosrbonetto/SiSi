import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from "classnames";

import styles from './styles';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Badge from '@material-ui/core/Badge';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
class MiSolicPermisos extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      checked: []
    };
  }

  componentWillUpdate(nextProps, nextState) {
    this.props.addPermiso(this.state.checked, this.props.tipo, nextState.checked.length);
  }

  handleChange = event => {
    this.setState({ checked: event.target.value });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <Badge badgeContent={this.props.cantPermisos} color="secondary" className={classNames(classes.lista,classes.container)}>
          <FormControl className={classes.lista}>
            <InputLabel htmlFor="select-multiple-checkbox" className={classes.labelSelect}>{this.props.label}</InputLabel>
            <Select
              multiple
              value={this.state.checked}
              onChange={this.handleChange}
              input={<Input id="select-multiple-checkbox" className={classes.inputSelect} />}
              renderValue={selected => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {this.props.opciones && this.props.opciones.map((opcion, index) => (
                <MenuItem key={index} value={opcion.identificador}>
                  <Checkbox checked={this.state.checked.indexOf(opcion.identificador) > -1} />
                  <ListItemText primary={opcion.identificador} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Badge>
      </div>
    );
  }
}

let componente = MiSolicPermisos;
componente = withStyles(styles)(componente);
export default componente;
