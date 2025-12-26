export interface Point {
  x: number;
  y: number;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface Wall {
  start: Point;
  end: Point;
  index: number;
}

export function generatePentagonVertices(centerX: number, centerY: number, radius: number, rotation: number = -Math.PI / 2): Point[] {
  const vertices: Point[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = rotation + (i * 2 * Math.PI) / 5;
    vertices.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }
  return vertices;
}

export function generateRadialInnerWalls(
  centerX: number, 
  centerY: number, 
  outerVertices: Point[],
  wallLength: number
): Wall[] {
  const walls: Wall[] = [];
  
  for (let i = 0; i < 5; i++) {
    const vertexIndex = (i + 1) % 5;
    const vertex = outerVertices[vertexIndex];
    
    const dx = centerX - vertex.x;
    const dy = centerY - vertex.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / dist;
    const unitY = dy / dist;
    
    const midDist = dist / 2;
    const halfLength = wallLength / 2;
    
    walls.push({
      start: {
        x: vertex.x + unitX * (midDist - halfLength),
        y: vertex.y + unitY * (midDist - halfLength),
      },
      end: {
        x: vertex.x + unitX * (midDist + halfLength),
        y: vertex.y + unitY * (midDist + halfLength),
      },
      index: i,
    });
  }
  
  return walls;
}

export function getWalls(vertices: Point[]): Wall[] {
  const walls: Wall[] = [];
  for (let i = 0; i < vertices.length; i++) {
    walls.push({
      start: vertices[i],
      end: vertices[(i + 1) % vertices.length],
      index: i,
    });
  }
  return walls;
}

function dotProduct(v1: Point, v2: Point): number {
  return v1.x * v2.x + v1.y * v2.y;
}

function subtractPoints(p1: Point, p2: Point): Point {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function normalize(v: Point): Point {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

function getWallNormal(wall: Wall): Point {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  return normalize({ x: -dy, y: dx });
}

function pointToLineDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx: number, yy: number;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

export function checkCollision(ball: Ball, wall: Wall): boolean {
  const distance = pointToLineDistance(
    { x: ball.x, y: ball.y },
    wall.start,
    wall.end
  );
  return distance <= ball.radius;
}

export function reflectVelocity(ball: Ball, wall: Wall): { vx: number; vy: number } {
  const normal = getWallNormal(wall);
  const velocity = { x: ball.vx, y: ball.vy };
  
  const dot = dotProduct(velocity, normal);
  
  return {
    vx: velocity.x - 2 * dot * normal.x,
    vy: velocity.y - 2 * dot * normal.y,
  };
}

export function isPointInsidePentagon(point: Point, vertices: Point[]): boolean {
  let inside = true;
  for (let i = 0; i < vertices.length; i++) {
    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % vertices.length];
    const edge = subtractPoints(v2, v1);
    const toPoint = subtractPoints(point, v1);
    const cross = edge.x * toPoint.y - edge.y * toPoint.x;
    if (cross > 0) {
      inside = false;
      break;
    }
  }
  return inside;
}

export function initializeBall(centerX: number, centerY: number, speed: number): Ball {
  const angle = Math.random() * 2 * Math.PI;
  return {
    x: centerX,
    y: centerY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 12,
  };
}

export function checkLineCrossing(
  prevPos: Point,
  currentPos: Point,
  lineStart: Point,
  lineEnd: Point
): boolean {
  const dx = currentPos.x - prevPos.x;
  const dy = currentPos.y - prevPos.y;
  const movementLength = Math.sqrt(dx * dx + dy * dy);
  if (movementLength < 0.001) {
    return false;
  }
  
  const d1 = crossProduct(
    subtractPoints(lineEnd, lineStart),
    subtractPoints(prevPos, lineStart)
  );
  const d2 = crossProduct(
    subtractPoints(lineEnd, lineStart),
    subtractPoints(currentPos, lineStart)
  );
  
  if (d1 * d2 > 0) {
    return false;
  }
  
  const d3 = crossProduct(
    subtractPoints(currentPos, prevPos),
    subtractPoints(lineStart, prevPos)
  );
  const d4 = crossProduct(
    subtractPoints(currentPos, prevPos),
    subtractPoints(lineEnd, prevPos)
  );
  
  if (d3 * d4 > 0) {
    return false;
  }
  
  return true;
}

function crossProduct(v1: Point, v2: Point): number {
  return v1.x * v2.y - v1.y * v2.x;
}
