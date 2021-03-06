const styles = theme => ({
  mainContainer: {
    width: '100%',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  miCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignitems: 'flex-start',
  },
  titulo: {
    color: '#000',
    fontWeight: 'bold'
  },
  centerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  informacion: {
    fontSize: '20px',
    fontWeight: '400',
  },
  icono: {
    margin: 10,
    width: 80,
    height: 80,
    float: 'right'
  },
  iconoOcupacion: {
    width: '24px',
    margin: '4px',
    fill: '#737373',
  },
  usuario: {
    fontSize: '1.5em',
    marginBottom: '4px'
  },
  iconoDetalle: {
    color: theme.color.block.main,
    margin: '4px'
  },
  link: {
    color: theme.color.ok.main,
    textDecoration: 'underline'
  },
  iconoBoton: {
    fontSize: '16px',
    lineHeight: '14px',
    marginRight: '4px',
  },
  secondaryColor: {
    color: theme.color.ok.main,
  },
  button: {
    marginTop: '6px'
  },
  iconOcupacion: {
    fontSize: '22px',
    verticalAlign: 'middle',
    color: 'red',
    cursor: 'pointer',
  },
  textTooltip: {
    fontSize: '16px'
  },
  inlineBoxes: {
    '& > *': {
      display: 'inline-flex'
    }
  }
});


export default styles;