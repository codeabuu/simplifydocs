import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const formatPdf = async (content: string) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]); // Set page size

  // Set font and font size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const titleFontSize = 18;
  const margin = 50;
  const lineHeight = 15;
  let y = page.getHeight() - margin;

  // Add a title
  page.drawText('Summary Report', {
    x: margin,
    y,
    size: titleFontSize,
    font,
    color: rgb(0, 0, 0),
  });
  y -= lineHeight * 2;

  // Split content into lines
  const lines = content.split('\n');

  lines.forEach((line) => {
    // Skip empty lines
    if (line.trim() === '') {
      y -= lineHeight; // Add extra space for empty lines
      return;
    }

    // Handle headings (lines starting with #)
    if (line.startsWith('#')) {
      const headingLevel = (line.match(/#/g)?.length || 1); // Count the number of # symbols
      const headingText = line.replace(/#/g, '').trim(); // Remove # symbols
      const headingSize = titleFontSize - (headingLevel - 1) * 2; // Adjust size based on heading level

      page.drawText(headingText, {
        x: margin,
        y,
        size: headingSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight * 1.5; // Add extra space after headings
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Handle bullet points
      page.drawText('•', {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(line.slice(2).trim(), {
        x: margin + 10, // Indent bullet points
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    } else {
      // Handle regular text
      page.drawText(line.trim(), {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    }
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};