export interface Student {
  id: string;
  name: string;
  enrollmentNumber: string;
}

export interface ProjectDetails {
  projectType: 'Minor Project-I' | 'Minor Project-II' | 'Major Project-I' | 'Major Project-II';
  branch: string;
  projectTitle: string;
  guideName: string;
  guideDesignation: string;
  department: string;
  students: Student[];
  session: string;
  hodName: string;
  hodDepartment: string;
  principalName: string;
}

export interface ChapterSection {
  id: string;
  number: string;
  heading: string;
  content: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  sections: ChapterSection[];
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  location: string;
  university: string;
  logo: string;
}

export interface ReportData {
  college: College | null;
  projectDetails: ProjectDetails;
  chapters: Chapter[];
  abstract: string;
  acknowledgement: string;
  references: string[];
}

export const defaultProjectDetails: ProjectDetails = {
  projectType: 'Major Project-I',
  branch: 'Information Technology',
  projectTitle: '',
  guideName: '',
  guideDesignation: 'Asst. Prof',
  department: 'Information Technology',
  students: [{ id: '1', name: '', enrollmentNumber: '' }],
  session: '2024-2025',
  hodName: '',
  hodDepartment: 'IT Department',
  principalName: '',
};

export const defaultChapters: Chapter[] = [
  {
    id: '1',
    number: 1,
    title: 'INTRODUCTION',
    sections: [
      { id: '1-1', number: '1.1', heading: 'Background', content: '' },
      { id: '1-2', number: '1.2', heading: 'Problem Statement', content: '' },
      { id: '1-3', number: '1.3', heading: 'Objectives', content: '' },
    ],
  },
  {
    id: '2',
    number: 2,
    title: 'LITERATURE SURVEY',
    sections: [
      { id: '2-1', number: '2.1', heading: 'Existing Systems', content: '' },
      { id: '2-2', number: '2.2', heading: 'Related Work', content: '' },
    ],
  },
  {
    id: '3',
    number: 3,
    title: 'SYSTEM ANALYSIS',
    sections: [
      { id: '3-1', number: '3.1', heading: 'Feasibility Study', content: '' },
      { id: '3-2', number: '3.2', heading: 'Requirement Analysis', content: '' },
    ],
  },
  {
    id: '4',
    number: 4,
    title: 'SYSTEM DESIGN & METHODOLOGY',
    sections: [
      { id: '4-1', number: '4.1', heading: 'System Architecture', content: '' },
      { id: '4-2', number: '4.2', heading: 'Database Design', content: '' },
      { id: '4-3', number: '4.3', heading: 'Module Design', content: '' },
    ],
  },
  {
    id: '5',
    number: 5,
    title: 'DATASET & ALGORITHMS',
    sections: [
      { id: '5-1', number: '5.1', heading: 'Dataset Description', content: '' },
      { id: '5-2', number: '5.2', heading: 'Algorithms Used', content: '' },
    ],
  },
  {
    id: '6',
    number: 6,
    title: 'IMPLEMENTATION',
    sections: [
      { id: '6-1', number: '6.1', heading: 'Development Environment', content: '' },
      { id: '6-2', number: '6.2', heading: 'Code Implementation', content: '' },
      { id: '6-3', number: '6.3', heading: 'Testing', content: '' },
    ],
  },
  {
    id: '7',
    number: 7,
    title: 'CONCLUSION & FUTURE SCOPE',
    sections: [
      { id: '7-1', number: '7.1', heading: 'Conclusion', content: '' },
      { id: '7-2', number: '7.2', heading: 'Future Scope', content: '' },
    ],
  },
];

export const colleges: College[] = [
  {
    id: 'svce-indore',
    name: 'Swami Vivekanand College of Engineering',
    shortName: 'SVCE',
    location: 'Indore (M.P)',
    university: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal',
    logo: '/svce-logo.png',
  },
];

export const branches = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

export const projectTypes = [
  'Minor Project-I',
  'Minor Project-II',
  'Major Project-I',
  'Major Project-II',
];

export const sessions = [
  '2024-2025',
  '2025-2026',
  '2026-2027',
  '2027-2028',
];
