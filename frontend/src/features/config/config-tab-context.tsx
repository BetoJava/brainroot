import { createContext, useContext, useState, type ReactNode } from "react"

type ConfigTabValue = "general" | "providers" | "models"

interface ConfigTabContextType {
  activeTab: ConfigTabValue
  setActiveTab: (tab: ConfigTabValue) => void
}

const ConfigTabContext = createContext<ConfigTabContextType | undefined>(undefined)

export function ConfigTabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<ConfigTabValue>("general")

  return (
    <ConfigTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ConfigTabContext.Provider>
  )
}

export function useConfigTab() {
  const context = useContext(ConfigTabContext)
  if (context === undefined) {
    throw new Error("useConfigTab must be used within a ConfigTabProvider")
  }
  return context
}
