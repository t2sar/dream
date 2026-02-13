import { GoogleGenAI, Type } from "@google/genai";
import { Habit, HabitLog } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getHabitSuggestions = async (goal: string): Promise<any[]> => {
  if (!apiKey) {
    console.warn("API Key missing");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 concrete, daily habit suggestions for someone who wants to: "${goal}". 
      Return JSON only. Format: Array of objects with keys: name, description, category (health|productivity|learning|mindfulness|other), icon (lucide icon name e.g. 'Zap', 'Book', 'Dumbbell').`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              icon: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};

export const getExcuseBuster = async (habitName: string): Promise<string> => {
  if (!apiKey) return "Just do 2 minutes of it. Something is better than nothing.";

  const prompt = `
    The user is about to skip their habit: "${habitName}".
    They are feeling lazy or unmotivated.
    Give a concise, "tough love" but encouraging "No Zero Days" counter-argument.
    Suggest a 2-minute micro-version of this habit they can do right now just to keep the streak alive.
    Max 2 sentences.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Do it for 2 minutes. Start now.";
  } catch (error) {
    return "Do it for 2 minutes. Start now.";
  }
};

export const analyzeProgress = async (habits: Habit[], logs: HabitLog): Promise<string> => {
  if (!apiKey) return "Please configure your API Key to get AI insights.";

  const recentLogs = Object.entries(logs)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7);
  
  const habitsList = habits.map(h => h.name).join(", ");
  
  const prompt = `
    You are a motivational habit coach. 
    The user is tracking these habits: ${habitsList}.
    Here is their recent activity (Date: Completed IDs): ${JSON.stringify(recentLogs)}.
    Provide a short, punchy, 2-sentence motivational analysis of their week. 
    Be encouraging but honest. If they are doing well, celebrate it. If not, gentle nudge.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Keep going! Consistency is key.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to analyze progress at the moment.";
  }
};

export const chatWithCoach = async (history: {role: string, content: string}[], userMessage: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";
    
    const context = history.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join('\n');
    const prompt = `
      System: You are t2sar AI, an ethereal and focused habit coaching AI developed for the t2sar dream app. You are concise, philosophical, and helpful.
      Context:
      ${context}
      
      User: ${userMessage}
      Coach:
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "I'm listening.";
    } catch (e) {
      console.error(e);
      return "I'm having trouble connecting to the coaching server.";
    }
}