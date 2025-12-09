import { relations } from "drizzle-orm";
import { learningConfig, learningData } from "./schemas";
import { projects, chats } from "../../chat/schemas";


export const learningConfigRelations = relations(learningConfig, ({ one }) => ({
  project: one(projects, {
    fields: [learningConfig.projectId],
    references: [projects.id],
  }),
}));

export const learningDataRelations = relations(learningData, ({ one }) => ({
  chat: one(chats, {
    fields: [learningData.chatId],
    references: [chats.id],
  }),
}));

