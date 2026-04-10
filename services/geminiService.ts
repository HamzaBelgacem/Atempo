
import { GoogleGenAI, Type } from "@google/genai";
import { User, Event } from "../types";

const MODEL_NAME = "gemini-3-flash-preview";

export const getEventRecommendations = async (user: User, availableEvents: Event[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    User Preferences: ${user.preferences.join(', ')}.
    Available Events: ${availableEvents.map(e => `${e.title} (${e.category})`).join(', ')}.
    
    Task: Suggest 1 event that best matches. Friendly, max 30 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "¡Explora el mapa para ver qué hay cerca!";
  } catch (error) {
    return "¡Descubre la ciudad en el mapa!";
  }
};

export const getChatbotResponse = async (message: string, userType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = "Eres un guía de Horizon. Ayuda a los usuarios a navegar por la app de forma amable y concisa.";

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: message,
      config: { systemInstruction }
    });
    return response.text || "No entiendo bien, pero aquí estoy para ayudar.";
  } catch (error) {
    return "Error al conectar con la red.";
  }
};
