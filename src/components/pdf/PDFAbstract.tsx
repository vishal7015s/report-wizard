import { ReportData } from '@/types/report';

interface PDFPageProps {
  data: ReportData;
  pageNumber: string;
}

const PDFAbstract = ({ data, pageNumber }: PDFPageProps) => {
  const { projectDetails, abstract } = data;

  const defaultAbstract = `The increasing prevalence of chronic diseases such as heart disease and diabetes has created a need for intelligent and efficient diagnostic systems that can assist in early detection and prevention. Traditional diagnostic methods are often time-consuming, require expert involvement, and may not always identify hidden patterns within medical data. This project, titled "${projectDetails.projectTitle || 'Your Project Title'}," presents an automated, data-driven approach to predict the likelihood of multiple diseases using patient health parameters.

The system utilizes publicly available medical datasets and applies supervised machine learning techniques to analyze clinical features such as blood pressure, glucose levels, cholesterol, BMI, age, and other health indicators. Various algorithms—including Logistic Regression, Support Vector Machine, Random Forest, and K-Nearest Neighbors—are trained and evaluated to determine the best-performing models for heart disease and diabetes prediction. Data preprocessing methods like normalization, encoding, and missing value handling are incorporated to ensure the reliability of the system.

The developed model generates accurate predictions for both diseases based on a single set of input values, making it more effective than single-disease prediction systems. The output is presented in a user-friendly format, allowing individuals to assess their health risk quickly and conveniently. Although the system does not replace professional medical diagnosis, it serves as a powerful decision-support tool for early awareness and preventive care.

The results demonstrate that machine learning models can significantly enhance medical prediction accuracy and help identify high-risk cases at an early stage. With further advancements, integration of more diseases, real-time monitoring, and deployment as a web or mobile platform, this system holds strong potential for practical applications in the healthcare domain.`;

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
          ABSTRACT
        </h1>
        
        {/* Content */}
        <div className="text-justify leading-loose" style={{ fontSize: '15px', color: '#000000' }}>
          {(abstract || defaultAbstract).split('\n\n').map((para, index) => (
            <p key={index} className="mb-4">{para}</p>
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

export default PDFAbstract;
