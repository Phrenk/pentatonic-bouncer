type Gender = 'm' | 'f';

interface Noun {
  word: string;
  gender: Gender;
}

const VERBI = [
  'respirare', 'contemplare', 'ascoltare', 'fluire', 'sostare', 'attendere',
  'accogliere', 'osservare', 'ricordare', 'dimenticare', 'vagare', 'germogliare',
  'radicare', 'fiorire', 'dimorare', 'scorrere', 'risuonare', 'custodire',
  'affidarsi', 'cullare', 'illuminare', 'dissolvere', 'meditare', 'raccogliere',
  'seminare', 'equilibrare', 'pacificare', 'armonizzare', 'svelare', 'svanire',
  'fluttuare', 'trasfigurare', 'corrodere', 'trascendere', 'invocare', 'dischiudere',
  'placare', 'distendere', 'sospendere', 'inseguire', 'sciogliere', 'ricomporre',
  'erodere', 'vibrare', 'desiderare', 'comprendere', 'riconoscere', 'scavare',
  'sprofondare', 'scegliere', 'evadere', 'tendere', 'anelare', 'rivelare',
  'bruciare', 'tacere', 'allontanare',
  'ritrarsi', 'velare', 'nascondere', 'togliere', 'spogliare', 'rarefare',
  'attenuare', 'quietare', 'oltrepassare', 'varcare', 'aprire', 'chiudere',
  'incominciare', 'finire', 'sorgere', 'calare', 'apparire', 'scomparire',
  'abitare', 'orientarsi', 'abbandonarsi', 'abbandonare', 'resistere', 'cedere',
  'accettare', 'sostenere', 'attrarre', 'mutare', 'divenire', 'trasformarsi',
  'trasformare', 'evolvere', 'generare', 'nutrire', 'rigenerare', 'consumare',
  'percepire', 'sentire', 'intuire', 'avvertire', 'sfiorare', 'assaporare',
  'risentire', 'scrutare', 'accennare', 'muovere', 'andare', 'procedere',
  'derivare', 'scivolare', 'emergere', 'affondare', 'ritornare', 'attraversare',
  'essere', 'restare', 'permanere', 'indugiare', 'esistere', 'presenziare',
  'giacere', 'stare', 'vivere'
];

