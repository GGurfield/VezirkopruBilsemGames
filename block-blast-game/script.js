// block-blast/script.js

const BOARD_SIZE = 8;
const boardElement = document.getElementById('board');
const shapesContainer = document.getElementById('shapes-container');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score-val');
const restartBtn = document.getElementById('restart-btn');

let board = [];
let score = 0;
let bestScore = localStorage.getItem('blockBlastBestScore') || 0;

// Progression Variables
let gems = parseInt(localStorage.getItem('blockBlastGems')) || 0;
let unlockedThemes = JSON.parse(localStorage.getItem('blockBlastUnlockedThemes')) || [0];
let currentThemeIdx = parseInt(localStorage.getItem('blockBlastCurrentTheme')) || 0;
if (!unlockedThemes.includes(currentThemeIdx)) currentThemeIdx = 0;

// Audio
const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.3; // Lower volume for background bgMusic

// DOM Elements
const menuGemCount = document.getElementById('menu-gem-count');
const shopGemCount = document.getElementById('shop-gem-count');
const gameGemCount = document.getElementById('game-gem-count');
const screens = {
    start: document.getElementById('start-screen'),
    shop: document.getElementById('shop-screen'),
    game: document.getElementById('game-container')
};

// Theme Palettes
const THEMES = [
    { bg: '#0f172a', container: '#1e293b', board: '#334155', cell: '#475569' }, // Slate (Default)
    { bg: '#171717', container: '#262626', board: '#404040', cell: '#525252' }, // Neutral Dark
    { bg: '#020617', container: '#0f172a', board: '#1e293b', cell: '#334155' }, // Deep Blue
    { bg: '#1c1917', container: '#292524', board: '#44403c', cell: '#57534e' }, // Stone
    { bg: '#2e1065', container: '#3b0764', board: '#581c87', cell: '#6b21a8' }  // Deep Purple
];

// Update initial DOM state
bestScoreElement.textContent = bestScore;
updateGemDisplay();
applyTheme(currentThemeIdx); // defined below

// Define Block Colors
const COLORS = [
    'var(--color-1)', 'var(--color-2)', 'var(--color-3)',
    'var(--color-4)', 'var(--color-5)', 'var(--color-6)',
    'var(--color-7)', 'var(--color-8)'
];

// Define Shapes (1 = solid block, 0 = empty)
const SHAPES = [
    // 1x1
    { matrix: [[1]], colorIdx: 0 },
    // 1x2
    { matrix: [[1, 1]], colorIdx: 1 },
    { matrix: [[1], [1]], colorIdx: 1 },
    // 1x3
    { matrix: [[1, 1, 1]], colorIdx: 2 },
    { matrix: [[1], [1], [1]], colorIdx: 2 },
    // 1x4
    { matrix: [[1, 1, 1, 1]], colorIdx: 3 },
    { matrix: [[1], [1], [1], [1]], colorIdx: 3 },
    // 1x5
    { matrix: [[1, 1, 1, 1, 1]], colorIdx: 4 },
    { matrix: [[1], [1], [1], [1], [1]], colorIdx: 4 },
    // 2x2
    { matrix: [[1, 1], [1, 1]], colorIdx: 5 },
    // 3x3
    { matrix: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], colorIdx: 6 },
    // L-shapes (small)
    { matrix: [[1, 1], [1, 0]], colorIdx: 7 },
    { matrix: [[1, 1], [0, 1]], colorIdx: 7 },
    { matrix: [[1, 0], [1, 1]], colorIdx: 7 },
    { matrix: [[0, 1], [1, 1]], colorIdx: 7 },
    // L-shapes (large)
    { matrix: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], colorIdx: 1 },
    { matrix: [[0, 0, 1], [0, 0, 1], [1, 1, 1]], colorIdx: 2 },
    { matrix: [[1, 1, 1], [1, 0, 0], [1, 0, 0]], colorIdx: 3 },
    { matrix: [[1, 1, 1], [0, 0, 1], [0, 0, 1]], colorIdx: 4 }
];

