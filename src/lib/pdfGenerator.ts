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
  // Save original styles and class
  const originalStyle = pagesContainer.style.cssText;
  const originalClassName = pagesContainer.className;

  // Remove Tailwind positioning classes that could conflict
  pagesContainer.className = '';

  // Move container on-screen temporarily so html2canvas can measure it
  pagesContainer.style.cssText = `
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    z-index: 99999;
    opacity: 0.01;
    pointer-events: none;
    width: 210mm;
    overflow: visible;
  `;

  // Wait for layout to settle
  await new Promise((r) => setTimeout(r, 500));

  // Pre-convert ALL images to base64 data URLs so html2canvas can render them
  await preConvertImages(pagesContainer);

  // Extra settle after image conversion
  await new Promise((r) => setTimeout(r, 300));

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pages = pagesContainer.querySelectorAll('.pdf-page');
  const pagesArray = Array.from(pages);

  // Collect all original images for reference in onclone
  const allOriginalImages = pagesContainer.querySelectorAll('img');
  const imageDataMap = new Map<number, string>();
  
  // Build a map of image index -> data URL
  allOriginalImages.forEach((img, idx) => {
    if (img.src && (img.src.startsWith('data:') || img.src.startsWith('blob:'))) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 400;
        canvas.height = img.naturalHeight || img.height || 300;
        const ctx = canvas.getContext('2d');
        if (ctx && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0);
          imageDataMap.set(idx, canvas.toDataURL('image/png'));
        }
      } catch {
        // Keep original
      }
    }
  });

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
      onclone: (_clonedDoc: Document, clonedElement: HTMLElement) => {
        // Fix images in the cloned element
        const clonedImages = clonedElement.querySelectorAll('img');
        const originalImages = page.querySelectorAll('img');
        
        clonedImages.forEach((clonedImg, idx) => {
          const originalImg = originalImages[idx];
          if (originalImg && originalImg.src) {
            // Copy src directly
            clonedImg.src = originalImg.src;
            // Also set as attribute to be safe
            clonedImg.setAttribute('src', originalImg.src);
          }
        });
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

  // Restore original class and styles
  pagesContainer.className = originalClassName;
  pagesContainer.style.cssText = originalStyle;

  pdf.save(filename);
};
