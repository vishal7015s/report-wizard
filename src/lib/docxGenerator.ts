import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
} from 'docx';
import { saveAs } from 'file-saver';
import { ReportData } from '@/types/report';

const FONT_NAME = 'Times New Roman';

const createCoverPage = (data: ReportData): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  
  // University name
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: data.college?.university || 'Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal',
          bold: true,
          size: 28,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // College name
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: data.college?.name || 'Swami Vivekanand College of Engineering',
          bold: true,
          size: 32,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // Project Type
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: `A ${data.projectDetails.projectType} Report`,
          size: 28,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // "on"
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'on',
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // Project Title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `"${data.projectDetails.projectTitle}"`,
          bold: true,
          size: 32,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // Submitted By
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: 'Submitted By:',
          bold: true,
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // Students
  data.projectDetails.students.forEach((student) => {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `${student.name} (${student.enrollmentNumber})`,
            size: 24,
            font: FONT_NAME,
          }),
        ],
      })
    );
  });
  
  // Guide
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: 'Under the Guidance of:',
          bold: true,
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${data.projectDetails.guideName}`,
          size: 24,
          font: FONT_NAME,
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
          text: data.projectDetails.guideDesignation,
          size: 22,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // Department
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: `Department of ${data.projectDetails.department}`,
          bold: true,
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // Session
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Session: ${data.projectDetails.session}`,
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // Page break
  paragraphs.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );
  
  return paragraphs;
};

const createCertificatePage = (data: ReportData): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'CERTIFICATE',
          bold: true,
          size: 32,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  const studentNames = data.projectDetails.students.map(s => s.name).join(', ');
  const enrollments = data.projectDetails.students.map(s => s.enrollmentNumber).join(', ');
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 400, line: 360 },
      children: [
        new TextRun({
          text: `This is to certify that the ${data.projectDetails.projectType} entitled "${data.projectDetails.projectTitle}" has been successfully completed by ${studentNames} bearing enrollment number(s) ${enrollments} of ${data.projectDetails.branch} branch in partial fulfillment for the award of Bachelor of Engineering degree from ${data.college?.university || 'Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal'}.`,
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 600, line: 360 },
      children: [
        new TextRun({
          text: 'The matter presented in this report has not been submitted elsewhere for the award of any other degree.',
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // Signatures
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 800, after: 100 },
      children: [
        new TextRun({
          text: data.projectDetails.guideName,
          bold: true,
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'Project Guide',
          size: 22,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 400, after: 100 },
      children: [
        new TextRun({
          text: data.projectDetails.hodName,
          bold: true,
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'Head of Department',
          size: 22,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 400, after: 100 },
      children: [
        new TextRun({
          text: data.projectDetails.principalName,
          bold: true,
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'Principal',
          size: 22,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );
  
  return paragraphs;
};

const createDeclarationPage = (data: ReportData): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'CANDIDATE DECLARATION',
          bold: true,
          size: 32,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 400, line: 360 },
      children: [
        new TextRun({
          text: `We hereby declare that the work presented in this ${data.projectDetails.projectType} report entitled "${data.projectDetails.projectTitle}" is an authentic record of our own work carried out under the supervision of ${data.projectDetails.guideName}, ${data.projectDetails.guideDesignation}, Department of ${data.projectDetails.department}, ${data.college?.name || 'Swami Vivekanand College of Engineering'}, ${data.college?.location || 'Indore (M.P)'}.`,
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 600, line: 360 },
      children: [
        new TextRun({
          text: 'The matter embodied in this project report has not been submitted elsewhere for the award of any other degree or diploma.',
          size: 24,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
  // Student signatures
  data.projectDetails.students.forEach((student) => {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: student.name,
            bold: true,
            size: 24,
            font: FONT_NAME,
          }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: student.enrollmentNumber,
            size: 22,
            font: FONT_NAME,
          }),
        ],
      })
    );
  });
  
  paragraphs.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );
  
  return paragraphs;
};

const createAcknowledgementPage = (data: ReportData): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'ACKNOWLEDGEMENT',
          bold: true,
          size: 32,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
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
  
  paragraphs.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );
  
  return paragraphs;
};

const createAbstractPage = (data: ReportData): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'ABSTRACT',
          bold: true,
          size: 32,
          font: FONT_NAME,
        }),
      ],
    })
  );
  
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
  
  paragraphs.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );
  
  return paragraphs;
};

const createChapterContent = (data: ReportData): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  
  data.chapters.forEach((chapter) => {
    // Chapter title
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 400 },
        children: [
          new TextRun({
            text: `CHAPTER ${chapter.number}`,
            bold: true,
            size: 32,
            font: FONT_NAME,
          }),
        ],
      })
    );
    
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: chapter.title.toUpperCase(),
            bold: true,
            size: 28,
            font: FONT_NAME,
          }),
        ],
      })
    );
    
    // Sections
    chapter.sections.forEach((section, sectionIdx) => {
      // Section heading
      paragraphs.push(
        new Paragraph({
          spacing: { before: 400, after: 200 },
          children: [
            new TextRun({
              text: `${chapter.number}.${sectionIdx + 1} ${section.heading}`,
              bold: true,
              size: 26,
              font: FONT_NAME,
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
    
    // Page break after each chapter
    paragraphs.push(
      new Paragraph({
        children: [new PageBreak()],
      })
    );
  });
  
  return paragraphs;
};

export const generateDOCX = async (data: ReportData, filename: string = 'project-report.docx'): Promise<void> => {
  const allParagraphs: Paragraph[] = [];
  
  // Add all sections
  allParagraphs.push(...createCoverPage(data));
  allParagraphs.push(...createCertificatePage(data));
  allParagraphs.push(...createDeclarationPage(data));
  allParagraphs.push(...createAcknowledgementPage(data));
  allParagraphs.push(...createAbstractPage(data));
  allParagraphs.push(...createChapterContent(data));
  
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1800, // 1.25 inch for binding
            },
          },
        },
        children: allParagraphs,
      },
    ],
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
