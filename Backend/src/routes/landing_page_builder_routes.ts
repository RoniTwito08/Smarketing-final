import express from 'express';
import { generateLandingPageContext , getTextSuggestions } from '../controllers/landing_page_builder';
const router = express.Router();

router.post('/generateLandingPageContext', generateLandingPageContext);

router.post('/getTextSuggestions', getTextSuggestions);


export default router;