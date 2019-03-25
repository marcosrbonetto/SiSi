const styles = theme => ({
  mainContainer: {
    width: '100%',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  root: {
    width: '700px',
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
    ...theme.button,
    width: '160px',
    margin: '0px auto',
  },
  iconoBoton: {
    fontSize: '16px',
    lineHeight: '14px',
    marginRight: '4px',
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
    borderRadius: '20px'
  },
  iconDesinscripcion: {
    cursor: 'pointer'
  }
});


export default styles;