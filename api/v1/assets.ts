import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { compareDesc } from "date-fns";

dotenv.config();

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export default async function handler(req, res) {
  // CORS first
  const origin = req.headers.origin;
  const allowed = new Set([
    "https://www.wastepaperbasket.ca",
    "https://wastepaperbasket.ca",
    "http://localhost:3000",
  ]);

  if (origin && allowed.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "wpb",
      max_results: 999,
    });

    return res.status(200).json({
      images: result.resources
        .map((img) => ({
          uuid: img.asset_id,
          url: img.secure_url,
          date: new Date(img.created_at),
        }))
        .sort((a, b) => compareDesc(a.date, b.date)),
    });
  } catch (e) {
    return res.status(500).json({ error: "Cloudinary query failed" });
  }
};
