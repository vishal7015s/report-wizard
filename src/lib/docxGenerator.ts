import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
  convertInchesToTwip,
  SectionType,
  Header,
  Footer,
  PageNumber,
  VerticalAlign,
  TableLayoutType,
} from 'docx';
import { saveAs } from 'file-saver';
import { ReportData } from '@/types/report';

// Import logos as base64
import rgpvLogo from '@/assets/rgpv-logo.png';
import svceLogo from '@/assets/svce-logo.png';

const FONT_NAME = 'Times New Roman';
const DARK_BLUE = '1e3a5f';
const RED_COLOR = 'c41e3a';
const BLUE_COLOR = '1e90ff';
const BLACK_COLOR = '000000';

// Convert image URL to base64
const imageToBase64 = async (imageUrl: string): Promise<Uint8Array> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error loading image:', error);
    return new Uint8Array();
  }
};

// Create page border table (simulates border around content)
const createPageWithBorder = (content: Paragraph[]): Table => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 12, color: DARK_BLUE },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: DARK_BLUE },
      left: { style: BorderStyle.SINGLE, size: 12, color: DARK_BLUE },
      right: { style: BorderStyle.SINGLE, size: 12, color: DARK_BLUE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: {
              top: convertInchesToTwip(0.3),
              bottom: convertInchesToTwip(0.3),
              left: convertInchesToTwip(0.3),
              right: convertInchesToTwip(0.3),
            },
            children: content,
          }),
        ],
      }),
    ],
  });
};

const createCoverPage = async (data: ReportData): Promise<(Table | Paragraph)[]> => {
  const rgpvImageData = await imageToBase64(rgpvLogo);
  const paragraphs: Paragraph[] = [];
  
  // Project Type
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: data.projectDetails.projectType,
          bold: true,
          size: 36,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Submitted in Fulfillment
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Submitted in Fulfillment for the Award of Under Graduate Degree of',
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Degree Name
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `BACHELOR OF TECHNOLOGY IN ${data.projectDetails.department.toUpperCase()}`,
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Project Title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `"${data.projectDetails.projectTitle}"`,
          size: 28,
          font: FONT_NAME,
          color: BLACK_COLOR,
        }),
      ],
    })
  );
  
  // Submitted to
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Submitted to',
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: BLACK_COLOR,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'BHOPAL (M.P.)',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    })
  );
  
  // RGPV Logo
  if (rgpvImageData.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [
          new ImageRun({
            data: rgpvImageData,
            transformation: { width: 120, height: 120 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Guided By and Submitted By table
  const guidedBySubmittedByTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Guided By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
                ],
              }),
              new Paragraph({
                spacing: { before: 100 },
                children: [
                  new TextRun({ text: data.projectDetails.guideName, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: data.projectDetails.guideDesignation, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `${data.projectDetails.department} Department`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Submitted By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
                ],
              }),
              ...data.projectDetails.students.map(student => 
                new Paragraph({
                  spacing: { before: 100 },
                  children: [
                    new TextRun({ text: `${student.name} [${student.enrollmentNumber}]`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
                  ],
                })
              ),
            ],
          }),
        ],
      }),
    ],
  });
  
  paragraphs.push(new Paragraph({ spacing: { after: 200 } }));
  
  // Footer content
  const footerParagraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: `Department of ${data.projectDetails.department}`,
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100 },
      children: [
        new TextRun({
          text: 'SWAMI VIVEKANAND COLLEGE OF ENGINEERING, INDORE (M.P)',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 50 },
      children: [
        new TextRun({
          text: data.projectDetails.session,
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: BLACK_COLOR,
        }),
      ],
    }),
  ];
  
  return [
    createPageWithBorder([...paragraphs]),
    guidedBySubmittedByTable,
    ...footerParagraphs,
    new Paragraph({ children: [new PageBreak()] }),
  ];
};

