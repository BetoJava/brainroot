import { drizzle } from "drizzle-orm/libsql/node";
import { createClient } from "@libsql/client";
import { schemas, relations } from "./schemas";
import { env } from "@/env";

// Connexion avec libsql
const client = createClient({
  url: env.DATABASE_PATH,
});

// Combine schema and relations for proper typing
const fullSchema = { ...schemas, ...relations };

export const db = drizzle({ client, schema: fullSchema });