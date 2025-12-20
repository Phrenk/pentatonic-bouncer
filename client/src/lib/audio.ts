let audioContext: AudioContext | null = null;

const PENTATONIC_NOTES = [
  { note: 'C4', frequency: 261.63 },
  { note: 'D4', frequency: 293.66 },
  { note: 'E4', frequency: 329.63 },
  { note: 'G4', frequency: 392.00 },
  { note: 'A4', frequency: 440.00 },
];

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function resumeAudioContext(): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    return ctx.resume();
  }
  return Promise.resolve();
}

export function playNote(wallIndex: number, volume: number = 0.5): void {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const noteData = PENTATONIC_NOTES[wallIndex % PENTATONIC_NOTES.length];
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(noteData.frequency, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.8);
}

export function getNoteLabel(wallIndex: number): string {
  return PENTATONIC_NOTES[wallIndex % PENTATONIC_NOTES.length].note;
}

export function getAllNotes(): typeof PENTATONIC_NOTES {
  return PENTATONIC_NOTES;
}
