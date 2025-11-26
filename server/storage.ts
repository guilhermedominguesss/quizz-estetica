import { type User, type InsertUser, type Lead, type InsertLead } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leads: Map<string, Lead>;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const lead: Lead = { 
      ...insertLead, 
      id,
      createdAt: now,
    };
    this.leads.set(id, lead);
    
    // Send to Google Sheets
    this.sendToGoogleSheets(lead).catch(err => {
      console.error("Failed to send lead to Google Sheets:", err);
    });
    
    return lead;
  }

  private async sendToGoogleSheets(lead: Lead): Promise<void> {
    const googleSheetUrl = "https://script.google.com/macros/s/AKfycby1KlxzZLzad2ttvMMLOsGSmi-4IBkc4dytik-8MD6vQGzRT7cGf91caAXMxQ0L0zOA/exec";
    
    // Log para debug
    console.log("Enviando lead para Google Sheets:", {
      name: lead.name,
      businessName: lead.businessName,
      whatsapp: lead.whatsapp,
      radarScore: lead.radarScore
    });
    
    const payload = {
      name: lead.name,
      businessName: lead.businessName,
      whatsapp: lead.whatsapp,
      niche: lead.niche || "",
      currentDemand: lead.currentDemand || "",
      onlinePresence: lead.onlinePresence || "",
      paidTrafficExperience: lead.paidTrafficExperience || "",
      mainDifficulty: lead.mainDifficulty || "",
      revenueGoal: lead.revenueGoal || "",
      radarScore: lead.radarScore || 0,
      createdAt: lead.createdAt,
    };

    try {
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Lead sent to Google Sheets:", lead.name);
    } catch (error) {
      console.error("Error sending to Google Sheets:", error);
    }
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }
}

export const storage = new MemStorage();
