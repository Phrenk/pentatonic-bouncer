import { Badge } from '@/components/ui/badge';
import { Music, Hash, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatusBarProps {
  currentNote: string;
  bounceCount: number;
  isPlaying: boolean;
}

export function StatusBar({ currentNote, bounceCount, isPlaying }: StatusBarProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isPlaying && !startTime) {
      setStartTime(Date.now() - elapsedTime * 1000);
    } else if (!isPlaying) {
      setStartTime(null);
    }
  }, [isPlaying, startTime, elapsedTime]);

  useEffect(() => {
    if (!isPlaying || !startTime) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, startTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center gap-6 flex-wrap py-4">
      <div className="flex items-center gap-2">
        <Music className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Nota
        </span>
        <span 
          className="text-3xl font-bold font-mono text-foreground min-w-[4ch] text-center"
          data-testid="text-current-note"
        >
          {currentNote || '--'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="gap-1.5">
          <Hash className="h-3 w-3" />
          <span className="font-mono" data-testid="text-bounce-count">{bounceCount}</span>
        </Badge>
        
        <Badge variant="outline" className="gap-1.5">
          <Clock className="h-3 w-3" />
          <span className="font-mono" data-testid="text-elapsed-time">{formatTime(elapsedTime)}</span>
        </Badge>
      </div>
    </div>
  );
}
