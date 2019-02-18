import React from "react";
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

import { mostrarCargando } from '@Redux/Actions/mainContent';

import servicesTributarioOnline from '@Rules/Rules_TributarioOnline';

const mapStateToProps = state => {
    return {
        loggedUser: state.Usuario.loggedUser,
        tipoTributos: state.MainContent.tipoTributos,

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

class TributarioAccessBusqueda extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            inputIdentificador: '',
            errorInputIdentificador: false,
            mensajeError: false
        }
    }

    //Ingreso de identificador en busqueda por Tributo
    handleInputIdentificador = (event) => {
        this.setState({
            ...this.state,
            inputIdentificador: event.target.value.toUpperCase()
        });
    }

    handleEntrarIdentificador = () => {
        const token = 'INVITADO'; //Tanto el Invitado con el VV pueden consultar (defecto INVITADO)
        const idTipoTributo = this.props.idTipoTributo;
        const identificador = this.state.inputIdentificador;

        if (identificador == '') {
            this.setState({
                errorInputIdentificador: true,
                mensajeError: 'Debe ingresar un identificador'
            });
            return false;
        } 
        else if (!this.props.regexFormato.test(identificador)) {
            this.setState({
                errorInputIdentificador: true,
                mensajeError: 'El formato es incorrecto'
            });
            return false;
        }

        this.props.mostrarCargando(true);
        servicesTributarioOnline.getTributoByIdentificador(token, idTipoTributo, identificador)
            .then((datos) => {
                this.props.mostrarCargando(false);

                if (!datos.ok) {
                    this.setState({
                        errorInputIdentificador: true,
                        mensajeError: datos.error
                    });
                    return false;
                }

                const data = datos.return;
                const tipoTributoPadre = this.props.tipoTributos.byKey[data.tipoTributo];
                const identificadorPadre = data.identificador;

                const tipoTributo = this.props.tipoTributos.byKey[idTipoTributo];

                if (tipoTributoPadre && identificadorPadre) {
                    this.props.redireccionar({
                        pathname: '/DetalleTributario/' + tipoTributo + '/' + encodeURIComponent(identificador),
                        search: '?tipoTributo=' + tipoTributoPadre + '&identificador=' + identificadorPadre
                    });
                } else {
                    this.props.redireccionar('/DetalleTributario/' + tipoTributo + '/' + encodeURIComponent(identificador))
                }
            }).catch(err => {
                console.warn("[Advertencia] Ocurrió un error al intentar comunicarse con el servidor.");
            });
    }

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

                        title={
                            <Typography className={classes.title} variant="title">{this.props.titulo}</Typography>
                        }
                    />
                    <div className={classes.sectionInputSpacingInvitado}>

                        <Grid container spacing={0} alignItems="flex-end">
                            <Grid item xs={9}>

                                <TextField
                                    id="input-identificador"
                                    label={"Ingresar " + this.props.identificador}
                                    className={classes.selectTipoTributo}
                                    margin="normal"
                                    value={this.state.inputIdentificador}
                                    onChange={this.handleInputIdentificador}
                                    error={this.state.errorInputIdentificador}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classNames(classes.buttonActions, "buttonActions")}
                                    onClick={this.handleEntrarIdentificador}
                                >Entrar</Button>
                            </Grid>

                            {this.state.mensajeError && <div>
                                <Typography className={classes.mensajeError} variant="subheading">{this.state.mensajeError}</Typography>
                            </div>}
                        </Grid>

                    </div>
                </MiCard>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(TributarioAccessBusqueda));
