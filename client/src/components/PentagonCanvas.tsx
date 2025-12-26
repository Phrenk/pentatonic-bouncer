import { useRef, useEffect, useState, useCallback } from 'react';
import { 
  generatePentagonVertices, 
  generateRadialInnerWalls,
  getWalls, 
  checkCollision, 
  reflectVelocity, 
  initializeBall,
  checkLineCrossing,
  type Ball,
  type Wall,
  type Point 
} from '@/lib/physics';
import { playNote, getNoteLabel, playInnerNote, resumeAudioContext } from '@/lib/audio';
import { loadAndProcessShape, startMorph, startInnerMorph, drawMorphingShapes, isShapeLoaded, isWallHidden, isInnerWallHidden, setPentagonCenter, setInnerReferenceWalls } from '@/lib/morphShape';

interface PentagonCanvasProps {
  isPlaying: boolean;
  speed: number;
  volume: number;
  onBounce: (wallIndex: number, noteLabel: string) => void;
  onBounceCountChange: (count: number) => void;
}

const BALL_BLUE = 'hsl(225, 85%, 42%)';
const LIGHT_BLUE = 'hsl(225, 85%, 71%)';

const WALL_COLORS = [
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
];

const INNER_WALL_COLORS = [
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
];

const LEFT_PANEL_WIDTH = 220;

