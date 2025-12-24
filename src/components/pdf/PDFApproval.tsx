import { ReportData } from '@/types/report';
import svceLogo from '@/assets/svce-logo.png';

interface PDFPageProps {
  data: ReportData;
  pageNumber: string;
}

const PDFApproval = ({ data, pageNumber }: PDFPageProps) => {
  const { projectDetails } = data;
  const firstStudent = projectDetails.students[0];

  return (
    <div className="pdf-page" style={{ width: '210mm', minHeight: '297mm', position: 'relative', backgroundColor: '#ffffff' }}>
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
      
      <div className="pt-8 px-8" style={{ fontFamily: 'Times New Roman, serif' }}>
        {/* College Name */}
        <p className="text-center font-bold" style={{ color: '#d42027', fontSize: '16px' }}>
          SWAMI VIVEKANAND COLLEGE OF ENGINEERING, INDORE (M.P)
        </p>
        
        {/* SVCE Logo */}
        <div className="my-6 flex justify-center">
          <img 
            src={svceLogo} 
            alt="SVCE Logo" 
            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
          />
        </div>
        
        {/* Title */}
        <h1 className="text-center font-bold text-xl mt-8 mb-8" style={{ color: '#d42027' }}>
          PROJECT APPROVAL CERTIFICATE
        </h1>
        
        {/* Content */}
        <div className="text-justify leading-relaxed px-4" style={{ fontSize: '14px' }}>
          <p>
            The project entitled{' '}
            <span className="font-bold" style={{ color: '#d42027' }}>
              "{projectDetails.projectTitle || 'Project Title'}"
            </span>{' '}
            submitted by{' '}
            <span className="font-bold" style={{ color: '#d42027' }}>
              {firstStudent?.name || 'Student Name'} [{firstStudent?.enrollmentNumber || 'Enrollment No.'}]
            </span>{' '}
            is recommended as fulfillment for the award of the{' '}
            <span className="font-bold">Bachelor of Technology in {projectDetails.department}</span>{' '}
            degree by Rajiv Gandhi Proudyogiki Vishwavidyalaya.
          </p>
        </div>
        
        {/* Examiner Signatures */}
        <div className="flex justify-between mt-32 px-8" style={{ fontSize: '14px' }}>
          <div>
            <p className="font-bold">Internal Examiner</p>
            <p className="mt-16">Date:</p>
          </div>
          <div className="text-right">
            <p className="font-bold">External Examiner</p>
            <p className="mt-16">Date:</p>
          </div>
        </div>
        
        {/* Page Number */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p style={{ fontSize: '12px' }}>{pageNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFApproval;
