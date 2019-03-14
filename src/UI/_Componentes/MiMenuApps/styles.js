const botonAppWidth = 80;
const botonAppMargin = 8;

const styles = theme => {
  return {
    boton: {
      color: "white",
     
    },
    icon: {
      marginRight: "4px"
    },
    menu: {
      paddingLeft: 12,
      paddingRight: 12,
      maxWidth: (botonAppWidth + botonAppMargin * 2) * 3 + 24,
      minWidth: (botonAppWidth + botonAppMargin * 2) * 3 + 24,
      outline: "none",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      "& .app": {
        margin: botonAppMargin,
        maxWidth: botonAppWidth,
        minWidth: botonAppWidth,
        overflow: "hidden",
        "& .icono": {
          width: 50,
          height: 50
        },
        "& .nombre": {
          marginTop: 8,
          minHeight: 40,
          overflow: "hidden",
          maxHeight: 40,
          fontSize: "12px",
          textAlign: "center",
          textTransform: "initial"
        }
      }
    }
  };
};
export default styles;