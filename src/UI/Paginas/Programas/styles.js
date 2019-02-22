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
    ...theme.button,
    width: '160px',
    margin: '0px auto',
  },
});


export default styles;