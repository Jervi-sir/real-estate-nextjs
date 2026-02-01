import {
    sqliteTable,
    text,
    integer,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    passwordPlaintext: text("password_plaintext"),
    role: text("role", { enum: ["USER", "ADMIN"] }).default("USER").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    // Drizzle sqlite uses .default(sql`(CURRENT_TIMESTAMP)`) for text timestamps, but for integer mode?
    // Let's use .$defaultFn(() => new Date()) for simplistic client-side default or check docs.
    // Actually `default(sql`(unixepoch())`)` works for integer.
    // But easiest is just `.default(new Date())` not supported in schema def directly often.
    // simple `.default(sql`(strftime('%s', 'now'))`)`?
    // Let's just use `$defaultFn(() => new Date())` to be safe and cross-env compatible without SQL helper import complexity right now.
});

// Re-add defaultFn for dates
const timestamp = (name: string) => integer(name, { mode: "timestamp" }).$defaultFn(() => new Date());

export const properties = sqliteTable("property", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    address: text("address").notNull(),
    imageUrls: text("image_urls", { mode: "json" }).$type<string[]>().notNull(),
    status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED", "DRAFT"] }).default("PENDING").notNull(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

export const passwordResetTokens = sqliteTable("password_reset_token", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;

