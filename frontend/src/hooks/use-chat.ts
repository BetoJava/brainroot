import { chatService } from '@/services/chat.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Attachment, Chat, Message } from '@/types/chat.types';

const CHATS_QUERY_KEY = ['chats'];

export const useChats = () => {

    const queryClient = useQueryClient();

    // GET ALL - avec cache automatique
    const { data: chats = [], isLoading, error } = useQuery({
        queryKey: CHATS_QUERY_KEY,
        queryFn: () => chatService.getAllChats(),
    });

    // GET ONE
    const useChat = (chatId: string) =>
        useQuery({
            queryKey: ['chats', chatId],
            queryFn: () => chatService.getChat(chatId),
            enabled: !!chatId,
        });

    // CREATE
    const createMutation = useMutation({
        mutationFn: (name: string) => chatService.createChat(name),
        onSuccess: (newChat) => {
            // Invalide le cache et refetch automatiquement
            queryClient.setQueryData(CHATS_QUERY_KEY, (old: Chat[]) => [...(old || []), newChat]);
        },
        onError: (error) => {
            console.error('Erreur création:', error);
        },
    });

    // DELETE
    const deleteMutation = useMutation({
        mutationFn: (chatId: string) => chatService.deleteChat(chatId),
        onSuccess: (_, chatId) => {
            queryClient.setQueryData(CHATS_QUERY_KEY, (old: Chat[]) =>
                (old || []).filter((chat) => chat._id !== chatId)
            );
        },
    });

    // RENAME
    const renameMutation = useMutation({
        mutationFn: ({ chatId, name }: { chatId: string; name: string }) =>
            chatService.renameChat(chatId, name),
        onSuccess: (updatedChat, { chatId }) => {
            queryClient.setQueryData(CHATS_QUERY_KEY, (old: Chat[]) =>
                (old || []).map((chat) => (chat._id === chatId ? updatedChat : chat))
            );
        },
    });

    // SEND MESSAGE - avec optimistic update
    const sendMessageMutation = useMutation({
        mutationFn: async ({ 
            chatId, 
            message, 
            attachments,
            onStream 
        }: { 
            chatId: string; 
            message: string; 
            attachments: Attachment[];
            onStream?: (content: string) => void;
        }) => {
            const stream = await chatService.sendMessage(chatId, message, attachments);
            
            // Traiter le stream
            let fullContent = '';
            for await (const chunk of chatService.parseStream(stream)) {
                fullContent += chunk;
                onStream?.(fullContent);
            }
            
            return fullContent;
        },
        onMutate: async ({ chatId, message, attachments }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['chats', chatId] });

            // Snapshot previous value
            const previousChat = queryClient.getQueryData<Chat>(['chats', chatId]);

            // Optimistic update - ajouter le message utilisateur
            if (previousChat) {
                const userMessage: Message = {
                    role: 'user',
                    content: message,
                    createdAt: new Date(),
                    attachments,
                };

                queryClient.setQueryData<Chat>(['chats', chatId], {
                    ...previousChat,
                    messages: [...previousChat.messages, userMessage],
                });
            }

            return { previousChat };
        },
        onSuccess: (_, { chatId }) => {
            // Invalider le cache pour refetch les données à jour depuis le serveur
            queryClient.invalidateQueries({ queryKey: ['chats', chatId] });
        },
        onError: (err, { chatId }, context) => {
            // Rollback optimistic update en cas d'erreur
            if (context?.previousChat) {
                queryClient.setQueryData(['chats', chatId], context.previousChat);
            }
            console.error('Erreur envoi message:', err);
        },
    });

    // Fonction pour invalider le cache d'un chat spécifique
    const invalidateChat = async (chatId: string) => {
        await queryClient.invalidateQueries({ queryKey: ['chats', chatId] });
    };

    return {
        // Queries
        chats,
        isLoading,
        error,
        useChat,

        // Mutations
        createChat: createMutation.mutateAsync,
        deleteChat: deleteMutation.mutate,
        renameChat: renameMutation.mutate,
        sendMessage: sendMessageMutation.mutateAsync,

        // Cache management
        invalidateChat,

        // States
        isCreating: createMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isRenaming: renameMutation.isPending,
        isSending: sendMessageMutation.isPending,
    };
};