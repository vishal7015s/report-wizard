import { ReportData } from '@/types/report';
import svceLogo from '@/assets/svce-logo.png';

interface PDFPageProps {
  data: ReportData;
  pageNumber: string;
}

const PDFCertificate = ({ data, pageNumber }: PDFPageProps) => {
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
        
        {/* Certificate Title */}
        <h1 className="text-center font-bold text-2xl underline mt-8 mb-8">
          CERTIFICATE
        </h1>
        
        {/* Certificate Content */}
        <div className="text-justify leading-relaxed" style={{ fontSize: '14px' }}>
          <p className="mb-4">
            This is certify that{' '}
            <span style={{ color: '#d42027' }}>
              {firstStudent?.name || 'Student Name'} [{firstStudent?.enrollmentNumber || 'Enrollment No.'}]
            </span>{' '}
            has completed his project work, titled{' '}
            <span style={{ color: '#d42027' }}>
              "{projectDetails.projectTitle || 'Project Title'}"
            </span>{' '}
            As per the syllabus and has submitted a satisfactory report on this project as a fulfillment towards the degree of
          </p>
          
          <p className="text-center font-bold my-4">
            BACHELOR OF TECHNOLOGY IN
          </p>
          <p className="text-center font-bold" style={{ color: '#0066cc' }}>
            {projectDetails.department.toUpperCase()}
          </p>
          
          <p className="text-center my-4">From</p>
          
          <p className="text-center font-bold">
            RAJIV GANDHI PROUDYOGIKI VISHWAVIDYALAYA, BHOPAL
          </p>
        </div>
        
        {/* Signatures */}
        <div className="flex justify-between mt-20 px-4" style={{ fontSize: '14px' }}>
          <div className="text-center">
            <p className="font-bold">{projectDetails.guideName || 'Guide Name'}</p>
            <p>Project Coordinator</p>
            <p>{projectDetails.department} Department</p>
            <p>S.V.C.E., Indore</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{projectDetails.hodName || 'HOD Name'}</p>
            <p>HOD</p>
            <p>{projectDetails.department} Department</p>
            <p>S.V.C.E., Indore</p>
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

export default PDFCertificate;
