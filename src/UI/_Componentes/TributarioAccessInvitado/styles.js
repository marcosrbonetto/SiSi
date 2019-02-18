const styles = theme => ({
  buttonActions: {
    display: 'inline-block',
    minWidth: 'auto',
    margin: '2px',
    borderRadius: '20px',
    '&[type="cancel"]': {
      background: 'rgb(244,67,54)',
      marginRight: '10px'
    }
  },
  header: {
    fontSize: 'large',
    padding: '0px',
    borderBottom: '2px solid rgb(76, 175, 80)'
  },
  icon: {
    margin: '0px',
    color: '#757575',
    fontSize: '50px',
  },
  iconSvg: {
    '& svg': {
      width: '50px',
      fill: '#757575'
    }
  },
  title: {
    paddingBottom: '12px',
    textAlign: 'left'
  },
  selectTipoTributo: {
    width: '100%',
    marginTop: '0px',
    marginBottom: '0px',
  },
  sectionInputSpacingInvitado: {
    marginTop: '10px',
    '& div': {
      width: '100%'
    },
    '& input': {
      padding: '5px 0 5px',
      height: '25px'
    },
    '& > div > div > div': {
      marginTop: '0px'
    },
    '& select': {
      padding: '5px 0 7px',
    }
  },
  mensajeError: {
    color: theme.color.error.main,
    textAlign: 'left'
  },
  navList: {
    height: '108px',
    overflowY: 'auto',
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  itemLista: {
    paddingTop: '6px',
    paddingBottom: '6px',
  },
  iconColor: {
    color: '#149257'
  },
  titleItem: {
    paddingBottom: '0px',
    fontSize: '1em'
  },
  infoIcon: {
    color: '#0f8fea',
    verticalAlign: 'middle',
    cursor: 'pointer'
  },
  textTooltip: {
    fontSize: 16,
  }
});


export default styles;