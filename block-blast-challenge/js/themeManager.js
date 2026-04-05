// js/themeManager.js
class ThemeManager {
    constructor() {
        this.currentThemeIndex = 0;
        this.themes = [
            { name: "THE VOID", minScore: 0, className: "theme-void", maxScore: 500 },
            { name: "FOREST", minScore: 500, className: "theme-forest", maxScore: 1500 },
            { name: "SUMMIT", minScore: 1500, className: "theme-summit", maxScore: 2500 },
            { name: "SWAMP", minScore: 2500, className: "theme-swamp", maxScore: 5000 },
            { name: "DROUGHT", minScore: 5000, className: "theme-drought", maxScore: 7000 },
            { name: "COSMOS", minScore: 7000, className: "theme-cosmos", maxScore: Infinity }
        ];

        this.container = document.getElementById('game-container');
        this.nameDisplay = document.getElementById('current-theme-name');
        this.progressBar = document.getElementById('theme-progress-bar');
        this.bgLayer = document.getElementById('background-layer');
        this.interactiveLayer = document.getElementById('interactive-layer');

        this.activeEntities = []; // Array to store interval IDs or DOM elements for cleanup
        this.eagleCells = []; // Track currently marked cells
        this.snakePos = { x: -1, y: -1 }; // Track snake position on grid
    }

    checkScoreAndProcessTheme(score) {
        // Find highest theme where score >= minScore
        let nextThemeIndex = 0;
        for (let i = this.themes.length - 1; i >= 0; i--) {
            if (score >= this.themes[i].minScore) {
                nextThemeIndex = i;
                break;
            }
        }

        if (nextThemeIndex !== this.currentThemeIndex) {
            this.applyTheme(nextThemeIndex);
        }

        this.updateProgressBar(score);
    }

    applyTheme(index) {
        // Remove old
        this.container.classList.remove(this.themes[this.currentThemeIndex].className);

        // Add new
        this.currentThemeIndex = index;
        const theme = this.themes[this.currentThemeIndex];
        this.container.classList.add(theme.className);
        this.nameDisplay.textContent = theme.name;

        // Visual pop effect
        this.nameDisplay.style.transform = 'scale(1.2)';
        this.nameDisplay.style.color = '#fff';
        setTimeout(() => {
            this.nameDisplay.style.transform = 'scale(1)';
            this.nameDisplay.style.color = 'var(--accent-color)';
        }, 500);

        this.setupThemeEntities(theme.name);
    }

    setupThemeEntities(themeName) {
        this.cleanupEntities();

        switch (themeName) {
            case "FOREST":
                this.spawnDeer();
                this.spawnLeaves();
                this.spawnFox();
                break;
            case "SUMMIT":
                this.spawnEagleEvent();
                // Yeti appears after 1 minute in Summit
                setTimeout(() => {
                    if (this.currentThemeName === "SUMMIT") {
                        this.spawnYeti();
                    }
                }, 60000);
                break;
            case "DROUGHT":
                this.spawnCamel();
                this.spawnSandstorm();
                this.spawnEgyptian();
                this.spawnVultures();
                this.spawnWindBlur();
                // Shuffle logic
                const shuffleInterval = setInterval(() => {
                    if (window.game) window.game.shuffleGrid();
                }, 25000); // Shuffle every 25 seconds
                this.activeEntities.push(shuffleInterval);
                break;
            case "SWAMP":
                this.spawnSnakeEvent();
                this.spawnFlyEvent();
                this.spawnSwampFlies();
                this.spawnAlligator();
                break;
            case "COSMOS":
                this.spawnPlanets();
                this.spawnUfoEvent();
                break;
        }
    }

    cleanupEntities() {
        this.bgLayer.innerHTML = '';
        this.interactiveLayer.innerHTML = '';
        this.activeEntities.forEach(clearInterval);
        this.activeEntities = [];

        if (window.game) {
            this.eagleCells.forEach(cell => {
                const domCell = window.game.cells[cell.y][cell.x];
                if (domCell) domCell.classList.remove('eagle-bonus');
            });
        }
        this.eagleCells = [];
        this.snakePos = { x: -1, y: -1 };
    }

    spawnDeer() {
        const deer = document.createElement('div');
        deer.className = 'bg-deer';
        this.bgLayer.appendChild(deer);
    }

    spawnLeaves() {
        const interval = setInterval(() => {
            const leaf = document.createElement('div');
            leaf.className = 'leaf-particle';
            leaf.style.left = `${Math.random() * 100}%`;
            // Randomize size and animation duration slightly
            const size = 10 + Math.random() * 15;
            leaf.style.width = `${size}px`;
            leaf.style.height = `${size}px`;
            leaf.style.animationDuration = `${5 + Math.random() * 5}s`;

            this.bgLayer.appendChild(leaf);

            setTimeout(() => {
                if (leaf.parentNode) leaf.remove();
            }, 10000);
        }, 800);
        this.activeEntities.push(interval);
    }

