
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: any;

  constructor() {
    // Correctly initializing GoogleGenAI with the required object parameter and direct access to process.env.API_KEY
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getItinerarySuggestions(destination: string) {
    try {
      // Calling generateContent with the model name directly as per guidelines
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a one-day itinerary for visiting ${destination} in Sabah, Malaysia. Include morning, afternoon, and evening activities. Keep it brief and travel-oriented.`,
      });
      // Accessing text as a property, not a method
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to generate itinerary at this time.";
    }
  }

  async getTravelTips(attraction: string) {
    try {
      // Using gemini-3-flash-preview for general text tasks
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Give me 3 essential travel tips for visiting ${attraction} in Sabah. Consider weather, local customs, and best time to visit.`,
      });
      // Accessing text as a property
      return response.text;
    } catch (error) {
      return "Keep hydrated and check the weather forecast!";
    }
  }
}

export const geminiService = new GeminiService();
