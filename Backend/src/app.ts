//adam ben david 208298257
//aviv menahem 212292197

import initApp from "./server";
import { app, httpServer } from "./server";
import express from "express";
import path from 'path';
import https from 'https';
import fs from 'fs';
import { initializeSocket } from "./socket";
import cors from 'cors';
import authRoutes from './routes/auth.routes';

initApp()
  .then((app) => {
    const isProduction = process.env.NODE_ENV?.trim().toLowerCase() === 'production';
    console.log(`🔑  isProduction: ${isProduction}`);
    
    let server;
    
    if (isProduction) {
      const httpsOptions = {
        key: fs.readFileSync('/home/cs131/certs/myserver.key'),
        cert: fs.readFileSync('/home/cs131/certs/CSB.crt')
      };
      server = https.createServer(httpsOptions, app);
      // Initialize socket.io with HTTPS server in production
      initializeSocket(server);
    } else {
      server = httpServer;
    }

    app.use(express.static(path.join(__dirname, "../../Client/dist")));
    
    // Add CORS before routes
    app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? 'https://smarketing.cs.colman.ac.il' 
        : 'http://localhost:5173', // Vite's default port
      credentials: true
    }));

    app.use('/api/auth', authRoutes);

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../../Client/dist/index.html"));
    });

    // Error handling middleware
    app.use((err: any, req: any, res: any, next: any) => {
      console.error('Global error handler:', err);
      res.status(500).json({ 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`✅  Server listening on port ${port}`);
      console.log(`Mode: ${process.env.NODE_ENV}`);
      console.log(`Base URL: ${process.env.BASE_URL}`);
    });
  })
  .catch((error) => {
    console.log("❌  Error initializing app:", error);
    process.exit(1);
  });