const styles = theme => ({
  labelInput: {
    display: 'block',
    color: '#000'
  },
  sectionInputSpacing: {
    marginTop: '10px',
    '& div': {
      width: '100%'
    },
    '& input': {
      padding: '5px 0 5px',
      height: '25px'
    },
    '& > div > div > div': {
      marginTop: '6px'
    },
    '& select': {
      padding: '5px 0 7px',
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
  title: {
    paddingBottom: '12px',
    textAlign: 'left'
  },
  importButton: {
    top: '10px',
    right: '20px',
  },
  maxWidth: {
    minWidth: '100%',
    minHeight: '100%',
  },
  buttonCUIT: {
    margin: '0px 5px'
  }
});


export default styles;