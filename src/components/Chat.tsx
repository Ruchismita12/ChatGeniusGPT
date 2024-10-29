import React, { useState } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useChats } from '../hooks/useChats';
import { generateResponse } from '../services/gemini';

function Chat() {
  const { user } = useUser();
  const { currentChat, currentChatId, createChat, addMessage } = useChats();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const chatId = currentChat?.id || createChat().id;
    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: Date.now(),
    };

    setError(null);
    addMessage(chatId, userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await generateResponse(input);
      
      const aiMessage = {
        role: 'assistant' as const,
        content: aiResponseText,
        timestamp: Date.now(),
      };
      
      addMessage(chatId, aiMessage);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get response');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentChat?.messages.map(message => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex gap-3 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-green-600 to-blue-600' 
                  : 'bg-gray-200'
              }`}>
                {message.role === 'user' 
                  ? <User className="w-5 h-5 text-white" />
                  : <Bot className="w-5 h-5 text-gray-700" />
                }
              </div>
              <div
                className={`p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'bg-white shadow-md'
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Bot className="w-5 h-5 animate-pulse" />
            <span>Thinking...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white bg-opacity-90">
        <div className="flex gap-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message ChatGeniusGPT..."
            className="flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;