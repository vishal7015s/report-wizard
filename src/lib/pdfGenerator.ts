import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Convert all images in a container to inline base64 data URLs.
 * This ensures html2canvas can always render them, regardless of
 * whether the original src was a blob:, data:, or regular URL.
 */
const preConvertImages = async (container: HTMLElement): Promise<void> => {
  const images = container.querySelectorAll('img');
  const promises = Array.from(images).map(async (img) => {
    // Wait for the image to load first
    if (!img.complete) {
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), 5000);
        img.onload = () => { clearTimeout(timeout); resolve(); };
        img.onerror = () => { clearTimeout(timeout); resolve(); };
      });
    }

    // Skip images that failed to load
    if (!img.naturalWidth || !img.naturalHeight) return;

    // Already a usable data URL — skip
    if (img.src.startsWith('data:image/')) return;

    // Convert to data URL via canvas
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        img.src = canvas.toDataURL('image/png');
      }
    } catch {
      // Cross-origin or tainted — keep original src
    }
  });
  await Promise.all(promises);
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
  pagesContainer.style.opacity = '0.01';
  pagesContainer.style.pointerEvents = 'none';
  pagesContainer.style.width = '210mm';

  // Wait for layout to settle
  await new Promise((r) => setTimeout(r, 300));

  // Pre-convert ALL images to base64 data URLs so html2canvas can render them
  await preConvertImages(pagesContainer);

  // Extra settle after image conversion
  await new Promise((r) => setTimeout(r, 200));

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
