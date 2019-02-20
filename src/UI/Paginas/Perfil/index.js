import React from "react";
import { withRouter } from "react-router-dom";
import CordobaFilesUtils from "@Utils/CordobaFiles";

//Styles
import styles from './styles'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Assets
import Logo_SiSi from "@Assets/images/Logo_SiSi.png";

//Material UI 
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar";
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiDatoPerfil from "@Componentes/MiDatoPerfil";
import MiInput from "@Componentes/MiInput";

const mapStateToProps = state => {
  return {
    loggedUser: state.Usuario.loggedUser,
    paraMobile: state.MainContent.paraMobile,
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  }
});

class Perfil extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {
    //this.props.mostrarCargando(true);

  }

  render() {
    const { classes } = this.props;

    const datosUsuario = this.props.loggedUser.datos;
    let urlFotoPerfil;
    if (datosUsuario) {
      urlFotoPerfil = CordobaFilesUtils.getUrlFotoMediana(datosUsuario.identificadorFotoPersonal, datosUsuario.sexoMasculino);
      urlFotoPerfil = urlFotoPerfil.slice(0, -2);
    }

    return (
      <div className={classes.mainContainer}>
        <Grid container spacing={16} justify="center">
          <Grid item xs={12} sm={6}>
            <div className={classes.centerContainer}>
              <Avatar alt="Menu del usuario" src={urlFotoPerfil} className={classNames(classes.icono)} /><br /><br />
            </div>

            <MiCard
              titulo={'Datos personales'}
              informacionAlerta={'Como sus datos personales se encuentran validados por el Registro Nacional de Personas, estos no se pueden editar'}
            >

              <MiDatoPerfil
                icono={'assignment'}
                texto={'Nombre'}
                subtexto={'Adrian Dotta'}
              />
              <br />
              <MiDatoPerfil
                icono={'assignment'}
                texto={'N° de documento'}
                subtexto={'35526616'}
              />
              <br />
              <MiDatoPerfil
                icono={'assignment'}
                texto={'CUIL'}
                subtexto={'20355266169'}
              />
              <br />
              <MiDatoPerfil
                icono={'assignment'}
                texto={'Fecha de nacimiento'}
                subtexto={'10/09/1990'}
              />
              <br />
              <MiDatoPerfil
                icono={'assignment'}
                texto={'Sexo'}
                subtexto={'Masculino'}
              />
              <br />
              <MiDatoPerfil
                icono={'assignment'}
                texto={'Domicilio legal'}
                subtexto={'Manzana F Lote 18, B° Los Cielos, Valle Escondido, Cordoba Capital, Cordoba, Cordoba, Argentina (Código Postal: 5003)'}
              />

            </MiCard>
            <br /><br />
            <MiCard
              titulo={'Datos de acceso'}
            >

              <MiDatoPerfil
                icono={'assignment'}
                texto={'Nombre de Usuario'}
                subtexto={'dotta_a'}
              />
              <br />
              <MiDatoPerfil
                icono={'assignment'}
                texto={'Contraseña'}
                subtexto={'••••••••••••'}
              />

            </MiCard>
            <br /><br />
            <MiCard
              titulo={'Domicilio particular'}
            >

              <Grid container spacing={16}>
                <Grid item xs={12} sm={8}>
                  <MiInput
                    tipoInput={'text'}
                    label={'Dirección'}
                    defaultValue={'Parana'}
                  />
                  <br />
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <MiInput
                        tipoInput={'text'}
                        label={'Torre'}
                        defaultValue={'lala'}
                        placeholder={'(Opcional)'}
                      />
                    </Grid>
                    <br />
                    <Grid item xs={12} sm={6}>
                      <MiInput
                        tipoInput={'text'}
                        label={'Piso'}
                        defaultValue={'8'}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <MiInput
                    tipoInput={'select'}
                    label={'Barrio'}
                    defaultValue={1}
                    itemsSelect={
                      [
                        {
                          value: 1,
                          label: 'Barrio 1'
                        },
                        {
                          value: 2,
                          label: 'Barrio 2'
                        },
                        {
                          value: 3,
                          label: 'Barrio 3'
                        },
                      ]
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <MiInput
                    tipoInput={'text'}
                    label={'Altura'}
                    defaultValue={'441'}
                  />
                  <br />
                  <MiInput
                    tipoInput={'text'}
                    label={'Depto'}
                    defaultValue={'B'}
                  />
                </Grid>
              </Grid>

            </MiCard>
          </Grid>
        </Grid>
      </div>
    );
  }
}

let componente = Perfil;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;