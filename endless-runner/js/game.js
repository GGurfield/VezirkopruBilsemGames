const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Constants
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const GROUND_Y = 350;
const GAME_SPEED_START = 5;
const SPAWN_RATE_MIN = 60;
const SPAWN_RATE_MAX = 120;

// Game State
let gameState = 'MENU'; // MENU, PLAYING, PAUSED, GAME_OVER
let frames = 0;
let score = 0;
let highScore = localStorage.getItem('endlessRunnerHighScore') || 0;
let gameSpeed = GAME_SPEED_START;
let lives = 3;
let selectedChar = 'boy';

// Entities
const player = {
    x: 50,
    y: GROUND_Y,
    width: 40,
    height: 60,
    dy: 0,
    jumpTimer: 0,
    grounded: true,
    color: '#0000FF', // Default blue for boy

    draw: function () {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (selectedChar === 'boy') {
            // Body
            ctx.fillStyle = '#3366cc';
            ctx.fillRect(0, 20, 40, 40);
            // Head
            ctx.fillStyle = '#ffcc99'; // Skin
            ctx.fillRect(5, 0, 30, 20);
            // Cap
            ctx.fillStyle = '#cc0000';
            ctx.fillRect(5, -5, 30, 10);
            ctx.fillRect(25, -5, 15, 5); // Bill
            // Legs (Simple animation)
            ctx.fillStyle = '#333';
            if (gameState === 'PLAYING' && !this.grounded) {
                ctx.fillRect(5, 60, 10, 10); // Jump pose
                ctx.fillRect(25, 50, 10, 10);
            } else if (gameState === 'PLAYING' && Math.floor(frames / 10) % 2 === 0) {
                ctx.fillRect(5, 60, 10, 10); // Run 1
                ctx.fillRect(25, 60, 10, 10);
            } else {
                ctx.fillRect(10, 60, 10, 10); // Run 2 / Idle
                ctx.fillRect(20, 60, 10, 10);
            }
        } else if (selectedChar === 'girl') {
            // Dress
            ctx.fillStyle = '#cc3366';
            ctx.beginPath();
            ctx.moveTo(10, 20);
            ctx.lineTo(30, 20);
            ctx.lineTo(40, 60);
            ctx.lineTo(0, 60);
            ctx.fill();
            // Head
            ctx.fillStyle = '#ffcc99';
            ctx.fillRect(10, 0, 20, 20);
            // Hair
            ctx.fillStyle = '#ffff66';
            ctx.fillRect(10, -5, 20, 10); // Top
            ctx.fillRect(5, -5, 5, 40); // Left side
            ctx.fillRect(30, -5, 5, 40); // Right side
            // Legs
            ctx.fillStyle = '#333';
            if (gameState === 'PLAYING' && !this.grounded) {
                ctx.fillRect(10, 60, 5, 10);
                ctx.fillRect(25, 55, 5, 10);
            } else if (gameState === 'PLAYING' && Math.floor(frames / 10) % 2 === 0) {
                ctx.fillRect(10, 60, 5, 10);
                ctx.fillRect(25, 60, 5, 10);
            } else {
                ctx.fillRect(15, 60, 5, 10);
                ctx.fillRect(20, 60, 5, 10);
            }
        } else if (selectedChar === 'cat') {
            // Body
            ctx.fillStyle = '#ff9933';
            ctx.fillRect(0, 10, 50, 20);
            // Head
            ctx.fillRect(40, 0, 20, 20);
            // Ears
            ctx.beginPath();
            ctx.moveTo(42, 0);
            ctx.lineTo(45, -10);
            ctx.lineTo(48, 0);
            ctx.moveTo(52, 0);
            ctx.lineTo(55, -10);
            ctx.lineTo(58, 0);
            ctx.fill();
            // Tail
            ctx.strokeStyle = '#ff9933';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 15);
            ctx.quadraticCurveTo(-10, 5, -5, 25);
            ctx.stroke();
            // Legs
            ctx.fillStyle = 'white';
            if (gameState === 'PLAYING' && Math.floor(frames / 5) % 2 === 0) {
                ctx.fillRect(5, 30, 5, 5);
                ctx.fillRect(35, 30, 5, 5);
            } else {
                ctx.fillRect(10, 30, 5, 5);
                ctx.fillRect(40, 30, 5, 5);
            }
        }

        ctx.restore();
    },

    update: function () {
        // Jump Logic
        if (keys['Space'] || keys['ArrowUp']) {
            this.jump();
        }

        // Physics
        this.y += this.dy;

        if (this.y + this.height < GROUND_Y) {
            this.dy += GRAVITY;
            this.grounded = false;
        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = GROUND_Y - this.height;
        }
    },

    jump: function () {
        if (this.grounded) {
            this.dy = JUMP_FORCE;
            this.grounded = false;
        }
    }
};

let obstacles = [];
let powerups = [];
let keys = {};

// UI Elements
const hud = document.getElementById('hud');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const scoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const livesContainer = document.getElementById('lives-container');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');

