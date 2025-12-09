import { users, providers, defaultModels } from "./schemas";

export type User = typeof users.$inferSelect;
export type Provider = typeof providers.$inferSelect;
export type DefaultModel = typeof defaultModels.$inferSelect;