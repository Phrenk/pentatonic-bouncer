import { useState, useCallback, useEffect } from 'react';
import { PentagonCanvas } from '@/components/PentagonCanvas';
import { Controls } from '@/components/Controls';
import { StatusBar } from '@/components/StatusBar';
import { NoteHistory } from '@/components/NoteHistory';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';
import { Music2 } from 'lucide-react';
import { resumeAudioContext, preloadSounds } from '@/lib/audio';

const MAX_HISTORY_LENGTH = 8;

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState(false);

  useEffect(() => {
    preloadSounds().then(() => setSoundsLoaded(true));
  }, []);
  const [speed, setSpeed] = useState(0.19);
  const [volume, setVolume] = useState(0.5);
  const [currentNote, setCurrentNote] = useState('');
  const [bounceCount, setBounceCount] = useState(0);
  const [noteHistory, setNoteHistory] = useState<string[]>([]);

  const handlePlayPause = useCallback(async () => {
    await resumeAudioContext();
    setIsPlaying((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    if (typeof (window as any).resetPentagonBall === 'function') {
      (window as any).resetPentagonBall();
    }
    setNoteHistory([]);
    setCurrentNote('');
  }, []);

  const handleBounce = useCallback((_wallIndex: number, noteLabel: string) => {
    setCurrentNote(noteLabel);
    setNoteHistory((prev) => {
      const newHistory = [...prev, noteLabel];
      if (newHistory.length > MAX_HISTORY_LENGTH) {
        return newHistory.slice(-MAX_HISTORY_LENGTH);
      }
      return newHistory;
    });
  }, []);

  const handleBounceCountChange = useCallback((count: number) => {
    setBounceCount(count);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border h-14 shrink-0">
        <div className="flex items-center gap-2">
          <Music2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">
            Pentatonic Bouncer
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-4 min-h-[50vh] lg:min-h-0">
          <div 
            className="w-full h-full max-w-[600px] max-h-[600px] aspect-square"
            data-testid="container-pentagon"
          >
            <PentagonCanvas
              isPlaying={isPlaying}
              speed={speed}
              volume={volume}
              onBounce={handleBounce}
              onBounceCountChange={handleBounceCountChange}
            />
          </div>
        </div>

        <div className="lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-border bg-card/50">
          <div className="p-4 flex flex-col gap-4">
            <StatusBar
              currentNote={currentNote}
              bounceCount={bounceCount}
              isPlaying={isPlaying}
            />
            
            <Card className="p-4">
              <Controls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
                speed={speed}
                onSpeedChange={setSpeed}
                volume={volume}
                onVolumeChange={setVolume}
              />
            </Card>
            
            <NoteHistory notes={noteHistory} />
            
            <div className="text-xs text-muted-foreground text-center space-y-1 mt-auto pt-4">
              <p>Premi <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Spazio</kbd> per play/pausa</p>
              <p>Premi <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">R</kbd> per resettare</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
