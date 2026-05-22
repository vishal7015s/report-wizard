import { ReportData } from '@/types/report';
import { getDefaultAcknowledgement } from '@/lib/utils';

interface PDFPageProps {
  data: ReportData;
  pageNumber: string;
}

const PDFAcknowledgement = ({ data, pageNumber }: PDFPageProps) => {
  const { projectDetails, acknowledgement } = data;

  const defaultAcknowledgement = getDefaultAcknowledgement(projectDetails);

  const renderFormattedText = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold">{part}</strong>;
      }
      return part;
    });
  };

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
      
      <div className="pt-12 px-12">
        {/* Title */}
        <h1 className="text-center font-bold text-2xl underline mb-10" style={{ color: '#c41e3a' }}>
          ACKNOWLEDGEMENT
        </h1>
        
        {/* Content */}
        <div className="text-justify leading-loose" style={{ fontSize: '15px', color: '#000000' }}>
          {(acknowledgement || defaultAcknowledgement).split('\n\n').map((para, index) => (
            <p key={index} className="mb-4">{renderFormattedText(para)}</p>
          ))}
        </div>
        
        {/* Student Signature */}
        <div className="text-right mt-20" style={{ fontSize: '15px', color: '#000000' }}>
          {projectDetails.students.map((student) => (
            <p key={student.id} className="font-bold">
              {student.name || 'Student Name'} [{student.enrollmentNumber || 'Enrollment No.'}]
            </p>
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

export default PDFAcknowledgement;
