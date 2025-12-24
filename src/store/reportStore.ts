import { create } from 'zustand';
import { 
  ReportData, 
  College, 
  ProjectDetails, 
  Chapter, 
  Student,
  defaultProjectDetails, 
  defaultChapters 
} from '@/types/report';

interface ReportStore {
  currentStep: number;
  contentMode: 'ai' | 'manual';
  reportData: ReportData;
  
  setCurrentStep: (step: number) => void;
  setContentMode: (mode: 'ai' | 'manual') => void;
  setCollege: (college: College) => void;
  setProjectDetails: (details: Partial<ProjectDetails>) => void;
  addStudent: () => void;
  removeStudent: (id: string) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  setChapters: (chapters: Chapter[]) => void;
  updateChapter: (chapterId: string, data: Partial<Chapter>) => void;
  setAbstract: (abstract: string) => void;
  setAcknowledgement: (acknowledgement: string) => void;
  setReferences: (references: string[]) => void;
  resetReport: () => void;
}

const initialReportData: ReportData = {
  college: null,
  projectDetails: defaultProjectDetails,
  chapters: defaultChapters,
  abstract: '',
  acknowledgement: '',
  references: [],
};

export const useReportStore = create<ReportStore>((set) => ({
  currentStep: 0,
  contentMode: 'manual',
  reportData: initialReportData,

  setCurrentStep: (step) => set({ currentStep: step }),
  
  setContentMode: (mode) => set({ contentMode: mode }),
  
  setCollege: (college) => set((state) => ({
    reportData: { ...state.reportData, college }
  })),
  
  setProjectDetails: (details) => set((state) => ({
    reportData: {
      ...state.reportData,
      projectDetails: { ...state.reportData.projectDetails, ...details }
    }
  })),
  
  addStudent: () => set((state) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name: '',
      enrollmentNumber: '',
    };
    return {
      reportData: {
        ...state.reportData,
        projectDetails: {
          ...state.reportData.projectDetails,
          students: [...state.reportData.projectDetails.students, newStudent]
        }
      }
    };
  }),
  
  removeStudent: (id) => set((state) => ({
    reportData: {
      ...state.reportData,
      projectDetails: {
        ...state.reportData.projectDetails,
        students: state.reportData.projectDetails.students.filter(s => s.id !== id)
      }
    }
  })),
  
  updateStudent: (id, data) => set((state) => ({
    reportData: {
      ...state.reportData,
      projectDetails: {
        ...state.reportData.projectDetails,
        students: state.reportData.projectDetails.students.map(s => 
          s.id === id ? { ...s, ...data } : s
        )
      }
    }
  })),
  
  setChapters: (chapters) => set((state) => ({
    reportData: { ...state.reportData, chapters }
  })),
  
  updateChapter: (chapterId, data) => set((state) => ({
    reportData: {
      ...state.reportData,
      chapters: state.reportData.chapters.map(c => 
        c.id === chapterId ? { ...c, ...data } : c
      )
    }
  })),
  
  setAbstract: (abstract) => set((state) => ({
    reportData: { ...state.reportData, abstract }
  })),
  
  setAcknowledgement: (acknowledgement) => set((state) => ({
    reportData: { ...state.reportData, acknowledgement }
  })),
  
  setReferences: (references) => set((state) => ({
    reportData: { ...state.reportData, references }
  })),
  
  resetReport: () => set({
    currentStep: 0,
    contentMode: 'manual',
    reportData: initialReportData,
  }),
}));
