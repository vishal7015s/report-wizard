import { ReportData } from '@/types/report';

interface PDFPageProps {
  data: ReportData;
  pageNumber: string;
}

const PDFDeclaration = ({ data, pageNumber }: PDFPageProps) => {
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
        <p className="text-center font-bold" style={{ color: '#0066cc', fontSize: '18px' }}>
          Swami Vivekanand College of Engineering, Indore
        </p>
        
        {/* Department */}
        <p className="text-center mt-2" style={{ color: '#0066cc', fontSize: '14px' }}>
          Department of {projectDetails.department}
        </p>
        
        {/* Title */}
        <h1 className="text-center font-bold text-xl mt-8 mb-8">
          CANDIDATE DECLARATION
        </h1>
        
        {/* Declaration Content */}
        <div className="text-justify leading-loose" style={{ fontSize: '14px' }}>
          <p>
            I hereby declare that the work, which is being presented in the project, entitled{' '}
            <span className="font-bold" style={{ color: '#d42027' }}>
              "{projectDetails.projectTitle || 'Project Title'}"
            </span>{' '}
            in partial fulfillment of the requirement for the award of degree of Bachelor of Technology in {projectDetails.department} and Engineering submitted in the department of {projectDetails.department} and Engineering, Swami Vivekanand College of Engineering Indore, is an authentic record of my own work carried under the guidance of{' '}
            <span className="font-bold">
              {projectDetails.guideName || 'Guide Name'}.
            </span>{' '}
            I have not submitted the matter embodied in this report forward of any other degree.
          </p>
        </div>
        
        {/* Student Signature */}
        <div className="text-right mt-16" style={{ fontSize: '14px' }}>
          <p className="font-bold">
            {firstStudent?.name || 'Student Name'}[{firstStudent?.enrollmentNumber || 'Enrollment No.'}]
          </p>
        </div>
        
        {/* Guide & HOD Signatures */}
        <div className="mt-20" style={{ fontSize: '14px' }}>
          <div className="mb-8">
            <p className="font-bold">{projectDetails.guideName || 'Guide Name'}</p>
            <p>Project Coordinator</p>
            <p>({projectDetails.department} Dept.)</p>
            <p>SVCE, Indore (M.P)</p>
          </div>
          
          <div className="text-right mt-12">
            <p className="font-bold">{projectDetails.hodName || 'HOD Name'}</p>
            <p>HOD, {projectDetails.department} Department</p>
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

export default PDFDeclaration;
