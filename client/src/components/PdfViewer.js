import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

function PdfViewer({ pdfData }) {
  const [pageNumber] = useState(1);

  // Add Global working source from react-pdf
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  // Document View Options for Viewing PDF
  const options = {
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    standardFontDataUrl: "/standard_fonts/",
  };

  return (
    <div className="Pdf">
      <div className="Pdf__container">
        <div className="Pdf__container__document">
          {pdfData && (
            <Document file={{ data: pdfData }} options={options}>
              {Array.from(new Array(pageNumber), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={pageNumber}
                  renderForms={true}
                  renderTextLayer={false}
                  renderAnnotationLayer={true}
                />
              ))}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
}

export default PdfViewer;
