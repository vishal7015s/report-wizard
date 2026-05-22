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
  VerticalAlign,
  TableLayoutType,
  TabStopType,
  TabStopPosition,
  LeaderType,
} from 'docx';
import { saveAs } from 'file-saver';
import { ReportData } from '@/types/report';
import { getDefaultAcknowledgement } from './utils';

const FONT_NAME = 'Times New Roman';
const DARK_BLUE = '1e3a5f';
const RED_COLOR = 'c41e3a';
const BLUE_COLOR = '1e90ff';
const BLACK_COLOR = '000000';

// Convert twips for consistent measurements
const PAGE_WIDTH_TWIPS = convertInchesToTwip(8.5);
const CONTENT_WIDTH_TWIPS = convertInchesToTwip(6.5); // Content area inside borders
const BORDER_SIZE = 12; // Border thickness in eighths of a point

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

// Get logo paths - use import.meta.url for proper resolution
const getRGPVLogoPath = () => {
  return new URL('../assets/rgpv-logo.png', import.meta.url).href;
};

const getSVCELogoPath = () => {
  return new URL('../assets/svce-logo.png', import.meta.url).href;
};

// ============ GOOGLE DOCS FRIENDLY BORDER WRAPPER ============
// Wraps content in a single-cell table with dark blue border (works in Google Docs)
const wrapInBorderedTable = (content: (Paragraph | Table)[]): Table => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: BORDER_SIZE, color: DARK_BLUE },
              bottom: { style: BorderStyle.SINGLE, size: BORDER_SIZE, color: DARK_BLUE },
              left: { style: BorderStyle.SINGLE, size: BORDER_SIZE, color: DARK_BLUE },
              right: { style: BorderStyle.SINGLE, size: BORDER_SIZE, color: DARK_BLUE },
            },
            margins: {
              top: convertInchesToTwip(0.3),
              bottom: convertInchesToTwip(0.3),
              left: convertInchesToTwip(0.4),
              right: convertInchesToTwip(0.4),
            },
            children: content,
          }),
        ],
      }),
    ],
  });
};

// ============ SIGNATURE TABLE WITH FIXED DXA WIDTHS ============
const createSignatureTable = (leftContent: Paragraph[], rightContent: Paragraph[]): Table => {
  return new Table({
    width: { size: CONTENT_WIDTH_TWIPS, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
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
            width: { size: Math.floor(CONTENT_WIDTH_TWIPS / 2), type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: leftContent,
          }),
          new TableCell({
            width: { size: Math.floor(CONTENT_WIDTH_TWIPS / 2), type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: rightContent,
          }),
        ],
      }),
    ],
  });
};

