"use client"

import * as React from "react"
import { Search, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useChats } from "@/hooks/use-chat"
import type { Chat } from "@/types/chat.types"

interface SearchChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchChatModal({ open, onOpenChange }: SearchChatModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const { chats } = useChats()
  const navigate = useNavigate()

  // Recherche dans les messages des chats
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const results: Array<{ chat: Chat; matchedMessage: string }> = []

    chats.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (message.content.toLowerCase().includes(query)) {
          results.push({
            chat,
            matchedMessage: message.content,
          })
        }
      })
    })

    return results
  }, [searchQuery, chats])

  const handleSelectChat = (chatId: string) => {
    navigate(`/chat/${chatId}`)
    onOpenChange(false)
    setSearchQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Rechercher des chats...</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher des chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {searchQuery.trim() === "" ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Commencez à taper pour rechercher dans vos chats...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Aucun résultat trouvé
              </div>
            ) : (
              searchResults.map((result, index) => (
                <button
                  key={`${result.chat._id}-${index}`}
                  onClick={() => handleSelectChat(result.chat._id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1">
                        {result.chat.name}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {result.matchedMessage}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

