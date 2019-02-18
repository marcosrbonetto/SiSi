const styles = theme => ({
    mainContainer: {
      width: '100%',
      margin: '16px',
      display: 'flex',
      justifyContent: 'center',
    },
    rootClassName: {
      flex: '2'
    },
    avatar: {
      margin: '0px auto',
      width: '60px',
      height: '60px',
      '&:hover': {
        boxShadow: '0px 0px 16px 0px #149257'
      }
    },
    contenedorAvatar: {
      textAlign: 'center',
      cursor: 'pointer'
    },
    textoInformativo: {
      textAlign: 'center'
    },
    buttonActions: {
      overflow: 'visible',
      display: 'inline-block',
      minWidth: 'auto',
      margin: '2px',
      borderRadius: '20px',
      display: 'table',
      margin: '0px auto',
    },
  });

  
  export default styles;