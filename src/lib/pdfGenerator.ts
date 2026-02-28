import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (
  pagesContainer: HTMLElement,
  filename: string = 'project-report.pdf'
): Promise<void> => {
  // Temporarily move container on-screen so html2canvas can render images
  const originalStyle = pagesContainer.style.cssText;
  pagesContainer.style.cssText = 'position: fixed; left: 0; top: 0; z-index: -9999; opacity: 0; pointer-events: none; width: 210mm;';
  
  // Wait for images to load
  const images = pagesContainer.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );

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