const createCoverPageWithSVCE = async (data: ReportData): Promise<(Table | Paragraph)[]> => {
  const svceImageData = await imageToBase64(svceLogo);
  const paragraphs: Paragraph[] = [];
  
  // Project Type
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: data.projectDetails.projectType,
          bold: true,
          size: 36,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Submitted in Fulfillment
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Submitted in Fulfillment for the Award of Under Graduate Degree of',
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Degree Name
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `BACHELOR OF TECHNOLOGY IN ${data.projectDetails.department.toUpperCase()}`,
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Project Title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `"${data.projectDetails.projectTitle}"`,
          size: 28,
          font: FONT_NAME,
          color: BLACK_COLOR,
        }),
      ],
    })
  );
  
  // Submitted to
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Submitted to',
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: BLACK_COLOR,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'BHOPAL (M.P.)',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    })
  );
  
  // SVCE Logo
  if (svceImageData.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [
          new ImageRun({
            data: svceImageData,
            transformation: { width: 120, height: 120 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Guided By and Submitted By table
  const guidedBySubmittedByTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Guided By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
                ],
              }),
              new Paragraph({
                spacing: { before: 100 },
                children: [
                  new TextRun({ text: data.projectDetails.guideName, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: data.projectDetails.guideDesignation, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `${data.projectDetails.department} Department`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Submitted By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
                ],
              }),
              ...data.projectDetails.students.map(student => 
                new Paragraph({
                  spacing: { before: 100 },
                  children: [
                    new TextRun({ text: `${student.name} [${student.enrollmentNumber}]`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
                  ],
                })
              ),
            ],
          }),
        ],
      }),
    ],
  });
  
  // Footer content
  const footerParagraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: `Department of ${data.projectDetails.department}`,
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100 },
      children: [
        new TextRun({
          text: 'SWAMI VIVEKANAND COLLEGE OF ENGINEERING, INDORE (M.P)',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 50 },
      children: [
        new TextRun({
          text: data.projectDetails.session,
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: BLACK_COLOR,
        }),
      ],
    }),
  ];
  
  return [
    createPageWithBorder([...paragraphs]),
    guidedBySubmittedByTable,
    ...footerParagraphs,
    new Paragraph({ children: [new PageBreak()] }),
  ];
};

