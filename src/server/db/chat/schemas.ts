import { text, integer, type AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { generateUUID, now, createTable } from "@/lib/db-utils";
import { users } from "../user/schemas";


// --- TABLE PROJECTS ---
export const projects = createTable("projects", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  defaultProviderName: text("default_provider_name"),
  defaultModelName: text("default_model_name"),
  systemPrompt: text("system_prompt"),
  subChatSystemPrompt: text("sub_chat_system_prompt"),
  createdAt: integer("created_at", { mo de: "timestamp" })
    .$defaultFn(now)
    .notNull(),
});


// --- TABLE CHATS ---
export const chats = createTable("chats", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(now)
    .notNull(),
});

// --- TABLE SUB CHATS ---
export const subChats = createTable("sub_chats", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  messageId: text("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  chatId: text("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  startIndex: integer("start_index").notNull(),
  endIndex: integer("end_index").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(now)
    .notNull(),
});


// --- TABLE MESSAGES ---
export const messages = createTable("messages", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  chatId: text("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content"),
  parentMessageId: text("parent_message_id").references((): AnySQLiteColumn => messages.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(now)
    .notNull(),
});

// --- TABLE MESSAGE ATTACHMENTS ---
export const messageAttachments = createTable("message_attachments", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  messageId: text("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(), // Nom d'origine du fichier
  fileType: text("file_type").notNull(), // ex: "image/png", "audio/wav"
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(now)
    .notNull(),
});

// --- TABLE SUB MESSAGES ---
export const subMessages = createTable("sub_messages", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  subChatId: text("sub_chat_id")
    .notNull()
    .references(() => subChats.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(now)
    .notNull(),
});
