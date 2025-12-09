import type { LucideIcon } from "lucide-react";
import type { Attachment } from "@/types/chat.types";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  attachments?: Attachment[];
}

export interface Suggestion {
    icon?: LucideIcon;
    title?: string;
    message: string;
}

export interface IChatContext {
  messages: ChatMessage[];
  sendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  suggestions?: Suggestion[];
  transcribe: (audioFile: File) => Promise<string>;
}

// Interface for audio recorder

export type RecordingState = "idle" | "recording" | "processing";

export interface UseAudioRecorderReturn {
  recordingState: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<File | null>;
  recordingTime: number;
}