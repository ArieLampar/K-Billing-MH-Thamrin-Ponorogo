import { pgTable, serial, text, integer, timestamp, date, boolean, jsonb, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccountType } from "next-auth/adapters"

// Enums
export const studentStatusEnum = pgEnum('student_status', ['ACTIVE', 'BREAK']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['PAID', 'UNPAID', 'LATE']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'parent']);

// Auth Tables
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: userRoleEnum('role').default('parent').notNull(),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
)

// Business Tables
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  level: text('level').notNull(),
  subjects: text('subjects').array().notNull(),
  status: studentStatusEnum('status').default('ACTIVE').notNull(),
  joinDate: date('join_date').notNull(),
  parentId: text('parent_id').references(() => users.id), // Link to User
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  amount: integer('amount').notNull(),
  dueDate: date('due_date').notNull(),
  status: invoiceStatusEnum('status').default('UNPAID').notNull(),
  paymentDate: timestamp('payment_date'),
  receiptUrl: text('receipt_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  subject: text('subject').notNull(),
  level: text('level').notNull(),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  minThreshold: integer('min_threshold').notNull().default(5),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  parent: one(users, {
    fields: [students.parentId],
    references: [users.id],
  }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  student: one(students, {
    fields: [invoices.studentId],
    references: [students.id],
  }),
}));
