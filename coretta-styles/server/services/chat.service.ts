import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export class ChatService {
    private static instance: ChatService;
    private readonly apiKey: string = process.env.OPENAI_API_KEY!;
    private readonly apiUrl: string = 'https://api.gpt4.ai/v1/chat/completions';

    private constructor() {
        // Initialize with a system message about being a style assistant
        this.systemMessage = {
            role: 'system',
            content: 'You are a knowledgeable style assistant for Coretta Styles, helping customers with fashion advice, product recommendations, and styling tips.'
        };
    }

    private readonly systemMessage: ChatMessage;

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    async generateResponse(messages: ChatMessage[]): Promise<string> {
        try {
            // Add system message at the start of the conversation
            const fullMessages = [this.systemMessage, ...messages];

            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'gpt-4o-mini',
                    messages: fullMessages,
                    temperature: 0.7,
                    max_tokens: 1000
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            return response.data.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';
        } catch (error: any) {
            console.error('Error generating chat response:', error.response?.data || error.message);
            throw new Error(`Failed to generate response: ${error.response?.data?.error?.message || error.message}`);
        }
    }
}

export default ChatService; 