const SOSTANTIVI: Noun[] = [
  { word: 'orizzonte', gender: 'm' }, { word: 'silenzio', gender: 'm' },
  { word: 'luce', gender: 'f' }, { word: 'ombra', gender: 'f' },
  { word: 'respiro', gender: 'm' }, { word: 'tempo', gender: 'm' },
  { word: 'spazio', gender: 'm' }, { word: 'quiete', gender: 'f' },
  { word: 'attesa', gender: 'f' }, { word: 'memoria', gender: 'f' },
  { word: 'oblio', gender: 'm' }, { word: 'eco', gender: 'f' },
  { word: 'soglia', gender: 'f' }, { word: 'sentiero', gender: 'm' },
  { word: 'radice', gender: 'f' }, { word: 'seme', gender: 'm' },
  { word: 'fiore', gender: 'm' }, { word: 'vento', gender: 'm' },
  { word: 'acqua', gender: 'f' }, { word: 'fiume', gender: 'm' },
  { word: 'mare', gender: 'm' }, { word: 'riva', gender: 'f' },
  { word: 'cielo', gender: 'm' }, { word: 'stella', gender: 'f' },
  { word: 'notte', gender: 'f' }, { word: 'alba', gender: 'f' },
  { word: 'crepuscolo', gender: 'm' }, { word: 'equilibrio', gender: 'm' },
  { word: 'armonia', gender: 'f' }, { word: 'pace', gender: 'f' },
  { word: 'lentezza', gender: 'f' }, { word: 'profondità', gender: 'f' },
  { word: 'vuoto', gender: 'm' }, { word: 'presenza', gender: 'f' },
  { word: 'assenza', gender: 'f' }, { word: 'cura', gender: 'f' },
  { word: 'dimora', gender: 'f' }, { word: 'casa', gender: 'f' },
  { word: 'pietra', gender: 'f' }, { word: 'sabbia', gender: 'f' },
  { word: 'isola', gender: 'f' }, { word: 'viaggio', gender: 'm' },
  { word: 'ritorno', gender: 'm' }, { word: 'sguardo', gender: 'm' },
  { word: 'ascolto', gender: 'm' }, { word: 'parola', gender: 'f' },
  { word: 'voce', gender: 'f' }, { word: 'pelle', gender: 'f' },
  { word: 'battito', gender: 'm' }, { word: 'cuore', gender: 'm' },
  { word: 'anima', gender: 'f' }, { word: 'spirito', gender: 'm' },
  { word: 'coscienza', gender: 'f' }, { word: 'consapevolezza', gender: 'f' },
  { word: 'mistero', gender: 'm' }, { word: 'infinito', gender: 'm' },
  { word: 'limite', gender: 'm' }, { word: 'unità', gender: 'f' },
  { word: 'cammino', gender: 'm' }, { word: 'ritmo', gender: 'm' },
  { word: 'sorgente', gender: 'f' }, { word: 'riflesso', gender: 'm' },
  { word: 'carezza', gender: 'f' }, { word: 'abbraccio', gender: 'm' },
  { word: 'quietudine', gender: 'f' }, { word: 'veglia', gender: 'f' },
  { word: 'miraggio', gender: 'm' }, { word: 'fenditura', gender: 'f' },
  { word: 'visione', gender: 'f' }, { word: 'smarrimento', gender: 'm' },
  { word: 'abisso', gender: 'm' }, { word: 'crepa', gender: 'f' },
  { word: 'cenere', gender: 'f' }, { word: 'deriva', gender: 'f' },
  { word: 'rovina', gender: 'f' }, { word: 'essenza', gender: 'f' },
  { word: 'assoluto', gender: 'm' }, { word: 'enigma', gender: 'm' },
  { word: 'rivelazione', gender: 'f' }, { word: 'mancanza', gender: 'f' },
  { word: 'spinta', gender: 'f' }, { word: 'richiamo', gender: 'm' },
  { word: 'varco', gender: 'm' }, { word: 'esito', gender: 'm' },
  { word: 'approdo', gender: 'm' }, { word: 'risposta', gender: 'f' },
  { word: 'marea', gender: 'f' }, { word: 'bosco', gender: 'm' },
  { word: 'corrente', gender: 'f' }, { word: 'chiarezza', gender: 'f' },
  { word: 'risonanza', gender: 'f' }, { word: 'fragilità', gender: 'f' },
  { word: 'intuizione', gender: 'f' }, { word: 'fiamma', gender: 'f' },
  { word: 'fuoco', gender: 'm' }, { word: 'slancio', gender: 'm' },
  { word: 'ferita', gender: 'f' }, { word: 'eccesso', gender: 'm' },
  { word: 'vertigine', gender: 'f' }, { word: 'senso', gender: 'm' },
  { word: 'verità', gender: 'f' }, { word: 'segreto', gender: 'm' },
  { word: 'origine', gender: 'f' }, { word: 'strato', gender: 'm' },
  { word: 'fondale', gender: 'm' }, { word: 'pausa', gender: 'f' },
  { word: 'intervallo', gender: 'm' }, { word: 'apertura', gender: 'f' },
  { word: 'cesura', gender: 'f' }, { word: 'volo', gender: 'm' },
  { word: 'possibilità', gender: 'f' }, { word: 'promessa', gender: 'f' },
  { word: 'lontananza', gender: 'f' }, { word: 'direzione', gender: 'f' },
  { word: 'distacco', gender: 'm' }, { word: 'margine', gender: 'm' },
  { word: 'nostalgia', gender: 'f' }, { word: 'vastità', gender: 'f' },
  { word: 'confine', gender: 'm' }, { word: 'liminarità', gender: 'f' },
  { word: 'interstizio', gender: 'm' }, { word: 'passaggio', gender: 'm' },
  { word: 'distanza', gender: 'f' }, { word: 'durata', gender: 'f' },
  { word: 'istante', gender: 'm' }, { word: 'ciclo', gender: 'm' },
  { word: 'sospensione', gender: 'f' }, { word: 'continuum', gender: 'm' },
  { word: 'latenza', gender: 'f' }, { word: 'attimo', gender: 'm' },
  { word: 'permanenza', gender: 'f' }, { word: 'sottrazione', gender: 'f' },
  { word: 'spoliazione', gender: 'f' }, { word: 'penombra', gender: 'f' },
  { word: 'tranquillità', gender: 'f' }, { word: 'flusso', gender: 'm' },
  { word: 'onda', gender: 'f' }, { word: 'oceano', gender: 'm' },
  { word: 'nebbia', gender: 'f' }, { word: 'linfa', gender: 'f' },
  { word: 'radura', gender: 'f' }, { word: 'nascita', gender: 'f' },
  { word: 'fioritura', gender: 'f' }, { word: 'sviluppo', gender: 'm' },
  { word: 'nutrimento', gender: 'm' }, { word: 'matrice', gender: 'f' },
  { word: 'inizio', gender: 'm' }, { word: 'principio', gender: 'm' },
  { word: 'semenza', gender: 'f' }, { word: 'impulso', gender: 'm' },
  { word: 'tensione', gender: 'f' }, { word: 'ardore', gender: 'm' },
  { word: 'incandescenza', gender: 'f' }, { word: 'vibrazione', gender: 'f' },
  { word: 'scossa', gender: 'f' }, { word: 'urgenza', gender: 'f' },
  { word: 'forza', gender: 'f' }, { word: 'pressione', gender: 'f' },
  { word: 'interiorità', gender: 'f' }, { word: 'intimità', gender: 'f' },
  { word: 'sensibilità', gender: 'f' }, { word: 'pulsazione', gender: 'f' },
  { word: 'contatto', gender: 'm' }, { word: 'vita', gender: 'f' },
  { word: 'fragore', gender: 'm' }, { word: 'tremore', gender: 'm' },
  { word: 'attenzione', gender: 'f' }, { word: 'intelligenza', gender: 'f' },
  { word: 'comprensione', gender: 'f' }, { word: 'frattura', gender: 'f' },
  { word: 'crollo', gender: 'm' }, { word: 'perdita', gender: 'f' },
  { word: 'disorientamento', gender: 'm' }, { word: 'significato', gender: 'm' },
  { word: 'arcano', gender: 'm' }, { word: 'ignoto', gender: 'm' },
  { word: 'segretezza', gender: 'f' }, { word: 'accoglienza', gender: 'f' },
  { word: 'custodia', gender: 'f' }, { word: 'vicinanza', gender: 'f' },
  { word: 'ospitalità', gender: 'f' }, { word: 'tessitura', gender: 'f' },
  { word: 'legame', gender: 'm' }, { word: 'potenza', gender: 'f' },
  { word: 'avvenire', gender: 'm' }, { word: 'chiamata', gender: 'f' },
  { word: 'vocazione', gender: 'f' }
];

