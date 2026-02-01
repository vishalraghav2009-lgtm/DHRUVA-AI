
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, Stock, CorporateDeal, PolicyUpdate, GeoImpact } from "../types";

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

export const fetchLiveDeals = async (): Promise<CorporateDeal[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 8 real-world or highly probable near-term global corporate deals (M&A, Partnerships, Investments). Focus on Tech, Energy, and Finance sectors.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['M&A', 'Investment', 'Partnership', 'Order', 'Buyback', 'Demerger'] },
              companies: { type: Type.ARRAY, items: { type: Type.STRING } },
              size: { type: Type.STRING },
              sector: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Risky'] },
              shortTermReaction: { type: Type.STRING },
              longTermImplication: { type: Type.STRING },
              aiInterpretation: { type: Type.STRING },
              affectedStocks: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "type", "companies", "sector", "impact", "shortTermReaction", "longTermImplication", "aiInterpretation", "affectedStocks"]
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : [];
  } catch (error) {
    console.error("Fetch Live Deals Error:", error);
    return [];
  }
};

export const fetchLivePolicies = async (): Promise<PolicyUpdate[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 8 recent or upcoming global financial/regulatory policy updates (focus on USA, India, EU, China). Categories: GST, Budget, Regulation, RBI, Advisory.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['GST', 'Budget', 'Regulation', 'RBI', 'Advisory'] },
              summary: { type: Type.STRING },
              details: { type: Type.STRING },
              impact: { type: Type.STRING },
              date: { type: Type.STRING }
            },
            required: ["title", "category", "summary", "details", "impact", "date"]
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : [];
  } catch (error) {
    console.error("Fetch Live Policies Error:", error);
    return [];
  }
};

export const fetchLiveGeopolitics = async (): Promise<GeoImpact[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 8 significant global geopolitical events affecting markets (Trade, Energy, Supply Chains, Conflict).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              event: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['Geopolitical', 'Trade', 'Energy'] },
              countriesBenefited: { type: Type.ARRAY, items: { type: Type.STRING } },
              sectorsAffected: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunityRisk: { type: Type.STRING, enum: ['Opportunity', 'Risk', 'Both'] },
              analysis: { type: Type.STRING }
            },
            required: ["event", "type", "countriesBenefited", "sectorsAffected", "opportunityRisk", "analysis"]
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : [];
  } catch (error) {
    console.error("Fetch Live Geopolitics Error:", error);
    return [];
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
