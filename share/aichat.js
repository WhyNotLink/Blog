const CONFIG = {
    owner: 'WhyNotLink',
    repo: 'Chat-logs',
    path: 'chat_history.json',
    encodedToken1:'Z2l0aH',
    encodedToken2:'ViX3BhdF8xMUJCMlo2U0EweTRGb0M4Qk9FQUppX21LdG9mVzNjU3d3S1QwbHhrMW',
    encodedToken3:'JZOXhBTGl5Y05mVmk1NlVrektxdjRpOG5LNk5URFRKN3F2eGhQaEVQ',
    encodedToken: encodedToken1+encodedToken2+encodedToken3,
    AI_API_KEY: 'sk-mx7mwmSK6BPx5J7seyFLcq1bmqoQmrCCHYd4FYR9RmG32uyA',
    AI_API_URL: 'https://api.moonshot.cn/v1/chat/completions',
    AI_MODEL: 'moonshot-v1-8k',
    AI_SYSTEM_PROMPT: '角色扮演,你是派蒙,协助一起探索,你的回复要简短,而且如果用户问你太复杂或者专业的问题,你要说不清楚,不要回复太详细,而且不要图标而是颜文字',
    AI_TEMPERATURE: 0.7,
    AI_MAX_TOKENS: 2000
};

const WELCOME_MSG = '你好啊旅行者';
const ERROR_MSG = 'tell lin there is a problem with my ai';

class ChatApp {
    constructor() {
        this.elements = {};
        this.pastConversations = [];
        this.currentConversation = [];
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadHistory();
    }

    cacheElements() {
        this.elements = {
            chatMessages: document.getElementById('chatMessages'),
            statusMessage: document.getElementById('statusMessage'),
            chatInput: document.getElementById('chatInput'),
            sendBtn: document.getElementById('sendBtn')
        };
    }

