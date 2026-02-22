import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const waitForImages = async (container: HTMLElement): Promise<void> => {
  const images = container.querySelectorAll('img');
  const promises = Array.from(images).map((img) => {
    // Already loaded
    if (img.complete && img.naturalHeight > 0) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => resolve(), 5000); // 5s timeout per image
      img.onload = () => { clearTimeout(timeout); resolve(); };
      img.onerror = () => { clearTimeout(timeout); resolve(); };
      // Only force reload for external URLs, NOT for data: or blob: URLs
      if (img.src && !img.src.startsWith('data:') && !img.src.startsWith('blob:')) {
        img.crossOrigin = 'anonymous';
        const src = img.src;
        img.src = '';
        img.src = src;
      }
    });
  });
  await Promise.all(promises);
  // Extra wait for rendering
  await new Promise((r) => setTimeout(r, 300));
};

export const generatePDF = async (
  pagesContainer: HTMLElement,
  filename: string = 'project-report.pdf'
): Promise<void> => {
  // Temporarily move the container on-screen for accurate rendering
  const originalStyle = pagesContainer.style.cssText;
  pagesContainer.style.position = 'absolute';
  pagesContainer.style.left = '0';
  pagesContainer.style.top = '0';
  pagesContainer.style.zIndex = '-9999';
  pagesContainer.style.opacity = '0';
  pagesContainer.style.pointerEvents = 'none';

  // Wait for all images in the container to load
  await waitForImages(pagesContainer);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pages = pagesContainer.querySelectorAll('.pdf-page');
  const pagesArray = Array.from(pages);
  
  for (let i = 0; i < pagesArray.length; i++) {
    const page = pagesArray[i] as HTMLElement;
    
    // Wait for images in this specific page
    await waitForImages(page);
    
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: page.offsetWidth,
      height: page.offsetHeight,
      logging: false,
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