const AVVERBI = [
  'lentamente', 'silenziosamente', 'gradualmente', 'profondamente', 'intimamente',
  'segretamente', 'naturalmente', 'inavvertitamente', 'dolcemente', 'oscuramente',
  'improvvisamente', 'continuamente', 'interiormente', 'separatamente', 'liberamente',
  'lontano', 'vicino', 'oltre', 'dentro', 'insieme', 'solo', 'altrove', 'dovunque',
  'ancora', 'sempre', 'mai', 'appena', 'ora', 'domani', 'oggi',
  'lievemente', 'pacatamente', 'delicatamente', 'morbidamente', 'tacitamente',
  'sottilmente', 'velatamente', 'costantemente', 'ciclicamente', 'ritmicamente',
  'consapevolmente', 'attentamente', 'ovunque', 'là', 'qui', 'attorno', 'verso',
  'tardi', 'presto', 'talvolta', 'spesso', 'raramente', 'ormai'
];

const AGGETTIVI = [
  'silente', 'latente', 'profondo', 'sottile', 'remoto', 'interiore', 'vasto',
  'fragile', 'opaco', 'illuminato', 'sospeso', 'nudo', 'invisibile', 'irrisolto',
  'denso', 'mobile', 'instabile', 'primordiale', 'essenziale', 'segreto', 'quieto',
  'ardente', 'inconsapevole', 'incompiuto', 'obliquo', 'intuitivo', 'notturno',
  'inerme', 'leggero', 'aperto',
  'intimo', 'abissale', 'raccolto', 'sommerso', 'radicato', 'impalpabile', 'velato',
  'tacito', 'sfumato', 'sotteso', 'mutevole', 'errante', 'scorrevole', 'vibrante',
  'crepuscolare', 'oscuro', 'ombroso', 'attenuato', 'incandescente', 'teso', 'vivo',
  'pulsante', 'trattenuto', 'acceso', 'radente', 'originario', 'elementare',
  'nascente', 'germinale', 'primo', 'iniziale', 'disponibile', 'accogliente',
  'silenzioso', 'quietante', 'presente', 'liminare', 'transitorio'
];

