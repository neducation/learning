// Sand Block Tetris - core logic

// Sand Playground: 100+ particles, real gravity, drag to spawn
const COLS = 32;
const ROWS = 48;
const BLOCK = 10;
const COLORS = ["#FFD600", "#00E676", "#2979FF", "#FF1744", "#FF9100", "#C51162", "#00B8D4"];

let board = [];
function resetBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function draw() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        ctx.fillStyle = board[r][c];
        ctx.fillRect(c * BLOCK, r * BLOCK, BLOCK, BLOCK);
      }
    }
  }
}

function sandStep() {
  // Simulate sand gravity: each particle tries to fall down, then down-left/right
  for (let r = ROWS - 2; r >= 0; r--) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        // Try down
        if (!board[r + 1][c]) {
          board[r + 1][c] = board[r][c];
          board[r][c] = 0;
        } else {
          // Try down-left or down-right randomly
          const dirs = Math.random() < 0.5 ? [-1, 1] : [1, -1];
          for (let d of dirs) {
            if (c + d >= 0 && c + d < COLS && !board[r + 1][c + d]) {
              board[r + 1][c + d] = board[r][c];
              board[r][c] = 0;
              break;
            }
          }
        }
      }
    }
  }
}

function setup() {
  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.width = COLS * BLOCK;
  canvas.height = ROWS * BLOCK;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  gameDiv.appendChild(canvas);
  resetBoard();
  draw();

  // Touch/mouse drag to spawn sand
  let drawing = false;
  let color = COLORS[Math.floor(Math.random() * COLORS.length)];
  function spawnSand(x, y) {
    const rect = canvas.getBoundingClientRect();
    const cx = Math.floor(((x - rect.left) / rect.width) * COLS);
    const cy = Math.floor(((y - rect.top) / rect.height) * ROWS);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
          board[ny][nx] = color;
        }
      }
    }
  }
  canvas.addEventListener("mousedown", e => { drawing = true; color = COLORS[Math.floor(Math.random() * COLORS.length)]; spawnSand(e.clientX, e.clientY); });
  canvas.addEventListener("mousemove", e => { if (drawing) spawnSand(e.clientX, e.clientY); });
  window.addEventListener("mouseup", () => { drawing = false; });
  // Touch
  canvas.addEventListener("touchstart", e => { drawing = true; color = COLORS[Math.floor(Math.random() * COLORS.length)]; for (let t of e.touches) spawnSand(t.clientX, t.clientY); });
  canvas.addEventListener("touchmove", e => { if (drawing) for (let t of e.touches) spawnSand(t.clientX, t.clientY); });
  window.addEventListener("touchend", () => { drawing = false; });
}

setup();
setInterval(() => { sandStep(); draw(); }, 30);
