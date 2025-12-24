import { ReportData } from '@/types/report';

interface PDFChapterTitleProps {
  chapterNumber: number;
  chapterTitle: string;
  data: ReportData;
  pageNumber: string;
}

const PDFChapterTitle = ({ chapterNumber, chapterTitle, data, pageNumber }: PDFChapterTitleProps) => {
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
      
      {/* Header */}
      <div 
        className="absolute top-6 left-0 right-0 text-center px-8"
        style={{ fontSize: '12px', color: '#c41e3a', fontWeight: 'bold' }}
      >
        {projectDetails.projectTitle || 'Project Title'}
      </div>
      
      {/* Centered Chapter Info */}
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '297mm' }}>
        <h1 
          className="text-3xl font-bold text-center"
          style={{ color: '#000000' }}
        >
          CHAPTER {chapterNumber}
        </h1>
        <h2 
          className="text-2xl font-bold text-center mt-4 underline"
          style={{ color: '#000000' }}
        >
          {chapterTitle.toUpperCase()}
        </h2>
      </div>
      
      {/* Footer */}
      <div 
        className="absolute bottom-8 left-8 right-8 flex justify-between items-center"
        style={{ fontSize: '11px' }}
      >
        <span style={{ color: '#1e90ff' }}>
          Department of {projectDetails.department} & Engineering, SVCE, Indore
        </span>
        <span style={{ color: '#000000' }}>{pageNumber}</span>
      </div>
    </div>
  );
};

export default PDFChapterTitle;
