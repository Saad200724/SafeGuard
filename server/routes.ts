import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertActivitySchema, insertBlockedSiteSchema, insertChildSchema, insertDeviceSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Children API
  app.get("/api/children", async (req: Request, res: Response) => {
    try {
      const children = await storage.getAllChildren();
      res.json(children);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });

  app.post("/api/children", async (req: Request, res: Response) => {
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

  // Activities API
  app.get("/api/activities/:childId", async (req: Request, res: Response) => {
    try {
      const childId = parseInt(req.params.childId);
      const activities = await storage.getActivitiesByChildId(childId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req: Request, res: Response) => {
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

  // Blocked Sites API
  app.get("/api/blocked-sites/:childId", async (req: Request, res: Response) => {
    try {
      const childId = parseInt(req.params.childId);
      const blockedSites = await storage.getBlockedSitesByChildId(childId);
      res.json(blockedSites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blocked sites" });
    }
  });

  app.post("/api/blocked-sites/:childId", async (req: Request, res: Response) => {
    try {
      const childId = parseInt(req.params.childId);
      const validation = insertBlockedSiteSchema.safeParse({
        ...req.body,
        childId,
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

  app.patch("/api/blocked-sites/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { isActive } = req.body;
      const updatedSite = await storage.updateBlockedSite(id, { isActive });
      res.json(updatedSite);
    } catch (error) {
      res.status(500).json({ message: "Failed to update blocked site" });
    }
  });

  app.delete("/api/blocked-sites/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlockedSite(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blocked site" });
    }
  });

  // Device Settings API
  app.get("/api/device-settings/:childId", async (req: Request, res: Response) => {
    try {
      const childId = parseInt(req.params.childId);
      const settings = await storage.getDeviceSettingsByChildId(childId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch device settings" });
    }
  });

  app.post("/api/device-settings/:childId", async (req: Request, res: Response) => {
    try {
      const childId = parseInt(req.params.childId);
      const validation = insertDeviceSettingsSchema.safeParse({
        ...req.body,
        childId,
      });
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid device settings data", errors: validation.error.errors });
      }
      
      // Check if settings already exist for this child
      const existingSettings = await storage.getDeviceSettingsByChildId(childId);
      
      if (existingSettings) {
        // Update existing settings
        const updatedSettings = await storage.updateDeviceSettings(existingSettings.id, req.body);
        return res.json(updatedSettings);
      }
      
      // Create new settings
      const settings = await storage.createDeviceSettings(validation.data);
      res.status(201).json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to create/update device settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
