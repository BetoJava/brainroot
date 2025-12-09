"use client";

import { useState, useRef, useEffect } from "react";
import { useChatContext } from "./chat-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioRecorder } from "../hooks/use-audio-recorder";
import { toast } from "sonner";
import type { RecordingState } from "../types/chat.types";


export function ChatInputImpl() {
  const { sendMessage, isLoading, transcribe } = useChatContext();
  const { recordingState, startRecording, stopRecording, recordingTime } = useAudioRecorder();

  return (
    <ChatInput
      sendMessage={sendMessage}
      isLoading={isLoading}
      transcribe={transcribe}
      recordingState={recordingState}
      startRecording={startRecording}
      stopRecording={stopRecording}
      recordingTime={recordingTime}
    />
  );
}

export interface ChatInputProps {
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean | undefined;
  transcribe: (audioFile: File) => Promise<string>;
  recordingState: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<File | null>;
  recordingTime: number;
}

export function ChatInput(
  {
    sendMessage,
    isLoading,
    transcribe,
    recordingState,
    startRecording,
    stopRecording,
    recordingTime
  }: ChatInputProps) {


  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Focus automatique sur le textarea au montage du composant
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    const messageContent = input.trim();
    setInput("");
    setIsMultiLine(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "32px";
    }

    await sendMessage(messageContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = (value: string = input) => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Si le texte est vide, revenir à la taille de base
      if (!value.trim()) {
        textarea.style.height = "32px";
        setIsMultiLine(false);
        return;
      }

      // Réinitialiser à 32px pour recalculer
      textarea.style.height = "32px";
      const scrollHeight = textarea.scrollHeight;

      // Si le contenu dépasse 32px, c'est multiline
      const isMulti = scrollHeight > 32;
      setIsMultiLine(isMulti);

      if (isMulti) {
        // En multiline, laisser grandir jusqu'à 120px max
        textarea.style.height = Math.min(scrollHeight, 120) + "px";
      } else {
        // En single line, garder 32px fixe
        textarea.style.height = "32px";
      }
    }
  };

  const handleAudioRecording = async () => {
    if (recordingState === "idle") {
      try {
        await startRecording();
      } catch (error) {
        console.error("Erreur lors du démarrage de l'enregistrement:", error);
        toast.error("Impossible d'accéder au microphone");
      }
    } else if (recordingState === "recording") {
      try {
        setIsTranscribing(true);
        const audioFile = await stopRecording();

        if (!audioFile) {
          toast.error("Erreur lors de l'arrêt de l'enregistrement");
          setIsTranscribing(false);
          return;
        }

        const text = await transcribe(audioFile);

        setInput(prevInput => {
          const separator = prevInput.trim() ? " " : "";
          return prevInput + separator + text;
        });

        if (textareaRef.current) {
          textareaRef.current.focus();
          adjustTextareaHeight();
        }
      } catch (error) {
        console.error("Erreur lors de la transcription:", error);
        toast.error("Erreur lors de la transcription de l'audio");
      } finally {
        setIsTranscribing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", isMultiLine && "flex flex-col")}>
      {/* Zone de saisie - layout adaptatif */}
      <div
        className={cn(
          "relative bg-background flex items-end justify-end gap-2 border-border dark:border-primary border-2 rounded-[1.75rem] p-2 transition-all duration-200",
          isMultiLine && "flex-col items-stretch"
        )}
      >
        {/* Textarea */}
        <div className={cn("relative", !isMultiLine && "flex-1")}>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Posez une question..."
            className={cn(
              "my-0 py-0 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none transition-all duration-200",
              !isMultiLine && "min-h-[32px] pr-12"
            )}
            style={{ height: isMultiLine ? "auto" : "32px" }}
          />
        </div>

        {/* Boutons d'actions */}
        <div
          className={cn(
            "flex items-center gap-1",
            isMultiLine && "self-end"
          )}
        >
          {/* Bouton d'enregistrement audio */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-10 w-10 p-2 rounded-full",
              recordingState === "recording" && "text-red-500 hover:text-red-600"
            )}
            onClick={handleAudioRecording}
            disabled={isTranscribing || isLoading}
            title={
              recordingState === "recording"
                ? `Arrêter l'enregistrement (${recordingTime}s)`
                : "Enregistrer un message vocal"
            }
          >
            {recordingState === "recording" ? (
              <Square className="h-4 w-4 fill-current" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          {/* Bouton d'envoi */}
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading || recordingState === "recording" || isTranscribing}
            className="h-10 w-10 p-2 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}