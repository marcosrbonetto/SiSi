import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiDatoPerfil from "@Componentes/MiDatoPerfil";

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

class DatosPersonales extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {

  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
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
            icono={'insert_invitation'}
            texto={'Fecha de nacimiento'}
            subtexto={'10/09/1990'}
            />
            <br />
            <MiDatoPerfil
            iconoSvg={<svg viewBox="0 0 512 512">
            <path d="M403.921,0v31.347h35.36l-68.982,65.409c-24.421-24.99-58.474-40.53-96.092-40.53c-50.603,0-94.759,28.112-117.687,69.535
                c-1.964-0.086-3.938-0.138-5.924-0.138c-74.118,0-134.417,60.299-134.417,134.418c0,68.816,51.984,125.71,118.743,133.498v41.657
                H87.995v31.347h46.929V512h31.347v-45.458h48.977v-31.347h-48.977v-41.657c43.948-5.127,81.488-31.533,102.013-68.616
                c1.964,0.086,3.937,0.138,5.922,0.138c74.119,0,134.418-60.299,134.418-134.417c0-25.187-6.969-48.774-19.071-68.944
                l74.919-71.038v38.933h31.347V0H403.921z M150.598,363.11c-56.833,0-103.07-46.237-103.07-103.071
                c0-54.619,42.705-99.442,96.477-102.853c-2.751,10.7-4.215,21.91-4.215,33.457c0,60.464,40.132,111.726,95.157,128.562
                C216.281,345.738,185.432,363.11,150.598,363.11z M249.044,290.6c-44.709-11.26-77.906-51.802-77.906-99.957
                c0-10.636,1.62-20.901,4.625-30.561c44.709,11.26,77.906,51.803,77.906,99.958C253.669,270.676,252.048,280.94,249.044,290.6z
                M280.801,293.495c2.751-10.7,4.215-21.909,4.215-33.456c0-60.464-40.132-111.726-95.156-128.563
                c18.666-26.532,49.516-43.905,84.349-43.905c56.834,0,103.071,46.237,103.071,103.071
                C377.278,245.261,334.573,290.085,280.801,293.495z"/>
        </svg>}
            texto={'Sexo'}
            subtexto={'Masculino'}
            />
            <br />
            <MiDatoPerfil
            icono={'map'}
            texto={'Domicilio legal'}
            subtexto={'Manzana F Lote 18, B° Los Cielos, Valle Escondido, Cordoba Capital, Cordoba, Cordoba, Argentina (Código Postal: 5003)'}
            />

        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  bottomContent: {
    display: 'flex',
    alignItems: 'flex-end',
  }
});

let componente = DatosPersonales;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;