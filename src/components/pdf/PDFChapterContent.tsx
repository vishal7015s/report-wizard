import { ChapterSection, ReportData } from '@/types/report';

interface PDFChapterContentProps {
  sections: ChapterSection[];
  data: ReportData;
  pageNumber: string;
}

const PDFChapterContent = ({ sections, data, pageNumber }: PDFChapterContentProps) => {
  const { projectDetails } = data;

  // Detect if this is an image-only page (no text content, only images)
  const isImageOnlyPage = sections.every(s => !s.content?.trim() && s.images && s.images.length > 0);

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
          border: '3px solid #000',
          pointerEvents: 'none'
        }}
      />

      {/* Header - above border */}
      <div
        className="absolute"
        style={{
          top: '8mm',
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
      {isImageOnlyPage ? (
        /* Image-only page: distribute images evenly across Y axis */
        <div style={{
          position: 'absolute',
          top: '18mm',
          bottom: '18mm',
          left: '18mm',
          right: '18mm',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
          {/* Section heading for image pages */}
          {sections[0]?.heading && (
            <h2 style={{
              color: '#000000',
              fontSize: '20px',
              fontWeight: 'bold',
              letterSpacing: '0.8px',
              textAlign: 'left',
              width: '100%',
              flexShrink: 0,
            }}>
              {sections[0].heading}
            </h2>
          )}
          {sections.flatMap(s => s.images || []).map((image, imgIndex) => (
            <div key={image.id} style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{
                display: 'block',
                margin: '0 auto',
                width: 'fit-content',
                maxWidth: '85%',
                border: '1px solid #d0d0d0',
                padding: '12px',
                backgroundColor: '#fafafa',
              }}>
                <img
                  src={image.url}
                  alt={image.caption || `Figure ${imgIndex + 1}`}
                  style={{
                    maxWidth: '140mm',
                    maxHeight: '100mm',
                    display: 'block',
                    margin: '0 auto',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <p style={{
                fontSize: '12px',
                marginTop: '3mm',
                color: '#000000',
                fontWeight: 'bold',
              }}>
                Figure {sections[0]?.number || '1'}.{imgIndex + 1}: {image.caption || 'Diagram'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        /* Text content page — positioned absolutely inside the border box */
        <div style={{
          position: 'absolute',
          top: '18mm',
          left: '18mm',
          right: '18mm',
          bottom: '18mm',
          paddingTop: '7mm',
          paddingLeft: '5mm',
          paddingRight: '5mm',
          boxSizing: 'border-box',
          fontSize: '14px',
          fontFamily: 'Times New Roman, serif',
          overflow: 'hidden',
        }}>
          {sections.map((section) => (
            <div key={section.id} style={{ marginBottom: '6mm' }}>
              {/* Section Heading - only show if not empty (continuation pages have empty heading) */}
              {section.heading && section.heading.trim() !== '' && (
                <h2
                  style={{
                    color: '#000000',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginTop: '0',
                    marginBottom: '4mm',
                    letterSpacing: '0.8px'
                  }}
                >
                  {section.heading}
                </h2>
              )}

              {/* Section Content */}
              {section.content && (
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.8',
                    color: '#000000',
                    textAlign: 'justify'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatContent(section.content)
                  }}
                />
              )}

              {/* Section Images (placed on same page if pagination allows) */}
              {section.images && section.images.length > 0 && (
                <div style={{ marginTop: section.content ? '4mm' : '0' }}>
                  {section.images.map((image, imgIndex) => (
                    <div key={image.id} style={{ textAlign: 'center', marginBottom: '5mm' }}>
                      <div style={{
                        display: 'block',
                        margin: '0 auto',
                        width: 'fit-content',
                        maxWidth: '85%',
                        border: '1px solid #d0d0d0',
                        padding: '10px',
                        backgroundColor: '#fafafa',
                      }}>
                        <img
                          src={image.url}
                          alt={image.caption || `Figure ${section.number || '1'}.${imgIndex + 1}`}
                          style={{
                            maxWidth: '140mm',
                            maxHeight: section.content ? '70mm' : '100mm',
                            display: 'block',
                            margin: '0 auto',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                      <p style={{
                        fontSize: '12px',
                        marginTop: '3mm',
                        color: '#000000',
                        fontWeight: 'bold',
                      }}>
                        Figure {section.number || '1'}.{imgIndex + 1}: {image.caption || 'Diagram'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer - below border */}
      <div
        className="absolute flex justify-between items-center"
        style={{
          bottom: '8mm',
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
  let processed = text.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600; color: #000000;">$1</strong>');
  processed = processed.replace(/__(.+?)__/g, '<strong style="font-weight: 600; color: #000000;">$1</strong>');

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
    if (inBullets) { formattedHtml += '</div>'; inBullets = false; }
    if (inNumbers) { formattedHtml += '</div>'; inNumbers = false; }
  };

  const openBullets = () => {
    if (!inBullets) { formattedHtml += '<div style="margin: 10px 0;">'; inBullets = true; }
  };

  const openNumbers = () => {
    if (!inNumbers) { formattedHtml += '<div style="margin: 10px 0;">'; inNumbers = true; }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.replace(/\r/g, '');
    const trimmed = line.trim();

    const bulletMatch = trimmed.match(/^[•\-\*]\s*(.+)$/);
    const subBulletMatch = line.match(/^\s{2,}(?:[○\-\*•])\s*(.+)$/);
    const numberedMatch = trimmed.match(/^\(?\[?(\d+)\]?\)?[.):]\s*(.+)$/) || trimmed.match(/^(\d+)\.\s*(.+)$/);

    if (subBulletMatch || bulletMatch) {
      if (inNumbers) { formattedHtml += '</div>'; inNumbers = false; }
      openBullets();
      const isSub = Boolean(subBulletMatch);
      const rawText = (subBulletMatch ? subBulletMatch[1] : bulletMatch![1]) || '';
      const text = highlightKeyTerms(rawText);
      const bulletChar = isSub ? '○' : '•';
      const indent = isSub ? '12.5mm' : '6mm';
      formattedHtml += `
        <div style="display:flex; align-items:flex-start; margin-left:${indent}; margin-bottom: 2mm;">
          <span style="width: 6mm; text-align:left; line-height: 1.8; font-size: 14px; letter-spacing: 0.8px;">${bulletChar}</span>
          <span style="flex:1; text-align:justify; line-height: 1.8; font-size: 14px; letter-spacing: 0.8px;">${text}</span>
        </div>`;
      return;
    }

    if (numberedMatch) {
      if (inBullets) { formattedHtml += '</div>'; inBullets = false; }
      openNumbers();
      const num = numberedMatch[1];
      const rawText = numberedMatch[2] || '';
      const text = highlightKeyTerms(rawText);
      formattedHtml += `
        <div style="display:flex; align-items:flex-start; margin-left: 6mm; margin-bottom: 2mm;">
          <span style="width: 8mm; text-align:right; padding-right: 2mm; line-height: 1.8; font-size: 14px; letter-spacing: 0.8px;">${num}.</span>
          <span style="flex:1; text-align:justify; line-height: 1.8; font-size: 14px; letter-spacing: 0.8px;">${text}</span>
        </div>`;
      return;
    }

    closeLists();
    if (trimmed) {
      const highlightedText = highlightKeyTerms(trimmed);
      formattedHtml += `<p style="margin-bottom: 4mm; text-align: justify; line-height: 1.8; font-size: 14px; letter-spacing: 0.8px;">${highlightedText}</p>`;
    }
  });

  closeLists();
  return formattedHtml || content;
};

export default PDFChapterContent;
