const arena = document.getElementById('arena');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const minimap = document.getElementById('minimap');
const overlay = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const overlayButton = document.getElementById('overlay-button');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownText = document.getElementById('countdown-text');
const mainMenu = document.getElementById('main-menu');
const pauseBtn = document.getElementById('pause-btn');
const pauseOverlay = document.getElementById('pause-overlay');
const resumeBtn = document.getElementById('resume-btn');
const restartBtn = document.getElementById('restart-btn');
const mainmenuBtn = document.getElementById('mainmenu-btn');

const shopOverlay = document.getElementById('shop-overlay');

let score = 0;
let level = 1;
let gameOver = false;
let gamePaused = true;
let gameMode = 1;
let isManuallyPaused = false;
let obstacles = [];
let coins = [];
let monsters = [];
let currentCameraScale = 1.0;

const keyElements = {
    'w': document.getElementById('key-w'),
    'a': document.getElementById('key-a'),
    's': document.getElementById('key-s'),
    'd': document.getElementById('key-d'),
    'arrowup': document.getElementById('key-up'),
    'arrowleft': document.getElementById('key-left'),
    'arrowdown': document.getElementById('key-down'),
    'arrowright': document.getElementById('key-right')
};

let players = [
    {
        id: 1, element: document.getElementById('player1'), x: 0, y: 0, size: 40, speed: 5,
        isActive: false, isDead: false, respawnFrames: 0, invulnerableFrames: 0,
        keys: { up: false, down: false, left: false, right: false },
        keyMap: { 'w': 'up', 's': 'down', 'a': 'left', 'd': 'right' }
    },
    {
        id: 2, element: document.getElementById('player2'), x: 0, y: 0, size: 40, speed: 5,
        isActive: false, isDead: false, respawnFrames: 0, invulnerableFrames: 0,
        keys: { up: false, down: false, left: false, right: false },
        keyMap: { 'arrowup': 'up', 'arrowdown': 'down', 'arrowleft': 'left', 'arrowright': 'right' }
    }
];

let arenaBounds = {
    width: arena.clientWidth,
    height: arena.clientHeight
};

// Skin Catalog Data
const skinCatalog = [
    { id: 'default', name: 'Standart', price: 0, class: 'skin-default' },
    { id: 'neon', name: 'Neon', price: 50, class: 'skin-neon' },
    { id: 'ice', name: 'Buz', price: 100, class: 'skin-ice' },
    { id: 'gold', name: 'Altın', price: 150, class: 'skin-gold' },
    { id: 'shadow', name: 'Gölge', price: 200, class: 'skin-shadow' },
    { id: 'fire', name: 'Alev', price: 300, class: 'skin-fire' },
    { id: 'toxic', name: 'Zehir', price: 400, class: 'skin-toxic' },
    { id: 'ghost', name: 'Hayalet', price: 500, class: 'skin-ghost' },
    { id: 'cyborg', name: 'Robot', price: 750, class: 'skin-cyborg' },
    { id: 'magma', name: 'Magma', price: 1000, class: 'skin-magma' },
    { id: 'rainbow', name: 'Gökkuşağı', price: 2000, class: 'skin-rainbow' },
    { id: 'emerald', name: 'Zümrüt', price: 2500, class: 'skin-emerald' },
    { id: 'diamond', name: 'Elmas', price: 3000, class: 'skin-diamond' },
    { id: 'galaxy', name: 'Galaksi', price: 4000, class: 'skin-galaxy' },
    { id: 'void', name: 'Boşluk', price: 5000, class: 'skin-void' },
    { id: 'matrix', name: 'Matris', price: 6000, class: 'skin-matrix' },
    { id: 'cosmic', name: 'Kozmik', price: 8000, class: 'skin-cosmic' },
    { id: 'divine', name: 'İlahi', price: 10000, class: 'skin-divine' }
];

const nameStyleCatalog = [
    { id: 'default', name: 'Standart', price: 0, class: 'name-default' },
    { id: 'neon', name: 'Siber Neon', price: 100, class: 'name-neon' },
    { id: 'gold', name: 'Kraliyet', price: 250, class: 'name-gold' },
    { id: 'fire', name: 'Cehennem', price: 400, class: 'name-fire' },
    { id: 'glitch', name: 'Sistem Hatası', price: 800, class: 'name-glitch' },
    { id: 'emerald', name: 'Doğa Muhafızı', price: 1200, class: 'name-emerald' },
    { id: 'diamond', name: 'Kristal Parlaklık', price: 1500, class: 'name-diamond' },
    { id: 'cosmic', name: 'Yıldız Gezgini', price: 2000, class: 'name-cosmic' }
];

