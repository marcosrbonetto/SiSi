const styles = theme => ({
  mainContainer: {
    width: '100%',
    padding: '20px'
  },
  buttonsAction: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  centerItems: {
    display: 'flex',
    alignItems: 'center',
    margin: '6px auto'
  },
  limpiarSelect: {
    marginTop: '16px',
    cursor: 'pointer'
  },
  containerBotonera: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: '8px',
  },
  asignacionAulas: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  widthAuto: {
    width: 'auto'
  },
  iconoAceptar: {
    background: '#fff',
    border: '1px solid ' +theme.color.ok.main,
    color: theme.color.ok.main,
    boxShadow: 'none',
    minWidth: '10px',
    borderRadius: '30px',
    marginRight: '4px',
    '&:hover': {
      background: theme.color.ok.main,
      color: '#fff'
    }
  },
  iconoEliminar: {
    background: '#fff',
    border: '1px solid #cacaca',
    color: '#cacaca',
    boxShadow: 'none',
    minWidth: '10px',
    borderRadius: '30px',
    '&:hover': {
      background: '#cacaca',
      color: '#fff'
    }
  },
  tituloReporte: {
    fontSize: '1.8em',
  },
  contentTable: {
    marginTop: '14px'
  },
  buttonFilter: {
    overflow: 'visible',
    display: 'inline-block',
    minWidth: 'auto',
    margin: '2px',
    borderRadius: '20px',
    marginLeft: '20px',
    marginTop: '10px',
  }
});


export default styles;