import { create } from 'zustand';
import { 
  ReportData, 
  College, 
  ProjectDetails, 
  Chapter, 
  Student,
  ChapterSection,
  SectionImage,
  defaultProjectDetails, 
  defaultChapters 
} from '@/types/report';

interface AIReportContent {
  chapters: Chapter[];
  abstract: string;
  acknowledgement: string;
}

interface ReportStore {
  currentStep: number;
  contentMode: 'ai' | 'manual';
  isAIGenerated: boolean;
  aiPrompt: string;
  reportData: ReportData;
  aiReportContent: AIReportContent;
  
  setCurrentStep: (step: number) => void;
  setContentMode: (mode: 'ai' | 'manual') => void;
  setIsAIGenerated: (value: boolean) => void;
  setAiPrompt: (prompt: string) => void;
  setCollege: (college: College) => void;
  setProjectDetails: (details: Partial<ProjectDetails>) => void;
  addStudent: () => void;
  removeStudent: (id: string) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  setChapters: (chapters: Chapter[]) => void;
  updateChapter: (chapterId: string, data: Partial<Chapter>) => void;
  addChapter: () => void;
  removeChapter: (chapterId: string) => void;
  addSection: (chapterId: string) => void;
  removeSection: (chapterId: string, sectionId: string) => void;
  updateSection: (chapterId: string, sectionId: string, data: Partial<ChapterSection>) => void;
  addImageToSection: (chapterId: string, sectionId: string, image: SectionImage) => void;
  removeImageFromSection: (chapterId: string, sectionId: string, imageId: string) => void;
  addImageToAiSection: (chapterId: string, sectionId: string, image: SectionImage) => void;
  removeImageFromAiSection: (chapterId: string, sectionId: string, imageId: string) => void;
  setAbstract: (abstract: string) => void;
  setAcknowledgement: (acknowledgement: string) => void;
  setReferences: (references: string[]) => void;
  // AI-specific setters
  setAiChapters: (chapters: Chapter[]) => void;
  setAiAbstract: (abstract: string) => void;
  setAiAcknowledgement: (acknowledgement: string) => void;
  // Helper to get active report data based on contentMode
  getActiveReportData: () => ReportData;
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

const initialAIContent: AIReportContent = {
  chapters: [],
  abstract: '',
  acknowledgement: '',
};

export const useReportStore = create<ReportStore>((set, get) => ({
  currentStep: 0,
  contentMode: 'manual',
  isAIGenerated: false,
  aiPrompt: '',
  reportData: initialReportData,
  aiReportContent: initialAIContent,

  setCurrentStep: (step) => set({ currentStep: step }),
  
  setContentMode: (mode) => set({ contentMode: mode }),
  
  setIsAIGenerated: (value) => set({ isAIGenerated: value }),
  setAiPrompt: (prompt) => set({ aiPrompt: prompt }),
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

  addChapter: () => set((state) => {
    const newChapterNum = state.reportData.chapters.length + 1;
    const newChapter: Chapter = {
      id: Date.now().toString(),
      number: newChapterNum,
      title: `CHAPTER ${newChapterNum}`,
      sections: [
        { 
          id: `${Date.now()}-1`, 
          number: `${newChapterNum}.1`, 
          heading: 'New Section', 
          content: '',
          images: []
        }
      ]
    };
    return {
      reportData: {
        ...state.reportData,
        chapters: [...state.reportData.chapters, newChapter]
      }
    };
  }),

  removeChapter: (chapterId) => set((state) => {
    if (state.reportData.chapters.length <= 1) return state;
    const filtered = state.reportData.chapters.filter(c => c.id !== chapterId);
    const renumbered = filtered.map((c, idx) => ({
      ...c,
      number: idx + 1,
      sections: c.sections.map((s, sIdx) => ({
        ...s,
        number: `${idx + 1}.${sIdx + 1}`
      }))
    }));
    return {
      reportData: {
        ...state.reportData,
        chapters: renumbered
      }
    };
  }),

  addSection: (chapterId) => set((state) => ({
    reportData: {
      ...state.reportData,
      chapters: state.reportData.chapters.map(chapter => {
        if (chapter.id === chapterId) {
          const newSectionNum = chapter.sections.length + 1;
          return {
            ...chapter,
            sections: [
              ...chapter.sections,
              {
                id: `${chapterId}-${Date.now()}`,
                number: `${chapter.number}.${newSectionNum}`,
                heading: 'New Section',
                content: '',
                images: []
              }
            ]
          };
        }
        return chapter;
      })
    }
  })),

  removeSection: (chapterId, sectionId) => set((state) => ({
    reportData: {
      ...state.reportData,
      chapters: state.reportData.chapters.map(chapter => {
        if (chapter.id === chapterId && chapter.sections.length > 1) {
          const filtered = chapter.sections.filter(s => s.id !== sectionId);
          const renumbered = filtered.map((s, idx) => ({
            ...s,
            number: `${chapter.number}.${idx + 1}`
          }));
          return {
            ...chapter,
            sections: renumbered
          };
        }
        return chapter;
      })
    }
  })),

  updateSection: (chapterId, sectionId, data) => set((state) => ({
    reportData: {
      ...state.reportData,
      chapters: state.reportData.chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            sections: chapter.sections.map(section =>
              section.id === sectionId ? { ...section, ...data } : section
            )
          };
        }
        return chapter;
      })
    }
  })),

  addImageToSection: (chapterId, sectionId, image) => set((state) => ({
    reportData: {
      ...state.reportData,
      chapters: state.reportData.chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            sections: chapter.sections.map(section =>
              section.id === sectionId 
                ? { ...section, images: [...section.images, image] } 
                : section
            )
          };
        }
        return chapter;
      })
    }
  })),

  removeImageFromSection: (chapterId, sectionId, imageId) => set((state) => ({
    reportData: {
      ...state.reportData,
      chapters: state.reportData.chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            sections: chapter.sections.map(section =>
              section.id === sectionId 
                ? { ...section, images: section.images.filter(img => img.id !== imageId) } 
                : section
            )
          };
        }
        return chapter;
      })
    }
  })),

  addImageToAiSection: (chapterId, sectionId, image) => set((state) => ({
    aiReportContent: {
      ...state.aiReportContent,
      chapters: state.aiReportContent.chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            sections: chapter.sections.map(section =>
              section.id === sectionId 
                ? { ...section, images: [...section.images, image] } 
                : section
            )
          };
        }
        return chapter;
      })
    }
  })),

  removeImageFromAiSection: (chapterId, sectionId, imageId) => set((state) => ({
    aiReportContent: {
      ...state.aiReportContent,
      chapters: state.aiReportContent.chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            sections: chapter.sections.map(section =>
              section.id === sectionId 
                ? { ...section, images: section.images.filter(img => img.id !== imageId) } 
                : section
            )
          };
        }
        return chapter;
      })
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
  
  // AI-specific setters
  setAiChapters: (chapters) => set((state) => ({
    aiReportContent: { ...state.aiReportContent, chapters }
  })),
  
  setAiAbstract: (abstract) => set((state) => ({
    aiReportContent: { ...state.aiReportContent, abstract }
  })),
  
  setAiAcknowledgement: (acknowledgement) => set((state) => ({
    aiReportContent: { ...state.aiReportContent, acknowledgement }
  })),

  getActiveReportData: () => {
    const state = get();
    if (state.contentMode === 'ai') {
      return {
        ...state.reportData,
        chapters: state.aiReportContent.chapters,
        abstract: state.aiReportContent.abstract,
        acknowledgement: state.aiReportContent.acknowledgement,
      };
    }
    return state.reportData;
  },

  resetReport: () => set({
    currentStep: 0,
    contentMode: 'manual',
    isAIGenerated: false,
    aiPrompt: '',
    reportData: initialReportData,
    aiReportContent: initialAIContent,
  }),
}));
