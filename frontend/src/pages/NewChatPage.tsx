import { useChatStore } from "@/store/chat.store";
import { useChats } from "@/hooks/use-chat";
import { useNavigate } from "react-router-dom";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ChatInput } from "@/features/chat/components/chat-input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { useAudioRecorder } from "@/features/chat/hooks/use-audio-recorder";
import { useChatContext } from "@/features/chat/components/chat-context";
import { FolderPlus } from "lucide-react";

export default function NewChatPage() {
    const { setSelectedChatId } = useChatStore();
    const { createChat, isCreating } = useChats();
    const { isLoading, transcribe } = useChatContext();
    const { recordingState, startRecording, stopRecording, recordingTime } = useAudioRecorder();
    const navigate = useNavigate();

    async function createChatAndSendMessage(message: string) {
        try {
            const newChat = await createChat("Nouveau Chat");
            setSelectedChatId(newChat._id);
            
            // Naviguer vers le nouveau chat avec le message en state
            await navigate(`/chat/${newChat._id}`, { 
                replace: true,
                state: { initialMessage: message }
            });
        } catch (error) {
            console.error("Erreur lors de la création du chat:", error);
            toast.error("Erreur lors de la création du chat");
        }
    }

    const chatInputProps = {
        sendMessage: createChatAndSendMessage,
        isLoading: isLoading,
        transcribe: transcribe,
        recordingState: recordingState,
        startRecording: startRecording,
        stopRecording: stopRecording,
        recordingTime: recordingTime
    }

    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex-1 overflow-hidden relative">
                <div className="h-full w-full pt-24">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Logo />
                            </EmptyMedia>
                            <EmptyTitle>Que voulez-vous faire ?</EmptyTitle>
                            <EmptyDescription>
                                Commencez par créer un projet ou renseignez l'url d'une vidéo youtube pour l'analyser.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <div className="flex gap-2">
                                <Button variant="outline" disabled={isCreating}><FolderPlus /> Create Project</Button>
                            </div>
                        </EmptyContent>
                    </Empty>
                </div>
            </div>
            <div className="relative">
                <div className="absolute bottom-0 left-0 right-0 z-10 mx-auto max-w-3xl">
                    <div className="w-full h-full bg-gradient-to-b from-transparent from-40% to-background to-40%">
                        {/* <MessageSuggestions /> */}
                        <ChatInput {...chatInputProps} />
                    </div>
                    <div className="bg-background">
                        <p className="text-center text-xs text-muted-foreground py-2">Powered by Brainroot</p>
                    </div>
                </div>
            </div>
        </div>
    );
}