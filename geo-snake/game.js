const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const livesDisplay = document.getElementById('lives-display');
const scoreDisplay = document.getElementById('score-display');
const gradeOverlay = document.getElementById('grade-overlay');
const startOverlay = document.getElementById('start-overlay');
const questionOverlay = document.getElementById('question-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const finalScore = document.getElementById('final-score');

// New UI Elements
const feedbackText = document.getElementById('feedback-text');
const countdownContainer = document.getElementById('countdown-container');
const countdownNumber = document.getElementById('countdown-number');
const victoryOverlay = document.getElementById('victory-overlay');
const victoryRestartBtn = document.getElementById('victory-restart-btn');
const continueBtn = document.getElementById('continue-btn');
const gradeBtns = document.querySelectorAll('.grade-btn');

// Game constants
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 15;
let CANVAS_SIZE = 400;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let snake = [];
let food = { x: 0, y: 0 };
let dx = GRID_SIZE;
let dy = 0;
let nextDx = GRID_SIZE;
let nextDy = 0;
let score = 0;
let lives = 3;
let gameLoop;
let isGameRunning = false;
let isQuestionActive = false;
let isCountdownActive = false;
let selectedGrade = 3;
let usedQuestionIndices = [];
let currentSpeed = INITIAL_SPEED;
let lastMilestoneScore = 0;

const allQuestions = {
    3: [
        { q: "Karesel bölgenin kaç köşesi vardır?", a: ["3", "4", "5", "0"], correct: 1 },
        { q: "Üçgensel bölgenin kaç kenarı vardır?", a: ["4", "3", "2", "5"], correct: 1 },
        { q: "Hangi geometrik şeklin köşesi yoktur?", a: ["Kare", "Üçgen", "Çember", "Dikdörtgen"], correct: 2 },
        { q: "Bir küpün kaç yüzü vardır?", a: ["4", "5", "6", "8"], correct: 2 },
        { q: "Dikdörtgenin kaç tane dik açısı vardır?", a: ["2", "3", "4", "0"], correct: 2 }
    ],
    4: [
        { q: "Dik açının ölçüsü kaç derecedir?", a: ["45", "90", "180", "60"], correct: 1 },
        { q: "İki ışın arasında kalan açıklığa ne denir?", a: ["Doğru", "Açı", "Nokta", "Düzlem"], correct: 1 },
        { q: "Dar açının ölçüsü hangisi olabilir?", a: ["90", "120", "80", "180"], correct: 2 },
        { q: "Karenin çevresi bir kenarının kaç katıdır?", a: ["2", "3", "4", "1"], correct: 2 },
        { q: "Geniş açının ölçüsü hangisinden büyüktür?", a: ["90", "180", "270", "360"], correct: 0 }
    ],
    5: [
        { q: "Üçgenin iç açılarının toplamı kaçtır?", a: ["90", "180", "360", "270"], correct: 1 },
        { q: "Dörtgenin iç açılarının toplamı kaçtır?", a: ["180", "360", "270", "540"], correct: 1 },
        { q: "Eşkenar üçgenin bir iç açısı kaç derecedir?", a: ["45", "90", "60", "30"], correct: 2 },
        { q: "Hangi üçgenin tüm kenarları eşittir?", a: ["Çeşitkenar", "İkizkenar", "Eşkenar", "Dik"], correct: 2 },
        { q: "Yandaşı olan açılar toplamı 180 ise bu açılara ne denir?", a: ["Tümler", "Bütünler", "Ters", "İç ters"], correct: 1 }
    ],
    6: [
        { q: "Paralelkenarın alanı nasıl hesaplanır?", a: ["a*b", "taban*yükseklik", "(a+b)*h/2", "πr²"], correct: 1 },
        { q: "Çemberin merkezinden geçen en uzun kirişe ne denir?", a: ["Yarıçap", "Yay", "Çap", "Teget"], correct: 2 },
        { q: "Bir açıyı iki eş parçaya bölen ışına ne denir?", a: ["Kenarortay", "Açıortay", "Yükseklik", "Doğru parçası"], correct: 1 },
        { q: "Dik üçgenin alanı formülü nedir?", a: ["a*b", "(a*b)/2", "a+b+c", "a²"], correct: 1 },
        { q: "Tümler iki açının toplamı kaçtır?", a: ["45", "90", "180", "360"], correct: 1 }
    ],
    7: [
        { q: "Dairenin alanı formülü nedir?", a: ["2πr", "πr²", "πd", "2πd"], correct: 1 },
        { q: "Çokgenin dış açılarının toplamı her zaman kaçtır?", a: ["180", "360", "540", "720"], correct: 1 },
        { q: "Düzgün beşgenin bir iç açısı kaçtır?", a: ["72", "108", "90", "120"], correct: 1 },
        { q: "Yamuğun alanı formülü nedir?", a: ["a*h", "(a+b)*h/2", "a*b", "πr²"], correct: 1 },
        { q: "Eşkenar dörtgenin köşegenleri nasıl kesişir?", a: ["Paralel", "Dik", "Çakışık", "Düz"], correct: 1 }
    ]
};

function initGame() {
    snake = [
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];
    dx = GRID_SIZE; dy = 0; nextDx = GRID_SIZE; nextDy = 0;
    score = 0; lives = 3;
    currentSpeed = INITIAL_SPEED;
    lastMilestoneScore = 0;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    canvas.classList.remove('map-border-wrong');
    usedQuestionIndices = [];
    createFood();
}

function createFood() {
    const margin = 2;
    const gridCount = canvas.width / GRID_SIZE;
    food.x = (Math.floor(Math.random() * (gridCount - margin * 2)) + margin) * GRID_SIZE;
    food.y = (Math.floor(Math.random() * (gridCount - margin * 2)) + margin) * GRID_SIZE;
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) createFood();
    });
}