let globalState = {
    coins: 20000,
    unlocked: ['default'],
    unlockedNames: ['default'],
    p1: { name: "", equipped: 'default', equippedName: 'default' },
    p2: { name: "", equipped: 'default', equippedName: 'default' }
};

let shopTargetPlayer = 'p1';

function loadState() {
    try {
        const saved = localStorage.getItem('wasdSaveData');
        if (saved) {
            const parsed = JSON.parse(saved);
            globalState = { ...globalState, ...parsed };
        }

        // Porting support for older save files gracefully
        if (globalState.p1.unlocked) {
            globalState.unlocked = Array.from(new Set([...globalState.unlocked, ...globalState.p1.unlocked]));
            delete globalState.p1.unlocked;
        }
        if (globalState.p2.unlocked) {
            globalState.unlocked = Array.from(new Set([...globalState.unlocked, ...globalState.p2.unlocked]));
            delete globalState.p2.unlocked;
        }
        if (globalState.p1.unlockedNames) {
            globalState.unlockedNames = Array.from(new Set([...globalState.unlockedNames, ...globalState.p1.unlockedNames]));
            delete globalState.p1.unlockedNames;
        }
        if (globalState.p2.unlockedNames) {
            globalState.unlockedNames = Array.from(new Set([...globalState.unlockedNames, ...globalState.p2.unlockedNames]));
            delete globalState.p2.unlockedNames;
        }

        if (!globalState.unlocked) globalState.unlocked = ['default'];
        if (!globalState.unlockedNames) globalState.unlockedNames = ['default'];

    } catch (e) { }

    document.getElementById('p1-name-input').value = globalState.p1.name || "Oyuncu 1";
    document.getElementById('p2-name-input').value = globalState.p2.name || "Oyuncu 2";
    updateMenuTotalCoins();
}

function saveState() {
    try {
        localStorage.setItem('wasdSaveData', JSON.stringify(globalState));
    } catch (e) { }
}

function updateMenuTotalCoins() {
    const m = document.getElementById('menu-total-coins');
    const s = document.getElementById('shop-total-coins');
    if (m) m.textContent = globalState.coins;
    if (s) s.textContent = globalState.coins;
}

// Shop Logic
function renderShop() {
    updateMenuTotalCoins();

    document.getElementById('shop-tab-p1').style.background = shopTargetPlayer === 'p1' ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : 'transparent';
    document.getElementById('shop-tab-p2').style.background = shopTargetPlayer === 'p2' ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : 'transparent';

    const renderCatalog = (catalog, containerId, category) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        catalog.forEach(item => {
            const state = globalState[shopTargetPlayer];
            const isUnlocked = category === 'skin' ? globalState.unlocked.includes(item.id) : globalState.unlockedNames.includes(item.id);
            const isEquipped = category === 'skin' ? state.equipped === item.id : state.equippedName === item.id;

            const div = document.createElement('div');
            div.className = `shop-item ${isUnlocked ? 'unlocked' : ''} ${isEquipped ? 'equipped' : ''}`;

            let btnHTML = '';
            if (isEquipped) {
                btnHTML = `<button class="shop-btn equipped">Kuşanıldı</button>`;
            } else if (isUnlocked) {
                btnHTML = `<button class="shop-btn equip">Kuşan</button>`;
            } else {
                btnHTML = `<button class="shop-btn buy">${item.price} Altın</button>`;
            }

            if (category === 'skin') {
                let previewClass = item.class;
                if (item.id === 'default') { previewClass = shopTargetPlayer === 'p1' ? 'skin-default-p1' : 'skin-default-p2'; }
                div.innerHTML = `<div class="shop-item-preview ${previewClass}"></div><div style="font-weight: bold; color: #f8fafc; font-size: 0.9rem;">${item.name}</div>${btnHTML}`;
            } else {
                const displayName = document.getElementById(`${shopTargetPlayer}-name-input`).value || globalState[shopTargetPlayer].name || 'İsim';
                div.innerHTML = `<div class="player-name-tag ${item.class}" style="position:static; transform:none; margin-bottom:10px; font-size:1.1rem; filter:drop-shadow(0 0 2px #000);">${displayName}</div><div style="font-weight: bold; color: #f8fafc; font-size: 0.9rem;">${item.name}</div>${btnHTML}`;
            }
            container.appendChild(div);

            const btnElement = div.querySelector('button');
            if (!isEquipped && isUnlocked) {
                btnElement.onclick = () => {
                    if (category === 'skin') globalState[shopTargetPlayer].equipped = item.id;
                    else globalState[shopTargetPlayer].equippedName = item.id;
                    saveState();
                    renderShop();
                };
            } else if (!isUnlocked) {
                btnElement.onclick = () => {
                    if (globalState.coins >= item.price) {
                        globalState.coins -= item.price;
                        if (category === 'skin') {
                            if (!globalState.unlocked.includes(item.id)) globalState.unlocked.push(item.id);
                            globalState[shopTargetPlayer].equipped = item.id;
                        } else {
                            if (!globalState.unlockedNames.includes(item.id)) globalState.unlockedNames.push(item.id);
                            globalState[shopTargetPlayer].equippedName = item.id;
                        }
                        saveState();
                        renderShop();
                    } else {
                        const orig = btnElement.textContent;
                        btnElement.textContent = "Yetersiz Bakiye!";
                        btnElement.style.background = "#ef4444";
                        setTimeout(() => { btnElement.textContent = orig; btnElement.style.background = ""; }, 1500);
                    }
                };
            }
        });
    };

    renderCatalog(skinCatalog, 'shop-skins-container', 'skin');
    renderCatalog(nameStyleCatalog, 'shop-names-container', 'name');
}

