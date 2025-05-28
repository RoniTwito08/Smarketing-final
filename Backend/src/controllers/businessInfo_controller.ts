import businessInfoModel from "../models/businessInfo_models";
import { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";

export const createBusinessInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const formFields = req.body;

    console.log("phone num controller: " + formFields.phoneNumber);

    const logo = files?.logo?.[0]?.path || null;

    // נתיבים של תמונות נוספות (מרובות)
    const businessImages =
      files?.businessImages?.map((file) => file.path) || [];

    let parsedSocialLinks;
    if (formFields.socialLinks) {
      try {
        parsedSocialLinks = JSON.parse(formFields.socialLinks);
      } catch (e) {
        console.error("Could not parse socialLinks:", e);
      }
    }
    // בניית האובייקט לשמירה
    const businessInfo = new businessInfoModel({
      ...formFields,
      userId,
      logo,
      businessImages,
      socialLinks: parsedSocialLinks,
    });

    await businessInfo.save();

    return res.status(201).json({
      message: "Business info created successfully",
      data: businessInfo,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return res
        .status(400)
        .json({ message: "יש למלא את כל השדות", details: messages });
    }
    console.error("Error creating business info:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updateBusinessInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const existing = await businessInfoModel.findOne({ userId });
    if (!existing)
      return res.status(404).json({ message: "Business info not found" });

    const data = req.body;

    if (req.body.socialLinks) {
      if (typeof req.body.socialLinks === "string") {
        try {
          data.socialLinks = JSON.parse(req.body.socialLinks);
        } catch (e) {
          console.error("Failed to parse socialLinks:", e);
          data.socialLinks = undefined;
        }
      } else {
        data.socialLinks = req.body.socialLinks;
      }
    }

    // Handle logo file
    if (req.files && "logoFile" in req.files) {
      const logoFile = req.files["logoFile"][0];
      data.logo = `uploads/business_pictures/${req.files["logoFile"][0].filename}`;
    }

    // Handle multiple business images
    if (req.files && "businessImageFiles" in req.files) {
      const imageFiles = req.files["businessImageFiles"];
      data.businessImages = imageFiles.map(
        (file: Express.Multer.File) =>
          `uploads/business_pictures/${file.filename}`
      );
    }

    const updated = await businessInfoModel.findByIdAndUpdate(
      existing._id,
      data,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Failed to update business info" });
  }
};

export const getBusinessInfoByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const businessInfo = await businessInfoModel.findOne({ userId: id });
    if (!businessInfo) {
      return res.status(404).json({ message: "Business info not found" });
    }
    return res.json({ data: businessInfo });
  } catch (error) {
    console.error("Error retrieving business info:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export default {
  createBusinessInfo,
  updateBusinessInfo,
  getBusinessInfoByUserId,
};
