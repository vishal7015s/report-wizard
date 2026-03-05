import { useEffect, useState } from 'react';
import { Image, Loader2 } from 'lucide-react';

interface Props {
  diagramType: string;
}

const DiagramGeneratingOverlay = ({ diagramType }: Props) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const label = diagramType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          Generating {label} Diagram{dots}
        </p>
        <p className="text-xs text-muted-foreground">AI is creating your diagram, this takes 10-20 seconds</p>
      </div>
    </div>
  );
};

export default DiagramGeneratingOverlay;
