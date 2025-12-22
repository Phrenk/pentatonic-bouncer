const WALL_COLORS_RGB = [
  { r: 255, g: 0, b: 0 },       // Red
  { r: 0, g: 100, b: 255 },     // Blue  
  { r: 255, g: 220, b: 0 },     // Yellow
  { r: 148, g: 0, b: 211 },     // Purple
  { r: 0, g: 180, b: 100 },     // Green
];

let coloredShapes: (HTMLCanvasElement | null)[] = [null, null, null, null, null];
let shapeLoaded = false;
let originalShapeCanvas: HTMLCanvasElement | null = null;

export async function loadAndProcessShape(): Promise<void> {
  if (shapeLoaded) return;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalShapeCanvas = document.createElement('canvas');
      originalShapeCanvas.width = img.width;
      originalShapeCanvas.height = img.height;
      const ctx = originalShapeCanvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const pixels = imageData.data;
      
      for (let i = 0; i < 5; i++) {
        const coloredCanvas = document.createElement('canvas');
        coloredCanvas.width = img.width;
        coloredCanvas.height = img.height;
        const coloredCtx = coloredCanvas.getContext('2d');
        if (!coloredCtx) continue;
        
        const newImageData = coloredCtx.createImageData(img.width, img.height);
        const newPixels = newImageData.data;
        
        for (let j = 0; j < pixels.length; j += 4) {
          const r = pixels[j];
          const g = pixels[j + 1];
          const b = pixels[j + 2];
          const a = pixels[j + 3];
          
          const brightness = (r + g + b) / 3;
          
          if (brightness > 100 && a > 50) {
            const intensity = brightness / 255;
            newPixels[j] = Math.round(WALL_COLORS_RGB[i].r * intensity);
            newPixels[j + 1] = Math.round(WALL_COLORS_RGB[i].g * intensity);
            newPixels[j + 2] = Math.round(WALL_COLORS_RGB[i].b * intensity);
            newPixels[j + 3] = Math.round(a * intensity);
          } else {
            newPixels[j] = 0;
            newPixels[j + 1] = 0;
            newPixels[j + 2] = 0;
            newPixels[j + 3] = 0;
          }
        }
        
        coloredCtx.putImageData(newImageData, 0, 0);
        coloredShapes[i] = coloredCanvas;
      }
      
      shapeLoaded = true;
      resolve();
    };
    img.onerror = () => reject(new Error('Failed to load shape image'));
    img.src = '/images/mnr1_2_2_1766407069164.jpg';
  });
}

export interface MorphAnimation {
  wallIndex: number;
  startTime: number;
  duration: number;
  wallStart: { x: number; y: number };
  wallEnd: { x: number; y: number };
}

const activeMorphs: Map<number, MorphAnimation> = new Map();

export function startMorph(
  wallIndex: number, 
  wallStart: { x: number; y: number }, 
  wallEnd: { x: number; y: number },
  duration: number = 2000
): void {
  activeMorphs.set(wallIndex, {
    wallIndex,
    startTime: performance.now(),
    duration,
    wallStart,
    wallEnd,
  });
}

export function getActiveMorphs(): Map<number, MorphAnimation> {
  const now = performance.now();
  Array.from(activeMorphs.entries()).forEach(([index, morph]) => {
    if (now - morph.startTime > morph.duration) {
      activeMorphs.delete(index);
    }
  });
  return activeMorphs;
}

export function drawMorphingShapes(ctx: CanvasRenderingContext2D): void {
  const now = performance.now();
  
  Array.from(getActiveMorphs().entries()).forEach(([wallIndex, morph]) => {
    const elapsed = now - morph.startTime;
    const progress = Math.min(elapsed / morph.duration, 1);
    
    const shapeCanvas = coloredShapes[wallIndex];
    if (!shapeCanvas) return;
    
    const midX = (morph.wallStart.x + morph.wallEnd.x) / 2;
    const midY = (morph.wallStart.y + morph.wallEnd.y) / 2;
    
    const wallDx = morph.wallEnd.x - morph.wallStart.x;
    const wallDy = morph.wallEnd.y - morph.wallStart.y;
    const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
    const wallAngle = Math.atan2(wallDy, wallDx);
    
    const targetHeight = wallLength * 0.4;
    const aspectRatio = shapeCanvas.width / shapeCanvas.height;
    const targetWidth = targetHeight * aspectRatio;
    
    const morphPhase = Math.min(progress * 3, 1);
    const fadePhase = progress > 0.7 ? (progress - 0.7) / 0.3 : 0;
    
    const vibrationIntensity = (1 - fadePhase) * 3;
    const vibrationX = Math.sin(elapsed * 0.05) * vibrationIntensity;
    const vibrationY = Math.cos(elapsed * 0.07) * vibrationIntensity;
    
    ctx.save();
    ctx.translate(midX + vibrationX, midY + vibrationY);
    ctx.rotate(wallAngle);
    
    ctx.globalAlpha = morphPhase * (1 - fadePhase) * 0.9;
    
    const scaleX = morphPhase;
    const scaleY = morphPhase;
    
    ctx.drawImage(
      shapeCanvas,
      -targetWidth * scaleX / 2,
      -targetHeight * scaleY / 2,
      targetWidth * scaleX,
      targetHeight * scaleY
    );
    
    ctx.restore();
  });
}

export function isShapeLoaded(): boolean {
  return shapeLoaded;
}