export function PentagonCanvas({ 
  isPlaying, 
  speed, 
  volume, 
  onBounce,
  onBounceCountChange 
}: PentagonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const ballRef = useRef<Ball | null>(null);
  const verticesRef = useRef<Point[]>([]);
  const wallsRef = useRef<Wall[]>([]);
  const innerWallsRef = useRef<Wall[]>([]);
  const innerWallsVisualRef = useRef<Wall[]>([]);
  const lastCollisionRef = useRef<number>(-1);
  const collisionCooldownRef = useRef<number>(0);
  const flashingWallsRef = useRef<Map<number, number>>(new Map());
  const flashingInnerWallsRef = useRef<Map<number, number>>(new Map());
  const innerCrossedRef = useRef<Set<number>>(new Set());
  const prevBallPosRef = useRef<Point | null>(null);
  const bounceCountRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const pentagonSize = Math.min(rect.width - LEFT_PANEL_WIDTH, rect.height) * 0.95;
    const totalWidth = LEFT_PANEL_WIDTH + pentagonSize;
    
    setDimensions({ width: totalWidth, height: pentagonSize });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    loadAndProcessShape().catch(console.error);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0) return;
    
    const pentagonAreaWidth = dimensions.width - LEFT_PANEL_WIDTH;
    const centerX = LEFT_PANEL_WIDTH + pentagonAreaWidth / 2;
    const centerY = dimensions.height / 2;
    const pentagonRadius = Math.min(pentagonAreaWidth, dimensions.height) * 0.4;
    const originalInnerRadius = pentagonRadius * 0.35;
    const enlargedInnerRadius = originalInnerRadius * 1.95;
    
    verticesRef.current = generatePentagonVertices(centerX, centerY, pentagonRadius);
    wallsRef.current = getWalls(verticesRef.current);
    
    const outerWallLength = 2 * pentagonRadius * Math.sin(Math.PI / 5);
    const collisionLength = pentagonRadius * 0.25;
    const { collision, visual } = generateRadialInnerWalls(centerX, centerY, verticesRef.current, collisionLength, outerWallLength);
    innerWallsRef.current = collision;
    innerWallsVisualRef.current = visual;
    
    setPentagonCenter(centerX, centerY, pentagonRadius);
    
    const refWalls = [0, 2, 4].map(idx => ({
      index: idx,
      start: innerWallsRef.current[idx]?.start || { x: 0, y: 0 },
      end: innerWallsRef.current[idx]?.end || { x: 0, y: 0 },
    }));
    setInnerReferenceWalls(refWalls);
    
    if (!ballRef.current) {
      ballRef.current = initializeBall(centerX, centerY, speed);
    }
  }, [dimensions, speed]);

  useEffect(() => {
    if (ballRef.current) {
      const currentSpeed = Math.sqrt(ballRef.current.vx ** 2 + ballRef.current.vy ** 2);
      if (currentSpeed > 0) {
        const ratio = speed / currentSpeed;
        ballRef.current.vx *= ratio;
        ballRef.current.vy *= ratio;
      }
    }
  }, [speed]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = dimensions;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = BALL_BLUE;
    ctx.fillRect(0, 0, width, height);
    
    const pentagonAreaWidth = width - LEFT_PANEL_WIDTH;
    const centerX = LEFT_PANEL_WIDTH + pentagonAreaWidth / 2;
    const centerY = height / 2;
    
    const vertices = verticesRef.current;
    const walls = wallsRef.current;
    
    if (vertices.length >= 5) {
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = BALL_BLUE;
      ctx.fill();
    }
    
    walls.forEach((wall, index) => {
      if (isWallHidden(index)) return;
      
      const flashIntensity = flashingWallsRef.current.get(index) || 0;
      
      ctx.beginPath();
      ctx.moveTo(wall.start.x, wall.start.y);
      ctx.lineTo(wall.end.x, wall.end.y);
      
      if (flashIntensity > 0) {
        ctx.shadowColor = WALL_COLORS[index];
        ctx.shadowBlur = 20 * flashIntensity;
        ctx.strokeStyle = WALL_COLORS[index];
        ctx.lineWidth = 4 + 2 * flashIntensity;
      } else {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = WALL_COLORS[index];
        ctx.lineWidth = 3;
      }
      
      ctx.lineCap = 'round';
      ctx.stroke();
    });
    
    ctx.shadowBlur = 0;
    
    vertices.forEach((vertex, index) => {
      const flashIntensity = flashingWallsRef.current.get(index) || 0;
      const nextFlashIntensity = flashingWallsRef.current.get((index + 4) % 5) || 0;
      const combinedIntensity = Math.max(flashIntensity, nextFlashIntensity);
      
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 4 + combinedIntensity * 2, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(var(--foreground))';
      ctx.fill();
    });
    
    const innerWallsVisual = innerWallsVisualRef.current;
    
    innerWallsVisual.forEach((wall, index) => {
      if (isInnerWallHidden(index)) return;
      
      const flashIntensity = flashingInnerWallsRef.current.get(index) || 0;
      
      ctx.beginPath();
      ctx.moveTo(wall.start.x, wall.start.y);
      ctx.lineTo(wall.end.x, wall.end.y);
      
      if (flashIntensity > 0) {
        ctx.shadowColor = INNER_WALL_COLORS[index];
        ctx.shadowBlur = 15 * flashIntensity;
        ctx.strokeStyle = INNER_WALL_COLORS[index];
        ctx.lineWidth = 2 + 2 * flashIntensity;
      } else {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = INNER_WALL_COLORS[index];
        ctx.lineWidth = 2;
      }
      
      ctx.lineCap = 'round';
      ctx.stroke();
      
      ctx.shadowBlur = 0;
      const endRadius = 2 + flashIntensity * 1.5;
      ctx.beginPath();
      ctx.arc(wall.start.x, wall.start.y, endRadius, 0, Math.PI * 2);
      ctx.fillStyle = flashIntensity > 0 ? INNER_WALL_COLORS[index] : 'hsl(var(--foreground) / 0.5)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(wall.end.x, wall.end.y, endRadius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.shadowBlur = 0;
    
    drawMorphingShapes(ctx, dimensions.width, dimensions.height);
  }, [dimensions]);

  const update = useCallback(() => {
    const ball = ballRef.current;
    const walls = wallsRef.current;
    const innerWalls = innerWallsRef.current;
    
    if (!ball || walls.length === 0) return;
    
    const prevPos = prevBallPosRef.current || { x: ball.x, y: ball.y };
    
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    const currentPos = { x: ball.x, y: ball.y };
    
    if (collisionCooldownRef.current > 0) {
      collisionCooldownRef.current--;
    }
    
    for (const wall of walls) {
      if (checkCollision(ball, wall) && collisionCooldownRef.current === 0) {
        if (lastCollisionRef.current !== wall.index) {
          const newVelocity = reflectVelocity(ball, wall);
          ball.vx = newVelocity.vx;
          ball.vy = newVelocity.vy;
          
          lastCollisionRef.current = wall.index;
          collisionCooldownRef.current = 5;
          
          flashingWallsRef.current.set(wall.index, 1);
          
          playNote(wall.index, volume);
          
          if (isShapeLoaded()) {
            startMorph(wall.index, wall.start, wall.end);
          }
          
          bounceCountRef.current++;
          onBounceCountChange(bounceCountRef.current);
          onBounce(wall.index, getNoteLabel(wall.index));
          
          break;
        }
      }
    }
    
    for (const innerWall of innerWalls) {
      const crossed = checkLineCrossing(prevPos, currentPos, innerWall.start, innerWall.end);
      
      if (crossed && !innerCrossedRef.current.has(innerWall.index)) {
        innerCrossedRef.current.add(innerWall.index);
        flashingInnerWallsRef.current.set(innerWall.index, 1);
        playInnerNote(innerWall.index, volume * 0.28);
        
        if (isShapeLoaded()) {
          startInnerMorph(innerWall.index, innerWall.start, innerWall.end);
        }
      } else if (!crossed && innerCrossedRef.current.has(innerWall.index)) {
        innerCrossedRef.current.delete(innerWall.index);
      }
    }
    
    prevBallPosRef.current = currentPos;
    
    flashingWallsRef.current.forEach((intensity, index) => {
      const newIntensity = intensity - 0.05;
      if (newIntensity <= 0) {
        flashingWallsRef.current.delete(index);
      } else {
        flashingWallsRef.current.set(index, newIntensity);
      }
    });
    
    flashingInnerWallsRef.current.forEach((intensity, index) => {
      const newIntensity = intensity - 0.03;
      if (newIntensity <= 0) {
        flashingInnerWallsRef.current.delete(index);
      } else {
        flashingInnerWallsRef.current.set(index, newIntensity);
      }
    });
  }, [volume, onBounce, onBounceCountChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      if (isPlaying) {
        update();
      }
      draw(ctx);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, draw, update, dimensions]);

  const handleCanvasClick = useCallback(async () => {
    await resumeAudioContext();
  }, []);

  const resetBall = useCallback(() => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    ballRef.current = initializeBall(centerX, centerY, speed);
    bounceCountRef.current = 0;
    onBounceCountChange(0);
    lastCollisionRef.current = -1;
    flashingWallsRef.current.clear();
    flashingInnerWallsRef.current.clear();
    innerCrossedRef.current.clear();
    prevBallPosRef.current = null;
  }, [dimensions, speed, onBounceCountChange]);

  useEffect(() => {
    (window as any).resetPentagonBall = resetBall;
    return () => {
      delete (window as any).resetPentagonBall;
    };
  }, [resetBall]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleCanvasClick}
        className="cursor-pointer"
        style={{ 
          width: dimensions.width || '100%', 
          height: dimensions.height || '100%' 
        }}
        data-testid="canvas-pentagon"
      />
    </div>
  );
}
