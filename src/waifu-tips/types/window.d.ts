interface Window {
    initWidget: (config: string | Config, chatConfig: ChatConfig, apiPath?: string) => void;
    chatAI: any;
    chatWidget: HTMLElement;
}