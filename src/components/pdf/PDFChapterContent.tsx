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
  let inList = false;
  let inNumberedList = false;
  
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // Check for bullet points (•, -, *, ○)
    const bulletMatch = trimmedLine.match(/^[•\-\*○]\s+(.+)/);
    // Check for numbered lists (1. 2. etc)
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)/);
    // Check for sub-bullets (indented with ○)
    const subBulletMatch = trimmedLine.match(/^\s*○\s+(.+)/);
    
    if (bulletMatch || subBulletMatch) {
      if (inNumberedList) {
        formattedHtml += '</ol>';
        inNumberedList = false;
      }
      if (!inList) {
        formattedHtml += '<ul style="list-style-type: disc; margin-left: 24px; margin-top: 10px; margin-bottom: 10px; padding-left: 0;">';
        inList = true;
      }
      const listContent = bulletMatch ? bulletMatch[1] : subBulletMatch![1];
      formattedHtml += `<li style="margin-bottom: 6px; padding-left: 8px; text-align: left;">${listContent}</li>`;
    } else if (numberedMatch) {
      if (inList) {
        formattedHtml += '</ul>';
        inList = false;
      }
      if (!inNumberedList) {
        formattedHtml += '<ol style="list-style-type: decimal; margin-left: 24px; margin-top: 10px; margin-bottom: 10px; padding-left: 0;">';
        inNumberedList = true;
      }
      formattedHtml += `<li style="margin-bottom: 6px; padding-left: 8px; text-align: left;">${numberedMatch[2]}</li>`;
    } else {
      if (inList) {
        formattedHtml += '</ul>';
        inList = false;
      }
      if (inNumberedList) {
        formattedHtml += '</ol>';
        inNumberedList = false;
      }
      if (trimmedLine) {
        formattedHtml += `<p style="margin-bottom: 12px; text-indent: 0; text-align: justify;">${trimmedLine}</p>`;
      }
    }
  });
  
  if (inList) formattedHtml += '</ul>';
  if (inNumberedList) formattedHtml += '</ol>';
  
  return formattedHtml || content;
};

export default PDFChapterContent;
