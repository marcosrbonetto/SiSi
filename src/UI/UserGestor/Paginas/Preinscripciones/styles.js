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
    margin: '6px auto'
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
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: '8px',
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
    border: '1px solid ' + theme.color.error.main,
    color: theme.color.error.main,
    boxShadow: 'none',
    minWidth: '10px',
    borderRadius: '30px',
    '&:hover': {
      background: theme.color.error.main,
      color: '#fff'
    }
  },
  tituloReporte: {
    fontSize: '1.8em',
  },
  tituloPrograma: {
    borderBottom: '2px solid #000',
    marginBottom: '4px',
    fontSize: '1.5em',
  },
  tituloCurso: {
    margin: '5px 0px',
    fontSize: '1em',
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
  },
  buttonDescargaReporte: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  contentTable: {
    marginTop: '0px'
  },
  containerInfoEmpresa: {
    display: 'flex',
    alignItems: 'center'
  },
  buttonDescargaPlanilla: {
    color: theme.color.ok.main,
    textDecoration: 'underline',
    marginLeft: '24px'
  },
  widthInputEmailExcel: {
    width: '600px'
  },
  rowResultText: {
    margin: '5px auto',
    fontWeight: 'bold'
  }
});


export default styles;