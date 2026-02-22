import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ensureImagesLoaded = (doc: Document): Promise<void> => {
  const images = doc.querySelectorAll('img');
  const promises = Array.from(images).map((img) => {
    if (img.complete && img.naturalHeight > 0) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => resolve(), 8000);
      img.onload = () => { clearTimeout(timeout); resolve(); };
      img.onerror = () => { clearTimeout(timeout); resolve(); };
    });
  });
  return Promise.all(promises).then(() => {});
};

export const generatePDF = async (
  pagesContainer: HTMLElement,
  filename: string = 'project-report.pdf'
): Promise<void> => {
  // Move container on-screen temporarily so html2canvas can measure it
  const originalStyle = pagesContainer.style.cssText;
  pagesContainer.style.position = 'fixed';
  pagesContainer.style.left = '0';
  pagesContainer.style.top = '0';
  pagesContainer.style.zIndex = '99999';
  pagesContainer.style.opacity = '0.01'; // Nearly invisible but still "visible" for rendering
  pagesContainer.style.pointerEvents = 'none';
  pagesContainer.style.width = '210mm';

  // Wait for layout to settle
  await new Promise((r) => setTimeout(r, 500));

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pages = pagesContainer.querySelectorAll('.pdf-page');
  const pagesArray = Array.from(pages);
  
  for (let i = 0; i < pagesArray.length; i++) {
    const page = pagesArray[i] as HTMLElement;
    
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: page.offsetWidth,
      height: page.offsetHeight,
      logging: false,
      onclone: async (clonedDoc: Document) => {
        // Copy all image sources to cloned document explicitly
        const originalImages = page.querySelectorAll('img');
        const clonedImages = clonedDoc.querySelectorAll('img');
        
        clonedImages.forEach((clonedImg, idx) => {
          const originalImg = originalImages[idx];
          if (originalImg) {
            // For data URLs and blob URLs, draw to canvas and use that
            if (originalImg.src.startsWith('data:') || originalImg.src.startsWith('blob:')) {
              try {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = originalImg.naturalWidth || originalImg.width || 400;
                tempCanvas.height = originalImg.naturalHeight || originalImg.height || 300;
                const ctx = tempCanvas.getContext('2d');
                if (ctx && originalImg.naturalWidth > 0) {
                  ctx.drawImage(originalImg, 0, 0);
                  clonedImg.src = tempCanvas.toDataURL('image/png');
                }
              } catch (e) {
                // Fallback: keep original src
                clonedImg.src = originalImg.src;
              }
            } else {
              clonedImg.src = originalImg.src;
              clonedImg.crossOrigin = 'anonymous';
            }
          }
        });
        
        // Wait for cloned images to load
        await ensureImagesLoaded(clonedDoc);
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    const pdfWidth = 210;
    const pdfHeight = 297;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  // Restore original position
  pagesContainer.style.cssText = originalStyle;

  pdf.save(filename);
};
