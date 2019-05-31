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
    descripcion1: Yup.string()
        .required('Campo requerido'),
    lugarDeCursado: Yup.string()
        .max(50, 'No sebe insertar más de 50 caracteres')
        .required('Campo requerido'),
    cupo: Yup.number()
        .typeError('Debe ingresar un número')
        .positive('Debe ingresar un numero positivo')
        .required('Campo requerido'),
    cupoListaDeEspera: Yup.number()
        .typeError('Debe ingresar un número')
        .positive('Debe ingresar un numero positivo')
        .required('Campo requerido'),
    dia: Yup.string()
        .max(50, 'No sebe insertar más de 50 caracteres')
        .required('Campo requerido'),
    horario: Yup.string()
        .max(50, 'No sebe insertar más de 50 caracteres')
        .required('Campo requerido'),
    tag: Yup.string()
        .max(50, 'No sebe insertar más de 50 caracteres')
        .required('Campo requerido'),
});

class FormCurso extends React.Component {

    handleSubmit = (values) => {

        const cursoValues = {
            ...values,
            id: this.props.curso ? this.props.curso.data.id : '',
            necesitaEmpresa: values.necesitaEmpresa == "1" ? true : false,
        };

        this.props.onSubmit && this.props.onSubmit(cursoValues);
    }

    render() {
        const { classes, curso } = this.props;

        let cursoDatos;
        if(curso)
            cursoDatos = curso.data;

        return (
            <Formik
                initialValues={{
                    idPrograma: 9, //CID
                    nombre: cursoDatos ? cursoDatos.nombre : "",
                    necesitaEmpresa: cursoDatos ? (cursoDatos.necesitaEmpresa ? "1" : "0") : "0",
                    cupo: cursoDatos ? cursoDatos.cupo : "",
                    cupoListaDeEspera: cursoDatos ? cursoDatos.cupoListaDeEspera : "",
                    lugarDeCursado: cursoDatos ? cursoDatos.lugar : "",
                    dia: cursoDatos ? cursoDatos.dia : "",
                    horario: cursoDatos ? cursoDatos.horario : "",
                    descripcion1: cursoDatos ? cursoDatos.descripcion1 : "",
                    descripcion2: cursoDatos ? cursoDatos.descripcion2 : "",
                    tag: cursoDatos ? (cursoDatos.tag ? cursoDatos.tag : "") : ""
                }}
                validationSchema={validationForm}
                onSubmit={this.handleSubmit}
                render={formProps => {

                    return (
                        <Form>
                            {!curso && <React.Fragment>
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={12} sm={12}>
                                    <Field
                                        name={"idPrograma"}
                                        render={({ field }) => (
                                            getSelect(field, formProps, classes, {
                                                name: "idPrograma",
                                                label: "Programa",
                                                placeholder: "Seleccione el Programa",
                                                itemsSelect: this.props.arrayProgramas || [{
                                                    value: "9",
                                                    label: "CID"
                                                }]
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <br /></React.Fragment>}
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={12} sm={12}>
                                    <Field
                                        name={"nombre"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "nombre",
                                                label: "Nombre Curso",
                                                placeholder: "Inserte Nombre",
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={12} sm={12}>
                                    <Field
                                        name={"descripcion1"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "descripcion1",
                                                label: "Descripción 1 del curso",
                                                placeholder: "Inserte Descripción",
                                                multiline: true,
                                                maxLength: 500
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={12} sm={12}>
                                    <Field
                                        name={"descripcion2"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "descripcion2",
                                                label: "Descripción 2 del curso",
                                                placeholder: "Inserte Descripción 2",
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
                                        name={"cupo"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "cupo",
                                                label: "Cupo para el curso",
                                                placeholder: "Inserte cupo",
                                            })
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"cupoListaDeEspera"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "cupoListaDeEspera",
                                                label: "Cupo de lista de espera",
                                                placeholder: "Inserte cupo de lista de espera",
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"dia"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "dia",
                                                label: "Día de cursado",
                                                placeholder: "Inserte día de cursado",
                                            })
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"horario"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "horario",
                                                label: "Horario de cursado",
                                                placeholder: "Inserte horario de cursado",
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"necesitaEmpresa"}
                                        render={({ field }) => (
                                            getSelect(field, formProps, classes, {
                                                name: "necesitaEmpresa",
                                                label: "¿Necesita Empresa?",
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
                            <br />
                            <Grid container spacing={16} justifiy="center">
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"lugarDeCursado"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "lugarDeCursado",
                                                label: "Lugar de cursado",
                                                placeholder: "Inserte lugar de cursado",
                                            })
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Field
                                        name={"tag"}
                                        render={({ field }) => (
                                            getInputText(field, formProps, classes, {
                                                name: "tag",
                                                label: "Tag",
                                                placeholder: "Inserte Tag",
                                            })
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Button color="primary" variant="outlined" type="submit">{!curso ? "Agregar" : "Modificar"}</Button>
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

export default withStyles(styles)(FormCurso);