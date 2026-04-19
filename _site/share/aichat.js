const part1 = 'Z2l0aHViX3BhdF8xMUJCMlo2U0EwYmVV';
const part2 = 'WW9sTVNVTGJLX1NlWGhVNjRVcEJzeVM4';
const part3 = 'MDVDZ3ZnSUpIeDc1TmZRaFlzMjZ6dlVJ';
const part4 = 'aHNJazU2NExJVU1RRGtWM0hrSzli';

const CONFIG = {
    owner: 'WhyNotLink',
    repo: 'Chat-logs',
    history_path: 'chat_history.json',
    encodedToken: part1 + part2 + part3 + part4,
    AI_API_KEY: 'sk-mx7mwmSK6BPx5J7seyFLcq1bmqoQmrCCHYd4FYR9RmG32uyA',
    AI_API_URL: 'https://api.moonshot.cn/v1/chat/completions',
    AI_MODEL: 'moonshot-v1-8k',
    AI_SYSTEM_PROMPT: '角色扮演,你是派蒙,协助一起探索,你的回复要简短,而且如果用户问你太复杂或者专业的问题,你要说不清楚,不要回复太详细,而且不要图标而是颜文字',
    AI_TEMPERATURE: 0.7,
    AI_MAX_TOKENS: 2000
};

const WELCOME_MSG = '你好啊旅行者';
const ERROR_MSG = 'tell lin there is a problem with my ai';

class ChatApp{
    constructor(){
        this.elements = {};
        this.savedConversations = [];
        this.unsavedConversations = [];
        this.currentConversation = [];
        this.init();
    }
    init(){
        this.cacheElements();
        this.bindEvents();
        this.showHistoryConversations();
    }

    cacheElements(){
        this.elements.chatMessages = document.getElementById('chatMessages');
        this.elements.statusMessage = document.getElementById('statusMessage');
        this.elements.chatInput = document.getElementById('chatInput');
        this.elements.sendBtn = document.getElementById('sendBtn');
    }

    bindEvents(){
        this.elements.sendBtn.addEventListener('click',()=>this.sendMessage());
        this.elements.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        document.addEventListener('keydown',(e)=>{
            if(e.key === 'F5'){
                e.preventDefault();
                if(this.unsavedConversations.length > 0){
                    this.saveUnsavedConversations();
                }
                location.reload();
                return;
            }
        })
        window.addEventListener('beforeunload',()=>{
            if(this.unsavedConversations.length > 0){
                this.saveUnsavedConversations();
            }
        })
    }

    saveUnsavedConversations(){
        console.log('start save unsaved conversations...');
        
        const token = atob(CONFIG.encodedToken);
        const xhrGet = new XMLHttpRequest();
        xhrGet.open('GET', `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.history_path}`, false);
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
                } catch (error) {
                    console.error('Error parsing existing content:', error);
                }
            }
        }

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


        const mergeContent = [...existingContent, filteredConversation];
        const jsonmergeContent = JSON.stringify(mergeContent, null, 2);
        const base64Content = btoa(unescape(encodeURIComponent(jsonmergeContent)));
        const requestBody = {
            message: `Save conversation - ${new Date().toLocaleString()}`,
            content: base64Content
        };
        if (sha) {
            requestBody.sha = sha;
        }
        const xhrPut = new XMLHttpRequest();
        xhrPut.open('PUT', `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.history_path}`, false);
        xhrPut.setRequestHeader('Authorization', 'Bearer ' + token);
        xhrPut.setRequestHeader('Content-Type', 'application/json');
        xhrPut.send(JSON.stringify(requestBody));
        if (xhrPut.status === 200 || xhrPut.status === 201) {
            console.log('Save unsaved conversations success!');
        } else {
            console.error('Save unsaved conversations failed!');
        }
    }

    addDivider(){
        const divider = document.createElement('div');
        divider.className = 'conversation-divider';
        divider.innerHTML = '<span>以上为历史记录</span>';
        this.elements.chatMessages.appendChild(divider);
    }

    showMessages(content, isUser){
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

    async sendMessage(){
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

        try{
            // const processedMessages = await processing();
            const processedMessages = [...this.savedConversations.flat(), ...this.unsavedConversations];
            const aiResponse = await this.callAI(processedMessages);
            this.hideTyping();
            this.showMessages(aiResponse, false);
            this.unsavedConversations.push({ role: 'ai', content: aiResponse, timestamp: new Date().toISOString() });
        }catch(error){
            this.hideTyping();
            this.showMessages(ERROR_MSG, false);
            this.unsavedConversations.push({ role: 'ai', content: ERROR_MSG, timestamp: new Date().toISOString(), isError: true });
        }
    }
    async callAI(messages){
        const { AI_API_KEY, AI_API_URL, AI_MODEL, AI_SYSTEM_PROMPT, AI_TEMPERATURE, AI_MAX_TOKENS } = CONFIG;
        if(!AI_API_KEY){
            console.warn('AI API Key not set!');
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
            throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || '未知错误'}`);
        }
        const data = await response.json();
        return data.choices[0].message.content;
    }
    async showHistoryConversations(){
        const { content } = await readchat_history();
        const MAX_PAST_CONVS = 5;
        const startIndex = Math.max(0, content.length - MAX_PAST_CONVS);
        for (let i = startIndex; i < content.length; i++) {
            const conv = content[i];
            if(Array.isArray(conv)){
                conv.forEach(msg => {
                    this.showMessages(msg.content, msg.role === 'user');
                });
                this.savedConversations.push(...conv.map(msg=>[msg]));
            }
        }
        if(content.length > 0){
            this.addDivider();
        }
        this.showMessages(WELCOME_MSG, false);
    }
} 

const getGithubToken = () => {
    const token = atob(CONFIG.encodedToken);
    if (!token) {
        throw new Error('Invalid token');
    }
    return token;
};

const readchat_history = async () => {
    const { owner, repo, history_path } = CONFIG;
    const token = getGithubToken();
    
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${history_path}`, {
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













    
