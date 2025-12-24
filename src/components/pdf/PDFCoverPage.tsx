import { ReportData } from '@/types/report';
import rgpvLogo from '@/assets/rgpv-logo.png';

interface PDFPageProps {
  data: ReportData;
  pageNumber: string;
}

const PDFCoverPage = ({ data, pageNumber }: PDFPageProps) => {
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
      
      <div className="text-center pt-12 px-8">
        {/* Project Type */}
        <p className="text-xl font-bold" style={{ color: '#c41e3a' }}>
          {projectDetails.projectType}
        </p>
        
        {/* Submitted in Fulfillment */}
        <p className="text-base mt-3 font-bold" style={{ color: '#c41e3a' }}>
          Submitted in Fulfillment for the Award of Under Graduate Degree of
        </p>
        
        {/* Degree Name */}
        <p className="text-lg font-bold mt-1" style={{ color: '#c41e3a' }}>
          BACHELOR OF TECHNOLOGY IN INFORMATION TECHNOLOGY
        </p>
        
        {/* Project Title */}
        <p className="text-lg mt-12 font-normal" style={{ color: '#000000' }}>
          "{projectDetails.projectTitle || 'Your Project Title'}"
        </p>
        
        {/* Submitted to */}
        <p className="text-base mt-12 font-bold" style={{ color: '#000000' }}>Submitted to</p>
        <p className="text-lg mt-2 font-bold" style={{ color: '#1e90ff' }}>
          Rajiv Gandhi Proudyogiki Vishwavidyalaya
        </p>
        <p className="text-lg font-bold" style={{ color: '#1e90ff' }}>
          BHOPAL (M.P.)
        </p>
        
        {/* RGPV Logo */}
        <div className="my-10 flex justify-center">
          <img 
            src={rgpvLogo} 
            alt="RGPV Logo" 
            style={{ width: '140px', height: '140px', objectFit: 'contain' }}
          />
        </div>
        
        {/* Guided By / Submitted By */}
        <div className="flex justify-between px-12 mt-10" style={{ fontSize: '15px' }}>
          <div className="text-left">
            <p className="font-bold underline" style={{ color: '#c41e3a' }}>Guided By:-</p>
            <p className="mt-2" style={{ color: '#000000' }}>{projectDetails.guideName || 'Guide Name'}</p>
            <p style={{ color: '#000000' }}>{projectDetails.guideDesignation}</p>
            <p style={{ color: '#000000' }}>{projectDetails.department} Department</p>
          </div>
          <div className="text-left">
            <p className="font-bold underline" style={{ color: '#c41e3a' }}>Submitted By:-</p>
            {projectDetails.students.map((student) => (
              <p key={student.id} className="mt-2" style={{ color: '#000000' }}>
                {student.name || 'Student Name'} [{student.enrollmentNumber || 'Enrollment No.'}]
              </p>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-24 left-0 right-0 text-center">
          <p className="text-base font-bold" style={{ color: '#c41e3a' }}>
            Department of {projectDetails.department}
          </p>
          <p className="text-lg font-bold mt-3" style={{ color: '#c41e3a' }}>
            SWAMI VIVEKANAND COLLEGE OF ENGINEERING, INDORE (M.P)
          </p>
          <p className="text-base font-bold mt-1" style={{ color: '#000000' }}>{projectDetails.session}</p>
        </div>
        
        {/* Page Number */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p style={{ fontSize: '12px', color: '#000000' }}>{pageNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFCoverPage;
