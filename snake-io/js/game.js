class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.minimapCanvas = document.getElementById('minimap-canvas');
        this.minimapCtx = this.minimapCanvas.getContext('2d');
        
        this.mapSize = 4000;
        this.snakes = [];
        this.foods = [];
        this.player = null;
        
        this.camera = { x: 0, y: 0, zoom: 1 };
        this.mousePos = { x: 0, y: 0 };
        
        this.lastTime = 0;
        this.isRunning = false;
        
        this.maxBots = 15;
        this.maxFood = 600;
        this.powerUpTimer = 15000; // 15 seconds spawn interval
        
        // Spatial Grid for Food & Snakes
        this.gridSize = 250; // Cell size
        this.cols = Math.ceil(this.mapSize / this.gridSize);
        this.rows = Math.ceil(this.mapSize / this.gridSize);
        this.foodGrid = Array.from({length: this.cols}, () => Array.from({length: this.rows}, () => []));
        this.snakeGrid = Array.from({length: this.cols}, () => Array.from({length: this.rows}, () => []));
        
        // Cache DOM elements
        this.ui = {
            length: document.getElementById('length-display'),
            score: document.getElementById('score-display'),
            leaderboard: document.getElementById('leaderboard-list'),
            gameOver: document.getElementById('game-over-screen'),
            finalLength: document.getElementById('final-length'),
            finalScore: document.getElementById('final-score')
        };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.player) this.player.setDashing(true);
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (this.player) this.player.setDashing(false);
        });
        
        this.keys = { w: false, a: false, s: false, d: false, arrowup: false, arrowdown: false, arrowleft: false, arrowright: false };
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) this.keys[key] = true;
        });
        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) this.keys[key] = false;
        });
        
        this.botNames = ["Slytherin", "Noodle", "DangerRope", "Byte", "Crawler", "Spike", "Shadow", "Ghost", "Titan", "Viper", "Cobra", "Mamba"];
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start(playerName) {
        this.snakes = [];
        this.foods = [];
        this.foodGrid = Array.from({length: this.cols}, () => Array.from({length: this.rows}, () => []));
        
        // Create player
        this.player = new Snake(0, playerName || "Player", this, this.mapSize/2, this.mapSize/2, {
            isPlayer: true,
            color: '#34d399' // Emerald for player
        });
        this.snakes.push(this.player);
        
        // Spawn initial food
        for (let i = 0; i < this.maxFood; i++) {
            this.spawnRandomFood();
        }
        
        // Spawn bots
        for (let i = 0; i < this.maxBots; i++) {
            this.spawnBot();
        }
        
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
    }

    spawnBot() {
        let x = Math.random() * this.mapSize;
        let y = Math.random() * this.mapSize;
        let name = this.botNames[Math.floor(Math.random() * this.botNames.length)];
        let bot = new Snake(this.snakes.length, name, this, x, y, {
            startLength: 15 + Math.floor(Math.random() * 20)
        });
        this.snakes.push(bot);
    }

    spawnRandomFood() {
        let x = Math.random() * this.mapSize;
        let y = Math.random() * this.mapSize;
        let value = 2 + Math.random() * 8; // 2 to 10
        let food = new Food(x, y, value);
        this.foods.push(food);
        this.addToGrid(food);
    }

    spawnFood(x, y, value, color) {
        let food = new Food(x, y, value, color);
        this.foods.push(food);
        this.addToGrid(food);
    }

    spawnPowerUp() {
        let x = Math.random() * this.mapSize;
        let y = Math.random() * this.mapSize;
        let type = Math.random() < 0.5 ? 'speed' : 'growth';
        let powerUp = new Food(x, y, 10, null, type);
        this.foods.push(powerUp);
        this.addToGrid(powerUp);
    }

    addToGrid(food) {
        let gx = Math.floor(food.x / this.gridSize);
        let gy = Math.floor(food.y / this.gridSize);
        if (this.foodGrid[gx] && this.foodGrid[gx][gy]) {
            this.foodGrid[gx][gy].push(food);
        }
    }

    removeFromGrid(food) {
        let gx = Math.floor(food.x / this.gridSize);
        let gy = Math.floor(food.y / this.gridSize);
        if (this.foodGrid[gx] && this.foodGrid[gx][gy]) {
            let idx = this.foodGrid[gx][gy].indexOf(food);
            if (idx !== -1) this.foodGrid[gx][gy].splice(idx, 1);
        }
    }

    removeFood(food) {
        // Optimized dual-removal
        let idx = this.foods.indexOf(food);
        if (idx !== -1) {
            // Swap with last element and pop for O(1) removal
            this.foods[idx] = this.foods[this.foods.length - 1];
            this.foods.pop();
        }
        this.removeFromGrid(food);
    }

    getMouseWorldPos() {
        if (!this.player) return {x:0, y:0};
        
        // Convert screen pixel to world coordinate based on camera
        let halfW = this.canvas.width / 2;
        let halfH = this.canvas.height / 2;
        
        let screenDx = this.mousePos.x - halfW;
        let screenDy = this.mousePos.y - halfH;
        
        // Zoom affects relationship
        let worldDx = screenDx / this.camera.zoom;
        let worldDy = screenDy / this.camera.zoom;
        
        return {
            x: this.camera.x + worldDx,
            y: this.camera.y + worldDy
        };
    }

    loop(timestamp) {
        if (!this.isRunning) return;
        
        let dt = timestamp - this.lastTime;
        if (dt > 100) dt = 100; // Cap large diffs on tab switch
        this.lastTime = timestamp;
        
        this.update(dt);
        this.draw(timestamp);
        
        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        // Spawn missing entities
        while (this.foods.length < this.maxFood) {
            this.spawnRandomFood();
        }
        while (this.snakes.length < this.maxBots + 1) { // +1 for player
            this.spawnBot();
        }

        // 1. Clear spatial grid for snakes
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.snakeGrid[x][y].length = 0;
            }
        }

        // 2. Update snakes and populate grid
        for (let snake of this.snakes) {
            snake.update(dt);
            if (snake.state === 'alive') {
                // Add segments to grid (skip some for performance if long)
                let step = snake.length > 100 ? 2 : 1;
                for (let i = 0; i < snake.segments.length; i += step) {
                    let seg = snake.segments[i];
                    let gx = Math.floor(seg.x / this.gridSize);
                    let gy = Math.floor(seg.y / this.gridSize);
                    if (this.snakeGrid[gx] && this.snakeGrid[gx][gy]) {
                        this.snakeGrid[gx][gy].push({snake: snake, segment: seg, index: i});
                    }
                }
            }
        }
        
        // Update foods
        for (let food of this.foods) {
            food.update(dt);
        }
        
        // Update power-up timer
        this.powerUpTimer -= dt;
        if (this.powerUpTimer <= 0) {
            this.powerUpTimer = 15000;
            this.spawnPowerUp();
        }
        
        // Check snake-to-snake collisions
        this.checkSnakeCollisions();
        
        // Clean dead snakes
        this.snakes = this.snakes.filter(s => s.state === 'alive');
        
        // Update Camera target smoothly
        if (this.player && this.player.state === 'alive') {
            this.camera.x += (this.player.x - this.camera.x) * 0.1;
            this.camera.y += (this.player.y - this.camera.y) * 0.1;
            
            let targetZoom = 1.2 - Math.min(0.7, this.player.length / 500);
            this.camera.zoom += (targetZoom - this.camera.zoom) * 0.05;
        }

        // Update UI intermittently
        if (Math.random() < 0.2) {
            this.updateUI();
        }
    }

    checkSnakeCollisions() {
        for (let i = 0; i < this.snakes.length; i++) {
            let snake1 = this.snakes[i];
            if (snake1.state !== 'alive' || snake1.segments.length === 0) continue;
            
            let head1 = snake1.segments[0];
            let s1Radius = snake1.getRadius();
            
            // Optimized collision using snakeGrid
            let gx = Math.floor(head1.x / this.gridSize);
            let gy = Math.floor(head1.y / this.gridSize);
            
            collisionLoop:
            for (let x = gx - 1; x <= gx + 1; x++) {
                for (let y = gy - 1; y <= gy + 1; y++) {
                    if (this.snakeGrid[x] && this.snakeGrid[x][y]) {
                        for (let entry of this.snakeGrid[x][y]) {
                            let snake2 = entry.snake;
                            if (snake1 === snake2 && entry.index < 5) continue; // Don't hit own head
                            
                            let seg = entry.segment;
                            let r2 = snake2.getRadius();
                            
                            let dx = head1.x - seg.x;
                            let dy = head1.y - seg.y;
                            let distSq = dx*dx + dy*dy;
                            
                            let minD = (s1Radius*0.8 + r2*0.8);
                            if (distSq < minD*minD) {
                                snake1.die();
                                break collisionLoop;
                            }
                        }
                    }
                }
            }
        }
    }

    onSnakeDeath(snake) {
        if (snake === this.player) {
            setTimeout(() => {
                this.isRunning = false;
                this.ui.gameOver.classList.remove('hidden');
                this.ui.finalLength.innerText = this.player.length;
                this.ui.finalScore.innerText = Math.floor(this.player.score);
            }, 1000);
        }
    }

    updateUI() {
        if (this.player) {
            this.ui.length.innerText = this.player.length;
            this.ui.score.innerText = Math.floor(this.player.score);
        }
        
        let sorted = [...this.snakes].sort((a, b) => b.score - a.score).slice(0, 5);
        this.ui.leaderboard.innerHTML = '';
        for (let i = 0; i < sorted.length; i++) {
            let s = sorted[i];
            let li = document.createElement('li');
            li.innerText = `${i+1}. ${s.name} (${Math.floor(s.score)})`;
            if (s === this.player) {
                li.classList.add('player-row');
            }
            this.ui.leaderboard.appendChild(li);
        }
    }

    drawGrid(ctx, startX, startY, endX, endY) {
        let step = 100;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        let offsetX = Math.floor(startX / step) * step;
        let offsetY = Math.floor(startY / step) * step;
        
        for (let x = offsetX; x < endX; x += step) {
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
        }
        for (let y = offsetY; y < endY; y += step) {
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
        }
        ctx.stroke();
    }

    draw(timestamp) {
        // Clear canvas
        this.ctx.fillStyle = '#111827'; // Dark background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.save();
        
        // Move to center of screen
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        
        // Apply zoom
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        
        // Move to camera position negatively to scroll
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Determine view bounds for culling
        let viewHalfW = (this.canvas.width / 2) / this.camera.zoom;
        let viewHalfH = (this.canvas.height / 2) / this.camera.zoom;
        
        let minX = this.camera.x - viewHalfW;
        let minY = this.camera.y - viewHalfH;
        let maxX = this.camera.x + viewHalfW;
        let maxY = this.camera.y + viewHalfH;

        // Draw Map Border
        this.ctx.strokeStyle = '#ef4444'; // Red borders
        this.ctx.lineWidth = 10;
        this.ctx.strokeRect(0, 0, this.mapSize, this.mapSize);

        // Grid
        this.drawGrid(this.ctx, Math.max(0, minX), Math.max(0, minY), Math.min(this.mapSize, maxX), Math.min(this.mapSize, maxY));

        // Draw Foods (optimized with spatial grid)
        let minGx = Math.max(0, Math.floor(minX / this.gridSize));
        let minGy = Math.max(0, Math.floor(minY / this.gridSize));
        let maxGx = Math.min(this.cols - 1, Math.floor(maxX / this.gridSize));
        let maxGy = Math.min(this.rows - 1, Math.floor(maxY / this.gridSize));

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let x = minGx; x <= maxGx; x++) {
            for (let y = minGy; y <= maxGy; y++) {
                for (let food of this.foodGrid[x][y]) {
                    food.draw(this.ctx);
                }
            }
        }
        
        // Draw Snakes
        for (let snake of this.snakes) {
            // Rough culling for whole snake draw
            if (snake.x > minX - 1000 && snake.x < maxX + 1000 && snake.y > minY - 1000 && snake.y < maxY + 1000) {
                snake.draw(this.ctx);
            }
        }
        
        this.ctx.restore();
        
        // Optimized minimap frequency
        if (Math.floor(timestamp / 16) % 3 === 0) {
            this.drawMinimap();
        }
    }

    drawMinimap() {
        this.minimapCanvas.width = 150;
        this.minimapCanvas.height = 150;
        
        this.minimapCtx.clearRect(0, 0, 150, 150);
        this.minimapCtx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        this.minimapCtx.fillRect(0,0,150,150);
        
        let scale = 150 / this.mapSize;
        
        // Draw bots
        this.minimapCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        for (let s of this.snakes) {
            if (s !== this.player) {
                this.minimapCtx.beginPath();
                this.minimapCtx.arc(s.x * scale, s.y * scale, 1.5, 0, Math.PI*2);
                this.minimapCtx.fill();
            }
        }
        
        // Draw player
        if (this.player && this.player.state === 'alive') {
            this.minimapCtx.fillStyle = '#10b981';
            this.minimapCtx.beginPath();
            this.minimapCtx.arc(this.player.x * scale, this.player.y * scale, 3, 0, Math.PI*2);
            this.minimapCtx.fill();
        }
    }
}
