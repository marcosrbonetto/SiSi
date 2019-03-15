import React, { Children } from "react";
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

import IndicadorCargando from "@UI/_Componentes/IndicadorCargando"
import Button from "@material-ui/core/Button";

const styleReporte = '<style>\
body{\
  width:210mm;\
  margin: 0px auto;\
  font-size:16px;\
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;\
 }\
.tituloPrograma {\
  border-bottom: 2px solid #000;\
  margin-bottom: 4px;\
  font-size: 1.6em;\
}\
.tituloCurso {\
  font-size: 1.4em;\
  margin: 5px 0px;\
}\
.containerReporte {\
  width: 210mm;\
}\
.tablasReporte {\
  width: 100%;\
  text-align: center;\
  color: #000;\
  font-size: 0.8em;\
  border-spacing: 0;\
  border-collapse: collapse;\
}\
.tablasReporte th {\
  border-top: 1px solid #000;\
  border-bottom: 1px solid #000;\
}\
.imgMuni {\
  float: right;\
}\
</style>';

class ReportePDF extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false
    }
  }

  handlePdf = (elem) => {
    var mywindow = window.open('', '_blank');

    mywindow.document.write('<html><head><title>Reporte</title>');
    mywindow.document.write(styleReporte);
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementById(this.props.containerId || 'page').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  }

  // handlePdf = () => {
  //   const container = document.getElementById(this.props.containerId || 'page');
  //   const pdf = new jsPDF('p', 'px', 'a4');
  //   var iWidth = pdf.internal.pageSize.width;
  //   var iHeight = pdf.internal.pageSize.height;

  //   container.style.width = '210mm';
  //   this.setState({
  //     cargando: true
  //   }, () => {
  //     html2canvas(container, {
  //       scale: 3,
  //       width: iWidth * 1.95,
  //       height: iHeight * 1.95,
  //     })
  //       .then((canvas) => {
  //         const imgData = canvas.toDataURL('image/png');

  //         var imgWidth = iWidth;
  //         var pageHeight = iHeight;
  //         var position = 0;
  //         var imgHeight = canvas.height * imgWidth / canvas.width;
  //         var heightLeft = imgHeight;

  //         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;

  //         while (heightLeft >= 0) {
  //           position = heightLeft - imgHeight;
  //           pdf.addPage();
  //           pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //           heightLeft -= pageHeight;
  //           debugger;
  //         }
  //         //pdf.addImage(imgData, 'PNG', 20, 20, iWidth, iHeight);


  //         container.style.width = 'initial';
  //         pdf.save(this.props.fileName && this.props.fileName + ".pdf" || "Descarga.pdf");

  //         this.setState({
  //           cargando: false
  //         });

  //       });
  //   });

  // };

  render() {

    const { cargando } = this.state;
    const { buttonText } = this.props;

    return (<section {...this.props}>
      <IndicadorCargando visible={cargando} texto={'Generando PDF...'} />
      <Button
        variant="outlined"
        color="primary"
        style={style.button}
        onClick={this.handlePdf}
      >
        {buttonText || 'Descargar'}
      </Button>
      <section id="page" style={style.containerReporte}>
        {this.props.children}
      </section>
    </section>
    );
  }
}

const style = {
  containerReporte: {
    padding: '20px'
  },
  button: {
    position: 'absolute',
    right: '60px',
    top: '20px',
  }
}

export default ReportePDF;