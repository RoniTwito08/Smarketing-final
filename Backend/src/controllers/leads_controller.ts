import { Request, Response } from "express";
import LeadModel , { Lead } from "../models/leads_models";


// Create a new lead
export const createLead = async (req: Request, res: Response) => {
    try {
        const leadData: Lead = req.body;
        const newLead = new LeadModel(leadData);
        await newLead.save();
        res.status(201).json(newLead);
    } catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all leads
export const getAllLeads = async (req: Request, res: Response) => {
    try {
        const leads = await LeadModel.find();
        res.status(200).json(leads);
    } catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a lead
export const deleteLead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await LeadModel.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting lead:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a lead
export const updateLead = async (req: Request, res: Response) : Promise<void> => {
    try {
        const { id } = req.params;
        const updatedLeadData: Lead = req.body;
        const updatedLead = await LeadModel.findByIdAndUpdate(id, updatedLeadData, { new: true });
        if (!updatedLead) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }
        res.status(200).json(updatedLead);
    } catch (error) {
        console.error("Error updating lead:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserLeads = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const leads = await LeadModel.find({ userId });
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching user leads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




