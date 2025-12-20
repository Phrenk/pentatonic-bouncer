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
  
  const attackTime = 0.1;
  const sustainTime = 2.5;
  const releaseTime = 1.5;
  const totalDuration = attackTime + sustainTime + releaseTime;
  
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume * 0.15, ctx.currentTime + attackTime);
  gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime + attackTime + sustainTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + totalDuration);
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + totalDuration);
}

export function getNoteLabel(wallIndex: number): string {
  return PENTATONIC_NOTES[wallIndex % PENTATONIC_NOTES.length].note;
}

export function getAllNotes(): typeof PENTATONIC_NOTES {
  return PENTATONIC_NOTES;
}
