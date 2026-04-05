let board = [];
let displayBoard = [];
let lives = 3;
const maxLives = 3;
let score = 0;
let selectedCell = null;
let highlightedDigit = null;

function initGame() {
    board = Array(9).fill().map(() => Array(9).fill(0));
    solve(board);
    
    displayBoard = board.map(row => row.map(v => ({ val: v, fixed: true })));
    
    let holes = 45;
    while(holes > 0) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        if (displayBoard[r][c].val !== 0) {
            displayBoard[r][c].val = 0;
            displayBoard[r][c].fixed = false;
            holes--;
        }
    }
    
    lives = 3;
    score = 0;
    selectedCell = null;
    highlightedDigit = null;
    
    document.getElementById('game-over-screen').classList.add('hidden');
    updateUI();
    renderBoard();
}

function solve(b) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (b[r][c] === 0) {
                let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                shuffle(nums);
                for (let num of nums) {
                    if (isValid(b, r, c, num)) {
                        b[r][c] = num;
                        if (solve(b)) return true;
                        b[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(b, r, c, num) {
    for (let i = 0; i < 9; i++) {
        if (b[r][i] === num) return false;
        if (b[i][c] === num) return false;
    }
    let startRow = Math.floor(r / 3) * 3;
    let startCol = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (b[startRow + i][startCol + j] === num) return false;
        }
    }
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderBoard() {
    const container = document.getElementById('sudoku-board');
    container.innerHTML = '';
    
    for (let b = 0; b < 9; b++) {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block';
        blockDiv.dataset.block = b;
        
        for (let idx = 0; idx < 9; idx++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            
            let r = Math.floor(b / 3) * 3 + Math.floor(idx / 3);
            let c = (b % 3) * 3 + (idx % 3);
            
            cellDiv.dataset.r = r;
            cellDiv.dataset.c = c;
            
            let { val, fixed } = displayBoard[r][c];
            if (val !== 0) {
                cellDiv.textContent = val;
                cellDiv.classList.add(fixed ? 'fixed' : 'user-input');
                if (val === highlightedDigit) {
                    cellDiv.classList.add('highlighted-digit');
                }
            }
            
            if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
                cellDiv.classList.add('selected');
            }
            
            cellDiv.addEventListener('click', () => selectCell(r, c));
            blockDiv.appendChild(cellDiv);
        }
        container.appendChild(blockDiv);
    }
}

function selectCell(r, c) {
    if (lives <= 0) return;
    document.querySelectorAll('.cell').forEach(el => el.classList.remove('selected'));
    selectedCell = { r, c };
    let cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
    if (cell) cell.classList.add('selected');
    
    let {val} = displayBoard[r][c];
    if (val !== 0) {
        setHighlightedDigit(val);
    }
}

function setHighlightedDigit(num) {
    highlightedDigit = num;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('highlighted-digit');
        if (cell.textContent !== '' && parseInt(cell.textContent) === highlightedDigit) {
            cell.classList.add('highlighted-digit');
        }
    });
}

function handleInput(num) {
    setHighlightedDigit(num);
    
    if (!selectedCell || lives <= 0) return;
    let { r, c } = selectedCell;
    
    if (displayBoard[r][c].fixed) return;
    if (displayBoard[r][c].val !== 0) return; 
    
    if (num === board[r][c]) {
        displayBoard[r][c].val = num;
        displayBoard[r][c].fixed = false;
        score += 10;
        updateCellDOM(r, c);
        updateUI();
        checkBandClear(r, c);
    } else {
        lives--;
        updateUI();
        triggerErrorAnim(r, c);
        if (lives === 0) {
            setTimeout(gameOver, 500);
        }
    }
}

function updateCellDOM(r, c) {
    let cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
    if (cell) {
        let { val, fixed } = displayBoard[r][c];
        cell.textContent = val === 0 ? '' : val;
        cell.className = 'cell';
        if (val !== 0) {
            cell.classList.add(fixed ? 'fixed' : 'user-input');
            if (val === highlightedDigit) {
                cell.classList.add('highlighted-digit');
            }
        }
        if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
            cell.classList.add('selected');
        }
    }
}

function triggerErrorAnim(r, c) {
    let cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
    if (cell) {
        cell.classList.remove('error-anim');
        void cell.offsetWidth;
        cell.classList.add('error-anim');
    }
}

