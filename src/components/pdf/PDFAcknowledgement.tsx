import { ReportData } from '@/types/report';

interface PDFPageProps {
  data: ReportData;
  pageNumber: string;
}

const PDFAcknowledgement = ({ data, pageNumber }: PDFPageProps) => {
  const { projectDetails, acknowledgement } = data;
  const firstStudent = projectDetails.students[0];

  const defaultAcknowledgement = `I am thankful to the technical university Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal for giving me opportunity to convert my theoretical knowledge into the practical skills through this project.

I am thankful to my college SVCE for giving me every resource to complete this project. The project work has been made successful by the group member some effort of the college and faculties.

I express my sincere thanks and gratitude to Principal, Dr. Pradeep Patil, Swami Vivekanand College of Engineering, Indore (M.P.), for providing all the necessary facilities and tureen couraging environment to bring out the best of my endeavors.

I would like to express gratitude to my ${projectDetails.guideName || 'Guide Name'}, ${projectDetails.department} Department under whose valuable guidance, for encouraging me regularly and explain me each and every concept, I was able to execute my project smoothly.

I would like to acknowledge all my friends & family members for the moral support the extended to main the completion of this dissertation.`;

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
      
      <div className="pt-12 px-12">
        {/* Title */}
        <h1 className="text-center font-bold text-2xl underline mb-10" style={{ color: '#c41e3a' }}>
          ACKNOWLEDGEMENT
        </h1>
        
        {/* Content */}
        <div className="text-justify leading-loose" style={{ fontSize: '15px', color: '#000000' }}>
          {(acknowledgement || defaultAcknowledgement).split('\n\n').map((para, index) => (
            <p key={index} className="mb-4">{para}</p>
          ))}
        </div>
        
        {/* Student Signature */}
        <div className="text-right mt-20" style={{ fontSize: '15px', color: '#000000' }}>
          <p className="font-bold">
            {firstStudent?.name || 'Student Name'} [{firstStudent?.enrollmentNumber || 'Enrollment No.'}]
          </p>
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
