import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import _ from "lodash";
import memoize from 'memoize-one';

import Button from "@material-ui/core/Button";
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from "@material-ui/core/Typography";
import Badge from '@material-ui/core/Badge';

//Beneficios
import beneficios from './beneficios';
import { infoBeneficios } from './infoBeneficios.js';

//Funciones
import { getIdTipoTributo } from "@Utils/functions"

export const checkBeneficios = (tipoTributo, seccion, idSelectedRows) => {
  let error = false;
  let arrayBeneficios = [];
  let resultado = {
    seleccionBeneficios: false,
    tieneBeneficio: false
  };

  if (!tipoTributo || !seccion || !idSelectedRows) {
    return resultado;
  }

  const tipoTributoArrayBeneficios = beneficios[tipoTributo];
  //Corroboramos que el tipoTributo y la sección tienen los beneficios
  if (tipoTributoArrayBeneficios) {
    arrayBeneficios = _.filter(tipoTributoArrayBeneficios, (beneficio) => {
      return beneficio.secciones.indexOf(seccion) != -1;
    });

    if (arrayBeneficios.length == 0) {
      error = true;
    }
  } else {
    error = true;
  }

  if (error) {
    return resultado;
  }

  //Si encontramos, procedemos a determinar si las filas seleccionadas coinciden con algun beneficio
  const idRowsSeleccionados = idSelectedRows;

  //Determinamos cantidad de beneficios que se cumplen
  let arrayResultBeneficios = [];

  _.each(arrayBeneficios, (beneficio) => {

    const resultadoCondicion = beneficio.cumpleCondicionBeneficio(idRowsSeleccionados);

    // console.log(beneficio.titulo);
    // console.log(concideConBeneficio);
    // console.log('-----------------------');

    if (resultadoCondicion.concideConBeneficio) {
      arrayResultBeneficios.push({
        beneficio: beneficio,
        exacto: resultadoCondicion.concideExactamenteBeneficio
      });
    }
  });

  //Por defecto el resultado viene como si no hubiera coincidencia con algun beneficio
  if (arrayResultBeneficios.length == 1) { //En este caso el beneficio encontrado se aplica directamente
    if(arrayResultBeneficios[0].exacto) {
      resultado = {
        seleccionBeneficios: false,
        tieneBeneficio: true,
        arrayResultBeneficios: arrayResultBeneficios
      };
    } else {
      resultado = { //En este caso aparecerá para seleccion solo el beneficio encontrado (evitando los demas seleccionados que no entran en el beneficio)
        seleccionBeneficios: true,
        tieneBeneficio: true,
        arrayResultBeneficios: arrayResultBeneficios
      };
    }
  } if (arrayResultBeneficios.length > 1) { //El usuario deberá elegir entre alguno beneficio
    resultado = {
      seleccionBeneficios: true,
      tieneBeneficio: true,
      arrayResultBeneficios: arrayResultBeneficios
    };
  }

  return resultado;
};

