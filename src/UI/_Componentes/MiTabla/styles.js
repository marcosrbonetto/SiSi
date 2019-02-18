import { lighten } from '@material-ui/core/styles/colorManipulator';

export const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    borderRadius: '6px'
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '6px'
  },
  paddingLeft: {
    paddingLeft: '20px'
  },
  fontSize: {
    '& td':{
    fontSize: '15px !important'
    }
  },
  cellNumeric: {
    textAlign: 'right'
  }
});

export const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  tableHead: {
    background: '#149257'
  },
  tableCell: {
    color: '#fff !important',
    fontSize: '16px'
  },
  overrides: {
    tableCell: {
      color: 'red'
    },
  },
  paddingLeft: {
    paddingLeft: '20px'
  }
});