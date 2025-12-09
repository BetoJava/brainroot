import { text, integer } from "drizzle-orm/sqlite-core";
import { generateUUID, now, createTable } from "@/lib/db-utils";


// --- TABLE USERS ---
export const users = createTable("users", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(now)
    .notNull(),
});

// --- TABLE PROVIDERS ---
export const providers = createTable("providers", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // ex: "openai"
  apiKey: text("api_key"), // 🔐 clé chiffrée
  activeModels: text("active_models", { mode: "json" }).$type<string[]>().notNull().$defaultFn(() => []),
});

// --- TABLE DEFAULT MODELS ---
export const defaultModels = createTable("default_models", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  llmModel: text("llm_model"),
  sttModel: text("stt_model"),
  embeddingModel: text("embedding_model"),
  whisperPrompt: text("whisper_prompt"),
});

export const preConfiguredPrompts = createTable("pre_configured_prompts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  content: text("content").notNull(),
});