import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(data);
      res.json({ success: true, lead });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to create lead" });
      }
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json({ success: true, leads });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch leads" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
