import { PDFDocument } from "pdf-lib";
import React, { useState } from "react";
import GlobalButton from "./components/GlobalButton";
import PdfViewer from "./components/PdfViewer";
import axios from "axios";
import {
  GET_PDF_FILE,
  PREFIX,
  SERVER_URL,
  UPLOAD_PDF_FILE,
} from "./constants/ApiConstants";
import {
  first_name_1,
  first_name_2,
  first_role_1,
  first_role_2,
  last_name_1,
  last_name_2,
  radioValueA,
  radioValueB,
  radio_1,
  radio_2,
} from "./constants/GlobalConstants";

const PdfUploadForm = () => {
  const [pdfData, setPdfData] = useState(null);

  // Load PDF Handler
  const onLoadPdfHandler = async () => {
    try {
      // File Response
      const response = await axios.get(SERVER_URL + PREFIX + GET_PDF_FILE, {
        responseType: "arraybuffer",
      });

      // Convert file response into 8 bit array
      const uint8Array = new Uint8Array(response.data);
      setPdfData(uint8Array);
    } catch (error) {
      alert("Error Fetching PDF...");
    }
  };

  // Save PDF Handler
  const onSavePdfHandler = async () => {
    // Call Custom Script for fetching latest data
    let pdf_data = window.saveData();
    let newPdfData = [...pdf_data];
    let finalObj = [];

    // Add Required data into finalObj Variable
    newPdfData.map((data) =>
      finalObj.push({
        name: data.name,
        value: data.value,
        checked: data.checked,
      })
    );

    // Check condition if there is data or not in finalObject
    if (finalObj.length > 0) {
      // Getting Current Pdf buffer
      const response = await axios.get(SERVER_URL + PREFIX + GET_PDF_FILE, {
        responseType: "arraybuffer",
      });

      const uint8Array = new Uint8Array(response.data);

      // Access pdf-lib document
      const pdfDoc = await PDFDocument.load(uint8Array);

      // Get the form containing all the fields
      const form = pdfDoc.getForm();

      // Get all fields in the PDF by their id
      const fname_Input_1 = form.getTextField(first_name_1);
      const lname_Input_1 = form.getTextField(last_name_1);
      const roles_Input_1 = form.getDropdown(first_role_1);
      const radio_Input_1 = form.getRadioGroup(radio_1);
      const radio_Input_1_1 = form.getRadioGroup(radio_1);
      const fname_Input_2 = form.getTextField(first_name_2);
      const lname_Input_2 = form.getTextField(last_name_2);
      const roles_Input_2 = form.getDropdown(first_role_2);
      const radio_Input_2 = form.getRadioGroup(radio_2);
      const radio_Input_2_2 = form.getRadioGroup(radio_2);

      // Set Latest Values into new PDF
      fname_Input_1.setText(finalObj[0].value);
      lname_Input_1.setText(finalObj[1].value);
      roles_Input_1.select(finalObj[2].value);

      // Checked Condition based on selection
      if (finalObj[3].checked === true) {
        radio_Input_1.select(radioValueA);
      } else {
        radio_Input_1_1.select(radioValueB);
      }

      fname_Input_2.setText(finalObj[5].value);
      lname_Input_2.setText(finalObj[6].value);
      roles_Input_2.select(finalObj[7].value);

      // Checked Condition based on selection
      if (finalObj[8].checked === true) {
        radio_Input_2.select(radioValueA);
      } else {
        radio_Input_2_2.select(radioValueB);
      }

      // Save new pdf and convert into bytes
      const pdfBytes = await pdfDoc.save();

      // Convert Bytes into Blob
      var blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Form Data
      const formData = new FormData();
      formData.append("file", blob);

      try {
        const response = await axios.post(
          SERVER_URL + PREFIX + UPLOAD_PDF_FILE,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response) {
          alert(response.data);
        }
      } catch (error) {
        alert("Error uploading PDF...");
      }
    }
  };

  return (
    <>
      <div style={{ margin: 20 }}>
        <GlobalButton btnTitle="Load PDF" onClickHandler={onLoadPdfHandler} />
        <GlobalButton btnTitle="Save PDF" onClickHandler={onSavePdfHandler} />
      </div>
      <PdfViewer pdfData={pdfData} />
    </>
  );
};

export default PdfUploadForm;