document.getElementById('shop-btn').onclick = () => {
    shopTargetPlayer = 'p1';
    renderShop();
    shopOverlay.classList.remove('hidden');
};
document.getElementById('close-shop-btn').onclick = () => {
    shopOverlay.classList.add('hidden');
};
document.getElementById('shop-tab-p1').onclick = () => {
    shopTargetPlayer = 'p1';
    renderShop();
};
document.getElementById('shop-tab-p2').onclick = () => {
    shopTargetPlayer = 'p2';
    renderShop();
};


// Menu Actions
document.getElementById('btn-1p').onclick = () => initGame(1);
document.getElementById('btn-2p').onclick = () => initGame(2);

function initGame(mode) {
    globalState.p1.name = document.getElementById('p1-name-input').value.trim() || "Oyuncu 1";
    globalState.p2.name = document.getElementById('p2-name-input').value.trim() || "Oyuncu 2";
    saveState();

    gameMode = mode;
    mainMenu.classList.add('hidden');
    document.getElementById('controls-container').classList.remove('hidden');

    players[0].isActive = true;
    document.getElementById('controls-p1').classList.remove('hidden');

    document.getElementById('p1-label').textContent = mode === 2 ? `${globalState.p1.name} (WASD)` : "Hareket: WASD veya Yön Tuşları";
    document.getElementById('p2-label').textContent = `${globalState.p2.name} (Yön Tuşları)`;

    document.getElementById('respawn-p1').innerHTML = `${globalState.p1.name} Doğuyor: <span>10</span>`;
    document.getElementById('respawn-p2').innerHTML = `${globalState.p2.name} Doğuyor: <span>10</span>`;

    if (mode === 2) {
        players[1].isActive = true;
        document.getElementById('controls-p2').classList.remove('hidden');
        players[0].keyMap = { 'w': 'up', 's': 'down', 'a': 'left', 'd': 'right' };
    } else {
        players[0].keyMap = {
            'w': 'up', 's': 'down', 'a': 'left', 'd': 'right',
            'arrowup': 'up', 'arrowdown': 'down', 'arrowleft': 'left', 'arrowright': 'right'
        };
    }

    startLevel();
}

