import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (
  pagesContainer: HTMLElement,
  filename: string = 'project-report.pdf'
): Promise<void> => {
  const originalStyle = pagesContainer.style.cssText;
  pagesContainer.style.cssText = 'position: fixed; left: 0; top: 0; z-index: -9999; opacity: 0; pointer-events: none; width: 210mm; min-height: 100vh; overflow: visible;';
  
  const images = Array.from(pagesContainer.querySelectorAll('img'));
  
  images.forEach(img => {
      if (!img.style.minHeight) img.style.minHeight = '100px';
      if (!img.style.minWidth) img.style.minWidth = '100px';
      img.crossOrigin = 'anonymous'; 
  });

  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight !== 0) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );

  const replacements: { originalImg: HTMLImageElement, canvasReplica: HTMLCanvasElement, originalDisplay: string }[] = [];

  for (const img of images) {
    try {
      if (img.naturalWidth === 0 || img.naturalHeight === 0) continue;

      const canvas = document.createElement('canvas');
      const rect = img.getBoundingClientRect();
      canvas.width = rect.width || img.naturalWidth;
      canvas.height = rect.height || img.naturalHeight;

      canvas.style.cssText = img.style.cssText;
      canvas.className = img.className; 

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const originalDisplay = img.style.display || '';
        img.parentNode?.insertBefore(canvas, img);
        img.style.display = 'none';

        replacements.push({ originalImg: img, canvasReplica: canvas, originalDisplay });
      }
    } catch (err) {
      console.warn('Canvas swap failed:', err);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pages = Array.from(pagesContainer.querySelectorAll('.pdf-page'));
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i] as HTMLElement;
    
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: page.offsetWidth,
      height: page.offsetHeight,
      logging: false
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    const pdfWidth = 210;
    const pdfHeight = 297;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  pagesContainer.style.cssText = originalStyle;

  for (const { originalImg, canvasReplica, originalDisplay } of replacements) {
    if (canvasReplica.parentNode) {
      canvasReplica.parentNode.removeChild(canvasReplica);
    }
    originalImg.style.display = originalDisplay;
  }

  pdf.save(filename);
};
