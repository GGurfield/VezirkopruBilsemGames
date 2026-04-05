class Game {
    constructor() {
        this.rows = 8;
        this.cols = 7;
        this.grid = [];
        this.selectedTiles = [];
        this.score = 0;
        this.isGameOver = false;
        this.isSelecting = false;
        this.isProcessingSubmission = false;
        this.queuedSpecials = []; // Queue for special tiles to be spawned

        this.init();
    }

    init() {
        this.createGrid();
        this.render();
        this.setupEvents();
    }

    createGrid() {
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                // Ensure no special tiles at start
                this.grid[r][c] = this.createRandomTile(r, c, 'normal');
            }
        }
    }

    createRandomTile(r, c, type = 'normal') {
        const letters = Object.keys(TURKISH_LETTER_FREQUENCIES);
        const weights = Object.values(TURKISH_LETTER_FREQUENCIES);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let letter = 'A';

        for (let i = 0; i < letters.length; i++) {
            if (random < weights[i]) {
                letter = letters[i];
                break;
            }
            random -= weights[i];
        }

        return {
            letter,
            type,
            r,
            c,
            id: Math.random().toString(36).substr(2, 9),
            el: null
        };
    }

    render() {
        const container = document.getElementById('grid-container');
        document.getElementById('score').textContent = `Puan: ${this.score}`;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const tile = this.grid[r][c];
                if (!tile) continue;

                if (!tile.el) {
                    const el = document.createElement('div');
                    el.className = `tile ${tile.type}`;
                    el.textContent = tile.letter;
                    el.dataset.id = tile.id;
                    container.appendChild(el);
                    tile.el = el;

                    const isOffset = c % 2 !== 0;
                    el.style.left = `${c * 60}px`;
                    el.style.top = `-60px`;
                    el.dataset.r = r;
                    el.dataset.c = c;

                    void el.offsetWidth;
                }

                const isOffset = c % 2 !== 0;
                tile.el.className = `tile ${tile.type}`; // Refresh type classes
                tile.el.dataset.r = r;
                tile.el.dataset.c = c;
                tile.el.style.left = `${c * 60}px`;
                tile.el.style.top = `${r * 60 + (isOffset ? 30 : 0)}px`;

                if (this.selectedTiles.includes(tile)) {
                    tile.el.classList.add('selected');
                } else {
                    tile.el.classList.remove('selected');
                }
            }
        }

        const submitBtn = document.getElementById('submit-word');
        if (submitBtn) {
            submitBtn.disabled = this.selectedTiles.length < 3 || this.isProcessingSubmission;
        }
    }

    setupEvents() {
        const container = document.getElementById('grid-container');
        const submitBtn = document.getElementById('submit-word');

        container.addEventListener('mousedown', (e) => {
            if (this.isGameOver || this.isProcessingSubmission) return;
            const tileEl = e.target.closest('.tile');
            if (tileEl) {
                this.isSelecting = true;
                const r = parseInt(tileEl.dataset.r);
                const c = parseInt(tileEl.dataset.c);
                const tileData = this.grid[r][c];

                if (this.selectedTiles.length > 0) {
                    const lastTile = this.selectedTiles[this.selectedTiles.length - 1];
                    if (lastTile !== tileData && !this.isAdjacent(lastTile.r, lastTile.c, r, c)) {
                        this.selectedTiles = [];
                    }
                }
                this.selectTile(tileData);
            }
        });

        container.addEventListener('mouseover', (e) => {
            if (this.isSelecting && !this.isGameOver && !this.isProcessingSubmission) {
                const tileEl = e.target.closest('.tile');
                if (tileEl) {
                    const r = parseInt(tileEl.dataset.r);
                    const c = parseInt(tileEl.dataset.c);
                    this.selectTile(this.grid[r][c]);
                }
            }
        });

        window.addEventListener('mouseup', () => {
            this.isSelecting = false;
        });

        container.addEventListener('dblclick', (e) => {
            if (this.isGameOver || this.isProcessingSubmission) return;
            const tileEl = e.target.closest('.tile');
            if (tileEl) {
                const r = parseInt(tileEl.dataset.r);
                const c = parseInt(tileEl.dataset.c);
                const tile = this.grid[r][c];
                if (this.selectedTiles[this.selectedTiles.length - 1] === tile && this.selectedTiles.length >= 3) {
                    this.submitWord();
                }
            }
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitWord();
            });
        }

        container.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    selectTile(tileData) {
        if (!tileData) return;

        if (this.selectedTiles.includes(tileData)) {
            const index = this.selectedTiles.indexOf(tileData);
            this.selectedTiles = this.selectedTiles.slice(0, index + 1);
        } else {
            if (this.selectedTiles.length > 0) {
                const lastTile = this.selectedTiles[this.selectedTiles.length - 1];
                if (this.isAdjacent(lastTile.r, lastTile.c, tileData.r, tileData.c)) {
                    this.selectedTiles.push(tileData);
                } else if (!this.isSelecting) {
                    this.selectedTiles = [tileData];
                }
            } else {
                this.selectedTiles.push(tileData);
            }
        }
        this.render();
    }

    isAdjacent(r1, c1, r2, c2) {
        const dc = Math.abs(c1 - c2);
        const dr = Math.abs(r1 - r2);
        if (dc > 1) return false;
        if (dc === 0) return dr === 1;
        const isC1Offset = c1 % 2 !== 0;
        if (isC1Offset) {
            return (r2 === r1 || r2 === r1 + 1);
        } else {
            return (r2 === r1 || r2 === r1 - 1);
        }
    }

    async submitWord() {
        if (this.selectedTiles.length < 3 || this.isProcessingSubmission) return;

        this.isProcessingSubmission = true;
        const currentSelection = [...this.selectedTiles];
        const word = currentSelection.map(t => t.letter).join('');

        this.selectedTiles = [];
        this.render();

        try {
            const result = await validateAndGetMeaning(word);
            if (result.isValid) {
                await this.handleValidWord(word, currentSelection, result.meaning);
            } else {
                this.handleInvalidWord(word);
            }
        } finally {
            this.isProcessingSubmission = false;
            this.render();
        }
    }

    handleInvalidWord(word) {
        const container = document.getElementById('grid-container');
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 400);

        const speechEl = document.getElementById('wolf-speech');
        speechEl.textContent = `"${word}"? Bozkırda böyle bir kelime yok!`;
    }

    async handleValidWord(word, selectedTiles, meaning) {
        let baseWordScore = 0;
        let scoreBonus = 0;
        let scoreMultiplier = 1;

        for (let t of selectedTiles) {
            baseWordScore += TURKISH_LETTER_SCORES[t.letter] || 1;

            // Handle special tile effects
            if (t.type === 'green') scoreBonus += 10;
            if (t.type === 'gold') scoreMultiplier *= 2;
            if (t.type === 'diamond') scoreMultiplier *= 5;

            if (t.el) {
                t.el.style.opacity = '0';
                t.el.style.transform = 'scale(0.5)';
            }
            this.grid[t.r][t.c] = null;
        }

        const lengthMultiplier = Math.max(1, word.length - 2);
        const finalWordScore = (baseWordScore * lengthMultiplier + scoreBonus) * scoreMultiplier;
        this.score += finalWordScore;

        // Queue new special tiles
        this.queuedSpecials.push('fire'); // One red tile per word
        if (word.length >= 5) this.queuedSpecials.push('green');
        if (finalWordScore >= 50) this.queuedSpecials.push('gold');
        if (finalWordScore >= 100) this.queuedSpecials.push('diamond');

        document.getElementById('word-meaning').textContent = meaning;

        const wolfStatus = document.getElementById('wolf-status');
        const speechEl = document.getElementById('wolf-speech');
        speechEl.textContent = `${word}! ${finalWordScore >= 100 ? 'EFSANEVİ!' : (word.length >= 6 ? 'HARİKA!' : 'Tebrikler!')}`;

        wolfStatus.classList.add('howl');
        setTimeout(() => wolfStatus.classList.remove('howl'), 1000);

        const listEl = document.getElementById('word-list');
        const li = document.createElement('li');
        li.textContent = `${word} (+${finalWordScore})`;
        listEl.insertBefore(li, listEl.firstChild);
        if (listEl.children.length > 8) listEl.lastChild.remove();

        await new Promise(r => setTimeout(r, 400)); // Wait for tile removal animation

        for (let t of selectedTiles) {
            if (t.el) t.el.remove();
        }

        await this.applyGravity();
        this.checkForFireTilesMove();
    }

    async applyGravity() {
        for (let c = 0; c < this.cols; c++) {
            let emptySpaces = 0;
            // Shift down existing tiles
            for (let r = this.rows - 1; r >= 0; r--) {
                if (this.grid[r][c] === null) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    const tile = this.grid[r][c];
                    this.grid[r + emptySpaces][c] = tile;
                    tile.r = r + emptySpaces;
                    this.grid[r][c] = null;
                }
            }
            // Add new tiles at the top
            for (let i = 0; i < emptySpaces; i++) {
                const type = this.queuedSpecials.shift() || 'normal';
                const r = emptySpaces - 1 - i;
                const newTile = this.createRandomTile(r, c, type);
                this.grid[r][c] = newTile;
            }
        }
        this.render();
        // Give time for gravity transition
        await new Promise(r => setTimeout(r, 400));
    }

    checkForFireTilesMove() {
        for (let r = this.rows - 1; r >= 0; r--) {
            for (let c = 0; c < this.cols; c++) {
                const tile = this.grid[r][c];
                if (tile && tile.type === 'fire') {
                    if (r === this.rows - 1) {
                        this.gameOver();
                    } else {
                        const below = this.grid[r + 1][c];
                        if (below && below.type !== 'fire') {
                            this.grid[r + 1][c] = tile;
                            tile.r = r + 1;
                            tile.el.dataset.r = r + 1;
                            this.grid[r][c] = below;
                            below.r = r;
                            below.el.dataset.r = r;
                        }
                    }
                }
            }
        }
        this.render();
    }

    gameOver() {
        this.isGameOver = true;
        alert("Oyun Bitti! Ateş karosu yere ulaştı. Toplam Puan: " + this.score);
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
