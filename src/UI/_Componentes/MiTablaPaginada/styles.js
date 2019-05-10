const styles = theme => {
    return {
      orderLabel: {
        color: '#fff !important',
        cursor: 'pointer'
      },
      tableHead: { 
        backgroundColor: "#149257",
      },
      headRow: {
        '& th:last-child': {
          borderTopRightRadius: '6px',
          color: '#fff',
          fontSize: '16px'
        },
        '& th:first-child': {
          borderTopLeftRadius: '6px',
          color: '#fff',
          fontSize: '16px'
        },
        '& th': {
          color: '#fff',
          fontSize: '16px'
        },
        '&:hover span': {
          color: '#fff',
        }
      },
      bodyRow: {
        '& td:last-child': {
          borderRight: '1px solid #ddd'
        },
        '& td:first-child': {
          borderLeft: '1px solid #ddd'
        },
        '& td': {
          fontSize: '15px !important'
        },
      }
    };
  };
  
  export default styles;