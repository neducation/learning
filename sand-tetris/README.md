# Sand Tetris

A mobile-friendly iOS sand tetris game with realistic gravity effects and tetris-like gameplay.

## Features

- **Realistic Sand Physics**: Sand blocks fall naturally with gravity after placement
- **iOS Mobile Optimized**: Touch controls, responsive design, and iOS-specific optimizations
- **Tetris Mechanics**: Classic tetris pieces with line clearing when sand fills wall to wall
- **Smooth Animations**: 60fps gameplay with smooth sand movement
- **Touch Controls**: Swipe gestures and button controls optimized for mobile play
- **Progressive Difficulty**: Speed increases as you clear more lines

## How to Play

### Controls

**Touch Controls (Mobile):**

- **Swipe Left/Right**: Move piece horizontally
- **Swipe Down**: Hard drop (instant fall)
- **Swipe Up**: Rotate piece
- **Single Tap**: Rotate piece
- **Double Tap**: Hard drop

**Button Controls:**

- **←/→**: Move piece left/right
- **↓**: Soft drop (faster fall)
- **↻**: Rotate piece
- **Drop**: Hard drop
- **⏸**: Pause/Resume

**Keyboard Controls (Desktop):**

- **Arrow Keys**: Move and soft drop
- **Space/Up Arrow**: Rotate
- **Enter**: Hard drop
- **P**: Pause

### Gameplay

1. **Falling Pieces**: Colored sand tetris pieces fall from the top
2. **Sand Physics**: After placing a piece, individual sand blocks fall with realistic gravity
3. **Line Clearing**: When sand fills a complete horizontal line from wall to wall, it disappears
4. **Gravity Effect**: After line clearing, remaining sand falls down naturally
5. **Scoring**: Earn points for placing pieces, clearing lines, and hard drops
6. **Level Up**: Speed increases every 10 lines cleared

### Sand Physics

- Sand blocks fall straight down when possible
- If blocked, they slide diagonally left or right
- Sand settles when it can't fall further
- Realistic particle behavior creates dynamic gameplay

## Installation

1. Open `index.html` in any modern web browser
2. For iOS: Add to home screen for full-screen experience
3. No installation required - runs in browser

## Technical Features

- HTML5 Canvas for smooth rendering
- Touch event handling for mobile devices
- Responsive design for various screen sizes
- CSS backdrop filters for modern visual effects
- Optimized for iOS Safari and mobile browsers

## Game Settings

- **Grid Size**: 16x32 cells
- **Starting Speed**: 1 second per drop
- **Speed Increase**: Every 10 lines cleared
- **Sand Update Rate**: 50ms for smooth physics
- **7 Different Colors**: Each tetris piece type has its own sand color

## Browser Compatibility

- iOS Safari 10+
- Chrome Mobile 60+
- Firefox Mobile 55+
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Credits

Created as a modern take on classic Tetris with realistic sand physics simulation.

Enjoy playing Sand Tetris! 🏖️🎮