const createCertificatePage = async (data: ReportData): Promise<(Table | Paragraph)[]> => {
  const svceImageData = await imageToBase64(svceLogo);
  const firstStudent = data.projectDetails.students[0];
  
  const paragraphs: Paragraph[] = [
    // College Name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'SWAMI VIVEKANAND COLLEGE OF ENGINEERING, INDORE (M.P)',
          bold: true,
          size: 32,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    }),
  ];
  
  // SVCE Logo
  if (svceImageData.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [
          new ImageRun({
            data: svceImageData,
            transformation: { width: 120, height: 120 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Certificate Title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 300 },
      children: [
        new TextRun({
          text: 'CERTIFICATE',
          bold: true,
          size: 40,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    })
  );
  
  // Certificate Content
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 200, line: 360 },
      children: [
        new TextRun({ text: 'This is certify that ', size: 24, font: FONT_NAME, color: BLACK_COLOR }),
        new TextRun({ text: `${firstStudent?.name} [${firstStudent?.enrollmentNumber}]`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
        new TextRun({ text: ' has completed his project work, titled ', size: 24, font: FONT_NAME, color: BLACK_COLOR }),
        new TextRun({ text: `"${data.projectDetails.projectTitle}"`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
        new TextRun({ text: ' As per the syllabus and has submitted a satisfactory report on this project as a fulfillment towards the degree of', size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({ text: 'BACHELOR OF TECHNOLOGY IN', bold: true, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: data.projectDetails.department.toUpperCase(), bold: true, size: 28, font: FONT_NAME, color: BLUE_COLOR }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'From', size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({ text: 'RAJIV GANDHI PROUDYOGIKI VISHWAVIDYALAYA, BHOPAL', bold: true, size: 28, font: FONT_NAME, color: BLUE_COLOR }),
      ],
    })
  );
  
  // Signatures Table
  const signaturesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            children: [
              new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: data.projectDetails.guideName, bold: true, size: 24, font: FONT_NAME })] }),
              new Paragraph({ children: [new TextRun({ text: 'Project Coordinator', size: 22, font: FONT_NAME })] }),
              new Paragraph({ children: [new TextRun({ text: `${data.projectDetails.department} Department`, size: 22, font: FONT_NAME })] }),
              new Paragraph({ children: [new TextRun({ text: 'S.V.C.E., Indore', size: 22, font: FONT_NAME })] }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            children: [
              new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.projectDetails.hodName, bold: true, size: 24, font: FONT_NAME })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'HOD', size: 22, font: FONT_NAME })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${data.projectDetails.department} Department`, size: 22, font: FONT_NAME })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'S.V.C.E., Indore', size: 22, font: FONT_NAME })] }),
            ],
          }),
        ],
      }),
    ],
  });
  
  return [
    createPageWithBorder(paragraphs),
    signaturesTable,
    new Paragraph({ children: [new PageBreak()] }),
  ];
};

const createDeclarationPage = (data: ReportData): (Table | Paragraph)[] => {
  const firstStudent = data.projectDetails.students[0];
  
  const paragraphs: Paragraph[] = [
    // College Name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Swami Vivekanand College of Engineering, Indore',
          bold: true,
          size: 32,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `Department of ${data.projectDetails.department}`,
          size: 24,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    }),
    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'CANDIDATE DECLARATION',
          bold: true,
          size: 40,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    }),
    // Content
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 300, line: 360 },
      children: [
        new TextRun({ text: 'I hereby declare that the work, which is being presented in the project, entitled ', size: 24, font: FONT_NAME }),
        new TextRun({ text: `"${data.projectDetails.projectTitle}"`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
        new TextRun({ text: ` in partial fulfillment of the requirement for the award of degree of Bachelor of Technology in ${data.projectDetails.department} and Engineering submitted in the department of ${data.projectDetails.department} and Engineering, Swami Vivekanand College of Engineering Indore, is an authentic record of my own work carried under the guidance of `, size: 24, font: FONT_NAME }),
        new TextRun({ text: `${data.projectDetails.guideName}.`, bold: true, size: 24, font: FONT_NAME }),
        new TextRun({ text: ' I have not submitted the matter embodied in this report forward of any other degree.', size: 24, font: FONT_NAME }),
      ],
    }),
    // Student Signature
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 600 },
      children: [
        new TextRun({ text: `${firstStudent?.name}[${firstStudent?.enrollmentNumber}]`, bold: true, size: 24, font: FONT_NAME }),
      ],
    }),
    // Guide Signature
    new Paragraph({
      spacing: { before: 800 },
      children: [
        new TextRun({ text: data.projectDetails.guideName, bold: true, size: 24, font: FONT_NAME }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Project Coordinator', size: 22, font: FONT_NAME })],
    }),
    new Paragraph({
      children: [new TextRun({ text: `(${data.projectDetails.department} Dept.)`, size: 22, font: FONT_NAME })],
    }),
    new Paragraph({
      children: [new TextRun({ text: 'SVCE, Indore (M.P)', size: 22, font: FONT_NAME })],
    }),
    // HOD Signature
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 600 },
      children: [
        new TextRun({ text: data.projectDetails.hodName, bold: true, size: 24, font: FONT_NAME }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: `HOD, ${data.projectDetails.department} Department`, size: 22, font: FONT_NAME })],
    }),
  ];
  
  return [
    createPageWithBorder(paragraphs),
    new Paragraph({ children: [new PageBreak()] }),
  ];
};

const createApprovalPage = async (data: ReportData): Promise<(Table | Paragraph)[]> => {
  const svceImageData = await imageToBase64(svceLogo);
  const firstStudent = data.projectDetails.students[0];
  
  const paragraphs: Paragraph[] = [
    // College Name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'SWAMI VIVEKANAND COLLEGE OF ENGINEERING, INDORE (M.P)',
          bold: true,
          size: 32,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    }),
  ];
  
  // SVCE Logo
  if (svceImageData.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [
          new ImageRun({
            data: svceImageData,
            transformation: { width: 120, height: 120 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 400 },
      children: [
        new TextRun({
          text: 'PROJECT APPROVAL CERTIFICATE',
          bold: true,
          size: 40,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    })
  );
  
  // Content
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 400, line: 360 },
      children: [
        new TextRun({ text: 'The project entitled ', size: 24, font: FONT_NAME }),
        new TextRun({ text: `"${data.projectDetails.projectTitle}"`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
        new TextRun({ text: ' submitted by ', size: 24, font: FONT_NAME }),
        new TextRun({ text: `${firstStudent?.name} [${firstStudent?.enrollmentNumber}]`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
        new TextRun({ text: ' is recommended as fulfillment for the award of the ', size: 24, font: FONT_NAME }),
        new TextRun({ text: `Bachelor of Technology in ${data.projectDetails.department}`, bold: true, size: 24, font: FONT_NAME }),
        new TextRun({ text: ' degree by ', size: 24, font: FONT_NAME }),
        new TextRun({ text: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya.', bold: true, size: 24, font: FONT_NAME, color: BLUE_COLOR }),
      ],
    })
  );
  
  // Examiner Signatures
  const examinersTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            children: [
              new Paragraph({ spacing: { before: 1200 }, children: [new TextRun({ text: 'Internal Examiner', bold: true, size: 24, font: FONT_NAME })] }),
              new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: 'Date:', size: 22, font: FONT_NAME })] }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            children: [
              new Paragraph({ spacing: { before: 1200 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'External Examiner', bold: true, size: 24, font: FONT_NAME })] }),
              new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Date:', size: 22, font: FONT_NAME })] }),
            ],
          }),
        ],
      }),
    ],
  });
  
  return [
    createPageWithBorder(paragraphs),
    examinersTable,
    new Paragraph({ children: [new PageBreak()] }),
  ];
};

const createAcknowledgementPage = (data: ReportData): (Table | Paragraph)[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'ACKNOWLEDGEMENT',
          bold: true,
          size: 40,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    }),
  ];
  
  const ackParagraphs = data.acknowledgement.split('\n\n').filter(p => p.trim());
  ackParagraphs.forEach((para) => {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 300, line: 360 },
        children: [
          new TextRun({
            text: para.trim(),
            size: 24,
            font: FONT_NAME,
          }),
        ],
      })
    );
  });
  
  return [
    createPageWithBorder(paragraphs),
    new Paragraph({ children: [new PageBreak()] }),
  ];
};

const createAbstractPage = (data: ReportData): (Table | Paragraph)[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'ABSTRACT',
          bold: true,
          size: 40,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    }),
  ];
  
  const abstractParagraphs = data.abstract.split('\n\n').filter(p => p.trim());
  abstractParagraphs.forEach((para) => {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 300, line: 360 },
        children: [
          new TextRun({
            text: para.trim(),
            size: 24,
            font: FONT_NAME,
          }),
        ],
      })
    );
  });
  
  return [
    createPageWithBorder(paragraphs),
    new Paragraph({ children: [new PageBreak()] }),
  ];
};

const createChapterContent = (data: ReportData): (Table | Paragraph)[] => {
  const elements: (Table | Paragraph)[] = [];
  
  data.chapters.forEach((chapter, chapterIdx) => {
    // Chapter title page
    const chapterTitleParagraphs: Paragraph[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 400 },
        children: [
          new TextRun({
            text: `CHAPTER ${chapter.number}`,
            bold: true,
            size: 48,
            font: FONT_NAME,
            color: RED_COLOR,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: chapter.title.toUpperCase(),
            bold: true,
            size: 40,
            font: FONT_NAME,
            color: RED_COLOR,
          }),
        ],
      }),
    ];
    
    elements.push(createPageWithBorder(chapterTitleParagraphs));
    elements.push(new Paragraph({ children: [new PageBreak()] }));
    
    // Chapter content
    chapter.sections.forEach((section, sectionIdx) => {
      // Section heading
      elements.push(
        new Paragraph({
          spacing: { before: 400, after: 200 },
          children: [
            new TextRun({
              text: `${chapter.number}.${sectionIdx + 1} ${section.heading}`,
              bold: true,
              size: 28,
              font: FONT_NAME,
              color: RED_COLOR,
            }),
          ],
        })
      );
      
      // Section content
      const contentParagraphs = section.content.split('\n').filter(p => p.trim());
      
      contentParagraphs.forEach((para) => {
        const trimmedPara = para.trim();
        
        // Check if it's a bullet point
        if (trimmedPara.match(/^[•\-\*○]/)) {
          elements.push(
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { after: 100, line: 360 },
              indent: { left: 720 },
              children: [
                new TextRun({
                  text: trimmedPara,
                  size: 24,
                  font: FONT_NAME,
                }),
              ],
            })
          );
        } else {
          elements.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200, line: 360 },
              children: [
                new TextRun({
                  text: trimmedPara,
                  size: 24,
                  font: FONT_NAME,
                }),
              ],
            })
          );
        }
      });
    });
    
    // Page break after each chapter (except last)
    if (chapterIdx < data.chapters.length - 1) {
      elements.push(new Paragraph({ children: [new PageBreak()] }));
    }
  });
  
  return elements;
};

export const generateDOCX = async (data: ReportData, filename: string = 'project-report.docx'): Promise<void> => {
  const allElements: (Table | Paragraph)[] = [];
  
  // Add all sections
  const coverPage = await createCoverPage(data);
  allElements.push(...coverPage);
  
  const coverPageSVCE = await createCoverPageWithSVCE(data);
  allElements.push(...coverPageSVCE);
  
  const certificatePage = await createCertificatePage(data);
  allElements.push(...certificatePage);
  
  allElements.push(...createDeclarationPage(data));
  
  const approvalPage = await createApprovalPage(data);
  allElements.push(...approvalPage);
  
  allElements.push(...createAcknowledgementPage(data));
  allElements.push(...createAbstractPage(data));
  allElements.push(...createChapterContent(data));
  
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: allElements,
      },
    ],
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
