import { ReportData } from '@/types/report';

interface PDFPageProps {
  data: ReportData;
  pageNumber: string;
}

const PDFDeclaration = ({ data, pageNumber }: PDFPageProps) => {
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
          border: '3px solid #000',
          pointerEvents: 'none'
        }}
      />
      
      <div className="pt-12 px-12">
        {/* College Name */}
        <p className="text-center font-bold text-xl" style={{ color: '#000000' }}>
          Swami Vivekanand College of Engineering, Indore
        </p>
        
        {/* Department */}
        <p className="text-center mt-2 text-base" style={{ color: '#000000' }}>
          Department of {projectDetails.department}
        </p>
        
        {/* Title */}
        <h1 className="text-center font-bold text-2xl underline mt-10 mb-10" style={{ color: '#c41e3a' }}>
          CANDIDATE DECLARATION
        </h1>
        
        {/* Declaration Content */}
        <div className="text-justify leading-loose" style={{ fontSize: '15px', color: '#000000' }}>
          <p>
            I hereby declare that the work, which is being presented in the project, entitled{' '}
            <span className="font-bold" style={{ color: '#c41e3a' }}>
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
        <div className="text-right mt-16" style={{ fontSize: '15px', color: '#000000' }}>
          <p className="font-bold">
            {firstStudent?.name || 'Student Name'}[{firstStudent?.enrollmentNumber || 'Enrollment No.'}]
          </p>
        </div>
        
        {/* Guide & HOD Signatures */}
        <div className="mt-24" style={{ fontSize: '15px', color: '#000000' }}>
          <div className="mb-10">
            <p className="font-bold">{projectDetails.guideName || 'Guide Name'}</p>
            <p>Project Coordinator</p>
            <p>({projectDetails.department} Dept.)</p>
            <p>SVCE, Indore (M.P)</p>
          </div>
          
          <div className="text-right mt-16">
            <p className="font-bold">{projectDetails.hodName || 'HOD Name'}</p>
            <p>HOD, {projectDetails.department} Department</p>
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

export default PDFDeclaration;
