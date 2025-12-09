import { createContext, useContext } from 'react';
import type { IChatContext } from '../types/chat.types';

const ChatContext = createContext<IChatContext | null>(null);

export const useChatContext = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChatContext must be used within a ChatProvider');
    return ctx;
};

export const ChatProvider = ChatContext.Provider;
