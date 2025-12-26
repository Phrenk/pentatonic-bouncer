const WORDS = [
  'respirare', 'contemplare', 'ascoltare', 'fluire', 'sostare',
  'attendere', 'accogliere', 'osservare', 'ricordare', 'dimenticare',
  'vagare', 'germogliare', 'radicare', 'fiorire', 'dimorare',
  'scorrere', 'risuonare', 'intrecciare', 'custodire', 'affidarsi',
  'cullare', 'illuminare', 'dissolvere', 'meditare', 'raccogliere',
  'seminare', 'equilibrare', 'pacificare', 'armonizzare', 'svelare',
  'orizzonte', 'silenzio', 'luce', 'ombra', 'respiro',
  'tempo', 'spazio', 'quiete', 'attesa', 'memoria',
  'oblio', 'eco', 'soglia', 'sentiero', 'radice',
  'seme', 'fiore', 'foglia', 'vento', 'acqua',
  'fiume', 'mare', 'riva', 'cielo', 'stella',
  'notte', 'alba', 'crepuscolo', 'equilibrio', 'armonia',
  'pace', 'lentezza', 'profondità', 'vuoto', 'presenza',
  'assenza', 'cura', 'dimora', 'casa', 'giardino',
  'bosco', 'pietra', 'sabbia', 'isola', 'viaggio',
  'ritorno', 'sguardo', 'ascolto', 'parola', 'voce',
  'pelle', 'battito', 'cuore', 'anima', 'spirito',
  'coscienza', 'consapevolezza', 'mistero', 'infinito', 'limite',
  'unità', 'intreccio', 'residenza', 'cammino', 'ritmo',
  'sorgente', 'riflesso', 'carezza', 'abbraccio', 'quietudine',
];

let wordImages: HTMLCanvasElement[] = [];
let shapeLoaded = false;

const wordHistory: number[] = [];
const HISTORY_SIZE = 30;

const DOS_FONT = '"Modern DOS 8x8", "Courier New", Courier, monospace';

