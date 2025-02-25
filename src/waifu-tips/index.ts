import Model from "./model.js";
import showMessage from "./message.js";
import { randomSelection } from "./utils.js";
import tools from "./tools.js";
import { showOrHiddenChatWidget, onSendMessage } from "./chat.js";
import ChatAI from "src/chat-ai/chat-ai.js";

interface Config {
    cdnPath: string;
    waifuPath: string;
    apiPath?: string;
    tools?: string[];
}

interface Tools {
    [key: string]: {
        icon: string;
        callback: () => void;
    };
}

type Time = {
    hour: string;
    text: string;
}[];

interface Result {
    message: {
        default: string[];
        console: string;
        copy: string;
        visibilitychange: string;
    };
    time: Time;
    mouseover: {
        selector: string;
        text: string | string[];
    }[];
    click: {
        selector: string;
        text: string | string[];
    }[];
    seasons: {
        date: string;
        text: string | string[];
    }[];
}

function loadWidget(config: Config) {
    const model = new Model(config);
    localStorage.removeItem("waifu-display");
    sessionStorage.removeItem("waifu-text");
    document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
            <div id="waifu-tips"></div>
            <canvas id="live2d" width="800" height="800"></canvas>
            <div class="waifu-chat-container" id="chat-widget">
                <form id="waifu-chat-form" >
                    <input type="text" id="waifu-chat-imput" name="text" placeholder="输入你的话(。・∀・)ノ" required>
                    <button id="waifu-submit-btn"></button>
                </form>
            </div>
            <div id="waifu-tool"></div>
        </div>`);
        document.getElementById("chat-widget").style.display = "none";
    // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
    setTimeout(() => {
        document.getElementById("waifu").style.bottom = '0';
    }, 0);

    (function registerTools() {
        (tools as Tools)["switch-model"].callback = () => model.switchModel();
        (tools as Tools)["switch-texture"].callback = () => model.switchTextures();
        if (!Array.isArray(config.tools)) {
            config.tools = Object.keys(tools);
        }
        for (let tool of config.tools) {
            if ((tools as Tools)[tool]) {
                const { icon, callback } = (tools as Tools)[tool];
                document.getElementById("waifu-tool").insertAdjacentHTML("beforeend", `<span id="waifu-tool-${tool}">${icon}</span>`);
                document.getElementById(`waifu-tool-${tool}`).addEventListener("click", callback);
            }
        }
    })();

    (function registerChatTools() {
        document.getElementById("waifu-submit-btn").addEventListener("click", (event) => {
            event.preventDefault();
            onSendMessage();
        });
        const chatWidget = document.getElementById("chat-widget");
    })();

    function registerEventListener(result: Result) {
        // Detect user activity and display messages when idle
        let userAction = false;
        let userActionTimer: any;
        const messageArray = result.message.default;
        let lastHoverElement: any;
        window.addEventListener('mousemove', () => (userAction = true));
        window.addEventListener('keydown', () => (userAction = true));
        setInterval(() => {
            if (userAction) {
                userAction = false;
                clearInterval(userActionTimer);
                userActionTimer = null;
            } else if (!userActionTimer) {
                userActionTimer = setInterval(() => {
                    showMessage(randomSelection(messageArray) as string, 6000, 9);
                }, 20000);
            }
        }, 1000);
        showMessage(welcomeMessage(result.time), 7000, 11);
        window.addEventListener('mouseover', (event) => {
            // eslint-disable-next-line prefer-const
            for (let { selector, text } of result.mouseover) {
                if (!(event.target as HTMLElement)?.closest(selector)) continue;
                if (lastHoverElement === selector) return;
                lastHoverElement = selector;
                text = randomSelection(text);
                text = (text as string).replace(
                    '{text}',
                    (event.target as HTMLElement).innerText,
                );
                showMessage(text, 4000, 8);
                return;
            }
        });
        window.addEventListener('click', (event) => {
            // eslint-disable-next-line prefer-const
            for (let { selector, text } of result.click) {
                if (!(event.target as HTMLElement)?.closest(selector)) continue;
                text = randomSelection(text);
                text = (text as string).replace(
                    '{text}',
                    (event.target as HTMLElement).innerText,
                );
                showMessage(text, 4000, 8);
                return;
            }
        });
        result.seasons.forEach(({ date, text }) => {
            const now = new Date(),
                after = date.split('-')[0],
                before = date.split('-')[1] || after;
            if (
                Number(after.split('/')[0]) <= now.getMonth() + 1 &&
                now.getMonth() + 1 <= Number(before.split('/')[0]) &&
                Number(after.split('/')[1]) <= now.getDate() &&
                now.getDate() <= Number(before.split('/')[1])
            ) {
                text = randomSelection(text);
                text = (text as string).replace('{year}', String(now.getFullYear()));
                messageArray.push(text);
            }
        });

        const devtools = () => { };
        console.log('%c', devtools);
        devtools.toString = () => {
            showMessage(result.message.console, 6000, 9);
        };
        window.addEventListener('copy', () => {
            showMessage(result.message.copy, 6000, 9);
        });
        window.addEventListener('visibilitychange', () => {
            if (!document.hidden)
                showMessage(result.message.visibilitychange, 6000, 9);
        });
    }

    /**
     * 注册移动事件
     *
    function registerMoveEventListener() {
        if (config.dragEnable === false) {
            return;
        }
        const waifu = document.getElementById("waifu");
        const live2d = document.getElementById("live2d")
        let isDown = false;
        let waifuLeft;
        let mouseLeft;
        let waifuTop;
        let mouseTop;
        // 鼠标点击监听
        waifu.onmousedown = function (e) {
            isDown = true;
            // 记录x轴
            waifuLeft = waifu.offsetLeft;
            mouseLeft = e.clientX;
            // 记录y轴
            waifuTop = waifu.offsetTop;
            mouseTop = e.clientY;
        }
        // 鼠标移动监听
        const isDirectionEmpty = !config.dragDirection || config.dragDirection.length === 0;
        window.onmousemove = function (e) {
            if (!isDown) {
                return;
            }
            // x轴移动
            if (isDirectionEmpty || config.dragDirection.includes("x")) {
                let currentLeft = waifuLeft + (e.clientX - mouseLeft);
                if (currentLeft < 0) {
                    currentLeft = 0;
                } else if (currentLeft > window.innerWidth - live2d.clientWidth) {
                    currentLeft = window.innerWidth - live2d.clientWidth;
                }
                waifu.style.left = currentLeft  + "px";
            }
            // y轴移动
            if (isDirectionEmpty || config.dragDirection.includes("y")) {
                let currentTop = waifuTop + (e.clientY - mouseTop);
                if (currentTop < 30) {
                    currentTop = 30
                } else if (currentTop > window.innerHeight - live2d.clientHeight + 10) {
                    currentTop = window.innerHeight - live2d.clientHeight + 10
                }
                waifu.style.top = currentTop + "px";
            }
        }
        // 鼠标点击松开监听
        window.onmouseup = function (e) {
            isDown = false;
        }
    }*/

    (function initModel() {
        let modelId: number | null = Number(localStorage.getItem('modelId'));
        let modelTexturesId: number | null = Number(
            localStorage.getItem('modelTexturesId'),
        );
        if (modelId === null) {
            // 首次访问加载 指定模型 的 指定材质
            modelId = 1; // 模型 ID
            modelTexturesId = 0; // 材质 ID
        }
        new Promise<void>((resolve, reject) => {
            // 初始化live2d
            window.live2d.init(config.cdnPath + "model/")
            resolve()
        }).then(() => {
            // 加载live2d模型
            model.loadModel(modelId, modelTexturesId, '');
        })
        fetch(config.waifuPath)
            .then((response) => response.json())
            .then(registerEventListener);
    })();
}

function initWidget(config: string | Config, chatConfig: ChatConfig, apiPath?: string) {
    if (typeof config === 'string') {
        config = {
            cdnPath: '', // Add the appropriate cdnPath value here
            waifuPath: config,
            apiPath,
        };
    }
    document.body.insertAdjacentHTML(
        'beforeend',
        `<div id="waifu-toggle">
               <span>看板娘</span>
             </div>`,
    );
    const toggle = document.getElementById('waifu-toggle');
    toggle?.addEventListener('click', () => {
        toggle!.classList.remove('waifu-toggle-active');
        if (toggle?.getAttribute('first-time')) {
            loadWidget(config as Config);
            toggle?.removeAttribute('first-time');
        } else {
            localStorage.removeItem('waifu-display');
            document.getElementById('waifu')!.style.display = '';
            setTimeout(() => {
                document.getElementById('waifu')!.style.bottom = '0';
            }, 0);
        }
    });
    if (
        localStorage.getItem('waifu-display') &&
        Date.now() - Number(localStorage.getItem('waifu-display')) <= 86400000
    ) {
        toggle?.setAttribute('first-time', 'true');
        setTimeout(() => {
            toggle?.classList.add('waifu-toggle-active');
        }, 0);
    } else {
        loadWidget(config as Config);
    }

    window.chatAI = new ChatAI(chatConfig);
}

let jsonData: { time: any; } = null;
let homePath = '/';
function welcomeMessage(time: Time) {
    if (location.pathname === homePath) { // 如果是主页
        for (let { hour, text } of time) {
            const now = new Date(),
                after = hour.split("-")[0],
                before = hour.split("-")[1] || after;
            if (Number(after) <= now.getHours() && now.getHours() <= Number(before)) {
                return text;
            }
        }
    }
    const text = `欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
    let from;
    if (document.referrer !== "") {
        const referrer = new URL(document.referrer),
            domain = referrer.hostname.split(".")[1];
        const domains = {
            "baidu": "百度",
            "so": "360搜索",
            "google": "谷歌搜索"
        };
        if (location.hostname === referrer.hostname) return text;

        if (domain in domains) from = domains[domain as keyof typeof domains];
        else from = referrer.hostname;
        return `Hello！来自 <span>${from}</span> 的朋友<br>${text}`;
    }
    return text;
}

export default initWidget;
