const styles = theme => ({
  mainContainer: {
    width: '100%',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  tituloPrograma: {
    fontSize: '20px'
  },
  informacion: {
    fontSize: '20px',
    fontWeight: '400',
  },
  containerTienePreInscripcion: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  imgSiSi: {
    display: 'block',
    margin: '0px auto'
  },
  button: {
    fontSize: '16px',
  },
  iconoBoton: {
    fontSize: '14px',
    lineHeight: '18px',
    marginRight: '4px',
  },
  textCenter: {
    textAlign: 'center'
  },
  secondaryColor: {
    color: theme.color.ok.main,
  },
  seccionCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonModifDatosAdicionales: {
    width: 'auto',
  },
  buttonDesinscribirme: {
    width: '200px',
    margin: '0px auto',
  }
});


export default styles;