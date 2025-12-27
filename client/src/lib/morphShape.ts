const VERBI = [
  'contemplare', 'ascoltare', 'fluire', 'sostare', 'attendere',
  'accogliere', 'osservare', 'ricordare', 'dimenticare', 'vagare',
  'germogliare', 'radicare', 'fiorire', 'dimorare', 'scorrere',
  'risuonare', 'custodire', 'affidarsi', 'cullare', 'illuminare',
  'dissolvere', 'meditare', 'raccogliere', 'seminare', 'equilibrare',
  'pacificare', 'armonizzare', 'svelare', 'svanire', 'fluttuare',
  'trasfigurare', 'corrodere', 'trascendere', 'invocare', 'dischiudere',
  'placare', 'distendere', 'sospendere', 'inseguire', 'sciogliere',
  'ricomporre', 'erodere', 'vibrare', 'desiderare', 'comprendere',
  'riconoscere', 'scavare', 'sprofondare', 'scegliere', 'evadere',
  'tendere', 'anelare', 'rivelare', 'bruciare', 'tacere', 'allontanare'
];

const SOSTANTIVI = [
  'silenzio', 'luce', 'ombra', 'respiro', 'tempo', 'spazio', 'quiete',
  'attesa', 'memoria', 'oblio', 'eco', 'soglia', 'sentiero', 'radice',
  'seme', 'fiore', 'vento', 'acqua', 'fiume', 'mare', 'riva', 'cielo',
  'stella', 'notte', 'alba', 'crepuscolo', 'equilibrio', 'armonia',
  'pace', 'lentezza', 'vuoto', 'presenza', 'assenza', 'cura', 'dimora',
  'casa', 'pietra', 'sabbia', 'isola', 'viaggio', 'ritorno', 'sguardo',
  'ascolto', 'parola', 'voce', 'pelle', 'battito', 'cuore', 'anima',
  'spirito', 'coscienza', 'consapevolezza', 'mistero', 'infinito', 'limite',
  'cammino', 'ritmo', 'sorgente', 'riflesso', 'carezza', 'abbraccio',
  'quietudine', 'veglia', 'inabissarsi', 'miraggio', 'deragliare',
  'fenditura', 'visione', 'smarrimento', 'abisso', 'crepa', 'cenere',
  'deriva', 'rovina', 'essenza', 'assoluto', 'enigma', 'rivelazione',
  'mancanza', 'spinta', 'richiamo', 'varco', 'esito', 'approdo',
  'risposta', 'marea', 'bosco', 'corrente', 'chiarezza', 'risonanza',
  'intuizione', 'fiamma', 'fuoco', 'slancio', 'ferita', 'eccesso',
  'vertigine', 'senso', 'segreto', 'origine', 'strato', 'fondale',
  'interiore', 'pausa', 'intervallo', 'apertura', 'cesura', 'volo',
  'promessa', 'lontananza', 'direzione', 'distacco', 'margine', 'altrove',
  'nostalgia'
];

const AVVERBI_AZIONE = [
  'silenziosamente', 'gradualmente', 'profondamente', 'intimamente',
  'segretamente', 'naturalmente', 'inavvertitamente', 'dolcemente',
  'oscuramente', 'improvvisamente', 'continuamente', 'interiormente',
  'separatamente', 'liberamente'
];

const AVVERBI_NON_AZIONE = [
  'vicino', 'oltre', 'dentro', 'insieme', 'solo', 'altrove', 'dovunque',
  'ancora', 'sempre', 'mai', 'appena', 'ora', 'domani', 'oggi'
];

const AGGETTIVI = [
  'latente', 'profondo', 'sottile', 'remoto', 'interiore', 'vasto',
  'fragile', 'opaco', 'illuminato', 'sospeso', 'nudo', 'invisibile',
  'irrisolto', 'denso', 'mobile', 'instabile', 'primordiale', 'essenziale',
  'segreto', 'quieto', 'ardente', 'incosapevole', 'incompiuto', 'obliquo',
  'intuitivo', 'notturno', 'inerme', 'leggero', 'aperto'
];

type WordCategory = 'verbo' | 'sostantivo' | 'avverbio_azione' | 'avverbio_non_azione' | 'aggettivo';

interface SeriesStep {
  category: WordCategory;
}

interface Series {
  steps: SeriesStep[];
  hasComposition: boolean;
}

const SERIES: Series[] = [
  { steps: [{ category: 'verbo' }, { category: 'sostantivo' }], hasComposition: false },
  { steps: [{ category: 'verbo' }, { category: 'sostantivo' }, { category: 'sostantivo' }], hasComposition: true },
  { steps: [{ category: 'sostantivo' }, { category: 'sostantivo' }], hasComposition: false },
  { steps: [{ category: 'avverbio_azione' }, { category: 'verbo' }, { category: 'sostantivo' }], hasComposition: true },
  { steps: [{ category: 'verbo' }, { category: 'avverbio_azione' }], hasComposition: false },
  { steps: [{ category: 'verbo' }, { category: 'aggettivo' }], hasComposition: true },
];

