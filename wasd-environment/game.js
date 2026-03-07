const player = document.getElementById('player');
const arena = document.getElementById('arena');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const minimap = document.getElementById('minimap');
const overlay = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const overlayButton = document.getElementById('overlay-button');

// Game State
let score = 0;
let level = 1;
let gameOver = false;
let gamePaused = false;
let obstacles = [];
let coins = [];
let monsters = [];

// Visual Key Indicators
const keyElements = {
    'w': document.getElementById('key-w'),
    'a': document.getElementById('key-a'),
    's': document.getElementById('key-s'),
    'd': document.getElementById('key-d')
};

// State
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    arrowup: false,
    arrowdown: false,
    arrowleft: false,
    arrowright: false
};

// Player properties
function getInitialPlayerState() {
    const defaultX = 600 - 20; // Center of 1200px width
    const defaultY = 350 - 20; // Center of 700px height

    try {
        const savedState = window.localStorage.getItem('wasdPlayerState');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            return {
                x: parsed.x !== undefined ? parsed.x : defaultX,
                y: parsed.y !== undefined ? parsed.y : defaultY,
                speed: 5,
                size: 40
            };
        }
    } catch (e) {
        console.warn("localStorage access is disabled", e);
    }

    return {
        x: defaultX,
        y: defaultY,
        speed: 5,
        size: 40
    };
}

const playerState = getInitialPlayerState();

// Arena properties
let arenaBounds = {
    width: arena.clientWidth,
    height: arena.clientHeight
};

// Object Generation
function spawnObstacles(count) {
    for (let i = 0; i < count; i++) {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');

        // Random size between 60 and 150
        const width = 60 + Math.random() * 90;
        const height = 60 + Math.random() * 90;

        // Random position
        let x, y;
        let validPosition = false;
        let attempts = 0;

        // Try to not spawn exactly on the player or other objects
        while (!validPosition && attempts < 100) {
            const boundaryPadding = 60;
            x = boundaryPadding + Math.random() * (arenaBounds.width - width - boundaryPadding * 2);
            y = boundaryPadding + Math.random() * (arenaBounds.height - height - boundaryPadding * 2);

            const newRect = { x, y, width, height };
            validPosition = true;

            // Don't spawn on player's start area (dynamic center)
            const centerX = arenaBounds.width / 2;
            const centerY = arenaBounds.height / 2;
            if (Math.abs(x - centerX) < 150 && Math.abs(y - centerY) < 150) {
                validPosition = false;
            }

            // Don't spawn on other obstacles
            if (validPosition) {
                for (const obs of obstacles) {
                    // Increased padding to 60px to ensure player (40px) can pass between gaps
                    const padding = 60;
                    const paddedObs = { x: obs.x - padding, y: obs.y - padding, width: obs.width + (padding * 2), height: obs.height + (padding * 2) };
                    if (checkCollision(newRect, paddedObs)) {
                        validPosition = false;
                        break;
                    }
                }
            }
            attempts++;
        }

        obstacle.style.width = `${width}px`;
        obstacle.style.height = `${height}px`;
        obstacle.style.left = `${x}px`;
        obstacle.style.top = `${y}px`;

        arena.appendChild(obstacle);
        obstacles.push({ element: obstacle, x, y, width, height });
    }
}

function spawnCoins(count) {
    for (let i = 0; i < count; i++) {
        const coin = document.createElement('div');
        coin.classList.add('coin');

        const size = 24;
        let x, y;
        let validPosition = false;
        let attempts = 0;

        while (!validPosition && attempts < 100) {
            x = Math.random() * (arenaBounds.width - size);
            y = Math.random() * (arenaBounds.height - size);

            const newRect = { x, y, width: size, height: size };
            validPosition = true;

            // Don't spawn inside obstacles
            for (const obs of obstacles) {
                if (checkCollision(newRect, obs)) {
                    validPosition = false;
                    break;
                }
            }

            // Don't spawn inside other coins
            if (validPosition) {
                for (const c of coins) {
                    if (checkCollision(newRect, c)) {
                        validPosition = false;
                        break;
                    }
                }
            }
            attempts++;
        }

        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;

        arena.appendChild(coin);
        coins.push({ element: coin, x, y, width: size, height: size });
    }
}