function createWordCanvas(word: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  const fontSize = 32;
  ctx.font = `${fontSize}px ${DOS_FONT}`;
  
  const metrics = ctx.measureText(word);
  const textWidth = metrics.width;
  const textHeight = fontSize;
  
  const padding = 4;
  canvas.width = textWidth + padding * 2;
  canvas.height = textHeight + padding * 2;
  
  ctx.font = `${fontSize}px ${DOS_FONT}`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  
  ctx.fillStyle = 'black';
  ctx.fillText(word, padding, padding);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    if (a > 0) {
      pixels[i] = 0;
      pixels[i + 1] = 0;
      pixels[i + 2] = 0;
      pixels[i + 3] = a;
    } else {
      pixels[i + 3] = 0;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

async function waitForFont(): Promise<void> {
  if (document.fonts && document.fonts.load) {
    try {
      await document.fonts.load('32px "Modern DOS 8x8"');
      await document.fonts.ready;
    } catch (e) {
      console.warn('Font loading warning:', e);
    }
  }
  await new Promise(resolve => setTimeout(resolve, 500));
}

export async function loadAndProcessShape(): Promise<void> {
  if (shapeLoaded) return;
  
  try {
    await waitForFont();
    wordImages = WORDS.map(word => createWordCanvas(word));
    shapeLoaded = true;
  } catch (error) {
    console.error('Error creating word images:', error);
    throw error;
  }
}

function getNextWord(): number {
  const windowSize = Math.min(HISTORY_SIZE, WORDS.length - 1);
  const recentWindow = wordHistory.slice(-windowSize);
  
  const available: number[] = [];
  for (let i = 0; i < WORDS.length; i++) {
    if (!recentWindow.includes(i)) {
      available.push(i);
    }
  }
  
  if (available.length === 0) {
    for (let i = 0; i < WORDS.length; i++) {
      available.push(i);
    }
  }
  
  const selected = available[Math.floor(Math.random() * available.length)];
  
  wordHistory.push(selected);
  if (wordHistory.length > HISTORY_SIZE * 2) {
    wordHistory.splice(0, wordHistory.length - HISTORY_SIZE);
  }
  
  return selected;
}

export interface WordAnimation {
  id: number;
  imageIndex: number;
  word: string;
  startTime: number;
  duration: number;
  color: string;
}

let pentagonCenter: { x: number; y: number } = { x: 0, y: 0 };
let pentagonRadius: number = 0;
let innerReferenceWalls: Map<number, { start: { x: number; y: number }; end: { x: number; y: number } }> = new Map();

export function setPentagonCenter(x: number, y: number, radius: number): void {
  pentagonCenter = { x, y };
  pentagonRadius = radius;
}

export function setInnerReferenceWalls(walls: { index: number; start: { x: number; y: number }; end: { x: number; y: number } }[]): void {
  innerReferenceWalls.clear();
  walls.forEach(wall => {
    innerReferenceWalls.set(wall.index, { start: wall.start, end: wall.end });
  });
}

const activeWords: WordAnimation[] = [];
const hiddenOuterWalls: Set<number> = new Set();
const hiddenInnerWalls: Set<number> = new Set();

let animationIdCounter = 0;

const FADE_IN = 4000;
const VIBRATE = 3000;
const HOLD_NO_VIBRATE = 1000;
const FADE_OUT = 4000;
const TOTAL_DURATION = FADE_IN + VIBRATE + HOLD_NO_VIBRATE + FADE_OUT;
const VIBRATION_INTENSITY = 5;

const IMAGE_COLORS = ['#FFFFFF'];

export function startMorph(
  wallIndex: number, 
  wallStart: { x: number; y: number }, 
  wallEnd: { x: number; y: number }
): void {
  const imageIndex = getNextWord();
  const color = IMAGE_COLORS[Math.floor(Math.random() * IMAGE_COLORS.length)];
  
  activeWords.push({
    id: animationIdCounter++,
    imageIndex,
    word: WORDS[imageIndex],
    startTime: performance.now(),
    duration: TOTAL_DURATION,
    color,
  });
  
  hiddenOuterWalls.add(wallIndex);
  
  setTimeout(() => {
    hiddenOuterWalls.delete(wallIndex);
  }, TOTAL_DURATION);
}

export function startInnerMorph(
  wallIndex: number, 
  wallStart: { x: number; y: number }, 
  wallEnd: { x: number; y: number }
): void {
  const imageIndex = getNextWord();
  const color = IMAGE_COLORS[Math.floor(Math.random() * IMAGE_COLORS.length)];
  
  activeWords.push({
    id: animationIdCounter++,
    imageIndex,
    word: WORDS[imageIndex],
    startTime: performance.now(),
    duration: TOTAL_DURATION,
    color,
  });
  
  hiddenInnerWalls.add(wallIndex);
  
  setTimeout(() => {
    hiddenInnerWalls.delete(wallIndex);
  }, TOTAL_DURATION);
}

export function getActiveMorphs(): Map<number, WordAnimation> {
  return new Map();
}

export function getActiveInnerMorphs(): Map<number, WordAnimation> {
  return new Map();
}

export function isWallHidden(wallIndex: number): boolean {
  return hiddenOuterWalls.has(wallIndex);
}

export function isInnerWallHidden(wallIndex: number): boolean {
  return hiddenInnerWalls.has(wallIndex);
}

function colorizeImage(sourceCanvas: HTMLCanvasElement, color: string): HTMLCanvasElement {
  const coloredCanvas = document.createElement('canvas');
  coloredCanvas.width = sourceCanvas.width;
  coloredCanvas.height = sourceCanvas.height;
  const colorCtx = coloredCanvas.getContext('2d')!;
  
  colorCtx.drawImage(sourceCanvas, 0, 0);
  colorCtx.globalCompositeOperation = 'source-in';
  colorCtx.fillStyle = color;
  colorCtx.fillRect(0, 0, coloredCanvas.width, coloredCanvas.height);
  
  return coloredCanvas;
}

function cleanupExpiredWords(): void {
  const now = performance.now();
  while (activeWords.length > 0 && now - activeWords[0].startTime > activeWords[0].duration) {
    activeWords.shift();
  }
}

export function drawMorphingShapes(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
  cleanupExpiredWords();
  
  const leftMargin = 15;
  const topMargin = 30;
  const lineHeight = 56;
  const fontSize = 44;
  
  const now = performance.now();
  
  activeWords.forEach((wordAnim, index) => {
    const elapsed = now - wordAnim.startTime;
    const wordText = wordAnim.word;
    const totalLetters = wordText.length;
    
    let opacity = 1;
    let shouldVibrate = false;
    let visibleLetters = totalLetters;
    
    if (elapsed < FADE_IN) {
      const progress = elapsed / FADE_IN;
      visibleLetters = Math.ceil(progress * totalLetters);
      opacity = 1;
      shouldVibrate = true;
    } else if (elapsed < FADE_IN + VIBRATE) {
      opacity = 1;
      shouldVibrate = true;
    } else if (elapsed < FADE_IN + VIBRATE + HOLD_NO_VIBRATE) {
      opacity = 1;
      shouldVibrate = false;
    } else {
      const fadeOutElapsed = elapsed - FADE_IN - VIBRATE - HOLD_NO_VIBRATE;
      opacity = 1 - (fadeOutElapsed / FADE_OUT);
      shouldVibrate = true;
    }
    
    const x = leftMargin;
    const y = topMargin + index * lineHeight;
    
    let vibrationX = 0;
    let vibrationY = 0;
    if (shouldVibrate) {
      vibrationX = Math.sin(elapsed * 0.08) * VIBRATION_INTENSITY;
      vibrationY = Math.cos(elapsed * 0.11) * VIBRATION_INTENSITY;
    }
    
    const displayText = wordText.substring(0, visibleLetters);
    
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
    ctx.font = `${fontSize}px ${DOS_FONT}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = wordAnim.color;
    
    ctx.fillText(displayText, x + vibrationX, y + vibrationY);
    
    ctx.restore();
  });
  
  if (activeWords.length > 0) {
    const lastWord = activeWords[activeWords.length - 1];
    const lastIndex = activeWords.length - 1;
    const elapsed = now - lastWord.startTime;
    
    const isInFadeOut = elapsed >= FADE_IN + VIBRATE + HOLD_NO_VIBRATE;
    
    if (isInFadeOut) {
      const fadeOutElapsed = elapsed - FADE_IN - VIBRATE - HOLD_NO_VIBRATE;
      const opacity = 1 - (fadeOutElapsed / FADE_OUT);
      
      const x = leftMargin;
      const y = topMargin + lastIndex * lineHeight;
      
      ctx.font = `${fontSize}px ${DOS_FONT}`;
      const wordWidth = ctx.measureText(lastWord.word).width;
      
      const underscoreX = x + wordWidth + 8;
      
      const vibrationX = Math.sin(elapsed * 0.08) * VIBRATION_INTENSITY;
      const vibrationY = Math.cos(elapsed * 0.11) * VIBRATION_INTENSITY;
      
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
      ctx.font = `${fontSize}px ${DOS_FONT}`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillStyle = lastWord.color;
      
      ctx.fillText('_', underscoreX + vibrationX, y + vibrationY);
      
      ctx.restore();
    }
  }
}

export function isShapeLoaded(): boolean {
  return shapeLoaded;
}
