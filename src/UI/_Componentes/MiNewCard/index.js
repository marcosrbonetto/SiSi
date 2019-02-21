import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import { Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

class MiCard extends React.PureComponent {
  render() {
    let { classes,
      titulo,
      informacionAlerta,
      seccionBotones,
     } = this.props;

    let conMargin = "margin" in this.props && this.props.margin !== false;
    let conTitulo = "titulo" in this.props && this.props.titulo !== undefined;
    let sinPadding = "padding" in this.props && this.props.padding === false;

    return (
      <div className={this.props.rootClassName}>
        {conTitulo && (
          <Typography
            className={classNames(
              classes.titulo,
              conMargin && classes.tituloMargin
            )}
            variant="headline"
          >
            {titulo}
          </Typography>
        )}

        <Card
          elevation={this.props.elevation}
          className={classNames(
            classes.card,
            classNames(this.props.className),
            conMargin && classes.cardMagin,
            conTitulo && conMargin && classes.cardMarginTitulo
          )}
          {...this.props.cardProps}
        >
          {informacionAlerta && <div className={classes.classSeccionTopBottom}>
            <i className={classNames('material-icons', classes.classIconoInfo ,this.props.classIconoInfo)}>info</i>
            <Typography variant="body2" className={this.props.textoInfo}>{informacionAlerta}</Typography>
          </div>}
          <CardContent
            className={classNames(
              classes.content,
              this.props.contentClassName,
              sinPadding && classes.cardSinPadding
            )}
          >

            {this.props.children}
          </CardContent>
          {seccionBotones && <div 
          className={classNames(classes.classSeccionTopBottom, seccionBotones.className, 
          (seccionBotones.align == 'left' && classes.contentAlignLeft) || (seccionBotones.align == 'center' && classes.contentAlignCenter) || (seccionBotones.align == 'right' && classes.contentAlignRight))}>
            {seccionBotones.content}
          </div>}
        </Card>
      </div>
    );
  }
}

const styles = theme => ({
  card: {
    borderRadius: theme.spacing.unit * 2
    // transition: "all 0.3s"
  },
  cardMagin: {
    margin: theme.spacing.unit * 2
  },
  cardMarginTitulo: {
    marginTop: theme.spacing.unit * 1
  },
  titulo: {
    marginLeft: theme.spacing.unit * 4
  },
  tituloMargin: {
    marginTop: theme.spacing.unit * 2
  },
  content: {},
  cardSinPadding: {
    padding: '0 !important'
  },
  classSeccionTopBottom: {
    padding: '20px',
    whiteSpace: 'normal',
    background: '#f1f1f1',
    display: 'flex',
    alignItems: 'center',
  },
  classIconoInfo: {
    margin: '0px 14px 0px 0px',
    color: '#ffb300'
  },
  contentAlignLeft: {
    justifyContent: 'flex-start'
  },
  contentAlignCenter: {
    justifyContent: 'center'
  },
  contentAlignRight: {
    justifyContent: 'flex-end'
  }
});

export default withStyles(styles)(MiCard);
