import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import { withStyles } from "@material-ui/core/styles";
import styles from './styles';
import { connect } from "react-redux";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Material UI 
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";

//Mis Componentes
import MiCard from "@Componentes/MiCard";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  }
});

class LandingPage extends React.PureComponent {
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

    return (
      <div className={classes.mainContainer}>
        <div style={{ flex: '1' }}></div>
        <MiCard rootClassName={classes.rootClassName} className={classes.contentLandingPage}>
          <Grid container spacing={16}>
            <Grid item xs={6} sm={6} className={classes.contenedorAvatar}>
              <Avatar alt="Si Si" title="SiSi Presencial" src="https://servicios2.cordoba.gov.ar/CBA147/ResourcesSiSi/Imagenes/favicon.png" className={classes.avatar} />
              <Typography variant="subheading" gutterBottom>Si Si Presencial</Typography>
            </Grid>

            <Grid item xs={6} sm={6} className={classes.contenedorAvatar}>
              <Avatar alt="Si Si" title="SiSi Virtual" src="https://servicios2.cordoba.gov.ar/CBA147/ResourcesSiSi/Imagenes/favicon.png" className={classes.avatar} />
              <Typography variant="subheading" gutterBottom>Si Si Virtual</Typography>
            </Grid>
          </Grid>

          <br/><br/>

          <Typography variant="subheading" gutterBottom className={classes.textoInformativo}>
          Bienvenido al programa Sí Estudio Sí Trabajo!<br/>
          Próximamente desde acá podrás gestionar tus datos y programas al que quieras participar.<br/>
          <br/>
          Son cursos gratuitos de formación profesional virtuales, capacitaciones presenciales remuneradas para jóvenes de 18 a 24 años, cursos presenciales gratuitos para mayores de 24 años sin empleo y prácticas laborales remuneradas.<br/>
          <br/>
          En Córdoba decimos Si Estudio Si Trabajo y queremos que vos seas protagonista.
          </Typography>
          
          <br/>

          <Button
              variant="contained"
              color="secondary"
              className={classes.buttonActions}
              href={'https://servicios2.cordoba.gov.ar/MuniOnlinePanel/#/'}
              target={'_blank'}
            >Volver a Muni Online</Button>
        </MiCard>
        <div style={{ flex: '1' }}></div>
      </div>
    );
  }
}

let componente = LandingPage;
componente = connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;