function spawnMonsters(count) {
    for (let i = 0; i < count; i++) {
        const monster = document.createElement('div');
        monster.classList.add('monster');
        monster.classList.add('chasing');

        const size = 36;
        let x, y;
        let validPosition = false;

        // Ensure they spawn far away from the player
        while (!validPosition) {
            x = Math.random() * (arenaBounds.width - size);
            y = Math.random() * (arenaBounds.height - size);

            // Use Euclidean distance for a circular safety buffer around the player
            const dist = Math.sqrt(Math.pow(x - playerState.x, 2) + Math.pow(y - playerState.y, 2));
            if (dist > 500) {
                validPosition = true;
            }
        }

        const isElite = Math.random() < 0.2; // 20% chance for elite
        if (isElite) {
            monster.classList.add('elite');
        }

        monster.style.left = `${x}px`;
        monster.style.top = `${y}px`;

        arena.appendChild(monster);

        // Elite stats: faster base speed
        const baseSpeed = isElite ? 2.0 : 1.0;

        monsters.push({
            element: monster,
            x: x,
            y: y,
            width: isElite ? 44 : size,
            height: isElite ? 44 : size,
            speed: baseSpeed + (level - 1) * 0.3 + Math.random() * 0.5,
            type: isElite ? 'elite' : 'regular'
        });
    }
}

// Check AABB Collision
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Level Progression
function startLevel() {
    // Clear existing objects from DOM and arrays
    obstacles.forEach(obs => obs.element.remove());
    coins.forEach(coin => coin.element.remove());
    monsters.forEach(monster => monster.element.remove());

    obstacles = [];
    coins = [];
    monsters = [];

    // Scale Arena Size
    const newWidth = 1200 + (level - 1) * 100;
    const newHeight = 700 + (level - 1) * 60;
    arena.style.width = `${newWidth}px`;
    arena.style.height = `${newHeight}px`;

    // Update bounds
    arenaBounds.width = newWidth;
    arenaBounds.height = newHeight;

    // Scale difficulty based on level
    const obstacleCount = Math.min(5 + level * 2, 25);
    const coinCount = 5 + level * 3;
    const monsterCount = 1 + Math.floor(level / 2); // 1 extra monster every 2 levels

    // Generate new level layout
    spawnObstacles(obstacleCount);
    spawnCoins(coinCount);
    spawnMonsters(monsterCount);

    // Reset player position for fairness on new level (dynamic center)
    playerState.x = arenaBounds.width / 2 - 20;
    playerState.y = arenaBounds.height / 2 - 20;

    // Optional visual pause or text popup here
}

function advanceLevel() {
    level++;
    levelDisplay.textContent = level;

    // Pause game and show overlay
    gamePaused = true;
    overlayTitle.textContent = "Seviye Tamamlandı!";
    overlayMessage.textContent = `Tebrikler! Seviye ${level} için hazır mısın?`;
    overlayButton.textContent = "Sonraki Seviye";
    overlay.classList.remove('hidden');
}

overlayButton.onclick = () => {
    if (gameOver) {
        // Reset game
        location.reload();
    } else {
        // Start next level
        overlay.classList.add('hidden');
        gamePaused = false;
        startLevel();
    }
};

// Generate INITIAL level content
startLevel();

