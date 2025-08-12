// Sand Block Tetris - core logic

const COLS = 10;
const ROWS = 20;
const BLOCK = 24; // px
const COLORS = [
  '#FFD600', '#00E676', '#2979FF', '#FF1744', '#FF9100', '#C51162', '#00B8D4'
];

// Tetromino shapes
const SHAPES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,1,0],[0,1,1]], // S
  [[0,1,1],[1,1,0]], // Z
  [[1,0,0],[1,1,1]], // J
  [[0,0,1],[1,1,1]], // L
];

let board = [];
let current = null;
let gameOver = false;

function resetBoard() {
  board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
}

function randomShape() {
  const i = Math.floor(Math.random() * SHAPES.length);
  return {
    shape: SHAPES[i].map(row => [...row]),
    color: COLORS[i],
    x: Math.floor(COLS/2) - 2,
    y: 0
  };
}

function canMove(shape, x, y) {
  for (let r = 0; r < shape.shape.length; r++) {
    for (let c = 0; c < shape.shape[r].length; c++) {
      if (shape.shape[r][c]) {
        let nx = x + c, ny = y + r;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
        if (ny >= 0 && board[ny][nx]) return false;
      }
    }
  }
  return true;
}

function mergeToBoard(shape) {
  for (let r = 0; r < shape.shape.length; r++) {
    for (let c = 0; c < shape.shape[r].length; c++) {
      if (shape.shape[r][c]) {
        let nx = shape.x + c, ny = shape.y + r;
        if (ny >= 0 && nx >= 0 && nx < COLS && ny < ROWS) {
          board[ny][nx] = shape.color;
        }
      }
    }
  }
}

function rotateShape(shape) {
  const n = shape.shape.length;
  const m = shape.shape[0].length;
  let newShape = Array.from({length: m}, (_, i) => Array(n).fill(0));
  for (let r = 0; r < n; r++)
    for (let c = 0; c < m; c++)
      newShape[c][n-1-r] = shape.shape[r][c];
  return {...shape, shape: newShape};
}

function draw() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Draw board
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        ctx.fillStyle = board[r][c];
        ctx.fillRect(c*BLOCK, r*BLOCK, BLOCK, BLOCK);
        ctx.strokeStyle = '#222';
        ctx.strokeRect(c*BLOCK, r*BLOCK, BLOCK, BLOCK);
      }
    }
  }
  // Draw current
  if (current) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (current.shape[r][c]) {
          ctx.fillStyle = current.color;
          ctx.fillRect((current.x+c)*BLOCK, (current.y+r)*BLOCK, BLOCK, BLOCK);
          ctx.strokeStyle = '#444';
          ctx.strokeRect((current.x+c)*BLOCK, (current.y+r)*BLOCK, BLOCK, BLOCK);
        }
      }
    }
    ctx.restore();
  }
}

function sandify() {
  // Let all blocks fall down if there's empty space below (gravity)
  let changed = false;
  for (let r = ROWS-2; r >= 0; r--) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] && !board[r+1][c]) {
        board[r+1][c] = board[r][c];
        board[r][c] = 0;
        changed = true;
      }
    }
  }
  return changed;
}

function step() {
  if (gameOver) return;
  if (!current) {
    current = randomShape();
    if (!canMove(current, current.x, current.y)) {
      gameOver = true;
      alert('Game Over!');
      return;
    }
  }
  if (canMove(current, current.x, current.y+1)) {
    current.y++;
  } else {
    mergeToBoard(current);
    current = null;
    // After merging, let all blocks fall like sand
    let falling = true;
    while (falling) falling = sandify();
  }
  draw();
}

function moveLeft() {
  if (current && canMove(current, current.x-1, current.y)) {
    current.x--;
    draw();
  }
}
function moveRight() {
  if (current && canMove(current, current.x+1, current.y)) {
    current.x++;
    draw();
  }
}
function rotate() {
  if (current) {
    let rotated = rotateShape(current);
    if (canMove(rotated, rotated.x, rotated.y)) {
      current.shape = rotated.shape;
      draw();
    }
  }
}
function drop() {
  if (current) {
    while (canMove(current, current.x, current.y+1)) {
      current.y++;
    }
    draw();
  }
}

function setup() {
  const gameDiv = document.getElementById('game');
  gameDiv.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.width = COLS * BLOCK;
  canvas.height = ROWS * BLOCK;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  gameDiv.appendChild(canvas);
  resetBoard();
  current = null;
  gameOver = false;
  draw();
}

setup();
setInterval(step, 350);

window.moveLeft = moveLeft;
window.moveRight = moveRight;
window.rotate = rotate;
window.drop = drop;
