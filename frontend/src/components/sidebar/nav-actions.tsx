"use client"

import * as React from "react"
import { MessageCircle, Search, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SearchChatModal } from "@/components/search-chat-modal"

export function NavActions() {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = React.useState(false)

  const handleNewChat = () => {
    navigate("/chat")
  }

  const handleConfig = () => {
    navigate("/config")
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleNewChat}>
              <MessageCircle />
              <span>Nouveau chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setSearchOpen(true)}>
              <Search />
              <span>Rechercher</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleConfig}>
              <Settings />
              <span>Configuration</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SearchChatModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}

