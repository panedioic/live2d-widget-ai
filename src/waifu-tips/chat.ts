import showMessage from "./message";

function showOrHiddenChatWidget() {
	const chatWidget = document.getElementById('chat-widget');
	if (chatWidget) {
		if (chatWidget.style.display === 'none') {
			chatWidget.style.display = 'flex';
            showMessage("「欢迎来到依言の小博客！(≧ω≦)ﾉ 请仔细阅读并同意以下条款与奈奈酱互动喵~」", 20000, 14);
		} else {
			chatWidget.style.display = 'none';
            showMessage("主人~ 要离开了吗？ 奈奈酱会想你的喵~ 欢迎随时回来看我(｡•́︿•̀｡) 再见！", 20000, 14);
		}
	}
}

function onSendMessage() {
    const chatInput = document.getElementById('waifu-chat-imput') as HTMLInputElement;
    if (chatInput) {
        const message = chatInput.value;
        if (typeof message !== 'string' || !message.trim()) {
            showMessage("主人~奈奈酱收到空消息会有点小困惑呢(｡•́︿•̀｡)", 1000, 16);
            return;
        }
        chatInput.value = '';
        chatInput.disabled = true; // Disable input

        window.chatAI.chat(message, {
            stream: true,
            onDelta: (delta: any) => {
                // not stream
            }
        }).then((fullResponse: any) => {
            showMessage(fullResponse, 20000, 16);
            console.log('[Recv message]', fullResponse);
        }).finally(() => {
            chatInput.disabled = false; // Re-enable input
        });
    }
}

export { showOrHiddenChatWidget, onSendMessage };