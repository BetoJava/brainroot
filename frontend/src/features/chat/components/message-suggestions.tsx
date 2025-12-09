"use client";

import { useChatContext } from "./chat-context";
import { Button } from "@/components/ui/button";
import type { Suggestion } from "../types/chat.types";
import type { LucideIcon } from "lucide-react";

export function MessageSuggestions() {
  const { sendMessage, isLoading, suggestions } = useChatContext();

  const handleSuggestionClick = async (message: string) => {
    if (isLoading) return;
    await sendMessage(message);
  };

  if (!suggestions) return null;

  return (
    <div className="mb-4">
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
        Suggestions pour commencer
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions?.map((suggestion: Suggestion, index: number) => {
          const Icon = suggestion.icon as LucideIcon;
          return (
            <Button
              key={index}
              variant="outline"
              className="h-auto justify-start p-4 text-left"
              onClick={() => handleSuggestionClick(suggestion.message)}
              disabled={isLoading}
            >
              <div className="flex items-start gap-3">
                {suggestion.icon && <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />}
                <div className="flex-1 space-y-1">
                  {suggestion.title && <p className="text-sm font-medium">{suggestion.title}</p>}
                  <p className="text-xs text-muted-foreground truncate">
                    {suggestion.message}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
