const styles = theme => ({
  mainContainer: {
    width: '100%',
    padding: '20px'
  },
  miCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignitems: 'flex-start',
  },
  centerItems: {
    display: 'flex',
    alignItems: 'center',
  },
  limpiarSelect: {
    marginTop: '16px',
    cursor: 'pointer'
  },
  buttonActions: {
    overflow: 'visible',
    display: 'inline-block',
    minWidth: 'auto',
    margin: '2px',
    borderRadius: '20px',
  },
  containerBotonera: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  iconoAceptar: {
    background: theme.color.ok.main,
    boxShadow: 'none',
    minWidth: '10px',
    borderRadius: '30px',
    marginRight: '4px',
    '&:hover': {
      background: theme.color.ok.main,
    }
  },
  iconoEliminar: {
    background: '#cacaca',
    boxShadow: 'none',
    minWidth: '10px',
    borderRadius: '30px',
    marginRight: '4px',
    '&:hover': {
      background: '#929090'
    }
  },
  tituloPrograma: {
    borderBottom: '2px solid #000',
    marginBottom: '4px',
    fontSize: '1.5em',
  },
  tituloCurso: {
    margin: '5px 0px'
  },
  containerReporte: {
    width: '210mm'
  },
  tablasReporte: {
    width: '100%',
    textAlign: 'center',
    color: '#000',
    fontSize: '0.8em',
    borderSpacing: '0',
    borderCollapse: 'collapse',
    '& th': {
      borderTop: '1px solid #000',
      borderBottom: '1px solid #000',
    }
  },
  imgMuni: {
    float: 'right'
  }
});


export default styles;