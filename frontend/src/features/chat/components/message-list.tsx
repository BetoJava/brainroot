"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat.types";
import { MessageBubble } from "./message-bubble";
import { MessageListEmpty } from "./message-list-empty";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  emptyChild?: React.ReactNode;
}


export function MessageList({ messages, isLoading, emptyChild = MessageListEmpty }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      emptyChild
    );
  }

  return (
    <ScrollArea
      ref={scrollRef}
      className="h-full w-full overflow-y-auto px-4"
    >
      <div className="container max-w-3xl mx-auto space-y-6 pt-6 pb-36">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 rounded-lg bg-muted px-4 py-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
