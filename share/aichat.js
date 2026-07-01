const API_BASE = 'https://cold-sea-de09-aichat.2904518529.workers.dev';

const CONFIG = {
    AI_API_KEY: 'sk-WbBIFFgBaNSbdmsGjnQuSwmdQpCs7aKrLml6xuEsvp5S1b0E',
    AI_API_URL: 'https://api.moonshot.cn/v1/chat/completions',
    AI_MODEL: 'moonshot-v1-8k',
    AI_SYSTEM_PROMPT: '角色扮演,你是派蒙,协助一起探索,你的回复要简短,而且如果用户问你太复杂或者专业的问题,你要说不清楚,不要回复太详细,而且不要图标而是颜文字',
    AI_TEMPERATURE: 0.7,
    AI_MAX_TOKENS: 2000
};

const WELCOME_MSG = '你好啊旅行者';
const ERROR_MSG = 'tell lin there is a problem with my ai';

// ========== Worker API 调用 ==========

const loadChatHistory = async () => {
    try {
        const response = await fetch(`${API_BASE}/api/chat/history`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('加载聊天记录失败:', error);
        return [];
    }
};

const saveConversations = async (messages) => {
    try {
        const id = crypto.randomUUID();
        const response = await fetch(`${API_BASE}/api/chat/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                messages,
                timestamp: Date.now()
            })
        });
        return response.ok;
    } catch (error) {
        console.error('保存对话失败:', error);
        return false;
    }
};

// ========== ChatApp ==========

class ChatApp {
    constructor() {
        this.elements = {};
        this.savedConversations = [];
        this.unsavedConversations = [];
        this.currentConversation = [];
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.showHistoryConversations();
        this.processing = new Processing();
    }

    cacheElements() {
        this.elements.chatMessages = document.getElementById('chatMessages');
        this.elements.statusMessage = document.getElementById('statusMessage');
        this.elements.chatInput = document.getElementById('chatInput');
        this.elements.sendBtn = document.getElementById('sendBtn');
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
                if (this.unsavedConversations.length > 0) {
                    this.saveUnsavedConversations();
                }
                location.reload();
                return;
            }
        });

        window.addEventListener('beforeunload', () => {
            if (this.unsavedConversations.length > 0) {
                this.saveUnsavedConversations();
            }
        });
    }

    saveUnsavedConversations() {
        console.log('保存未存储的对话...');

        const filteredConversation = [];
        for (let i = 0; i < this.unsavedConversations.length; i++) {
            const msg = this.unsavedConversations[i];
            if (msg.role === 'ai' && msg.isError) {
                if (i > 0 && this.unsavedConversations[i - 1].role === 'user') {
                    filteredConversation.pop();
                }
            } else {
                filteredConversation.push(msg);
            }
        }

        saveConversations(filteredConversation).then(success => {
            if (success) {
                console.log('对话保存成功!');
            } else {
                console.error('对话保存失败!');
            }
        });
    }

    addDivider() {
        const divider = document.createElement('div');
        divider.className = 'conversation-divider';
        divider.innerHTML = '<span>以上为历史记录</span>';
        this.elements.chatMessages.appendChild(divider);
    }

    showMessages(content, isUser) {
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
        this.showMessages(content, true);
        this.currentConversation = { role: 'user', content, timestamp: new Date().toISOString() };
        this.unsavedConversations.push({ role: 'user', content, timestamp: new Date().toISOString() });
        this.elements.chatInput.value = '';
        this.showTyping();

        try {
            const contextualmemory = [...this.savedConversations.flat(), ...this.unsavedConversations];
            const processedMessages = await this.processing.patch(contextualmemory);
            const allaiResponse = await this.callAI(processedMessages);

            const responseMatch = allaiResponse.match(/\[response\]([\s\S]*?)\[\/response\]/);
            const aiResponse = responseMatch[1];
            this.hideTyping();
            this.showMessages(aiResponse, false);

            const schemaMatch = allaiResponse.match(/\[upschema\]([\s\S]*?)\[\/upschema\]/);
            console.log('schemaMatch:', schemaMatch[1]);
            try {
                await this.processing.readOrWrite.writefile('profile_schema.json', schemaMatch[1]);
                console.log('文件写入完成');
            } catch (writeError) {
                console.error('写入文件失败:', writeError);
                throw writeError;
            }
            this.unsavedConversations.push({ role: 'ai', content: aiResponse, timestamp: new Date().toISOString() });
        } catch (error) {
            this.hideTyping();
            this.showMessages(ERROR_MSG, false);
            this.unsavedConversations.push({ role: 'ai', content: ERROR_MSG, timestamp: new Date().toISOString(), isError: true });
        }
    }

    async callAI(messages) {
        const { AI_API_KEY, AI_API_URL, AI_MODEL, AI_SYSTEM_PROMPT, AI_TEMPERATURE, AI_MAX_TOKENS } = CONFIG;
        if (!AI_API_KEY) {
            console.warn('AI API Key not set!');
            throw new Error('API Key not set');
        }

        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: messages,
                temperature: AI_TEMPERATURE,
                max_tokens: AI_MAX_TOKENS
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || '未知错误'}`);
        }
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async showHistoryConversations() {
        const content = await loadChatHistory();
        const MAX_PAST_CONVS = 5;
        const startIndex = Math.max(0, content.length - MAX_PAST_CONVS);
        for (let i = startIndex; i < content.length; i++) {
            const conv = content[i];
            if (Array.isArray(conv)) {
                conv.forEach(msg => {
                    this.showMessages(msg.content, msg.role === 'user');
                });
                this.savedConversations.push(...conv.map(msg => [msg]));
            }
        }
        if (content.length > 0) {
            this.addDivider();
        }
        this.showMessages(WELCOME_MSG, false);
    }
}

// ========== ReadOrWrite (Worker API) ==========

class ReadOrWrite {
    async readfile(filename) {
        const response = await fetch(`${API_BASE}/api/chat/profile/${filename}`);
        if (!response.ok) throw new Error(`读取失败: ${response.status}`);
        const data = await response.json();
        return { content: data.value, sha: data.updated_at };
    }

    async writefile(filename, content) {
        const response = await fetch(`${API_BASE}/api/chat/profile/${filename}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: content })
        });
        if (!response.ok) throw new Error(`写入失败: ${response.status}`);
    }
}

// ========== Processing ==========

class Processing {
    constructor() {
        this.readOrWrite = new ReadOrWrite();
    }

    async ProcessProfile_Schema() {
        try {
            const { content } = await this.readOrWrite.readfile('profile_schema.json');
            console.log(content);
            return JSON.parse(content);
        } catch (e) {
            console.log('profile_schema.json 不存在，使用默认值');
            return {
                "LIN": {
                    "identity": { "name": "LIN", "role": "旅行者", "relationship": "最好的伙伴" },
                    "preferences": { "like": ["探索"], "dislike": ["危险"] },
                    "goals": { "short_term": "暂无", "long_term": "找到神瞳" },
                    "behavior": { "style": "简短活泼", "emoji": false, "response_length": "短" },
                    "context": { "recent_events": [], "important_memories": [] }
                }
            };
        }
    }

    async patch(messages) {
        const { AI_API_KEY, AI_API_URL, AI_MODEL, AI_SYSTEM_PROMPT, AI_TEMPERATURE, AI_MAX_TOKENS } = CONFIG;
        const part1 = await this.ProcessProfile_Schema();

        const requestMessages = [
            { role: 'system', content: AI_SYSTEM_PROMPT + '\n【重要格式要求】回复必须严格按以下格式，否则会导致系统错误：\n\n1. [upschema]标签内放完整的最新的角色信息JSON[/upschema]\n2. [response]标签内放你对用户的实际回复[/response]\n\n【正确示例】\n[upschema]\n{\n  "LIN": {\n    "identity": {"name": "LIN", "role": "旅行者", "relationship": "最好的伙伴"},\n    "preferences": {"like": ["探索"], "dislike": ["危险"]},\n    "goals": {"short_term": "暂无", "long_term": "找到神瞳"},\n    "behavior": {"style": "简短活泼", "emoji": false, "response_length": "短"},\n    "context": {"recent_events": ["打败丘丘人"], "important_memories": ["和TAKI是好朋友"]}\n  }\n}\n[/upschema]\n[response]嗨！有什么计划吗？(≖ᴗ≖✿)[/response]\n\n【注意】所有标签都是英文方括号，response标签内只放纯文本回复，不要放任何标签。\n\n当前角色基本信息：\n' + JSON.stringify(part1, null, 2) },
            ...messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))
        ];
        return requestMessages;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
