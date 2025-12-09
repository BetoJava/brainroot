import { text, integer } from "drizzle-orm/sqlite-core";
import { generateUUID, now, createTable } from "@/lib/db-utils";
import { chats, projects } from "../../chat/schemas";

export const learningConfig = createTable("learning_config", {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),

    enabled: integer("enabled", { mode: 'boolean' }).notNull().$default(() => true),
    itemListingPrompt: text("item_listing_prompt"),
    synthesisPrompt: text("synthesis_prompt"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .$defaultFn(now)
        .notNull(),
});

// --- TABLE LEARNING DATA ---
export const learningData = createTable("learning_data", {
    id: text("id").primaryKey().$defaultFn(generateUUID),
    chatId: text("chat_id")
        .notNull()
        .references(() => chats.id, { onDelete: "cascade" }),
    learnedItems: text("learned_items", { mode: "json" }).$type<string[]>().notNull().$defaultFn(() => []), // list of learned items from the chat
    synthesisContent: text("synthesis_content"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .$defaultFn(now)
        .notNull(),
});