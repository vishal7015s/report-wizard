import React from 'react';

interface TOCEntry {
  title: string;
  pageNumber: string;
  isChapter?: boolean;
  isSection?: boolean;
}

interface PDFTableOfContentsProps {
  entries: TOCEntry[];
  projectDetails: {
    projectTitle: string;
    department: string;
  };
  isContinued?: boolean;
  pageNumber?: string;
}

const PDFTableOfContents: React.FC<PDFTableOfContentsProps> = ({ entries, projectDetails, isContinued, pageNumber }) => {
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
          Table of Content
        </h1>

        {/* TOC Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', border: '1px solid #000' }}>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: '1px solid #000',
                    padding: '4px 8px',
                    fontWeight: entry.isChapter ? 'bold' : 'normal',
                    textTransform: entry.isChapter ? 'uppercase' : 'none',
                  }}
                >
                  {entry.title}
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                    textAlign: 'center',
                    padding: '4px 8px',
                    width: '60px',
                    fontWeight: entry.isChapter ? 'bold' : 'normal',
                  }}
                >
                  {entry.pageNumber}
                </td>
              </tr>
            ))}
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
        <span style={{ color: '#000000' }}>{pageNumber || 'x'}</span>
      </div>
    </div>
  );
};

export default PDFTableOfContents;
