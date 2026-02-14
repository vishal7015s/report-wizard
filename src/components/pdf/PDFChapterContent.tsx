import { ChapterSection, ReportData } from '@/types/report';

interface PDFChapterContentProps {
  sections: ChapterSection[];
  data: ReportData;
  pageNumber: string;
}

const PDFChapterContent = ({ sections, data, pageNumber }: PDFChapterContentProps) => {
  const { projectDetails } = data;
  
  return (
    <div className="pdf-page" style={{ width: '210mm', height: '297mm', maxHeight: '297mm', position: 'relative', backgroundColor: '#ffffff', fontFamily: 'Times New Roman, serif', overflow: 'hidden' }}>
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
      
      {/* Content Area - Fixed font size 14px throughout */}
      <div style={{ paddingTop: '20mm', paddingLeft: '20mm', paddingRight: '20mm', paddingBottom: '28mm', fontSize: '14px', fontFamily: 'Times New Roman, serif', maxHeight: 'calc(297mm - 48mm)', overflow: 'hidden' }}>
        {sections.map((section) => (
          <div key={section.id} style={{ marginBottom: '6mm' }}>
            {/* Section Heading */}
            <h2 
              style={{ 
                color: '#1e90ff', 
                fontSize: '14px', 
                fontWeight: 'bold',
                marginBottom: '4mm'
              }}
            >
              {section.number} {section.heading}
            </h2>
            
            {/* Section Content - consistent 14px font */}
            <div 
              style={{ 
                fontSize: '14px', 
                lineHeight: '1.8', 
                color: '#000000',
                textAlign: 'justify'
              }}
              dangerouslySetInnerHTML={{ 
                __html: formatContent(section.content || 'Content not provided.') 
              }}
            />
            
            {/* Section Images */}
            {section.images && section.images.length > 0 && (
              <div style={{ marginTop: '6mm' }}>
                {section.images.map((image, imgIndex) => (
                  <div key={image.id} style={{ textAlign: 'center', marginBottom: '4mm' }}>
                    <img 
                      src={image.url} 
                      alt={image.caption || `Figure ${section.number}.${imgIndex + 1}`}
                      style={{ maxWidth: '80%', maxHeight: '150px', objectFit: 'contain', margin: '0 auto' }}
                    />
                    <p style={{ fontSize: '12px', marginTop: '2mm', color: '#000000' }}>
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

// Helper function to highlight important terms
const highlightKeyTerms = (text: string): string => {
  // Bold text wrapped in **text** or __text__
  let processed = text.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600; color: #1e3a5f;">$1</strong>');
  processed = processed.replace(/__(.+?)__/g, '<strong style="font-weight: 600; color: #1e3a5f;">$1</strong>');
  
  // Highlight common technical terms and keywords
  const keyTerms = [
    'objective', 'objectives', 'scope', 'methodology', 'conclusion', 'result', 'results',
    'analysis', 'design', 'implementation', 'testing', 'requirement', 'requirements',
    'system', 'module', 'database', 'interface', 'algorithm', 'architecture',
    'frontend', 'backend', 'API', 'user', 'admin', 'security', 'performance',
    'feature', 'features', 'function', 'functions', 'process', 'workflow'
  ];
  
  keyTerms.forEach(term => {
    const regex = new RegExp(`\\b(${term}s?)\\b`, 'gi');
    processed = processed.replace(regex, '<strong style="font-weight: 600;">$1</strong>');
  });
  
  return processed;
};

// Helper function to format content with bullet points and highlights
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
      const rawText = (subBulletMatch ? subBulletMatch[1] : bulletMatch![1]) || '';
      const text = highlightKeyTerms(rawText);
      const bulletChar = isSub ? '○' : '•';
      const indent = isSub ? '12.5mm' : '6mm';

      formattedHtml += `
        <div style="display:flex; align-items:flex-start; margin-left:${indent}; margin-bottom: 2mm;">
          <span style="width: 6mm; text-align:left; line-height: 1.6; font-size: 14px;">${bulletChar}</span>
          <span style="flex:1; text-align:justify; line-height: 1.6; font-size: 14px;">${text}</span>
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
      const rawText = numberedMatch[2] || '';
      const text = highlightKeyTerms(rawText);

      formattedHtml += `
        <div style="display:flex; align-items:flex-start; margin-left: 6mm; margin-bottom: 2mm;">
          <span style="width: 8mm; text-align:right; padding-right: 2mm; line-height: 1.6; font-size: 14px;">${num}.</span>
          <span style="flex:1; text-align:justify; line-height: 1.6; font-size: 14px;">${text}</span>
        </div>
      `;
      return;
    }

    // Normal paragraph - no indentation, flush left
    closeLists();
    if (trimmed) {
      const highlightedText = highlightKeyTerms(trimmed);
      formattedHtml += `<p style="margin-bottom: 4mm; text-align: justify; line-height: 1.8; font-size: 14px;">${highlightedText}</p>`;
    }
  });

  // Close any open list containers
  closeLists();

  return formattedHtml || content;
};

export default PDFChapterContent;
