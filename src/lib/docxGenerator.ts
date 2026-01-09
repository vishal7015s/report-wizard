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
  PageBorderDisplay,
  PageBorderOffsetFrom,
  PageBorderZOrder,
} from 'docx';
import { saveAs } from 'file-saver';
import { ReportData } from '@/types/report';

const FONT_NAME = 'Times New Roman';
const DARK_BLUE = '1e3a5f';
const RED_COLOR = 'c41e3a';
const BLUE_COLOR = '1e90ff';
const BLACK_COLOR = '000000';

// Page border configuration for all pages
const PAGE_BORDERS = {
  pageBorders: {
    display: PageBorderDisplay.ALL_PAGES,
    offsetFrom: PageBorderOffsetFrom.PAGE,
    zOrder: PageBorderZOrder.FRONT,
    pageBorderTop: {
      style: BorderStyle.SINGLE,
      size: 24,
      color: DARK_BLUE,
      space: 24,
    },
    pageBorderBottom: {
      style: BorderStyle.SINGLE,
      size: 24,
      color: DARK_BLUE,
      space: 24,
    },
    pageBorderLeft: {
      style: BorderStyle.SINGLE,
      size: 24,
      color: DARK_BLUE,
      space: 24,
    },
    pageBorderRight: {
      style: BorderStyle.SINGLE,
      size: 24,
      color: DARK_BLUE,
      space: 24,
    },
  },
};

// Page margins
const PAGE_MARGINS = {
  margin: {
    top: convertInchesToTwip(0.75),
    right: convertInchesToTwip(0.75),
    bottom: convertInchesToTwip(0.75),
    left: convertInchesToTwip(1),
  },
};

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

// Get logo paths
const getRGPVLogoPath = () => {
  // Use absolute path for Vite
  return new URL('../assets/rgpv-logo.png', import.meta.url).href;
};

const getSVCELogoPath = () => {
  return new URL('../assets/svce-logo.png', import.meta.url).href;
};

// Create invisible table for signature alignment
const createSignatureTable = (leftContent: Paragraph[], rightContent: Paragraph[]): Table => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
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
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: leftContent,
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
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
const createCoverPage = async (data: ReportData): Promise<Paragraph[]> => {
  const rgpvImageData = await imageToBase64(getRGPVLogoPath());
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
            transformation: { width: 100, height: 100 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Guided By section
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 50 },
      children: [
        new TextRun({ text: 'Guided By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.projectDetails.guideName, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.projectDetails.guideDesignation, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: `${data.projectDetails.department} Department`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  
  // Submitted By section
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 50 },
      children: [
        new TextRun({ text: 'Submitted By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
      ],
    })
  );
  
  data.projectDetails.students.forEach(student => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${student.name} [${student.enrollmentNumber}]`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
        ],
      })
    );
  });
  
  // Footer content
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300 },
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
  
  paragraphs.push(
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
    })
  );
  
  paragraphs.push(
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
  
  return paragraphs;
};

// ============ COVER PAGE WITH SVCE LOGO ============
const createCoverPageWithSVCE = async (data: ReportData): Promise<Paragraph[]> => {
  const svceImageData = await imageToBase64(getSVCELogoPath());
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
            transformation: { width: 100, height: 100 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Guided By section
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 50 },
      children: [
        new TextRun({ text: 'Guided By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.projectDetails.guideName, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.projectDetails.guideDesignation, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: `${data.projectDetails.department} Department`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  
  // Submitted By section
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 50 },
      children: [
        new TextRun({ text: 'Submitted By:-', bold: true, underline: {}, size: 24, font: FONT_NAME, color: RED_COLOR }),
      ],
    })
  );
  
  data.projectDetails.students.forEach(student => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${student.name} [${student.enrollmentNumber}]`, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
        ],
      })
    );
  });
  
  // Footer content
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300 },
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
  
  paragraphs.push(
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
    })
  );
  
  paragraphs.push(
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
  
  return paragraphs;
};

