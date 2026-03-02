import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (
  pagesContainer: HTMLElement,
  filename: string = 'project-report.pdf'
): Promise<void> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pages = pagesContainer.querySelectorAll('.pdf-page');
  const pagesArray = Array.from(pages);
  
  // 1. Create a full-screen white overlay with a loading HTML to hide the flashing PDF pages
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = '#ffffff';
  overlay.style.zIndex = '999999';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.innerHTML = `
    <div style="text-align: center; font-family: system-ui, sans-serif;">
      <h2 style="color: #000; margin-bottom: 8px; font-size: 24px; font-weight: bold;">Generating High Quality PDF...</h2>
      <p style="color: #666;">Please wait, do not close this window.</p>
    </div>
  `;
  document.body.appendChild(overlay);

  // 2. Temporarily bring the hidden container into the visible viewport
  // Chromium browsers will ONLY render and decode images if they are physically 
  // located within or near the visible screen bounds.
  // We place it right under the white overlay (z-index: 999998)
  const originalCSS = {
    position: pagesContainer.style.position,
    left: pagesContainer.style.left,
    top: pagesContainer.style.top,
    zIndex: pagesContainer.style.zIndex,
    transform: pagesContainer.style.transform,
  };

  pagesContainer.style.position = 'absolute';
  pagesContainer.style.left = '0';
  pagesContainer.style.top = '0';
  pagesContainer.style.zIndex = '999998';
  pagesContainer.style.transform = 'none'; // Ensure no scaling affects the capture

  const replacements: { oldImg: HTMLImageElement, canvasElem: HTMLCanvasElement, originalDisplay: string }[] = [];

  try {
    // 3. Force load all images and swap them with <canvas> elements to bypass html2canvas image fetching bugs
    const images = Array.from(pagesContainer.getElementsByTagName('img'));

    await Promise.all(images.map((img) => {
      // Allow cross origin for images just in case
      if (!img.src.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      return new Promise<void>((resolve) => {
        const replaceWithCanvas = () => {
          try {
            const canvasElem = document.createElement('canvas');
            // Use the actual rendered dimensions in the DOM or fallback to natural
            const rect = img.getBoundingClientRect();
            canvasElem.width = rect.width || img.naturalWidth || 800;
            canvasElem.height = rect.height || img.naturalHeight || 600;
            
            // Copy styling to exactly match the img
            canvasElem.style.cssText = img.style.cssText;
            canvasElem.className = img.className;
            
            const ctx = canvasElem.getContext('2d');
            if (ctx) {
              // Draw the image onto the canvas perfectly
              ctx.drawImage(img, 0, 0, canvasElem.width, canvasElem.height);
              
              const originalDisplay = img.style.display;
              img.parentNode?.insertBefore(canvasElem, img);
              img.style.display = 'none'; // hide the original image
              
              replacements.push({ oldImg: img, canvasElem, originalDisplay });
            }
          } catch(e) {
            console.warn('Failed to inline canvas replacement:', e);
          }
          resolve();
        };

        if (img.complete && img.naturalHeight !== 0) {
          replaceWithCanvas();
        } else {
          img.onload = replaceWithCanvas;
          img.onerror = () => resolve(); // Continue even if one fails
        }
      });
    }));

    // Wait extra time for the browser rendering pipeline to paint all decoded images onto the screen
    await new Promise(resolve => setTimeout(resolve, 800));

    // 4. Capture each page
    for (let i = 0; i < pagesArray.length; i++) {
      const page = pagesArray[i] as HTMLElement;
      
      // We scroll to the page so it's vertically in the viewport, guaranteeing rendering
      page.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 150)); // Wait for scroll + paint

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
      
      // A4 dimensions
      const pdfWidth = 210;
      const pdfHeight = 297;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    // 5. Save PDF
    pdf.save(filename);
  } finally {
    // 6. Restore original container state
    Object.assign(pagesContainer.style, originalCSS);
    window.scrollTo({ top: 0, behavior: 'instant' }); // Reset scroll

    // Restore all images
    replacements.forEach(({ oldImg, canvasElem, originalDisplay }) => {
      try {
        oldImg.style.display = originalDisplay;
        if (canvasElem.parentNode) {
          canvasElem.parentNode.removeChild(canvasElem);
        }
      } catch (e) {
        console.warn('Failed to restore image', e);
      }
    });

    // 7. Remove overlay
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }
};
