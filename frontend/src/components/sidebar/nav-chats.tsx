"use client"

import * as React from "react"
import {
  Edit,
  MoreHorizontal,
  Trash2,
  MessageCircle,
  ChevronRight,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useChats } from "@/hooks/use-chat"

export function NavChats() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()
  const { chats, deleteChat, renameChat } = useChats()
  
  // Extraire le chatId de l'URL
  const chatId = React.useMemo(() => {
    const match = location.pathname.match(/^\/chat\/([^/]+)/)
    return match ? match[1] : undefined
  }, [location.pathname])

  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedChatId, setSelectedChatId] = React.useState<string>("")
  const [newName, setNewName] = React.useState("")

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`)
  }

  const handleRenameClick = (chatId: string, currentName: string) => {
    setSelectedChatId(chatId)
    setNewName(currentName)
    setRenameDialogOpen(true)
  }

  const handleRenameConfirm = () => {
    if (selectedChatId && newName.trim()) {
      renameChat({ chatId: selectedChatId, name: newName.trim() })
      setRenameDialogOpen(false)
      setNewName("")
      setSelectedChatId("")
    }
  }

  const handleDeleteClick = (chatId: string) => {
    setSelectedChatId(chatId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedChatId) {
      const deletedChatId = selectedChatId
      deleteChat(selectedChatId)
      setDeleteDialogOpen(false)
      setSelectedChatId("")
      // Rediriger vers /chat après suppression si c'était la conversation sélectionnée
      if (deletedChatId === chatId) {
        navigate("/chat")
      }
    }
  }

  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="flex w-full items-center">
              Chats
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat._id}>
                  <SidebarMenuButton 
                    onClick={() => handleChatClick(chat._id)}
                    isActive={chatId === chat._id}
                    className={chatId === chat._id ? "bg-muted text-foreground" : ""}
                  >
                    <MessageCircle />
                    <span>{chat.name}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">Plus</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem
                        onClick={() => handleRenameClick(chat._id, chat.name)}
                      >
                        <Edit className="text-muted-foreground" />
                        <span>Renommer</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(chat._id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="text-destructive" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer le chat</DialogTitle>
            <DialogDescription>
              Entrez un nouveau nom pour ce chat
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom du chat</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameConfirm()
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleRenameConfirm} disabled={!newName.trim()}>
              Renommer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le chat</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce chat ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

