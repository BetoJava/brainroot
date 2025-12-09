import { text, integer } from "drizzle-orm/sqlite-core";
import { generateUUID, now, createTable } from "@/lib/db-utils";
import { projects } from "../../chat/schemas";

export const ragConfig = createTable("rag_config", {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),

    enabled: integer("enabled", { mode: 'boolean' }).notNull().$default(() => true),
    autoEmbeddingEnabled: integer("auto_embedding_enabled", { mode: 'boolean' }).notNull().$default(() => true),
    embeddingProvider: text("embedding_provider"),
    embeddingModel: text("embedding_model"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .$defaultFn(now)
        .notNull(),
});