class HackerEffects {
    constructor() {
        this.initGlitchEffect();
        this.initMatrixEffect();
        this.initCommandLine();
        this.initSystemScan();
    }

    initGlitchEffect() {
        // 故障效果
        const glitchTexts = document.querySelectorAll('.glitch-text');
        glitchTexts.forEach(text => {
            setInterval(() => {
                if (Math.random() > 0.99) {
                    const originalText = text.getAttribute('data-text');
                    const glitchedText = this.createGlitchedText(originalText);
                    text.textContent = glitchedText;
                    setTimeout(() => {
                        text.textContent = originalText;
                    }, 100);
                }
            }, 50);
        });
    }

    createGlitchedText(text) {
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        return text.split('').map(char => 
            Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
        ).join('');
    }

    initMatrixEffect() {
        // 代码雨效果增强
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.filter = 'hue-rotate(0deg)';
            let hue = 0;
            setInterval(() => {
                hue = (hue + 1) % 360;
                canvas.style.filter = `hue-rotate(${hue}deg)`;
            }, 50);
        }
    }

    initCommandLine() {
        // 命令行效果增强
        const terminal = document.querySelector('.terminal-body');
        if (terminal) {
            this.addTypewriterEffect(terminal);
            this.addInteractiveCommands(terminal);
        }
    }

    addTypewriterEffect(element) {
        const texts = element.querySelectorAll('p');
        texts.forEach((text, index) => {
            const originalHTML = text.innerHTML;
            text.innerHTML = '';
            setTimeout(() => {
                this.typeText(text, originalHTML);
            }, index * 1000);
        });
    }

    typeText(element, text) {
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text[index];
                index++;
            } else {
                clearInterval(interval);
            }
        }, 50);
    }

    initSystemScan() {
        // 系统扫描效果
        setInterval(() => {
            if (Math.random() > 0.95) {
                this.simulateSystemScan();
            }
        }, 10000);
    }

    simulateSystemScan() {
        const scanData = [
            'Scanning system...',
            'Analyzing network traffic...',
            'Checking security protocols...',
            'Monitoring system resources...',
            'Updating security database...',
            'System scan complete.'
        ];

        const terminal = document.querySelector('.terminal-body');
        if (terminal) {
            const scanElement = document.createElement('div');
            scanElement.classList.add('system-scan');
            terminal.appendChild(scanElement);

            scanData.forEach((text, index) => {
                setTimeout(() => {
                    const line = document.createElement('p');
                    line.innerHTML = `<span class="scan-text">${text}</span>`;
                    scanElement.appendChild(line);
                    
                    if (index === scanData.length - 1) {
                        setTimeout(() => {
                            scanElement.remove();
                        }, 2000);
                    }
                }, index * 500);
            });
        }
    }

    addInteractiveCommands(terminal) {
        // 添加可交互的命令
        const commands = {
            'help': () => this.showHelp(),
            'scan': () => this.simulateSystemScan(),
            'matrix': () => this.toggleMatrixEffect(),
            'hack': () => this.simulateHack(),
            'clear': () => this.clearTerminal()
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && terminal.querySelector('.command-input')) {
                const input = terminal.querySelector('.command-input').textContent;
                if (commands[input.toLowerCase()]) {
                    commands[input.toLowerCase()]();
                } else {
                    this.showError(input);
                }
            }
        });
    }

    showHelp() {
        const helpText = [
            'Available commands:',
            '  help  - Show this help message',
            '  scan  - Scan system',
            '  matrix- Toggle matrix effect',
            '  hack  - Start hack simulation',
            '  clear - Clear terminal'
        ].join('\n');

        this.addOutput(helpText);
    }

    showError(command) {
        this.addOutput(`Command not found: ${command}`);
    }

    addOutput(text) {
        const terminal = document.querySelector('.terminal-body');
        const output = document.createElement('p');
        output.classList.add('output');
        output.textContent = text;
        terminal.appendChild(output);
    }

    clearTerminal() {
        const terminal = document.querySelector('.terminal-body');
        terminal.innerHTML = '';
    }

    simulateHack() {
        const steps = [
            'Initializing hack sequence...',
            'Bypassing security...',
            'Accessing mainframe...',
            'Downloading data...',
            'Covering tracks...',
            'Hack complete! Just kidding 😈'
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                this.addOutput(step);
            }, index * 1000);
        });
    }
}

// 初始化效果
window.addEventListener('DOMContentLoaded', () => {
    new HackerEffects();
}); 