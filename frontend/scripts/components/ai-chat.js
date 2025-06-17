// frontend/scripts/components/ai-chat.js
class AIChatComponent {
    constructor() {
        this.isOpen = false;
        this.apiKey = 'AIzaSyB9t-lHkmx2zs-DqoGNdkCCIKoGGr545dk';
        this.initializeComponent();
        this.loadGoogleAI();
    }

    initializeComponent() {
        // Create floating chat button
        const chatButton = document.createElement('div');
        chatButton.className = 'ai-chat-button';
        chatButton.innerHTML = `
            <i class="fas fa-robot"></i>
        `;
        
        // Create chat interface - FIXED: renamed 'interface' to 'chatInterface'
        const chatInterface = document.createElement('div');
        chatInterface.className = 'ai-chat-interface';
        chatInterface.innerHTML = `
            <div class="chat-header">
                <h3>PlantHub AI Assistant</h3>
                <button class="chat-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="ai-message">
                    <div class="message-content">
                        Hello! I'm your PlantHub AI assistant. How can I help you with your plants today?
                    </div>
                </div>
            </div>
            <div class="chat-input-container">
                <input type="text" id="chatInput" placeholder="Ask about plant care...">
                <button id="sendMessage">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        document.body.appendChild(chatButton);
        document.body.appendChild(chatInterface);

        this.setupEventListeners(chatButton, chatInterface);
    }

    // FIXED: Changed parameter name from 'interface' to 'chatInterface'
    setupEventListeners(button, chatInterface) {
        button.addEventListener('click', () => this.toggleChat(chatInterface));
        
        const closeBtn = chatInterface.querySelector('.chat-close');
        closeBtn.addEventListener('click', () => this.closeChat(chatInterface));

        const sendBtn = chatInterface.querySelector('#sendMessage');
        const input = chatInterface.querySelector('#chatInput');
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    // FIXED: Changed parameter name from 'interface' to 'chatInterface'
    toggleChat(chatInterface) {
        this.isOpen = !this.isOpen;
        chatInterface.classList.toggle('open', this.isOpen);
    }

    // FIXED: Changed parameter name from 'interface' to 'chatInterface'
    closeChat(chatInterface) {
        this.isOpen = false;
        chatInterface.classList.remove('open');
    }

    async loadGoogleAI() {
        try {
            // FIXED: Updated to use ES6 modules for better compatibility
            const script = document.createElement('script');
            script.type = 'module';
            script.innerHTML = `
                import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';
                window.GoogleGenerativeAI = GoogleGenerativeAI;
                console.log('Google AI loaded successfully');
            `;
            document.head.appendChild(script);
        } catch (error) {
            console.error('Error loading Google AI:', error);
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTyping();

        try {
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addMessage(response, 'ai');
        } catch (error) {
            this.hideTyping();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            console.error('AI Response Error:', error);
        }
    }

    async getAIResponse(message) {
        // FIXED: Removed the incorrect API key check
        if (!this.apiKey) {
            return "API key is not configured. Please check your configuration.";
        }

        try {
            // FIXED: Updated to use the correct Gemini model endpoint
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a plant care expert assistant for PlantHub. 
                            Provide helpful, accurate advice about plant care, diseases, watering, lighting, and general plant health. 
                            Keep responses concise but informative (maximum 150 words).
                            
                            User question: ${message}`
                        }]
                    }],
                    // FIXED: Added safety settings and generation config
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 200
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Details:', errorData);
                throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error('Unexpected API response structure:', data);
                return "I'm sorry, I couldn't generate a response. Please try again.";
            }
        } catch (error) {
            console.error('API Error:', error);
            if (error.message.includes('403')) {
                return "API access denied. Please check your API key permissions.";
            } else if (error.message.includes('429')) {
                return "Too many requests. Please wait a moment and try again.";
            } else {
                return "I'm experiencing technical difficulties. Please check your internet connection and try again.";
            }
        }
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(content)}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // FIXED: Added HTML escaping for security
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// Initialize AI chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing PlantHub AI Chat...');
    new AIChatComponent();
});
