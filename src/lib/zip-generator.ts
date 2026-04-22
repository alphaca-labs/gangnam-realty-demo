import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/* ─── Convert a single HTML string into a PDF Blob ─── */

async function htmlToPdf(html: string): Promise<Uint8Array> {
  // Parse the HTML to extract styles and body content
  const parser = new DOMParser();
  const parsed = parser.parseFromString(html, 'text/html');

  // Create a hidden iframe for isolated rendering
  // (iframe prevents style leakage both ways)
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '794px'; // A4 width at 96dpi
  iframe.style.height = '1123px'; // A4 height at 96dpi
  iframe.style.border = 'none';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  try {
    // Write the full HTML document into the iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error('Could not access iframe document');

    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Wait for rendering to settle
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Get the body element from the iframe for html2canvas
    const targetElement = iframeDoc.body;

    // Capture using html2canvas
    const canvas = await html2canvas(targetElement, {
      scale: 2, // 2x for crisp PDF
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
    });

    // A4 dimensions in mm
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate image dimensions
    const imgWidth = A4_WIDTH_MM;
    const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;

    // If content fits in one page
    if (imgHeight <= A4_HEIGHT_MM) {
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        0,
        0,
        imgWidth,
        imgHeight,
      );
    } else {
      // Multi-page: slice the canvas into page-sized chunks
      const pageCanvasHeight = (canvas.width * A4_HEIGHT_MM) / A4_WIDTH_MM;
      const totalPages = Math.ceil(canvas.height / pageCanvasHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();

        const srcY = i * pageCanvasHeight;
        const srcH = Math.min(pageCanvasHeight, canvas.height - srcY);

        // Create a slice canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = srcH;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0, srcY, canvas.width, srcH,
            0, 0, canvas.width, srcH,
          );
        }

        const sliceHeight = (srcH * A4_WIDTH_MM) / canvas.width;
        pdf.addImage(
          pageCanvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          0,
          0,
          imgWidth,
          sliceHeight,
        );
      }
    }

    // Return as Uint8Array for JSZip
    const arrayBuffer = pdf.output('arraybuffer');
    return new Uint8Array(arrayBuffer);
  } finally {
    // Clean up the iframe
    document.body.removeChild(iframe);
  }
}

/* ─── Generate a ZIP with PDF files ─── */

export async function generatePermitZip(
  documents: Array<{ filename: string; html: string }>
): Promise<Blob> {
  const zip = new JSZip();

  // Convert each HTML document to PDF sequentially
  // (parallel would overwhelm the browser with too many iframes/canvases)
  for (const doc of documents) {
    const pdfBytes = await htmlToPdf(doc.html);
    zip.file(doc.filename + '.pdf', pdfBytes);
  }

  return zip.generateAsync({ type: 'blob' });
}
