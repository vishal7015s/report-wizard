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
      {/* Centered Chapter Info */}
      <div className="absolute flex flex-col items-center justify-center" style={{ top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }}>
        <h1
          className="font-bold text-center"
          style={{ color: '#000000', fontSize: '64px', fontWeight: '900', letterSpacing: '4px', marginBottom: '40px' }}
        >
          CHAPTER {chapterNumber}
        </h1>
        <h2
          className="font-bold text-center"
          style={{ color: '#000000', fontSize: '48px', fontWeight: '900', lineHeight: '1.4', letterSpacing: '2px' }}
        >
          {chapterTitle.toUpperCase()}
        </h2>
      </div>

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

export default PDFChapterTitle;
