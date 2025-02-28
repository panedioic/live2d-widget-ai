import axios from 'axios';

interface ChatOptions {
    stream?: boolean;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    enableSearch?: boolean;
    mockResponse?: string;
}

class ChatAI {
    // Use your own deployed backend
    private apiKey: string;
    private baseURL: string;
    private provider: string;
    private requestSessionIdBeforeUse: boolean;
    private sessionID: string = '';
    private stream = false;
    private isTosAgreed: boolean = false;

    constructor(config: ChatConfig) {
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL;
        this.provider = config.provider;
        // this.requestSessionIdBeforeUse = config.requistSessionIdBeforeUse;
        this.requestSessionIdBeforeUse = true;

        (async () => {
            if (this.requestSessionIdBeforeUse) {
                this.sessionID = await this.createSession();
                this.setSessionId(this.sessionID);
                this.requestSessionIdBeforeUse = false;
            }
            else {
                this.sessionID = this.getSessionId();
            }
        })();
    }

    private async chatMock(
        input: string,
        options: ChatOptions,
        onDelta?: (delta: string) => void
    ): Promise<string> {
        const mockResponse = options.mockResponse || '这是模拟响应';
        const shouldStream = options.stream ?? false;

        if (shouldStream) {
            return this.handleMockResponse(mockResponse, onDelta);
        }

        return mockResponse;
    }

    private async handleMockResponse(
        response: string,
        onDelta?: (delta: string) => void
    ): Promise<string> {
        const chunks = this.splitResponse(response, 3);

        for (const chunk of chunks) {
            await new Promise(resolve => setTimeout(resolve, 100));
            onDelta?.(chunk); // 安全调用回调
        }

        return response;
    }

    private splitResponse(response: string, chunkSize: number): string[] {
        const chunks = [];
        for (let i = 0; i < response.length; i += chunkSize) {
            chunks.push(response.slice(i, i + chunkSize));
        }
        return chunks;
    }

    async chat(
        input: string,
        options: ChatOptions & { onDelta?: (delta: string) => void } = {}
    ): Promise<string> {
        const { onDelta, ...restOptions } = options;

        if (this.provider === 'mock') {
            return this.chatMock(input, restOptions, onDelta);
        }

        if (!this.isTosAgreed) {
            if (input === '同意') {
                this.isTosAgreed = true;
                return '协议印章已盖上胡萝卜认证戳！(๑•̀ㅂ•́)و✧ 现在可以尽情提问啦喵~';
            }
            else if (input == '拒绝') {
                return '兔耳朵遗憾地垂下来了...(´-ω-`) 根据《网络安全法》第十六条，即将关闭对话窗口」 → 强制终止会话';
            }
            else {
                return '检测到未确认协议！(>_<) 请先输入『同意』或『拒绝』才能激活奈奈的核心程序哟~';
            }
        }

        try {
            // 构造请求体
            // session_id替换为实际上一轮对话的session_id
            const requestBody = {
                message: input,
                session_id: this.sessionID
            }

            const response = await axios.post(this.baseURL, requestBody, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                this.sessionID = `${response.data.output.session_id}`;
                return `${response.data.output.text}`;
            } else {
                console.log(`request_id=${response.headers['request_id']}`);
                console.log(`code=${response.status}`);
                console.log(`message=${response.data.message}`);
            }
        } catch (error) {
            console.error(`Error calling DashScope: ${error}`);
        }
    }

    async createSession(): Promise<string> {
        try {
            const requestBody = {}

            // 这里先写死了，等之后有人想用我的项目的时候再改成可以配置的吧
            const response = await axios.post('https://blog.y1yan.com/api/api/create_session', requestBody);

            if (response.status === 200 || response.status === 201) {
                this.sessionID = `${response.data.output.session_id}`;
                return `${response.data.output.session_id}`;
            } else {
                console.log(`request_id=${response.headers['request_id']}`);
                console.log(`code=${response.status}`);
                console.log(`message=${response.data.message}`);
            }
        } catch (error) {
            console.error(`Error getting session Id: ${error}`);
        }
    }

    // get if user agreed to TOS
    getTosAgreed() {
        return localStorage.getItem('tosAgreed') === 'true';
    }

    setTosAgreed(agreed: boolean) {
        this.isTosAgreed = agreed;
        localStorage.setItem('tosAgreed', agreed.toString());
    }

    getSessionId() {
        return localStorage.getItem('sessionID') || '';
    }

    setSessionId(sessionId: string) {
        this.sessionID = sessionId;
        localStorage.setItem('sessionID', sessionId);
    }
}

export default ChatAI;