// Event Listeners
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = true;
        player.classList.remove('idle');

        // Map arrow keys to visual WASD indicators
        let visualKey = key;
        if (key === 'arrowup') visualKey = 'w';
        if (key === 'arrowdown') visualKey = 's';
        if (key === 'arrowleft') visualKey = 'a';
        if (key === 'arrowright') visualKey = 'd';

        if (keyElements[visualKey]) {
            keyElements[visualKey].classList.add('active');
        }
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = false;

        // Map arrow keys to visual WASD indicators
        let visualKey = key;
        if (key === 'arrowup') visualKey = 'w';
        if (key === 'arrowdown') visualKey = 's';
        if (key === 'arrowleft') visualKey = 'a';
        if (key === 'arrowright') visualKey = 'd';

        if (keyElements[visualKey]) {
            keyElements[visualKey].classList.remove('active');
        }
    }

    // Check if idle
    if (!keys.w && !keys.a && !keys.s && !keys.d &&
        !keys.arrowup && !keys.arrowdown && !keys.arrowleft && !keys.arrowright) {
        player.classList.add('idle');
    }
});

// Initial Idle State
player.classList.add('idle');

// Game Loop
function update() {
    if (gameOver || gamePaused) return requestAnimationFrame(update);

    let moved = false;

    // Movement calculation
    let dx = 0;
    let dy = 0;

    if (keys.w || keys.arrowup) dy -= playerState.speed;
    if (keys.s || keys.arrowdown) dy += playerState.speed;
    if (keys.a || keys.arrowleft) dx -= playerState.speed;
    if (keys.d || keys.arrowright) dx += playerState.speed;

    // Normalize diagonal movement speed
    if (dx !== 0 && dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / length) * playerState.speed;
        dy = (dy / length) * playerState.speed;
    }

    // Store current player position for collision checks
    let playerRect = {
        x: playerState.x,
        y: playerState.y,
        width: playerState.size,
        height: playerState.size
    };

    // X-Axis Movement & Collision
    playerState.x += dx;

    // Boundaries (X)
    if (playerState.x < 0) playerState.x = 0;
    if (playerState.x + playerState.size > arenaBounds.width) playerState.x = arenaBounds.width - playerState.size;

    // Obstacles (X)
    playerRect.x = playerState.x; // Update playerRect for current X position
    for (const obstacle of obstacles) {
        if (checkCollision(playerRect, obstacle)) {
            if (dx > 0) playerState.x = obstacle.x - playerState.size;      // Moving right, hit left edge
            else if (dx < 0) playerState.x = obstacle.x + obstacle.width;  // Moving left, hit right edge
            playerRect.x = playerState.x; // Update rect for Y checks
        }
    }

    // Y-Axis Movement & Collision
    playerState.y += dy;

    // Boundaries (Y)
    if (playerState.y < 0) playerState.y = 0;
    if (playerState.y + playerState.size > arenaBounds.height) playerState.y = arenaBounds.height - playerState.size;

    // Obstacles (Y)
    playerRect.y = playerState.y; // Update playerRect for current Y position
    for (const obstacle of obstacles) {
        if (checkCollision(playerRect, obstacle)) {
            if (dy > 0) playerState.y = obstacle.y - playerState.size;       // Moving down, hit top edge
            else if (dy < 0) playerState.y = obstacle.y + obstacle.height;   // Moving up, hit bottom edge
            playerRect.y = playerState.y; // Update rect
        }
    }

    // Coins - Collect them
    playerRect = { x: playerState.x, y: playerState.y, width: playerState.size, height: playerState.size }; // Re-evaluate playerRect after all movement
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        if (checkCollision(playerRect, coin)) {
            // Remove from DOM
            coin.element.remove();
            // Remove from array
            coins.splice(i, 1);
            // Increase score
            score += 10;
            scoreDisplay.textContent = score;
        }
    }

    // Check Level Complete (all coins collected)
    if (coins.length === 0 && obstacles.length > 0) {
        // Condition: checking obstacles array length is a simple safety check 
        // to not trigger on load before first generation happens
        advanceLevel();
        // Return early to skip monster logic this frame and prevent cheap deaths
        return requestAnimationFrame(update);
    }

    // Monster AI - Chasing the player
    for (const monster of monsters) {
        // Calculate direction to player
        const distX = playerState.x - monster.x;
        const distY = playerState.y - monster.y;
        const length = Math.sqrt(distX * distX + distY * distY);

        if (length > 0) {
            // Move towards player
            const mDx = (distX / length) * monster.speed;
            const mDy = (distY / length) * monster.speed;

            // Basic monster obstacle avoidance could be added here,
            // for now they ghost through walls to make it harder
            monster.x += mDx;
            monster.y += mDy;

            // Update DOM element
            monster.element.style.left = `${monster.x}px`;
            monster.element.style.top = `${monster.y}px`;

            // Check player collision (Game Over condition)
            if (checkCollision(playerRect, monster)) {
                gameOver = true;
                player.style.background = '#000'; // Turn black

                // Show Game Over overlay
                overlayTitle.textContent = "Oyun Bitti!";
                overlayMessage.textContent = `Canavara yakalandın. Toplam Skorun: ${score}`;
                overlayButton.textContent = "Tekrar Oyna";
                overlay.classList.remove('hidden');

                // Remove saved state on death
                localStorage.removeItem('wasdPlayerState');
            }
        }
    }

    // Render Player Position
    // We use left/top so it doesn't conflict with CSS animation transform
    player.style.left = `${playerState.x}px`;
    player.style.top = `${playerState.y}px`;

    // Camera Follow Logic
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;

    // Calculate desired camera position (centering player)
    let camX = containerWidth / 2 - (playerState.x + playerState.size / 2);
    let camY = containerHeight / 2 - (playerState.y + playerState.size / 2);

    // Clamp camera to arena boundaries
    camX = Math.min(0, Math.max(camX, containerWidth - arenaBounds.width));
    camY = Math.min(0, Math.max(camY, containerHeight - arenaBounds.height));

    // Apply camera transform to the entire arena
    arena.style.transform = `translate(${camX}px, ${camY}px)`;

    // Update Minimap
    updateMinimap();

    // Save state to localStorage if position changed
    if (dx !== 0 || dy !== 0) {
        try {
            localStorage.setItem('wasdPlayerState', JSON.stringify({
                x: playerState.x,
                y: playerState.y
            }));
        } catch (e) {
            // Ignore saving errors if localStorage is disabled
        }
    }

    requestAnimationFrame(update);
}