// ============ CERTIFICATE PAGE ============
const createCertificatePage = async (data: ReportData): Promise<(Paragraph | Table)[]> => {
  const svceImageData = await imageToBase64(getSVCELogoPath());
  const firstStudent = data.projectDetails.students[0];
  const elements: (Paragraph | Table)[] = [];
  
  // College Name
  elements.push(
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
    })
  );
  
  // SVCE Logo
  if (svceImageData.length > 0) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 100 },
        children: [
          new ImageRun({
            data: svceImageData,
            transformation: { width: 100, height: 100 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Certificate Title
  elements.push(
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
  elements.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 200, line: 360 },
      children: [
        new TextRun({ text: 'This is to certify that ', size: 24, font: FONT_NAME, color: BLACK_COLOR }),
        new TextRun({ text: `${firstStudent?.name} [${firstStudent?.enrollmentNumber}]`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
        new TextRun({ text: ' has completed his project work, titled ', size: 24, font: FONT_NAME, color: BLACK_COLOR }),
        new TextRun({ text: `"${data.projectDetails.projectTitle}"`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
        new TextRun({ text: ' as per the syllabus and has submitted a satisfactory report on this project as a fulfillment towards the degree of', size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({ text: 'BACHELOR OF TECHNOLOGY IN', bold: true, size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: data.projectDetails.department.toUpperCase(), bold: true, size: 28, font: FONT_NAME, color: BLUE_COLOR }),
      ],
    })
  );
  
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'From', size: 24, font: FONT_NAME, color: BLACK_COLOR }),
      ],
    })
  );
  
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({ text: 'RAJIV GANDHI PROUDYOGIKI VISHWAVIDYALAYA, BHOPAL', bold: true, size: 28, font: FONT_NAME, color: BLUE_COLOR }),
      ],
    })
  );
  
  // Signatures Table
  elements.push(
    createSignatureTable(
      [
        new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: data.projectDetails.guideName, bold: true, size: 24, font: FONT_NAME })] }),
        new Paragraph({ children: [new TextRun({ text: 'Project Coordinator', size: 22, font: FONT_NAME })] }),
        new Paragraph({ children: [new TextRun({ text: `${data.projectDetails.department} Department`, size: 22, font: FONT_NAME })] }),
        new Paragraph({ children: [new TextRun({ text: 'S.V.C.E., Indore', size: 22, font: FONT_NAME })] }),
      ],
      [
        new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.projectDetails.hodName, bold: true, size: 24, font: FONT_NAME })] }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'HOD', size: 22, font: FONT_NAME })] }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${data.projectDetails.department} Department`, size: 22, font: FONT_NAME })] }),
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'S.V.C.E., Indore', size: 22, font: FONT_NAME })] }),
      ]
    )
  );
  
  return elements;
};

// ============ DECLARATION PAGE ============
const createDeclarationPage = (data: ReportData): Paragraph[] => {
  const firstStudent = data.projectDetails.students[0];
  
  return [
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
        new TextRun({ text: ' I have not submitted the matter embodied in this report for the award of any other degree.', size: 24, font: FONT_NAME }),
      ],
    }),
    // Student Signature
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 600 },
      children: [
        new TextRun({ text: `${firstStudent?.name} [${firstStudent?.enrollmentNumber}]`, bold: true, size: 24, font: FONT_NAME }),
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
};

// ============ APPROVAL PAGE ============
const createApprovalPage = async (data: ReportData): Promise<(Paragraph | Table)[]> => {
  const svceImageData = await imageToBase64(getSVCELogoPath());
  const firstStudent = data.projectDetails.students[0];
  const elements: (Paragraph | Table)[] = [];
  
  // College Name
  elements.push(
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
    })
  );
  
  // SVCE Logo
  if (svceImageData.length > 0) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 100 },
        children: [
          new ImageRun({
            data: svceImageData,
            transformation: { width: 100, height: 100 },
            type: 'png',
          }),
        ],
      })
    );
  }
  
  // Title
  elements.push(
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
  elements.push(
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
  elements.push(
    createSignatureTable(
      [
        new Paragraph({ spacing: { before: 1200 }, children: [new TextRun({ text: 'Internal Examiner', bold: true, size: 24, font: FONT_NAME })] }),
        new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: 'Date:', size: 22, font: FONT_NAME })] }),
      ],
      [
        new Paragraph({ spacing: { before: 1200 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'External Examiner', bold: true, size: 24, font: FONT_NAME })] }),
        new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Date:', size: 22, font: FONT_NAME })] }),
      ]
    )
  );
  
  return elements;
};

// ============ ACKNOWLEDGEMENT PAGE ============
const createAcknowledgementPage = (data: ReportData): Paragraph[] => {
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
  
  return paragraphs;
};

// ============ ABSTRACT PAGE ============
const createAbstractPage = (data: ReportData): Paragraph[] => {
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
  
  return paragraphs;
};

// ============ TABLE OF CONTENTS PAGE ============
const createTableOfContents = (data: ReportData): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'TABLE OF CONTENTS',
          bold: true,
          size: 40,
          font: FONT_NAME,
          color: RED_COLOR,
          underline: {},
        }),
      ],
    }),
  ];
  
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
    paragraphs.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: item.title, size: 24, font: FONT_NAME }),
          new TextRun({ text: ' '.repeat(50), size: 24, font: FONT_NAME }),
          new TextRun({ text: item.page, size: 24, font: FONT_NAME }),
        ],
      })
    );
  });
  
  // Chapters
  let pageNum = 1;
  data.chapters.forEach((chapter) => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({ text: `Chapter ${chapter.number}: ${chapter.title}`, bold: true, size: 24, font: FONT_NAME, color: RED_COLOR }),
          new TextRun({ text: ' '.repeat(30), size: 24, font: FONT_NAME }),
          new TextRun({ text: `${pageNum}`, size: 24, font: FONT_NAME }),
        ],
      })
    );
    
    chapter.sections.forEach((section, sectionIdx) => {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 100 },
          indent: { left: 720 },
          children: [
            new TextRun({ text: `${chapter.number}.${sectionIdx + 1} ${section.heading}`, size: 24, font: FONT_NAME }),
          ],
        })
      );
    });
    
    pageNum += 2 + Math.ceil(chapter.sections.length / 2);
  });
  
  return paragraphs;
};

// ============ CHAPTER TITLE PAGE ============
const createChapterTitlePage = (chapter: { number: number; title: string }): Paragraph[] => {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 3000, after: 400 },
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
};

// ============ CHAPTER CONTENT PAGES ============
const createChapterContent = (chapter: { number: number; sections: { heading: string; content: string }[] }): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  
  chapter.sections.forEach((section, sectionIdx) => {
    // Section heading
    paragraphs.push(
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
        paragraphs.push(
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
        paragraphs.push(
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
  
  return paragraphs;
};

// ============ MAIN EXPORT FUNCTION ============
export const generateDOCX = async (data: ReportData, filename: string = 'project-report.docx'): Promise<void> => {
  // Create sections for each page with borders
  const sections: any[] = [];
  
  // Page properties with border
  const pagePropertiesWithBorder = {
    page: {
      ...PAGE_MARGINS,
      ...PAGE_BORDERS,
    },
  };
  
  // Cover Page with RGPV Logo
  const coverPageContent = await createCoverPage(data);
  sections.push({
    properties: pagePropertiesWithBorder,
    children: coverPageContent,
  });
  
  // Cover Page with SVCE Logo
  const coverPageSVCEContent = await createCoverPageWithSVCE(data);
  sections.push({
    properties: pagePropertiesWithBorder,
    children: coverPageSVCEContent,
  });
  
  // Certificate Page
  const certificateContent = await createCertificatePage(data);
  sections.push({
    properties: pagePropertiesWithBorder,
    children: certificateContent,
  });
  
  // Declaration Page
  const declarationContent = createDeclarationPage(data);
  sections.push({
    properties: pagePropertiesWithBorder,
    children: declarationContent,
  });
  
  // Approval Page
  const approvalContent = await createApprovalPage(data);
  sections.push({
    properties: pagePropertiesWithBorder,
    children: approvalContent,
  });
  
  // Acknowledgement Page
  const acknowledgementContent = createAcknowledgementPage(data);
  sections.push({
    properties: pagePropertiesWithBorder,
    children: acknowledgementContent,
  });
  
  // Abstract Page
  const abstractContent = createAbstractPage(data);
  sections.push({
    properties: pagePropertiesWithBorder,
    children: abstractContent,
  });
  
  // Table of Contents
  const tocContent = createTableOfContents(data);
  sections.push({
    properties: pagePropertiesWithBorder,
    children: tocContent,
  });
  
  // Chapters
  data.chapters.forEach((chapter) => {
    // Chapter title page
    const chapterTitleContent = createChapterTitlePage(chapter);
    sections.push({
      properties: pagePropertiesWithBorder,
      children: chapterTitleContent,
    });
    
    // Chapter content pages
    const chapterContent = createChapterContent(chapter);
    sections.push({
      properties: pagePropertiesWithBorder,
      children: chapterContent,
    });
  });
  
  const doc = new Document({
    sections: sections,
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
