// routes/aiRoutes.ts
import { Router } from "express";
import { postNextQuestion } from "../controllers/aiController";

const router = Router();
router.post("/next-question", postNextQuestion);

export default router;
