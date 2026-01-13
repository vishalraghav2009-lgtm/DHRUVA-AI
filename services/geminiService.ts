
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, Stock } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeMarketTrend = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As an expert financial analyst, provide a brief, professional, and probability-based analysis for: ${query}. 
      Use clear language, highlight potential opportunities/risks, and explicitly state this is not financial advice.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating analysis. Please try again.";
  }
};

export const fetchStockIntelligence = async (query: string): Promise<Partial<Stock> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for real-world stock market data for: ${query}. 
      Provide the official ticker symbol, full official legal company name, primary sector, headquarters country, a business description (what the company does), the current CEO/leadership name, and a list of up to 5 key subsidiaries or major investments.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            symbol: { type: Type.STRING },
            name: { type: Type.STRING },
            sector: { type: Type.STRING },
            country: { type: Type.STRING },
            exchange: { type: Type.STRING },
            description: { type: Type.STRING },
            ceo: { type: Type.STRING },
            subsidiaries: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["symbol", "name", "sector", "country", "exchange", "description", "ceo", "subsidiaries"]
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Stock Intelligence Error:", error);
    return null;
  }
};

export const synthesizeMarketPulse = async (newsItems: NewsItem[]) => {
  const newsContext = newsItems.slice(0, 5).map(item => `${item.headline}: ${item.snippet}`).join('\n');
  const prompt = `Based on these recent financial news headlines, provide a 2-sentence "Market Pulse" summary for today. Focus on the overall mood and the single biggest driver. Do not use financial advice. Keep it punchy and institutional: \n${newsContext}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Markets are navigating a complex landscape of regulatory shifts and macroeconomic volatility.";
  } catch (error) {
    console.error("Gemini Pulse Error:", error);
    return "The market shows mixed signals with heavy focus on regulatory changes and tech sector growth.";
  }
};
