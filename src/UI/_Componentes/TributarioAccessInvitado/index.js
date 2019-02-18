import React from "react";
import _ from "lodash";
import classNames from "classnames";

//Styles
import { withStyles } from "@material-ui/core/styles";
import styles from './styles';
import { connect } from "react-redux";
import { push } from "connected-react-router";

import Button from "@material-ui/core/Button";
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import MiCard from "@Componentes/MiCard";
import Tooltip from '@material-ui/core/Tooltip';

import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PlayArrow from '@material-ui/icons/PlayArrow';

import { mostrarCargando } from '@Redux/Actions/mainContent';
import servicesRepresentantes from '@Rules/Rules_Representantes';


const mapStateToProps = state => {
    return {
        loggedUser: state.Usuario.loggedUser,
        tributosBienesPorCUIT: state.AfipController.tributosBienesPorCUIT,
    };
};

const mapDispatchToProps = dispatch => ({
    redireccionar: url => {
        dispatch(push(url));
    },
    mostrarCargando: (cargar) => {
        dispatch(mostrarCargando(cargar));
    },
});

class TributarioAccessInvitado extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            opcionesTributos: _.filter(this.props.tributosBienesPorCUIT, { tipoTributo: parseInt(this.props.id) }) || [],
            inputIdentificadorTributo: '',
            errorInputIdentificador: false,
            mensajeError: false
        }
    }

    componentWillReceiveProps(nextProps) {

        if (JSON.stringify(this.props.tributosBienesPorCUIT) != JSON.stringify(nextProps.tributosBienesPorCUIT)) {
            this.setState({
                opcionesTributos: _.filter(nextProps.tributosBienesPorCUIT, { tipoTributo: parseInt(this.props.id) }) || [],
            });
        }
    }

    //Ingreso de identificador en busqueda por Tributo
    handleInputIdentificador = (event) => {
        this.setState({
            ...this.state,
            inputIdentificadorTributo: event.target.value.toUpperCase()
        });
    }

    handleEntrarTributo = () => {
        this.props.mostrarCargando(true);
        const token = this.props.loggedUser.token;
        const idTipoTributo = this.props.id;
        const tipoTributo = this.props.tipo;
        const identificador = this.state.inputIdentificadorTributo;
        const validacion = this.props.validacion;

        if (validacion && !validacion.test.test(identificador)) {
            this.setState({
                ...this.state,
                mensajeError: validacion.msjError,
                errorInputIdentificador: true
            });
            this.props.mostrarCargando(false);
            return false;
        }

        servicesRepresentantes.getTitularTributo(token, {
            "tipoTributo": idTipoTributo,
            "identificador": identificador
        })
            .then((datos) => {
                this.props.mostrarCargando(false);

                if (datos.ok) {
                    //CAMBIAR!!
                    //localStorage.setItem("representante", datos.return.titular);

                    this.props.redireccionar('/DetalleTributario/' + tipoTributo + '/' + encodeURIComponent(identificador));
                } else {
                    this.setState({
                        ...this.state,
                        mensajeError: datos.error,
                        errorInputIdentificador: true
                    })
                }

            }).catch(err => {
                console.warn("[Advertencia] Ocurrió un error al intentar comunicarse con el servidor.");
            });
    }

    handleEnter = (e) => {
        if (e.key === 'Enter') {
            this.handleEntrarTributo();
        }
    }

    eventRedirect = (identificador, tipoTributo) => {
        this.props.eventRedirect(tipoTributo, identificador);
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <MiCard
                    onClick={this.props.onClick}
                    onMouseLeave={this.onMouseLeave}
                    onMouseEnter={this.onMouseEnter}
                >
                    <CardHeader
                        className={classes.header}
                        avatar={
                            (this.props.icono && <Icon className={classes.icon}>
                                {this.props.icono}
                            </Icon>)
                            ||
                            (!this.props.icono && <div className={classes.iconSvg}>{this.props.iconoSvg}</div>)
                        }
                        action={
                            this.props.infoTributo && <Tooltip
                                disableFocusListener disableTouchListener
                                classes={{ tooltip: classes.textTooltip }}
                                title={
                                    this.props.infoTributo
                                }
                            >
                                <i className={classNames(classes.infoIcon, "material-icons")}>info</i>
                            </Tooltip>
                        }
                        title={
                            <Typography className={classes.title} variant="title">{this.props.titulo}</Typography>
                        }
                    />
                    <div className={classes.sectionInputSpacingInvitado}>
                        <Grid container spacing={0} alignItems="flex-end">
                            <Grid item xs={9}>

                                <TextField
                                    id="input-identificador"
                                    label="Ingresar Identificador"
                                    className={classes.selectTipoTributo}
                                    margin="normal"
                                    value={this.state.inputIdentificadorTributo}
                                    onChange={this.handleInputIdentificador}
                                    error={this.state.errorInputIdentificador}
                                    onKeyUp={this.handleEnter}
                                    autoComplete="on"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classNames(classes.buttonActions, "buttonActions")}
                                    onClick={this.handleEntrarTributo}
                                >Entrar</Button>
                            </Grid>

                            {this.state.mensajeError && <div>
                                <Typography className={classes.mensajeError} variant="subheading">{this.state.mensajeError}</Typography>
                            </div>}
                        </Grid>
                    </div>

                    {this.state.opcionesTributos.length > 0 && <div className={classes.sectionInputSpacingInvitado}>
                        <Grid container spacing={0}>
                            <Grid item md={12}>
                                <List component="nav" className={classes.navList}>
                                    {Array.isArray(this.state.opcionesTributos) && this.state.opcionesTributos.map((data, index) => {
                                        return <ListItem key={index} className={classes.itemLista} button onClick={() => this.eventRedirect(data.identificador, this.props.tipo)}>
                                            <ListItemIcon>
                                                <PlayArrow className={classes.iconColor} />
                                            </ListItemIcon>
                                            <ListItemText primary={<div>
                                                <Typography className={classes.titleItem} variant="title">{data.identificador}</Typography>
                                                <Typography className={classes.titleItem} >{data.representado}</Typography>
                                            </div>
                                            } />

                                        </ListItem>
                                    })}
                                </List>
                            </Grid>
                        </Grid>
                    </div>}
                </MiCard>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(TributarioAccessInvitado));
