const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesContainer = document.getElementById('lives');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Game Settings
const GRID_SIZE = 20;
const TILE_COUNT = 30; // Increased from 20
canvas.width = GRID_SIZE * TILE_COUNT;
canvas.height = GRID_SIZE * TILE_COUNT;

let snake = [{ x: 10, y: 10 }];
let foods = [];
const FOOD_COUNT = 5;
let obstacles = [];
let dx = 0;
let dy = 0;
let nextDx = 1;
let nextDy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let lives = 3;
let gameRunning = false;
let isCounting = false;
let gameSpeed = 200; // Slower (increased from 150)
let lastRenderTime = 0;

const highScoreElement = document.getElementById('high-score');
highScoreElement.innerText = highScore.toString().padStart(3, '0');

// Initialize Controls
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': if (dy !== 1) { nextDx = 0; nextDy = -1; } break;
        case 'ArrowDown': if (dy !== -1) { nextDx = 0; nextDy = 1; } break;
        case 'ArrowLeft': if (dx !== 1) { nextDx = -1; nextDy = 0; } break;
        case 'ArrowRight': if (dx !== -1) { nextDx = 1; nextDy = 0; } break;
    }
    if (!gameRunning && !isCounting && lives > 0) startGame();
});

restartBtn.addEventListener('click', resetGame);

const countdownElement = document.getElementById('countdown');

function startGame() {
    if (isCounting || gameRunning) return;
    overlay.classList.add('hidden');
    startCountdown(() => {
        gameRunning = true;
        isCounting = false;
        requestAnimationFrame(gameLoop);
    });
}

function startCountdown(callback) {
    isCounting = true;
    let count = 3;
    countdownElement.innerText = count;
    countdownElement.classList.remove('hidden');

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownElement.innerText = count;
        } else {
            clearInterval(timer);
            countdownElement.classList.add('hidden');
            callback();
        }
    }, 1000);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0; dy = 0;
    nextDx = 1; nextDy = 0;
    score = 0;
    lives = 3;
    gameSpeed = 150;
    updateStats();
    spawnFood();
    spawnObstacles();
    startGame();
}

function spawnFood() {
    foods = [];
    for (let i = 0; i < FOOD_COUNT; i++) {
        spawnSingleFood();
    }
}

function spawnSingleFood() {
    let newFood;
    let isValid = false;
    while (!isValid) {
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
        isValid = !snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
            !obstacles.some(obs => obs.x === newFood.x && obs.y === newFood.y) &&
            !foods.some(f => f.x === newFood.x && f.y === newFood.y);
    }
    foods.push(newFood);
}

function spawnObstacles() {
    obstacles = [];
    const obstacleCount = 5;
    for (let i = 0; i < obstacleCount; i++) {
        let obs;
        do {
            obs = {
                x: Math.floor(Math.random() * TILE_COUNT),
                y: Math.floor(Math.random() * TILE_COUNT)
            };
        } while (
            (obs.x >= 8 && obs.x <= 12 && obs.y >= 8 && obs.y <= 12) || // Keep center clear
            snake.some(s => s.x === obs.x && s.y === obs.y) ||
            obstacles.some(o => o.x === obs.x && o.y === obs.y)
        );
        obstacles.push(obs);
    }
}

function update() {
    dx = nextDx;
    dy = nextDy;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check Wall Collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        loseLife();
        return;
    }

    // Check Body Collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        loseLife();
        return;
    }

    // Check Obstacle Collision
    if (obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
        loseLife();
        return;
    }

    snake.unshift(head);

    // Check Food Collision
    const foodIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);
    if (foodIndex !== -1) {
        score += 10;
        updateStats();
        foods.splice(foodIndex, 1);
        spawnSingleFood();
        gameSpeed = Math.max(80, gameSpeed - 2);
    } else {
        snake.pop();
    }
}

