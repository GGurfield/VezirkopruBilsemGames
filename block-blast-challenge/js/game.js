// js/game.js
const GRID_SIZE = 8;
const CELL_SIZE = 45; // Default from CSS
const GAP = 2;

// Special shapes
const SPECIAL_SHAPES = {
    STAR: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ]
};

// Standard 1010! style shapes
const SHAPES = [
    // 1x1
    [[1]],
    // 2x2
    [[1, 1], [1, 1]],
    // 3x3
    [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    // Lines
    [[1, 1]], [[1], [1]],
    [[1, 1, 1]], [[1], [1], [1]],
    [[1, 1, 1, 1]], [[1], [1], [1], [1]],
    [[1, 1, 1, 1, 1]], [[1], [1], [1], [1], [1]],
    // L-shapes (small)
    [[1, 1], [1, 0]], [[1, 1], [0, 1]], [[1, 0], [1, 1]], [[0, 1], [1, 1]],
    // L-shapes (large)
    [[1, 1, 1], [1, 0, 0], [1, 0, 0]], [[1, 1, 1], [0, 0, 1], [0, 0, 1]],
    [[1, 0, 0], [1, 0, 0], [1, 1, 1]], [[0, 0, 1], [0, 0, 1], [1, 1, 1]]
];

class Game {
    constructor() {
        this.grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
        this.cells = [];
        this.score = 0;
        this.alienBlocks = []; // Array of {x, y}

        this.gridContainer = document.getElementById('grid-container');
        this.scoreDisplay = document.getElementById('score-display');
        this.highScoreDisplay = document.getElementById('high-score-display');

        // Load high score
        this.highScore = parseInt(localStorage.getItem('antiGravityHighScore')) || 0;
        if (this.highScoreDisplay) this.highScoreDisplay.textContent = this.highScore;

        this.slots = [
            document.getElementById('slot-1'),
            document.getElementById('slot-2'),
            document.getElementById('slot-3')
        ];
        this.scoreDisplay = document.getElementById('score-display');

        this.draggedShape = null;
        this.dragOffset = { x: 0, y: 0 };
        this.originalSlot = null;

        this.initGrid();
        this.spawnShapes();
        this.bindEvents();
    }

    initGrid() {
        this.gridContainer.innerHTML = '';
        for (let y = 0; y < GRID_SIZE; y++) {
            this.cells[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                this.gridContainer.appendChild(cell);
                this.cells[y][x] = cell;
            }
        }
    }

    spawnShapes() {
        let allEmpty = true;
        this.slots.forEach(slot => {
            if (slot.children.length > 0) allEmpty = false;
        });

        if (allEmpty) {
            this.slots.forEach(slot => {
                let shapeData;
                // Cosmos mechanics: 10% chance to spawn a star shape (at 5000+)
                if (this.score >= 5000 && Math.random() < 0.1) {
                    shapeData = SPECIAL_SHAPES.STAR;
                } else {
                    shapeData = SHAPES[Math.floor(Math.random() * SHAPES.length)];
                }
                this.createShapeElement(shapeData, slot);
            });
        }

        this.checkGameOver();
    }

    createShapeElement(shapeMatrix, slot) {
        const shapeId = 'shape-' + Date.now() + '-' + Math.random();
        const shapeContainer = document.createElement('div');
        shapeContainer.className = 'shape-container';
        shapeContainer.id = shapeId;
        shapeContainer.dataset.matrix = JSON.stringify(shapeMatrix);

        const rows = shapeMatrix.length;
        const cols = shapeMatrix[0].length;

        // Use inline styles to size the container to fit the blocks
        shapeContainer.style.width = `${cols * CELL_SIZE + (cols - 1) * GAP}px`;
        shapeContainer.style.height = `${rows * CELL_SIZE + (rows - 1) * GAP}px`;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (shapeMatrix[y][x]) {
                    const block = document.createElement('div');
                    block.className = 'shape-block';
                    block.style.left = `${x * (CELL_SIZE + GAP)}px`;
                    block.style.top = `${y * (CELL_SIZE + GAP)}px`;
                    shapeContainer.appendChild(block);
                }
            }
        }

        slot.appendChild(shapeContainer);

        // Bind pointer events directly to the container
        shapeContainer.addEventListener('pointerdown', this.onPointerDown.bind(this));
    }

    bindEvents() {
        document.addEventListener('pointermove', this.onPointerMove.bind(this), { passive: false });
        document.addEventListener('pointerup', this.onPointerUp.bind(this));

        document.getElementById('restart-btn').addEventListener('click', () => {
            location.reload();
        });
    }

    onPointerDown(e) {
        // Find the closest .shape-container logic
        const target = e.target.closest('.shape-container');
        if (!target) return;

        e.preventDefault();

        this.draggedShape = target;
        this.originalSlot = target.parentElement;

        const rect = target.getBoundingClientRect();

        // Offset so we grab it exactly where we clicked
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;

        // Visual change
        target.classList.add('dragging');
        document.body.appendChild(target); // Move to body to drag over everything freely

        // Initial positioning
        this.moveElement(e.clientX, e.clientY);
        window.AudioManager.playClick();
    }

    onPointerMove(e) {
        if (!this.draggedShape) return;
        e.preventDefault(); // prevent scrolling

        this.moveElement(e.clientX, e.clientY);

        // Highlight logic
        this.clearHighlights();
        const hoveredCoords = this.getGridCoordinates(e.clientX, e.clientY);
        if (hoveredCoords) {
            const matrix = JSON.parse(this.draggedShape.dataset.matrix);
            if (this.canPlace(hoveredCoords.x, hoveredCoords.y, matrix)) {
                this.highlightCells(hoveredCoords.x, hoveredCoords.y, matrix, true);
            } else {
                this.highlightCells(hoveredCoords.x, hoveredCoords.y, matrix, false);
            }
        }
    }

    moveElement(x, y) {
        // Add an offset so your finger doesn't completely cover the shape on mobile
        const isMobile = window.innerWidth <= 600;
        const yOffset = isMobile ? -60 : 0;

        this.draggedShape.style.left = `${x - this.dragOffset.x}px`;
        this.draggedShape.style.top = `${y - this.dragOffset.y + yOffset}px`;
    }

    onPointerUp(e) {
        if (!this.draggedShape) return;

        const matrix = JSON.parse(this.draggedShape.dataset.matrix);
        // We use the pointer's final coordinates for dropping
        const hoveredCoords = this.getGridCoordinates(e.clientX, e.clientY);

        if (hoveredCoords && this.canPlace(hoveredCoords.x, hoveredCoords.y, matrix)) {
            // Check for Anti-Gravity effect
            if (window.ThemeManager && window.ThemeManager.isAntiGravityActive()) {
                // To do later: Float down logic
                this.placeBlocks(hoveredCoords.x, hoveredCoords.y, matrix);
            } else {
                this.placeBlocks(hoveredCoords.x, hoveredCoords.y, matrix);
            }
        } else {
            // Return to slot
            this.draggedShape.classList.remove('dragging');
            this.draggedShape.style.left = '';
            this.draggedShape.style.top = '';
            this.originalSlot.appendChild(this.draggedShape);
            window.AudioManager.playClick();
        }

        this.clearHighlights();
        this.draggedShape = null;
        this.originalSlot = null;
    }

    getGridCoordinates(pointerX, pointerY) {
        const gridRect = this.gridContainer.getBoundingClientRect();

        // Calculate offset for mobile finger avoidance if used
        const isMobile = window.innerWidth <= 600;
        const finalY = isMobile ? pointerY - 40 : pointerY;
        const finalX = pointerX;

        // Where is the top-left of the shape currently relative to grid?
        if (!this.draggedShape) return null;

        // Using element rect instead of pointer ensures snap uses the top-left of the shape
        const shapeRect = this.draggedShape.getBoundingClientRect();

        // If entirely outside the grid bounding box, ignore
        if (shapeRect.right < gridRect.left || shapeRect.left > gridRect.right ||
            shapeRect.bottom < gridRect.top || shapeRect.top > gridRect.bottom) {
            return null;
        }

        // Relative coordinates to the top left of grid
        const relativeX = shapeRect.left - gridRect.left;
        const relativeY = shapeRect.top - gridRect.top;

        // Calculate cell index (incorporating padding/gap approximation)
        const cellTotalSize = CELL_SIZE + GAP;

        // Add half a cell to round to nearest grid spot
        const gridX = Math.round((relativeX) / cellTotalSize);
        const gridY = Math.round((relativeY) / cellTotalSize);

        return { x: gridX, y: gridY };
    }

    canPlace(startX, startY, matrix) {
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[0].length; x++) {
                if (matrix[y][x]) {
                    const checkX = startX + x;
                    const checkY = startY + y;

                    if (checkX < 0 || checkX >= GRID_SIZE || checkY < 0 || checkY >= GRID_SIZE) return false;
                    if (this.grid[checkY][checkX] === 1) return false;
                }
            }
        }
        return true;
    }

    highlightCells(startX, startY, matrix, isValid) {
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[0].length; x++) {
                if (matrix[y][x]) {
                    const hX = startX + x;
                    const hY = startY + y;
                    if (hX >= 0 && hX < GRID_SIZE && hY >= 0 && hY < GRID_SIZE) {
                        if (isValid) {
                            this.cells[hY][hX].classList.add('hovered');
                        } else {
                            // Could add a 'invalid' class but keeping it simple
                            this.cells[hY][hX].style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                        }
                    }
                }
            }
        }
    }

    clearHighlights() {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                this.cells[y][x].classList.remove('hovered');
                this.cells[y][x].style.backgroundColor = ''; // Clear inline styles
            }
        }
    }

    placeBlocks(startX, startY, matrix) {
        window.AudioManager.playDrop();

        // Calculate score for placement
        let placedBlocksScore = 0;
        let hitSnake = false;

        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[0].length; x++) {
                if (matrix[y][x]) {
                    const cx = startX + x;
                    const cy = startY + y;
                    this.grid[cy][cx] = 1;
                    this.cells[cy][cx].classList.add('filled');

                    let blockScore = 10;

                    if (window.ThemeManager) {
                        // Check Eagle Bonus
                        const eagleIndex = window.ThemeManager.eagleCells.findIndex(c => c.x === cx && c.y === cy);
                        if (eagleIndex !== -1) {
                            blockScore *= 3;
                            window.ThemeManager.eagleCells.splice(eagleIndex, 1);
                            this.cells[cy][cx].classList.remove('eagle-bonus');
                        }

                        // Check Snake Hazard
                        const sx = window.ThemeManager.snakePos.x;
                        const sy = window.ThemeManager.snakePos.y;
                        if (window.ThemeManager.snakePos.isSnake && cy === sy && (cx === sx || cx === sx + 1)) {
                            hitSnake = true;
                        }
                    }

                    placedBlocksScore += blockScore;
                }
            }
        }

        // Handle Snake Game Over immediately
        if (hitSnake) {
            // Darken quickly for swamp feel
            document.getElementById('game-container').style.backgroundColor = '#000';
            this.triggerGameOver("Toxic Step! You placed a block on the Swamp Snake.");
            this.draggedShape.remove();
            return;
        }

        // Add Score
        this.addScore(placedBlocksScore);

        // Remove from DOM
        this.draggedShape.remove();

        // Check for lines
        this.checkLines();

        // Spawn more
        this.spawnShapes();
    }

    checkLines() {
        let linesCleared = 0;
        let cellsToClear = [];

        // Check Rows
        for (let y = 0; y < GRID_SIZE; y++) {
            let full = true;
            for (let x = 0; x < GRID_SIZE; x++) {
                if (this.grid[y][x] === 0) full = false;
            }
            if (full) {
                linesCleared++;
                for (let x = 0; x < GRID_SIZE; x++) cellsToClear.push({ x, y });
            }
        }

        // Check Cols
        for (let x = 0; x < GRID_SIZE; x++) {
            let full = true;
            for (let y = 0; y < GRID_SIZE; y++) {
                if (this.grid[y][x] === 0) full = false;
            }
            if (full) {
                linesCleared++;
                for (let y = 0; y < GRID_SIZE; y++) cellsToClear.push({ x, y });
            }
        }

        if (linesCleared > 0) {
            window.AudioManager.playClear();

            // Formula: 1 line = 100, 2 lines = 300, 3 lines = 600, etc.
            const lineScore = (linesCleared * (linesCleared + 1) / 2) * 100;
            this.addScore(lineScore);

            // Deduplicate clear array
            const uniqueClear = cellsToClear.filter((v, i, a) => a.findIndex(t => (t.x === v.x && t.y === v.y)) === i);

            uniqueClear.forEach(cell => {
                // Check for alien block
                const alienIdx = this.alienBlocks.findIndex(b => b.x === cell.x && b.y === cell.y);
                if (alienIdx !== -1) {
                    this.addScore(300);
                    this.alienBlocks.splice(alienIdx, 1);
                    this.cells[cell.y][cell.x].classList.remove('alien-block');
                }

                this.grid[cell.y][cell.x] = 0;
                this.cells[cell.y][cell.x].classList.remove('filled');

                // Animation
                this.cells[cell.y][cell.x].classList.add('clearing');
                setTimeout(() => {
                    this.cells[cell.y][cell.x].classList.remove('clearing');
                }, 400);
            });

            // After lines clear, check game over again
            setTimeout(() => this.checkGameOver(), 500);
        }
    }

    addScore(points) {
        this.score += points;
        this.scoreDisplay.textContent = this.score;
        this.scoreDisplay.style.transform = 'scale(1.3)';
        this.scoreDisplay.style.color = '#fff';

        // Check High Score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            if (this.highScoreDisplay) {
                this.highScoreDisplay.textContent = this.highScore;
                this.highScoreDisplay.style.color = '#fbbf24'; // Gold color for new record
            }
            localStorage.setItem('antiGravityHighScore', this.highScore);
        }

        setTimeout(() => {
            this.scoreDisplay.style.transform = 'scale(1)';
            this.scoreDisplay.style.color = 'var(--text-color)';
        }, 200);

        // Inform ThemeManager
        if (window.ThemeManager) {
            window.ThemeManager.checkScoreAndProcessTheme(this.score);
        }

        // Cosmos block color change
        if (this.score >= 7000) {
            this.updateBlockColors(this.score);
        }
    }

    updateBlockColors(score) {
        const stage = Math.floor((score - 7000) / 1000);
        const hue = (stage * 40) % 360;
        document.documentElement.style.setProperty('--block-color', `hsl(${hue}, 70%, 60%)`);
        document.documentElement.style.setProperty('--block-glow', `hsla(${hue}, 70%, 60%, 0.4)`);
    }

    shuffleGrid() {
        const filledCells = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (this.grid[y][x] === 1) {
                    filledCells.push({ x, y });
                }
            }
        }

        if (filledCells.length < 2) return;

        const positions = [...filledCells];
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
        positions.forEach(pos => newGrid[pos.y][pos.x] = 1);

        // Preserve alien blocks (2s)
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (this.grid[y][x] === 2) newGrid[y][x] = 2;
            }
        }

        this.grid = newGrid;

        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                this.cells[y][x].classList.remove('filled');
                if (this.grid[y][x] === 1) {
                    this.cells[y][x].classList.add('filled');
                }
            }
        }
    }

    spawnAlienBlock() {
        const emptyCells = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (this.grid[y][x] === 0) {
                    emptyCells.push({ x, y });
                }
            }
        }

        if (emptyCells.length === 0) return;

        for (let i = 0; i < 2 && emptyCells.length > 0; i++) {
            const idx = Math.floor(Math.random() * emptyCells.length);
            const cell = emptyCells.splice(idx, 1)[0];
            this.grid[cell.y][cell.x] = 2;
            this.cells[cell.y][cell.x].classList.add('alien-block');
            this.alienBlocks.push({ x: cell.x, y: cell.y });
        }
    }

    checkGameOver() {
        let canPlay = false;

        const shapesInPlay = [];
        this.slots.forEach(slot => {
            if (slot.children.length > 0) {
                const matrix = JSON.parse(slot.children[0].dataset.matrix);
                shapesInPlay.push(matrix);
            }
        });

        if (shapesInPlay.length === 0) return; // Wait for spawn

        // Check every available shape against every grid cell
        for (let shape of shapesInPlay) {
            for (let y = 0; y < GRID_SIZE; y++) {
                for (let x = 0; x < GRID_SIZE; x++) {
                    if (this.canPlace(x, y, shape)) {
                        canPlay = true;
                        break;
                    }
                }
                if (canPlay) break;
            }
            if (canPlay) break;
        }

        if (!canPlay) {
            this.triggerGameOver("No spaces left on grid.");
        }
    }

    triggerGameOver(reason) {
        window.AudioManager.playGameOver();
        const overlay = document.getElementById('game-over-overlay');
        const title = document.getElementById('game-over-title');

        document.getElementById('game-over-reason').textContent = reason;
        document.getElementById('final-score-display').textContent = this.score;
        overlay.classList.remove('hidden');
        overlay.style.pointerEvents = 'auto'; // Re-enable pointer events for the overlay button

        // Theme-specific cinematic Game Overs
        if (window.ThemeManager) {
            const theme = window.ThemeManager.themes[window.ThemeManager.currentThemeIndex].name;
            if (theme === "SWAMP" && reason.includes("Toxic")) {
                title.textContent = "TOXIC STEP!";
                title.style.color = "#ef4444";
                title.style.textShadow = "0 0 30px #ef4444";
            } else if (theme === "COSMOS") {
                title.textContent = "COSMIC COLLAPSE";
                title.style.color = "#e879f9";
                document.getElementById('grid-container').classList.add('anim-blackhole');
            } else if (theme === "FOREST" || theme === "SUMMIT") {
                title.textContent = "NATURE RECLAIMS";
                title.style.color = "#4ade80";
            } else {
                title.textContent = "GAME OVER";
                title.style.color = "#ff3333";
            }
        }
    }
}

// Ensure CSS custom property for cell size is available in JS
window.addEventListener('load', () => {
    // We compute the cell size dynamically so it aligns nicely
    const cssCellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'));
    if (!isNaN(cssCellSize)) {
        // We'll just rely on the CSS sizes as defined above
        window.game = new Game();
    } else {
        window.game = new Game();
    }
});