function checkBandClear(r, c) {
    let hBandIndex = Math.floor(r / 3);
    let vBandIndex = Math.floor(c / 3);
    
    let isHFull = true;
    for (let i = hBandIndex * 3; i < hBandIndex * 3 + 3; i++) {
        for (let j = 0; j < 9; j++) {
            if (displayBoard[i][j].val === 0) {
                isHFull = false;
                break;
            }
        }
    }
    
    let isVFull = true;
    for (let i = 0; i < 9; i++) {
        for (let j = vBandIndex * 3; j < vBandIndex * 3 + 3; j++) {
            if (displayBoard[i][j].val === 0) {
                isVFull = false;
                break;
            }
        }
    }
    
    if (isHFull || isVFull) {
        handleBandClear(isHFull ? hBandIndex : -1, isVFull ? vBandIndex : -1);
    }
}

function handleBandClear(hBandIndex, vBandIndex) {
    let blocksToClear = new Set();
    if (hBandIndex !== -1) {
        blocksToClear.add(hBandIndex * 3);
        blocksToClear.add(hBandIndex * 3 + 1);
        blocksToClear.add(hBandIndex * 3 + 2);
    }
    if (vBandIndex !== -1) {
        blocksToClear.add(vBandIndex);
        blocksToClear.add(vBandIndex + 3);
        blocksToClear.add(vBandIndex + 6);
    }
    
    blocksToClear.forEach(b => {
        let blockDiv = document.querySelector(`.block[data-block="${b}"]`);
        if (blockDiv) {
            blockDiv.style.animation = "band-clear 0.6s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53)";
        }
    });
    
    selectedCell = null;
    
    setTimeout(() => {
        let clears = (hBandIndex !== -1 && vBandIndex !== -1) ? 2 : 1;
        score += 100 * clears;
        lives = Math.min(maxLives, lives + clears);
        updateUI();
        
        let cellsToGenerate = [];
        
        if (hBandIndex !== -1) {
            for (let i = hBandIndex * 3; i < hBandIndex * 3 + 3; i++) {
                for (let j = 0; j < 9; j++) {
                    board[i][j] = 0;
                    displayBoard[i][j].val = 0;
                    cellsToGenerate.push({r: i, c: j});
                }
            }
        }
        
        if (vBandIndex !== -1) {
            for (let i = 0; i < 9; i++) {
                for (let j = vBandIndex * 3; j < vBandIndex * 3 + 3; j++) {
                    if (board[i][j] !== 0) { 
                        board[i][j] = 0;
                        displayBoard[i][j].val = 0;
                        cellsToGenerate.push({r: i, c: j});
                    }
                }
            }
        }
        
        solve(board);
        
        let holesToPoke = (hBandIndex !== -1 && vBandIndex !== -1) ? 25 : 15;
        
        cellsToGenerate.forEach(({r, c}) => {
            displayBoard[r][c].val = board[r][c];
            displayBoard[r][c].fixed = true;
        });
        
        shuffle(cellsToGenerate);
        for(let i=0; i<holesToPoke; i++) {
            let {r, c} = cellsToGenerate[i];
            displayBoard[r][c].val = 0;
            displayBoard[r][c].fixed = false;
        }
        
        renderBoard();
        
    }, 600);
}

function updateUI() {
    document.getElementById('score').textContent = score;
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((h, index) => {
        if (index < lives) {
            h.classList.add('active');
        } else {
            h.classList.remove('active');
        }
    });
}

function gameOver() {
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over-screen').classList.remove('hidden');
}

document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        let val = e.target.dataset.val;
        if (val) handleInput(parseInt(val));
    });
});

document.getElementById('restart-btn').addEventListener('click', initGame);

document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        handleInput(parseInt(e.key));
    }
    
    if (selectedCell) {
        let { r, c } = selectedCell;
        let moved = false;
        if (e.key === 'ArrowUp') { r = Math.max(0, r - 1); moved = true; }
        if (e.key === 'ArrowDown') { r = Math.min(8, r + 1); moved = true; }
        if (e.key === 'ArrowLeft') { c = Math.max(0, c - 1); moved = true; }
        if (e.key === 'ArrowRight') { c = Math.min(8, c + 1); moved = true; }
        
        if (moved) {
            e.preventDefault();
            selectCell(r, c);
        }
    }
});

initGame();
