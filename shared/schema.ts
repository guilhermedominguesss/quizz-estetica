import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  businessName: text("business_name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  niche: text("niche"),
  currentDemand: text("current_demand"),
  onlinePresence: text("online_presence"),
  paidTrafficExperience: text("paid_traffic_experience"),
  mainDifficulty: text("main_difficulty"),
  revenueGoal: text("revenue_goal"),
  radarScore: integer("radar_score"),
  radarData: jsonb("radar_data").$type<Record<string, number>>(),
  createdAt: text("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
