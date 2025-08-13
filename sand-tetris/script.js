

    // Tetris pieces (tetrominoes) - solid blocks with no empty spaces
    this.pieces = [
      {
        // I-piece - solid horizontal bar
        shape: [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        color: 1,
      },
      {
        // O-piece - solid square
        shape: [
          [2, 2, 2, 2, 2, 2],
          [2, 2, 2, 2, 2, 2],
          [2, 2, 2, 2, 2, 2],
          [2, 2, 2, 2, 2, 2],
          [2, 2, 2, 2, 2, 2],
          [2, 2, 2, 2, 2, 2],
        ],
        color: 2,
      },
      {
        // T-piece - solid T shape
        shape: [
          [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        ],
        color: 3,
      },
      {
        // S-piece - solid rectangular block
        shape: [
          [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
          [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
          [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
          [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        ],
        color: 4,
      },
      {
        // Z-piece - solid rectangular block
        shape: [
          [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        ],
        color: 5,
      },
      {
        // J-piece - solid rectangular block
        shape: [
          [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
          [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
          [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
          [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        ],
        color: 6,
      },
      {
        // L-piece - solid rectangular block
        shape: [
          [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
          [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
          [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
          [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
        ],
        color: 7,
      },
    ];

    this.initGame();
    this.setupControls();
  }

  initGame() {
    this.spawnNewPiece();
    this.spawnNextPiece();
    this.updateDisplay();
    this.gameLoop();
  }

  spawnNewPiece() {
    if (this.nextPiece) {
      this.currentPiece = this.nextPiece;
    } else {
      this.currentPiece = this.createRandomPiece();
    }
    this.currentPiece.x =
      Math.floor(this.COLS / 2) -
      Math.floor(this.currentPiece.shape[0].length / 2);
    this.currentPiece.y = 0;

    this.spawnNextPiece();

    // Check for game over
    if (
      this.hasCollision(
        this.currentPiece.x,
        this.currentPiece.y,
        this.currentPiece.shape
      )
    ) {
      this.gameOver = true;
      this.showGameOver();
    }
  }

  spawnNextPiece() {
    this.nextPiece = this.createRandomPiece();
    this.drawNextPiece();
  }

  createRandomPiece() {
    const template =
      this.pieces[Math.floor(Math.random() * this.pieces.length)];
    return {
      shape: template.shape.map((row) =>
        row.map((cell) => (cell > 0 ? template.color : 0))
      ),
      x: 0,
      y: 0,
    };
  }

  hasCollision(x, y, shape) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] > 0) {
          const newX = x + col;
          const newY = y + row;

          if (
            newX < 0 ||
            newX >= this.COLS ||
            newY >= this.ROWS ||
            (newY >= 0 && this.grid[newY][newX] > 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  placePiece() {
    // Place the piece and add falling animation
    for (let row = 0; row < this.currentPiece.shape.length; row++) {
      for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
        if (this.currentPiece.shape[row][col] > 0) {
          const x = this.currentPiece.x + col;
          const y = this.currentPiece.y + row;
          if (y >= 0) {
            this.grid[y][x] = this.currentPiece.shape[row][col];
            this.sandGrid[y][x] = 1; // Mark as sand for physics

            // Add to falling particles for animation
            this.fallingParticles.push({
              x: x,
              y: y,
              color: this.currentPiece.shape[row][col],
              animY: y,
              velocity: 0,
              settled: false,
            });
          }
        }
      }
    }

    // Apply sand physics after placing
    this.applySandPhysics();

    // Check for completed lines
    this.checkLines();

    this.spawnNewPiece();
  }

  applySandPhysics() {
    // First, check for floating blocks and make them fall
    this.checkFloatingBlocks();

    // Check for edge collapse glitches BEFORE updating particles
    this.checkEdgeCollapseGlitches();

    // Update falling particle animations with increased mass/gravity
    for (let i = this.fallingParticles.length - 1; i >= 0; i--) {
      const particle = this.fallingParticles[i];

      if (!particle.settled) {
        // Increased gravity for more mass (was 0.1, now 0.3)
        particle.velocity += 0.3;

        // Check if can fall straight down
        const canFall =
          particle.y + 1 < this.ROWS &&
          this.grid[particle.y + 1][particle.x] === 0;

        // Check if particle is at edge and should fall off
        const isAtLeftEdge = particle.x === 0;
        const isAtRightEdge = particle.x === this.COLS - 1;

        // Enhanced edge falling - particles at edges fall off if nothing below OR no adjacent support
        if (
          (isAtLeftEdge || isAtRightEdge) &&
          (canFall || !this.hasAdjacentSupport(particle.x, particle.y))
        ) {
          // Remove particle from grid (falls off edge)
          this.grid[particle.y][particle.x] = 0;
          this.sandGrid[particle.y][particle.x] = 0;
          this.fallingParticles.splice(i, 1);
          continue;
        }

        // Check diagonal falling options
        const canFallLeft =
          particle.x > 0 &&
          particle.y + 1 < this.ROWS &&
          this.grid[particle.y + 1][particle.x - 1] === 0;
        const canFallRight =
          particle.x < this.COLS - 1 &&
          particle.y + 1 < this.ROWS &&
          this.grid[particle.y + 1][particle.x + 1] === 0;

        if (canFall) {
          // Move particle down with increased velocity
          this.grid[particle.y][particle.x] = 0;
          this.sandGrid[particle.y][particle.x] = 0;
          particle.y++;
          this.grid[particle.y][particle.x] = particle.color;
          this.sandGrid[particle.y][particle.x] = 1;
          particle.animY += particle.velocity;
        } else if (canFallLeft && Math.random() < 0.5) {
          // Fall diagonally left with increased velocity
          this.grid[particle.y][particle.x] = 0;
          this.sandGrid[particle.y][particle.x] = 0;
          particle.y++;
          particle.x--;
          this.grid[particle.y][particle.x] = particle.color;
          this.sandGrid[particle.y][particle.x] = 1;
          particle.animY += particle.velocity;
        } else if (canFallRight) {
          // Fall diagonally right with increased velocity
          this.grid[particle.y][particle.x] = 0;
          this.sandGrid[particle.y][particle.x] = 0;
          particle.y++;
          particle.x++;
          this.grid[particle.y][particle.x] = particle.color;
          this.sandGrid[particle.y][particle.x] = 1;
          particle.animY += particle.velocity;
        } else {
          // Particle has settled
          particle.settled = true;
          this.sandGrid[particle.y][particle.x] = 2; // Settled sand
          this.fallingParticles.splice(i, 1);
        }
      }
    }
  }

  // Check for edge collapse glitches - blocks suspended over edges
  checkEdgeCollapseGlitches() {
    let foundGlitched = true;

    while (foundGlitched) {
      foundGlitched = false;

      // Check all settled blocks for edge glitches
      for (let row = 0; row < this.ROWS; row++) {
        for (let col = 0; col < this.COLS; col++) {
          if (this.grid[row][col] > 0 && this.sandGrid[row][col] === 2) {
            // Check if block is glitched at edges
            if (this.isEdgeGlitched(col, row)) {
              // Make glitched block fall
              this.sandGrid[row][col] = 1; // Mark as falling
              this.fallingParticles.push({
                x: col,
                y: row,
                color: this.grid[row][col],
                animY: row,
                velocity: 0,
                settled: false,
              });
              foundGlitched = true;
            }
          }
        }
      }
    }
  }

  // Check if a block is glitched at edges (suspended over edge collapse)
  isEdgeGlitched(x, y) {
    // If not at bottom, check for edge collapse scenarios
    if (y < this.ROWS - 1) {
      // Left edge glitch check
      if (x === 0) {
        // No support below and no right support
        const noSupportBelow = this.grid[y + 1][x] === 0;
        const noRightSupport =
          x + 1 >= this.COLS || this.grid[y + 1][x + 1] === 0;
        if (noSupportBelow && noRightSupport) return true;
      }

      // Right edge glitch check
      if (x === this.COLS - 1) {
        // No support below and no left support
        const noSupportBelow = this.grid[y + 1][x] === 0;
        const noLeftSupport = x - 1 < 0 || this.grid[y + 1][x - 1] === 0;
        if (noSupportBelow && noLeftSupport) return true;
      }

      // Check for blocks hanging over gaps created by edge collapses
      if (x > 0 && x < this.COLS - 1) {
        const noSupportBelow = this.grid[y + 1][x] === 0;
        const noLeftSupport = this.grid[y + 1][x - 1] === 0;
        const noRightSupport = this.grid[y + 1][x + 1] === 0;

        // If no support below and both diagonal supports are missing
        if (noSupportBelow && noLeftSupport && noRightSupport) return true;
      }
    }

    return false;
  }

  // Check if block has adjacent horizontal support (for edge cases)
  hasAdjacentSupport(x, y) {
    // Check left and right neighbors at same level
    const hasLeftSupport =
      x > 0 && this.grid[y][x - 1] > 0 && this.sandGrid[y][x - 1] === 2;
    const hasRightSupport =
      x < this.COLS - 1 &&
      this.grid[y][x + 1] > 0 &&
      this.sandGrid[y][x + 1] === 2;

    return hasLeftSupport || hasRightSupport;
  } // Check for floating blocks and make them fall
  checkFloatingBlocks() {
    let foundFloating = true;

    // Keep checking until no more floating blocks are found
    while (foundFloating) {
      foundFloating = false;

      // Scan from bottom to top, right to left
      for (let row = this.ROWS - 2; row >= 0; row--) {
        for (let col = this.COLS - 1; col >= 0; col--) {
          if (this.grid[row][col] > 0 && this.sandGrid[row][col] === 2) {
            // Check if this block is floating (no support below)
            const hasSupport = this.hasSupport(col, row);

            if (!hasSupport) {
              // Make this block fall
              this.sandGrid[row][col] = 1; // Mark as falling
              this.fallingParticles.push({
                x: col,
                y: row,
                color: this.grid[row][col],
                animY: row,
                velocity: 0,
                settled: false,
              });
              foundFloating = true;
            }
          }
        }
      }
    }
  }

  // Check if a block has proper support (not floating)
  hasSupport(x, y) {
    // If at bottom row, it has support
    if (y === this.ROWS - 1) return true;

    // Check directly below
    if (this.grid[y + 1][x] > 0 && this.sandGrid[y + 1][x] === 2) {
      return true;
    }

    // Check diagonal supports (left-down and right-down)
    const hasLeftSupport =
      x > 0 && this.grid[y + 1][x - 1] > 0 && this.sandGrid[y + 1][x - 1] === 2;
    const hasRightSupport =
      x < this.COLS - 1 &&
      this.grid[y + 1][x + 1] > 0 &&
      this.sandGrid[y + 1][x + 1] === 2;

    // Need at least one solid support
    return hasLeftSupport || hasRightSupport;
  }

  checkLines() {
    let linesCleared = 0;

    for (let row = this.ROWS - 1; row >= 0; row--) {
      // Check if line is full with same color particles touching
      if (this.isConnectedLine(row)) {
        // Remove the line
        this.grid.splice(row, 1);
        this.sandGrid.splice(row, 1);
        // Add new empty line at top
        this.grid.unshift(Array(this.COLS).fill(0));
        this.sandGrid.unshift(Array(this.COLS).fill(0));

        linesCleared++;
        row++; // Check the same row again

        // Mark remaining sand as falling again
        for (let r = 0; r < this.ROWS; r++) {
          for (let c = 0; c < this.COLS; c++) {
            if (this.grid[r][c] > 0) {
              this.sandGrid[r][c] = 1;
              // Add back to falling particles
              this.fallingParticles.push({
                x: c,
                y: r,
                color: this.grid[r][c],
                animY: r,
                velocity: 0,
                settled: false,
              });
            }
          }
        }
      }
    }

    if (linesCleared > 0) {
      this.lines += linesCleared;
      this.score += linesCleared * 100 * this.level;
      this.level = Math.floor(this.lines / 10) + 1;
      this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

      // Force immediate floating block check after line clearing
      this.checkFloatingBlocks();

      this.updateDisplay();
    }
  }

  isConnectedLine(row) {
    // Check if the line is completely filled
    for (let col = 0; col < this.COLS; col++) {
      if (this.grid[row][col] === 0) {
        return false;
      }
    }

    // Check if same-color particles form a connected line from wall to wall
    const visited = Array(this.COLS).fill(false);

    // Find connected components of same color
    for (let startCol = 0; startCol < this.COLS; startCol++) {
      if (!visited[startCol]) {
        const color = this.grid[row][startCol];
        const component = [];

        // DFS to find all connected same-color particles
        const dfs = (col) => {
          if (
            col < 0 ||
            col >= this.COLS ||
            visited[col] ||
            this.grid[row][col] !== color
          ) {
            return;
          }
          visited[col] = true;
          component.push(col);

          // Check adjacent cells (left and right)
          dfs(col - 1);
          dfs(col + 1);
        };

        dfs(startCol);

        // Check if this component spans from wall to wall
        if (component.length > 0) {
          const minCol = Math.min(...component);
          const maxCol = Math.max(...component);

          // If the component touches both walls (spans entire width)
          if (minCol === 0 && maxCol === this.COLS - 1) {
            return true;
          }
        }
      }
    }

    return false;
  }

  movePiece(dx, dy) {
    if (!this.currentPiece || this.gameOver || this.paused) return false;

    const newX = this.currentPiece.x + dx;
    const newY = this.currentPiece.y + dy;

    if (!this.hasCollision(newX, newY, this.currentPiece.shape)) {
      this.currentPiece.x = newX;
      this.currentPiece.y = newY;
      return true;
    }

    // If moving down failed, place the piece
    if (dy > 0) {
      this.placePiece();
    }

    return false;
  }

  rotatePiece() {
    if (!this.currentPiece || this.gameOver || this.paused) return;

    const rotated = this.rotateMatrix(this.currentPiece.shape);

    if (!this.hasCollision(this.currentPiece.x, this.currentPiece.y, rotated)) {
      this.currentPiece.shape = rotated;
    }
  }

  rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = Array(cols)
      .fill()
      .map(() => Array(rows).fill(0));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        rotated[col][rows - 1 - row] = matrix[row][col];
      }
    }

    return rotated;
  }

  hardDrop() {
    if (!this.currentPiece || this.gameOver || this.paused) return;

    while (this.movePiece(0, 1)) {
      this.score += 2;
    }
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = "#1a1a2e";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid (less visible for smaller cells)
    this.drawGrid();

    // Draw settled sand
    this.drawSettledSand();

    // Draw falling particles with animation
    this.drawFallingParticles();

    // Draw current piece
    this.drawCurrentPiece();

    // Draw ghost piece
    this.drawGhostPiece();
  }

  drawGrid() {
    // Draw less visible grid for smaller cells
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    this.ctx.lineWidth = 0.5;

    // Only draw every 4th line to avoid visual clutter
    for (let row = 0; row <= this.ROWS; row += 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, row * this.CELL_SIZE);
      this.ctx.lineTo(this.canvas.width, row * this.CELL_SIZE);
      this.ctx.stroke();
    }

    for (let col = 0; col <= this.COLS; col += 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(col * this.CELL_SIZE, 0);
      this.ctx.lineTo(col * this.CELL_SIZE, this.canvas.height);
      this.ctx.stroke();
    }
  }

  drawSettledSand() {
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        if (this.grid[row][col] > 0 && this.sandGrid[row][col] === 2) {
          this.drawSandCell(col, row, this.grid[row][col]);
        }
      }
    }
  }

  drawFallingParticles() {
    for (const particle of this.fallingParticles) {
      // Use animated position for smooth falling
      const animY = Math.min(particle.animY, particle.y);
      this.drawSandCell(particle.x, animY, particle.color, true);
    }
  }

  drawCurrentPiece() {
    if (!this.currentPiece) return;

    for (let row = 0; row < this.currentPiece.shape.length; row++) {
      for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
        if (this.currentPiece.shape[row][col] > 0) {
          const x = this.currentPiece.x + col;
          const y = this.currentPiece.y + row;
          if (y >= 0) {
            this.drawSandCell(x, y, this.currentPiece.shape[row][col], true);
          }
        }
      }
    }
  }

  drawGhostPiece() {
    if (!this.currentPiece) return;

    let ghostY = this.currentPiece.y;
    while (
      !this.hasCollision(
        this.currentPiece.x,
        ghostY + 1,
        this.currentPiece.shape
      )
    ) {
      ghostY++;
    }

    this.ctx.globalAlpha = 0.3;
    for (let row = 0; row < this.currentPiece.shape.length; row++) {
      for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
        if (this.currentPiece.shape[row][col] > 0) {
          const x = this.currentPiece.x + col;
          const y = ghostY + row;
          if (y >= 0 && y !== this.currentPiece.y + row) {
            this.drawSandCell(x, y, this.currentPiece.shape[row][col]);
          }
        }
      }
    }
    this.ctx.globalAlpha = 1;
  }

  drawSandCell(x, y, colorIndex, isActive = false) {
    const cellX = x * this.CELL_SIZE;
    const cellY = y * this.CELL_SIZE;

    // For very small cells, simplify the rendering
    if (this.CELL_SIZE < 3) {
      this.ctx.fillStyle = this.colors[colorIndex];
      this.ctx.fillRect(cellX, cellY, this.CELL_SIZE, this.CELL_SIZE);
      return;
    }

    // Main sand color
    this.ctx.fillStyle = this.colors[colorIndex];
    this.ctx.fillRect(cellX, cellY, this.CELL_SIZE, this.CELL_SIZE);

    // Add sand texture/highlight for larger cells
    if (this.CELL_SIZE >= 2) {
      if (isActive) {
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      } else {
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      }
      this.ctx.fillRect(
        cellX,
        cellY,
        this.CELL_SIZE,
        Math.max(1, this.CELL_SIZE * 0.3)
      );
    }
  }

  drawNextPiece() {
    if (!this.nextPiece) return;

    this.nextCtx.fillStyle = "#1a1a2e";
    this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

    const cellSize = this.nextCanvas.width / 12; // Adjust for larger pieces
    const offsetX =
      (this.nextCanvas.width - this.nextPiece.shape[0].length * cellSize) / 2;
    const offsetY =
      (this.nextCanvas.height - this.nextPiece.shape.length * cellSize) / 2;

    for (let row = 0; row < this.nextPiece.shape.length; row++) {
      for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
        if (this.nextPiece.shape[row][col] > 0) {
          const x = offsetX + col * cellSize;
          const y = offsetY + row * cellSize;

          this.nextCtx.fillStyle = this.colors[this.nextPiece.shape[row][col]];
          this.nextCtx.fillRect(x, y, cellSize, cellSize);

          if (cellSize > 2) {
            this.nextCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
            this.nextCtx.fillRect(x, y, cellSize, Math.max(1, cellSize * 0.3));
          }
        }
      }
    }
  }

  updateDisplay() {
    document.getElementById("score").textContent = this.score;
    document.getElementById("lines").textContent = this.lines;
    document.getElementById("level").textContent = this.level;
  }

  gameLoop() {
    if (this.gameOver) return;

    const currentTime = Date.now();

    // Drop piece
    if (currentTime - this.dropTime > this.dropInterval && !this.paused) {
      this.movePiece(0, 1);
      this.dropTime = currentTime;
    }

    // Update sand physics
    if (
      currentTime - this.sandUpdateTime > this.sandUpdateInterval &&
      !this.paused
    ) {
      this.applySandPhysics();
      this.sandUpdateTime = currentTime;
    }

    // Continuous floating block check - NEVER allow floating blocks
    if (
      currentTime - this.floatingCheckTime > this.floatingCheckInterval &&
      !this.paused
    ) {
      this.checkFloatingBlocks();
      this.floatingCheckTime = currentTime;
    }

    // Continuous edge glitch check - NEVER allow suspended edge blocks
    if (
      currentTime - this.edgeGlitchCheckTime > this.edgeGlitchCheckInterval &&
      !this.paused
    ) {
      this.checkEdgeCollapseGlitches();
      this.edgeGlitchCheckTime = currentTime;
    }

    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  togglePause() {
    this.paused = !this.paused;
    document.getElementById("pauseBtn").textContent = this.paused ? "▶" : "⏸";
  }

  showGameOver() {
    document.getElementById("finalScore").textContent = this.score;
    document.getElementById("finalLines").textContent = this.lines;
    document.getElementById("gameOverModal").classList.remove("hidden");
  }

  restart() {
    this.grid = Array(this.ROWS)
      .fill()
      .map(() => Array(this.COLS).fill(0));
    this.sandGrid = Array(this.ROWS)
      .fill()
      .map(() => Array(this.COLS).fill(0));
    this.fallingParticles = [];
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.gameOver = false;
    this.paused = false;
    this.dropInterval = 1000;
    this.floatingCheckTime = 0; // Reset floating check timer
    this.edgeGlitchCheckTime = 0; // Reset edge glitch check timer

    document.getElementById("pauseBtn").textContent = "⏸";
    document.getElementById("gameOverModal").classList.add("hidden");

    this.spawnNewPiece();
    this.spawnNextPiece();
    this.updateDisplay();
    this.gameLoop();
  }

  setupControls() {
    // Button controls
    document
      .getElementById("leftBtn")
      .addEventListener("click", () => this.movePiece(-1, 0));
    document
      .getElementById("rightBtn")
      .addEventListener("click", () => this.movePiece(1, 0));
    document
      .getElementById("downBtn")
      .addEventListener("click", () => this.movePiece(0, 1));
    document
      .getElementById("rotateBtn")
      .addEventListener("click", () => this.rotatePiece());
    document
      .getElementById("dropBtn")
      .addEventListener("click", () => this.hardDrop());
    document
      .getElementById("pauseBtn")
      .addEventListener("click", () => this.togglePause());
    document
      .getElementById("restartBtn")
      .addEventListener("click", () => this.restart());

    // Touch and hold for continuous movement
    let holdInterval;
    const startHold = (action) => {
      action();
      holdInterval = setInterval(action, 150);
    };
    const stopHold = () => {
      if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
      }
    };

    document.getElementById("leftBtn").addEventListener("touchstart", (e) => {
      e.preventDefault();
      startHold(() => this.movePiece(-1, 0));
    });
    document.getElementById("rightBtn").addEventListener("touchstart", (e) => {
      e.preventDefault();
      startHold(() => this.movePiece(1, 0));
    });
    document.getElementById("downBtn").addEventListener("touchstart", (e) => {
      e.preventDefault();
      startHold(() => this.movePiece(0, 1));
    });

    ["leftBtn", "rightBtn", "downBtn"].forEach((id) => {
      const btn = document.getElementById(id);
      btn.addEventListener("touchend", stopHold);
      btn.addEventListener("touchcancel", stopHold);
      btn.addEventListener("mouseup", stopHold);
      btn.addEventListener("mouseleave", stopHold);
    });

    // Keyboard controls (for desktop testing)
    document.addEventListener("keydown", (e) => {
      if (this.gameOver || this.paused) return;

      switch (e.code) {
        case "ArrowLeft":
          e.preventDefault();
          this.movePiece(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          this.movePiece(1, 0);
          break;
        case "ArrowDown":
          e.preventDefault();
          this.movePiece(0, 1);
          break;
        case "ArrowUp":
        case "Space":
          e.preventDefault();
          this.rotatePiece();
          break;
        case "Enter":
          e.preventDefault();
          this.hardDrop();
          break;
        case "KeyP":
          e.preventDefault();
          this.togglePause();
          break;
      }
    });

    // Swipe gestures for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    });

    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
    });

    // Enhanced touch handling for mobile with tap-to-move
    this.canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      if (!e.changedTouches.length) return;

      const touch = e.changedTouches[0];
      const rect = this.canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      // Convert to grid coordinates
      const gridX = Math.floor(touchX / this.CELL_SIZE);
      const gridY = Math.floor(touchY / this.CELL_SIZE);

      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const minSwipeDistance = 30;

      // Check if this was a swipe gesture (moved significantly from start)
      if (
        Math.abs(deltaX) < minSwipeDistance &&
        Math.abs(deltaY) < minSwipeDistance
      ) {
        // Small movement = tap to move piece to position and drop
        this.moveToPositionAndDrop(gridX, gridY);
        return;
      }

      // Handle swipe gestures (existing code)
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            this.movePiece(1, 0); // Swipe right
          } else {
            this.movePiece(-1, 0); // Swipe left
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            this.hardDrop(); // Swipe down
          } else {
            this.rotatePiece(); // Swipe up
          }
        }
      }
    });

    // Enhanced click to move piece to clicked position and drop
    this.canvas.addEventListener("click", (e) => {
      e.preventDefault();

      // Get click position relative to canvas
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Convert to grid coordinates
      const gridX = Math.floor(clickX / this.CELL_SIZE);
      const gridY = Math.floor(clickY / this.CELL_SIZE);

      // Move piece to clicked position and drop immediately
      this.moveToPositionAndDrop(gridX, gridY);
    });

    // Double tap for hard drop (keep existing functionality)
    this.canvas.addEventListener("dblclick", (e) => {
      e.preventDefault();
      this.hardDrop();
    });
  }

  // Move piece to clicked/tapped position and drop immediately
  moveToPositionAndDrop(targetX, targetY) {
    if (!this.currentPiece || this.gameOver || this.paused) return;

    // Calculate target X position (center the piece on the click)
    const pieceWidth = this.currentPiece.shape[0].length;
    let newX = targetX - Math.floor(pieceWidth / 2);

    // Ensure piece stays within bounds
    newX = Math.max(0, Math.min(newX, this.COLS - pieceWidth));

    // Check if we can move to this position
    if (
      !this.hasCollision(newX, this.currentPiece.y, this.currentPiece.shape)
    ) {
      this.currentPiece.x = newX;
    } else {
      // Try to find nearest valid position
      let found = false;
      for (let offset = 1; offset <= pieceWidth && !found; offset++) {
        // Try right
        if (
          newX + offset <= this.COLS - pieceWidth &&
          !this.hasCollision(
            newX + offset,
            this.currentPiece.y,
            this.currentPiece.shape
          )
        ) {
          this.currentPiece.x = newX + offset;
          found = true;
        }
        // Try left
        else if (
          newX - offset >= 0 &&
          !this.hasCollision(
            newX - offset,
            this.currentPiece.y,
            this.currentPiece.shape
          )
        ) {
          this.currentPiece.x = newX - offset;
          found = true;
        }
      }
    }

    // Immediately hard drop the piece
    this.hardDrop();
  }
}

// Initialize game when page loads
document.addEventListener("DOMContentLoaded", () => {
  new SandTetris();
});