    bindEvents() {
        this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        this.elements.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5') {
                e.preventDefault();
                if (this.currentConversation.length > 0) {
                    this.saveCurrentConversation();
                }
                location.reload();
                return;
            }
        });
        
        window.addEventListener('beforeunload', () => {
            if (this.currentConversation.length > 0) {
                console.log('beforeunload 触发，保存对话');
                this.saveCurrentConversation();
            }
        });
        
        window.addEventListener('pagehide', () => {
            if (this.currentConversation.length > 0) {
                console.log('pagehide 触发，保存对话');
                this.saveCurrentConversation();
            }
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && this.currentConversation.length > 0) {
                console.log('visibilitychange 触发，保存对话');
                this.saveCurrentConversation();
            }
        });
    }

    saveCurrentConversation() {
        console.log('开始保存对话...');
        
        const token = atob(CONFIG.encodedToken);
        
        const xhrGet = new XMLHttpRequest();
        xhrGet.open('GET', `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.path}`, false);
        xhrGet.setRequestHeader('Authorization', 'Bearer ' + token);
        xhrGet.setRequestHeader('Content-Type', 'application/json');
        xhrGet.send();
        
        let sha = null;
        let existingContent = [];
        
        if (xhrGet.status === 200) {
            const data = JSON.parse(xhrGet.responseText);
            sha = data.sha;
            if (data.content) {
                const decodedContent = decodeURIComponent(escape(atob(data.content)));
                try {
                    existingContent = JSON.parse(decodedContent);
                    if (!Array.isArray(existingContent)) {
                        existingContent = [];
                    }
                } catch (e) {
                    existingContent = [];
                }
            }
        }
        
        const filteredConversation = [];
        for (let i = 0; i < this.currentConversation.length; i++) {
            const msg = this.currentConversation[i];
            if (msg.role === 'ai' && msg.isError) {
                if (i > 0 && this.currentConversation[i - 1].role === 'user') {
                    filteredConversation.pop();
                }
            } else {
                filteredConversation.push(msg);
            }
        }
        
        const contentToSave = [...existingContent, filteredConversation];
        
        const jsonContent = JSON.stringify(contentToSave, null, 2);
        const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));
        
        const requestBody = {
            message: `Save conversation - ${new Date().toLocaleString()}`,
            content: base64Content
        };
        
        if (sha) {
            requestBody.sha = sha;
        }
        
        const xhrPut = new XMLHttpRequest();
        xhrPut.open('PUT', `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.path}`, false);
        xhrPut.setRequestHeader('Authorization', 'Bearer ' + token);
        xhrPut.setRequestHeader('Content-Type', 'application/json');
        xhrPut.send(JSON.stringify(requestBody));
        console.log('保存状态:', xhrPut.status);
        
        if (xhrPut.status === 200 || xhrPut.status === 201) {
            this.currentConversation = [];
        }
    }

    showStatus(message, isError = false) {
        this.elements.statusMessage.textContent = message;
        this.elements.statusMessage.className = 'status-message ' + (isError ? 'error' : 'success');
        setTimeout(() => {
            this.elements.statusMessage.textContent = '';
            this.elements.statusMessage.className = 'status-message';
        }, 3000);
    }

    addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = isUser ? '我' : 'AI';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        this.elements.chatMessages.appendChild(messageDiv);
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    }

    addDivider() {
        const divider = document.createElement('div');
        divider.className = 'conversation-divider';
        divider.innerHTML = '<span>以上为历史记录</span>';
        this.elements.chatMessages.appendChild(divider);
    }

    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">AI</div>
            <div class="message-content typing-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        this.elements.chatMessages.appendChild(typingDiv);
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    async sendMessage() {
        const content = this.elements.chatInput.value.trim();
        if (!content) {
            this.showStatus('请输入内容！');
            return;
        }
        
        this.addMessage(content, true);
        this.currentConversation.push({ role: 'user', content, timestamp: new Date().toISOString() });
        this.elements.chatInput.value = '';
        
        this.showTyping();
        
        try {
            const allMessages = [...this.pastConversations.flat(), ...this.currentConversation];
            const aiResponse = await this.callAI(allMessages);
            this.hideTyping();
            this.addMessage(aiResponse, false);
            this.currentConversation.push({ role: 'ai', content: aiResponse, timestamp: new Date().toISOString() });
        } catch (error) {
            this.hideTyping();
            const errorMessage = ERROR_MSG;
            this.addMessage(errorMessage, false);
            this.currentConversation.push({ role: 'ai', content: errorMessage, timestamp: new Date().toISOString(), isError: true });
        }
    }

    async callAI(messages) {
        const { AI_API_KEY, AI_API_URL, AI_MODEL, AI_SYSTEM_PROMPT, AI_TEMPERATURE, AI_MAX_TOKENS } = CONFIG;
        
        if (!AI_API_KEY || AI_API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('未设置 AI API Key');
            throw new Error('API Key not set');
        }
        
        const requestMessages = [
            { role: 'system', content: AI_SYSTEM_PROMPT },
            ...messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))
        ];
        
        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: requestMessages,
                temperature: AI_TEMPERATURE,
                max_tokens: AI_MAX_TOKENS
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API 请求失败: ${response.status} - ${errorData.error?.message || '未知错误'}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async loadHistory() {
        const { content } = await readFromGithub();
        
        const MAX_PAST_CONVS = 5;
        const startIndex = Math.max(0, content.length - MAX_PAST_CONVS);
        
        for (let i = startIndex; i < content.length; i++) {
            const conv = content[i];
            if (Array.isArray(conv)) {
                const filteredConv = conv.filter(msg => !msg.isError);
                filteredConv.forEach(msg => {
                    this.addMessage(msg.content, msg.role === 'user');
                });
                
                this.pastConversations.push(...filteredConv.map(msg => [msg]));
            }
        }
        
        if (content.length > 0) {
            this.addDivider();
        }
        
        this.addMessage(WELCOME_MSG, false);
    }
}

const getGithubToken = () => {
    const token = atob(CONFIG.encodedToken);
    if (!token) {
        throw new Error('Invalid token');
    }
    return token;
};

const readFromGithub = async () => {
    const { owner, repo, path } = CONFIG;
    const token = getGithubToken();
    
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 404 || response.status === 401) {
                return { content: [], sha: null };
            }
            throw new Error(`Failed to read: ${response.status}`);
        }
        
        const data = await response.json();
        const decodedContent = decodeURIComponent(escape(atob(data.content)));
        let contentArray;
        
        try {
            contentArray = JSON.parse(decodedContent);
            if (!Array.isArray(contentArray)) {
                contentArray = [decodedContent];
            }
        } catch (e) {
            contentArray = [decodedContent];
        }
        
        return { content: contentArray, sha: data.sha };
    } catch (error) {
        console.error('Error reading from GitHub:', error);
        return { content: [], sha: null };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
