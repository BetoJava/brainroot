import React, { useMemo } from "react";
import { ChatProvider } from "./components/chat-context";
import type { IChatContext } from "./types/chat.types";

import { transcriptionService } from "@/services/transcription.service";
import { useChatStore } from "@/store/chat.store";
import { useChats } from "@/hooks/use-chat";
import type { Attachment, Message } from "@/types/chat.types";

import { MessageCircle } from "lucide-react";
import { extractYoutubeUrls, processFirstYoutubeUrl } from "@/services/youtube.service";

export function ChatProviderImpl({ children }: { children: React.ReactNode }) {
    const { selectedChatId, streamingContent, isStreaming, setStreamingContent, setIsStreaming, resetStreaming } = useChatStore();
    const { useChat, sendMessage, isSending, invalidateChat } = useChats();

    // Récupérer le chat sélectionné via React Query
    const { data: currentChat } = useChat(selectedChatId || '');

    const sendMessageFunction = async (message: string) => {
        if (!selectedChatId) {
            throw new Error('No chat selected');
        }

        try {
            // Démarrer le streaming
            setIsStreaming(true);
            setStreamingContent('');
            let attachments: Attachment[] = [];

            // Vérifier s'il y a une URL YouTube dans le message
            console.log('Message:', message);
            const urls = extractYoutubeUrls(message);
            console.log('URLs:', urls);
            if (urls.length > 0) {
                try {
                    const mediaDocument = await processFirstYoutubeUrl(urls[0]);
                    console.log('Media Document:', mediaDocument);
                    attachments.push({
                        id: mediaDocument.id,
                        type: 'youtube-media',
                        mediaData: {
                            title: mediaDocument.title || '',
                            description: mediaDocument.description || '',
                            thumbnail: mediaDocument.thumbnail || '',
                            duration: mediaDocument.duration || '',
                            transcription: mediaDocument.transcription || '',
                        },
                    });

                } catch (youtubeError) {
                    console.error('Erreur lors du traitement YouTube:', youtubeError);
                    // En cas d'erreur YouTube, continuer avec l'envoi du message normal
                }
            }
            await sendMessage({
                chatId: selectedChatId,
                message,
                attachments,
                onStream: (content: string) => {
                    setStreamingContent(content);
                }
            });

            await invalidateChat(selectedChatId);

            // Finaliser le streaming
            resetStreaming();
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            resetStreaming();
        }
    };

    // Combiner les messages du chat avec le message en cours de streaming
    const messages = useMemo(() => {
        const chatMessages = currentChat?.messages ?? [];

        if (isStreaming && streamingContent !== '') {
            const streamingMessage: Message = {
                role: 'assistant',
                content: streamingContent,
                createdAt: new Date(),
                attachments: [],
            };
            return [...chatMessages, streamingMessage];
        }

        return chatMessages;
    }, [currentChat?.messages, isStreaming, streamingContent]);

    const suggestions = [
        {
            icon: MessageCircle,
            title: "Test",
            message: "Réponds 'bonjour monde'",
        }
    ];

    const transcribe = async (audioFile: File): Promise<string> => {
        return await transcriptionService.transcribe(audioFile);
    };

    const value: IChatContext = {
        messages,
        sendMessage: sendMessageFunction,
        isLoading: isSending || isStreaming,
        suggestions,
        transcribe,
    };

    return <ChatProvider value={value}>{children}</ChatProvider>;
}