function drawSnake() {
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#34d399' : '#10b981';
        ctx.shadowBlur = index === 0 ? 15 : 5;
        ctx.shadowColor = '#10b981';
        ctx.fillRect(part.x, part.y, GRID_SIZE - 2, GRID_SIZE - 2);

        if (index === 0) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'white';
            let eye1X, eye1Y, eye2X, eye2Y, tongueX, tongueY, tongueW, tongueH;
            if (dx > 0) {
                eye1X = part.x + 12; eye1Y = part.y + 4; eye2X = part.x + 12; eye2Y = part.y + 12;
                tongueX = part.x + 18; tongueY = part.y + 8; tongueW = 6; tongueH = 4;
            } else if (dx < 0) {
                eye1X = part.x + 4; eye1Y = part.y + 4; eye2X = part.x + 4; eye2Y = part.y + 12;
                tongueX = part.x - 6; tongueY = part.y + 8; tongueW = 6; tongueH = 4;
            } else if (dy < 0) {
                eye1X = part.x + 4; eye1Y = part.y + 4; eye2X = part.x + 12; eye2Y = part.y + 4;
                tongueX = part.x + 8; tongueY = part.y - 6; tongueW = 4; tongueH = 6;
            } else {
                eye1X = part.x + 4; eye1Y = part.y + 12; eye2X = part.x + 12; eye2Y = part.y + 12;
                tongueX = part.x + 8; tongueY = part.y + 18; tongueW = 4; tongueH = 6;
            }
            ctx.fillRect(eye1X, eye1Y, 3, 3); ctx.fillRect(eye2X, eye2Y, 3, 3);
            ctx.fillStyle = '#ef4444'; ctx.fillRect(tongueX, tongueY, tongueW, tongueH);
        }
    });
}

function drawFood() {
    ctx.fillStyle = '#ef4444'; ctx.shadowBlur = 15; ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    ctx.arc(food.x + GRID_SIZE / 2, food.y + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill(); ctx.shadowBlur = 0;
}

function moveSnake() {
    dx = nextDx; dy = nextDy;
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) { handleDeath(); return; }
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) { handleDeath(); return; }
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) { pauseGame(); showQuestion(); }
    else { snake.pop(); }
}

function handleDeath() {
    lives--; livesDisplay.textContent = lives;
    if (lives <= 0) { endGame(); }
    else {
        const currentLength = snake.length;
        const startX = 160; const startY = 200;
        snake = [];
        for (let i = 0; i < currentLength; i++) { snake.push({ x: startX - (i * GRID_SIZE), y: startY }); }
        dx = GRID_SIZE; dy = 0; nextDx = GRID_SIZE; nextDy = 0;
    }
}

function showQuestion() {
    isQuestionActive = true;
    const pool = allQuestions[selectedGrade];
    if (usedQuestionIndices.length === pool.length) usedQuestionIndices = [];
    let randomIndex;
    do { randomIndex = Math.floor(Math.random() * pool.length); } while (usedQuestionIndices.includes(randomIndex));
    usedQuestionIndices.push(randomIndex);
    const qData = pool[randomIndex];

    questionText.textContent = qData.q;
    optionsContainer.innerHTML = '';
    feedbackText.classList.add('hidden'); countdownContainer.classList.add('hidden');

    qData.a.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = opt;
        btn.onclick = () => { if (!isCountdownActive) handleAnswer(index === qData.correct, index, qData.correct); };
        optionsContainer.appendChild(btn);
    });
    questionOverlay.classList.remove('hidden');
}

