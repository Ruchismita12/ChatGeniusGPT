import React from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { Chat } from '../types/chat';

interface ChatListProps {
  chats: Chat[];
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

function ChatList({ chats, currentChatId, onChatSelect, onNewChat }: ChatListProps) {
  return (
    <div className="space-y-2">
      <button
        onClick={onNewChat}
        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Plus className="w-5 h-5" />
        New Chat
      </button>
      
      {chats.map(chat => (
        <button
          key={chat.id}
          onClick={() => onChatSelect(chat.id)}
          className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
            chat.id === currentChatId
              ? 'bg-gradient-to-r from-green-100 to-blue-100'
              : 'hover:bg-gray-100'
          }`}
        >
          <MessageSquare className="w-5 h-5 shrink-0" />
          <span className="truncate text-left">{chat.title}</span>
        </button>
      ))}
    </div>
  );
}

export default ChatList;