import type { IdeaSoundConfig } from "@/types/shape";
import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    jsonb,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable(
    "users",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        email: text("email").notNull(),
        emailVerified: boolean("email_verified").notNull().default(false),
        image: text("image"),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
    },
    (table) => ({
        emailUniqueIndex: uniqueIndex("users_email_unique").on(table.email),
    }),
);

export const session = pgTable(
    "sessions",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
        token: text("token").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => ({
        tokenUniqueIndex: uniqueIndex("sessions_token_unique").on(table.token),
        userIdIndex: index("sessions_user_id_idx").on(table.userId),
    }),
);

export const account = pgTable(
    "accounts",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at", {
            withTimezone: true,
            mode: "date",
        }),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
            withTimezone: true,
            mode: "date",
        }),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
    },
    (table) => ({
        providerAccountUniqueIndex: uniqueIndex("accounts_provider_account_unique").on(
            table.providerId,
            table.accountId,
        ),
        userIdIndex: index("accounts_user_id_idx").on(table.userId),
    }),
);

export const verification = pgTable(
    "verifications",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
    },
    (table) => ({
        identifierIndex: index("verifications_identifier_idx").on(table.identifier),
    }),
);

export const idea = pgTable(
    "ideas",
    {
        id: uuid("id").primaryKey(),
        ownerUserId: text("owner_user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        title: varchar("title", { length: 120 }).notNull(),
        config: jsonb("config").$type<IdeaSoundConfig>().notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
    },
    (table) => ({
        ownerUpdatedIndex: index("ideas_owner_updated_idx").on(table.ownerUserId, table.updatedAt),
    }),
);

export const userRelations = relations(user, ({ many }) => ({
    accounts: many(account),
    sessions: many(session),
    ideas: many(idea),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const ideaRelations = relations(idea, ({ one }) => ({
    owner: one(user, {
        fields: [idea.ownerUserId],
        references: [user.id],
    }),
}));

export const schema = {
    user,
    session,
    account,
    verification,
    idea,
    userRelations,
    sessionRelations,
    accountRelations,
    ideaRelations,
};