function inflectAdjective(adj: string, gender: Gender): string {
  if (adj.endsWith('o')) {
    return gender === 'f' ? adj.slice(0, -1) + 'a' : adj;
  }
  return adj;
}

function startsWithVowel(word: string): boolean {
  return /^[aeiouàèéìòù]/i.test(word);
}

function startsWithSpecialConsonant(word: string): boolean {
  const lower = word.toLowerCase();
  return lower.startsWith('z') || 
         lower.startsWith('gn') || 
         lower.startsWith('ps') || 
         lower.startsWith('pn') ||
         lower.startsWith('x') ||
         (lower.startsWith('s') && /^s[bcdfghlmnpqrstvwz]/i.test(lower));
}

function getArticle(noun: Noun, type: 'definite' | 'indefinite' = 'definite'): string {
  const { word, gender } = noun;
  const vowel = startsWithVowel(word);
  const special = startsWithSpecialConsonant(word);
  
  if (type === 'definite') {
    if (gender === 'm') {
      if (vowel) return "l'";
      if (special) return 'lo';
      return 'il';
    } else {
      if (vowel) return "l'";
      return 'la';
    }
  } else {
    if (gender === 'm') {
      if (special) return 'uno';
      return 'un';
    } else {
      if (vowel) return "un'";
      return 'una';
    }
  }
}

function getPrepositionArticle(noun: Noun, prep: string): string {
  const article = getArticle(noun, 'definite');
  
  if (prep === 'di') {
    if (article === 'il') return 'del';
    if (article === 'lo') return 'dello';
    if (article === 'la') return 'della';
    if (article === "l'") return "dell'";
  }
  return prep + ' ' + article;
}

type SyntacticPattern = 'S+A' | 'V+S' | 'A+S' | 'S+S' | 'V+R' | 'A+A' | 'V+V';

const SYNTACTIC_PATTERNS: SyntacticPattern[] = [
  'S+A', 'V+S', 'A+S', 'S+S', 'V+R', 'A+A', 'V+V'
];

let currentPatternIndex = 0;
let currentStepIndex = 0;
let currentPatternWords: string[] = [];
let currentPatternNoun: Noun | null = null;

const verbHistory: number[] = [];
const nounHistory: number[] = [];
const adverbHistory: number[] = [];
const adjectiveHistory: number[] = [];
const HISTORY_SIZE = 10;

function getNextVerb(): string {
  const available: number[] = [];
  for (let i = 0; i < VERBI.length; i++) {
    if (!verbHistory.includes(i)) available.push(i);
  }
  if (available.length === 0) {
    verbHistory.length = 0;
    for (let i = 0; i < VERBI.length; i++) available.push(i);
  }
  const selected = available[Math.floor(Math.random() * available.length)];
  verbHistory.push(selected);
  if (verbHistory.length > HISTORY_SIZE) verbHistory.shift();
  return VERBI[selected];
}

function getNextNoun(): Noun {
  const available: number[] = [];
  for (let i = 0; i < SOSTANTIVI.length; i++) {
    if (!nounHistory.includes(i)) available.push(i);
  }
  if (available.length === 0) {
    nounHistory.length = 0;
    for (let i = 0; i < SOSTANTIVI.length; i++) available.push(i);
  }
  const selected = available[Math.floor(Math.random() * available.length)];
  nounHistory.push(selected);
  if (nounHistory.length > HISTORY_SIZE) nounHistory.shift();
  return SOSTANTIVI[selected];
}

function getNextAdverb(): string {
  const available: number[] = [];
  for (let i = 0; i < AVVERBI.length; i++) {
    if (!adverbHistory.includes(i)) available.push(i);
  }
  if (available.length === 0) {
    adverbHistory.length = 0;
    for (let i = 0; i < AVVERBI.length; i++) available.push(i);
  }
  const selected = available[Math.floor(Math.random() * available.length)];
  adverbHistory.push(selected);
  if (adverbHistory.length > HISTORY_SIZE) adverbHistory.shift();
  return AVVERBI[selected];
}

