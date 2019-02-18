import React from "react";

export const infoBeneficios = (idTipoTributo) => {
    switch (idTipoTributo) {
        case 1:
            return <span>Para el año 2019, si Ud. abona la <b>cuota anual</b> tendrá un <b>descuento del 10%</b> (calculado sobre el anual 2018)</span>;
        case 2:
            return <span>Para el año 2019, si Ud. abona las <b>medias cuotas</b> tendrá un <b>descuento del 10%</b> (calculado sobre el anual 2018)</span>;
        case 3:
            return '';
        case 4:
            return '';
        case 5:
            return '';
        case 6:
            return '';
        case 7:
            return '';
        case 8:
            return '';
        case 9:
            return '';
    }
}