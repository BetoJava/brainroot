"use client";

import { MessageList } from "./message-list";
import { ChatInputImpl } from "./chat-input";
import { MessageSuggestions } from "./message-suggestions";
import { useChatContext } from "./chat-context";

export function ChatContainer() {
  const { messages, isLoading } = useChatContext();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full">
          <MessageList messages={messages} isLoading={isLoading ?? false} />
        </div>
      </div>
      <div className="relative">
        <div className="absolute bottom-0 left-0 right-0 z-10 mx-auto max-w-3xl">
          <div className="w-full h-full bg-gradient-to-b from-transparent from-40% to-background to-40%">
            {messages.length === 0 && <MessageSuggestions />}
            <ChatInputImpl />
          </div>
          <div className="bg-background">
            <p className="text-center text-xs text-muted-foreground py-2">Powered by Brainroot</p>
          </div>
        </div>
      </div>
    </div>
  );
}
