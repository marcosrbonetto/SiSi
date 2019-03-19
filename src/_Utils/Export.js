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

            const imgWidth = 210;
            const pageHeight = 298;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            const doc = new JsPdf('p', 'mm');
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save(fileName ? fileName +'.pdf' : 'descarga.pdf');
        });
};

// eslint-disable-next-line no-shadow
const Export = ({ children }) => (
    <div>
        <button onClick={() => printPDF()}>Download PDF</button>
        {children}
    </div>
);

export default Export;

Export.propTypes = {
    children: PropTypes.shape
};