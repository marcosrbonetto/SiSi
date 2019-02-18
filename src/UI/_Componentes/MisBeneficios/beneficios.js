//Funciones Útiles
import { stringToDate } from "@Utils/functions"
import _ from "lodash";


const beneficios = {
    'Automotor': [ //'Automotor'
        {
            key: 1,
            titulo: 'Cuota Anual',
            secciones: ['Contribucion'], //'Contribucion'
            columnaCondicion: 'vencimiento',
            seteoFila: (row) => {
                const year = typeof row.concepto.split('/')[0] == 'string' ? parseInt(row.concepto.split('/')[0]) : 1900;
                const month = typeof row.concepto.split('/')[1] == 'string' ? parseInt(row.concepto.split('/')[1]) : -1;

                if ([1, 2, 3, 4, 5, 6].indexOf(month) != -1 && year == 2019) {
                    row.data = {
                        ...row.data,
                        checked: true,
                        invisible: false,
                        disabled: true,
                    };
                } else {
                    row.data = {
                        ...row.data,
                        checked: false,
                        invisible: true,
                        disabled: false,
                    };
                }
                
                return row;
            },
            cumpleCondicionBeneficio: (idRowsSeleccionados) => {
                const idRowsBeneficio = ['2019/001','2019/002','2019/003','2019/004','2019/005','2019/006'];

                const difference = _.difference(idRowsBeneficio.sort(), idRowsSeleccionados.sort());
                const difference2 = _.difference(idRowsSeleccionados.sort(), idRowsBeneficio.sort());
                const concideConBeneficio = difference.length == 0;
                const concideExactamenteBeneficio = difference2.length == 0;

                return {
                    concideConBeneficio: concideConBeneficio,
                    concideExactamenteBeneficio: concideExactamenteBeneficio,
                };
            },
            tableDisabled: true
        }
    ],
    'Inmueble': [ //'Inmueble'
        {
            key: 1,
            titulo: '1ra ½ Cuota',
            secciones: ['Contribucion'], //'Contribucion'
            columnaCondicion: 'vencimiento',
            seteoFila: (row) => {
                const year = typeof row.concepto.split('/')[0] == 'string' ? parseInt(row.concepto.split('/')[0]) : 1900;
                const month = typeof row.concepto.split('/')[1] == 'string' ? parseInt(row.concepto.split('/')[1]) : -1;

                if ([1, 2, 3, 4, 5, 6].indexOf(month) != -1 && year == 2019) {
                    row.data = {
                        ...row.data,
                        checked: true,
                        invisible: false,
                        disabled: true,
                    };
                } else {
                    row.data = {
                        ...row.data,
                        checked: false,
                        invisible: true,
                        disabled: false,
                    };
                }
                
                return row;
            },
            cumpleCondicionBeneficio: (idRowsSeleccionados) => {
                const idRowsBeneficio = ['2019/001','2019/002','2019/003','2019/004','2019/005','2019/006'];

                const difference = _.difference(idRowsBeneficio.sort(), idRowsSeleccionados.sort());
                const difference2 = _.difference(idRowsSeleccionados.sort(), idRowsBeneficio.sort());
                const concideConBeneficio = difference.length == 0;
                const concideExactamenteBeneficio = difference2.length == 0;

                return {
                    concideConBeneficio: concideConBeneficio,
                    concideExactamenteBeneficio: concideExactamenteBeneficio,
                };
            },
            tableDisabled: true
        },
        {
            key: 2,
            titulo: '2da ½ Cuota',
            secciones: ['Contribucion'], //'Contribucion'
            columnaCondicion: 'vencimiento',
            seteoFila: (row) => {
                const year = typeof row.concepto.split('/')[0] == 'string' ? parseInt(row.concepto.split('/')[0]) : 1900;
                const month = typeof row.concepto.split('/')[1] == 'string' ? parseInt(row.concepto.split('/')[1]) : -1;

                if ([7, 8, 9, 10, 11, 12].indexOf(month) != -1 && year == 2019) {
                    row.data = {
                        ...row.data,
                        checked: true,
                        invisible: false,
                        disabled: true,
                    };
                } else {
                    row.data = {
                        ...row.data,
                        checked: false,
                        invisible: true,
                        disabled: false,
                    };
                }
                
                return row;
            },
            cumpleCondicionBeneficio: (idRowsSeleccionados) => {
                const idRowsBeneficio = ['2019/007','2019/008','2019/009','2019/010','2019/011','2019/012'];

                const difference = _.difference(idRowsBeneficio.sort(), idRowsSeleccionados.sort());
                const difference2 = _.difference(idRowsSeleccionados.sort(), idRowsBeneficio.sort());
                const concideConBeneficio = difference.length == 0;
                const concideExactamenteBeneficio = difference2.length == 0;

                return {
                    concideConBeneficio: concideConBeneficio,
                    concideExactamenteBeneficio: concideExactamenteBeneficio,
                };
            },
            tableDisabled: true
        }
    ],
};

export default beneficios;