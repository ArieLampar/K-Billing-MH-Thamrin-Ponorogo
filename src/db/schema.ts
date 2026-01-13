import { pgTable, serial, text, integer, timestamp, date, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const studentStatusEnum = pgEnum('student_status', ['ACTIVE', 'BREAK']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['PAID', 'UNPAID', 'LATE']);

// Tables
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  level: text('level').notNull(),
  subjects: text('subjects').array().notNull(), // Using text array for subjects
  status: studentStatusEnum('status').default('ACTIVE').notNull(),
  joinDate: date('join_date').notNull(),
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
export const studentsRelations = relations(students, ({ many }) => ({
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  student: one(students, {
    fields: [invoices.studentId],
    references: [students.id],
  }),
}));
