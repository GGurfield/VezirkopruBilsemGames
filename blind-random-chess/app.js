const PIECE_CHARS = {
    wp: '♙', wn: '♘', wb: '♗', wr: '♖', wq: '♕', wk: '♔',
    bp: '♟', bn: '♞', bb: '♝', br: '♜', bq: '♛', bk: '♚'
};

class AudioEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playMove() {
        this.beep(400, 0.1, 'square');
    }

    playCapture() {
        this.beep(200, 0.05, 'sawtooth');
        setTimeout(() => this.beep(150, 0.1, 'sawtooth'), 50);
    }

    playGameOver() {
        this.beep(300, 0.2, 'sine');
        setTimeout(() => this.beep(200, 0.2, 'sine'), 200);
        setTimeout(() => this.beep(100, 0.4, 'sine'), 400);
    }

    beep(freq, duration, type) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}

class Game {
    constructor() {
        this.board = Array(64).fill(null);
        this.turn = 'w';
        this.selectedSquare = null;
        this.validMoves = [];
        this.history = [];
        this.markers = Array(64).fill(null);
        this.gameOver = false;
        this.winner = null;
        this.lastMove = null;

        this.initializeRandomBoard();
    }

    initializeRandomBoard() {
        this.board = Array(64).fill(null);
        const pieces = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'];

        const whitePieces = [...pieces];
        const blackPieces = [...pieces];

        this.shuffle(blackPieces);
        for (let i = 0; i < 16; i++) {
            this.board[i] = 'b' + blackPieces[i];
        }

        this.shuffle(whitePieces);
        for (let i = 0; i < 16; i++) {
            this.board[48 + i] = 'w' + whitePieces[i];
        }
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getPiece(index) {
        return this.board[index];
    }

    getValidMoves(index) {
        const piece = this.board[index];
        if (!piece || piece[0] !== this.turn) return [];

        const type = piece[1];
        const moves = [];
        const row = Math.floor(index / 8);
        const col = index % 8;

        switch (type) {
            case 'p': this.getPawnMoves(index, moves); break;
            case 'n': this.getKnightMoves(index, moves); break;
            case 'b': this.getSlidingMoves(index, moves, [[1, 1], [1, -1], [-1, 1], [-1, -1]]); break;
            case 'r': this.getSlidingMoves(index, moves, [[0, 1], [0, -1], [1, 0], [-1, 0]]); break;
            case 'q': this.getSlidingMoves(index, moves, [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]]); break;
            case 'k': this.getKingMoves(index, moves); break;
        }

        return moves;
    }

    getPawnMoves(index, moves) {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const color = this.board[index][0];
        const dir = color === 'w' ? -1 : 1;

        const target = index + dir * 8;
        if (target >= 0 && target < 64 && !this.board[target]) {
            moves.push(target);
            const isStartRow = (color === 'w' && row >= 6) || (color === 'b' && row <= 1);
            const target2 = target + dir * 8;
            if (isStartRow && target2 >= 0 && target2 < 64 && !this.board[target2]) {
                moves.push(target2);
            }
        }

        for (const offset of [-1, 1]) {
            const nextCol = col + offset;
            if (nextCol >= 0 && nextCol < 8) {
                const target = index + dir * 8 + offset;
                if (target >= 0 && target < 64 && this.board[target] && this.board[target][0] !== color) {
                    moves.push(target);
                }
            }
        }
    }

    getKnightMoves(index, moves) {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const offsets = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
        const color = this.board[index][0];

        for (const [dr, dc] of offsets) {
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const target = r * 8 + c;
                if (!this.board[target] || this.board[target][0] !== color) {
                    moves.push(target);
                }
            }
        }
    }

    getSlidingMoves(index, moves, dirs) {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const color = this.board[index][0];

        for (const [dr, dc] of dirs) {
            let r = row + dr;
            let c = col + dc;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const target = r * 8 + c;
                if (!this.board[target]) {
                    moves.push(target);
                } else {
                    if (this.board[target][0] !== color) moves.push(target);
                    break;
                }
                r += dr;
                c += dc;
            }
        }
    }

    getKingMoves(index, moves) {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const color = this.board[index][0];

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const r = row + dr;
                const c = col + dc;
                if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                    const target = r * 8 + c;
                    if (!this.board[target] || this.board[target][0] !== color) {
                        moves.push(target);
                    }
                }
            }
        }
    }

    move(from, to) {
        const piece = this.board[from];
        const targetPiece = this.board[to];
        const isCapture = targetPiece !== null;

        if (targetPiece && targetPiece[1] === 'k') {
            this.gameOver = true;
            this.winner = piece[0];
        }

        this.board[to] = piece;
        this.board[from] = null;
        this.turn = this.turn === 'w' ? 'b' : 'w';
        this.lastMove = { from, to };

        // Clear markers at both from and to squares
        this.markers[from] = null;
        this.markers[to] = null;

        return { isCapture, gameOver: this.gameOver };
    }

    setMarker(index, type) {
        this.markers[index] = type;
    }

    clearMarkers() {
        this.markers.fill(null);
    }
}

