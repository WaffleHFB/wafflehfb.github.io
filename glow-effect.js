class BackgroundGlow {
    constructor() {
        this.init();
        this.blobs = [];
        for (let i = 0; i < 3; i++) {
            this.blobs.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 300 + 200,
                vx: Math.random() * 0.5 - 0.25,
                vy: Math.random() * 0.5 - 0.25,
                color: `hsl(${200 + Math.random() * 60}, 70%, 50%)`
            });
        }
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布样式
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1'; // 放到最底层
        this.canvas.style.opacity = '0.3'; // 降低透明度
        
        document.body.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        // 清除画布但保留一点残影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制每个光斑
        this.blobs.forEach(blob => {
            // 更新位置
            blob.x += blob.vx;
            blob.y += blob.vy;
            
            // 边界检查
            if (blob.x < -blob.size) blob.x = this.canvas.width + blob.size;
            if (blob.x > this.canvas.width + blob.size) blob.x = -blob.size;
            if (blob.y < -blob.size) blob.y = this.canvas.height + blob.size;
            if (blob.y > this.canvas.height + blob.size) blob.y = -blob.size;
            
            // 创建渐变
            const gradient = this.ctx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, blob.size
            );
            
            gradient.addColorStop(0, blob.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            // 绘制光斑
            this.ctx.beginPath();
            this.ctx.fillStyle = gradient;
            this.ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 添加一些随机变化
        if (Math.random() < 0.05) {
            this.blobs.forEach(blob => {
                blob.vx += (Math.random() - 0.5) * 0.1;
                blob.vy += (Math.random() - 0.5) * 0.1;
                blob.vx = Math.max(Math.min(blob.vx, 0.5), -0.5);
                blob.vy = Math.max(Math.min(blob.vy, 0.5), -0.5);
                blob.size += (Math.random() - 0.5) * 10;
                blob.size = Math.max(Math.min(blob.size, 400), 100);
            });
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化背景光效
window.addEventListener('DOMContentLoaded', () => {
    new BackgroundGlow();
}); 