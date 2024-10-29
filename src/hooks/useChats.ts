import { useState, useEffect } from 'react';
import { Chat, Message } from '../types/chat';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentChatId, setCurrentChatId] = useState<string>(() => {
    return chats[0]?.id || '';
  });

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const createChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat;
  };

  const addMessage = (chatId: string, message: Omit<Message, 'id'>) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, { ...message, id: crypto.randomUUID() }],
          title: chat.messages.length === 0 ? message.content.slice(0, 30) + '...' : chat.title,
        };
      }
      return chat;
    }));
  };

  const currentChat = chats.find(chat => chat.id === currentChatId);

  return {
    chats,
    currentChat,
    currentChatId,
    setCurrentChatId,
    createChat,
    addMessage,
  };
}