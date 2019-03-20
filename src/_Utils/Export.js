import React from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import JsPdf from 'jspdf';

const printPDF = function printPDF(fileName) {
    const page = document.getElementById('overallPage');
    html2canvas(page, {
        scale: 3
    })
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');

            const imgWidth = 190; // 210 - 10 (margen left) - 10 (margen right)
            const pageHeight = 298;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            const doc = new JsPdf('p', 'mm');
            let position = 10;

            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save(fileName ? fileName +'.pdf' : 'descarga.pdf');
        });
};

// eslint-disable-next-line no-shadow
const Export = ({ props, children }) => (
    <div {...props}>
        <button onClick={() => printPDF()}>Download PDF</button>
        <div id="overallPage">{children}</div>
    </div>
);

export default Export;

Export.propTypes = {
    children: PropTypes.shape
};