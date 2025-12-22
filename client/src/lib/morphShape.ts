const IMAGE_PATHS = [
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

let processedImages: HTMLCanvasElement[] = [];
let shapeLoaded = false;

const recentImageHistory: number[] = [];
const HISTORY_SIZE = 10;

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

export async function loadAndProcessShape(): Promise<void> {
  if (shapeLoaded) return;
  
  const loadPromises = IMAGE_PATHS.map((path) => {
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
  
  try {
    processedImages = await Promise.all(loadPromises);
    shapeLoaded = true;
  } catch (error) {
    console.error('Error loading morph images:', error);
    throw error;
  }
}

function getRandomImageIndex(): number {
  const availableIndices: number[] = [];
  
  for (let i = 0; i < processedImages.length; i++) {
    if (!recentImageHistory.includes(i)) {
      availableIndices.push(i);
    }
  }
  
  if (availableIndices.length === 0) {
    recentImageHistory.length = 0;
    for (let i = 0; i < processedImages.length; i++) {
      availableIndices.push(i);
    }
  }
  
  const selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  
  recentImageHistory.push(selectedIndex);
  if (recentImageHistory.length > HISTORY_SIZE) {
    recentImageHistory.shift();
  }
  
  return selectedIndex;
}

export interface MorphAnimation {
  wallIndex: number;
  imageIndex: number;
  startTime: number;
  duration: number;
  wallStart: { x: number; y: number };
  wallEnd: { x: number; y: number };
}

const activeMorphs: Map<number, MorphAnimation> = new Map();
const hiddenWalls: Set<number> = new Set();

const FADE_IN_DURATION = 2000;
const HOLD_DURATION = 2000;
const FADE_OUT_DURATION = 2000;
const TOTAL_DURATION = FADE_IN_DURATION + HOLD_DURATION + FADE_OUT_DURATION;

export function startMorph(
  wallIndex: number, 
  wallStart: { x: number; y: number }, 
  wallEnd: { x: number; y: number }
): void {
  const imageIndex = getRandomImageIndex();
  
  activeMorphs.set(wallIndex, {
    wallIndex,
    imageIndex,
    startTime: performance.now(),
    duration: TOTAL_DURATION,
    wallStart,
    wallEnd,
  });
  
  hiddenWalls.add(wallIndex);
}

export function getActiveMorphs(): Map<number, MorphAnimation> {
  const now = performance.now();
  Array.from(activeMorphs.entries()).forEach(([index, morph]) => {
    if (now - morph.startTime > morph.duration) {
      activeMorphs.delete(index);
      hiddenWalls.delete(index);
    }
  });
  return activeMorphs;
}

export function isWallHidden(wallIndex: number): boolean {
  return hiddenWalls.has(wallIndex);
}

export function drawMorphingShapes(ctx: CanvasRenderingContext2D): void {
  const now = performance.now();
  
  Array.from(getActiveMorphs().entries()).forEach(([_, morph]) => {
    const elapsed = now - morph.startTime;
    
    const shapeCanvas = processedImages[morph.imageIndex];
    if (!shapeCanvas) return;
    
    let opacity = 0;
    let vibrationMultiplier = 1;
    
    if (elapsed < FADE_IN_DURATION) {
      opacity = elapsed / FADE_IN_DURATION;
      vibrationMultiplier = 1;
    } else if (elapsed < FADE_IN_DURATION + HOLD_DURATION) {
      opacity = 1;
      vibrationMultiplier = 1;
    } else {
      const fadeOutElapsed = elapsed - FADE_IN_DURATION - HOLD_DURATION;
      opacity = 1 - (fadeOutElapsed / FADE_OUT_DURATION);
      vibrationMultiplier = 1 - (fadeOutElapsed / FADE_OUT_DURATION);
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
    
    const vibrationIntensity = vibrationMultiplier * 6;
    const vibrationX = Math.sin(elapsed * 0.08) * vibrationIntensity;
    const vibrationY = Math.cos(elapsed * 0.11) * vibrationIntensity;
    
    ctx.save();
    ctx.translate(midX + vibrationX, midY + vibrationY);
    ctx.rotate(wallAngle);
    
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
    
    ctx.drawImage(
      shapeCanvas,
      -targetWidth / 2,
      -targetHeight / 2,
      targetWidth,
      targetHeight
    );
    
    ctx.restore();
  });
}

export function isShapeLoaded(): boolean {
  return shapeLoaded;
}
