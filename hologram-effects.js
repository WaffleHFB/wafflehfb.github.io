class HologramEffects {
    constructor() {
        this.init();
        this.initHologramCanvas();
        this.initHologramText();
    }

    init() {
        // 创建全息图层
        this.hologramLayer = document.createElement('div');
        this.hologramLayer.className = 'hologram-layer';
        document.body.appendChild(this.hologramLayer);

        // 添加扫描线效果
        this.scanLine = document.createElement('div');
        this.scanLine.className = 'scan-line';
        this.hologramLayer.appendChild(this.scanLine);

        // 初始化全息文本
        this.initHologramText();

        // 添加鼠标跟踪
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    initHologramCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'hologram-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.hologramLayer.appendChild(this.canvas);

        // 设置画布大小
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 开始动画
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initHologramText() {
        // 添加全息文本效果
        document.querySelectorAll('.glitch-text').forEach(text => {
            const hologramText = document.createElement('div');
            hologramText.className = 'hologram-text';
            hologramText.innerHTML = text.textContent;
            
            // 添加多层文本创建3D效果
            for (let i = 0; i < 3; i++) {
                const layer = document.createElement('div');
                layer.className = `text-layer layer-${i}`;
                layer.innerHTML = text.textContent;
                hologramText.appendChild(layer);
            }

            text.parentNode.appendChild(hologramText);
        });
    }

    handleMouseMove(e) {
        // 计算鼠标位置相对于窗口中心的偏移
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // 应用3D变换
        document.querySelectorAll('.hologram-text').forEach(text => {
            const rotateX = mouseY * 0.01;
            const rotateY = mouseX * 0.01;
            text.style.transform = `
                perspective(1000px)
                rotateX(${-rotateX}deg)
                rotateY(${rotateY}deg)
            `;
        });

        // 更新扫描线位置
        this.updateScanLine(e.clientY);
    }

    updateScanLine(y) {
        this.scanLine.style.top = `${y}px`;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制全息网格
        this.drawHologramGrid();
        
        // 绘制粒子效果
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }

    drawHologramGrid() {
        const time = Date.now() * 0.001;
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // 绘制水平线
        for (let y = 0; y < this.canvas.height; y += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            for (let x = 0; x < this.canvas.width; x += 10) {
                const offset = Math.sin(x * 0.01 + time) * 5;
                this.ctx.lineTo(x, y + offset);
            }
            this.ctx.stroke();
        }

        // 绘制垂直线
        for (let x = 0; x < this.canvas.width; x += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            for (let y = 0; y < this.canvas.height; y += 10) {
                const offset = Math.sin(y * 0.01 + time) * 5;
                this.ctx.lineTo(x + offset, y);
            }
            this.ctx.stroke();
        }
    }

    drawParticles() {
        // 绘制浮动粒子
        const time = Date.now() * 0.001;
        this.ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        
        for (let i = 0; i < 100; i++) {
            const x = Math.sin(i * 0.1 + time) * this.canvas.width * 0.5 + this.canvas.width * 0.5;
            const y = Math.cos(i * 0.1 + time) * this.canvas.height * 0.5 + this.canvas.height * 0.5;
            const size = Math.sin(i * 0.1 + time) * 2 + 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}

// 初始化全息效果
window.addEventListener('DOMContentLoaded', () => {
    new HologramEffects();
}); 