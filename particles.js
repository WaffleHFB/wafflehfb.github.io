class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePos = { x: 0, y: 0 };
        
        // 设置画布
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '100';
        document.body.appendChild(this.canvas);
        
        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // 减少初始粒子数量
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
                life: 1
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
            
            // 减少鼠标移动时产生的粒子
            if (Math.random() > 0.5) {
                this.particles.push({
                    x: this.mousePos.x,
                    y: this.mousePos.y,
                    size: Math.random() * 2 + 0.5,
                    speedX: Math.random() * 2 - 1,
                    speedY: Math.random() * 2 - 1,
                    color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
                    life: 1
                });
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((p, index) => {
            // 更新位置
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= 0.01;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color.replace(')', `, ${p.life})`);
            this.ctx.fill();
            
            // 移除消失的粒子
            if (p.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化粒子系统
window.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
}); 