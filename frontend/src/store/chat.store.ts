import { create } from 'zustand';

interface ChatState {
  selectedChatId: string | null;
  streamingContent: string;
  isStreaming: boolean;

  // Actions
  setSelectedChatId: (chatId: string | null) => void;
  setStreamingContent: (content: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  resetStreaming: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedChatId: null,
  streamingContent: '',
  isStreaming: false,

  setSelectedChatId: (chatId) => set({ selectedChatId: chatId }),

  setStreamingContent: (content) => set({ streamingContent: content }),

  setIsStreaming: (isStreaming) => set({ isStreaming }),

  resetStreaming: () => set({ streamingContent: '', isStreaming: false }),
}));