function initGame(isRevive = false) {
    if (!isRevive) {
        score = 0;
        updateScore(0);
        board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    }
    renderBoard();
    gameOverScreen.classList.add('hidden');
    generateShapes();
    switchScreen('game');
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('board-cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (board[row][col]) {
                cell.classList.add('filled');
                cell.style.backgroundColor = board[row][col];
            }

            boardElement.appendChild(cell);
        }
    }
}

function generateShapes() {
    shapesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const randomShapeObj = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        createShapeElement(randomShapeObj);
    }
}

function createShapeElement(shapeObj) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('shape-wrapper');

    const shapeEl = document.createElement('div');
    shapeEl.classList.add('shape');

    const rows = shapeObj.matrix.length;
    const cols = shapeObj.matrix[0].length;

    shapeEl.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
    shapeEl.style.gridTemplateRows = `repeat(${rows}, 20px)`;

    const color = COLORS[shapeObj.colorIdx];

    // Store shape data on the wrapper for drag functionality
    wrapper.dataset.matrix = JSON.stringify(shapeObj.matrix);
    wrapper.dataset.color = color;
    wrapper.dataset.rows = rows;
    wrapper.dataset.cols = cols;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const block = document.createElement('div');
            if (shapeObj.matrix[r][c]) {
                block.classList.add('shape-block');
                block.style.backgroundColor = color;
            } else {
                // Invisible placeholder for grid alignment
                block.style.width = '20px';
                block.style.height = '20px';
            }
            shapeEl.appendChild(block);
        }
    }

    wrapper.appendChild(shapeEl);
    shapesContainer.appendChild(wrapper);

    // Add event listeners for Drag and Drop
    addDragListeners(wrapper);
}

// Drag and drop mechanics to be implemented...
function addDragListeners(el) {
    el.addEventListener('pointerdown', handleDragStart);
}

let activeShape = null;
let startX, startY;

function handleDragStart(e) {
    if (activeShape) return; // Prevent multiple drags

    activeShape = e.currentTarget;
    const rectBefore = activeShape.getBoundingClientRect();

    // Calculate relative click position inside the unscaled shape
    const relX = (e.clientX - rectBefore.left) / rectBefore.width;
    const relY = (e.clientY - rectBefore.top) / rectBefore.height;

    activeShape.classList.add('dragging');
    activeShape.style.position = 'absolute';

    // Scale shape to match board cells
    const sampleCell = boardElement.querySelector('.board-cell');
    const cellSize = sampleCell ? sampleCell.getBoundingClientRect().width : 40;
    const shapeEl = activeShape.querySelector('.shape');
    const allBlocks = activeShape.querySelectorAll('.shape > div');

    shapeEl.style.gap = '4px';
    shapeEl.style.gridTemplateColumns = `repeat(${activeShape.dataset.cols}, ${cellSize}px)`;
    shapeEl.style.gridTemplateRows = `repeat(${activeShape.dataset.rows}, ${cellSize}px)`;
    allBlocks.forEach(block => {
        block.style.width = `${cellSize}px`;
        block.style.height = `${cellSize}px`;
    });

    // Parent coordinates to absolute
    document.body.appendChild(activeShape);

    const rectAfter = activeShape.getBoundingClientRect();
    startX = relX * rectAfter.width;
    startY = relY * rectAfter.height;

    moveShape(e.clientX, e.clientY);

    document.addEventListener('pointermove', handleDragMove);
    document.addEventListener('pointerup', handleDragEnd);
}

function handleDragMove(e) {
    if (!activeShape) return;
    moveShape(e.clientX, e.clientY);
}

function moveShape(clientX, clientY) {
    // Move element under finger, offset slightly up so it's not hidden by finger
    const x = clientX - startX;
    const y = clientY - startY - 60; // 60px offset for touch visibility of larger shape

    activeShape.style.left = `${x}px`;
    activeShape.style.top = `${y}px`;
}

