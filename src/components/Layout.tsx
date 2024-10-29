import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { MessageSquare, Settings } from 'lucide-react';
import ChatList from './ChatList';
import { useChats } from '../hooks/useChats';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { chats, currentChatId, setCurrentChatId, createChat } = useChats();

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-white bg-opacity-90 p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-8">
          <MessageSquare className="w-8 h-8 text-green-600" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            ChatGeniusGPT
          </h1>
        </div>
        
        <div className="flex flex-col justify-between h-[calc(100%-8rem)]">
          <div className="flex-1 overflow-y-auto">
            <ChatList
              chats={chats}
              currentChatId={currentChatId}
              onChatSelect={setCurrentChatId}
              onNewChat={createChat}
            />
          </div>
          
          <div className="border-t pt-4 space-y-4">
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <div className="flex items-center gap-2">
              <UserButton />
              <span className="text-sm text-gray-700">Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default Layout;