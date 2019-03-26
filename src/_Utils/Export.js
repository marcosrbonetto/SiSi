import React from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import JsPdf from 'jspdf';

const printPDF = function printPDF(fileName, onLoading, onFinish, onError) {
    onLoading && onLoading();

    try {
        const page = document.getElementById('overallPage');
        html2canvas(page, {
            scale: 3,
        })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');

                const imgWidth = 190; // 210 - 10 (margen left) - 10 (margen right)
                const pageHeight = 278; // 298 - 10 (margen top) - 10 (margen bottom)
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;

                const doc = new JsPdf('p', 'mm', 'A4');
                let position = 5;

                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight + 10);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                doc.save(fileName ? fileName + '.pdf' : 'descarga.pdf');
                onFinish && onFinish();
            });
    } catch (error) {
        onError && onError(error);
    }
};

const styleButton = {
    color: '#149257',
    padding: '0px 16px',
    fontSize: '0.875rem',
    minWidth: '64px',
    boxSizing: 'border-box',
    height: '42px',
    marginTop: '6px',
    transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    fontWeight: '500',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.4em',
    borderRadius: '4px',
    textTransform: 'uppercase',
    border: 'none',
    background: '#fff',
    border: '1px solid rgba(20, 146, 87, 0.5)',
    cursor: 'pointer'
}

// eslint-disable-next-line no-shadow
const Export = ({ fileName, props, buttonVover, children, onLoading, onFinish, onError }) => (
    <div {...props}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            {buttonVover}
            <button style={styleButton} onClick={() => printPDF(fileName, onLoading, onFinish, onError)}>Download PDF</button>
        </div>
        <br/>
        <div id="overallPage">{children}</div>
    </div>
);

export default Export;

Export.propTypes = {
    children: PropTypes.shape
};