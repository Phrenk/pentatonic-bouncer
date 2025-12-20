import { Badge } from '@/components/ui/badge';

interface NoteHistoryProps {
  notes: string[];
}

const NOTE_COLORS: Record<string, string> = {
  'C4': 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  'D4': 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  'E4': 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  'G4': 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  'A4': 'bg-chart-5/20 text-chart-5 border-chart-5/30',
};

export function NoteHistory({ notes }: NoteHistoryProps) {
  if (notes.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-2 overflow-hidden">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0">
        Ultime note:
      </span>
      <div className="flex gap-1.5 flex-wrap justify-center">
        {notes.map((note, index) => (
          <Badge
            key={`${note}-${index}`}
            variant="outline"
            className={`font-mono text-xs transition-all duration-200 ${NOTE_COLORS[note] || ''}`}
            style={{
              opacity: 0.5 + (index / notes.length) * 0.5,
              transform: `scale(${0.85 + (index / notes.length) * 0.15})`,
            }}
          >
            {note}
          </Badge>
        ))}
      </div>
    </div>
  );
}