function updateMinimap() {
    // Clear previous dots
    minimap.innerHTML = '';

    const mWidth = minimap.clientWidth;
    const mHeight = minimap.clientHeight;

    // Calculate scale
    const scaleX = mWidth / arenaBounds.width;
    const scaleY = mHeight / arenaBounds.height;

    // Draw Obstacles
    obstacles.forEach(obs => {
        const dot = document.createElement('div');
        dot.classList.add('minimap-dot', 'obstacle-dot');
        dot.style.left = `${obs.x * scaleX + (obs.width * scaleX / 2)}px`;
        dot.style.top = `${obs.y * scaleY + (obs.height * scaleY / 2)}px`;
        dot.style.width = `${obs.width * scaleX}px`;
        dot.style.height = `${obs.height * scaleY}px`;
        minimap.appendChild(dot);
    });

    // Draw Coins
    coins.forEach(coin => {
        const dot = document.createElement('div');
        dot.classList.add('minimap-dot', 'coin-dot');
        dot.style.left = `${coin.x * scaleX}px`;
        dot.style.top = `${coin.y * scaleY}px`;
        minimap.appendChild(dot);
    });

    // Draw Monsters
    monsters.forEach(monster => {
        const dot = document.createElement('div');
        dot.classList.add('minimap-dot', 'monster-dot');
        if (monster.type === 'elite') {
            dot.classList.add('elite-dot');
        }
        dot.style.left = `${monster.x * scaleX}px`;
        dot.style.top = `${monster.y * scaleY}px`;
        minimap.appendChild(dot);
    });

    // Draw Player
    const pDot = document.createElement('div');
    pDot.classList.add('minimap-dot', 'player-dot');
    pDot.style.left = `${(playerState.x + playerState.size / 2) * scaleX}px`;
    pDot.style.top = `${(playerState.y + playerState.size / 2) * scaleY}px`;
    minimap.appendChild(pDot);
}

// Start the loop
update();
