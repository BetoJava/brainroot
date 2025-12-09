import { relations } from "drizzle-orm";
import { users, providers, preConfiguredPrompts, defaultModels } from "./schemas";
import { projects, chats } from "../chat/schemas";


export const userRelations = relations(users, ({ many, one }) => ({
  providers: many(providers),
  preConfiguredPrompts: many(preConfiguredPrompts),
  defaultModels: one(defaultModels),
  projects: many(projects),
  chats: many(chats),
}));

export const providerRelations = relations(providers, ({ one, many }) => ({
  user: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
}));

export const preConfiguredPromptsRelations = relations(preConfiguredPrompts, ({ one }) => ({
  user: one(users, {
    fields: [preConfiguredPrompts.userId],
    references: [users.id],
  }),
}));

export const defaultModelsRelations = relations(defaultModels, ({ one }) => ({
  user: one(users, {
    fields: [defaultModels.userId],
    references: [users.id],
  }),
}));