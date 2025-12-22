const OUTER_IMAGE_PATHS = [
  '/images/mnr_1_1766430619497.jpeg',
  '/images/mnr_2_1766430619497.jpeg',
  '/images/mnr_3__1766430619497.jpeg',
  '/images/mnr_4_1766430619498.jpeg',
  '/images/mnr_5__1766430619498.jpeg',
  '/images/mnr_6_1766430619498.jpeg',
  '/images/mnr_7_1766430619499.jpeg',
  '/images/mnr_8__1766430619499.jpeg',
  '/images/mnr_9__1766430619499.jpeg',
  '/images/mnr_10_1766430619499.jpeg',
];

const INNER_IMAGE_PATHS = [
  '/images/mnr_1_interno__1766432005466.jpeg',
  '/images/mnr_2_interno_1766432005466.jpeg',
  '/images/mnr_3_interno_1766432005467.jpeg',
  '/images/mnr_4_interno_1766432005467.jpeg',
  '/images/mnr_5_interno_1766432005467.jpeg',
];

let outerProcessedImages: HTMLCanvasElement[] = [];
let innerProcessedImages: HTMLCanvasElement[] = [];
let shapeLoaded = false;

const outerHistory: number[] = [];
const innerHistory: number[] = [];
const OUTER_HISTORY_SIZE = 10;
const INNER_HISTORY_SIZE = 5;

function extractBlackParts(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const pixels = imageData.data;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    
    const brightness = (r + g + b) / 3;
    
    if (brightness < 80) {
      pixels[i] = 0;
      pixels[i + 1] = 0;
      pixels[i + 2] = 0;
      pixels[i + 3] = Math.min(255, (80 - brightness) * 4);
    } else {
      pixels[i + 3] = 0;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

async function loadImages(paths: string[]): Promise<HTMLCanvasElement[]> {
  const loadPromises = paths.map((path) => {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const processed = extractBlackParts(img);
        resolve(processed);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
      img.src = path;
    });
  });
  return Promise.all(loadPromises);
}

export async function loadAndProcessShape(): Promise<void> {
  if (shapeLoaded) return;
  
  try {
    const [outer, inner] = await Promise.all([
      loadImages(OUTER_IMAGE_PATHS),
      loadImages(INNER_IMAGE_PATHS),
    ]);
    outerProcessedImages = outer;
    innerProcessedImages = inner;
    shapeLoaded = true;
  } catch (error) {
    console.error('Error loading morph images:', error);
    throw error;
  }
}

function getNextImage(
  history: number[],
  historySize: number,
  imageCount: number
): number {
  const windowSize = Math.min(historySize - 1, imageCount - 1);
  const recentWindow = history.slice(-windowSize);
  
  const available: number[] = [];
  for (let i = 0; i < imageCount; i++) {
    if (!recentWindow.includes(i)) {
      available.push(i);
    }
  }
  
  if (available.length === 0) {
    for (let i = 0; i < imageCount; i++) {
      available.push(i);
    }
  }
  
  const selected = available[Math.floor(Math.random() * available.length)];
  
  history.push(selected);
  if (history.length > historySize * 2) {
    history.splice(0, history.length - historySize);
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
}

const activeOuterMorphs: Map<number, MorphAnimation> = new Map();
const activeInnerMorphs: Map<number, MorphAnimation> = new Map();
const hiddenOuterWalls: Set<number> = new Set();
const hiddenInnerWalls: Set<number> = new Set();

const OUTER_FADE_IN = 2000;
const OUTER_HOLD = 2000;
const OUTER_FADE_OUT = 2000;
const OUTER_TOTAL = OUTER_FADE_IN + OUTER_HOLD + OUTER_FADE_OUT;
const OUTER_VIBRATION = 6;

const INNER_FADE_IN = 1000;
const INNER_HOLD = 2000;
const INNER_FADE_OUT = 1000;
const INNER_TOTAL = INNER_FADE_IN + INNER_HOLD + INNER_FADE_OUT;
const INNER_VIBRATION = 4.5;

const IMAGE_COLORS = ['#FF0000', '#0000FF', '#FFFF00', '#000000', '#800080'];

export function startMorph(
  wallIndex: number, 
  wallStart: { x: number; y: number }, 
  wallEnd: { x: number; y: number }
): void {
  const imageIndex = getNextImage(outerHistory, OUTER_HISTORY_SIZE, outerProcessedImages.length);
  const color = IMAGE_COLORS[Math.floor(Math.random() * IMAGE_COLORS.length)];
  
  activeOuterMorphs.set(wallIndex, {
    wallIndex,
    imageIndex,
    startTime: performance.now(),
    duration: OUTER_TOTAL,
    wallStart,
    wallEnd,
    isInner: false,
    color,
  });
  
  hiddenOuterWalls.add(wallIndex);
}

export function startInnerMorph(
  wallIndex: number, 
  wallStart: { x: number; y: number }, 
  wallEnd: { x: number; y: number }
): void {
  const imageIndex = getNextImage(innerHistory, INNER_HISTORY_SIZE, innerProcessedImages.length);
  
  const color = IMAGE_COLORS[Math.floor(Math.random() * IMAGE_COLORS.length)];
  
  activeInnerMorphs.set(wallIndex, {
    wallIndex,
    imageIndex,
    startTime: performance.now(),
    duration: INNER_TOTAL,
    wallStart,
    wallEnd,
    isInner: true,
    color,
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

// Wall naming convention (clockwise):
// Outer pentagon: PG1=0, PG2=1, PG3=2, PG4=3, PG5=4
// Inner pentagon: PI1=0, PI2=1, PI3=2, PI4=3, PI5=4
// Walls PG4 (index 3) and PI4 (index 3) require 180-degree image rotation

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
  vibrationBase: number
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
  
  const midX = (morph.wallStart.x + morph.wallEnd.x) / 2;
  const midY = (morph.wallStart.y + morph.wallEnd.y) / 2;
  
  const wallDx = morph.wallEnd.x - morph.wallStart.x;
  const wallDy = morph.wallEnd.y - morph.wallStart.y;
  const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
  const wallAngle = Math.atan2(wallDy, wallDx);
  
  const targetHeight = wallLength * 0.5;
  const aspectRatio = shapeCanvas.width / shapeCanvas.height;
  const targetWidth = targetHeight * aspectRatio;
  
  const vibrationIntensity = vibrationMultiplier * vibrationBase;
  const vibrationX = Math.sin(elapsed * 0.08) * vibrationIntensity;
  const vibrationY = Math.cos(elapsed * 0.11) * vibrationIntensity;
  
  // Rotate 180 degrees for wall index 3 (PG4 or PI4) to fix upside-down images
  const extraRotation = morph.wallIndex === 3 ? Math.PI : 0;
  
  // Colorize the image with the assigned color
  const coloredCanvas = colorizeImage(shapeCanvas, morph.color);
  
  ctx.save();
  ctx.translate(midX + vibrationX, midY + vibrationY);
  ctx.rotate(wallAngle + extraRotation);
  
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
    drawMorphAnimation(ctx, morph, outerProcessedImages, OUTER_FADE_IN, OUTER_HOLD, OUTER_FADE_OUT, OUTER_VIBRATION);
  });
  
  Array.from(getActiveInnerMorphs().entries()).forEach(([_, morph]) => {
    drawMorphAnimation(ctx, morph, innerProcessedImages, INNER_FADE_IN, INNER_HOLD, INNER_FADE_OUT, INNER_VIBRATION);
  });
}

export function isShapeLoaded(): boolean {
  return shapeLoaded;
}
