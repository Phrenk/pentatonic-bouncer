import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Volume2, Gauge } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function Controls({
  isPlaying,
  onPlayPause,
  onReset,
  speed,
  onSpeedChange,
  volume,
  onVolumeChange,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto p-4">
      <div className="flex items-center justify-center gap-4">
        <Button
          size="icon"
          variant="outline"
          onClick={onReset}
          className="rounded-full"
          data-testid="button-reset"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        
        <Button
          size="lg"
          onClick={onPlayPause}
          className="rounded-full w-14 h-14"
          aria-pressed={isPlaying}
          aria-label={isPlaying ? "Pausa" : "Riproduci"}
          data-testid="button-play-pause"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              <Gauge className="h-4 w-4" />
              <span>Velocita</span>
            </div>
            <span className="text-sm font-mono text-foreground" data-testid="text-speed-value">
              {speed.toFixed(1)}
            </span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([value]) => onSpeedChange(value)}
            min={0.3}
            max={3}
            step={0.1}
            className="w-full"
            data-testid="slider-speed"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              <Volume2 className="h-4 w-4" />
              <span>Volume</span>
            </div>
            <span className="text-sm font-mono text-foreground" data-testid="text-volume-value">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <Slider
            value={[volume]}
            onValueChange={([value]) => onVolumeChange(value)}
            min={0}
            max={1}
            step={0.05}
            className="w-full"
            data-testid="slider-volume"
          />
        </div>
      </div>
    </div>
  );
}