let currentSeriesIndex = 0;
let currentStepIndex = 0;
let currentSeriesWords: string[] = [];

const categoryHistory: Map<WordCategory, number[]> = new Map();
const HISTORY_SIZE = 10;

function getCategoryWords(category: WordCategory): string[] {
  switch (category) {
    case 'verbo': return VERBI;
    case 'sostantivo': return SOSTANTIVI;
    case 'avverbio_azione': return AVVERBI_AZIONE;
    case 'avverbio_non_azione': return AVVERBI_NON_AZIONE;
    case 'aggettivo': return AGGETTIVI;
  }
}

function getNextWordFromCategory(category: WordCategory): string {
  const words = getCategoryWords(category);
  const history = categoryHistory.get(category) || [];
  
  const available: number[] = [];
  for (let i = 0; i < words.length; i++) {
    if (!history.includes(i)) {
      available.push(i);
    }
  }
  
  if (available.length === 0) {
    for (let i = 0; i < words.length; i++) {
      available.push(i);
    }
    categoryHistory.set(category, []);
  }
  
  const selected = available[Math.floor(Math.random() * available.length)];
  
  const newHistory = [...history, selected];
  if (newHistory.length > HISTORY_SIZE) {
    newHistory.shift();
  }
  categoryHistory.set(category, newHistory);
  
  return words[selected];
}

function getNextWordInSeries(): { word: string; isLastInSeries: boolean; seriesHasComposition: boolean; seriesWords: string[] } {
  const series = SERIES[currentSeriesIndex];
  const step = series.steps[currentStepIndex];
  
  let category = step.category;
  if (category === 'avverbio_azione' && currentSeriesIndex === 4 && currentStepIndex === 1) {
    category = Math.random() < 0.5 ? 'avverbio_azione' : 'avverbio_non_azione';
  }
  
  const word = getNextWordFromCategory(category);
  currentSeriesWords.push(word);
  
  const isLastInSeries = currentStepIndex === series.steps.length - 1;
  const seriesWords = [...currentSeriesWords];
  
  currentStepIndex++;
  
  if (currentStepIndex >= series.steps.length) {
    currentStepIndex = 0;
    currentSeriesIndex = (currentSeriesIndex + 1) % SERIES.length;
    currentSeriesWords = [];
  }
  
  return { word, isLastInSeries, seriesHasComposition: series.hasComposition, seriesWords };
}

let wordImages: HTMLCanvasElement[] = [];
let shapeLoaded = false;

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
    shapeLoaded = true;
  } catch (error) {
    console.error('Error loading fonts:', error);
    throw error;
  }
}

export interface WordAnimation {
  id: number;
  word: string;
  startTime: number;
  duration: number;
  color: string;
  isComposition?: boolean;
  compositionWords?: string[];
}

let pentagonCenter: { x: number; y: number } = { x: 0, y: 0 };
let pentagonRadius: number = 0;
let innerReferenceWalls: Map<number, { start: { x: number; y: number }; end: { x: number; y: number } }> = new Map();
let outerReferenceWalls: Map<number, { start: { x: number; y: number }; end: { x: number; y: number } }> = new Map();
const wordOverlapHiddenOuter: Set<number> = new Set();
const wordOverlapHiddenInner: Set<number> = new Set();

export function setPentagonCenter(x: number, y: number, radius: number): void {
  pentagonCenter = { x, y };
  pentagonRadius = radius;
}

export function setOuterReferenceWalls(walls: { index: number; start: { x: number; y: number }; end: { x: number; y: number } }[]): void {
  outerReferenceWalls.clear();
  walls.forEach(wall => {
    outerReferenceWalls.set(wall.index, { start: wall.start, end: wall.end });
  });
}

export function setInnerReferenceWalls(walls: { index: number; start: { x: number; y: number }; end: { x: number; y: number } }[]): void {
  innerReferenceWalls.clear();
  walls.forEach(wall => {
    innerReferenceWalls.set(wall.index, { start: wall.start, end: wall.end });
  });
}

