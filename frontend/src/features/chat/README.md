# Requirements
- shadcn/ui

# Installation
```
pnpm add remark-gfm react-syntax-highlighter react-markdown
pnpm add -D @types/react-syntax-highlighter

# Shadcn/ui components used
pnpm dlx shadcn@latest add button textarea avatar empty
```

Then you have to implement the IChatContext Provider.

```tsx
// ChatProviderImpl.tsx
import React from "react";
import { ChatProvider } from "./chat-context";
import type { IChatContext } from "./chat.types";

export function ChatProviderImpl({ children }: { children: React.ReactNode }) 
{
    const messages = // your message list state
    const sendMessage = // your sendingMessage function that update your message list stat
    const isLoading = // your loading state
    const suggestions = //
    const transcribe = // your transcribing function (File) -> (string)

    const value: IChatContext = {
        messages,
        sendMessage,
        isLoading,
        suggestions, // if empty, no suggestions
        transcribe,
    };

    return <ChatProvider value={value}>{children}</ChatProvider>;
}
```

Then use the chat and the provider in your page :

```tsx
// ChatPage.tsx
import { ChatContainer } from "./chat-container";
import { ChatProviderImpl } from "./ChatProviderImpl";

export default function App() {
    return (
        <ChatProviderImpl>
            <ChatContainer />
        </ChatProviderImpl>
    );
}
```

For audio recording, MAX_RECORDING_TIME is set to 120000 by default. It can be edit in hooks/`use-audio-recorder.ts`.

# Base structure
```
chat/
├── components/
│    ├── chat-container.tsx
│    ├── chat-context.tsx
│    ├── chat-input.tsx
│    ├── markdown-renderer.tsx
│    ├── message-bubble.tsx
│    ├── message-list-empty.tsx
│    ├── message-list.tsx
│    └── message-suggestions.tsx
├── hooks/
│    └── use-audio-recorder.ts
├── types/
│    └── chat.types.ts
└── README.md
```

# Custom
- message-list-empty.tsx component "MessageListEmpty"
- message-suggestions.tsx