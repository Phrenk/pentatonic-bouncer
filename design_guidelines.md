# Design Guidelines: Pentatonic Ball Bouncer

## Design Approach
**Hybrid Approach**: Material Design system for controls + custom artistic visualization for the pentagon interaction area. Drawing inspiration from Chrome Music Lab's playful minimalism and scientific visualization tools' precision.

**Design Principles**:
- Center stage: Pentagon visualization dominates the viewport
- Clarity: Every interaction should have immediate visual feedback
- Musical feel: Design should evoke the lightness and rhythm of music
- Precision: Controls should feel scientific yet approachable

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, h-8)

**Main Layout Structure**:
- Full viewport canvas (w-screen h-screen)
- Pentagon visualization: centered, taking 60-70% of viewport height
- Control panel: fixed bottom or side rail (your choice based on control complexity)
- Header bar: slim top bar (h-16) with title and settings icon

**Viewport Strategy**: Single-screen app - all primary interaction visible without scrolling

## Typography

**Font Stack**: 
- Primary: Inter (Google Fonts) - clean, modern, technical
- Accent: JetBrains Mono for numerical values/frequencies

**Hierarchy**:
- App title: text-2xl font-semibold
- Control labels: text-sm font-medium uppercase tracking-wide
- Note values: text-4xl font-bold font-mono
- Helper text: text-xs

## Component Library

### Core Visualization
**Pentagon Canvas**:
- SVG-based pentagon with visible stroke edges
- Ball: circle element with smooth CSS transforms for movement
- Wall flash effect: brief glow/pulse on each wall when hit
- Note indicator: floating label near impact point showing the note played

### Control Panel Components
**Primary Controls**:
- Play/Pause: Large circular FAB (56x56px) with icon
- Reset/Randomize: Secondary action buttons (40x40px)
- Speed slider: Full-width range input with current value display
- Volume control: Vertical or horizontal slider

**Settings Panel** (accessible via icon):
- Pentagon size adjustment
- Ball speed/gravity controls
- Scale selection (if expanding beyond pentatonic)
- Visual effect toggles

### Information Display
**Status Bar** (compact, always visible):
- Current note being played: large, prominent
- Total bounces counter
- Session duration timer

**Musical Visualization** (optional but recommended):
- Small waveform or frequency bars near pentagon
- Recent notes history (last 5-8 notes in sequence)

## Interactive Elements

**Ball Animation**:
- Continuous smooth motion using requestAnimationFrame
- Brief pause/emphasis on wall collision (1-2 frames)
- Optional trail effect showing recent path

**Wall Response**:
- Instant visual feedback: stroke width increase + opacity pulse
- Duration: 150-200ms
- Each wall should have subtle differentiation (stroke pattern or end caps)

**Button States**:
- Hover: slight scale (scale-105) + shadow increase
- Active: scale-95
- Disabled: opacity-50

## Visual Enhancements

**Pentagon Design**:
- Clean geometric precision
- Walls: 3-4px stroke width
- Subtle inner glow or shadow for depth
- Rotate slightly (15-20°) for dynamic composition

**Ball Design**:
- Perfect circle: 12-16px diameter
- Subtle gradient or inner shadow for 3D effect
- Optional: slight squash on impact

**Atmospheric Effects**:
- Subtle radial gradient background emanating from pentagon center
- Particle burst on wall impacts (5-8 particles, quick fade)
- Optional: gentle pulsing of background in rhythm with notes

## Animations

**Essential Only**:
- Ball movement: smooth, physics-based
- Wall flash: 150ms ease-out
- Control transitions: 200ms ease-in-out
- No unnecessary decorative animations

## Images

**No hero image needed** - this is an interactive tool where the pentagon visualization IS the hero element.

**Optional visual assets**:
- Musical note icons for each pentagon wall (small, 16-24px)
- Waveform or sound visualization graphics
- Settings/control icons from Material Icons

## Accessibility

- Keyboard controls: Space (play/pause), R (reset), Arrow keys (speed adjustment)
- Screen reader announcements for note changes
- High contrast mode: ensure pentagon/ball remain visible
- Focus indicators on all interactive controls

## Technical Implementation Notes

- Canvas container: relative positioning for absolute-positioned ball
- Use CSS transforms for ball movement (better performance)
- Web Audio API for sound generation
- Consider AudioContext worklet for precise timing
- localStorage for saving user preferences

**Distinctive Quality**: This isn't a generic web app - it's a musical instrument. Every visual decision should reinforce the connection between physical interaction (ball bouncing) and musical output (notes playing). The design should feel precise, immediate, and joyful.