class MisBeneficios extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: true, //false - FALTA PARTE BACK
      anchorEl: null,
      itemChecked: 0,
      arrayBeneficios: []
    };
  }

  componentDidMount() {
    //Corroboramos que el tipoTributo y la sección tienen los beneficios
    const tipoTributoArrayBeneficios = beneficios[this.props.tipoTributo];
    if (tipoTributoArrayBeneficios) {
      const arrayBeneficios = _.filter(tipoTributoArrayBeneficios, (beneficio) => {
        return beneficio.secciones.indexOf(this.props.seccion) != -1;
      });

      if (arrayBeneficios.length > 0) {
        this.setState({ arrayBeneficios: arrayBeneficios });
        return true;
      }
    }

    this.setState({ visible: false });
  }

  handleChangeBeneficio = memoize((seleccionBeneficioByKey) => {
    this.handleAplicarBeneficio(seleccionBeneficioByKey.key);
  });

  handleSetVisible = memoize((beneficiosDisponibles) => {
    if(!Array.isArray(beneficiosDisponibles)) return false;

    this.setState({ visible: beneficiosDisponibles.length > 0 });
  });

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (event) => {
    let idItemSeleccionado = parseInt(event.currentTarget.attributes.idbeneficio.value);

    this.handleAplicarBeneficio(idItemSeleccionado);
  };

  handleAplicarBeneficio = (idItemSeleccionado) => {
    //Si es el mismo quiere decir que lo estamos deschequeando
    if (this.state.itemChecked == idItemSeleccionado) {
      idItemSeleccionado = 0;
      this.handleBeneficio();
    } else {
      //Seteamos las filas de acuerdo al beneficio
      const beneficio = _.find(this.state.arrayBeneficios, { 'key': idItemSeleccionado });
      this.handleBeneficio(beneficio); //Seteo
    }

    this.setState({
      anchorEl: null,
      itemChecked: idItemSeleccionado
    });
  }

  handleBeneficio = (beneficio) => {
    if (!this.props.rows) return [];

    let result = undefined;

    if (beneficio) {
      //Cuando se checkea el beneficio, se setea la grilla de acuerdo a la config del mismo
      let arrayRows = this.resetearFilar(this.props.rows);
      _.each(arrayRows, (row) => {
        beneficio.seteoFila(row);
      });

      var itemsSeleccionados = _.filter(arrayRows, (o) => { return o.data.checked == true });
      const idSeleccionados = _.map(itemsSeleccionados, 'id');

      result = {
        beneficio: beneficio,
        rowList: arrayRows,
        rowsSelected: idSeleccionados,
        tableDisabled: beneficio.tableDisabled
      };
    } else {
      //Cuando se descheckea el beneficio, se debe resetear la grilla
      let arrayRows = this.resetearFilar(this.props.rows);

      result = {
        beneficio: undefined,
        rowList: arrayRows,
        rowsSelected: [],
        tableDisabled: false
      };
    }

    this.props.handleBeneficiosResult && this.props.handleBeneficiosResult(result);
  }

  resetearFilar = (arrayRows) => {
    var newArrayRows = _.each(arrayRows, (row) => {
      row.data = {
        ...row.data,
        checked: false,
        invisible: false,
        disabled: false,
      };

      return row;
    });

    return newArrayRows;
  }

  handleCloseMenu = () => {
    this.setState({
      anchorEl: null
    });
  }

  cancelarBeneficio = () => {
    this.setState({
      itemChecked: 0
    }, () => {
      this.handleBeneficio();
    });
  }

  render() {
    let { classes, beneficiosDisponibles, tipoTributo, seleccionBeneficioByKey } = this.props;
    const { visible, anchorEl, itemChecked, arrayBeneficios } = this.state;

    let tituloBeneficioSelec = '';
    if (itemChecked > 0) {
      const beneficioSelec = _.find(arrayBeneficios, { key: itemChecked });
      tituloBeneficioSelec = beneficioSelec.titulo;
    }

    const idTipoTributo = getIdTipoTributo(tipoTributo) || 0;
    const textoInfoBeneficio = infoBeneficios(idTipoTributo);

    this.handleChangeBeneficio(seleccionBeneficioByKey);
    this.handleSetVisible(beneficiosDisponibles);

    return (<div className={classNames(classes.root, "BtnMisBeneficios")}>
      {visible && <div>
        <Badge
          onClick={this.cancelarBeneficio}
          badgeContent={'X'}
          classes={{ badge: classNames(classes.badgeCancel, itemChecked == 0 && classes.hideBadgeCancel) }}>

          <Button
            variant="contained"
            color="secondary"
            className={classNames(classes.buttonActions, classes.promotionButton)}
            onClick={this.handleClick}
          >
            Beneficios
          <Typography className={classes.buttonActionsCaption} variant="caption" gutterBottom align="center">
              {tituloBeneficioSelec}
            </Typography>
          </Button>
        </Badge>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleCloseMenu}
        >
          {arrayBeneficios.map((beneficio, key) => {
            //Quitamos aquellos beneficios que no se encuentran entre los disponibles
            if(!_.find(beneficiosDisponibles, (o) => {
              return o.beneficio.key == beneficio.key;
            }))
              return true;
            
            return <MenuItem key={key} idbeneficio={beneficio.key} onClick={this.handleClose}>
              <Checkbox
                checked={itemChecked == beneficio.key}
                disableRipple
              />{beneficio.titulo}
            </MenuItem>
          })}
        </Menu>

        {textoInfoBeneficio &&
          <div className={classes.infoContainer}>
            <Tooltip
              disableFocusListener disableTouchListener
              classes={{ tooltip: classes.textTooltip }}
              title={textoInfoBeneficio}
            >
              <i className={classNames(classes.infoIcon, "material-icons")}>info</i>
            </Tooltip>
          </div>}
      </div>}
    </div>);
  }
}

const styles = theme => ({
  root: {
    display: 'inline-block'
  },
  buttonActionsContent: {
    textAlign: 'right',
    marginTop: '18px'
  },
  buttonActions: {
    overflow: 'visible',
    display: 'inline-block',
    minWidth: 'auto',
    margin: '2px',
    borderRadius: '20px',
  },
  promotionButton: {
    background: '#ffa114',
    '&:hover': {
      background: '#ffa114'
    }
  },
  infoContainer: {
    display: 'inline-block',
    width: '36px',
    height: '45px',
    textAlign: 'left',
  },
  infoIcon: {
    color: '#0f8fea',
    verticalAlign: 'middle',
    cursor: 'pointer'
  },
  textTooltip: {
    fontSize: 16,
  },
  buttonActionsCaption: {
    top: '40px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90px',
    color: '#ffa114'
  },
  badgeCancel: {
    background: 'red',
    width: '15px',
    height: '15px',
    fontSize: '10px',
    top: '0px',
    right: '0px',
    cursor: 'pointer',
    color: '#fff'
  },
  hideBadgeCancel: {
    display: 'none'
  }
});

let componente = MisBeneficios;
componente = withStyles(styles)(componente);
export default componente;
