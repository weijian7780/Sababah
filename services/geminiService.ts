
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getItinerarySuggestions(destination: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a one-day itinerary for visiting ${destination} in Sabah, Malaysia. Include morning, afternoon, and evening activities. Keep it brief and travel-oriented.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to generate itinerary at this time.";
    }
  }

  async getTravelTips(attraction: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Give me 3 essential travel tips for visiting ${attraction} in Sabah. Consider weather, local customs, and best time to visit.`,
      });
      return response.text;
    } catch (error) {
      return "Keep hydrated and check the weather forecast!";
    }
  }

  async getBookingAdvice(attraction: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The user is about to book tickets for ${attraction} in Sabah. Give a one-sentence "Smart Insight" about when to visit or a secret tip to maximize their value. Keep it under 20 words.`,
      });
      return response.text;
    } catch (error) {
      return "Busiest during weekends; morning slots offer the best photography lighting.";
    }
  }
}

export const geminiService = new GeminiService();
