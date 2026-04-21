import JSZip from 'jszip';

export async function generatePermitZip(
  documents: Array<{ filename: string; html: string }>
): Promise<Blob> {
  const zip = new JSZip();
  for (const doc of documents) {
    zip.file(doc.filename + '.html', doc.html);
  }
  return zip.generateAsync({ type: 'blob' });
}
