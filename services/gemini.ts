import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert base64 to the format Gemini expects if needed, 
// though we usually pass inlineData directly.

export const analyzeImage = async (base64Image: string): Promise<{ title: string; description: string; category: string } | null> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return null;
  }

  try {
    // Strip the data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, but could detect
              data: cleanBase64,
            }
          },
          {
            text: "Analyze this image for a Lost & Found board. Provide a concise title, a detailed description, and whether it looks like a lost personal item (e.g. wallet, keys, pet) or something else. Return JSON with keys: title, description, category (suggest 'lost' or 'found' based on context, default to 'lost')."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};