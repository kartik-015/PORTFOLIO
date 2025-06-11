class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = 'rgba(255, 255, 255, 0.2)';
    }

    update(mouse) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off walls
        if (this.x > this.canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > this.canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }

        // Mouse interaction
        if (mouse.x !== undefined && mouse.y !== undefined) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 100;

            if (distance < maxDistance) {
                const angle = Math.atan2(dy, dx);
                const force = (maxDistance - distance) / maxDistance;
                this.x -= Math.cos(angle) * force * 2;
                this.y -= Math.sin(angle) * force * 2;
            }
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: undefined, y: undefined };
        this.resize();
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connecting lines
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance/100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw();
        });

        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
        });

        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.x;
            this.mouse.y = event.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        });
    }
}

// Initialize the particle background
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
}); 