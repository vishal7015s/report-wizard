import React from 'react';

interface FigureEntry {
  figureNumber: string;
  title: string;
  pageNumber: string;
}

interface PDFListOfFiguresProps {
  figures: FigureEntry[];
  projectDetails: {
    projectTitle: string;
    department: string;
  };
  isContinued?: boolean;
  pageNumber?: string;
}

const PDFListOfFigures: React.FC<PDFListOfFiguresProps> = ({ figures, projectDetails, isContinued, pageNumber }) => {
  return (
    <div
      className="pdf-page bg-white relative"
      style={{
        width: '210mm',
        height: '297mm',
        padding: '0',
        boxSizing: 'border-box',
        fontFamily: 'Times New Roman, serif',
      }}
    >
      {/* Header - Project Title */}
      <div
        className="absolute"
        style={{
          top: '8mm',
          left: '15mm',
          right: '15mm',
          fontSize: '14px',
          color: '#000000',
          fontWeight: 'bold',
          textAlign: 'left',
        }}
      >
        {projectDetails.projectTitle}
      </div>

      {/* Border */}
      <div
        className="absolute"
        style={{
          top: '15mm',
          left: '15mm',
          right: '15mm',
          bottom: '15mm',
          border: '3px solid #000',
        }}
      />

      {/* Content */}
      <div
        className="absolute"
        style={{
          top: '25mm',
          left: '25mm',
          right: '25mm',
          bottom: '20mm',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '15px',
          }}
        >
          {isContinued ? 'List of Figures (Continued)' : 'List of Figures'}
        </h1>

        {/* Figures Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #000' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #000' }}>
              <th style={{ border: '1px solid #000', textAlign: 'left', padding: '6px 8px', fontWeight: 'bold' }}>
                Figure No.
              </th>
              <th style={{ border: '1px solid #000', textAlign: 'left', padding: '6px 8px', fontWeight: 'bold' }}>
                Title
              </th>
              <th style={{ border: '1px solid #000', textAlign: 'center', padding: '6px 8px', fontWeight: 'bold', width: '60px' }}>
                Page No.
              </th>
            </tr>
          </thead>
          <tbody>
            {figures.length > 0 ? (
              figures.map((figure, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '6px 8px', width: '80px', textAlign: 'center' }}>
                    {figure.figureNumber}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '6px 8px' }}>
                    {figure.title}
                  </td>
                  <td style={{ border: '1px solid #000', textAlign: 'center', padding: '6px 8px', width: '60px' }}>
                    {figure.pageNumber}
                  </td>
                </tr>
              ))
            ) : (
              <tr style={{ borderBottom: '1px solid #000' }}>
                <td colSpan={3} style={{ border: '1px solid #000', padding: '8px 5px', textAlign: 'center', fontStyle: 'italic' }}>
                  No figures in this report
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="absolute flex justify-between items-center"
        style={{
          bottom: '8mm',
          left: '15mm',
          right: '15mm',
          fontSize: '13px',
          fontWeight: 'bold',
        }}
      >
        <span style={{ color: '#000000' }}>
          Department of {projectDetails.department} & Engineering, SVCE, Indore
        </span>
        <span style={{ color: '#000000' }}>{pageNumber || 'viii'}</span>
      </div>
    </div>
  );
};

export default PDFListOfFigures;
