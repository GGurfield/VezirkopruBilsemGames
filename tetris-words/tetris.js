const SHAPES = {
  1: [ [[1]] ],
  2: [ [[1,1]], [[1],[1]] ],
  3: [ [[1,1,1]], [[1,1],[1,0]] ],
  4: [ // Tetrominoes
    [[1,1,1,1]], 
    [[1,1],[1,1]], 
    [[1,1,1],[0,1,0]], 
    [[1,1,0],[0,1,1]], 
    [[1,1,1],[1,0,0]] 
  ],
  5: [ // Pentominoes
    [[1,1,1,1,1]], 
    [[1,1,1],[1,1,0]], 
    [[1,1,1],[0,1,0],[0,1,0]], 
    [[1,1,1,1],[1,0,0,0]] 
  ],
  6: [
    [[1,1,1,1,1,1]],
    [[1,1,1],[1,1,1]],
    [[1,1,1,1],[0,1,1,0]]
  ],
  7: [
    [[1,1,1,1,1,1,1]],
    [[1,1,1,1],[1,1,1,0]]
  ]
};

class TetrisGame {
  constructor(boardId, nextId) {
    this.canvas = document.getElementById(boardId);
    this.ctx = this.canvas.getContext('2d');
    this.nextCanvas = document.getElementById(nextId);
    this.nextCtx = this.nextCanvas.getContext('2d');
    
    this.cols = 10;
    this.rows = 20;
    this.blockSize = 30; // 10*30=300, 20*30=600
    
    this.grid = this.createEmptyGrid();
    this.piece = null;
    this.queue = [];
    this.particles = [];
    this.animationRequested = false;
    
    this.score = 0;
    this.isGameOver = false;
    
    // UI elements
    this.scoreEl = document.getElementById('score');
    this.overlay = document.getElementById('game-over-overlay');
  }

  createEmptyGrid() {
    return Array.from({length: this.rows}, () => Array(this.cols).fill(null));
  }

  reset() {
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.updateScore(0);
    this.piece = null;
    this.queue = [];
    this.particles = [];
    this.isGameOver = false;
    this.overlay.classList.add('hidden');
    this.draw();
  }

  updateScore(added) {
    this.score += added;
    this.scoreEl.textContent = this.score;
  }

  addShapeToQueue(length) {
    let list = SHAPES[length];
    if (!list) {
      // Fallback: long bar wrapped or simple bar
      list = [ [Array(Math.min(length, 10)).fill(1)] ];
    }
    const matrix = list[Math.floor(Math.random() * list.length)];
    const shape = matrix.map(row => [...row]);
    
    // Choose vivid color
    const hue = Math.floor(Math.random() * 360);
    const color = `hsl(${hue}, 80%, 60%)`;
    
    const newPiece = { matrix: shape, color, x: 0, y: 0 };
    
    this.queue.push(newPiece);
    
    if (!this.piece) {
      this.spawnNextPiece();
    }
    this.drawNextPiece();
  }

  spawnNextPiece() {
    if (this.queue.length === 0) {
      this.piece = null;
      return;
    }
    this.piece = this.queue.shift();
    this.piece.y = 0;
    this.piece.x = Math.floor(this.cols / 2) - Math.floor(this.piece.matrix[0].length / 2);
    
    // If collides immediately = game over
    if (this.collide(this.piece)) {
      this.isGameOver = true;
      this.overlay.classList.remove('hidden');
    }
    this.drawNextPiece();
  }

  drawNextPiece() {
    this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    if (this.queue.length > 0) {
      const next = this.queue[0];
      const m = next.matrix;
      const bSize = 20; // smaller blocks for next piece
      const w = m[0].length * bSize;
      const h = m.length * bSize;
      const ox = (this.nextCanvas.width - w) / 2;
      const oy = (this.nextCanvas.height - h) / 2;
      
      this.nextCtx.fillStyle = next.color;
      m.forEach((row, y) => {
        row.forEach((val, x) => {
          if (val) {
            this.nextCtx.fillRect(ox + x*bSize, oy + y*bSize, bSize-1, bSize-1);
          }
        });
      });
    }
  }

