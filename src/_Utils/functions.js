//Alert
import Store from "@Redux/Store/index";
import { mostrarAlertaRoja, mostrarAlertaVerde } from "@Redux/Actions/alerta";
import _ from "lodash";

export const mostrarAlerta = (texto) => {
	Store.dispatch(mostrarAlertaRoja({
		mostrarIconoCerrar: true,
		icono: 'error_outline',
		texto: texto
	}));
}

export const mostrarMensaje = (texto) => {
	Store.dispatch(mostrarAlertaVerde({
		mostrarIconoCerrar: true,
		icono: 'check_circle_outline',
		texto: texto
	}));
}

export const getIdTipoTributo = (tributo) => {
	if (typeof tributo !== "string") return false;

	var tipoTributos = Store.getState().MainContent.tipoTributos.byValue;

	const tipoTributoSel = tipoTributos[tributo];

	if (tipoTributoSel)
		return tipoTributoSel;
	else
		window.location.href = window.Config.URL_LOGIN + "?url=/";
}

export const getTextoTipoTributo = (valueTributo) => {
	if (typeof valueTributo !== "string") return false;

	switch (valueTributo) {
		case 'Automotor':
			return 'Automotores';
		case 'Inmueble':
			return 'Inmuebles';
		case 'Comercio':
			return 'Comercio e Industria';
		case 'Cementerio':
			return 'Cementerios';
		case 'FeriaMercado':
			return 'Ferias y Mercados';
		case 'TaxiRemis':
			return 'Taxis y Remises';
		case 'AgentePercepcionRetencion':
			return 'Agente de Percepción y Retención';
		case 'ContribucionMejoras':
			return 'Contribución de Mejoras';
		case 'PlanesDeVivienda':
			return 'Planes De Vivienda';
		case 'InformacionTributo':
			return 'Información Tributo';
		case 'AgendaVencimientos':
			return 'Agenda de Vencimientos';
	}

	return valueTributo;
}

export const getTextoTipoTributoById = (idTributo) => {

	switch (idTributo) {
		case 1:
			return 'Automotores';
		case 2:
			return 'Inmuebles';
		case 3:
			return 'Comercio e Industria';
		case 4:
			return 'Cementerios';
		case 5:
			return 'Ferias y Mercados';
		case 6:
			return 'Taxis y Remises';
		case 7:
			return 'Agente de Percepción y Retención';
		case 8:
			return 'Contribución de Mejoras';
		case 9:
			return 'Planes De Vivienda';
	}

	return false;
}

export const stringToFloat = (str, decimales, opciones) => {
	if (opciones && opciones.permitirVacio && str == "") {
		return str;
	}

	if (str == undefined || str == "")
		return 0;

	//alert(str)
	if (str.toString().indexOf(",") > 0) {
		var n = str.toString().replace(/\./g, "");
		n = n.toString().replace(",", ".");
		if (!(!isNaN(parseFloat(n)) && isFinite(n)))
			return 0;
		else {
			if (!decimales)
				return parseFloat(n);
			else
				return Math.round(parseFloat(n) * Math.pow(10, decimales)) / Math.pow(10, decimales);
		}
	}
	else {

		if (!(!isNaN(parseFloat(str)) && isFinite(str))) {
			return 0;
		}
		else {
			if (!decimales)
				return parseFloat(str);
			else
				return Math.round(parseFloat(str) * Math.pow(10, decimales)) / Math.pow(10, decimales);
		}
	}
};

export const formatNumber = (num) => {
	if (!num || num == 'NaN') return '0,00';
	if (num == 'Infinity') return '&#x221e;';
	num = num.toString().replace(/\$|\,/g, '');
	if (isNaN(num))
		num = "0";
	let sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	let cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10)
		cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
	return (((sign) ? '' : '0,00') + num + ',' + cents);
}

export const agregoCero = (num) => {
	if (num <= 9)
		return "0" + num;
	else
		return num;
};

export const dateToString = (date, format) => {
	const day = agregoCero(date.getDate());
	const month = agregoCero(parseInt(date.getMonth()) + 1);
	const year = date.getFullYear();

	return format.replace('DD', day).replace('MM', month).replace('YYYY', year);
};

export const stringToDate = (stringDate) => {
	const day = parseInt(stringDate.split("/")[0]);
	const month = parseInt(stringDate.split("/")[1]) - 1;
	const strYear = stringDate.split("/")[2];
	const year = strYear.length > 2 ? parseInt(strYear) : (2000 + parseInt(strYear));

	return new Date(year, month, day);
};

export const diffDays = (fromDate, toDate) => {
	let cantDias = Math.round(Math.abs((fromDate.getTime() - toDate.getTime()) / (24 * 60 * 60 * 1000)));
	if(fromDate > toDate)
		cantDias = cantDias * -1;
	return cantDias;
};

export const getAllUrlParams = function (url) {

	// get query string from url (optional) or window
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

	// we'll store the parameters here
	var obj = {};

	// if query string exists
	if (queryString) {

		// stuff after # is not part of query string, so get rid of it
		queryString = queryString.split('#')[0];

		// split our query string into its component parts
		var arr = queryString.split('&');

		for (var i = 0; i < arr.length; i++) {
			// separate the keys and the values
			var a = arr[i].split('=');

			// in case params look like: list[]=thing1&list[]=thing2
			var paramNum = undefined;
			var paramName = a[0].replace(/\[\d*\]/, function (v) {
				paramNum = v.slice(1, -1);
				return '';
			});

			// set parameter value (use 'true' if empty)
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

			// if parameter name already exists
			if (obj[paramName]) {
				// convert value to array (if still string)
				if (typeof obj[paramName] === 'string') {
					obj[paramName] = [obj[paramName]];
				}
				// if no array index number specified...
				if (typeof paramNum === 'undefined') {
					// put the value on the end of the array
					obj[paramName].push(paramValue);
				}
				// if array index number specified...
				else {
					// put the value at that index number
					obj[paramName][paramNum] = paramValue;
				}
			}
			// if param name doesn't exist yet, set it
			else {
				obj[paramName] = paramValue;
			}
		}
	}

	return obj;
}