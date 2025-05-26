import express from "express";
import { createLead, getAllLeads, deleteLead, updateLead , getUserLeads } from "../controllers/leads_controller";

const router = express.Router();

// Create a new lead
router.post("/createLead", createLead);

// Get all leads
router.get("/getAllLeads", getAllLeads);

// Delete a lead
router.delete("/deleteLead/:id", deleteLead);

// Update a lead
router.put("/updateLead/:id", updateLead);

// Get leads for a specific user
router.get("/getUserLeads/:userId", getUserLeads);

export default router;