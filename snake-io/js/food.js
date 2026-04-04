class Food {
    constructor(x, y, value = 5, color = null, type = 'normal') {
        this.x = x;
        this.y = y;
        this.value = value;
        this.type = type; // 'normal', 'speed', 'growth'
        
        // Base radius corresponds to value
        this.baseRadius = Math.max(3, Math.min(10, value / 2));
        this.radius = this.baseRadius;
        this.color = color || this.getRandomColor();
        
        // Fruit emoji selection
        this.fruits = ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝'];
        
        if (this.type === 'speed') {
            this.emoji = '⚡';
            this.glowColor = '#facc15'; // Yellow glow
        } else if (this.type === 'growth') {
            this.emoji = '⭐';
            this.glowColor = '#f472b6'; // Pink glow
        } else {
            this.emoji = this.fruits[Math.floor(Math.random() * this.fruits.length)];
            this.glowColor = 'rgba(0,0,0,0.5)';
        }
    }

    getRandomColor() {
        const colors = [
            '#ef4444', // Red
            '#f97316', // Orange
            '#f59e0b', // Amber
            '#10b981', // Emerald
            '#06b6d4', // Cyan
            '#3b82f6', // Blue
            '#8b5cf6', // Violet
            '#ec4899'  // Pink
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(dt) {
        // No animation for basic fruits as requested
    }

    draw(ctx) {
        // Draw emoji
        // We scale the font size based on the radius - making them 2.5x - 3x bigger as requested
        const fontSize = this.radius * 7.5; // Previously *3, now *7.5 for ~2.5x increase
        ctx.font = `${fontSize}px serif`;
        // Brighter glow for power-ups
        if (this.type !== 'normal') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = this.glowColor + '44'; // 25% opacity
            ctx.fill();
        }
        
        // No shadowBlur for performance
        ctx.fillText(this.emoji, this.x, this.y);
    }
}





