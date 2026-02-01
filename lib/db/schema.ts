import {
    pgTable,
    serial,
    text,
    integer,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const statusEnum = pgEnum("status", ["PENDING", "APPROVED", "REJECTED", "DRAFT"]);

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    passwordPlaintext: text("password_plaintext"),
    role: roleEnum("role").default("USER").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const properties = pgTable("property", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    address: text("address").notNull(),
    imageUrls: text("image_urls").array().notNull(),
    status: statusEnum("status").default("PENDING").notNull(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