    spawnFox() {
        const interval = setInterval(() => {
            const foxContainer = document.createElement('div');
            foxContainer.className = 'bg-fox-container';
            foxContainer.innerHTML = `
                <div class="bg-fox">🦊</div>
                <div class="bg-fox-hand">👋</div>
            `;
            // Random horizontal position (5% to 85% to avoid clipping)
            foxContainer.style.left = `${5 + Math.random() * 80}%`;
            this.bgLayer.appendChild(foxContainer);

            setTimeout(() => {
                if (foxContainer.parentNode) foxContainer.remove();
            }, 6000); // Fox stays for 6 seconds
        }, 12000); // Spawns every 12 seconds
        this.activeEntities.push(interval);
    }

    spawnPlanets() {
        const planetTypes = ['planet-1', 'planet-2', 'planet-3'];
        // Spawn 3 basic background planets
        for (let i = 0; i < 3; i++) {
            const planet = document.createElement('div');
            planet.className = `bg-planet ${planetTypes[i]}`;
            planet.style.left = `${10 + Math.random() * 80}%`;
            planet.style.top = `${10 + Math.random() * 40}%`;
            this.bgLayer.appendChild(planet);
        }
    }

    spawnUfoEvent() {
        const interval = setInterval(() => {
            const ufo = document.createElement('div');
            ufo.className = 'bg-ufo';
            ufo.textContent = '🛸';
            ufo.style.top = `${10 + Math.random() * 20}%`;
            this.interactiveLayer.appendChild(ufo);

            // Alien blocker logic
            setTimeout(() => {
                if (window.game) window.game.spawnAlienBlock();
            }, 4000);

            setTimeout(() => { if (ufo.parentNode) ufo.remove(); }, 8000);
        }, 20000);
        this.activeEntities.push(interval);
    }

    spawnYeti() {
        const container = document.createElement('div');
        container.className = 'bg-yeti-container';
        container.innerHTML = `
            <div class="bg-yeti">👣</div>
            <div class="bg-yeti-hand">👋</div>
        `;
        container.style.left = `${10 + Math.random() * 70}%`;
        this.interactiveLayer.appendChild(container);

        setTimeout(() => {
            if (container.parentNode) container.remove();
        }, 8000);
    }

    spawnCamel() {
        const camel = document.createElement('div');
        camel.className = 'bg-camel';
        this.bgLayer.appendChild(camel);
    }

    spawnEgyptian() {
        const interval = setInterval(() => {
            const container = document.createElement('div');
            container.className = 'bg-egyptian-container';
            container.innerHTML = `
                <div class="bg-egyptian">🏺</div>
                <div class="bg-egyptian-hand">👋</div>
            `;
            container.style.left = `${10 + Math.random() * 70}%`;
            this.interactiveLayer.appendChild(container);
            setTimeout(() => {
                if (container.parentNode) container.remove();
            }, 7000);
        }, 18000);
        this.activeEntities.push(interval);
    }

    spawnAlligator() {
        const interval = setInterval(() => {
            const container = document.createElement('div');
            container.className = 'bg-alligator-container';
            container.innerHTML = `
                <div class="bg-alligator">🐊</div>
                <div class="bg-alligator-hand">👋</div>
                <div class="bg-apple">🍎</div>
            `;
            container.style.left = `${10 + Math.random() * 70}%`;
            this.interactiveLayer.appendChild(container);

            const apple = container.querySelector('.bg-apple');
            apple.onclick = () => {
                if (window.game) {
                    window.game.addScore(500);
                    const popup = document.createElement('div');
                    popup.textContent = "+500";
                    popup.className = 'score-popup';
                    popup.style.left = container.style.left;
                    popup.style.top = '60%';
                    this.interactiveLayer.appendChild(popup);
                    setTimeout(() => popup.remove(), 1000);
                }
                apple.remove();
            };

            setTimeout(() => {
                if (container.parentNode) container.remove();
            }, 8000);
        }, 50000); // Spawns every 50 seconds
        this.activeEntities.push(interval);
    }

    spawnSandstorm() {
        const interval = setInterval(() => {
            // Spawn a burst of sand particles (gust of wind)
            for (let i = 0; i < 20; i++) {
                const sand = document.createElement('div');
                sand.className = 'sand-particle';
                sand.style.top = `${Math.random() * 100}%`;
                sand.style.animationDuration = `${0.5 + Math.random() * 1.5}s`;
                this.bgLayer.appendChild(sand);

                setTimeout(() => {
                    if (sand.parentNode) sand.remove();
                }, 2500);
            }
        }, 12000); // Gust every 12 seconds
        this.activeEntities.push(interval);
    }

    spawnVultures() {
        const interval = setInterval(() => {
            const vulture = document.createElement('div');
            vulture.className = 'bg-vulture';
            vulture.textContent = '🦅';
            vulture.style.top = `${5 + Math.random() * 15}%`;
            this.bgLayer.appendChild(vulture);
            setTimeout(() => {
                if (vulture.parentNode) vulture.remove();
            }, 12000);
        }, 10000);
        this.activeEntities.push(interval);
    }