function spawnObstacles(count) {
    for (let i = 0; i < count; i++) {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        const width = 60 + Math.random() * 90;
        const height = 60 + Math.random() * 90;

        let x, y;
        let validPosition = false;
        let attempts = 0;

        while (!validPosition && attempts < 100) {
            const boundaryPadding = 60;
            x = boundaryPadding + Math.random() * (arenaBounds.width - width - boundaryPadding * 2);
            y = boundaryPadding + Math.random() * (arenaBounds.height - height - boundaryPadding * 2);

            const newRect = { x, y, width, height };
            validPosition = true;

            const centerX = arenaBounds.width / 2;
            const centerY = arenaBounds.height / 2;
            if (Math.abs(x - centerX) < 150 && Math.abs(y - centerY) < 150) {
                validPosition = false;
            }

            if (validPosition) {
                for (const obs of obstacles) {
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

            for (const obs of obstacles) {
                if (checkCollision(newRect, obs)) {
                    validPosition = false;
                    break;
                }
            }
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

        const rand = Math.random();
        let type = 'regular';
        let width = 36;
        let height = 36;
        let baseSpeed = 1.0;

        if (rand < 0.15) {
            type = 'brute';
            monster.classList.add('brute');
            width = 60;
            height = 60;
            baseSpeed = 0.6;
        } else if (rand < 0.30) {
            type = 'dasher';
            monster.classList.add('dasher');
            width = 24;
            height = 24;
            baseSpeed = 2.5;
        } else if (rand < 0.45) {
            type = 'phantom';
            monster.classList.add('phantom');
            width = 36;
            height = 36;
            baseSpeed = 1.1;
        } else if (rand < 0.65) {
            type = 'elite';
            monster.classList.add('elite');
            width = 44;
            height = 44;
            baseSpeed = 1.8;
        }

        let x, y;
        let validPosition = false;
        while (!validPosition) {
            x = Math.random() * (arenaBounds.width - width);
            y = Math.random() * (arenaBounds.height - height);

            let safeFromAll = true;
            players.forEach(p => {
                if (p.isActive) {
                    const dist = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
                    if (dist < 500) safeFromAll = false;
                }
            });
            if (safeFromAll) validPosition = true;
        }

        monster.style.left = `${x}px`;
        monster.style.top = `${y}px`;
        arena.appendChild(monster);

        monsters.push({
            element: monster, x: x, y: y, width: width, height: height,
            speed: baseSpeed + (level - 1) * 0.3 + Math.random() * 0.5,
            type: type
        });
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

function startLevel() {
    obstacles.forEach(obs => obs.element.remove());
    coins.forEach(coin => coin.element.remove());
    monsters.forEach(monster => monster.element.remove());
    obstacles = [];
    coins = [];
    monsters = [];

    const newWidth = 1200 + (level - 1) * 100;
    const newHeight = 700 + (level - 1) * 60;
    arena.style.width = `${newWidth}px`;
    arena.style.height = `${newHeight}px`;
    arenaBounds.width = newWidth;
    arenaBounds.height = newHeight;

    const obstacleCount = Math.min(5 + level * 2, 25);
    const coinCount = gameMode === 2 ? (10 + level * 4) : Math.floor(5 + level * 3);
    const monsterCount = (gameMode === 2 ? 2 : 1) + Math.floor(level / 2);

    spawnObstacles(obstacleCount);
    spawnCoins(coinCount);
    spawnMonsters(monsterCount);

    const centerX = arenaBounds.width / 2;
    const centerY = arenaBounds.height / 2;

    if (gameMode === 1) {
        players[0].x = centerX - 20;
        players[0].y = centerY - 20;
    } else {
        players[0].x = centerX - 60;
        players[0].y = centerY - 20;
        players[1].x = centerX + 20;
        players[1].y = centerY - 20;
    }

    players.forEach(p => {
        if (p.isActive) {
            p.element.classList.remove('hidden');
            p.element.classList.remove('shielded');
            p.isDead = false;
            p.respawnFrames = 0;
            p.invulnerableFrames = 300;
            p.element.style.left = `${p.x}px`;
            p.element.style.top = `${p.y}px`;
            p.element.style.opacity = 0.5;
            document.getElementById(`respawn-p${p.id}`).classList.add('hidden');

            // Name Tag & Skin Application
            let skinId = globalState[`p${p.id}`].equipped;
            let skinClass = skinCatalog.find(s => s.id === skinId)?.class || 'skin-default';
            if (skinId === 'default') {
                skinClass = p.id === 1 ? 'skin-default-p1' : 'skin-default-p2';
            }
            p.element.className = `player p${p.id} ${skinClass}`;

            let nameId = globalState[`p${p.id}`].equippedName || 'default';
            let nameClass = nameStyleCatalog.find(s => s.id === nameId)?.class || 'name-default';

            p.element.innerHTML = `<div class="player-name-tag ${nameClass}">${globalState[`p${p.id}`].name}</div>`;
        } else {
            p.element.className = `player p${p.id} hidden`;
            p.element.innerHTML = '';
        }
    });

    currentCameraScale = 1.0;
    updateCamera();
    updateMinimap();

    startCountdown();
}

function startCountdown() {
    gamePaused = true;
    if (countdownOverlay) {
        countdownOverlay.classList.remove('hidden');
        let count = 3;
        countdownText.textContent = count;

        countdownText.style.animation = 'none';
        void countdownText.offsetWidth;
        countdownText.style.animation = null;

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownText.textContent = count;
                countdownText.style.animation = 'none';
                void countdownText.offsetWidth;
                countdownText.style.animation = null;
            } else if (count === 0) {
                countdownText.textContent = 'BAŞLA!';
                countdownText.style.animation = 'none';
                void countdownText.offsetWidth;
                countdownText.style.animation = null;
            } else {
                clearInterval(interval);
                countdownOverlay.classList.add('hidden');
                gamePaused = false;
            }
        }, 1000);
    } else {
        gamePaused = false;
    }
}

function advanceLevel() {
    level++;
    levelDisplay.textContent = level;
    gamePaused = true;
    overlayTitle.textContent = "Seviye Tamamlandı!";
    overlayMessage.textContent = `Tebrikler! Seviye ${level} için hazır mısın?`;
    overlayButton.textContent = "Sonraki Seviye";
    overlay.classList.remove('hidden');
}

overlayButton.onclick = () => {
    if (gameOver) {
        location.reload();
    } else {
        overlay.classList.add('hidden');
        startLevel();
    }
};

function togglePause() {
    if (gameOver || !mainMenu.classList.contains('hidden') || !overlay.classList.contains('hidden') || !countdownOverlay.classList.contains('hidden')) {
        return;
    }

    isManuallyPaused = !isManuallyPaused;
    if (isManuallyPaused) {
        gamePaused = true;
        pauseOverlay.classList.remove('hidden');
    } else {
        pauseOverlay.classList.add('hidden');
        startCountdown();
    }
}

pauseBtn.onclick = togglePause;
resumeBtn.onclick = togglePause;

if (restartBtn) {
    restartBtn.onclick = () => {
        score = 0;
        level = 1;
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        gameOver = false;

        isManuallyPaused = false;
        pauseOverlay.classList.add('hidden');

        startLevel();
    };
}

if (mainmenuBtn) {
    mainmenuBtn.onclick = () => {
        location.reload();
    };
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') togglePause();

    const key = e.key.toLowerCase();

    let visualKey = key;
    if (gameMode === 1) {
        if (key === 'arrowup') visualKey = 'w';
        if (key === 'arrowdown') visualKey = 's';
        if (key === 'arrowleft') visualKey = 'a';
        if (key === 'arrowright') visualKey = 'd';
    }

    if (keyElements[visualKey]) {
        keyElements[visualKey].classList.add('active');
    }

    players.forEach(p => {
        if (!p.isActive) return;
        if (p.keyMap[key]) {
            p.keys[p.keyMap[key]] = true;
            p.element.classList.remove('idle');
        }
    });
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();

    let visualKey = key;
    if (gameMode === 1) {
        if (key === 'arrowup') visualKey = 'w';
        if (key === 'arrowdown') visualKey = 's';
        if (key === 'arrowleft') visualKey = 'a';
        if (key === 'arrowright') visualKey = 'd';
    }

    if (keyElements[visualKey]) {
        keyElements[visualKey].classList.remove('active');
    }

    players.forEach(p => {
        if (!p.isActive) return;
        if (p.keyMap[key]) {
            p.keys[p.keyMap[key]] = false;
        }

        if (!p.keys.up && !p.keys.down && !p.keys.left && !p.keys.right) {
            p.element.classList.add('idle');
        }
    });
});

function update() {
    requestAnimationFrame(update);
    if (gameOver || gamePaused) return;

    players.forEach(p => {
        if (!p.isActive) return;

        if (p.isDead) {
            if (p.respawnFrames > 0) {
                p.respawnFrames--;
                const sec = Math.ceil(p.respawnFrames / 60);
                document.querySelector(`#respawn-p${p.id} span`).textContent = sec;
                if (p.respawnFrames <= 0) {
                    p.isDead = false;
                    p.element.classList.remove('hidden');
                    document.getElementById(`respawn-p${p.id}`).classList.add('hidden');

                    const partner = players.find(x => x.isActive && !x.isDead && x.id !== p.id);
                    if (partner) {
                        p.x = partner.x;
                        p.y = partner.y;
                    }
                    p.invulnerableFrames = 300;
                }
            }
            return;
        }

        if (p.invulnerableFrames > 0) {
            p.invulnerableFrames--;
            p.element.classList.add('shielded');
            p.element.style.opacity = (p.invulnerableFrames % 10 < 5) ? 0.6 : 1;
            if (p.invulnerableFrames <= 0) {
                p.element.style.opacity = 1;
                p.element.classList.remove('shielded');
            }
        }

        let dx = 0;
        let dy = 0;
        if (p.keys.up) dy -= p.speed;
        if (p.keys.down) dy += p.speed;
        if (p.keys.left) dx -= p.speed;
        if (p.keys.right) dx += p.speed;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx = (dx / length) * p.speed;
            dy = (dy / length) * p.speed;
        }

        let playerRect = { x: p.x, y: p.y, width: p.size, height: p.size };

        p.x += dx;
        if (p.x < 0) p.x = 0;
        if (p.x + p.size > arenaBounds.width) p.x = arenaBounds.width - p.size;

        playerRect.x = p.x;
        for (const obstacle of obstacles) {
            if (checkCollision(playerRect, obstacle)) {
                if (dx > 0) p.x = obstacle.x - p.size;
                else if (dx < 0) p.x = obstacle.x + obstacle.width;
                playerRect.x = p.x;
            }
        }

        p.y += dy;
        if (p.y < 0) p.y = 0;
        if (p.y + p.size > arenaBounds.height) p.y = arenaBounds.height - p.size;

        playerRect.y = p.y;
        for (const obstacle of obstacles) {
            if (checkCollision(playerRect, obstacle)) {
                if (dy > 0) p.y = obstacle.y - p.size;
                else if (dy < 0) p.y = obstacle.y + obstacle.height;
                playerRect.y = p.y;
            }
        }

        playerRect = { x: p.x, y: p.y, width: p.size, height: p.size };
        for (let i = coins.length - 1; i >= 0; i--) {
            const coin = coins[i];
            if (checkCollision(playerRect, coin)) {
                coin.element.remove();
                coins.splice(i, 1);

                score += 10;
                scoreDisplay.textContent = score;

                globalState.coins += 10;
                saveState();
            }
        }

        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
    });

    if (coins.length === 0 && obstacles.length > 0) {
        advanceLevel();
        return;
    }

    const activeAlives = players.filter(p => p.isActive && !p.isDead);
    if (activeAlives.length > 0) {
        for (const monster of monsters) {
            let closestPlayer = null;
            let minDist = Infinity;

            for (const p of activeAlives) {
                const dist = Math.sqrt(Math.pow(p.x - monster.x, 2) + Math.pow(p.y - monster.y, 2));
                if (dist < minDist) {
                    minDist = dist;
                    closestPlayer = p;
                }
            }

            if (closestPlayer && minDist > 0) {
                const mDx = ((closestPlayer.x - monster.x) / minDist) * monster.speed;
                const mDy = ((closestPlayer.y - monster.y) / minDist) * monster.speed;
                monster.x += mDx;
                monster.y += mDy;
                monster.element.style.left = `${monster.x}px`;
                monster.element.style.top = `${monster.y}px`;

                for (const p of activeAlives) {
                    if (p.invulnerableFrames <= 0) {
                        const pRect = { x: p.x, y: p.y, width: p.size, height: p.size };
                        if (checkCollision(pRect, monster)) {
                            p.isDead = true;
                            p.element.classList.add('hidden');
                            p.respawnFrames = 600; // 10 seconds
                            document.getElementById(`respawn-p${p.id}`).classList.remove('hidden');
                        }
                    }
                }
            }
        }
    }

    const anyActive = players.some(p => p.isActive);
    if (anyActive) {
        const allDead = players.filter(p => p.isActive).every(p => p.isDead);
        if (allDead) {
            gameOver = true;
            overlayTitle.textContent = "OYUN BİTTİ!";
            overlayMessage.textContent = `Toplam Skorun: ${score}`;
            overlayButton.textContent = "Tekrar Oyna";
            overlay.classList.remove('hidden');
        }
    }

    updateCamera();
    updateMinimap();
}

