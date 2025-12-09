import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { ConfigTabProvider } from "@/features/config/config-tab-context"
import ChatPage from "./pages/ChatPage"
import ConfigPage from "./pages/ConfigPage"
import NewChatPage from "./pages/NewChatPage"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Toaster } from "sonner"
import { ChatProviderImpl } from "./features/chat/chat-provider.impl"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <ConfigTabProvider>
          <SidebarProvider>
            <ChatProviderImpl>
              <div className="flex h-screen w-full relative">
                <span className="absolute top-4 right-4 z-1">
                  <ModeToggle />
                </span>
                <AppSidebar />
                <Toaster />
                <main className="flex-1 overflow-auto bg-card">
                  <Routes>
                    <Route path="/" element={<NewChatPage />} />
                    <Route path="/chat" element={<NewChatPage />} />
                    <Route path="/chat/:chatId" element={<ChatPage />} />
                    <Route path="/config" element={<ConfigPage />} />
                  </Routes>
                </main>
              </div>
            </ChatProviderImpl>
          </SidebarProvider>
        </ConfigTabProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App