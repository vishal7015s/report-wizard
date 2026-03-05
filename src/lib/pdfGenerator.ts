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

  // Set crossOrigin for all images to allow html2canvas to capture them
  images.forEach(img => {
    img.crossOrigin = 'anonymous';
  });

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
      scale: 6,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: page.offsetWidth,
      height: page.offsetHeight,
      logging: false,
      imageTimeout: 15000,
    });

    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = 210;
    const pdfHeight = 297;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  }

  pagesContainer.style.cssText = originalStyle;

  pdf.save(filename);
};