class UI {
    constructor() {
        this.game = new Game();
        this.audio = new AudioEngine();
        this.boardElement = document.getElementById('chess-board');
        this.markerBank = document.getElementById('marker-bank');
        this.selectedMarker = null;

        this.init();
    }

    init() {
        this.renderBoard();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.boardElement.addEventListener('click', (e) => {
            this.audio.init();
            const square = e.target.closest('.square');
            if (square) {
                const index = parseInt(square.dataset.index);
                this.handleSquareClick(index);
            }
        });

        this.boardElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.audio.init();
            const square = e.target.closest('.square');
            if (square) {
                const index = parseInt(square.dataset.index);
                this.handleRightClick(index);
            }
        });

        this.markerBank.addEventListener('click', (e) => {
            this.audio.init();
            const item = e.target.closest('.marker-item');
            if (item) {
                const type = item.dataset.type;
                this.selectMarker(type, item);
            }
        });

        document.getElementById('reset-game').addEventListener('click', () => {
            this.game = new Game();
            this.renderBoard();
        });

        document.getElementById('clear-markers').addEventListener('click', () => {
            this.game.clearMarkers();
            this.renderBoard();
        });

        document.getElementById('play-again').addEventListener('click', () => {
            this.game = new Game();
            document.getElementById('game-over-modal').classList.add('hidden');
            this.renderBoard();
        });
    }

    selectMarker(type, element) {
        if (this.selectedMarker === type) {
            this.selectedMarker = null;
            element.classList.remove('active');
        } else {
            document.querySelectorAll('.marker-item').forEach(el => el.classList.remove('active'));
            this.selectedMarker = type;
            element.classList.add('active');
        }
    }

    async handleSquareClick(index) {
        if (this.selectedMarker) {
            const piece = this.game.getPiece(index);
            if (piece && piece[0] === 'b') {
                this.game.setMarker(index, this.selectedMarker);
                this.selectedMarker = null; // Deselect after placement
                document.querySelectorAll('.marker-item').forEach(el => el.classList.remove('active'));
                this.renderBoard();
            } else {
                // If they clicked something else while marker selected, deselect it
                this.selectedMarker = null;
                document.querySelectorAll('.marker-item').forEach(el => el.classList.remove('active'));
            }
            return;
        }

        if (this.game.selectedSquare === null) {
            const piece = this.game.getPiece(index);
            if (piece && piece[0] === 'w' && this.game.turn === 'w') {
                this.game.selectedSquare = index;
                this.game.validMoves = this.game.getValidMoves(index);
            }
        } else {
            if (this.game.validMoves.includes(index)) {
                const from = this.game.selectedSquare;
                await this.animateMove(from, index);
                const result = this.game.move(from, index);
                this.handleMoveResult(result);

                this.game.selectedSquare = null;
                this.game.validMoves = [];

                if (!this.game.gameOver) {
                    setTimeout(() => this.makeAIMove(), 400);
                }
            } else {
                this.game.selectedSquare = null;
                this.game.validMoves = [];
                const piece = this.game.getPiece(index);
                if (piece && piece[0] === 'w' && this.game.turn === 'w') {
                    this.game.selectedSquare = index;
                    this.game.validMoves = this.game.getValidMoves(index);
                }
            }
        }
        this.renderBoard();
    }

    async animateMove(from, to) {
        const fromSquare = this.boardElement.querySelector(`[data-index="${from}"]`);
        const toSquare = this.boardElement.querySelector(`[data-index="${to}"]`);
        const pieceEl = fromSquare.querySelector('.piece');

        if (!pieceEl) return; // For hidden moves, we might want to animate a "?" later

        const fromRect = fromSquare.getBoundingClientRect();
        const toRect = toSquare.getBoundingClientRect();

        const deltaX = toRect.left - fromRect.left;
        const deltaY = toRect.top - fromRect.top;

        pieceEl.classList.add('animating');
        pieceEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        return new Promise(resolve => setTimeout(resolve, 400));
    }

    async animateHiddenMove(from, to) {
        const fromSquare = this.boardElement.querySelector(`[data-index="${from}"]`);
        const toSquare = this.boardElement.querySelector(`[data-index="${to}"]`);

        // Create a temporary ? element
        const temp = document.createElement('div');
        temp.className = 'piece animating';
        temp.innerText = '?';
        temp.style.color = '#000';
        temp.style.fontWeight = '800';
        temp.style.fontSize = '3rem';

        const fromRect = fromSquare.getBoundingClientRect();
        const toRect = toSquare.getBoundingClientRect();

        temp.style.left = `${fromRect.left}px`;
        temp.style.top = `${fromRect.top}px`;
        temp.style.width = `${fromRect.width}px`;
        temp.style.height = `${fromRect.height}px`;
        temp.style.position = 'fixed';

        document.body.appendChild(temp);

        // Force reflow
        temp.getBoundingClientRect();

        temp.style.transform = `translate(${toRect.left - fromRect.left}px, ${toRect.top - fromRect.top}px)`;

        return new Promise(resolve => {
            setTimeout(() => {
                temp.remove();
                resolve();
            }, 400);
        });
    }

    handleRightClick(index) {
        const piece = this.game.getPiece(index);
        if (piece && piece[0] === 'b') {
            this.game.setMarker(index, null);
            this.renderBoard();
        }
    }

    handleMoveResult(result) {
        if (result.gameOver) {
            this.audio.playGameOver();
            this.showGameOver();
        } else if (result.isCapture) {
            this.audio.playCapture();
        } else {
            this.audio.playMove();
        }
    }

    async makeAIMove() {
        if (this.game.turn !== 'b' || this.game.gameOver) return;

        const allMoves = [];
        for (let i = 0; i < 64; i++) {
            const piece = this.game.getPiece(i);
            if (piece && piece[0] === 'b') {
                const moves = this.game.getValidMoves(i);
                moves.forEach(m => {
                    const target = this.game.getPiece(m);
                    let score = target ? 10 : 0; // Prioritize captures
                    // King capture is priority
                    if (target && target[1] === 'k') score = 100;
                    allMoves.push({ from: i, to: m, score });
                });
            }
        }

        if (allMoves.length > 0) {
            // Sort by score and pick from best
            allMoves.sort((a, b) => b.score - a.score);
            const bestScore = allMoves[0].score;
            const bestMoves = allMoves.filter(m => m.score === bestScore);
            const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];

            await this.animateHiddenMove(move.from, move.to);
            const result = this.game.move(move.from, move.to);
            this.handleMoveResult(result);
        }
        this.renderBoard();
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        for (let i = 0; i < 64; i++) {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isLight = (row + col) % 2 === 0;

            const square = document.createElement('div');
            square.className = `square ${isLight ? 'light' : 'dark'}`;
            square.dataset.index = i;

            if (this.game.selectedSquare === i) square.classList.add('selected');
            if (this.game.validMoves.includes(i)) square.classList.add('valid-move');

            // Highlight last move
            if (this.game.lastMove) {
                if (this.game.lastMove.from === i) square.classList.add('last-move-from');
                if (this.game.lastMove.to === i) square.classList.add('last-move-to');
            }

            const piece = this.game.getPiece(i);
            if (piece) {
                const color = piece[0];
                if (color === 'w') {
                    const pieceEl = document.createElement('div');
                    pieceEl.className = 'piece white';
                    pieceEl.innerText = PIECE_CHARS[piece];
                    square.appendChild(pieceEl);
                } else {
                    square.classList.add('opponent-piece');

                    if (this.game.markers[i]) {
                        const markerEl = document.createElement('div');
                        markerEl.className = 'board-marker';
                        markerEl.innerText = PIECE_CHARS['b' + this.game.markers[i]];
                        square.appendChild(markerEl);
                    }
                }
            }

            this.boardElement.appendChild(square);
        }

        const whiteStatus = document.querySelector('.player-info.white .status');
        const blackStatus = document.querySelector('.player-info.black .status');

        if (this.game.turn === 'w') {
            whiteStatus.innerText = 'Your Turn';
            blackStatus.innerText = 'Waiting...';
            whiteStatus.style.color = 'var(--accent-primary)';
            blackStatus.style.color = 'var(--text-muted)';
        } else {
            whiteStatus.innerText = 'Opponent Moving...';
            blackStatus.innerText = 'Thinking';
            whiteStatus.style.color = 'var(--text-muted)';
            blackStatus.style.color = 'var(--accent-secondary)';
        }
    }

    showGameOver() {
        const modal = document.getElementById('game-over-modal');
        const text = document.getElementById('winner-text');
        text.innerText = this.game.winner === 'w' ? 'You Win!' : 'AI Wins!';
        modal.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UI();
});
