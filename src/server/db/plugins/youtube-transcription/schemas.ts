import { text, integer } from "drizzle-orm/sqlite-core";
import { generateUUID, now, createTable } from "@/lib/db-utils";
import { messages, projects } from "../../chat/schemas";

export const youtubeConfig = createTable("youtube_config", {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),

    enabled: integer("enabled", { mode: 'boolean' }).notNull().$default(() => true),
    
    transcriptionProvider: text("transcription_provider"),
    transcriptionModel: text("transcription_model"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .$defaultFn(now)
        .notNull(),
});

export const youtubeData = createTable("youtube_data", {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    messageId: text("message_id")
        .notNull()
        .references(() => messages.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    title: text("title").notNull(),
    transcription: text("transcription"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .$defaultFn(now)
        .notNull(),
});