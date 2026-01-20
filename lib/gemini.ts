
'use server';

import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
// Fallback or check
if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'PLACEHOLDER' });

export const getStudyTips = async (courseTitle: string, description: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `I am studying "${courseTitle}". Description: ${description}. Give me 3 actionable study tips for this specific topic.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            tip: { type: Type.STRING },
                            explanation: { type: Type.STRING }
                        },
                        required: ["tip", "explanation"]
                    }
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return [];
    } catch (error) {
        console.error("Gemini Error:", error);
        return [];
    }
};

export const getAssistantResponse = async (question: string, context: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Context: ${context}\n\nStudent Question: ${question}\n\nProvide a helpful, concise answer to help them study.`,
        });
        return response.text || "Sorry, I'm having trouble connecting to my brain right now.";
    } catch (error) {
        console.error("Assistant Error:", error);
        return "Sorry, I'm having trouble connecting to my brain right now.";
    }
};
