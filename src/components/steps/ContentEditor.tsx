import { useState } from 'react';
import { useReportStore } from '@/store/reportStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  PenLine, 
  Plus, 
  Trash2, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const ContentEditor = () => {
  const { 
    contentMode, 
    setContentMode, 
    reportData, 
    setAbstract,
    setAcknowledgement,
    setChapters,
    setCurrentStep 
  } = useReportStore();
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [openChapters, setOpenChapters] = useState<string[]>(['1']);

  const toggleChapter = (id: string) => {
    setOpenChapters(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const updateSection = (chapterId: string, sectionId: string, content: string) => {
    const updatedChapters = reportData.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          sections: chapter.sections.map(section => 
            section.id === sectionId ? { ...section, content } : section
          )
        };
      }
      return chapter;
    });
    setChapters(updatedChapters);
  };

  const addSection = (chapterId: string) => {
    const updatedChapters = reportData.chapters.map(chapter => {
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
              content: ''
            }
          ]
        };
      }
      return chapter;
    });
    setChapters(updatedChapters);
  };

  const removeSection = (chapterId: string, sectionId: string) => {
    const updatedChapters = reportData.chapters.map(chapter => {
      if (chapter.id === chapterId && chapter.sections.length > 1) {
        return {
          ...chapter,
          sections: chapter.sections.filter(s => s.id !== sectionId)
        };
      }
      return chapter;
    });
    setChapters(updatedChapters);
  };

  const handleNext = () => {
    setCurrentStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Add Content</h2>
        <p className="text-muted-foreground">
          Choose how you want to add content to your report
        </p>
      </div>

      <Tabs value={contentMode} onValueChange={(v) => setContentMode(v as 'ai' | 'manual')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Generate
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            <PenLine className="w-4 h-4" />
            Manual Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6">
          <div className="bg-card rounded-xl border p-6 shadow-soft">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Describe Your Project</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a detailed description of your project. AI will generate content for all chapters.
                </p>
              </div>
              <Textarea
                placeholder="Example: My project is about predicting multiple diseases using machine learning. The system uses patient health parameters like blood pressure, glucose levels, cholesterol, BMI, and age to predict the likelihood of heart disease and diabetes. We implemented Logistic Regression, SVM, Random Forest, and KNN algorithms..."
                className="min-h-[200px]"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <Button className="w-full gap-2" disabled>
                <Sparkles className="w-4 h-4" />
                Generate Content (Coming Soon)
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                AI content generation will be available soon. For now, use the Manual Editor.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          {/* Abstract */}
          <div className="bg-card rounded-xl border p-6 shadow-soft">
            <Label className="text-base font-semibold">Abstract</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              A brief summary of your project (150-300 words)
            </p>
            <Textarea
              placeholder="Write your project abstract here..."
              className="min-h-[150px]"
              value={reportData.abstract}
              onChange={(e) => setAbstract(e.target.value)}
            />
          </div>

          {/* Acknowledgement */}
          <div className="bg-card rounded-xl border p-6 shadow-soft">
            <Label className="text-base font-semibold">Acknowledgement</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              Thank your guides, HOD, principal, and others
            </p>
            <Textarea
              placeholder="Write your acknowledgement here..."
              className="min-h-[150px]"
              value={reportData.acknowledgement}
              onChange={(e) => setAcknowledgement(e.target.value)}
            />
          </div>

          {/* Chapters */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Chapters</Label>
            
            {reportData.chapters.map((chapter) => (
              <Collapsible
                key={chapter.id}
                open={openChapters.includes(chapter.id)}
                onOpenChange={() => toggleChapter(chapter.id)}
              >
                <div className="bg-card rounded-xl border shadow-soft overflow-hidden">
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {chapter.number}
                      </span>
                      <span className="font-semibold">{chapter.title}</span>
                    </div>
                    {openChapters.includes(chapter.id) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="p-4 pt-0 space-y-4">
                      {chapter.sections.map((section) => (
                        <div key={section.id} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-primary">{section.number}</span>
                              <Input
                                className="h-8 w-48 text-sm"
                                value={section.heading}
                                onChange={(e) => {
                                  const updatedChapters = reportData.chapters.map(c => {
                                    if (c.id === chapter.id) {
                                      return {
                                        ...c,
                                        sections: c.sections.map(s =>
                                          s.id === section.id ? { ...s, heading: e.target.value } : s
                                        )
                                      };
                                    }
                                    return c;
                                  });
                                  setChapters(updatedChapters);
                                }}
                              />
                            </div>
                            {chapter.sections.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeSection(chapter.id, section.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <Textarea
                            placeholder={`Enter content for ${section.number} ${section.heading}. Lines starting with "•" or "-" will be treated as bullet points.`}
                            className="min-h-[100px] text-sm"
                            value={section.content}
                            onChange={(e) => updateSection(chapter.id, section.id, e.target.value)}
                          />
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSection(chapter.id)}
                        className="w-full gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Section
                      </Button>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleNext} className="gap-2">
          Preview Report
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContentEditor;
