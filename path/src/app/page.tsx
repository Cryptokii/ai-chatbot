'use client';

import { useState } from 'react';

interface Message {
  sender: 'User' | 'AI';
  text: string;
}

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'User', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const aiMessage: Message = { sender: 'AI', text: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { sender: 'AI', text: 'Sorry, something went wrong.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">AI Chatbot</h1>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-4 flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                msg.sender === 'AI' ? 'bg-blue-100 self-start' : 'bg-green-100 self-end'
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
          {loading && (
            <div className="mb-2 p-2 rounded bg-blue-100 self-start">
              <strong>AI:</strong> Typing...
            </div>
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 border rounded-l px-4 py-2 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 