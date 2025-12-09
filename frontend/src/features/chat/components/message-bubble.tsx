"use client";

import type { ChatMessage } from "../types/chat.types";
import { MarkdownRenderer } from "./markdown-renderer";
import { MessageYouTubeAttachment } from "./message-youtube-attachment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
    message: ChatMessage;
}

const UserBubble = ({ message }: MessageBubbleProps) => {
    const youtubeAttachments = message.attachments?.filter(att => att.type === 'youtube-media') || [];

    return (
        <div className={cn("flex gap-3", "flex-row-reverse")}>
            <Avatar className="h-8 w-8">
                <AvatarFallback>
                    <User className="h-4 w-4" />
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-end">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted text-foreground" >
                    <p className="m-0 pr-4 ">{message.content}</p>
                </div>

                {/* YouTube Attachments */}
                {youtubeAttachments.length > 0 && (
                    <div className="mt-1 w-full max-w-[80%]">
                        {youtubeAttachments.map((attachment) => (
                            <MessageYouTubeAttachment 
                                key={attachment.id} 
                                attachment={attachment}
                                className="ml-auto"
                            />
                        ))}
                    </div>
                )}

                <span className="mt-1 text-xs text-muted-foreground">
                    {/* {message.createdAt.toString()} */}
                    {/* {message.createdAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} */}
                </span>
            </div>
        </div>
    );
};

const AssistantBubble = ({ message }: MessageBubbleProps) => {

    return (
        <div className="flex flex-col items-start py-4">
            {/* Contenu du message */}
            <div className="prose prose-sm max-w-full dark:prose-invert">
                <div className="text-foreground">
                    <MarkdownRenderer content={message.content} />
                </div>
            </div>
        </div>
    );
};

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user";

    if (isUser) {
        return <UserBubble message={message} />;
    } else {
        return <AssistantBubble message={message} />;
    }


}
