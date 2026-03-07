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

        {/* Title */}
        <h1 className="text-center font-bold text-2xl underline mt-8 mb-10" style={{ color: '#c41e3a' }}>
          PROJECT APPROVAL CERTIFICATE
        </h1>

        {/* Content */}
        <div className="text-justify leading-loose px-4" style={{ fontSize: '15px', color: '#000000' }}>
          <p>
            The project entitled{' '}
            <span className="font-bold" style={{ color: '#c41e3a' }}>
              "{projectDetails.projectTitle || 'Project Title'}"
            </span>{' '}
            submitted by{' '}
            {projectDetails.students.map((student, index) => (
              <span key={student.id}>
                <span className="font-bold" style={{ color: '#c41e3a' }}>
                  {student.name || 'Student Name'} [{student.enrollmentNumber || 'Enrollment No.'}]
                </span>
                {index < projectDetails.students.length - 1 ? ', ' : ' '}
              </span>
            ))}
            is recommended as fulfillment for the award of the{' '}
            <span className="font-bold">Bachelor of Technology in {projectDetails.department}</span>{' '}
            degree by{' '}
            <span className="font-bold" style={{ color: '#000000' }}>
              Rajiv Gandhi Proudyogiki Vishwavidyalaya.
            </span>
          </p>
        </div>

        {/* Examiner Signatures */}
        <div className="flex justify-between mt-40 px-8" style={{ fontSize: '15px', color: '#000000' }}>
          <div>
            <p className="font-bold">Internal Examiner</p>
            <p className="mt-20">Date:</p>
          </div>
          <div className="text-right">
            <p className="font-bold">External Examiner</p>
            <p className="mt-20">Date:</p>
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

export default PDFApproval;