    spawnWindBlur() {
        const interval = setInterval(() => {
            const mainArea = document.getElementById('main-area');
            mainArea.classList.add('wind-blur');
            setTimeout(() => {
                mainArea.classList.remove('wind-blur');
            }, 3000);
        }, 15000);
        this.activeEntities.push(interval);
    }

    spawnEagleEvent() {
        const eagle = document.createElement('div');
        eagle.className = 'bg-eagle';
        eagle.textContent = '🦅';
        this.bgLayer.appendChild(eagle);
        setTimeout(() => {
            if (eagle.parentNode) eagle.remove();
        }, 15000);

        // Gameplay Event: Every 15 seconds mark a random cell as 3x multiplier
        const interval = setInterval(() => {
            if (!window.game) return;
            // Remove old Eagle marks
            this.eagleCells.forEach(c => {
                const cellDOM = window.game.cells[c.y][c.x];
                if (cellDOM) cellDOM.classList.remove('eagle-bonus');
            });
            this.eagleCells = [];

            // Mark 2 random empty cells
            let tries = 0;
            while (this.eagleCells.length < 2 && tries < 50) {
                const rx = Math.floor(Math.random() * 8);
                const ry = Math.floor(Math.random() * 8);
                if (window.game.grid[ry][rx] === 0) {
                    this.eagleCells.push({ x: rx, y: ry });
                    window.game.cells[ry][rx].classList.add('eagle-bonus');
                }
                tries++;
            }
        }, 15000);
        this.activeEntities.push(interval);
    }

    spawnSnakeEvent() {
        const interval = setInterval(() => {
            if (!window.game) return;

            // Snake visually moves across the screen over the grid
            const snake = document.createElement('div');
            snake.className = 'moving-snake';
            // Random vertical position over the grid area
            snake.style.top = `${20 + Math.random() * 50}%`;

            snake.addEventListener('mouseenter', () => {
                if (window.game) {
                    window.game.triggerGameOver("Bitten by the Swamp Snake!");
                }
            });

            snake.addEventListener('touchstart', () => {
                if (window.game) {
                    window.game.triggerGameOver("Bitten by the Swamp Snake!");
                }
            });

            document.getElementById('game-container').appendChild(snake);

            setTimeout(() => {
                if (snake.parentNode) snake.remove();
            }, 6000); // Exists for 6 seconds of crossing

        }, 9000); // Spawns every 9 seconds
        this.activeEntities.push(interval);
    }

    spawnSwampFlies() {
        for (let i = 0; i < 15; i++) {
            const fly = document.createElement('div');
            fly.className = 'ambient-fly';
            fly.style.left = `${Math.random() * 100}%`;
            fly.style.top = `${Math.random() * 30}%`;
            fly.style.animationDuration = `${2 + Math.random() * 4}s`;
            fly.style.animationDelay = `${Math.random() * 2}s`;
            this.bgLayer.appendChild(fly);
        }
    }

    spawnFlyEvent() {
        // Fly spawns randomly, clicking it gives 500 points
        const interval = setInterval(() => {
            const fly = document.createElement('div');
            fly.className = 'bonus-fly';
            fly.style.left = `${20 + Math.random() * 60}%`;
            fly.style.top = `${20 + Math.random() * 60}%`;

            fly.onclick = () => {
                if (window.game) {
                    window.game.addScore(500);
                    // text popup
                    const popup = document.createElement('div');
                    popup.textContent = "+500";
                    popup.style.position = 'absolute';
                    popup.style.left = fly.style.left;
                    popup.style.top = fly.style.top;
                    popup.style.color = '#fbbf24';
                    popup.style.fontWeight = 'bold';
                    popup.style.fontSize = '2rem';
                    popup.style.animation = 'clearLine 1s forwards';
                    this.interactiveLayer.appendChild(popup);
                    setTimeout(() => popup.remove(), 1000);
                }
                fly.remove();
            };

            this.interactiveLayer.appendChild(fly);
            setTimeout(() => {
                if (fly.parentNode) fly.remove();
            }, 5000); // Exists for 5 seconds
        }, 12000);
        this.activeEntities.push(interval);
    }

    updateProgressBar(score) {
        const theme = this.themes[this.currentThemeIndex];
        if (theme.maxScore === Infinity) {
            this.progressBar.style.width = '100%';
            return;
        }

        const range = theme.maxScore - theme.minScore;
        const currentProgress = score - theme.minScore;
        const percentage = Math.max(0, Math.min(100, (currentProgress / range) * 100));
        this.progressBar.style.width = `${percentage}%`;
    }

    isAntiGravityActive() {
        return this.themes[this.currentThemeIndex].name === "COSMOS"; // COSMOS check safely
    }
}

window.ThemeManager = new ThemeManager();