function handleAnswer(isCorrect, chosenIndex, correctIndex) {
    isCountdownActive = true;
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
        if (idx === correctIndex) { btn.classList.add(isCorrect ? 'option-correct' : 'blink-green'); if (!isCorrect) btn.classList.add('option-correct'); }
        if (idx === chosenIndex && !isCorrect) btn.classList.add('option-wrong');
    });
    feedbackText.textContent = isCorrect ? "Tebrikler doğru!" : "Yanlış bildiniz!";
    feedbackText.className = isCorrect ? "text-correct" : "text-wrong";
    feedbackText.classList.remove('hidden');

    if (isCorrect) {
        score += 10; scoreDisplay.textContent = score;
        lives = 3; livesDisplay.textContent = lives;
        canvas.classList.remove('map-border-wrong');
    } else {
        snake.pop(); canvas.classList.add('map-border-wrong');
    }

    let count = 3; countdownNumber.textContent = count; countdownContainer.classList.remove('hidden');
    const countInterval = setInterval(() => {
        count--; if (count >= 0) countdownNumber.textContent = count;
        if (count <= 0) { clearInterval(countInterval); finishAnswer(); }
    }, 1000);
}

function finishAnswer() {
    isQuestionActive = false; isCountdownActive = false;
    questionOverlay.classList.add('hidden');

    if (score > 0 && score % 50 === 0 && score > lastMilestoneScore) {
        lastMilestoneScore = score;
        currentSpeed = Math.max(50, currentSpeed - SPEED_INCREMENT);
        winMilestone();
    } else {
        createFood();
        resumeGame();
    }
}

function winMilestone() {
    isGameRunning = false; pauseGame();
    victoryOverlay.classList.remove('hidden');
    createConfetti();
}

function createConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#fbbf24', '#f59e0b', '#10b981', '#34d399', '#ef4444'];
    for (let i = 0; i < 150; i++) {
        const c = document.createElement('div');
        c.classList.add('confetti');
        c.style.left = Math.random() * 100 + '%';
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDelay = Math.random() * 3 + 's';
        c.style.animationDuration = (Math.random() * 3 + 2) + 's';
        c.style.width = Math.random() * 10 + 5 + 'px'; c.style.height = c.style.width;
        container.appendChild(c);
    }
}

function endGame() { isGameRunning = false; pauseGame(); finalScore.textContent = score; gameOverOverlay.classList.remove('hidden'); }

function clearCanvas() { ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, canvas.width, canvas.height); }

function gameStep() { if (!isGameRunning || isQuestionActive) return; clearCanvas(); drawFood(); moveSnake(); drawSnake(); }

function pauseGame() { clearInterval(gameLoop); }

function resumeGame() { gameLoop = setInterval(gameStep, currentSpeed); }

gradeBtns.forEach(btn => {
    btn.onclick = () => { selectedGrade = parseInt(btn.dataset.grade); gradeOverlay.classList.add('hidden'); startOverlay.classList.remove('hidden'); };
});

startBtn.onclick = () => { startOverlay.classList.add('hidden'); initGame(); isGameRunning = true; resumeGame(); };

restartBtn.onclick = () => { gameOverOverlay.classList.add('hidden'); gradeOverlay.classList.remove('hidden'); };

victoryRestartBtn.onclick = () => { // "Bitir" button
    victoryOverlay.classList.add('hidden');
    gradeOverlay.classList.remove('hidden');
};

continueBtn.onclick = () => { // "Daha uzatacak mısın?" button
    victoryOverlay.classList.add('hidden');
    isGameRunning = true;
    createFood();
    resumeGame();
};

window.onkeydown = (e) => {
    if (isQuestionActive) return;
    const key = e.key;
    if (key === 'ArrowUp' && dy === 0) { nextDx = 0; nextDy = -GRID_SIZE; }
    if (key === 'ArrowDown' && dy === 0) { nextDx = 0; nextDy = GRID_SIZE; }
    if (key === 'ArrowLeft' && dx === 0) { nextDx = -GRID_SIZE; nextDy = 0; }
    if (key === 'ArrowRight' && dx === 0) { nextDx = GRID_SIZE; nextDy = 0; }
};

