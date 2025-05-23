// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";
var firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};
var app = initializeApp(firebaseConfig);
var db = getFirestore(app);
var FirebaseStorage = class {
  usersCollection = collection(db, "users");
  childrenCollection = collection(db, "children");
  activitiesCollection = collection(db, "activities");
  blockedSitesCollection = collection(db, "blockedSites");
  deviceSettingsCollection = collection(db, "deviceSettings");
  // User operations
  async getUser(id) {
    const userDoc = await getDoc(doc(this.usersCollection, id));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return void 0;
  }
  async getUserByUsername(username) {
    const userQuery = query(
      this.usersCollection,
      where("username", "==", username)
    );
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data();
    }
    return void 0;
  }
  async createUser(user) {
    const userDocRef = doc(this.usersCollection);
    await setDoc(userDocRef, user);
    return {
      ...user,
      id: parseInt(userDocRef.id, 10),
      displayName: user.displayName || null
    };
  }
  // Child operations
  async getChild(id) {
    const childDoc = await getDoc(doc(this.childrenCollection, id));
    if (childDoc.exists()) {
      return childDoc.data();
    }
    return void 0;
  }
  async getAllChildren() {
    const querySnapshot = await getDocs(this.childrenCollection);
    return querySnapshot.docs.map((doc2) => doc2.data());
  }
  async createChild(child) {
    const childDocRef = doc(this.childrenCollection);
    await setDoc(childDocRef, child);
    return { ...child, id: parseInt(childDocRef.id, 10) };
  }
  async updateChild(id, data) {
    const childDocRef = doc(this.childrenCollection, id);
    await updateDoc(childDocRef, data);
    const updatedChildDoc = await getDoc(childDocRef);
    return updatedChildDoc.data();
  }
  async deleteChild(id) {
    const childDocRef = doc(this.childrenCollection, id);
    await deleteDoc(childDocRef);
  }
  // Activity operations
  async getActivity(id) {
    const activityDoc = await getDoc(doc(this.activitiesCollection, id));
    if (activityDoc.exists()) {
      return activityDoc.data();
    }
    return void 0;
  }
  async getActivitiesByChildId(childId) {
    const activityQuery = query(
      this.activitiesCollection,
      where("childId", "==", childId)
    );
    const querySnapshot = await getDocs(activityQuery);
    return querySnapshot.docs.map((doc2) => doc2.data());
  }
  async createActivity(activity) {
    const activityDocRef = doc(this.activitiesCollection);
    await setDoc(activityDocRef, activity);
    return {
      ...activity,
      id: parseInt(activityDocRef.id, 10),
      timestamp: /* @__PURE__ */ new Date(),
      metadata: activity.metadata || null
    };
  }
  // Blocked site operations
  async getBlockedSite(id) {
    const siteDoc = await getDoc(doc(this.blockedSitesCollection, id));
    if (siteDoc.exists()) {
      return siteDoc.data();
    }
    return void 0;
  }
  async getBlockedSitesByChildId(childId) {
    const siteQuery = query(
      this.blockedSitesCollection,
      where("childId", "==", childId)
    );
    const querySnapshot = await getDocs(siteQuery);
    return querySnapshot.docs.map((doc2) => doc2.data());
  }
  async createBlockedSite(site) {
    const siteDocRef = doc(this.blockedSitesCollection);
    await setDoc(siteDocRef, site);
    return {
      ...site,
      id: parseInt(siteDocRef.id, 10),
      isActive: site.isActive !== void 0 ? site.isActive : true
    };
  }
  async updateBlockedSite(id, data) {
    const siteDocRef = doc(this.blockedSitesCollection, id);
    await updateDoc(siteDocRef, data);
    const updatedSiteDoc = await getDoc(siteDocRef);
    return updatedSiteDoc.data();
  }
  async deleteBlockedSite(id) {
    const siteDocRef = doc(this.blockedSitesCollection, id);
    await deleteDoc(siteDocRef);
  }
  // Device settings operations
  async getDeviceSettings(id) {
    const settingsDoc = await getDoc(doc(this.deviceSettingsCollection, id));
    if (settingsDoc.exists()) {
      return settingsDoc.data();
    }
    return void 0;
  }
  async getDeviceSettingsByChildId(childId) {
    const settingsQuery = query(
      this.deviceSettingsCollection,
      where("childId", "==", childId)
    );
    const querySnapshot = await getDocs(settingsQuery);
    if (!querySnapshot.empty) {
      const settingsDoc = querySnapshot.docs[0];
      return settingsDoc.data();
    }
    return void 0;
  }
  async createDeviceSettings(settings) {
    const settingsDocRef = doc(this.deviceSettingsCollection);
    await setDoc(settingsDocRef, settings);
    return {
      ...settings,
      id: parseInt(settingsDocRef.id, 10),
      internetAccess: settings.internetAccess !== void 0 ? settings.internetAccess : true,
      appInstallation: settings.appInstallation !== void 0 ? settings.appInstallation : false,
      screenTimeBonus: settings.screenTimeBonus !== void 0 ? settings.screenTimeBonus : false
    };
  }
  async updateDeviceSettings(id, data) {
    const settingsDocRef = doc(this.deviceSettingsCollection, id);
    await updateDoc(settingsDocRef, data);
    const updatedSettingsDoc = await getDoc(settingsDocRef);
    return updatedSettingsDoc.data();
  }
};
var storage = new FirebaseStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name")
});
var children = pgTable("children", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  deviceId: text("device_id").notNull(),
  parentId: integer("parent_id").notNull()
});
var activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  activityType: text("activity_type").notNull(),
  // app_usage, blocked_content, location_update, device_status
  title: text("title").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  metadata: jsonb("metadata")
});
var blockedSites = pgTable("blocked_sites", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  childId: integer("child_id").notNull(),
  isActive: boolean("is_active").notNull().default(true)
});
var deviceSettings = pgTable("device_settings", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  internetAccess: boolean("internet_access").notNull().default(true),
  appInstallation: boolean("app_installation").notNull().default(false),
  screenTimeBonus: boolean("screen_time_bonus").notNull().default(false)
});
var usersRelations = relations(users, ({ many }) => ({
  children: many(children)
}));
var childrenRelations = relations(children, ({ one, many }) => ({
  parent: one(users, {
    fields: [children.parentId],
    references: [users.id]
  }),
  activities: many(activities),
  blockedSites: many(blockedSites),
  deviceSettings: many(deviceSettings)
}));
var activitiesRelations = relations(activities, ({ one }) => ({
  child: one(children, {
    fields: [activities.childId],
    references: [children.id]
  })
}));
var blockedSitesRelations = relations(blockedSites, ({ one }) => ({
  child: one(children, {
    fields: [blockedSites.childId],
    references: [children.id]
  })
}));
var deviceSettingsRelations = relations(deviceSettings, ({ one }) => ({
  child: one(children, {
    fields: [deviceSettings.childId],
    references: [children.id]
  })
}));
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true
});
var insertChildSchema = createInsertSchema(children).pick({
  name: true,
  age: true,
  deviceId: true,
  parentId: true
});
var insertActivitySchema = createInsertSchema(activities).pick({
  childId: true,
  activityType: true,
  title: true,
  description: true,
  metadata: true
});
var insertBlockedSiteSchema = createInsertSchema(blockedSites).pick({
  url: true,
  childId: true,
  isActive: true
});
var insertDeviceSettingsSchema = createInsertSchema(deviceSettings).pick({
  childId: true,
  internetAccess: true,
  appInstallation: true,
  screenTimeBonus: true
});

