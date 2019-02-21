import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Material UI 
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
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

class DatosContacto extends React.PureComponent {
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
          titulo={'Datos de contacto'}
          seccionBotones={{
            align: 'right',
            content: <Button variant="outlined" color="primary" className={classes.button}>
            <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
            Modificar</Button>
          }}
        >
          <Grid container>
            <Grid item xs={12} sm={12}>
              <MiInput
                icono={'mail'}
                tipoInput={'input'}
                label={'E-Mail'}
                defaultValue={'adridotta@gmail.com'}
              />
            </Grid>
            <br/><br/><br/><br/>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <MiInput
                      icono={'phone'}
                      tipoInput={'input'}
                      type={'number'}
                      label={'Celular'}
                      defaultValue={'351'}
                      preInput={'0'}
                      placeholder={'Área'}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} className={classes.bottomContent}>
                    <MiInput
                      tipoInput={'input'}
                      type={'number'}
                      defaultValue={'2056172'}
                      preInput={'15'}
                      placeholder={'Número'}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <MiInput
                      icono={'phone'}
                      tipoInput={'input'}
                      type={'number'}
                      label={'Fijo'}
                      preInput={'0'}
                      placeholder={'Área'}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} className={classes.bottomContent}>
                    <MiInput
                      tipoInput={'input'}
                      type={'number'}
                      defaultValue={''}
                      placeholder={'Número'}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br/><br/><br/><br/>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <MiInput
                      iconoSvg={<svg viewBox="0 0 512 512">
                          <path d="M448,0H64C28.704,0,0,28.704,0,64v384c0,35.296,28.704,64,64,64h192V336h-64v-80h64v-64c0-53.024,42.976-96,96-96h64v80
                            h-32c-17.664,0-32-1.664-32,16v64h80l-32,80h-48v176h96c35.296,0,64-28.704,64-64V64C512,28.704,483.296,0,448,0z"/>
                      </svg>}
                      tipoInput={'input'}
                      type={'text'}
                      label={'Facebook'}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} className={classes.bottomContent}>
                    <MiInput
                      iconoSvg={<svg viewBox="0 0 512 512">
                        <path d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016
                            c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992
                            c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056
                            c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152
                            c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792
                            c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44
                            C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568
                            C480.224,136.96,497.728,118.496,512,97.248z"/>
                      </svg>}
                      tipoInput={'input'}
                      type={'text'}
                      label={'Twitter'}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <MiInput
                      iconoSvg={<svg viewBox="0 0 512 512">
                        <g>
                          <path d="M352,0H160C71.648,0,0,71.648,0,160v192c0,88.352,71.648,160,160,160h192c88.352,0,160-71.648,160-160V160
                            C512,71.648,440.352,0,352,0z M464,352c0,61.76-50.24,112-112,112H160c-61.76,0-112-50.24-112-112V160C48,98.24,98.24,48,160,48
                            h192c61.76,0,112,50.24,112,112V352z"/>
                        </g>
                        <g>
                          <path d="M256,128c-70.688,0-128,57.312-128,128s57.312,128,128,128s128-57.312,128-128S326.688,128,256,128z M256,336
                            c-44.096,0-80-35.904-80-80c0-44.128,35.904-80,80-80s80,35.872,80,80C336,300.096,300.096,336,256,336z"/>
                        </g>
                        <g>
                          <circle cx="393.6" cy="118.4" r="17.056"/>
                        </g>
                      </svg>}
                      tipoInput={'input'}
                      type={'text'}
                      label={'Instagram'}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} className={classes.bottomContent}>
                    <MiInput
                      iconoSvg={<svg viewBox="0 0 512 512">
                        <g>
                          <rect y="160" width="114.496" height="352"/>
                        </g>
                        <g>
                          <path d="M426.368,164.128c-1.216-0.384-2.368-0.8-3.648-1.152c-1.536-0.352-3.072-0.64-4.64-0.896
                            c-6.08-1.216-12.736-2.08-20.544-2.08c-66.752,0-109.088,48.544-123.04,67.296V160H160v352h114.496V320
                            c0,0,86.528-120.512,123.04-32c0,79.008,0,224,0,224H512V274.464C512,221.28,475.552,176.96,426.368,164.128z"/>
                        </g>
                        <g>
                          <circle cx="56" cy="56" r="56"/>
                        </g>
                      </svg>}
                      tipoInput={'input'}
                      type={'text'}
                      label={'LinkedIn'}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  bottomContent: {
    display: 'flex',
    alignItems: 'flex-end',
  },
});

let componente = DatosContacto;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;