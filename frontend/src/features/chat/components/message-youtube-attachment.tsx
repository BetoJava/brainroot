"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Attachment } from "@/types/chat.types";
import { Link } from "react-router-dom";

interface YouTubeMediaData {
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  transcription: string;
}

interface MessageYouTubeAttachmentProps {
  attachment: Attachment;
  className?: string;
}

export function MessageYouTubeAttachment({
  attachment,
  className
}: MessageYouTubeAttachmentProps) {
  const mediaData = attachment.mediaData as YouTubeMediaData;

  if (!mediaData) {
    return null;
  }

  const formatDuration = (duration: string) => {
    // Convert duration from seconds to MM:SS or HH:MM:SS format
    const seconds = parseInt(duration);
    if (isNaN(seconds)) return duration;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn("mt-2 max-w-md py-4 shadow-none", className)}>
      <CardContent className="px-3">
        <div className="flex gap-3">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0">
            {mediaData.thumbnail ? (
              <img
                src={mediaData.thumbnail}
                alt={mediaData.title}
                className="w-20 h-14 object-cover rounded-md"
              />
            ) : (
              <div className="w-20 h-14 bg-muted rounded-md flex items-center justify-center">
                <Play className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            {/* Duration badge */}
            {mediaData.duration && (
              <div className="absolute bottom-1 left-0 bg-muted text-foreground text-xs px-1 py-0.5 rounded flex items-center gap-1">
                <Clock className="h-2 w-2" />
                {formatDuration(mediaData.duration)}
              </div>
            )}
          </div>

          {/* Content */}
          <Link to={mediaData.url} target="_blank" className="group">
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 mb-1">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:underline">
                  {mediaData.title || "YouTube Video"}
                </h4>
                <ExternalLink className="h-5 w-5 text-muted-foreground mt-1" />
              </div>
              {mediaData.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {mediaData.description}
                </p>
              )}
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
