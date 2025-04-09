import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
require("dotenv").config();

const app = express();

// CORS setup - cho phép frontend React truy cập
const corsOptions = {
  origin: process.env.URL_REACT,
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Setup view engine and routes
viewEngine(app);
initWebRoutes(app);

// Connect to database
connectDB();

// Start server
const port = process.env.PORT || 9090;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`✅ Backend Node.js is running at http://${host}:${port}`);
});