// server/routes.ts
async function registerRoutes(app3) {
  app3.get("/api/children", async (req, res) => {
    try {
      const children2 = await storage.getAllChildren();
      res.json(children2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });
  app3.post("/api/children", async (req, res) => {
    try {
      const validation = insertChildSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid child data", errors: validation.error.errors });
      }
      const child = await storage.createChild(validation.data);
      res.status(201).json(child);
    } catch (error) {
      res.status(500).json({ message: "Failed to create child" });
    }
  });
  app3.get("/api/activities/:childId", async (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const activities2 = await storage.getActivitiesByChildId(childId);
      res.json(activities2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  app3.post("/api/activities", async (req, res) => {
    try {
      const validation = insertActivitySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid activity data", errors: validation.error.errors });
      }
      const activity = await storage.createActivity(validation.data);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to create activity" });
    }
  });
  app3.get("/api/blocked-sites/:childId", async (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const blockedSites2 = await storage.getBlockedSitesByChildId(childId);
      res.json(blockedSites2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blocked sites" });
    }
  });
  app3.post("/api/blocked-sites/:childId", async (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const validation = insertBlockedSiteSchema.safeParse({
        ...req.body,
        childId
      });
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid blocked site data", errors: validation.error.errors });
      }
      const blockedSite = await storage.createBlockedSite(validation.data);
      res.status(201).json(blockedSite);
    } catch (error) {
      res.status(500).json({ message: "Failed to create blocked site" });
    }
  });
  app3.patch("/api/blocked-sites/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isActive } = req.body;
      const updatedSite = await storage.updateBlockedSite(id, { isActive });
      res.json(updatedSite);
    } catch (error) {
      res.status(500).json({ message: "Failed to update blocked site" });
    }
  });
  app3.delete("/api/blocked-sites/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlockedSite(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blocked site" });
    }
  });
  app3.get("/api/device-settings/:childId", async (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const settings = await storage.getDeviceSettingsByChildId(childId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch device settings" });
    }
  });
  app3.post("/api/device-settings/:childId", async (req, res) => {
    try {
      const childId = parseInt(req.params.childId);
      const validation = insertDeviceSettingsSchema.safeParse({
        ...req.body,
        childId
      });
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid device settings data", errors: validation.error.errors });
      }
      const existingSettings = await storage.getDeviceSettingsByChildId(childId);
      if (existingSettings) {
        const updatedSettings = await storage.updateDeviceSettings(existingSettings.id, req.body);
        return res.json(updatedSettings);
      }
      const settings = await storage.createDeviceSettings(validation.data);
      res.status(201).json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to create/update device settings" });
    }
  });
  const httpServer = createServer(app3);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app3, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app3.use(vite.middlewares);
  app3.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app3) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app3.use(express.static(distPath));
  app3.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app2 = express2();
app2.use(express2.json());
app2.use(express2.urlencoded({ extended: false }));
app2.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app2);
  app2.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app2.get("env") === "development") {
    await setupVite(app2, server);
  } else {
    serveStatic(app2);
  }
  const port = 5e3;
  server.listen(
    {
      port,
      host: "0.0.0.0"
      // or "127.0.0.1"
      // ⚠️ Removed reusePort
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