// Setup Event Listeners
window.addEventListener('keydown', function (e) {
    keys[e.code] = true;
    if (e.code === 'Escape' && gameState !== 'MENU' && gameState !== 'GAME_OVER') {
        togglePause();
    }
});
window.addEventListener('keyup', function (e) {
    keys[e.code] = false;
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', resetGame);
pauseBtn.addEventListener('click', togglePause);

// Character Selection
document.querySelectorAll('.char-option').forEach(opt => {
    opt.addEventListener('click', function () {
        document.querySelectorAll('.char-option').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedChar = this.getAttribute('data-char');
        updatePlayerAppearance();
    });
});

function updatePlayerAppearance() {
    if (selectedChar === 'boy') {
        player.color = '#3366cc'; // Blue
        player.width = 40;
        player.height = 60;
    } else if (selectedChar === 'girl') {
        player.color = '#cc3366'; // Pink/Red
        player.width = 40;
        player.height = 55;
    } else if (selectedChar === 'cat') {
        player.color = '#ff9933'; // Orange
        player.width = 50;
        player.height = 30; // Shorter
    }
}

function startGame() {
    gameState = 'PLAYING';
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    hud.classList.remove('hidden');
    pauseBtn.classList.remove('hidden');

    resetVariables();
    updatePlayerAppearance();
    updateLivesUI();

    // Set Canvas Size
    canvas.width = 800;
    canvas.height = 400;

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    startGame();
}

function resetVariables() {
    gameSpeed = GAME_SPEED_START;
    score = 0;
    lives = 3;
    frames = 0;
    obstacles = [];
    powerups = [];
    player.y = GROUND_Y - player.height;
    player.dy = 0;
}

function togglePause() {
    if (gameState === 'PLAYING') {
        gameState = 'PAUSED';
        pauseBtn.innerText = '►';
    } else if (gameState === 'PAUSED') {
        gameState = 'PLAYING';
        pauseBtn.innerText = '||';
        requestAnimationFrame(gameLoop);
    }
}

function spawnObstacle() {
    const type = Math.random() < 0.7 ? 'ground' : 'air';
    let obstacle = {
        x: canvas.width,
        y: type === 'ground' ? GROUND_Y - 50 : GROUND_Y - 120, // Ground or Air
        width: type === 'ground' ? 30 : 40,
        height: type === 'ground' ? 50 : 30,
        color: type === 'ground' ? '#228B22' : '#555', // Green cactus or Grey bird
        type: type,
        passed: false
    };

    if (selectedChar === 'cat' && type === 'ground') {
        obstacle.width = 20; // Smaller obstacles for cat?
    }

    obstacles.push(obstacle);
}

function spawnPowerup() {
    let powerup = {
        x: canvas.width,
        y: GROUND_Y - 150 - Math.random() * 50,
        width: 20,
        height: 20,
        color: 'red'
    };
    powerups.push(powerup);
}

function update() {
    if (gameState !== 'PLAYING') return;

    frames++;
    gameSpeed += 0.001; // Increase speed slowly
    score += 0.1; // Distance based score

    scoreEl.innerText = Math.floor(score).toString().padStart(5, '0');
    highScoreEl.innerText = Math.floor(highScore).toString().padStart(5, '0');

    player.update();

    // Spawner
    if (frames % Math.floor(Math.random() * (SPAWN_RATE_MAX - SPAWN_RATE_MIN) + SPAWN_RATE_MIN) === 0) {
        spawnObstacle();
    }

    // Powerup Spawner (rarer)
    if (frames % 1000 === 0) {
        spawnPowerup();
    }

    // Obstacles
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;

        if (checkCollision(player, obs)) {
            handleCollision(i);
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            i--;
        }
    }

    // Powerups
    for (let i = 0; i < powerups.length; i++) {
        let pup = powerups[i];
        pup.x -= gameSpeed;

        if (checkCollision(player, pup)) {
            lives++;
            if (lives > 5) lives = 5; // Max 5 lives
            updateLivesUI();
            powerups.splice(i, 1);
            i--;
        } else if (pup.x + pup.width < 0) {
            powerups.splice(i, 1);
            i--;
        }
    }
}

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function handleCollision(index) {
    obstacles.splice(index, 1); // Remove obstacle so we don't hit it twice instantly
    lives--;
    updateLivesUI();

    // Flash damage
    player.color = 'red';
    setTimeout(updatePlayerAppearance, 200);

    if (lives <= 0) {
        gameOver();
    }
}

function updateLivesUI() {
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        livesContainer.appendChild(heart);
    }
}

function gameOver() {
    gameState = 'GAME_OVER';
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('endlessRunnerHighScore', highScore);
    }
    document.getElementById('final-score').innerText = Math.floor(score);
    gameOverScreen.classList.remove('hidden');
    hud.classList.add('hidden');
    pauseBtn.classList.add('hidden');
}

function draw() {
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();

    // Draw Player
    player.draw();

    // Draw Obstacles
    obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Draw Powerups
    powerups.forEach(pup => {
        ctx.fillStyle = pup.color;
        // Draw heart shape roughly
        ctx.beginPath();
        ctx.arc(pup.x + 10, pup.y + 5, 5, 0, Math.PI, true);
        ctx.arc(pup.x + 20, pup.y + 5, 5, 0, Math.PI, true);
        ctx.lineTo(pup.x + 15, pup.y + 20);
        ctx.fill();
    });

    // Pause Overlay Draw
    if (gameState === 'PAUSED') {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px "Press Start 2P"';
        ctx.fillText('PAUSED', canvas.width / 2 - 80, canvas.height / 2);
    }
}

function gameLoop() {
    if (gameState === 'PLAYING' || gameState === 'PAUSED') { // Process loop to keep drawing paused state
        update();
        draw();
    }
    if (gameState === 'PLAYING' || gameState === 'PAUSED') {
        requestAnimationFrame(gameLoop);
    }
}

// Initial Draw for Menu Background
updatePlayerAppearance();