function updateCamera() {
    const activeAlives = players.filter(p => p.isActive && !p.isDead);
    if (activeAlives.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    activeAlives.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x + p.size > maxX) maxX = p.x + p.size;
        if (p.y < minY) minY = p.y;
        if (p.y + p.size > maxY) maxY = p.y + p.size;
    });

    const targetCamX = (minX + maxX) / 2;
    const targetCamY = (minY + maxY) / 2;

    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;

    let targetScale = 1.0;
    if (gameMode === 2) {
        const distW = maxX - minX;
        const distH = maxY - minY;
        const reqW = distW + 300;
        const reqH = distH + 300;
        const scaleX = containerWidth / reqW;
        const scaleY = containerHeight / reqH;
        targetScale = Math.min(1.0, Math.max(0.4, Math.min(scaleX, scaleY)));
    }

    currentCameraScale = currentCameraScale * 0.9 + targetScale * 0.1;

    let camX = containerWidth / 2 - targetCamX * currentCameraScale;
    let camY = containerHeight / 2 - targetCamY * currentCameraScale;

    const scaledArenaW = arenaBounds.width * currentCameraScale;
    const scaledArenaH = arenaBounds.height * currentCameraScale;

    if (scaledArenaW > containerWidth) {
        camX = Math.min(0, Math.max(camX, containerWidth - scaledArenaW));
    } else {
        camX = (containerWidth - scaledArenaW) / 2;
    }

    if (scaledArenaH > containerHeight) {
        camY = Math.min(0, Math.max(camY, containerHeight - scaledArenaH));
    } else {
        camY = (containerHeight - scaledArenaH) / 2;
    }

    arena.style.transform = `translate(${camX}px, ${camY}px) scale(${currentCameraScale})`;
}

