import { relations } from "drizzle-orm";
import { ragConfig } from "./schemas";
import { projects, chats } from "../../chat/schemas";


export const ragConfigRelations = relations(ragConfig, ({ one }) => ({
  project: one(projects, {
    fields: [ragConfig.projectId],
    references: [projects.id],
  }),
}));

