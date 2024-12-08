import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { PaperAirplaneIcon, MinusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/api/chat/chat', {
                messages: [...messages, userMessage]
            });

            const botMessage: Message = {
                role: 'assistant',
                content: response.data.response
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error: any) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b">
                <h2 className="text-xl font-light text-gray-800">Style Assistant</h2>
            </div>

            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl ${
                                message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            <p className="text-sm">{message.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                            <p className="text-sm">Typing...</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about fashion advice..."
                        className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                            isLoading ? 'text-gray-300' : 'text-gray-400 hover:text-blue-600'
                        } transition-colors duration-300`}
                    >
                        <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
                    </button>
                </form>
            </div>
        </div>
    );
} 