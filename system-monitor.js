class SystemMonitor {
    constructor() {
        this.init();
        this.startTime = new Date('2024-01-01').getTime();
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
    }

    init() {
        // 监听鼠标移动来实现 3D 效果
        document.addEventListener('mousemove', (e) => {
            this.handle3DEffect(e);
        });

        // 初始化系统信息监控
        this.initSystemInfo();
        
        // 定期更新数据
        setInterval(() => this.updateStats(), 1000);
    }

    handle3DEffect(e) {
        const terminal = document.querySelector('.terminal');
        if (!terminal) return;

        // 获取终端相对于视口的位置
        const rect = terminal.getBoundingClientRect();
        
        // 计算鼠标相对于终端中心的位置
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 计算偏移量 (-1 到 1 的范围)
        const offsetX = (e.clientX - centerX) / (rect.width / 2);
        const offsetY = (e.clientY - centerY) / (rect.height / 2);
        
        // 应用 3D 变换，最大倾斜角度为 15 度
        const tiltX = -offsetY * 15;
        const tiltY = offsetX * 15;
        
        terminal.style.transform = `
            perspective(1000px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            scale3d(1.02, 1.02, 1.02)
        `;
    }

    initSystemInfo() {
        // 获取系统信息
        const systemInfo = {
            platform: navigator.platform,
            cores: navigator.hardwareConcurrency || '未知',
            memory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : '未知',
            screen: `${window.screen.width}x${window.screen.height}`,
            pixelRatio: window.devicePixelRatio.toFixed(2)
        };

        // 获取浏览器信息
        const browserInfo = {
            name: this.getBrowserName(),
            version: this.getBrowserVersion(),
            engine: this.getEngineInfo(),
            language: navigator.language
        };

        // 更新显示
        document.getElementById('systemInfo').innerHTML = `
            ${systemInfo.platform} | ${systemInfo.cores}核 | ${systemInfo.memory}
        `;

        document.getElementById('browserInfo').innerHTML = `
            ${browserInfo.name} ${browserInfo.version} | ${systemInfo.screen}
        `;
    }

    updateStats() {
        // 更新在线时间
        const now = new Date().getTime();
        const diff = now - this.startTime;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('onlineTime').textContent = 
            `${days}d ${hours}h ${minutes}m`;

        // 更新性能指标
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.frameCount++;

        if (deltaTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameCount = 0;
            this.lastFrameTime = currentTime;
        }

        // 获取内存使用情况
        let memoryInfo = '未知';
        if (performance.memory) {
            const usedMemory = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
            const totalMemory = Math.round(performance.memory.jsHeapSizeLimit / (1024 * 1024));
            memoryInfo = `${usedMemory}MB/${totalMemory}MB`;
        }

        document.getElementById('performance').textContent = 
            `FPS: ${this.fps} | Memory: ${memoryInfo}`;
    }

    getBrowserName() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        if (ua.includes('Opera')) return 'Opera';
        return 'Unknown';
    }

    getBrowserVersion() {
        const ua = navigator.userAgent;
        const matches = ua.match(/(firefox|chrome|safari|opera|edge)[\/\s](\d+)/i);
        return matches ? matches[2] : '';
    }

    getEngineInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Gecko')) return 'Gecko';
        if (ua.includes('WebKit')) return 'WebKit';
        if (ua.includes('Trident')) return 'Trident';
        return 'Unknown';
    }
}

// 初始化系统监控
window.addEventListener('DOMContentLoaded', () => {
    new SystemMonitor();
}); 