class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布样式
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.1'; // 降低透明度避免干扰内容
        
        document.body.appendChild(this.canvas);
        
        // 字符集
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.drops = [];
        
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.fontSize = 14;
        this.columns = Math.ceil(this.canvas.width / this.fontSize);
        this.init();
    }
    
    init() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = {
                x: i * this.fontSize,
                y: Math.random() * -100,
                speed: Math.random() * 0.5 + 0.5,
                chars: [],
                length: Math.floor(Math.random() * 20 + 10)
            };
            
            // 为每个雨滴生成字符
            for (let j = 0; j < this.drops[i].length; j++) {
                this.drops[i].chars[j] = {
                    char: this.chars[Math.floor(Math.random() * this.chars.length)],
                    alpha: Math.random()
                };
            }
        }
    }
    
    animate() {
        // 创建渐变的黑色遮罩效果
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = this.fontSize + 'px monospace';
        
        for (let i = 0; i < this.drops.length; i++) {
            let drop = this.drops[i];
            
            // 绘制雨滴中的每个字符
            for (let j = 0; j < drop.chars.length; j++) {
                let charObj = drop.chars[j];
                let y = drop.y - j * this.fontSize;
                
                if (y > 0 && y < this.canvas.height) {
                    // 创建渐变效果
                    let alpha = charObj.alpha * (1 - j / drop.chars.length);
                    this.ctx.fillStyle = `rgba(0, 255, 170, ${alpha})`;
                    this.ctx.fillText(charObj.char, drop.x, y);
                }
            }
            
            // 更新雨滴位置
            drop.y += drop.speed;
            
            // 如果雨滴超出屏幕，重置位置
            if (drop.y - drop.length * this.fontSize > this.canvas.height) {
                drop.y = Math.random() * -100;
                drop.speed = Math.random() * 0.5 + 0.5;
                
                // 更新字符
                for (let j = 0; j < drop.chars.length; j++) {
                    drop.chars[j] = {
                        char: this.chars[Math.floor(Math.random() * this.chars.length)],
                        alpha: Math.random()
                    };
                }
            }
            
            // 随机改变字符
            if (Math.random() < 0.02) {
                let idx = Math.floor(Math.random() * drop.chars.length);
                drop.chars[idx].char = this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化代码雨
window.addEventListener('DOMContentLoaded', () => {
    new MatrixRain();
}); 