function updateMinimap() {
    minimap.innerHTML = '';
    const mWidth = minimap.clientWidth;
    const mHeight = minimap.clientHeight;
    const scaleX = mWidth / arenaBounds.width;
    const scaleY = mHeight / arenaBounds.height;

    obstacles.forEach(obs => {
        const dot = document.createElement('div');
        dot.classList.add('minimap-dot', 'obstacle-dot');
        dot.style.left = `${obs.x * scaleX + (obs.width * scaleX / 2)}px`;
        dot.style.top = `${obs.y * scaleY + (obs.height * scaleY / 2)}px`;
        dot.style.width = `${obs.width * scaleX}px`;
        dot.style.height = `${obs.height * scaleY}px`;
        minimap.appendChild(dot);
    });

    coins.forEach(coin => {
        const dot = document.createElement('div');
        dot.classList.add('minimap-dot', 'coin-dot');
        dot.style.left = `${coin.x * scaleX}px`;
        dot.style.top = `${coin.y * scaleY}px`;
        minimap.appendChild(dot);
    });

    monsters.forEach(monster => {
        const dot = document.createElement('div');
        dot.classList.add('minimap-dot', 'monster-dot');
        if (monster.type !== 'regular') {
            dot.classList.add(`${monster.type}-dot`);
        }
        dot.style.left = `${monster.x * scaleX}px`;
        dot.style.top = `${monster.y * scaleY}px`;
        minimap.appendChild(dot);
    });

    players.forEach(p => {
        if (p.isActive && !p.isDead) {
            const pDot = document.createElement('div');
            pDot.classList.add('minimap-dot', 'player-dot', `p${p.id}`);

            // Apply skin class to minimap dot
            const skinId = globalState[`p${p.id}`].equipped;
            const skinClass = skinCatalog.find(s => s.id === skinId)?.class;
            if (skinClass && skinId !== 'default') {
                pDot.classList.add(skinClass);
            }

            pDot.style.left = `${(p.x + p.size / 2) * scaleX}px`;
            pDot.style.top = `${(p.y + p.size / 2) * scaleY}px`;
            minimap.appendChild(pDot);
        }
    });
}

loadState();
update();
