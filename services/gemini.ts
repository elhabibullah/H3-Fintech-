import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const generateSupportResponse = async (
  userMessage: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    
    // We construct a chat session with system instructions
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: `You are "Hura", the AI support assistant for H3, a Halal Fintech Neobank application. 
        Your tone is professional, empathetic, and concise.
        
        Key Knowledge:
        - H3 follows Islamic finance principles: No Riba (interest), transparent fees, and ethical investing.
        - You can explain Zakat (2.5% of qualifying wealth held for a lunar year).
        - You help with app navigation: "Pay", "Transfer", "Receive", "Settings".
        
        If a user asks about interest, explain that H3 does not offer interest-based accounts but offers profit-sharing compliant with Sharia.
        Keep answers short and helpful for a mobile chat interface.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I apologize, I couldn't process that request at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the support server. Please try again later.";
  }
};
