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

export interface SectionImage {
  id: string;
  url: string;
  caption: string;
}

export interface ChapterSection {
  id: string;
  number: string;
  heading: string;
  content: string;
  images: SectionImage[];
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
      { id: '1-1', number: '1.1', heading: 'Introduction', content: '', images: [] },
    ],
  },
  {
    id: '2',
    number: 2,
    title: 'LITERATURE SURVEY',
    sections: [
      { id: '2-1', number: '2.1', heading: 'Literature Survey', content: '', images: [] },
    ],
  },
  {
    id: '3',
    number: 3,
    title: 'SYSTEM ANALYSIS',
    sections: [
      { id: '3-1', number: '3.1', heading: 'System Analysis', content: '', images: [] },
    ],
  },
  {
    id: '4',
    number: 4,
    title: 'SYSTEM DESIGN & METHODOLOGY',
    sections: [
      { id: '4-1', number: '4.1', heading: 'System Design', content: '', images: [] },
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
  {
    id: 'cdgi-indore',
    name: 'Chameli Devi Group of Institutions',
    shortName: 'CDGI',
    location: 'Indore (M.P)',
    university: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal',
    logo: '',
  },
  {
    id: 'iist-indore',
    name: 'Indore Institute of Science & Technology',
    shortName: 'IIST',
    location: 'Indore (M.P)',
    university: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal',
    logo: '',
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
