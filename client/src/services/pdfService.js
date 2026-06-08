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

    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Convert base64 data URL to ArrayBuffer so pdf-lib can embed it correctly
    const signatureBytes = await fetch(signatureImage).then((res) => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(signatureBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width } = firstPage.getSize();

    // Get the natural aspect ratio of the signature image
    const pngDims = pngImage.scale(1);
    const sigWidth = 180;
    const sigHeight = sigWidth * (pngDims.height / pngDims.width);

    // Place signature at bottom-right of first page (professional placement)
    firstPage.drawImage(pngImage, {
      x: width - sigWidth - 60,
      y: 60,
      width: sigWidth,
      height: sigHeight,
    });

    const modifiedPdf = await pdfDoc.save();

    saveAs(
      new Blob([modifiedPdf], {
        type: "application/pdf",
      }),
      "signed-document.pdf"
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};