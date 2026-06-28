import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Wait to initialize AI until requested so we fail gracefully
  let ai: GoogleGenAI | null = null;
  function getAI() {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    }
    return ai;
  }

  // API Route to analyze text
  app.post('/api/analyze', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const client = getAI();

      const systemInstruction = `You are the "Australia WHV (Working Holiday Visa) Intelligence Agent." Your goal is to analyze data from Xiaohongshu (XHS), Reddit, and Facebook to help a user plan a Working Holiday in Australia.

The user's profile: Willing to do hard work, rare driver (needs carpool/public transport options), flexible arrival timing.

Your tasks:
1. Destination Spotting: Identify the exact location, suburb, or farm mentioned.
2. Price Extraction: Find costs for rent, food, or wages mentioned in AUD.
3. Sentiment Analysis: Determine if the creator is "Grass Planting" (recommend) or "Grass Pulling" (warning/avoid). Specifically look for "Red Flags" (避雷).
4. Career Advice: If it's a job post, analyze if it's suitable for "hard work" and if it qualifies for visa extension (88 days).
5. Logistics: Suggest how a non-driver can reach this location.`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: text,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING, description: "Name & Suburb" },
              coordinatesOrAddress: { type: Type.STRING, description: "If available" },
              costs: { type: Type.STRING, description: "AUD amounts for rent, food, or wages" },
              sentimentScore: { type: Type.NUMBER, description: "Score 1-5" },
              sentimentReasoning: { type: Type.STRING, description: "Grass Planting vs Grass Pulling, Red Flags" },
              prosAndCons: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Bullet points of pros and cons"
              },
              hardWorkSuitable: { type: Type.BOOLEAN, description: "Is it suitable for hard work?" },
              visaExtension: { type: Type.BOOLEAN, description: "Does it qualify for the 88 days visa extension?" },
              careerAdvice: { type: Type.STRING, description: "General career advice regarding this post" },
              logistics: { type: Type.STRING, description: "How a non-driver can reach this location" }
            },
            required: ['destination', 'costs', 'sentimentScore', 'sentimentReasoning', 'prosAndCons', 'logistics']
          }
        }
      });

      res.json({ result: response.text ? JSON.parse(response.text) : {} });
    } catch (error: any) {
      console.error("API error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
