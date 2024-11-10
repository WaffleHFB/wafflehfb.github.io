class ThreeDEffects {
    constructor() {
        this.init();
        this.initAudio();
    }

    init() {
        // 获取所有需要3D效果的元素
        this.terminal = document.querySelector('.terminal');
        this.cards = document.querySelectorAll('.post-card, .project-card');
        this.stats = document.querySelectorAll('.stat-item');
        
        // 添加鼠标移动监听
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // 添加滚动视差
        window.addEventListener('scroll', () => this.handleScroll());
        
        // 初始化声音
        this.initAudio();
    }

    handleMouseMove(e) {
        // 处理终端3D效果
        if (this.terminal) {
            this.apply3DEffect(this.terminal, e, 15);
        }
        
        // 处理卡片3D效果
        this.cards.forEach(card => {
            this.apply3DEffect(card, e, 10);
        });
        
        // 处理状态栏3D效果
        this.stats.forEach(stat => {
            this.apply3DEffect(stat, e, 5);
        });
    }

    apply3DEffect(element, e, intensity = 10) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 计算鼠标相对于元素中心的位置
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // 计算旋转角度
        const rotateX = ((mouseY - centerY) / (window.innerHeight / 2)) * intensity;
        const rotateY = ((mouseX - centerX) / (window.innerWidth / 2)) * intensity;
        
        // 应用变换
        element.style.transform = `
            perspective(1000px)
            rotateX(${-rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.02, 1.02, 1.02)
        `;
        
        // 添加光影效果
        const glareX = ((mouseX - rect.left) / rect.width) * 100;
        const glareY = ((mouseY - rect.top) / rect.height) * 100;
        
        element.style.background = `
            linear-gradient(
                ${Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI)}deg,
                rgba(255,255,255,0.1) 0%,
                rgba(255,255,255,0) 80%
            )
        `;
    }

    handleScroll() {
        // 滚动视差效果
        const scrolled = window.pageYOffset;
        this.cards.forEach((card, index) => {
            const speed = 1 + (index % 3) * 0.1;
            const yPos = -(scrolled * speed);
            card.style.transform += `translateY(${yPos}px)`;
        });
    }

    initAudio() {
        // 创建音频上下文
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // 创建不同类型的音效
        this.sounds = {
            hover: this.createTone(880, 'sine'),
            click: this.createTone(440, 'square'),
            error: this.createTone(220, 'sawtooth')
        };
        
        // 添加音效触发器
        this.addSoundTriggers();
    }

    createTone(frequency, type) {
        return () => {
            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);
            
            oscillator.start();
            oscillator.stop(this.audioCtx.currentTime + 0.1);
        };
    }

    addSoundTriggers() {
        // 添加悬停音效
        document.querySelectorAll('a, button, .post-card, .project-card').forEach(element => {
            element.addEventListener('mouseenter', () => this.sounds.hover());
            element.addEventListener('click', () => this.sounds.click());
        });
        
        // 添加错误音效
        document.querySelectorAll('.error').forEach(element => {
            element.addEventListener('mouseenter', () => this.sounds.error());
        });
    }
}

// 初始化3D效果
window.addEventListener('DOMContentLoaded', () => {
    new ThreeDEffects();
}); 