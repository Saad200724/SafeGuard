import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
});

export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  deviceId: text("device_id").notNull(),
  parentId: integer("parent_id").notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  activityType: text("activity_type").notNull(), // app_usage, blocked_content, location_update, device_status
  title: text("title").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  metadata: jsonb("metadata"),
});

export const blockedSites = pgTable("blocked_sites", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  childId: integer("child_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const deviceSettings = pgTable("device_settings", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  internetAccess: boolean("internet_access").notNull().default(true),
  appInstallation: boolean("app_installation").notNull().default(false),
  screenTimeBonus: boolean("screen_time_bonus").notNull().default(false),
});

// Define relationships between tables
export const usersRelations = relations(users, ({ many }) => ({
  children: many(children),
}));

export const childrenRelations = relations(children, ({ one, many }) => ({
  parent: one(users, {
    fields: [children.parentId],
    references: [users.id],
  }),
  activities: many(activities),
  blockedSites: many(blockedSites),
  deviceSettings: many(deviceSettings),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  child: one(children, {
    fields: [activities.childId],
    references: [children.id],
  }),
}));

export const blockedSitesRelations = relations(blockedSites, ({ one }) => ({
  child: one(children, {
    fields: [blockedSites.childId],
    references: [children.id],
  }),
}));

export const deviceSettingsRelations = relations(deviceSettings, ({ one }) => ({
  child: one(children, {
    fields: [deviceSettings.childId],
    references: [children.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
});

export const insertChildSchema = createInsertSchema(children).pick({
  name: true,
  age: true,
  deviceId: true,
  parentId: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  childId: true,
  activityType: true,
  title: true,
  description: true,
  metadata: true,
});

export const insertBlockedSiteSchema = createInsertSchema(blockedSites).pick({
  url: true,
  childId: true,
  isActive: true,
});

export const insertDeviceSettingsSchema = createInsertSchema(deviceSettings).pick({
  childId: true,
  internetAccess: true,
  appInstallation: true,
  screenTimeBonus: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChild = z.infer<typeof insertChildSchema>;
export type Child = typeof children.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertBlockedSite = z.infer<typeof insertBlockedSiteSchema>;
export type BlockedSite = typeof blockedSites.$inferSelect;

export type InsertDeviceSettings = z.infer<typeof insertDeviceSettingsSchema>;
export type DeviceSettings = typeof deviceSettings.$inferSelect;
