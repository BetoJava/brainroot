"use client"

import * as React from "react"

import { NavActions } from "@/components/sidebar/nav-actions"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavChats } from "@/components/sidebar/nav-chats"
import { NavUser } from "@/components/sidebar/nav-user"
import Logo from "@/components/ui/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"

// This is sample data.
const data = {
  user: {
    name: "BetoJava",
    email: "jbtrognon.fr",
    avatar: "/avatars/betojava.jpg",
  },
  projects: [
    {
      name: "Design Engineering",
      url: "#",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-background">
        <Button variant="ghost" size="icon-sm">
          <Logo size={32} />
        </Button>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavActions />
        <NavProjects projects={data.projects} />
        <NavChats />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
