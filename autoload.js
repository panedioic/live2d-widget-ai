const cdnPath = '';
const config = {
    // 资源路径
    path: {
        homePath: "/",
        modelPath: cdnPath + "/Resources/",
        cssPath: cdnPath + "/assets/waifu.css",
        tipsJsonPath: cdnPath + "/assets/waifu-tips.json",
        tipsJsPath: cdnPath + "/assets/waifu-tips.js",
        live2dCorePath: cdnPath + "/Core/live2dcubismcore.js",
        live2dSdkPath: cdnPath + "/assets/live2d-sdk.js"
    },
    // 工具栏
    tools: ["hitokoto", "asteroids", "express", "switch-model", "switch-texture", "photo", "info", "quit"],
    // 模型拖拽
    drag: {
        enable: true,
        direction: ["x", "y"]
    },
    // 模型切换(order: 顺序切换，random: 随机切换)
    switchType: "order"
}

const chatConfig = {
    apiKey: '',
    baseURL: 'https://blog.y1yan.com/api/api/chat',
    provider: 'aliyun',
    requestSessionIdBeforeUse: true
};

// 加载资源并初始化
if (screen.width >= 768) {
    Promise.all([
        loadExternalResource(config.path.cssPath, "css"),
        loadExternalResource(config.path.live2dCorePath, "js"),
        loadExternalResource(config.path.live2dSdkPath, "js"),
        loadExternalResource(config.path.tipsJsPath, "js")
    ]).then(() => {
        initWidget({
            homePath: config.path.homePath,
            waifuPath: config.path.tipsJsonPath,
            cdnPath: config.path.modelPath,
            tools: config.tools,
            dragEnable: config.drag.enable,
            dragDirection: config.drag.direction,
            switchType: config.switchType
        },
            chatConfig
        );
    });
}

// 异步加载资源
function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
        let tag;
        if (type === "css") {
            tag = document.createElement("link");
            tag.rel = "stylesheet";
            tag.href = url;
        }
        else if (type === "js") {
            tag = document.createElement("script");
            tag.src = url;
        }
        if (tag) {
            tag.onload = () => resolve(url);
            tag.onerror = () => reject(url);
            document.head.appendChild(tag);
        }
    });
}