function handleDragEnd(e) {
    if (!activeShape) return;

    document.removeEventListener('pointermove', handleDragMove);
    document.removeEventListener('pointerup', handleDragEnd);

    const shapeMatrix = JSON.parse(activeShape.dataset.matrix);
    const color = activeShape.dataset.color;
    const shapeBlocks = activeShape.querySelectorAll('.shape-block');

    let validDrop = true;
    let targetCells = [];

    // Check collision for each solid block
    for (let block of shapeBlocks) {
        const rect = block.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Hide active shape temporarily to find elements underneath
        activeShape.style.display = 'none';
        const elementsUnder = document.elementsFromPoint(centerX, centerY);
        activeShape.style.display = 'flex';

        const cell = elementsUnder.find(el => el.classList.contains('board-cell'));

        if (!cell || cell.classList.contains('filled')) {
            validDrop = false;
            break;
        }
        targetCells.push(cell);
    }

    if (validDrop && targetCells.length === shapeBlocks.length) {
        // Place shape
        targetCells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            board[row][col] = color;

            cell.classList.add('filled');
            cell.style.backgroundColor = color;
            cell.classList.add('dropped');
            setTimeout(() => cell.classList.remove('dropped'), 200);
        });

        updateScore(shapeBlocks.length);
        activeShape.remove();

        // Check for line clears
        const clearedLines = checkAndClearLines();

        // Check if container is empty
        if (shapesContainer.children.length === 0) {
            generateShapes();
        }

        // Check Game Over slightly after to let generation happen
        setTimeout(checkGameOver, 250);

    } else {
        // Invalid drop, return to container
        activeShape.classList.remove('dragging');
        activeShape.style.position = 'relative';
        activeShape.style.left = '0';
        activeShape.style.top = '0';

        // Reset scale
        const shapeEl = activeShape.querySelector('.shape');
        const allBlocks = activeShape.querySelectorAll('.shape > div');
        shapeEl.style.gap = '2px';
        shapeEl.style.gridTemplateColumns = `repeat(${activeShape.dataset.cols}, 20px)`;
        shapeEl.style.gridTemplateRows = `repeat(${activeShape.dataset.rows}, 20px)`;
        allBlocks.forEach(block => {
            block.style.width = '20px';
            block.style.height = '20px';
        });

        shapesContainer.appendChild(activeShape);
    }

    activeShape = null;
}

function checkAndClearLines() {
    let rowsToClear = [];
    let colsToClear = [];

    // Check rows
    for (let r = 0; r < BOARD_SIZE; r++) {
        let fullRow = true;
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (!board[r][c]) {
                fullRow = false;
                break;
            }
        }
        if (fullRow) rowsToClear.push(r);
    }

    // Check columns
    for (let c = 0; c < BOARD_SIZE; c++) {
        let fullCol = true;
        for (let r = 0; r < BOARD_SIZE; r++) {
            if (!board[r][c]) {
                fullCol = false;
                break;
            }
        }
        if (fullCol) colsToClear.push(c);
    }

    const totalLines = rowsToClear.length + colsToClear.length;
    if (totalLines === 0) return 0;

    // Clear and animate
    let cellsToClear = new Set(); // Use Set to avoid double clearing intersections

    rowsToClear.forEach(r => {
        for (let c = 0; c < BOARD_SIZE; c++) {
            cellsToClear.add(`${r},${c}`);
        }
    });

    colsToClear.forEach(c => {
        for (let r = 0; r < BOARD_SIZE; r++) {
            cellsToClear.add(`${r},${c}`);
        }
    });

    // Apply visual clear
    cellsToClear.forEach(coord => {
        const [r, c] = coord.split(',').map(Number);
        board[r][c] = null; // Clear logic

        const cellSelector = document.querySelector(`.board-cell[data-row="${r}"][data-col="${c}"]`);
        if (cellSelector) {
            cellSelector.classList.add('popping');
            setTimeout(() => {
                cellSelector.classList.remove('popping', 'filled');
                cellSelector.style.backgroundColor = '';
            }, 300);
        }
    });

    // Score calculation (combo multiplier)
    const points = (cellsToClear.size * 2) + (totalLines * 10);

    // Check if board is completely empty (Perfect Clear)
    let isBoardEmpty = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== null) {
                isBoardEmpty = false;
                break;
            }
        }
        if (!isBoardEmpty) break;
    }

    let extraPoints = 0;
    if (isBoardEmpty && score > 0) { // Check score>0 so we don't trigger on init
        extraPoints = 100; // Bonus for perfect clear
        triggerPerfectClearFlash();
    }
    
    // Always update score for cleared lines
    updateScore(points + extraPoints);

    // Easier Gem Earning System: Base it directly on line clears
    if (totalLines > 0) { // We have points > 0 since totalLines > 0
        let gemsEarned = totalLines; // 1 gem per line
        
        // Multiplier bonuses for multi-line clears
        if (totalLines === 2) gemsEarned = 3;
        else if (totalLines === 3) gemsEarned = 5;
        else if (totalLines >= 4) gemsEarned = 10;
        
        // Bonus for perfect clear
        if (isBoardEmpty) gemsEarned += 10;
        
        addGems(gemsEarned);
    }
    
    return totalLines;
}

