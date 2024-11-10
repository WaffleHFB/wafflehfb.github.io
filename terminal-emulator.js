class TerminalEmulator {
    constructor() {
        this.history = [];
        this.historyIndex = 0;
        this.currentDir = '~';
        this.fileSystem = this.initFileSystem();
        this.env = {
            USER: 'waffle',
            HOME: '/Users/waffle',
            PATH: '/usr/local/bin:/usr/bin:/bin',
            SHELL: '/bin/zsh',
            TERM: 'xterm-256color'
        };
        
        this.commands = {
            ls: this.ls.bind(this),
            cd: this.cd.bind(this),
            pwd: this.pwd.bind(this),
            cat: this.cat.bind(this),
            clear: this.clear.bind(this),
            echo: this.echo.bind(this),
            help: this.help.bind(this),
            whoami: this.whoami.bind(this),
            uname: this.uname.bind(this),
            date: this.date.bind(this),
            tree: this.tree.bind(this),
            neofetch: this.neofetch.bind(this),
            projects: this.projects.bind(this),
            skills: this.skills.bind(this),
            contact: this.contact.bind(this),
            hack: this.simulateHack.bind(this)
        };

        this.init();
    }

    initFileSystem() {
        return {
            '/': {
                type: 'dir',
                content: {
                    'Users': {
                        type: 'dir',
                        content: {
                            'waffle': {
                                type: 'dir',
                                content: {
                                    'projects': {
                                        type: 'dir',
                                        content: {
                                            'ForceClient.md': {
                                                type: 'file',
                                                content: '# ForceClient\n强大的2b2t水晶客户端'
                                            }
                                        }
                                    },
                                    'skills.txt': {
                                        type: 'file',
                                        content: 'Java, Python, JavaScript, React, Node.js'
                                    },
                                    'about.txt': {
                                        type: 'file',
                                        content: '全栈开发者 / 客户端开发者 / 二次元爱好者'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    init() {
        this.terminal = document.querySelector('.terminal-body');
        this.input = '';
        this.prompt = this.getPrompt();
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.showWelcomeMessage();
        this.createNewLine();
    }

    getPrompt() {
        return `${this.env.USER}@waffle-blog ${this.currentDir} % `;
    }

    showWelcomeMessage() {
        const welcomeMsg = [
            '欢迎来到 Waffle 的终端！',
            '输入 "help" 查看可用命令。',
            '----------------------------',
            '',
            '自我介绍：',
            '我是 Waffle，一名热爱编程和游戏的开发者。',
            '主要专注于 Minecraft 客户端开发和 Java 性能优化。',
            '同时也是 2b2t 和 Hypixel 的活跃玩家。',
            '',
            '技术栈：',
            '- Java / Python / JavaScript',
            '- Minecraft Client Development',
            '- Performance Optimization',
            '- Security Development',
            '',
            '项目经历：',
            '- ForceClient: 强大的2b2t水晶客户端',
            '- 多个开源项目维护者',
            '',
            '> 输入命令开始探索...',
            ''
        ];
        
        welcomeMsg.forEach(msg => {
            const line = document.createElement('p');
            line.textContent = msg;
            this.terminal.appendChild(line);
        });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.executeCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete();
        } else if (e.key === 'Backspace') {
            if (this.input.length > 0) {
                this.input = this.input.slice(0, -1);
                this.updateInputDisplay();
            }
        } else if (e.key.length === 1) {
            this.input += e.key;
            this.updateInputDisplay();
        }
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;
        
        this.historyIndex = Math.max(0, Math.min(
            this.history.length - 1,
            this.historyIndex + direction
        ));
        
        this.input = this.history[this.historyIndex];
        this.updateInputDisplay();
    }

    autoComplete() {
        const args = this.input.split(' ');
        const lastArg = args[args.length - 1];
        
        // 命令补全
        if (args.length === 1) {
            const matches = Object.keys(this.commands)
                .filter(cmd => cmd.startsWith(lastArg));
            
            if (matches.length === 1) {
                this.input = matches[0];
                this.updateInputDisplay();
            } else if (matches.length > 1) {
                this.output(matches.join('  '));
            }
        }
        // 文件路径补全
        else if (args[0] === 'cd' || args[0] === 'cat') {
            // 实现文件路径补全逻辑
        }
    }

    executeCommand() {
        const line = document.createElement('p');
        line.innerHTML = `<span class="prompt">${this.prompt}</span>${this.input}`;
        this.terminal.appendChild(line);
        
        const args = this.input.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();
        
        if (cmd) {
            this.history.push(this.input);
            this.historyIndex = this.history.length;
            
            if (this.commands[cmd]) {
                this.commands[cmd](args.slice(1));
            } else {
                this.output(`zsh: command not found: ${cmd}`);
            }
        }
        
        this.input = '';
        this.createNewLine();
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    output(text) {
        const line = document.createElement('p');
        line.innerHTML = text;
        this.terminal.appendChild(line);
    }

    // 基础命令实现
    ls(args) {
        // 实现目录列表显示
        const files = ['projects/', 'skills.txt', 'about.txt'];
        this.output(files.join('  '));
    }

    cd(args) {
        if (!args[0] || args[0] === '~') {
            this.currentDir = '~';
        } else {
            // 实现目录切换逻辑
        }
        this.prompt = this.getPrompt();
    }

    pwd() {
        this.output(this.env.HOME + this.currentDir.slice(1));
    }

    cat(args) {
        if (!args[0]) {
            this.output('usage: cat <file>');
            return;
        }
        // 实现文件内容显示
    }

    clear() {
        this.terminal.innerHTML = '';
    }

    echo(args) {
        this.output(args.join(' '));
    }

    help() {
        const helpText = [
            'Available commands:',
            '  ls        - 列出目录内容',
            '  cd        - 切换目录',
            '  pwd       - 显示当前路径',
            '  cat       - 显示文件内容',
            '  clear     - 清屏',
            '  echo      - 输出文本',
            '  whoami    - 显示当前用户',
            '  uname     - 显示系统信息',
            '  date      - 显示当前时间',
            '  tree      - 显示目录树',
            '  neofetch  - 显示系统信息',
            '  projects  - 显示项目列表',
            '  skills    - 显示技能树',
            '  contact   - 显示联系方式',
            '  hack      - ???',
            '  help      - 显示此帮助'
        ];
        this.output(helpText.join('\n'));
    }

    whoami() {
        this.output(this.env.USER);
    }

    uname() {
        this.output('Darwin Waffle-MacBook-Pro.local 20.0.0 Darwin Kernel Version 20.0.0');
    }

    date() {
        this.output(new Date().toString());
    }

    tree() {
        // 实现目录树显示
        const tree = [
            '.',
            '├── projects',
            '│   └── ForceClient.md',
            '├── skills.txt',
            '└── about.txt'
        ];
        this.output(tree.join('\n'));
    }

    neofetch() {
        const systemInfo = this.getSystemInfo();
        const os = this.detectOS();
        
        // Windows 的 ASCII art
        const windowsArt = [
            "                                  ..,",
            "                      ....,,:;+ccllll",
            "        ...,,+:;  cllllllllllllllllll",
            "  ,cclllllllllll  lllllllllllllllllll",
            "  llllllllllllll  lllllllllllllllllll",
            "  llllllllllllll  lllllllllllllllllll",
            "  llllllllllllll  lllllllllllllllllll",
            "  llllllllllllll  lllllllllllllllllll",
            "  llllllllllllll  lllllllllllllllllll",
            "                                      ",
            "  llllllllllllll  lllllllllllllllllll",
            "  llllllllllllll  lllllllllllllllllll",
            "  llllllllllllll  lllllllllllllllllll",
            "  llllllllllllll  lllllllllllllllllll",
            "  llllllllllllll  lllllllllllllllllll",
            "  `'ccllllllllll  lllllllllllllllllll",
            "         `'\"\"*::  :ccllllllllllllllll",
            "                        ````''\"*::cll",
            "                                   ``"
        ];

        // macOS 的 ASCII art
        const macArt = [
            "                    'c.           ",
            "                 ,xNMM.           ",
            "               .OMMMMo            ",
            "               OMMM0,             ",
            "     .;loddo:  olloddol;.        ",
            "   cKMMMMMMMMMMNWMMMMMMMMMM0:    ",
            " .KMMMMMMMMMMMMMMMMMMMMMMMWd.    ",
            " XMMMMMMMMMMMMMMMMMMMMMMMX.      ",
            ";MMMMMMMMMMMMMMMMMMMMMMMM:       ",
            ":MMMMMMMMMMMMMMMMMMMMMMMM:       ",
            ".MMMMMMMMMMMMMMMMMMMMMMMMX.      ",
            " kMMMMMMMMMMMMMMMMMMMMMMMMWd.    ",
            " .XMMMMMMMMMMMMMMMMMMMMMMMMMMk   ",
            "  .XMMMMMMMMMMMMMMMMMMMMMMMMK.   ",
            "    kMMMMMMMMMMMMMMMMMMMMMMd     ",
            "     ;KMMMMMMMWXXWMMMMMMMk.      ",
            "       .cooc,.    .,coo:.        "
        ];

        // 根据操作系统选择 ASCII art
        const art = os.isWindows ? windowsArt : macArt;

        // 添加系统信息
        const info = [
            `${systemInfo.hostname}`,
            `------------------`,
            `OS: ${os.name} ${os.version}`,
            `Host: ${systemInfo.model}`,
            `Kernel: ${systemInfo.kernel}`,
            `Uptime: ${systemInfo.uptime}`,
            `Packages: ${systemInfo.packages}`,
            `Shell: ${systemInfo.shell}`,
            `Resolution: ${window.screen.width}x${window.screen.height}`,
            `DE: ${os.isWindows ? "Windows" : "Aqua"}`,
            `WM: ${os.isWindows ? "DWM" : "Quartz Compositor"}`,
            `Terminal: Browser`,
            `CPU: ${systemInfo.cpu}`,
            `GPU: ${systemInfo.gpu}`,
            `Memory: ${systemInfo.memory}`
        ];

        // 合并 ASCII art 和系统信息
        const output = art.map((line, i) => {
            return `${line.padEnd(40)}${info[i] || ''}`;
        }).join('\n');

        const pre = document.createElement('pre');
        pre.style.fontFamily = 'monospace';
        pre.textContent = output;
        this.terminal.appendChild(pre);
    }

    projects() {
        const projects = [
            '项目列表：',
            '1. ForceClient - 强大的2b2t水晶客户端',
            '   技术栈：Java, Minecraft',
            '   状态：活跃开发中',
            '',
            '更多项目请访问: https://github.com/WaffleHFB'
        ];
        this.output(projects.join('\n'));
    }

    skills() {
        const skills = [
            '技能树：',
            '├── 编程语言',
            '│   ├── Java ★★★★★',
            '│   ├── Python ★★★★☆',
            '│   └── JavaScript ★★★★☆',
            '├── 开发框架',
            '│   ├── React ★★★★☆',
            '│   └── Node.js ★★★★☆',
            '└── 专业领域',
            '    ├── 客户端开发 ★★★★★',
            '    ├── 性能优化 ★★★★☆',
            '    └── 安全开发 ★★★★☆'
        ];
        this.output(skills.join('\n'));
    }

    contact() {
        const contact = [
            '联系方式：',
            '├── GitHub: @WaffleHFB',
            '├── YouTube: @user-imwaffle',
            '├── Bilibili: @Waffle',
            '└── Twitter: @waffle303936893'
        ];
        this.output(contact.join('\n'));
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
                this.output(steps[i]);
                i++;
            } else {
                clearInterval(interval);
                this.createNewLine();
            }
        }, 500);
    }

    // 修复输入显示问题
    updateInputDisplay() {
        const currentLine = this.terminal.lastElementChild;
        if (!currentLine || !currentLine.classList.contains('input-line')) {
            const newLine = document.createElement('p');
            newLine.classList.add('input-line');
            this.terminal.appendChild(newLine);
        }
        currentLine.innerHTML = `<span class="prompt">${this.prompt}</span>${this.input}<span class="cursor"></span>`;
    }

    createNewLine() {
        const line = document.createElement('p');
        line.classList.add('input-line');
        line.innerHTML = `<span class="prompt">${this.prompt}</span><span class="cursor"></span>`;
        this.terminal.appendChild(line);
    }

    // 修改系统检测方法
    detectOS() {
        const userAgent = window.navigator.userAgent;
        if (userAgent.indexOf('Mac') !== -1) {
            // 检测 macOS 版本
            const macOSVersion = userAgent.match(/Mac OS X (\d+[._]\d+[._]\d+)/);
            return {
                name: 'macOS',
                version: macOSVersion ? macOSVersion[1].replace(/_/g, '.') : 'Unknown',
                isMac: true
            };
        }
        if (userAgent.indexOf('Windows') !== -1) {
            // 检测 Windows 版本
            const windowsVersion = userAgent.match(/Windows NT (\d+\.\d+)/);
            return {
                name: 'Windows',
                version: windowsVersion ? windowsVersion[1] : 'Unknown',
                isWindows: true
            };
        }
        if (userAgent.indexOf('Linux') !== -1) {
            return {
                name: 'Linux',
                version: 'Unknown',
                isLinux: true
            };
        }
        return {
            name: 'Unknown',
            version: 'Unknown',
            isUnknown: true
        };
    }

    // 修改系统信息获取方法
    getSystemInfo() {
        const os = this.detectOS();
        const cpuInfo = this.getCPUInfo();
        const gpuInfo = this.getGPUInfo();
        const memoryInfo = this.getMemoryInfo();
        const processorInfo = this.getProcessorInfo();

        return {
            hostname: os.isMac ? 'MacBook-Pro' : `${os.name}-PC`,
            kernel: os.isMac ? 
                `Darwin ${os.version}` : 
                os.isWindows ? `Windows NT ${os.version}` : 'Unknown',
            model: os.isMac ? this.getMacModel() : this.getWindowsModel(),
            cpu: cpuInfo,
            gpu: gpuInfo,
            memory: memoryInfo,
            processor: processorInfo,
            shell: os.isMac ? '/bin/zsh' : os.isWindows ? 'PowerShell' : '/bin/bash'
        };
    }

    // 获取 CPU 信息
    getCPUInfo() {
        try {
            // 尝试通过 navigator.hardwareConcurrency 获取核心数
            const cores = navigator.hardwareConcurrency || 'Unknown';
            
            // 检测处理器架构
            const platform = navigator.platform;
            const userAgent = navigator.userAgent;
            
            let architecture = 'Unknown';
            if (platform.includes('Win64') || platform.includes('x64')) {
                architecture = 'x64';
            } else if (platform.includes('Win32')) {
                architecture = userAgent.includes('Win64; x64') ? 'x64' : 'x86';
            } else if (userAgent.includes('ARM') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
                architecture = 'ARM';
            }

            // 检测是否是 Apple Silicon
            const isAppleSilicon = navigator.userAgent.includes('Mac') && !navigator.userAgent.includes('Intel');
            
            if (isAppleSilicon) {
                return `Apple Silicon (${cores} cores)`;
            } else if (userAgent.includes('Intel')) {
                return `Intel (${cores} cores)`;
            } else if (userAgent.includes('AMD')) {
                return `AMD (${cores} cores)`;
            }
            
            return `${architecture} Processor (${cores} cores)`;
        } catch (e) {
            return 'Unknown CPU';
        }
    }

    // 获取 GPU 信息
    getGPUInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                return 'No WebGL Support';
            }

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                return `${vendor} ${renderer}`;
            }
            
            return 'Unknown GPU';
        } catch (e) {
            return 'Unknown GPU';
        }
    }

    // 获取内存信息
    getMemoryInfo() {
        try {
            const totalMemory = navigator.deviceMemory ? 
                `${navigator.deviceMemory}GB` : 'Unknown';
            
            if (performance.memory) {
                const usedMemory = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
                const totalJSMemory = Math.round(performance.memory.jsHeapSizeLimit / (1024 * 1024));
                return `${usedMemory}MB / ${totalJSMemory}MB (Total RAM: ${totalMemory})`;
            }
            
            return totalMemory;
        } catch (e) {
            return 'Unknown Memory';
        }
    }

    // 获取处理器信息
    getProcessorInfo() {
        try {
            const userAgent = navigator.userAgent;
            let processorInfo = '';
            
            if (userAgent.includes('Win')) {
                // Windows 处理器信息
                if (userAgent.includes('Intel')) {
                    processorInfo = userAgent.match(/Intel.*?(?=;|\))/);
                } else if (userAgent.includes('AMD')) {
                    processorInfo = userAgent.match(/AMD.*?(?=;|\))/);
                }
            } else if (userAgent.includes('Mac')) {
                // Mac 处理器信息
                if (userAgent.includes('Intel')) {
                    processorInfo = 'Intel Mac';
                } else {
                    processorInfo = 'Apple Silicon';
                }
            }
            
            return processorInfo || 'Unknown Processor';
        } catch (e) {
            return 'Unknown Processor';
        }
    }

    // 获取 Mac 型号
    getMacModel() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Macintosh')) {
            if (userAgent.includes('MacBook Pro')) {
                return 'MacBook Pro';
            } else if (userAgent.includes('MacBook Air')) {
                return 'MacBook Air';
            } else if (userAgent.includes('iMac')) {
                return 'iMac';
            }
        }
        return 'Mac';
    }

    // 获取 Windows 型号
    getWindowsModel() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Windows NT 10')) {
            return 'Windows 10';
        } else if (userAgent.includes('Windows NT 11')) {
            return 'Windows 11';
        }
        return 'Windows PC';
    }
}

// 初始化终端
window.addEventListener('DOMContentLoaded', () => {
    new TerminalEmulator();
}); 