function getNextAdjective(gender: Gender): string {
  const available: number[] = [];
  for (let i = 0; i < AGGETTIVI.length; i++) {
    if (!adjectiveHistory.includes(i)) available.push(i);
  }
  if (available.length === 0) {
    adjectiveHistory.length = 0;
    for (let i = 0; i < AGGETTIVI.length; i++) available.push(i);
  }
  const selected = available[Math.floor(Math.random() * available.length)];
  adjectiveHistory.push(selected);
  if (adjectiveHistory.length > HISTORY_SIZE) adjectiveHistory.shift();
  return inflectAdjective(AGGETTIVI[selected], gender);
}

function convertToGerund(verb: string): string {
  if (verb.endsWith('arsi')) {
    return verb.slice(0, -4) + 'andosi';
  } else if (verb.endsWith('ersi')) {
    return verb.slice(0, -4) + 'endosi';
  } else if (verb.endsWith('irsi')) {
    return verb.slice(0, -4) + 'endosi';
  } else if (verb.endsWith('are')) {
    return verb.slice(0, -3) + 'ando';
  } else if (verb.endsWith('ere')) {
    return verb.slice(0, -3) + 'endo';
  } else if (verb.endsWith('ire')) {
    return verb.slice(0, -3) + 'endo';
  }
  return verb + 'ndo';
}

function getNextWordInSeries(): { word: string; isLastInSeries: boolean; patternWords: string[]; currentPattern: SyntacticPattern } {
  const pattern = SYNTACTIC_PATTERNS[currentPatternIndex];
  let word = '';
  
  switch (pattern) {
    case 'S+A': {
      if (currentStepIndex === 0) {
        currentPatternNoun = getNextNoun();
        const article = getArticle(currentPatternNoun);
        word = article.endsWith("'") ? article + currentPatternNoun.word : article + ' ' + currentPatternNoun.word;
      } else {
        word = getNextAdjective(currentPatternNoun!.gender);
      }
      break;
    }
    case 'V+S': {
      if (currentStepIndex === 0) {
        word = getNextVerb();
      } else {
        const noun = getNextNoun();
        const article = getArticle(noun);
        word = article.endsWith("'") ? article + noun.word : article + ' ' + noun.word;
      }
      break;
    }
    case 'A+S': {
      if (currentStepIndex === 0) {
        currentPatternNoun = getNextNoun();
        const adj = getNextAdjective(currentPatternNoun.gender);
        const articleBase = currentPatternNoun.gender === 'm' ? 
          (startsWithSpecialConsonant(adj) ? 'lo' : (startsWithVowel(adj) ? "l'" : 'il')) :
          (startsWithVowel(adj) ? "l'" : 'la');
        word = articleBase.endsWith("'") ? articleBase + adj : articleBase + ' ' + adj;
      } else {
        word = currentPatternNoun!.word;
      }
      break;
    }
    case 'S+S': {
      if (currentStepIndex === 0) {
        const noun = getNextNoun();
        const article = getArticle(noun);
        word = article.endsWith("'") ? article + noun.word : article + ' ' + noun.word;
      } else {
        const noun2 = getNextNoun();
        const prep = getPrepositionArticle(noun2, 'di');
        word = prep.endsWith("'") ? prep + noun2.word : prep + ' ' + noun2.word;
      }
      break;
    }
    case 'V+R': {
      if (currentStepIndex === 0) {
        word = getNextVerb();
      } else {
        word = getNextAdverb();
      }
      break;
    }
    case 'A+A': {
      const gender: Gender = Math.random() < 0.5 ? 'm' : 'f';
      if (currentStepIndex === 0) {
        currentPatternNoun = { word: '', gender };
        word = getNextAdjective(gender);
      } else {
        word = getNextAdjective(currentPatternNoun!.gender);
      }
      break;
    }
    case 'V+V': {
      if (currentStepIndex === 0) {
        word = getNextVerb();
      } else {
        word = convertToGerund(getNextVerb());
      }
      break;
    }
  }
  
  currentPatternWords.push(word);
  
  const isLastInSeries = currentStepIndex === 1;
  const patternWords = [...currentPatternWords];
  
  currentStepIndex++;
  
  if (currentStepIndex >= 2) {
    currentStepIndex = 0;
    currentPatternIndex = (currentPatternIndex + 1) % SYNTACTIC_PATTERNS.length;
    currentPatternWords = [];
    currentPatternNoun = null;
  }
  
  return { word, isLastInSeries, patternWords, currentPattern: pattern };
}