function addGems(amount) {
    if (amount === 0) return;
    gems += amount;
    localStorage.setItem('blockBlastGems', gems);
    updateGemDisplay();
}

function updateGemDisplay() {
    menuGemCount.textContent = gems;
    shopGemCount.textContent = gems;
    gameGemCount.textContent = gems;
}

// Navigation & Meta Logic
function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
    
    // Play music when entering game screen if enabled
    if (screenName === 'game' && document.getElementById('music-toggle').checked) {
        bgMusic.play().catch(e => console.log("Audio play prevented by browser restrictions until user interacts again."));
    } else if (screenName !== 'game') {
        bgMusic.pause(); // Pause music when leaving game screen
    }
}

function applyTheme(idx) {
    const newTheme = THEMES[idx];
    document.documentElement.style.setProperty('--bg-color', newTheme.bg);
    document.documentElement.style.setProperty('--container-bg', newTheme.container);
    document.documentElement.style.setProperty('--board-bg', newTheme.board);
    document.documentElement.style.setProperty('--cell-bg', newTheme.cell);
}

// Remove the old perfect-clear theme rotation logic from changeTheme
// and replace it with a simple visual flash
function triggerPerfectClearFlash() {
    document.body.classList.add('theme-flash');
    setTimeout(() => document.body.classList.remove('theme-flash'), 500);
}

function revive() {
    if (gems >= 5) {
        addGems(-5);
        
        // Clear a 4x4 area in the center to give the player breathing room
        const startRow = Math.floor(BOARD_SIZE / 2) - 2;
        const startCol = Math.floor(BOARD_SIZE / 2) - 2;
        
        for (let r = startRow; r < startRow + 4; r++) {
            for (let c = startCol; c < startCol + 4; c++) {
                if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
                    board[r][c] = null;
                    const cellSelector = document.querySelector(`.board-cell[data-row="${r}"][data-col="${c}"]`);
                    if (cellSelector) {
                        cellSelector.classList.remove('filled', 'popping');
                        cellSelector.style.backgroundColor = '';
                    }
                }
            }
        }
        
        gameOverScreen.classList.add('hidden'); // Hide game over screen
        // Re-check for line clears in case clearing the 4x4 area completed lines
        checkAndClearLines();
        // Re-check game over state after clearing
        setTimeout(checkGameOver, 100);
    } else {
        alert("Not enough gems to continue!");
    }
}

