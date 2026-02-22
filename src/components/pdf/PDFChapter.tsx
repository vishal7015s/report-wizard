import { Chapter, ReportData } from '@/types/report';

interface PDFChapterProps {
  chapter: Chapter;
  data: ReportData;
  pageNumber: string;
}

const PDFChapter = ({ chapter, data, pageNumber }: PDFChapterProps) => {
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
      
      <div className="pt-12 px-12 pb-16">
        {/* Chapter Title */}
        <h1 
          className="text-center font-bold text-xl underline mb-8"
          style={{ color: '#c41e3a' }}
        >
          CHAPTER {chapter.number}: {chapter.title.toUpperCase()}
        </h1>
        
        {/* Chapter Content */}
        <div className="space-y-6">
          {chapter.sections.map((section) => (
            <div key={section.id} className="mb-6">
              {/* Section Heading */}
              <h2 
                className="font-bold text-base mb-3"
                style={{ color: '#1e90ff' }}
              >
                {section.number} {section.heading}
              </h2>
              
              {/* Section Content */}
              <div 
                className="text-justify leading-relaxed"
                style={{ fontSize: '14px', lineHeight: '1.8', color: '#000000' }}
              >
                {section.content || 'Content not provided.'}
              </div>
              
              {/* Section Images */}
              {section.images && section.images.length > 0 && (
                <div className="mt-4 space-y-4">
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
        
        {/* Page Number */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p style={{ fontSize: '12px', color: '#000000' }}>{pageNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFChapter;
