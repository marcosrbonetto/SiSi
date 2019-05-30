import React from "react";

import * as Yup from 'yup';

import { Formik, Form, Field } from 'formik';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';

import { getInputText, getDatePicker, getSelect } from "@Componentes/FormikInputs";

import { withStyles } from "@material-ui/core/styles";

const validationForm = Yup.object().shape({
    nombre: Yup.string()
        .max(50, 'No sebe insertar más de 50 caracteres')
        .required('Campo requerido'),
    descripcion: Yup.string()
        .required('Campo requerido'),
    fechaInicioInscripcion: Yup.string()
        .required('Campo requerido'),
    fechaFinInscripcion: Yup.string()
        .test('match', 'La fecha de fin debe ser mayor a la fecha de inicio', function (fechaFin) {
            const fechaInicio = this.options.parent.fechaInicioInscripcion
            if (fechaFin && fechaInicio) {
                const dateInicio = new Date(fechaInicio);
                const dateFin = new Date(fechaFin);
                return dateFin > dateInicio;
            }

            return true;
        })
        .required('Campo requerido'),
    estudiosAlcanzadosLimInf: Yup.number()
        .typeError('Debe ingresar un número')
        .positive('Debe ingresar un numero positivo')
        .required('Campo requerido'),
    estudiosAlcanzadosLimSup: Yup.number()
        .typeError('Debe ingresar un número')
        .positive('Debe ingresar un numero positivo')
        .test('match', 'El limite superior debe ser mayor al limite inferior', function (limiteSup) {
            const limiteInf = this.options.parent.estudiosAlcanzadosLimInf
            if (limiteSup && limiteInf) {
                return limiteSup > limiteInf;
            }

            return true;
        })
        .required('Campo requerido'),
    inscripcionesPorUsuario: Yup.number()
        .typeError('Debe ingresar un número')
        .positive('Debe ingresar un numero positivo')
        .required('Campo requerido'),
});

class FormPrograma extends React.Component {

    handleSubmit = (values) => {
        const programaValues = {
            ...values,
            id: this.props.programa.data.id || undefined,
            menos24: values.menos24 == "1" ? true : false,
            soloParaDesocupados: values.soloParaDesocupados == "1" ? true : false,
            esVirtual: values.esVirtual == "1" ? true : false
        };

        this.props.onSubmit && this.props.onSubmit(programaValues);
    }

    render() {
        const { classes, programa } = this.props;

        if(!programa) return <Typography>Error, vuelva a intentarlo</Typography>;

        const inicioInscripcion = programa.data.inicioInscripcion ? programa.data.inicioInscripcion.split("T")[0] : false;
        const finInscripcion = programa.data.finInscripcion ? programa.data.finInscripcion.split("T")[0] : false;

        return (
            <Formik
                initialValues={{
                    nombre: programa.data.nombre || "",
                    descripcion: programa.data.descripcion || "",
                    menos24: programa.data.menos24 ? "1" : "0",
                    soloParaDesocupados: programa.data.soloParaDesocupados ? "1" : "0",
                    fechaInicioInscripcion: inicioInscripcion || "",
                    fechaFinInscripcion: finInscripcion || "",
                    estudiosAlcanzadosLimInf: programa.data.keyValueEstudioAlcanzadoLimiteInferior || "",
                    estudiosAlcanzadosLimSup: programa.data.keyValueEstudioAlcanzadoLimiteSuperior || "",
                    esVirtual: programa.data.esVirtual ? "1" : "0",
                    inscripcionesPorUsuario: programa.data.cantidadDeInscripcionesPorUsuario || "",
                }}
                validationSchema={validationForm}
                onSubmit={this.handleSubmit}
                render={formProps => {

                    return (
                        <Form>
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={12} sm={12}>
                                    <Field
                                        name={"nombre"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "nombre",
                                                label: "Nombre Programa",
                                                placeholder: "Inserte Nombre Programa",
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={12} sm={12}>
                                    <Field
                                        name={"descripcion"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "descripcion",
                                                label: "Descripción del Programa",
                                                placeholder: "Inserte Descripción del Programa",
                                                multiline: true,
                                                maxLength: 500
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"menos24"}
                                        render={({ field }) => (
                                            getSelect(field, formProps, classes, {
                                                name: "menos24",
                                                label: "Menos 24",
                                                placeholder: "Seleccione",
                                                itemsSelect: [
                                                    {
                                                        value: "0",
                                                        label: "No"
                                                    },
                                                    {
                                                        value: "1",
                                                        label: "Si"
                                                    }
                                                ]
                                            })
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"soloParaDesocupados"}
                                        render={({ field }) => (
                                            getSelect(field, formProps, classes, {
                                                name: "soloParaDesocupados",
                                                label: "Solo para desocupados",
                                                placeholder: "Seleccione",
                                                itemsSelect: [
                                                    {
                                                        value: "0",
                                                        label: "No"
                                                    },
                                                    {
                                                        value: "1",
                                                        label: "Si"
                                                    }
                                                ]
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"fechaInicioInscripcion"}
                                        render={({ field }) => (
                                            getDatePicker(field, formProps, classes, {
                                                name: "fechaInicioInscripcion",
                                                label: "Fecha Inicio Inscripcion",
                                                placeholder: "Inserte Fecha Inicio Inscripcion",
                                            })
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"fechaFinInscripcion"}
                                        render={({ field }) => (
                                            getDatePicker(field, formProps, classes, {
                                                name: "fechaFinInscripcion",
                                                label: "Fecha Fin Inscripcion",
                                                placeholder: "Inserte Fecha Fin Inscripcion",
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"estudiosAlcanzadosLimInf"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "estudiosAlcanzadosLimInf",
                                                label: "Estudios alcanzados",
                                                placeholder: "Inserte límite inferior",
                                            })
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"estudiosAlcanzadosLimSup"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "estudiosAlcanzadosLimSup",
                                                label: " ",
                                                placeholder: "Inserte límite superior",
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"esVirtual"}
                                        render={({ field }) => (
                                            getSelect(field, formProps, classes, {
                                                name: "esVirtual",
                                                label: "Es virtual",
                                                placeholder: "Seleccione",
                                                itemsSelect: [
                                                    {
                                                        value: "0",
                                                        label: "No"
                                                    },
                                                    {
                                                        value: "1",
                                                        label: "Si"
                                                    }
                                                ]
                                            })
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"inscripcionesPorUsuario"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "inscripcionesPorUsuario",
                                                label: "Inscripciones por usuario",
                                                placeholder: "Inserte cantidad",
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Button color="primary" variant="outlined" type="submit">Modificar</Button>
                            </Grid>
                        </Form >
                    );
                }}
            />);
    }
}

const styles = theme => ({
    errorText: {
        marginTop: '2px'
    },
    wideWidth: {
        width: '100%'
    },
    textArea: {
        minHeight: '100px',
        overflowY: 'scroll',
    },
});

export default withStyles(styles)(FormPrograma);