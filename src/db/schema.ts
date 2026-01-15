import { pgTable, serial, text, integer, timestamp, date, boolean, jsonb, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccountType } from "next-auth/adapters"

// -------------------- ENUMS --------------------

export const userRoleEnum = pgEnum('user_role', ['admin', 'assistant', 'parent']);
export const studentStatusEnum = pgEnum('student_status', ['ACTIVE', 'BREAK', 'GRADUATED']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['PAID', 'UNPAID', 'LATE', 'CANCELLED']);
export const assetTypeEnum = pgEnum('asset_type', ['PHOTO', 'VIDEO', 'DOCUMENT']);
export const teachingLevelEnum = pgEnum('enum_teaching_level', ['BAWAH', 'TENGAH', 'ATAS']);
export const worksheetTypeEnum = pgEnum('enum_worksheet_type', ['CLASS', 'HOMEWORK']);
export const worksheetMediaEnum = pgEnum('enum_worksheet_media', ['PHYSICAL', 'TABLET']);
export const worksheetStatusEnum = pgEnum('enum_worksheet_status', ['COMPLETED', 'PENDING']);

// -------------------- AUTH TABLES --------------------

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: userRoleEnum('role').default('parent').notNull(),
  studentId: integer('student_id'),
  teachingLevel: teachingLevelEnum('teaching_level'),
});

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

// -------------------- BUSINESS TABLES --------------------

// 1. Marketing Assets (Independent or refs User)
export const marketingAssets = pgTable('marketing_assets', {
  id: serial('id').primaryKey(),
  title: text('title'),
  imageUrl: text('image_url').notNull(),
  assetType: assetTypeEnum('asset_type').default('PHOTO'),
  visionAnalysis: jsonb('vision_analysis'),
  captions: jsonb('captions'),
  tags: text('tags').array(),
  uploadedBy: text('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Students (Refs User)
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  level: text('level'),
  email: text('email').unique(),
  whatsapp: text('whatsapp').unique(),
  birthDate: date('birth_date'),
  joinDate: date('join_date').notNull(),
  status: studentStatusEnum('status').default('ACTIVE').notNull(),
  parentId: text('parent_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Subjects (Refs Students)
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  currentLevel: text('current_level').notNull(),
  status: text('status').default('ACTIVE'),
});

// 4. Invoices (Refs Students)
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  amount: integer('amount').notNull(),
  dueDate: date('due_date').notNull(),
  status: invoiceStatusEnum('status').default('UNPAID').notNull(),
  paymentDate: timestamp('payment_date'),
  receiptUrl: text('receipt_url'),
  period: text('period'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Worksheet Records (Refs Students, Users, Subjects)
export const worksheetRecords = pgTable('worksheet_records', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  assistantId: text('assistant_id').references(() => users.id),
  subjectId: integer('subject_id').references(() => subjects.id),
  type: worksheetTypeEnum('type').default('CLASS').notNull(),
  media: worksheetMediaEnum('media').default('PHYSICAL').notNull(),
  status: worksheetStatusEnum('status').default('COMPLETED').notNull(),
  pageCount: integer('page_count').notNull().default(0),
  date: date('date').defaultNow().notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Inventory (Independent)
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  subject: text('subject').notNull(),
  level: text('level').notNull(),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  minThreshold: integer('min_threshold').notNull().default(5),
});

// -------------------- RELATIONS --------------------

export const usersRelations = relations(users, ({ one, many }) => ({
  students: many(students, { relationName: 'parentChildren' }),
  linkedStudent: one(students, {
    fields: [users.studentId],
    references: [students.id],
    relationName: 'userProfile'
  }),
  uploadedAssets: many(marketingAssets),
  loggedWorksheets: many(worksheetRecords),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  parent: one(users, {
    fields: [students.parentId],
    references: [users.id],
    relationName: 'parentChildren'
  }),
  userAccount: one(users, {
    fields: [students.id],
    references: [users.studentId],
    relationName: 'userProfile'
  }),
  subjects: many(subjects),
  invoices: many(invoices),
  worksheets: many(worksheetRecords),
}));

export const subjectsRelations = relations(subjects, ({ one }) => ({
  student: one(students, {
    fields: [subjects.studentId],
    references: [students.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  student: one(students, {
    fields: [invoices.studentId],
    references: [students.id],
  }),
}));

export const worksheetRecordsRelations = relations(worksheetRecords, ({ one }) => ({
  student: one(students, {
    fields: [worksheetRecords.studentId],
    references: [students.id],
  }),
  assistant: one(users, {
    fields: [worksheetRecords.assistantId],
    references: [users.id],
  }),
}));

export const marketingAssetsRelations = relations(marketingAssets, ({ one }) => ({
  uploader: one(users, {
    fields: [marketingAssets.uploadedBy],
    references: [users.id],
  }),
}));
