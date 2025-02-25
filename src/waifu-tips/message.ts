import { randomSelection } from "./utils.js";

let messageTimer: NodeJS.Timeout | null = null;

/**
 * Displays a message in the "waifu-tips" element with a specified timeout and priority.
 * 
 * @param text - The message text to display. Can be a string or an array of strings.
 * @param timeout - The duration (in milliseconds) for which the message should be displayed.
 * @param priority - The priority of the message. Higher priority messages will override lower priority ones.
 * 
 * If a message is already being displayed with a higher priority, the new message will not be shown.
 * The message will be cleared after the specified timeout.
 */
function showMessage(text: string | string[], timeout: number, priority: number) {
    if (!text || (sessionStorage.getItem("waifu-text") && Number(sessionStorage.getItem("waifu-text")) > priority)) return;
    if (messageTimer) {
        clearTimeout(messageTimer);
        messageTimer = null;
    }
    text = randomSelection(text);
    sessionStorage.setItem("waifu-text", String(priority));
    const tips = document.getElementById("waifu-tips");
    tips.innerHTML = Array.isArray(text) ? text.join(' ') : text;
    tips.classList.add("waifu-tips-active");
    messageTimer = setTimeout(() => {
        sessionStorage.removeItem("waifu-text");
        tips.classList.remove("waifu-tips-active");
    }, timeout);
}

export default showMessage;
