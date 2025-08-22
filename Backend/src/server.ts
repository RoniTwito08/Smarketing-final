import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import http from "http";
import usersRoutes from "./routes/users_routes";
import authRoutes from "./routes/auth_routes";
import chatRoutes from "./routes/chat_routes";
import geminiRoutes from "./routes/gemini_routes";
import businessInfoRoutes from "./routes/businessInfo_routes";
import LandingPageGeneratorRoutes from "./routes/landing_page_builder_routes";
import CampaignRoutes from "./routes/campaign_routes";
import LeadsRoutes from "./routes/leads_routes";
import aiRoutes from "./routes/aiRoutes";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import { initializeSocket } from "./socket";
import marketingRoutes from "./routes/marketingAnalysis_routes";
import fs from "fs";
import "./cron/cronJobs";
import axios from "axios";
import { Request, Response } from "express";

const app = express();
const httpServer = http.createServer(app);

const initApp = (): Promise<Express> => {
  const isProduction =
    process.env.NODE_ENV?.trim().toLowerCase() === "production";

  // הגדרת CORS - חשוב למקם זאת לפני כל נתיב אחר
  app.use(
    cors({
      origin: isProduction
        ? "https://smarketing.cs.colman.ac.il"
        : [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3001",
          ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(
    "/dist",
    express.static(path.join(__dirname, "../../Client/dist"), {
      setHeaders: (res, path) => {
        // מאפשר רק ל־127.0.0.1:3001
        res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3001");
        res.setHeader("Access-Control-Allow-Methods", "GET");
      },
    })
  );

  // טיפול בבקשות preflight
  app.options("*", cors());

  // הגדלת הגודל שאפשר להעביר בבקשות
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // הגדרת נתיבים
  app.use("/users", usersRoutes);
  app.use("/auth", authRoutes);
  app.use("/gemini", geminiRoutes);
  app.use("/business-info", businessInfoRoutes);
  app.use("/marketing", marketingRoutes);
  app.use("/leads", LeadsRoutes);
  app.use("/ai", aiRoutes);

  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
  app.use("/landing-page-generator", LandingPageGeneratorRoutes);
  app.use(
    "/api/pexels_images",
    express.static(path.join(__dirname, "pexels_images"))
  );
  app.use("/campaigns", CampaignRoutes);
  app.use(
    "/uploads/profile_pictures",
    express.static(path.join(__dirname, "../uploads/profile_pictures"))
  );
  app.use(
    "/uploads/business_pictures",
    express.static(path.join(__dirname, "../uploads/business_pictures"))
  );
  app.use("/images", express.static(path.join(__dirname, "../images")));
  app.use("/chat", chatRoutes);
  app.use("/uploads", express.static("uploads"));
  app.use("/test", express.static("."));

  // הגדרת Swagger
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Dev 2025 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
      },
      servers: [
        {
          url: isProduction
            ? "https://smarketing.cs.colman.ac.il"
            : "http://localhost:3000",
          description: isProduction
            ? "Production server"
            : "Development server",
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

  // הפניה מנתיב השורש ל-api-docs
  // app.get("/", (req, res) => {
  //   res.redirect("/api-docs");
  // });

  // שמירת דף נחיתה עם טיפול בשגיאות
  app.post("/api/saveLandingPage", (req: any, res: any) => {
    const {
      html,
      userPrimaryColor,
      userSecondaryColor,
      userTertiaryColor,
      userTextColor,
      userFont,
    } = req.body;
    if (!html) {
      return res.status(400).json({ error: "Missing HTML content" });
    }

    const completeHTML = `${html}`;

    const fileName = `landingPage-${Date.now()}.html`;
    const folderPath = path.join(__dirname, "landingPages");
    const filePath = path.join(folderPath, fileName);

    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating folder:", err);
        return res.status(500).json({ error: "Server error" });
      }

      fs.writeFile(filePath, completeHTML, (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return res.status(500).json({ error: "Server error" });
        }
        res.status(200).json({ message: "Landing page saved", file: fileName });
      });
    });
  });

  app.get("/api/pexels", async (req: Request, res: Response): Promise<void> => {
  const key = process.env.PEXELS_API_KEY || "87nqmPyRkOfAMAhY7CyQ9xtOcB4k95GvexI5H8cek1ga6SgZLvecvrmN";
  if (!key) {
    res.status(500).json({ error: "Missing PEXELS_API_KEY env var" });
    return;
  }

  const q = (req.query.q || "abstract gradient").toString();
  const per_page = Number(req.query.per_page || 60);
  const page = Number(req.query.page || 1);

  const url =
    `https://api.pexels.com/v1/search?` +
    new URLSearchParams({
      query: q,
      orientation: "landscape",
      size: "large",
      per_page: String(per_page),
      page: String(page),
    }).toString();

  try {
    const upstream = await fetch(url, { headers: { Authorization: key } });
    const ct = upstream.headers.get("content-type") || "";
    const text = await upstream.text();

    // אם upstream לא OK – מעבירים הלאה סטטוס ותוכן (JSON או טקסט)
    if (!upstream.ok) {
      res
        .status(upstream.status)
        .type(ct.includes("application/json") ? "application/json" : "text/plain")
        .send(text);
      return;
    }

    // אם זה לא JSON – מחזירים 502 כדי שהקליינט ידע שיש בעיה
    if (!ct.includes("application/json")) {
      res.status(502).type("text/plain").send(`Upstream returned non-JSON: ${ct}`);
      return;
    }

    // JSON תקין
    res.status(200).json(JSON.parse(text));
  } catch (e: any) {
    console.error("Error fetching from Pexels API:", e?.message || e);
    res.status(500).json({ error: "Failed to fetch from Pexels API" });
  }
});

  app.use("/dist", express.static(path.join(__dirname, "../../Client/dist")));
  app.use("/src", express.static(path.join(__dirname, "../../Client/src")));
  app.use("/static", express.static(path.join(__dirname, "public")));
  app.use(
    "/landingPages",
    express.static(path.join(__dirname, "landingPages"))
  );

  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject(new Error("DB_CONNECT is not defined in .env file"));
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          // הפעלת Socket.IO לאחר חיבור למסד הנתונים
          const io = initializeSocket(httpServer);
        
          resolve(app);
        })
        .catch((error) => {
          console.error("Error connecting to MongoDB:", error);
          reject(error);
        });
    }
  });
};

app.use('/landing-page/:landingPageNameFile', (req, res) => {
  const landingPageNameFile = req.params.landingPageNameFile;
  const filePath = path.join(__dirname, 'landingPages', landingPageNameFile);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading landing page file:", err);
      return res.status(404).send("Landing page not found");
    }
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
  });
});

export { app, httpServer };
export default initApp;
