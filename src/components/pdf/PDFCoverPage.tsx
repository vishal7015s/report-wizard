import { ReportData } from '@/types/report';

interface PDFPageProps {
  data: ReportData;
  pageNumber: string;
}

const PDFCoverPage = ({ data, pageNumber }: PDFPageProps) => {
  const { projectDetails } = data;
  const firstStudent = projectDetails.students[0];

  return (
    <div className="pdf-page" style={{ width: '210mm', minHeight: '297mm', position: 'relative' }}>
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
      
      <div className="text-center pt-8" style={{ fontFamily: 'Times New Roman, serif' }}>
        {/* Project Type */}
        <p className="text-lg font-bold" style={{ color: '#d42027' }}>
          {projectDetails.projectType}
        </p>
        
        {/* Submitted in Fulfillment */}
        <p className="text-sm mt-2" style={{ color: '#0066cc' }}>
          Submitted in Fulfillment for the Award of Under Graduate Degree of
        </p>
        
        {/* Degree Name */}
        <p className="text-base font-bold mt-1" style={{ color: '#d42027' }}>
          BACHELOR OF TECHNOLOGY IN INFORMATION TECHNOLOGY
        </p>
        
        {/* Project Title */}
        <p className="text-base mt-8 italic">
          "{projectDetails.projectTitle || 'Your Project Title'}"
        </p>
        
        {/* Submitted to */}
        <p className="text-sm mt-10 font-bold">Submitted to</p>
        <p className="mt-1" style={{ color: '#0066cc' }}>
          Rajiv Gandhi Proudyogiki Vishwavidyalaya
        </p>
        <p className="font-bold" style={{ color: '#0066cc' }}>
          BHOPAL (M.P.)
        </p>
        
        {/* RGPV Logo Placeholder */}
        <div className="my-8 flex justify-center">
          <div 
            className="rounded-full flex items-center justify-center"
            style={{ 
              width: '120px', 
              height: '120px', 
              border: '3px solid #8B0000',
              background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)'
            }}
          >
            <div className="text-center">
              <p style={{ fontSize: '8px', color: '#8B0000', fontWeight: 'bold' }}>RGPV</p>
              <p style={{ fontSize: '6px', color: '#8B0000' }}>BHOPAL</p>
            </div>
          </div>
        </div>
        
        {/* Guided By / Submitted By */}
        <div className="flex justify-between px-8 mt-8" style={{ fontSize: '14px' }}>
          <div className="text-left">
            <p className="font-bold underline">Guided By:-</p>
            <p className="mt-2">{projectDetails.guideName || 'Guide Name'}</p>
            <p>{projectDetails.guideDesignation}</p>
            <p>{projectDetails.department} Department</p>
          </div>
          <div className="text-left">
            <p className="font-bold underline">Submitted By:-</p>
            {projectDetails.students.map((student, index) => (
              <p key={student.id} className="mt-2">
                {student.name || 'Student Name'} [{student.enrollmentNumber || 'Enrollment No.'}]
              </p>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-24 left-0 right-0 text-center">
          <p className="font-bold" style={{ color: '#0066cc' }}>
            Department of {projectDetails.department}
          </p>
          <p className="font-bold mt-2" style={{ color: '#d42027' }}>
            SWAMI VIVEKANAND COLLEGE OF ENGINEERING, INDORE (M.P)
          </p>
          <p className="font-bold">{projectDetails.session}</p>
        </div>
        
        {/* Page Number */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p style={{ fontSize: '12px' }}>{pageNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFCoverPage;
