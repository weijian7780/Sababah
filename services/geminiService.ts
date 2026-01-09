
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: any;
  private cache: Map<string, { data: any, timestamp: number }> = new Map();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private getCached(key: string) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp < this.CACHE_TTL)) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getLiveStatus(attraction: string, location: string) {
    const cacheKey = `status_${attraction}_${location}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a real-time status update for ${attraction} in ${location}, Sabah. 
        Analyze current crowd levels and local weather. 
        Choose one status: 
        1. "Good" (if crowd is moderate/quiet and weather is clear)
        2. "Busy" (if crowd is high or holiday peak)
        3. "Alert" (if there is rain, storm, or maintenance).
        
        Format as JSON: { "status": "Good" | "Busy" | "Alert", "label": "e.g. Moderate crowd", "emoji": "🟢" | "🔴" | "⛈️" }`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              label: { type: Type.STRING },
              emoji: { type: Type.STRING }
            },
            required: ["status", "label", "emoji"]
          }
        },
      });
      const data = JSON.parse(response.text.trim());
      this.setCache(cacheKey, data);
      return data;
    } catch (error: any) {
      console.error("Gemini Status Error:", error);
      const fallback = { 
        status: attraction.includes('Museum') ? "Good" : "Busy", 
        label: "Estimate: Moderate traffic", 
        emoji: "⚡" 
      };
      return fallback;
    }
  }

  async getHotspotIntel(hotspotLabel: string, parentAttraction: string) {
    const cacheKey = `intel_${hotspotLabel}_${parentAttraction}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a tactical field guide. Provide a "Classified Intel Briefing" for the specific point of interest: "${hotspotLabel}" located within "${parentAttraction}" in Sabah. 
        Include:
        1. "Tactical Value": Why this spot is significant.
        2. "Field Notes": A hidden fact or secret tip.
        3. "Environmental Intel": Best time to view or a unique characteristic.
        Keep the tone professional, technical, and high-tech. Avoid flowery language. Max 60 words total.`,
      });
      const data = response.text;
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      return "DATA CORRUPTION: Unable to reach satellite link. Field observation suggests high historical significance. Maintain awareness of terrain gradients.";
    }
  }

  async getTravelTips(attraction: string) {
    const cacheKey = `tips_${attraction}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Give me 3 essential travel tips for visiting ${attraction} in Sabah. Consider weather, local customs, and best time to visit.`,
      });
      const data = response.text;
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      return "Plan your visit during early morning hours for the best experience. Don't forget to stay hydrated!";
    }
  }

  async generateDetailedItinerary(days: number, style: string, budget: string) {
    try {
      const prompt = `Act as a professional Sabah travel guide. Create a detailed ${days}-day itinerary for Sabah with a ${style} focus and a ${budget} budget. 
      For each day, provide exactly 3 activities (Morning, Afternoon, Evening). 
      Format the response as a JSON array of objects following this structure:
      [
        {
          "day": 1,
          "theme": "Introduction to Kota Kinabalu",
          "activities": [
            { "time": "Morning", "title": "Activity Name", "description": "Brief 15-word description" },
            { "time": "Afternoon", "title": "Activity Name", "description": "Brief 15-word description" },
            { "time": "Evening", "title": "Activity Name", "description": "Brief 15-word description" }
          ]
        }
      ]`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                theme: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["time", "title", "description"]
                  }
                }
              },
              required: ["day", "theme", "activities"]
            }
          }
        }
      });

      return JSON.parse(response.text.trim());
    } catch (error) {
      console.error("Gemini Itinerary Error:", error);
      throw error;
    }
  }

  async getLocationDetails(attraction: string, city: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide real-world location details for ${attraction} in ${city}, Sabah. Include travel directions, accessibility info, and nearby transportation hubs.`,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });
      
      return {
        text: response.text,
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (error) {
      return { 
        text: `The ${attraction} is centrally located in ${city}, Sabah and easily accessible.`,
        groundingChunks: [] 
      };
    }
  }
}

export const geminiService = new GeminiService();