  collide(p) {
    const m = p.matrix;
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (m[y][x]) {
          const newY = p.y + y;
          const newX = p.x + x;
          if (newY >= this.rows || newX < 0 || newX >= this.cols) {
            return true;
          }
          if (newY >= 0 && this.grid[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  moveLeft() {
    if(!this.piece || this.isGameOver) return;
    this.piece.x--;
    if (this.collide(this.piece)) this.piece.x++;
    else window.audio.move();
    this.draw();
  }

  moveRight() {
    if(!this.piece || this.isGameOver) return;
    this.piece.x++;
    if (this.collide(this.piece)) this.piece.x--;
    else window.audio.move();
    this.draw();
  }

  rotate() {
    if(!this.piece || this.isGameOver) return;
    const m = this.piece.matrix;
    // Transpose & reverse
    const rotated = m[0].map((val, index) => m.map(row => row[index]).reverse());
    const oldMatrix = this.piece.matrix;
    this.piece.matrix = rotated;
    if (this.collide(this.piece)) {
      this.piece.matrix = oldMatrix; // Undo if invalid
    } else {
      window.audio.rotate();
    }
    this.draw();
  }

  moveDown() {
    if(!this.piece || this.isGameOver) return;
    this.piece.y++;
    if (this.collide(this.piece)) {
      this.piece.y--;
      this.lockPiece();
    }
    this.draw();
  }

  lockPiece() {
    const p = this.piece;
    const m = p.matrix;
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (m[y][x]) {
          if (p.y + y < 0) continue; // Out of bounds lock = game over in spawn
          this.grid[p.y + y][p.x + x] = p.color;
        }
      }
    }
    
    // Placement score
    this.updateScore(100);
    window.audio.drop();
    this.checkLines();
    this.piece = null;
    this.spawnNextPiece();
  }

  checkLines() {
    let linesCleared = 0;
    for (let y = this.rows - 1; y >= 0; y--) {
      // Check if row is full AND it is not a penalty row
      if (this.grid[y].every(cell => cell !== null) && !this.grid[y].includes('#555555')) {
        // Generate dissolve particles
        for (let x = 0; x < this.cols; x++) {
          this.createDissolveEffect(x, y, this.grid[y][x]);
        }
        
        // Remove row
        this.grid.splice(y, 1);
        // Add empty row at top
        this.grid.unshift(Array(this.cols).fill(null));
        linesCleared++;
        y++; // Re-check this index
      }
    }

    if (linesCleared > 0) {
      window.audio.clear();
      // "If player deletes 1 row: 500. 2 rows: 1250. 3 rows: 3000. 4 rows: 7000"
      if (linesCleared === 1) this.updateScore(500);
      if (linesCleared === 2) this.updateScore(1250);
      if (linesCleared === 3) this.updateScore(3000);
      if (linesCleared >= 4) this.updateScore(7000);
      
      this.draw();
    }
  }

  createDissolveEffect(gridX, gridY, color) {
    const px = gridX * this.blockSize;
    const py = gridY * this.blockSize;
    for(let i=0; i<8; i++) {
       this.particles.push({
          x: px + Math.random() * this.blockSize,
          y: py + Math.random() * this.blockSize,
          vx: (Math.random() - 0.5) * 8, // burst outwards
          vy: (Math.random() - 0.5) * 6 - 3, // mostly burst upwards
          size: Math.random() * 8 + 4,
          life: 600 + Math.random() * 400, // milliseconds
          maxLife: 1000,
          color: color
       });
    }
  }

  addPenaltyRow() {
    // Adds a gray row at bottom, pushing everything up
    this.grid.shift(); // remove top row
    this.grid.push(Array(this.cols).fill('#555555')); // Gray row
    
    if (this.piece) {
      if (this.collide(this.piece)) {
        this.piece.y--; // try to push piece up
        if (this.collide(this.piece)) {
           // still collides, lock it or game over
           this.isGameOver = true;
           this.overlay.classList.remove('hidden');
        }
      }
    }
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw Grid
    this.grid.forEach((row, y) => {
      row.forEach((cellColor, x) => {
        if (cellColor) {
           this.drawBlock(x, y, cellColor);
        }
      });
    });
    
    // Draw active Piece
    if (this.piece) {
      const p = this.piece;
      p.matrix.forEach((row, y) => {
        row.forEach((val, x) => {
          if (val) {
             this.drawBlock(p.x + x, p.y + y, p.color);
          }
        });
      });
    }

    // Draw and update particles
    let activeParticles = false;
    for (let i = this.particles.length - 1; i >= 0; i--) {
       const p = this.particles[i];
       p.x += p.vx;
       p.y += p.vy;
       p.life -= 16;
       
       if (p.life <= 0) {
          this.particles.splice(i, 1);
       } else {
          this.ctx.globalAlpha = p.life / p.maxLife;
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(p.x, p.y, p.size, p.size);
          activeParticles = true;
       }
    }
    this.ctx.globalAlpha = 1;
    
    if (activeParticles && !this.animationRequested) {
       this.animationRequested = true;
       requestAnimationFrame(() => {
          this.animationRequested = false;
          this.draw();
       });
    }
  }

  drawBlock(x, y, color) {
    const blockSize = this.blockSize;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
    
    // Shadow / border effect for glassy 3D look
    this.ctx.fillStyle = "rgba(0,0,0,0.3)";
    this.ctx.fillRect(x*blockSize, y*blockSize + blockSize - 4, blockSize, 4);
    this.ctx.fillRect(x*blockSize + blockSize - 4, y*blockSize, 4, blockSize);
    
    this.ctx.fillStyle = "rgba(255,255,255,0.3)";
    this.ctx.fillRect(x*blockSize, y*blockSize, blockSize, 4);
    this.ctx.fillRect(x*blockSize, y*blockSize, 4, blockSize);
  }
}

window.TetrisGame = TetrisGame;
