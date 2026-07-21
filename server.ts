import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Initialize Gemini client (Lazy initialization to prevent crash on startup if key is missing)
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("GEMINI_API_KEY environment variable is not configured.");
      }
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // API: Get AI Stock Pro Analysis
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { symbol, name, price, change, stats } = req.body;
      const client = getGeminiClient();

      const prompt = `You are a Senior Financial Analyst and Technical Trader. Provide a professional financial analysis and market outlook for the following symbol:
      Symbol: ${symbol}
      Name: ${name}
      Current Price: ${price}
      Change: ${change}
      Key Statistics: ${JSON.stringify(stats)}

      Generate:
      1. A professional summary narrative (2-3 sentences) analyzing why this asset is showing its current performance.
      2. Technical levels analysis: Support & Resistance zones.
      3. Volume Profile key takeaway.
      4. Indicator analysis (comment on RSI, Moving Averages).
      5. Recommended Rating (e.g. STRONG BUY, BUY, NEUTRAL, SELL, STRONG SELL) and estimated 12-month target range.
      6. A list of 3 highly realistic, relevant, simulated fresh news headlines for this asset, including title, source, sentiment (positive/neutral/negative), and a short 1-sentence description. Make them sound very professional, like Bloomberg, Reuters, or CNBC.

      Output must be structured as JSON matching the schema precisely.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "A professional narrative summary of the current stock situation.",
              },
              proAnalysis: {
                type: Type.OBJECT,
                properties: {
                  supportAndResistance: {
                    type: Type.STRING,
                    description: "Key Support and Resistance technical levels.",
                  },
                  volumeProfile: {
                    type: Type.STRING,
                    description: "Key volume profile takeaway.",
                  },
                  indicators: {
                    type: Type.STRING,
                    description: "Moving averages and RSI technical assessment.",
                  },
                },
                required: ["supportAndResistance", "volumeProfile", "indicators"],
              },
              rating: {
                type: Type.STRING,
                description: "The technical action rating: STRONG BUY, BUY, NEUTRAL, SELL, or STRONG SELL.",
              },
              targetPriceRange: {
                type: Type.STRING,
                description: "Target range, e.g. '$5,950 - $6,100'.",
              },
              news: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    source: { type: Type.STRING },
                    sentiment: { type: Type.STRING, description: "positive, neutral, or negative" },
                    summary: { type: Type.STRING },
                  },
                  required: ["title", "source", "sentiment", "summary"],
                },
                description: "Three fresh realistic market news stories.",
              },
            },
            required: ["summary", "proAnalysis", "rating", "targetPriceRange", "news"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini.");
      }

      res.setHeader("Content-Type", "application/json");
      res.send(responseText);
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({
        error: error.message || "Failed to generate AI analysis",
        fallback: true,
      });
    }
  });

  // Serve static files / Vite Dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
