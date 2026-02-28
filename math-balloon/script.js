const state = {
    score: 0,
    timer: 30,
    streak: 0,
    gameActive: false,
    penaltyActive: false,
    activeBalloon: null,
    currentTime: 30
};

const elements = {
    gameContainer: document.getElementById('game-container'),
    score: document.getElementById('score'),
    timer: document.getElementById('timer'),
    streakContainer: document.getElementById('streak-container'),
    streakDots: document.querySelectorAll('.dot'),
    balloonArea: document.getElementById('balloon-area'),
    startScreen: document.getElementById('start-screen'),
    gameOverScreen: document.getElementById('game-over'),
    inputOverlay: document.getElementById('input-overlay'),
    penaltyOverlay: document.getElementById('penalty-overlay'),
    activeProblem: document.getElementById('active-problem'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    finalScore: document.getElementById('final-score'),
    penaltyTimer: document.getElementById('penalty-timer')
};

// Green is reserved for traps
const BALLOON_COLORS = [
    'hsl(217, 91%, 60%)', // Blue
    'hsl(38, 92%, 50%)',  // Yellow
    'hsl(330, 81%, 60%)', // Pink
    'hsl(262, 83%, 58%)'  // Purple
];

const TRAP_COLOR = 'hsl(142, 71%, 45%)'; // Exclusive Green

let gameTimer;
let spawnInterval;

// --- Math Engine (Elementary Level) ---
function generateProblem() {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;

    if (op === '+') {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        answer = a + b;
    } else if (op === '-') {
        a = Math.floor(Math.random() * 10) + 5;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        answer = a - b;
    } else {
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 5) + 1;
        answer = a * b;
    }

    return { text: `${a} ${op === '*' ? '×' : (op === '-' ? '-' : '+')} ${b}`, answer };
}

// --- Game Logic ---
function startGame() {
    state.score = 0;
    state.currentTime = 30;
    state.streak = 0;
    state.gameActive = true;
    state.penaltyActive = false;

    updateHUD();
    updateBackground();
    elements.startScreen.classList.add('hidden');
    elements.gameOverScreen.classList.add('hidden');
    elements.balloonArea.innerHTML = '';

    clearInterval(gameTimer);
    clearInterval(spawnInterval);

    gameTimer = setInterval(() => {
        state.currentTime--;
        elements.timer.textContent = state.currentTime;
        if (state.currentTime <= 0) endGame();
    }, 1000);

    spawnInterval = setInterval(() => {
        if (!state.penaltyActive && state.gameActive) {
            // Trap probability increases with score (max 30%)
            const trapProb = Math.min(0.3, state.score / 200);
            const isTrap = Math.random() < trapProb;
            spawnBalloon(isTrap);
        }
    }, 1200);
}

function updateBackground() {
    elements.gameContainer.classList.remove('bg-earth', 'bg-sky', 'bg-space');
    if (state.score < 50) {
        elements.gameContainer.classList.add('bg-earth');
    } else if (state.score < 150) {
        elements.gameContainer.classList.add('bg-sky');
    } else {
        elements.gameContainer.classList.add('bg-space');
    }
}

function endGame() {
    state.gameActive = false;
    clearInterval(gameTimer);
    clearInterval(spawnInterval);
    elements.finalScore.textContent = state.score;
    elements.gameOverScreen.classList.remove('hidden');
    elements.inputOverlay.classList.add('hidden');
    elements.penaltyOverlay.classList.add('hidden');
}

function updateHUD() {
    elements.score.textContent = state.score;
    elements.streakDots.forEach((dot, i) => {
        dot.classList.toggle('active', i < state.streak);
    });
    elements.streakContainer.classList.toggle('hidden', state.streak === 0);
    updateBackground();
}

function handleAnswer() {
    if (!state.activeBalloon) return;

    const inputVal = parseInt(elements.answerInput.value);
    const correct = inputVal === state.activeBalloon.answer;

    elements.inputOverlay.classList.add('hidden');
    elements.answerInput.value = '';

    if (correct) {
        state.score += 5;
        state.streak++;
        state.currentTime += 5; // +5s Bonus

        if (state.streak === 3) {
            state.score += 10;
            state.streak = 0;
        }

        popBalloon(state.activeBalloon.element, true);
    } else {
        state.streak = 0;
        popBalloon(state.activeBalloon.element, false);
        triggerPenalty();
    }

    state.activeBalloon = null;
    updateHUD();
}

function triggerPenalty() {
    state.penaltyActive = true;
    elements.penaltyOverlay.classList.remove('hidden');
    let penaltyTime = 3;
    elements.penaltyTimer.textContent = penaltyTime;

    const pInterval = setInterval(() => {
        penaltyTime--;
        elements.penaltyTimer.textContent = penaltyTime;
        if (penaltyTime <= 0) {
            clearInterval(pInterval);
            state.penaltyActive = false;
            elements.penaltyOverlay.classList.add('hidden');
        }
    }, 1000);
}

// --- Balloon Management ---
function spawnBalloon(isTrap = false) {
    const problem = generateProblem();
    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    balloon.style.backgroundColor = isTrap ? TRAP_COLOR : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    balloon.style.left = `${Math.random() * 80 + 10}%`;

    const problemText = document.createElement('div');
    problemText.className = 'problem-text';
    problemText.textContent = problem.text;
    balloon.appendChild(problemText);

    const balloonObj = {
        element: balloon,
        answer: problem.answer,
        isTrap: isTrap
    };

    balloon.onclick = () => {
        if (state.penaltyActive || !state.gameActive) return;

        if (isTrap) {
            state.streak = 0;
            popBalloon(balloon, false);
            triggerPenalty();
            updateHUD();
            return;
        }

        state.activeBalloon = balloonObj;
        elements.activeProblem.textContent = `${problem.text} = ?`;
        elements.inputOverlay.classList.remove('hidden');
        elements.answerInput.focus();
    };

    elements.balloonArea.appendChild(balloon);

    const duration = 4000 + Math.random() * 2000;
    const anim = balloon.animate([
        { bottom: '-100px' },
        { bottom: '110%' }
    ], {
        duration: duration,
        easing: 'linear'
    });

    anim.onfinish = () => {
        if (balloon.parentElement) balloon.remove();
    };
}

function popBalloon(element, isCorrect) {
    element.classList.add('popping');
    setTimeout(() => {
        if (element.parentElement) element.remove();
    }, 300);
}

// --- Event Listeners ---
elements.startBtn.addEventListener('click', startGame);
elements.restartBtn.addEventListener('click', startGame);
elements.submitBtn.addEventListener('click', handleAnswer);

elements.answerInput.onkeydown = (e) => {
    if (e.key === 'Enter') handleAnswer();
    if (e.key === 'Escape') {
        elements.inputOverlay.classList.add('hidden');
        state.activeBalloon = null;
    }
};

elements.inputOverlay.onclick = (e) => {
    if (e.target === elements.inputOverlay) {
        elements.inputOverlay.classList.add('hidden');
        state.activeBalloon = null;
    }
};
