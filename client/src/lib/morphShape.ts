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

export interface MorphAnimation {
  wallIndex: number;
  imageIndex: number;
  startTime: number;
  duration: number;
  wallStart: { x: number; y: number };
  wallEnd: { x: number; y: number };
  isInner: boolean;
  color: string;
  targetPosition: { x: number; y: number };
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

const activeOuterMorphs: Map<number, MorphAnimation> = new Map();
const activeInnerMorphs: Map<number, MorphAnimation> = new Map();
const hiddenOuterWalls: Set<number> = new Set();
const hiddenInnerWalls: Set<number> = new Set();

const OUTER_FADE_IN = 2000;
const OUTER_HOLD = 4000;
const OUTER_FADE_OUT = 4000;
const OUTER_TOTAL = OUTER_FADE_IN + OUTER_HOLD + OUTER_FADE_OUT;
const OUTER_VIBRATION = 6;

const INNER_FADE_IN = 1000;
const INNER_HOLD = 4000;
const INNER_FADE_OUT = 3000;
const INNER_TOTAL = INNER_FADE_IN + INNER_HOLD + INNER_FADE_OUT;
const INNER_VIBRATION = 4.5;

const IMAGE_COLORS = ['#FF0000', '#50C878', '#FFA500', '#FFD700', '#800080'];

export function startMorph(
  wallIndex: number, 
  wallStart: { x: number; y: number }, 
  wallEnd: { x: number; y: number }
): void {
  const imageIndex = getNextWord();
  const color = IMAGE_COLORS[Math.floor(Math.random() * IMAGE_COLORS.length)];
  
  const upperHalfY = pentagonCenter.y - pentagonRadius * 0.35;
  
  activeOuterMorphs.set(wallIndex, {
    wallIndex,
    imageIndex,
    startTime: performance.now(),
    duration: OUTER_TOTAL,
    wallStart,
    wallEnd,
    isInner: false,
    color,
    targetPosition: { x: pentagonCenter.x, y: upperHalfY },
  });
  
  hiddenOuterWalls.add(wallIndex);
}

export function startInnerMorph(
  wallIndex: number, 
  wallStart: { x: number; y: number }, 
  wallEnd: { x: number; y: number }
): void {
  const imageIndex = getNextWord();
  
  const color = IMAGE_COLORS[Math.floor(Math.random() * IMAGE_COLORS.length)];
  
  let refWallIndex: number;
  if (wallIndex === 0) {
    refWallIndex = 0;
  } else if (wallIndex === 1 || wallIndex === 2) {
    refWallIndex = 2;
  } else {
    refWallIndex = 4;
  }
  
  const refWall = innerReferenceWalls.get(refWallIndex);
  const useWallStart = refWall ? refWall.start : wallStart;
  const useWallEnd = refWall ? refWall.end : wallEnd;
  
  const lowerHalfY = pentagonCenter.y + pentagonRadius * 0.35;
  
  activeInnerMorphs.set(wallIndex, {
    wallIndex: refWallIndex,
    imageIndex,
    startTime: performance.now(),
    duration: INNER_TOTAL,
    wallStart: useWallStart,
    wallEnd: useWallEnd,
    isInner: true,
    color,
    targetPosition: { x: pentagonCenter.x, y: lowerHalfY },
  });
  
  hiddenInnerWalls.add(wallIndex);
}

export function getActiveMorphs(): Map<number, MorphAnimation> {
  const now = performance.now();
  Array.from(activeOuterMorphs.entries()).forEach(([index, morph]) => {
    if (now - morph.startTime > morph.duration) {
      activeOuterMorphs.delete(index);
      hiddenOuterWalls.delete(index);
    }
  });
  return activeOuterMorphs;
}

export function getActiveInnerMorphs(): Map<number, MorphAnimation> {
  const now = performance.now();
  Array.from(activeInnerMorphs.entries()).forEach(([index, morph]) => {
    if (now - morph.startTime > morph.duration) {
      activeInnerMorphs.delete(index);
      hiddenInnerWalls.delete(index);
    }
  });
  return activeInnerMorphs;
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

function drawMorphAnimation(
  ctx: CanvasRenderingContext2D,
  morph: MorphAnimation,
  images: HTMLCanvasElement[],
  fadeIn: number,
  hold: number,
  fadeOut: number,
  vibrationBase: number,
  sizeMultiplier: number = 1.0
): void {
  const now = performance.now();
  const elapsed = now - morph.startTime;
  
  const shapeCanvas = images[morph.imageIndex];
  if (!shapeCanvas) return;
  
  let opacity = 0;
  let vibrationMultiplier = 1;
  
  if (elapsed < fadeIn) {
    opacity = elapsed / fadeIn;
    vibrationMultiplier = 1;
  } else if (elapsed < fadeIn + hold) {
    opacity = 1;
    vibrationMultiplier = 1;
  } else {
    const fadeOutElapsed = elapsed - fadeIn - hold;
    opacity = 1 - (fadeOutElapsed / fadeOut);
    vibrationMultiplier = 1 - (fadeOutElapsed / fadeOut);
  }
  
  const midX = morph.targetPosition.x;
  const midY = morph.targetPosition.y;
  
  const wallDx = morph.wallEnd.x - morph.wallStart.x;
  const wallDy = morph.wallEnd.y - morph.wallStart.y;
  const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
  
  const targetHeight = wallLength * 0.5 * sizeMultiplier;
  const aspectRatio = shapeCanvas.width / shapeCanvas.height;
  const targetWidth = targetHeight * aspectRatio;
  
  const vibrationIntensity = vibrationMultiplier * vibrationBase;
  const vibrationX = Math.sin(elapsed * 0.08) * vibrationIntensity;
  const vibrationY = Math.cos(elapsed * 0.11) * vibrationIntensity;
  
  const coloredCanvas = colorizeImage(shapeCanvas, morph.color);
  
  ctx.save();
  ctx.translate(midX + vibrationX, midY + vibrationY);
  
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
  
  ctx.drawImage(
    coloredCanvas,
    -targetWidth / 2,
    -targetHeight / 2,
    targetWidth,
    targetHeight
  );
  
  ctx.restore();
}

export function drawMorphingShapes(ctx: CanvasRenderingContext2D): void {
  Array.from(getActiveMorphs().entries()).forEach(([_, morph]) => {
    drawMorphAnimation(ctx, morph, wordImages, OUTER_FADE_IN, OUTER_HOLD, OUTER_FADE_OUT, OUTER_VIBRATION, 1.0);
  });
  
  Array.from(getActiveInnerMorphs().entries()).forEach(([_, morph]) => {
    drawMorphAnimation(ctx, morph, wordImages, INNER_FADE_IN, INNER_HOLD, INNER_FADE_OUT, INNER_VIBRATION, 1.69);
  });
}

export function isShapeLoaded(): boolean {
  return shapeLoaded;
}
