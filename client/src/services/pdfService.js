import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export const downloadSignedPdf = async (
  pdfUrl,
  signatureImage
) => {
  try {
    const pdfBytes = await fetch(pdfUrl).then(
      (res) => res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(
      pdfBytes
    );

    const pngImage =
      await pdfDoc.embedPng(signatureImage);

    const pages = pdfDoc.getPages();

    const firstPage = pages[0];

    firstPage.drawImage(pngImage, {
      x: 50,
      y: 50,
      width: 150,
      height: 80,
    });

    const modifiedPdf =
      await pdfDoc.save();

    saveAs(
      new Blob([modifiedPdf], {
        type: "application/pdf",
      }),
      "signed-document.pdf"
    );
  } catch (error) {
    console.log(error);
  }
};