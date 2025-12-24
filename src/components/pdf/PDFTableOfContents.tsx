import React from 'react';

interface TOCEntry {
  title: string;
  pageNumber: string;
  isChapter?: boolean;
}

interface PDFTableOfContentsProps {
  entries: TOCEntry[];
  projectDetails: {
    projectTitle: string;
    department: string;
  };
}

const PDFTableOfContents: React.FC<PDFTableOfContentsProps> = ({ entries, projectDetails }) => {
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
          top: '6mm',
          left: '15mm',
          right: '15mm',
          fontSize: '12px',
          color: '#000000',
          fontWeight: 'normal',
          textAlign: 'left',
        }}
      >
        {projectDetails.projectTitle}
      </div>

      {/* Border */}
      <div
        className="absolute"
        style={{
          top: '12mm',
          left: '12mm',
          right: '12mm',
          bottom: '12mm',
          border: '2px solid #000',
        }}
      />

      {/* Content */}
      <div
        className="absolute"
        style={{
          top: '20mm',
          left: '20mm',
          right: '20mm',
          bottom: '25mm',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '30px',
            textDecoration: 'underline',
          }}
        >
          TABLE OF CONTENTS
        </h1>

        {/* TOC Entries */}
        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                  Contents
                </th>
                <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '14px', fontWeight: 'bold', width: '80px' }}>
                  Page No.
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: '6px 0',
                      fontSize: '13px',
                      fontWeight: entry.isChapter ? 'bold' : 'normal',
                      paddingLeft: entry.isChapter ? '0' : '15px',
                    }}
                  >
                    {entry.title}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '6px 0',
                      fontSize: '13px',
                    }}
                  >
                    {entry.pageNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div
        className="absolute flex justify-between items-center"
        style={{
          bottom: '6mm',
          left: '15mm',
          right: '15mm',
          fontSize: '11px',
        }}
      >
        <span style={{ color: '#000000' }}>
          Department of {projectDetails.department} & Engineering, SVCE, Indore
        </span>
        <span style={{ color: '#000000' }}>iii</span>
      </div>
    </div>
  );
};

export default PDFTableOfContents;