function lineIntersectsRect(x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rw: number, rh: number): boolean {
  function lineIntersectsLine(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (Math.abs(denom) < 0.0001) return false;
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
  }
  
  if (x1 >= rx && x1 <= rx + rw && y1 >= ry && y1 <= ry + rh) return true;
  if (x2 >= rx && x2 <= rx + rw && y2 >= ry && y2 <= ry + rh) return true;
  
  if (lineIntersectsLine(x1, y1, x2, y2, rx, ry, rx + rw, ry)) return true;
  if (lineIntersectsLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh)) return true;
  if (lineIntersectsLine(x1, y1, x2, y2, rx + rw, ry + rh, rx, ry + rh)) return true;
  if (lineIntersectsLine(x1, y1, x2, y2, rx, ry + rh, rx, ry)) return true;
  
  return false;
}

export function isWallHiddenByWordOverlap(wallIndex: number): boolean {
  return wordOverlapHiddenOuter.has(wallIndex);
}

export function isInnerWallHiddenByWordOverlap(wallIndex: number): boolean {
  return wordOverlapHiddenInner.has(wallIndex);
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

const COMPOSITION_FADE_IN = 4000;
const COMPOSITION_VIBRATE = 3000;
const COMPOSITION_HOLD = 3000;
const COMPOSITION_FADE_OUT = 4000;
const COMPOSITION_TOTAL = COMPOSITION_FADE_IN + COMPOSITION_VIBRATE + COMPOSITION_HOLD + COMPOSITION_FADE_OUT;

const IMAGE_COLORS = ['#FFFFFF'];

let pendingComposition: { words: string[]; triggerTime: number } | null = null;

export function startMorph(
  wallIndex: number, 
  wallStart: { x: number; y: number }, 
  wallEnd: { x: number; y: number }
): void {
  const { word, isLastInSeries, seriesHasComposition, seriesWords } = getNextWordInSeries();
  const color = IMAGE_COLORS[Math.floor(Math.random() * IMAGE_COLORS.length)];
  
  activeWords.push({
    id: animationIdCounter++,
    word,
    startTime: performance.now(),
    duration: TOTAL_DURATION,
    color,
  });
  
  if (isLastInSeries && seriesHasComposition) {
    pendingComposition = {
      words: seriesWords,
      triggerTime: performance.now() + TOTAL_DURATION
    };
  }
  
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
  const { word, isLastInSeries, seriesHasComposition, seriesWords } = getNextWordInSeries();
  const color = IMAGE_COLORS[Math.floor(Math.random() * IMAGE_COLORS.length)];
  
  activeWords.push({
    id: animationIdCounter++,
    word,
    startTime: performance.now(),
    duration: TOTAL_DURATION,
    color,
  });
  
  if (isLastInSeries && seriesHasComposition) {
    pendingComposition = {
      words: seriesWords,
      triggerTime: performance.now() + TOTAL_DURATION
    };
  }
  
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

export function hideOuterWall(wallIndex: number): void {
  hiddenOuterWalls.add(wallIndex);
  
  setTimeout(() => {
    hiddenOuterWalls.delete(wallIndex);
  }, TOTAL_DURATION);
}

export function hideInnerWall(wallIndex: number): void {
  hiddenInnerWalls.add(wallIndex);
  
  setTimeout(() => {
    hiddenInnerWalls.delete(wallIndex);
  }, TOTAL_DURATION);
}

export function isShapeLoaded(): boolean {
  return shapeLoaded;
}

function cleanupExpiredWords(): void {
  const now = performance.now();
  while (activeWords.length > 0 && now - activeWords[0].startTime > activeWords[0].duration) {
    activeWords.shift();
  }
}

function checkPendingComposition(): void {
  const now = performance.now();
  if (pendingComposition && now >= pendingComposition.triggerTime) {
    activeWords.push({
      id: animationIdCounter++,
      word: pendingComposition.words.join(' '),
      startTime: now,
      duration: COMPOSITION_TOTAL,
      color: '#FFFFFF',
      isComposition: true,
      compositionWords: pendingComposition.words
    });
    pendingComposition = null;
  }
}

export function drawMorphingShapes(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
  cleanupExpiredWords();
  checkPendingComposition();
  
  const leftMargin = 15;
  const topMargin = 30;
  const lineHeight = 32;
  const fontSize = 24;
  
  ctx.font = `${fontSize}px ${DOS_FONT}`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  
  const now = performance.now();
  let yOffset = topMargin;
  
  wordOverlapHiddenOuter.clear();
  wordOverlapHiddenInner.clear();
  
  const wordBounds: { x: number; y: number; width: number; height: number }[] = [];
  let tempY = topMargin;
  for (const anim of activeWords) {
    const elapsed = now - anim.startTime;
    if (elapsed < anim.duration) {
      let displayText = anim.isComposition && anim.compositionWords 
        ? anim.compositionWords.join(' ') 
        : anim.word;
      displayText += '_';
      const textWidth = ctx.measureText(displayText).width;
      wordBounds.push({
        x: leftMargin - 5,
        y: tempY - 5,
        width: textWidth + 10,
        height: fontSize + 10
      });
    }
    tempY += lineHeight;
  }
  
  for (const bounds of wordBounds) {
    outerReferenceWalls.forEach((wall, index) => {
      if (lineIntersectsRect(wall.start.x, wall.start.y, wall.end.x, wall.end.y, bounds.x, bounds.y, bounds.width, bounds.height)) {
        wordOverlapHiddenOuter.add(index);
      }
    });
    innerReferenceWalls.forEach((wall, index) => {
      if (lineIntersectsRect(wall.start.x, wall.start.y, wall.end.x, wall.end.y, bounds.x, bounds.y, bounds.width, bounds.height)) {
        wordOverlapHiddenInner.add(index);
      }
    });
  }
  
  for (const anim of activeWords) {
    const elapsed = now - anim.startTime;
    
    if (anim.isComposition && anim.compositionWords) {
      const composedText = anim.compositionWords.join(' ');
      const totalChars = composedText.length;
      const charRevealTime = COMPOSITION_FADE_IN / totalChars;
      
      let opacity = 1;
      let vibrationX = 0;
      let vibrationY = 0;
      let showUnderscore = true;
      let underscoreBlink = true;
      
      if (elapsed < COMPOSITION_FADE_IN) {
        opacity = Math.min(1, elapsed / 1000);
        vibrationX = (Math.random() - 0.5) * VIBRATION_INTENSITY * 2;
        vibrationY = (Math.random() - 0.5) * VIBRATION_INTENSITY * 2;
      } else if (elapsed < COMPOSITION_FADE_IN + COMPOSITION_VIBRATE) {
        vibrationX = (Math.random() - 0.5) * VIBRATION_INTENSITY * 2;
        vibrationY = (Math.random() - 0.5) * VIBRATION_INTENSITY * 2;
      } else if (elapsed < COMPOSITION_FADE_IN + COMPOSITION_VIBRATE + COMPOSITION_HOLD) {
        underscoreBlink = Math.floor((elapsed - COMPOSITION_FADE_IN - COMPOSITION_VIBRATE) / 300) % 2 === 0;
      } else {
        const fadeElapsed = elapsed - COMPOSITION_FADE_IN - COMPOSITION_VIBRATE - COMPOSITION_HOLD;
        opacity = 1 - (fadeElapsed / COMPOSITION_FADE_OUT);
        showUnderscore = false;
      }
      
      if (opacity > 0) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
        ctx.fillStyle = anim.color;
        
        let displayText = '';
        if (elapsed < COMPOSITION_FADE_IN) {
          const charsToShow = Math.floor(elapsed / charRevealTime);
          displayText = composedText.substring(0, charsToShow);
        } else {
          displayText = composedText;
        }
        
        if (showUnderscore && underscoreBlink) {
          displayText += '_';
        }
        
        ctx.fillText(displayText, leftMargin + vibrationX, yOffset + vibrationY);
        ctx.restore();
      }
      
      yOffset += lineHeight;
    } else {
      let opacity = 1;
      let vibrationX = 0;
      let vibrationY = 0;
      let showUnderscore = true;
      
      if (elapsed < FADE_IN) {
        opacity = elapsed / FADE_IN;
        vibrationX = (Math.random() - 0.5) * VIBRATION_INTENSITY * 2;
        vibrationY = (Math.random() - 0.5) * VIBRATION_INTENSITY * 2;
      } else if (elapsed < FADE_IN + VIBRATE) {
        vibrationX = (Math.random() - 0.5) * VIBRATION_INTENSITY * 2;
        vibrationY = (Math.random() - 0.5) * VIBRATION_INTENSITY * 2;
      } else if (elapsed < FADE_IN + VIBRATE + HOLD_NO_VIBRATE) {
      } else {
        const fadeElapsed = elapsed - FADE_IN - VIBRATE - HOLD_NO_VIBRATE;
        opacity = 1 - (fadeElapsed / FADE_OUT);
        showUnderscore = false;
      }
      
      if (opacity > 0) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
        ctx.fillStyle = anim.color;
        
        const totalChars = anim.word.length;
        const charRevealTime = FADE_IN / totalChars;
        let displayText = '';
        
        if (elapsed < FADE_IN) {
          const charsToShow = Math.floor(elapsed / charRevealTime);
          displayText = anim.word.substring(0, charsToShow);
        } else {
          displayText = anim.word;
        }
        
        const underscoreBlink = Math.floor(elapsed / 300) % 2 === 0;
        if (showUnderscore && underscoreBlink) {
          displayText += '_';
        }
        
        ctx.fillText(displayText, leftMargin + vibrationX, yOffset + vibrationY);
        ctx.restore();
      }
      
      yOffset += lineHeight;
    }
  }
}