// ============ COVER PAGE WITH RGPV LOGO ============
const createCoverPage = async (data: ReportData): Promise<Table> => {
  const rgpvImageData = await imageToBase64(getRGPVLogoPath());
  const content: (Paragraph | Table)[] = [];
  
  // Project Type
  content.push(
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
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Submitted in Fulfillment for the Award of Under Graduate Degree of',
          bold: true,
          size: 22,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Degree Name
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `BACHELOR OF TECHNOLOGY IN ${data.projectDetails.department.toUpperCase()}`,
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Project Title
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `"${data.projectDetails.projectTitle}"`,
          size: 26,
          font: FONT_NAME,
          color: BLACK_COLOR,
        }),
      ],
    })
  );
  
  // Submitted to
  content.push(
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
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
          bold: true,
          size: 26,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
      children: [
        new TextRun({
          text: 'BHOPAL (M.P.)',
          bold: true,
          size: 26,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    })
  );
  
  // RGPV Logo
  if (rgpvImageData.length > 0) {
    content.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 150 },
        children: [
          new ImageRun({
            data: rgpvImageData,
            transformation: { width: 90, height: 90 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Guided By section
  content.push(
    new Paragraph({
      spacing: { before: 150, after: 50 },
      children: [
        new TextRun({ text: 'Guided By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
      ],
    })
  );
  content.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.projectDetails.guideName, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  content.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.projectDetails.guideDesignation, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  content.push(
    new Paragraph({
      spacing: { after: 150 },
      children: [
        new TextRun({ text: `${data.projectDetails.department} Department`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  
  // Submitted By section
  content.push(
    new Paragraph({
      spacing: { before: 100, after: 50 },
      children: [
        new TextRun({ text: 'Submitted By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
      ],
    })
  );
  
  data.projectDetails.students.forEach(student => {
    content.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${student.name} [${student.enrollmentNumber}]`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
        ],
      })
    );
  });
  
  // Footer content
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
      children: [
        new TextRun({
          text: `Department of ${data.projectDetails.department}`,
          bold: true,
          size: 22,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 50 },
      children: [
        new TextRun({
          text: 'SWAMI VIVEKANAND COLLEGE OF ENGINEERING, INDORE (M.P)',
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  content.push(
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
    })
  );
  
  return wrapInBorderedTable(content);
};

// ============ COVER PAGE WITH SVCE LOGO ============
const createCoverPageWithSVCE = async (data: ReportData): Promise<Table> => {
  const svceImageData = await imageToBase64(getSVCELogoPath());
  const content: (Paragraph | Table)[] = [];
  
  // Project Type
  content.push(
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
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Submitted in Fulfillment for the Award of Under Graduate Degree of',
          bold: true,
          size: 22,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Degree Name
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `BACHELOR OF TECHNOLOGY IN ${data.projectDetails.department.toUpperCase()}`,
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Project Title
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `"${data.projectDetails.projectTitle}"`,
          size: 26,
          font: FONT_NAME,
          color: BLACK_COLOR,
        }),
      ],
    })
  );
  
  // Submitted to
  content.push(
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
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
          bold: true,
          size: 26,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
      children: [
        new TextRun({
          text: 'BHOPAL (M.P.)',
          bold: true,
          size: 26,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    })
  );
  
  // SVCE Logo
  if (svceImageData.length > 0) {
    content.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 150 },
        children: [
          new ImageRun({
            data: svceImageData,
            transformation: { width: 90, height: 90 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Guided By section
  content.push(
    new Paragraph({
      spacing: { before: 150, after: 50 },
      children: [
        new TextRun({ text: 'Guided By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
      ],
    })
  );
  content.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.projectDetails.guideName, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  content.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.projectDetails.guideDesignation, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  content.push(
    new Paragraph({
      spacing: { after: 150 },
      children: [
        new TextRun({ text: `${data.projectDetails.department} Department`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  
  // Submitted By section
  content.push(
    new Paragraph({
      spacing: { before: 100, after: 50 },
      children: [
        new TextRun({ text: 'Submitted By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
      ],
    })
  );
  
  data.projectDetails.students.forEach(student => {
    content.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${student.name} [${student.enrollmentNumber}]`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
        ],
      })
    );
  });
  
  // Footer content
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
      children: [
        new TextRun({
          text: `Department of ${data.projectDetails.department}`,
          bold: true,
          size: 22,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 50 },
      children: [
        new TextRun({
          text: 'SWAMI VIVEKANAND COLLEGE OF ENGINEERING, INDORE (M.P)',
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  content.push(
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
    })
  );
  
  return wrapInBorderedTable(content);
};

// ============ CERTIFICATE PAGE ============
const createCertificatePage = async (data: ReportData): Promise<Table> => {
  const svceImageData = await imageToBase64(getSVCELogoPath());
  const content: (Paragraph | Table)[] = [];
  
  // College Header
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'SWAMI VIVEKANAND COLLEGE OF ENGINEERING,',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'INDORE (M.P)',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // SVCE Logo
  if (svceImageData.length > 0) {
    content.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 50, after: 100 },
        children: [
          new ImageRun({
            data: svceImageData,
            transformation: { width: 80, height: 80 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Certificate Title
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'CERTIFICATE',
          bold: true,
          size: 36,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    })
  );
  
  // Certificate content
  const certificateStudentRuns: TextRun[] = [];
  data.projectDetails.students.forEach((student, index) => {
    certificateStudentRuns.push(
      new TextRun({
        text: `${student.name || 'Student Name'} [${student.enrollmentNumber || 'Enrollment No.'}]`,
        bold: true,
        size: 24,
        font: FONT_NAME,
        color: RED_COLOR,
      })
    );
    if (index < data.projectDetails.students.length - 1) {
      certificateStudentRuns.push(
        new TextRun({
          text: ', ',
          size: 24,
          font: FONT_NAME,
        })
      );
    }
  });

  content.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 200, line: 360 },
      children: [
        new TextRun({ text: 'This is to certify that ', size: 24, font: FONT_NAME }),
        ...certificateStudentRuns,
        new TextRun({ text: ' has completed the project work, titled ', size: 24, font: FONT_NAME }),
        new TextRun({ text: `"${data.projectDetails.projectTitle}"`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
        new TextRun({ text: ' as per the syllabus and has submitted a satisfactory report on this project as a fulfillment towards the degree of', size: 24, font: FONT_NAME }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 50 },
      children: [
        new TextRun({ text: 'BACHELOR OF TECHNOLOGY IN', bold: true, size: 24, font: FONT_NAME }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({ text: data.projectDetails.department.toUpperCase(), bold: true, italics: true, size: 24, font: FONT_NAME, color: BLUE_COLOR }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({ text: 'From', size: 24, font: FONT_NAME }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: 'RAJIV GANDHI PROUDYOGIKI VISHWAVIDYALAYA, BHOPAL', bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
      ],
    })
  );
  
  // Signatures
  content.push(
    createSignatureTable(
      [
        new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: 'Project Coordinator', bold: true, size: 24, font: FONT_NAME })] }),
        new Paragraph({ children: [new TextRun({ text: `(${data.projectDetails.department} Dept.)`, size: 22, font: FONT_NAME })] }),
        new Paragraph({ children: [new TextRun({ text: 'SVCE, Indore (M.P)', size: 22, font: FONT_NAME })] }),
      ],
      [
        new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `HOD, ${data.projectDetails.department} Department`, bold: true, size: 24, font: FONT_NAME })] }),
      ]
    )
  );
  
  return wrapInBorderedTable(content);
};

// ============ DECLARATION PAGE ============
const createDeclarationPage = (data: ReportData): Table => {
  const content: (Paragraph | Table)[] = [];
  
  // College Header
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'Swami Vivekanand College of Engineering, Indore',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: BLUE_COLOR,
        }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Department of ${data.projectDetails.department}`,
          bold: true,
          size: 24,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // Declaration Title
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: 'CANDIDATE DECLARATION',
          bold: true,
          size: 36,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    })
  );
  
  // Declaration content
  content.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 300, line: 360 },
      children: [
        new TextRun({ text: 'I hereby declare that the work, which is being presented in the project, entitled ', size: 24, font: FONT_NAME }),
        new TextRun({ text: `"${data.projectDetails.projectTitle}"`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
        new TextRun({ text: ` in partial fulfillment of the requirement for the award of degree of Bachelor of Technology in ${data.projectDetails.department} and Engineering submitted in the department of ${data.projectDetails.department} and Engineering, Swami Vivekanand College of Engineering Indore, is an authentic record of my own work carried under the guidance of `, size: 24, font: FONT_NAME }),
        new TextRun({ text: data.projectDetails.guideName, bold: true, size: 24, font: FONT_NAME }),
        new TextRun({ text: '. I have not submitted the matter embodied in this report for the award of any other degree.', size: 24, font: FONT_NAME }),
      ],
    })
  );
  
  // Student signatures
  const declarationStudentRuns: TextRun[] = [];
  data.projectDetails.students.forEach((student, index) => {
    declarationStudentRuns.push(
      new TextRun({
        text: `${student.name || 'Student Name'} [${student.enrollmentNumber || 'Enrollment No.'}]`,
        bold: true,
        size: 24,
        font: FONT_NAME,
      })
    );
    if (index < data.projectDetails.students.length - 1) {
      declarationStudentRuns.push(new TextRun({ break: 1 }));
    }
  });

  content.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 400 },
      children: declarationStudentRuns,
    })
  );
  
  // Signatures
  content.push(
    createSignatureTable(
      [
        new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: 'Project Coordinator', bold: true, size: 24, font: FONT_NAME })] }),
        new Paragraph({ children: [new TextRun({ text: `(${data.projectDetails.department} Dept.)`, size: 22, font: FONT_NAME })] }),
        new Paragraph({ children: [new TextRun({ text: 'SVCE, Indore (M.P)', size: 22, font: FONT_NAME })] }),
      ],
      [
        new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `HOD, ${data.projectDetails.department} Department`, bold: true, size: 24, font: FONT_NAME })] }),
      ]
    )
  );
  
  return wrapInBorderedTable(content);
};

// ============ APPROVAL PAGE ============
const createApprovalPage = async (data: ReportData): Promise<Table> => {
  const svceImageData = await imageToBase64(getSVCELogoPath());
  const content: (Paragraph | Table)[] = [];
  
  // College Header
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: 'SWAMI VIVEKANAND COLLEGE OF ENGINEERING,',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'INDORE (M.P)',
          bold: true,
          size: 28,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  // SVCE Logo
  if (svceImageData.length > 0) {
    content.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 50, after: 100 },
        children: [
          new ImageRun({
            data: svceImageData,
            transformation: { width: 80, height: 80 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Approval Title
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'PROJECT APPROVAL CERTIFICATE',
          bold: true,
          size: 36,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    })
  );
  
  // Content
  const approvalStudentRuns: TextRun[] = [];
  data.projectDetails.students.forEach((student, index) => {
    approvalStudentRuns.push(
      new TextRun({
        text: `${student.name || 'Student Name'} [${student.enrollmentNumber || 'Enrollment No.'}]`,
        bold: true,
        size: 24,
        font: FONT_NAME,
        color: RED_COLOR,
      })
    );
    if (index < data.projectDetails.students.length - 1) {
      approvalStudentRuns.push(
        new TextRun({
          text: ', ',
          size: 24,
          font: FONT_NAME,
        })
      );
    }
  });

  content.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 300, line: 360 },
      children: [
        new TextRun({ text: 'The project entitled ', size: 24, font: FONT_NAME }),
        new TextRun({ text: `"${data.projectDetails.projectTitle}"`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
        new TextRun({ text: ' submitted by ', size: 24, font: FONT_NAME }),
        ...approvalStudentRuns,
        new TextRun({ text: ' is recommended as fulfillment for the award of the ', size: 24, font: FONT_NAME }),
        new TextRun({ text: `Bachelor of Technology in ${data.projectDetails.department}`, bold: true, size: 24, font: FONT_NAME }),
        new TextRun({ text: ' degree by ', size: 24, font: FONT_NAME }),
        new TextRun({ text: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya.', bold: true, size: 24, font: FONT_NAME, color: BLUE_COLOR }),
      ],
    })
  );
  
  // Examiner Signatures
  content.push(
    createSignatureTable(
      [
        new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: 'Internal Examiner', bold: true, size: 24, font: FONT_NAME })] }),
        new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: 'Date:', size: 22, font: FONT_NAME })] }),
      ],
      [
        new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'External Examiner', bold: true, size: 24, font: FONT_NAME })] }),
        new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Date:', size: 22, font: FONT_NAME })] }),
      ]
    )
  );
  
  return wrapInBorderedTable(content);
};

// ============ ACKNOWLEDGEMENT PAGE ============
const parseTextRuns = (text: string, fontName: string, fontSize: number): TextRun[] => {
  const parts = text.split('**');
  return parts.map((part, index) => {
    return new TextRun({
      text: part,
      bold: index % 2 === 1,
      size: fontSize,
      font: fontName,
    });
  });
};

const createAcknowledgementPage = (data: ReportData): Table => {
  const content: (Paragraph | Table)[] = [];
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: 'ACKNOWLEDGEMENT',
          bold: true,
          size: 36,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    })
  );
  
  const ackText = data.acknowledgement || getDefaultAcknowledgement(data.projectDetails);
  const ackParagraphs = ackText.split('\n\n').filter(p => p.trim());
  
  ackParagraphs.forEach((para) => {
    content.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200, line: 360 },
        children: parseTextRuns(para.trim(), FONT_NAME, 24),
      })
    );
  });

  // Student signatures for Acknowledgement Page
  const ackStudentRuns: TextRun[] = [];
  data.projectDetails.students.forEach((student, index) => {
    ackStudentRuns.push(
      new TextRun({
        text: `${student.name || 'Student Name'} [${student.enrollmentNumber || 'Enrollment No.'}]`,
        bold: true,
        size: 24,
        font: FONT_NAME,
      })
    );
    if (index < data.projectDetails.students.length - 1) {
      ackStudentRuns.push(new TextRun({ break: 1 }));
    }
  });

  content.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 400 },
      children: ackStudentRuns,
    })
  );
  
  return wrapInBorderedTable(content);
};

// ============ ABSTRACT PAGE ============
const createAbstractPage = (data: ReportData): Table => {
  const content: (Paragraph | Table)[] = [];
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: 'ABSTRACT',
          bold: true,
          size: 36,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    })
  );
  
  const abstractText = data.abstract || 'This project presents a comprehensive study and implementation of the proposed system.';
  const abstractParagraphs = abstractText.split('\n\n').filter(p => p.trim());
  
  abstractParagraphs.forEach((para) => {
    content.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200, line: 360 },
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
  
  return wrapInBorderedTable(content);
};

// ============ TABLE OF CONTENTS PAGE (with tab stops + dot leaders) ============
const createTableOfContents = (data: ReportData): Table => {
  const content: (Paragraph | Table)[] = [];
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: 'TABLE OF CONTENTS',
          bold: true,
          size: 36,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    })
  );
  
  // Tab stop for right-aligned page numbers with dot leader
  const tocTabStop = {
    type: TabStopType.RIGHT,
    position: TabStopPosition.MAX,
    leader: LeaderType.DOT,
  };
  
  // Preliminary pages
  const preliminaryItems = [
    { title: 'Certificate', page: 'i' },
    { title: 'Declaration', page: 'ii' },
    { title: 'Approval Certificate', page: 'iii' },
    { title: 'Acknowledgement', page: 'iv' },
    { title: 'Abstract', page: 'v' },
    { title: 'Table of Contents', page: 'vi' },
  ];
  
  preliminaryItems.forEach(item => {
    content.push(
      new Paragraph({
        spacing: { after: 120 },
        tabStops: [tocTabStop],
        children: [
          new TextRun({ text: item.title, size: 24, font: FONT_NAME }),
          new TextRun({ text: '\t', size: 24, font: FONT_NAME }),
          new TextRun({ text: item.page, size: 24, font: FONT_NAME }),
        ],
      })
    );
  });
  
  // Chapters
  let pageNum = 1;
  data.chapters.forEach((chapter) => {
    content.push(
      new Paragraph({
        spacing: { before: 150, after: 100 },
        tabStops: [tocTabStop],
        children: [
          new TextRun({ text: `Chapter ${chapter.number}: ${chapter.title}`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
          new TextRun({ text: '\t', size: 24, font: FONT_NAME }),
          new TextRun({ text: `${pageNum}`, size: 24, font: FONT_NAME }),
        ],
      })
    );
    
    chapter.sections.forEach((section, sectionIdx) => {
      content.push(
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: convertInchesToTwip(0.3) },
          tabStops: [tocTabStop],
          children: [
            new TextRun({ text: `${chapter.number}.${sectionIdx + 1} ${section.heading}`, size: 24, font: FONT_NAME }),
          ],
        })
      );
    });
    
    pageNum += 2 + Math.ceil(chapter.sections.length / 2);
  });
  
  return wrapInBorderedTable(content);
};

// ============ CHAPTER TITLE PAGE ============
const createChapterTitlePage = (chapter: { number: number; title: string }): Table => {
  const content: (Paragraph | Table)[] = [];
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(3), after: 300 },
      children: [
        new TextRun({
          text: `CHAPTER ${chapter.number}`,
          bold: true,
          size: 48,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: chapter.title.toUpperCase(),
          bold: true,
          size: 40,
          font: FONT_NAME,
          color: RED_COLOR,
        }),
      ],
    })
  );
  
  return wrapInBorderedTable(content);
};

// ============ CHAPTER CONTENT PAGES (with images) ============
const createChapterContent = async (chapter: { number: number; sections: { heading: string; content: string; images?: { url: string; caption: string }[] }[] }): Promise<Table> => {
  const content: (Paragraph | Table)[] = [];
  
  for (let sectionIdx = 0; sectionIdx < chapter.sections.length; sectionIdx++) {
    const section = chapter.sections[sectionIdx];
    
    // Section heading
    content.push(
      new Paragraph({
        spacing: { before: 300, after: 150 },
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
    const sectionContent = section.content || '';
    const contentLines = sectionContent.split('\n').filter(p => p.trim());
    
    contentLines.forEach((para) => {
      const trimmedPara = para.trim();
      
      // Check if it's a bullet point
      if (trimmedPara.match(/^[•\-\*○]/)) {
        content.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80, line: 360 },
            indent: { left: convertInchesToTwip(0.3) },
            children: [
              new TextRun({
                text: trimmedPara,
                size: 24,
                font: FONT_NAME,
              }),
            ],
          })
        );
      } else if (trimmedPara.length > 0) {
        content.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 150, line: 360 },
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
    
    // Section images
    if (section.images && section.images.length > 0) {
      for (let imgIdx = 0; imgIdx < section.images.length; imgIdx++) {
        const image = section.images[imgIdx];
        try {
          const imageData = await imageToBase64(image.url);
          if (imageData.length > 0) {
            content.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 100 },
                children: [
                  new ImageRun({
                    data: imageData,
                    transformation: { width: 400, height: 250 },
                    type: 'png',
                  }),
                ],
              })
            );
            
            // Image caption
            content.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: `Fig ${chapter.number}.${imgIdx + 1}: ${image.caption || 'Figure'}`,
                    italics: true,
                    size: 22,
                    font: FONT_NAME,
                  }),
                ],
              })
            );
          }
        } catch (error) {
          console.error('Error loading section image:', error);
        }
      }
    }
  }
  
  return wrapInBorderedTable(content);
};

// ============ MAIN EXPORT FUNCTION ============
export const generateDOCX = async (data: ReportData, filename: string = 'project-report.docx'): Promise<void> => {
  const sections: any[] = [];
  
  // Page properties (margins only - borders are handled by table wrapper)
  const pageProperties = {
    page: {
      margin: {
        top: convertInchesToTwip(0.5),
        right: convertInchesToTwip(0.5),
        bottom: convertInchesToTwip(0.5),
        left: convertInchesToTwip(0.5),
      },
    },
  };
  
  // Cover Page with RGPV Logo
  const coverPage = await createCoverPage(data);
  sections.push({
    properties: pageProperties,
    children: [coverPage],
  });
  
  // Cover Page with SVCE Logo
  const coverPageSVCE = await createCoverPageWithSVCE(data);
  sections.push({
    properties: pageProperties,
    children: [coverPageSVCE],
  });
  
  // Certificate Page
  const certificatePage = await createCertificatePage(data);
  sections.push({
    properties: pageProperties,
    children: [certificatePage],
  });
  
  // Declaration Page
  const declarationPage = createDeclarationPage(data);
  sections.push({
    properties: pageProperties,
    children: [declarationPage],
  });
  
  // Approval Page
  const approvalPage = await createApprovalPage(data);
  sections.push({
    properties: pageProperties,
    children: [approvalPage],
  });
  
  // Acknowledgement Page
  const acknowledgementPage = createAcknowledgementPage(data);
  sections.push({
    properties: pageProperties,
    children: [acknowledgementPage],
  });
  
  // Abstract Page
  const abstractPage = createAbstractPage(data);
  sections.push({
    properties: pageProperties,
    children: [abstractPage],
  });
  
  // Table of Contents
  const tocPage = createTableOfContents(data);
  sections.push({
    properties: pageProperties,
    children: [tocPage],
  });
  
  // Chapters
  for (const chapter of data.chapters) {
    // Chapter title page
    const chapterTitlePage = createChapterTitlePage(chapter);
    sections.push({
      properties: pageProperties,
      children: [chapterTitlePage],
    });
    
    // Chapter content pages
    const chapterContentPage = await createChapterContent(chapter);
    sections.push({
      properties: pageProperties,
      children: [chapterContentPage],
    });
  }
  
  const doc = new Document({
    sections: sections,
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
