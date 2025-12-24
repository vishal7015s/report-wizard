import { ChapterSection, ReportData } from '@/types/report';

interface PDFChapterContentProps {
  sections: ChapterSection[];
  data: ReportData;
  pageNumber: string;
}

const PDFChapterContent = ({ sections, data, pageNumber }: PDFChapterContentProps) => {
  const { projectDetails } = data;
  
  return (
    <div className="pdf-page" style={{ width: '210mm', minHeight: '297mm', position: 'relative', backgroundColor: '#ffffff', fontFamily: 'Times New Roman, serif' }}>
      {/* Border */}
      <div 
        style={{
          position: 'absolute',
          top: '15mm',
          left: '15mm',
          right: '15mm',
          bottom: '15mm',
          border: '2px solid #1e3a5f',
          pointerEvents: 'none'
        }}
      />
      
      {/* Header - above border */}
      <div
        className="absolute"
        style={{
          top: '6mm',
          left: '15mm',
          right: '15mm',
          fontSize: '12px',
          color: '#000000',
          fontWeight: 'normal',
          textAlign: 'left',
        }}
      >
        {projectDetails.projectTitle || 'Project Title'}
      </div>
      
      {/* Content Area */}
      <div className="pt-16 px-12 pb-20">
        {sections.map((section) => (
          <div key={section.id} className="mb-8">
            {/* Section Heading */}
            <h2 
              className="font-bold text-base mb-4"
              style={{ color: '#1e90ff' }}
            >
              {section.number} {section.heading}
            </h2>
            
            {/* Section Content */}
            <div 
              className="text-justify leading-relaxed"
              style={{ fontSize: '14px', lineHeight: '1.8', color: '#000000' }}
              dangerouslySetInnerHTML={{ 
                __html: formatContent(section.content || 'Content not provided.') 
              }}
            />
            
            {/* Section Images */}
            {section.images && section.images.length > 0 && (
              <div className="mt-6 space-y-4">
                {section.images.map((image, imgIndex) => (
                  <div key={image.id} className="text-center">
                    <img 
                      src={image.url} 
                      alt={image.caption || `Figure ${section.number}.${imgIndex + 1}`}
                      className="max-w-full mx-auto"
                      style={{ maxHeight: '200px', objectFit: 'contain' }}
                    />
                    <p className="text-sm mt-2" style={{ color: '#000000' }}>
                      Figure {section.number}.{imgIndex + 1}: {image.caption || 'Diagram'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer - below border */}
      <div
        className="absolute flex justify-between items-center"
        style={{
          bottom: '6mm',
          left: '15mm',
          right: '15mm',
          fontSize: '11px',
        }}
      >
        <span style={{ color: '#000000' }}>
          Department of {projectDetails.department} & Engineering, SVCE, Indore
        </span>
        <span style={{ color: '#000000' }}>{pageNumber}</span>
      </div>
    </div>
  );
};

// Helper function to format content with bullet points
const formatContent = (content: string): string => {
  const lines = content.split('\n');

  let formattedHtml = '';
  let inBullets = false;
  let inNumbers = false;

  const closeLists = () => {
    if (inBullets) {
      formattedHtml += '</div>';
      inBullets = false;
    }
    if (inNumbers) {
      formattedHtml += '</div>';
      inNumbers = false;
    }
  };

  const openBullets = () => {
    if (!inBullets) {
      formattedHtml += '<div style="margin: 10px 0;">';
      inBullets = true;
    }
  };

  const openNumbers = () => {
    if (!inNumbers) {
      formattedHtml += '<div style="margin: 10px 0;">';
      inNumbers = true;
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.replace(/\r/g, '');
    const trimmed = line.trim();

    // Bullets: supports "•", "○", "-", "*" with or without space after marker
    const bulletMatch = trimmed.match(/^[•\-\*]\s*(.+)$/);
    const subBulletMatch = line.match(/^\s{2,}(?:[○\-\*•])\s*(.+)$/);

    // Numbered: supports "1.", "1)" "1:" "(1)" "[1]"
    const numberedMatch = trimmed.match(/^\(?\[?(\d+)\]?\)?[.):]\s*(.+)$/) || trimmed.match(/^(\d+)\.\s*(.+)$/);

    if (subBulletMatch || bulletMatch) {
      if (inNumbers) {
        formattedHtml += '</div>';
        inNumbers = false;
      }

      openBullets();

      const isSub = Boolean(subBulletMatch);
      const text = (subBulletMatch ? subBulletMatch[1] : bulletMatch![1]) || '';
      const bulletChar = isSub ? '○' : '•';
      const indent = isSub ? '8mm' : '0mm';

      // Flex layout ensures bullet column and text column align like Word
      formattedHtml += `
        <div style="display:flex; align-items:flex-start; margin-left:${indent}; margin-bottom: 10px;">
          <span style="width: 8mm; text-align:center; line-height: 1; font-size: 16px;">${bulletChar}</span>
          <span style="flex:1; text-align:left;">${text}</span>
        </div>
      `;
      return;
    }

    if (numberedMatch) {
      if (inBullets) {
        formattedHtml += '</div>';
        inBullets = false;
      }

      openNumbers();

      const num = numberedMatch[1];
      const text = numberedMatch[2] || '';

      formattedHtml += `
        <div style="display:flex; align-items:flex-start; margin-bottom: 10px;">
          <span style="width: 8mm; text-align:right; padding-right: 2mm;">${num}.</span>
          <span style="flex:1; text-align:left;">${text}</span>
        </div>
      `;
      return;
    }

    // Normal paragraph
    closeLists();
    if (trimmed) {
      formattedHtml += `<p style="margin-bottom: 12px; text-indent: 0; text-align: justify;">${trimmed}</p>`;
    }
  });

  // Close any open list containers
  closeLists();

  return formattedHtml || content;
};

export default PDFChapterContent;