function loseLife() {
    lives--;
    updateStats();

    if (lives <= 0) {
        endGame();
    } else {
        // Reset snake position but keep score/lives
        snake = [{ x: 10, y: 10 }];
        dx = 0; dy = 0;
        nextDx = 1; nextDy = 0;
        spawnObstacles();
    }
}

function endGame() {
    gameRunning = false;
    overlayTitle.innerText = "OYUN BİTTİ";
    finalScoreElement.innerText = score;
    overlay.classList.remove('hidden');
}

function updateStats() {
    scoreElement.innerText = score.toString().padStart(3, '0');

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        if (typeof highScoreElement !== 'undefined') {
            highScoreElement.innerText = highScore.toString().padStart(3, '0');
        }
    }

    // Update hearts UI
    const hearts = livesContainer.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        if (index >= lives) {
            heart.classList.add('lost');
        } else {
            heart.classList.remove('lost');
        }
    });
}

function draw() {
    // Clear Canvas with Grass Pattern
    for (let x = 0; x < TILE_COUNT; x++) {
        for (let y = 0; y < TILE_COUNT; y++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#2d5a27' : '#264d21';
            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    // Draw Obstacles
    ctx.fillStyle = '#64748b';
    obstacles.forEach(obs => {
        ctx.beginPath();
        ctx.roundRect(obs.x * GRID_SIZE + 2, obs.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4, 4);
        ctx.fill();
        // Add some detail to obstacles
        ctx.fillStyle = '#475569';
        ctx.fillRect(obs.x * GRID_SIZE + 5, obs.y * GRID_SIZE + 5, 4, 4);
        ctx.fillStyle = '#64748b';
    });

    // Draw Food
    ctx.fillStyle = '#ef4444';
    foods.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x * GRID_SIZE + GRID_SIZE / 2, f.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        // Shiny spot
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(f.x * GRID_SIZE + GRID_SIZE / 3, f.y * GRID_SIZE + GRID_SIZE / 3, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444'; // Reset for next food
    });

    // Draw Snake
    snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#4ade80' : '#22c55e';

        ctx.beginPath();
        const r = isHead ? 6 : 4;
        ctx.roundRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2, r);
        ctx.fill();

        if (isHead) {
            // Eyes
            ctx.fillStyle = 'white';
            const eyeSize = 3;
            // Draw eyes based on direction
            let eyeX1, eyeY1, eyeX2, eyeY2;
            if (dx === 1) { // Right
                eyeX1 = 14; eyeY1 = 5; eyeX2 = 14; eyeY2 = 12;
            } else if (dx === -1) { // Left
                eyeX1 = 3; eyeY1 = 5; eyeX2 = 3; eyeY2 = 12;
            } else if (dy === -1) { // Up
                eyeX1 = 5; eyeY1 = 3; eyeX2 = 12; eyeY2 = 3;
            } else { // Down (default)
                eyeX1 = 5; eyeY1 = 14; eyeX2 = 12; eyeY2 = 14;
            }

            ctx.fillRect(segment.x * GRID_SIZE + eyeX1, segment.y * GRID_SIZE + eyeY1, eyeSize, eyeSize);
            ctx.fillRect(segment.x * GRID_SIZE + eyeX2, segment.y * GRID_SIZE + eyeY2, eyeSize, eyeSize);
        }
    });
}

function gameLoop(timestamp) {
    if (!gameRunning) return;

    const deltaTime = timestamp - lastRenderTime;
    if (deltaTime > gameSpeed) {
        update();
        draw();
        lastRenderTime = timestamp;
    }
    requestAnimationFrame(gameLoop);
}

// Initial Spawn
spawnFood();
spawnObstacles();
draw();
updateStats();

// Initial Overlay Message
overlayTitle.innerText = "YILAN OYUNU";
finalScoreElement.parentElement.innerHTML = "Hazır olduğunda bir yön tuşuna bas!";
overlay.classList.remove('hidden');
