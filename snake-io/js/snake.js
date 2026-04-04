class Snake {
    constructor(id, name, game, x, y, options = {}) {
        this.id = id;
        this.name = name;
        this.game = game;
        this.isPlayer = options.isPlayer || false;
        
        this.color = options.color || this.getRandomColor();
        
        // Body segments
        this.segments = [];
        this.baseRadius = 12;
        this.length = options.startLength || 20;
        this.score = 0;
        
        // Physics / movement
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.baseSpeed = 0.15; // px per ms
        this.speed = this.baseSpeed;
        this.turnSpeed = 0.003; // rad per ms
        
        // Dash mechanics
        this.isDashing = false;
        this.dashSpeedMultiplier = 2.0;
        this.dashCostTimer = 0;
        this.dashCostInterval = 100; // lose 1 length every X ms while dashing
        
        // Power-up state
        this.speedBoostTimer = 0;
        this.baseSpeedNormal = 0.15;
        this.speedMultiplier = 1.0;
        
        this.state = 'alive';
        
        // Initialize segments
        for (let i = 0; i < this.length; i++) {
            this.segments.push({
                x: x - i * (this.baseRadius * 0.5),
                y: y
            });
        }
        
        // AI specific
        if (!this.isPlayer) {
            this.targetAngle = this.angle;
            this.aiChangeTimer = 0;
            this.targetFood = null;
        }
    }

    getRandomColor() {
        // More vibrant specific colors for snakes
        const hues = Math.floor(Math.random() * 360);
        return `hsl(${hues}, 80%, 60%)`;
    }

    getRadius() {
        // Snake gets slightly fatter as it gets longer
        return this.baseRadius + Math.log10(this.length) * 2;
    }

    setDashing(dashing) {
        // Only dash if we have enough length
        if (dashing && this.length > 15) {
            this.isDashing = true;
        } else {
            this.isDashing = false;
        }
    }

    update(dt) {
        if (this.state !== 'alive') return;

        // Handle dashing and speed boost
        let currentBaseSpeed = this.baseSpeedNormal;
        
        if (this.speedBoostTimer > 0) {
            this.speedBoostTimer -= dt;
            currentBaseSpeed *= 1.8; // 80% speed boost from power-up
        }

        if (this.isDashing) {
            this.speed = currentBaseSpeed * this.dashSpeedMultiplier;
            this.dashCostTimer += dt;
            if (this.dashCostTimer > this.dashCostInterval) {
                this.dashCostTimer = 0;
                this.loseSegment();
                // Check if we can still dash
                if (this.length <= 15) {
                    this.isDashing = false;
                }
            }
        } else {
            this.speed = currentBaseSpeed;
        }

        // Steer towards target angle depending on type
        if (this.isPlayer) {
            let k = this.game.keys;
            let w = k && (k.w || k.arrowup);
            let a = k && (k.a || k.arrowleft);
            let s = k && (k.s || k.arrowdown);
            let d = k && (k.d || k.arrowright);
            
            if (w || a || s || d) {
                let dx = 0; let dy = 0;
                if (w) dy -= 1;
                if (s) dy += 1;
                if (a) dx -= 1;
                if (d) dx += 1;
                if (dx !== 0 || dy !== 0) {
                    let targetAngle = Math.atan2(dy, dx);
                    this.steerAngle(targetAngle, dt);
                }
            } else {
                // Player steers towards point
                let target = this.game.getMouseWorldPos();
                if (target) {
                    let currentTargetAngle = Math.atan2(target.y - this.y, target.x - this.x);
                    this.steerAngle(currentTargetAngle, dt);
                }
            }
        } else {
            this.updateAI(dt);
        }

        // Move head
        let moveDist = this.speed * dt;
        this.x += Math.cos(this.angle) * moveDist;
        this.y += Math.sin(this.angle) * moveDist;
        
        // Map boundaries bounds checking
        if (this.x < 0 || this.x > this.game.mapSize || this.y < 0 || this.y > this.game.mapSize) {
            this.die();
            return;
        }
        
        // Update segments to follow
        this.updateSegments(moveDist);
        
        // Check food collision
        this.checkFood();
    }

    updateSegments(moveDist) {
        // Optimized segment update: use a history of points and sample them
        if (!this.history) {
            this.history = [{x: this.x, y: this.y}];
        }

        let head = {x: this.x, y: this.y};
        let lastHistory = this.history[0];
        let dx = head.x - lastHistory.x;
        let dy = head.y - lastHistory.y;
        let d = Math.sqrt(dx*dx + dy*dy);

        const recordingInterval = 5; 
        if (d >= recordingInterval) {
            this.history.unshift(head);
            let spacing = this.getRadius() * 0.7;
            let maxHistory = Math.ceil((this.length * spacing) / recordingInterval) + 5;
            if (this.history.length > maxHistory) {
                this.history.pop();
            }
        }

        let spacing = this.getRadius() * 0.7;
        let currentSegments = [{x: this.x, y: this.y}];
        let distAccumulator = 0;
        let historyIdx = 0;
        
        for (let i = 1; i < this.length; i++) {
            let targetDist = i * spacing;
            while (historyIdx < this.history.length - 1) {
                let p1 = this.history[historyIdx];
                let p2 = this.history[historyIdx + 1];
                let segDx = p2.x - p1.x;
                let segDy = p2.y - p1.y;
                let segDist = Math.sqrt(segDx*segDx + segDy*segDy);
                
                if (distAccumulator + segDist >= targetDist) {
                    let remaining = targetDist - distAccumulator;
                    let ratio = remaining / segDist;
                    currentSegments.push({
                        x: p1.x + segDx * ratio,
                        y: p1.y + segDy * ratio
                    });
                    break;
                } else {
                    distAccumulator += segDist;
                    historyIdx++;
                }
            }
            if (currentSegments.length <= i) {
                let last = this.history[this.history.length - 1];
                currentSegments.push({x: last.x, y: last.y});
            }
        }
        this.segments = currentSegments;
    }

    steerAngle(targetAngle, dt) {
        let diff = targetAngle - this.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        
        let maxTurn = this.turnSpeed * dt;
        if (Math.abs(diff) < maxTurn) {
            this.angle = targetAngle;
        } else {
            this.angle += Math.sign(diff) * maxTurn;
        }
    }

    updateAI(dt) {
        this.aiChangeTimer -= dt;
        if (this.aiChangeTimer <= 0) {
            this.aiChangeTimer = 1000 + Math.random() * 2000;
            if (this.length > 30 && Math.random() < 0.2) {
                this.setDashing(true);
            } else {
                this.setDashing(false);
            }
            
            let g = this.game;
            let gx = Math.floor(this.x / g.gridSize);
            let gy = Math.floor(this.y / g.gridSize);
            let closestFoodDist = 500;
            this.targetFood = null;

            for (let x = gx - 1; x <= gx + 1; x++) {
                for (let y = gy - 1; y <= gy + 1; y++) {
                    if (g.foodGrid[x] && g.foodGrid[x][y]) {
                        for (let food of g.foodGrid[x][y]) {
                            let dx = food.x - this.x;
                            let dy = food.y - this.y;
                            let d2 = dx*dx + dy*dy;
                            if (d2 < closestFoodDist * closestFoodDist) {
                                closestFoodDist = Math.sqrt(d2);
                                this.targetFood = food;
                            }
                        }
                    }
                }
            }
            
            if (this.targetFood) {
                this.targetAngle = Math.atan2(this.targetFood.y - this.y, this.targetFood.x - this.x);
            } else {
                this.targetAngle = this.angle + (Math.random() - 0.5) * Math.PI;
            }
            
            let boundaryDist = 200;
            if (this.x < boundaryDist || this.y < boundaryDist || 
                this.x > g.mapSize - boundaryDist || this.y > g.mapSize - boundaryDist) {
                this.targetAngle = Math.atan2(g.mapSize/2 - this.y, g.mapSize/2 - this.x);
            }
        }
        this.steerAngle(this.targetAngle, dt);
    }

    checkFood() {
        let r = this.getRadius();
        let g = this.game;
        let gx = Math.floor(this.x / g.gridSize);
        let gy = Math.floor(this.y / g.gridSize);
        
        for (let x = gx - 1; x <= gx + 1; x++) {
            for (let y = gy - 1; y <= gy + 1; y++) {
                if (g.foodGrid[x] && g.foodGrid[x][y]) {
                    let cell = g.foodGrid[x][y];
                    for (let i = cell.length - 1; i >= 0; i--) {
                        let food = cell[i];
                        let dx = this.x - food.x;
                        let dy = this.y - food.y;
                        let distSq = dx*dx + dy*dy;
                        if (distSq < (r + food.radius)*(r + food.radius)) {
                            if (food.type !== 'normal') {
                                this.applyPowerUp(food.type);
                            } else {
                                this.eat(food.value);
                            }
                            g.removeFood(food);
                        }
                    }
                }
            }
        }
    }

    applyPowerUp(type) {
        if (type === 'speed') {
            this.speedBoostTimer = 5000;
        } else if (type === 'growth') {
            this.score += 30;
            this.length = 20 + Math.floor(this.score / 2);
        }
    }

    eat(value) {
        this.score += value;
        this.length = 20 + Math.floor(this.score / 2);
    }

    loseSegment() {
        if (this.length > 15) {
            this.length--;
            this.score = Math.max(0, this.score - 5);
            if (this.segments.length > this.length) this.segments.pop();
            if (Math.random() < 0.5) {
                let tail = this.segments[this.segments.length - 1];
                if (tail) this.game.spawnFood(tail.x, tail.y, 5, this.color);
            }
        }
    }

    die() {
        if (this.state === 'dead') return;
        this.state = 'dead';
        let step = 5;
        for (let i = 0; i < this.segments.length; i += step) {
            let seg = this.segments[i];
            let val = Math.max(5, Math.min(20, Math.floor(this.length / 10)));
            this.game.spawnFood(seg.x, seg.y, val, this.color);
        }
        this.game.onSnakeDeath(this);
    }

    draw(ctx) {
        if (this.state !== 'alive' || this.segments.length < 2) return;
        let r = this.getRadius();
        
        ctx.beginPath();
        ctx.moveTo(this.segments[0].x, this.segments[0].y);
        for (let i = 1; i < this.segments.length; i++) {
            ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = r * 2;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        
        let head = this.segments[0];
        ctx.beginPath();
        ctx.arc(head.x, head.y, r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        let eyeAngleOffset = Math.PI / 4;
        let eyeDist = r * 0.6;
        let eyeRadius = r * 0.3;
        let lx = head.x + Math.cos(this.angle - eyeAngleOffset) * eyeDist;
        let ly = head.y + Math.sin(this.angle - eyeAngleOffset) * eyeDist;
        let rx = head.x + Math.cos(this.angle + eyeAngleOffset) * eyeDist;
        let ry = head.y + Math.sin(this.angle + eyeAngleOffset) * eyeDist;
        
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(lx, ly, eyeRadius, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(rx, ry, eyeRadius, 0, Math.PI*2); ctx.fill();
        
        let pupilRadius = eyeRadius * 0.5;
        let plx = lx + Math.cos(this.angle) * pupilRadius*0.5;
        let ply = ly + Math.sin(this.angle) * pupilRadius*0.5;
        let prx = rx + Math.cos(this.angle) * pupilRadius*0.5;
        let pry = ry + Math.sin(this.angle) * pupilRadius*0.5;
        
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.arc(plx, ply, pupilRadius, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(prx, pry, pupilRadius, 0, Math.PI*2); ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Fredoka';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, head.x, head.y - r - 10);
    }
}
