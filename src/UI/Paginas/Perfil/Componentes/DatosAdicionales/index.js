import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Material UI 
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";

const mapStateToProps = state => {
    return {
        loggedUser: state.Usuario.loggedUser,
        paraMobile: state.MainContent.paraMobile,
    };
};

const mapDispatchToProps = dispatch => ({
    mostrarCargando: (cargar) => {
        dispatch(mostrarCargando(cargar));
    }
});

class DatosAdicionales extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentWillMount() {

    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <MiCard
                    titulo={'Datos adicionales'}
                    seccionBotones={{
                        align: 'right',
                        content: <Button variant="outlined" color="primary" className={classes.button}>
                        <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
                        Modificar</Button>
                    }}
                >
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={6}>
                            <MiInput
                                tipoInput={'select'}
                                label={'Estado civil'}
                                defaultValue={0}
                                itemsSelect={
                                    [
                                        {
                                            value: 0,
                                            label: 'Seleccione...'
                                        },
                                        {
                                            value: 1,
                                            label: 'Soltero/a'
                                        },
                                        {
                                            value: 2,
                                            label: 'Casado/a'
                                        },
                                        {
                                            value: 3,
                                            label: 'Divorciado/a'
                                        },
                                        {
                                            value: 4,
                                            label: 'Viudo/a'
                                        },
                                        {
                                            value: 5,
                                            label: 'Separado/a'
                                        },
                                    ]
                                }
                            />
                            <br />
                            <MiInput
                                tipoInput={'select'}
                                label={'Estudios alcanzados'}
                                defaultValue={0}
                                itemsSelect={
                                    [
                                        {
                                            value: 0,
                                            label: 'Seleccione...'
                                        },
                                        {
                                            value: 1,
                                            label: 'Primario incompleto'
                                        },
                                        {
                                            value: 2,
                                            label: 'Primario completo'
                                        },
                                        {
                                            value: 3,
                                            label: 'Secundario incompleto'
                                        },
                                        {
                                            value: 4,
                                            label: 'Secundario completo'
                                        },
                                        {
                                            value: 5,
                                            label: 'Universitario incompleto'
                                        },
                                        {
                                            value: 6,
                                            label: 'Universitario completo'
                                        },
                                        {
                                            value: 7,
                                            label: 'Posgrado incompleto'
                                        },
                                        {
                                            value: 8,
                                            label: 'Posgrado completo'
                                        }
                                    ]
                                }
                            />
                            <br />
                            <MiInput
                                tipoInput={'input'}
                                type={'number'}
                                label={'Cantidad de hijos'}
                                defaultValue={'0'}
                            />
                            <br />
                            <MiInput
                                tipoInput={'checkbox'}
                                label={'Actualmente tengo trabajo'}
                                checked={false}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <MiInput
                                tipoInput={'select'}
                                label={'Ocupación'}
                                defaultValue={0}
                                itemsSelect={
                                    [
                                        {
                                            value: 0,
                                            label: 'Seleccione...'
                                        },
                                        {
                                            value: 1,
                                            label: 'Desocupado'
                                        },
                                        {
                                            value: 1,
                                            label: 'Estudiante'
                                        },
                                        {
                                            value: 1,
                                            label: 'Abogado'
                                        },
                                        {
                                            value: 1,
                                            label: 'Administrativo'
                                        },
                                        {
                                            value: 1,
                                            label: 'Albañil / Obrero'
                                        },
                                        {
                                            value: 1,
                                            label: 'Animador de fiestas'
                                        },
                                        {
                                            value: 1,
                                            label: 'Arquitecto'
                                        },
                                        {
                                            value: 1,
                                            label: 'Artesano'
                                        },
                                        {
                                            value: 1,
                                            label: 'Artista plástico'
                                        },
                                        {
                                            value: 1,
                                            label: 'Astrónomo'
                                        },
                                        {
                                            value: 1,
                                            label: 'Atención al cliente'
                                        },
                                        {
                                            value: 1,
                                            label: 'Auxiliar de clínica'
                                        },
                                        {
                                            value: 1,
                                            label: 'Auxiliar de veterinaria'
                                        },
                                        {
                                            value: 1,
                                            label: 'Auxiliar docente'
                                        },
                                        {
                                            value: 1,
                                            label: 'Barman'
                                        },
                                        {
                                            value: 1,
                                            label: 'Bioquímico'
                                        },
                                        {
                                            value: 1,
                                            label: 'Cadete'
                                        },
                                        {
                                            value: 1,
                                            label: 'Cajero/a'
                                        },
                                        {
                                            value: 1,
                                            label: 'Camarero / Mozo'
                                        },
                                        {
                                            value: 1,
                                            label: 'Carpintero'
                                        },
                                        {
                                            value: 1,
                                            label: 'Chofer'
                                        },
                                        {
                                            value: 1,
                                            label: 'Científico'
                                        },
                                        {
                                            value: 1,
                                            label: 'Cocinero / Cheef'
                                        },
                                        {
                                            value: 1,
                                            label: 'Community Manager'
                                        },
                                        {
                                            value: 1,
                                            label: 'Concerge'
                                        },
                                        {
                                            value: 1,
                                            label: 'Consultor'
                                        },
                                        {
                                            value: 1,
                                            label: 'Contador / Economista'
                                        },
                                        {
                                            value: 1,
                                            label: 'Corredor de bolsa'
                                        },
                                        {
                                            value: 1,
                                            label: 'Decorador de interiores'
                                        },
                                        {
                                            value: 1,
                                            label: 'Dentista'
                                        },
                                        {
                                            value: 1,
                                            label: 'Deportista'
                                        },
                                        {
                                            value: 1,
                                            label: 'Diseñador gráfico y digital'
                                        },
                                        {
                                            value: 1,
                                            label: 'Docente'
                                        },
                                        {
                                            value: 1,
                                            label: 'Enfermero/a'
                                        },
                                        {
                                            value: 1,
                                            label: 'Esteticista'
                                        },
                                        {
                                            value: 1,
                                            label: 'Fisioterapeuta'
                                        },
                                        {
                                            value: 1,
                                            label: 'Gerente / Director'
                                        },
                                        {
                                            value: 1,
                                            label: 'Gestor'
                                        },
                                        {
                                            value: 1,
                                            label: 'Guardia de seguridad'
                                        },
                                        {
                                            value: 1,
                                            label: 'Jardinero'
                                        },
                                        {
                                            value: 1,
                                            label: 'Locutor'
                                        },
                                        {
                                            value: 1,
                                            label: 'Martillero'
                                        },
                                        {
                                            value: 1,
                                            label: 'Médico'
                                        },
                                        {
                                            value: 1,
                                            label: 'Militar'
                                        },
                                        {
                                            value: 1,
                                            label: 'Modista'
                                        },
                                        {
                                            value: 1,
                                            label: 'Monja / Sacerdote'
                                        },
                                        {
                                            value: 1,
                                            label: 'Operativo de camión de carga'
                                        },
                                        {
                                            value: 1,
                                            label: 'Operativo de imprenta'
                                        },
                                        {
                                            value: 1,
                                            label: 'Operativo/a agrícola'
                                        },
                                        {
                                            value: 1,
                                            label: 'Operativo/a de fábrica'
                                        },
                                        {
                                            value: 1,
                                            label: 'Otro'
                                        },
                                        {
                                            value: 1,
                                            label: 'Peluquero/a'
                                        },
                                        {
                                            value: 1,
                                            label: 'Periodista'
                                        },
                                        {
                                            value: 1,
                                            label: 'Personal de limpieza'
                                        },
                                        {
                                            value: 1,
                                            label: 'Piloto de aeronave'
                                        },
                                        {
                                            value: 1,
                                            label: 'Pintor de mampostería'
                                        },
                                        {
                                            value: 1,
                                            label: 'Preparador físico'
                                        },
                                        {
                                            value: 1,
                                            label: 'Profesor'
                                        },
                                        {
                                            value: 1,
                                            label: 'Programador en software'
                                        },
                                        {
                                            value: 1,
                                            label: 'Psicólogo'
                                        },
                                        {
                                            value: 1,
                                            label: 'Psicopedagogo/a'
                                        },
                                        {
                                            value: 1,
                                            label: 'Relacionista Público'
                                        },
                                        {
                                            value: 1,
                                            label: 'Reportero de medios'
                                        },
                                        {
                                            value: 1,
                                            label: 'Repositor de mercadería'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico chapista'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico de Electrodomésticos'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico de panadería'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico de servicios generales'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico electricista'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico electrónico'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico en aeronáutica'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico en automotores'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico en medios de comunicación'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico IT'
                                        },
                                        {
                                            value: 1,
                                            label: 'Técnico tapicero'
                                        },
                                        {
                                            value: 1,
                                            label: 'Telefonista / Recepcionista'
                                        },
                                        {
                                            value: 1,
                                            label: 'Terapeuta'
                                        },
                                        {
                                            value: 1,
                                            label: 'Traductor'
                                        },
                                        {
                                            value: 1,
                                            label: 'Vendedor'
                                        },
                                        {
                                            value: 1,
                                            label: 'Veterinario'
                                        },
                                        {
                                            value: 1,
                                            label: 'Zapatero'
                                        },
                                    ]
                                }
                            />
                        </Grid>
                    </Grid>
                </MiCard>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    bottomContent: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    alignRight: {
        textAlign: 'right'
    }
});

let componente = DatosAdicionales;
componente = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;