let wordImages: HTMLCanvasElement[] = [];
let shapeLoaded = false;

const DOS_FONT = '"Digital 7", "Courier New", Courier, monospace';

function createWordCanvas(word: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  const fontSize = 22;
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
      await document.fonts.load('32px "Digital 7"');
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

const COMPOSITION_LETTER_REVEAL = 4000;
const COMPOSITION_HOLD = 3000;
const COMPOSITION_FADE_OUT = 4000;
const COMPOSITION_TOTAL = COMPOSITION_LETTER_REVEAL + COMPOSITION_HOLD + COMPOSITION_FADE_OUT;

const IMAGE_COLORS = ['#000000'];

const pendingCompositions: { words: string[]; triggerTime: number }[] = [];

export function startMorph(
  wallIndex: number, 
  wallStart: { x: number; y: number }, 
  wallEnd: { x: number; y: number }
): void {
  const { word, isLastInSeries, patternWords } = getNextWordInSeries();
  const color = IMAGE_COLORS[Math.floor(Math.random() * IMAGE_COLORS.length)];
  
  activeWords.push({
    id: animationIdCounter++,
    word,
    startTime: performance.now(),
    duration: TOTAL_DURATION,
    color,
  });
  
  if (isLastInSeries) {
    pendingCompositions.push({
      words: patternWords,
      triggerTime: performance.now() + TOTAL_DURATION
    });
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
  const { word, isLastInSeries, patternWords } = getNextWordInSeries();
  const color = IMAGE_COLORS[Math.floor(Math.random() * IMAGE_COLORS.length)];
  
  activeWords.push({
    id: animationIdCounter++,
    word,
    startTime: performance.now(),
    duration: TOTAL_DURATION,
    color,
  });
  
  if (isLastInSeries) {
    pendingCompositions.push({
      words: patternWords,
      triggerTime: performance.now() + TOTAL_DURATION
    });
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
  while (pendingCompositions.length > 0 && now >= pendingCompositions[0].triggerTime) {
    const composition = pendingCompositions.shift()!;
    activeWords.push({
      id: animationIdCounter++,
      word: composition.words.join(' '),
      startTime: now,
      duration: COMPOSITION_TOTAL,
      color: '#000000',
      isComposition: true,
      compositionWords: composition.words
    });
  }
}

export function drawMorphingShapes(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
  cleanupExpiredWords();
  checkPendingComposition();
  
  const leftMargin = 15;
  const topMargin = 30;
  const lineHeight = 24;
  const fontSize = 19;
  
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
      const charRevealTime = COMPOSITION_LETTER_REVEAL / totalChars;
      
      let opacity = 1;
      let showUnderscore = true;
      let underscoreBlink = true;
      
      if (elapsed < COMPOSITION_LETTER_REVEAL) {
        opacity = Math.min(1, elapsed / 1000);
      } else if (elapsed < COMPOSITION_LETTER_REVEAL + COMPOSITION_HOLD) {
        underscoreBlink = Math.floor((elapsed - COMPOSITION_LETTER_REVEAL) / 300) % 2 === 0;
      } else {
        const fadeElapsed = elapsed - COMPOSITION_LETTER_REVEAL - COMPOSITION_HOLD;
        opacity = 1 - (fadeElapsed / COMPOSITION_FADE_OUT);
        showUnderscore = false;
      }
      
      if (opacity > 0) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
        ctx.fillStyle = anim.color;
        
        let displayText = '';
        if (elapsed < COMPOSITION_LETTER_REVEAL) {
          const charsToShow = Math.floor(elapsed / charRevealTime);
          displayText = composedText.substring(0, charsToShow);
        } else {
          displayText = composedText;
        }
        
        if (showUnderscore && underscoreBlink) {
          displayText += '_';
        }
        
        ctx.fillText(displayText, leftMargin, yOffset);
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
