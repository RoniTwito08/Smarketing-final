import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import fs from "fs";
import path from "path";
//import type { NextApiRequest, NextApiResponse } from "next";

const MARKETING_GEMINI_API_KEY = process.env.MARKETING_GEMINI_API_KEY;
if (!MARKETING_GEMINI_API_KEY) {
  throw new Error("Gemini API key is missing. Please check your .env file.");
}

const genAI = new GoogleGenerativeAI(MARKETING_GEMINI_API_KEY);

export const generateContent = async (prompt: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};

const OUTPUT_DIR = path.join(__dirname, "../pexels_images");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface PexelsPhoto {
  src: { large: string };
}

interface PexelsResponse {
  photos: PexelsPhoto[];
}

export const fetchPexelsImage = async (
  query: string,
  outputPath: string
): Promise<string | null> => {
  try {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const searchImage = async (
      searchQuery: string
    ): Promise<PexelsResponse> => {
      return await axios
        .get<PexelsResponse>("https://api.pexels.com/v1/search", {
          headers: {
            Authorization:
              "87nqmPyRkOfAMAhY7CyQ9xtOcB4k95GvexI5H8cek1ga6SgZLvecvrmN",
          },
          params: {
            query: searchQuery,
            per_page: 20,
            orientation: "landscape",
          },
        })
        .then((response) => response.data);
    };

    let modifiedQuery = query;
    let pexelsData = await searchImage(modifiedQuery);

    if (!pexelsData.photos || pexelsData.photos.length === 0) {
      console.warn(
        `❌ לא נמצאו תמונות עבור השאילתא "${modifiedQuery}", מנסים שאילתא חלופית.`
      );
      modifiedQuery =
        query + " shop exterior, modern design, high quality, bright";
      pexelsData = await searchImage(modifiedQuery);
    }

    if (!pexelsData.photos || pexelsData.photos.length === 0) {
      throw new Error("❌ לא נמצאו תמונות מתאימות.");
    }

    const imageUrl = pexelsData.photos[0].src.large;
    console.log(`✅ נבחרה תמונה: ${imageUrl}`);

    const imageResponse = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(outputPath, Buffer.from(imageResponse.data));
    console.log(`✅ התמונה נשמרה בהצלחה: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error("❌ שגיאה בהבאת תמונה:", error);
    return null;
  }
};