// Shop Logic
function renderShop() {
    const list = document.getElementById('themes-list');
    list.innerHTML = '';
    
    THEMES.forEach((theme, idx) => {
        const isUnlocked = unlockedThemes.includes(idx);
        const isActive = currentThemeIdx === idx;
        const price = idx === 0 ? 0 : idx * 5; // e.g. 5, 10, 15, 20 gems
        
        const card = document.createElement('div');
        card.className = `theme-card ${isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''}`;
        
        let labelText = isActive ? 'EQUIPPED' : (isUnlocked ? 'EQUIP' : `${price} 💎`);
        
        card.innerHTML = `
            <div class="theme-preview" style="background:${theme.bg};">
                <div class="inner-box" style="background:${theme.board};"></div>
            </div>
            <div class="theme-name">Theme ${idx + 1}</div>
            <div class="theme-price">${labelText}</div>
        `;
        
        card.addEventListener('click', () => handleThemeClick(idx, price));
        list.appendChild(card);
    });
    updateGemDisplay(); // Ensure gem count is updated in shop
}

function handleThemeClick(idx, price) {
    if (unlockedThemes.includes(idx)) {
        // Equip
        currentThemeIdx = idx;
        localStorage.setItem('blockBlastCurrentTheme', idx);
        applyTheme(idx);
        renderShop(); // re-render to show active
    } else {
        // Purchase
        if (gems >= price) {
            addGems(-price);
            unlockedThemes.push(idx);
            localStorage.setItem('blockBlastUnlockedThemes', JSON.stringify(unlockedThemes));
            renderShop(); // re-render to unlock
        } else {
            alert(`You need ${price} gems to unlock this theme!`);
        }
    }
}

function checkGameOver() {
    const availableShapes = Array.from(shapesContainer.querySelectorAll('.shape-wrapper')).map(el => JSON.parse(el.dataset.matrix));

    if (availableShapes.length === 0) return; // Should not happen, but just in case

    let canPlaceAny = false;

    for (let shapeMatrix of availableShapes) {
        if (canPlaceShape(shapeMatrix)) {
            canPlaceAny = true;
            break;
        }
    }

    // Update buttons based on state
    const reviveBtn = document.getElementById('revive-btn');
    if (gems >= 5) {
        reviveBtn.style.opacity = '1';
        reviveBtn.style.pointerEvents = 'auto';
    } else {
        reviveBtn.style.opacity = '0.5';
        reviveBtn.style.pointerEvents = 'auto'; // Keep clickable to show alert
    }

    if (!canPlaceAny) {
        // Game Over
        finalScoreElement.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }
}

function canPlaceShape(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    for (let r = 0; r <= BOARD_SIZE - rows; r++) {
        for (let c = 0; c <= BOARD_SIZE - cols; c++) {
            let canPlaceHere = true;

            // Check each block of the shape at this offset
            for (let sr = 0; sr < rows; sr++) {
                for (let sc = 0; sc < cols; sc++) {
                    if (matrix[sr][sc] === 1) {
                        if (board[r + sr][c + sc] !== null) {
                            canPlaceHere = false;
                            break;
                        }
                    }
                }
                if (!canPlaceHere) break;
            }

            if (canPlaceHere) return true;
        }
    }
    return false;
}

function updateScore(addedPoints = 0) {
    score += addedPoints;
    scoreElement.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = bestScore;
        localStorage.setItem('blockBlastBestScore', bestScore);
    }
}

restartBtn.addEventListener('click', () => initGame(false));
document.getElementById('quit-btn').addEventListener('click', () => {
    switchScreen('start');
});
document.getElementById('revive-btn').addEventListener('click', revive);

// Main Menu Listeners
document.getElementById('btn-play').addEventListener('click', () => initGame());
document.getElementById('btn-shop').addEventListener('click', () => {
    renderShop();
    switchScreen('shop');
});
document.getElementById('btn-shop-back').addEventListener('click', () => switchScreen('start'));

// Audio Toggle
document.getElementById('music-toggle').addEventListener('change', (e) => {
    if (e.target.checked) {
        bgMusic.play().catch(e => console.log(e));
    } else {
        bgMusic.pause();
    }
});

// Remove auto-start, wait for player to click play.
// initGame();
