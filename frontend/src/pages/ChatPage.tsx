import { ChatContainer } from "@/features/chat/components/chat-container";

import { useChatStore } from "@/store/chat.store";
import { useChats } from "@/hooks/use-chat";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useChatContext } from "@/features/chat/components/chat-context";

export default function ChatPage() {
  const { chatId } = useParams();
  const location = useLocation();
  const { setSelectedChatId } = useChatStore();
  const { createChat, isCreating, useChat } = useChats();
  const { sendMessage } = useChatContext();
  const navigate = useNavigate();
  const hasCreatedRef = useRef(false);
  const hasSentInitialMessageRef = useRef(false);

  // Récupérer le message initial depuis le state de navigation
  const initialMessage = location.state?.initialMessage as string | undefined;

  // Récupérer les données du chat
  const { data: currentChat, isLoading: isChatLoading } = useChat(chatId || '');

  // Gérer la sélection du chat ou la création d'un nouveau chat
  useEffect(() => {
    if (chatId) {
      // Si un chatId est fourni, le sélectionner
      setSelectedChatId(chatId);
    } else if (!hasCreatedRef.current) {
      // Si pas de chatId, créer un nouveau chat et naviguer vers lui
      hasCreatedRef.current = true;

      const initNewChat = async () => {
        try {
          const newChat = await createChat("New Chat");
          navigate(`/chat/${newChat._id}`, { replace: true });
        } catch (error) {
          console.error("Erreur lors de la création du chat:", error);
          hasCreatedRef.current = false;
        }
      };

      initNewChat();
    }
  }, [chatId, setSelectedChatId, createChat, navigate]);

  // Envoyer le message initial une fois que le chat est chargé
  useEffect(() => {
    if (
      initialMessage && 
      !hasSentInitialMessageRef.current && 
      currentChat && 
      !isChatLoading
    ) {
      hasSentInitialMessageRef.current = true;
      
      const sendInitialMessage = async () => {
        try {
          console.log("Sending initial message:", initialMessage);
          await sendMessage(initialMessage);
          console.log("Initial message sent successfully");
          
          // Nettoyer le state de navigation
          navigate(location.pathname, { replace: true, state: {} });
        } catch (error) {
          console.error("Erreur lors de l'envoi du message initial:", error);
          hasSentInitialMessageRef.current = false;
        }
      };

      sendInitialMessage();
    }
  }, [initialMessage, currentChat, isChatLoading, sendMessage, navigate, location.pathname]);

  // Afficher un loader pendant la création
  if (!chatId && isCreating) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ChatContainer />
  );
}