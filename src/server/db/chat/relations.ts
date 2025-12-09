import { relations } from "drizzle-orm";
import { messages, chats, projects, messageAttachments, subMessages, subChats } from "./schemas";
import { users } from "../user/schemas";


export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  subChats: many(subChats),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
  subChats: many(subChats),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
  parent: one(messages, {
    fields: [messages.parentMessageId],
    references: [messages.id],
  }),
  children: many(messages),
  attachments: many(messageAttachments),
  subChats: many(subChats),
}));

export const messageAttachmentsRelations = relations(messageAttachments, ({ one }) => ({
  message: one(messages, {
    fields: [messageAttachments.messageId],
    references: [messages.id],
  }),
}));

export const subMessagesRelations = relations(subMessages, ({ one }) => ({
  subChat: one(subChats, {
    fields: [subMessages.subChatId],
    references: [subChats.id],
  }),
}));

export const subChatsRelations = relations(subChats, ({ one, many }) => ({
  project: one(projects, {
    fields: [subChats.projectId],
    references: [projects.id],
  }),
  message: one(messages, {
    fields: [subChats.messageId],
    references: [messages.id],
  }),
  chat: one(chats, {
    fields: [subChats.chatId],
    references: [chats.id],
  }),
  subMessages: many(subMessages),
}));