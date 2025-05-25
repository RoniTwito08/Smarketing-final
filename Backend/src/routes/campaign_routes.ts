import express from "express";
import multer from "multer";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  markInterest,
  removeInterest,
  fetchCampaignStatistics,
  launchGoogleAdsCampaign,
  getAllCampaignsByUserId,
} from "../controllers/campaign_controller";

const router = express.Router(); 
const upload = multer({ dest: "uploads/campaign_images" });

router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById); 
router.post("/", upload.single("campaignImage"), createCampaign); 
router.put("/:id", upload.single("campaignImage"), updateCampaign);
router.delete("/:id", deleteCampaign);
router.put("/interest/:campaignId", markInterest);
router.put("/uninterest/:campaignId", removeInterest);
// router.get('/campaigns/:id/statistics', getCampaignStatsFromDb); 
router.post("/google-launch", launchGoogleAdsCampaign);
router.get("/user/:userId", getAllCampaignsByUserId);

export default router;
