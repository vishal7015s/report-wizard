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
  // Check if content has bullet points or list items
  const lines = content.split('\n');
  let formattedHtml = '';
  let inList = false;
  
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // Check if line starts with bullet markers
    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
      if (!inList) {
        formattedHtml += '<ul style="list-style-type: disc; margin-left: 20px; margin-top: 8px; margin-bottom: 8px;">';
        inList = true;
      }
      const listContent = trimmedLine.replace(/^[•\-\*]\s*/, '');
      formattedHtml += `<li style="margin-bottom: 4px;">${listContent}</li>`;
    } else {
      if (inList) {
        formattedHtml += '</ul>';
        inList = false;
      }
      if (trimmedLine) {
        formattedHtml += `<p style="margin-bottom: 12px;">${trimmedLine}</p>`;
      }
    }
  });
  
  if (inList) {
    formattedHtml += '</ul>';
  }
  
  return formattedHtml || content;
};

export default PDFChapterContent;
