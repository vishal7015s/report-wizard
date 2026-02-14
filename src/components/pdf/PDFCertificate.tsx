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
      
      <div className="pt-12 px-12">
        {/* College Name */}
        <p className="text-center font-bold text-xl" style={{ color: '#c41e3a' }}>
          SWAMI VIVEKANAND COLLEGE OF ENGINEERING, INDORE (M.P)
        </p>
        
        {/* SVCE Logo */}
        <div className="my-8 flex justify-center">
          <img 
            src={svceLogo} 
            alt="SVCE Logo" 
            style={{ width: '140px', height: '140px', objectFit: 'contain' }}
          />
        </div>
        
        {/* Certificate Title */}
        <h1 className="text-center font-bold text-2xl underline mt-8 mb-10" style={{ color: '#c41e3a' }}>
          CERTIFICATE
        </h1>
        
        {/* Certificate Content */}
        <div className="text-justify leading-loose" style={{ fontSize: '15px', color: '#000000' }}>
          <p className="mb-4">
            This is certify that{' '}
            <span className="font-bold" style={{ color: '#c41e3a' }}>
              {firstStudent?.name || 'Student Name'} [{firstStudent?.enrollmentNumber || 'Enrollment No.'}]
            </span>{' '}
            has completed his project work, titled{' '}
            <span className="font-bold" style={{ color: '#c41e3a' }}>
              "{projectDetails.projectTitle || 'Project Title'}"
            </span>{' '}
            As per the syllabus and has submitted a satisfactory report on this project as a fulfillment towards the degree of
          </p>
          
          <p className="text-center font-bold my-6" style={{ color: '#000000' }}>
            BACHELOR OF TECHNOLOGY IN
          </p>
          <p className="text-center font-bold text-lg" style={{ color: '#1e90ff' }}>
            {projectDetails.department.toUpperCase()}
          </p>
          
          <p className="text-center my-6" style={{ color: '#000000' }}>From</p>
          
          <p className="text-center font-bold text-lg" style={{ color: '#1e90ff' }}>
            RAJIV GANDHI PROUDYOGIKI VISHWAVIDYALAYA, BHOPAL
          </p>
        </div>
        
        {/* Signatures */}
        <div className="flex justify-between mt-24 px-4" style={{ fontSize: '15px', color: '#000000' }}>
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
          <p style={{ fontSize: '12px', color: '#000000' }}>{pageNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFCertificate;
