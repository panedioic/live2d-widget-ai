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
    private requestSessionIdBeforeUse;
    private sessionID: string = '';
    private stream = false;
    private isTosAgreed: boolean = false;

    constructor(config: ChatConfig) {
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL;
        this.provider = config.provider;
        this.requestSessionIdBeforeUse = config.requireSessionIdBeforeUse
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
            else if (input == '拒绝')
            {
                return '兔耳朵遗憾地垂下来了...(´-ω-`) 根据《网络安全法》第十六条，即将关闭对话窗口」 → 强制终止会话';
            }
            else
            {
                return '检测到未确认协议！(>_<) 请先输入『同意』或『拒绝』才能激活奈奈的核心程序哟~';
            }
        }

        if (this.requestSessionIdBeforeUse) {
            this.requestSessionIdBeforeUse = false;
        }

        try {
            // 构造请求体
            // session_id替换为实际上一轮对话的session_id
            const requestBody = {
                input: {
                    prompt: input,
                    session_id: this.sessionID
                },
                parameters: {},
                debug: {}
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
}

export default ChatAI;