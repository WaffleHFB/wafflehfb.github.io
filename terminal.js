class HackerTerminal {
    constructor() {
        this.commands = {
            help: () => this.showHelp(),
            clear: () => this.clearTerminal(),
            about: () => this.showAbout(),
            skills: () => this.showSkills(),
            projects: () => this.showProjects(),
            contact: () => this.showContact(),
            hack: () => this.simulateHack()
        };
        
        this.init();
    }

    init() {
        this.terminal = document.querySelector('.terminal-body');
        this.input = '';
        this.prompt = '$ ';
        this.cursorPosition = 0;
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.createNewLine();
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.executeCommand();
        } else if (e.key === 'Backspace') {
            this.input = this.input.slice(0, -1);
            this.updateInputDisplay();
        } else if (e.key.length === 1) {
            this.input += e.key;
            this.updateInputDisplay();
        }
    }

    updateInputDisplay() {
        const currentLine = this.terminal.lastElementChild;
        currentLine.innerHTML = `<span class="prompt">${this.prompt}</span>${this.input}<span class="cursor"></span>`;
    }

    createNewLine() {
        const line = document.createElement('p');
        line.innerHTML = `<span class="prompt">${this.prompt}</span><span class="cursor"></span>`;
        this.terminal.appendChild(line);
    }

    executeCommand() {
        const command = this.input.toLowerCase().trim();
        const output = document.createElement('p');
        output.classList.add('output');

        if (this.commands[command]) {
            this.commands[command]();
        } else if (command) {
            output.innerHTML = `Command not found: ${command}. Type 'help' for available commands.`;
            this.terminal.appendChild(output);
        }

        this.input = '';
        this.createNewLine();
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    showHelp() {
        const commands = [
            'help    - 显示帮助信息',
            'about   - 关于我',
            'skills  - 技能列表',
            'projects- 项目展示',
            'contact - 联系方式',
            'hack    - ???',
            'clear   - 清屏'
        ];
        
        const output = document.createElement('p');
        output.classList.add('output');
        output.innerHTML = commands.join('<br>');
        this.terminal.appendChild(output);
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

        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                const output = document.createElement('p');
                output.classList.add('output');
                output.innerHTML = steps[i];
                this.terminal.appendChild(output);
                this.terminal.scrollTop = this.terminal.scrollHeight;
                i++;
            } else {
                clearInterval(interval);
                this.createNewLine();
            }
        }, 500);
    }

    // 其他命令的实现...
}

// 初始化终端
window.addEventListener('DOMContentLoaded', () => {
    new HackerTerminal();
}); 