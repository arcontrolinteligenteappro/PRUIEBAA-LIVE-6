
import { GoogleGenAI } from "@google/genai";
import { BroadcastState } from "../types";

// NOTE: In a real app, use process.env.API_KEY. 
// For this demo, we assume the environment is set up correctly.
const apiKey = process.env.API_KEY || ''; 

let genAI: GoogleGenAI | null = null;

try {
  if (apiKey) {
    genAI = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.error("Failed to initialize Gemini:", error);
}

const SYSTEM_INSTRUCTION = `
You are ARCLS Director AI (Gemini 3.0 Preview).

You assist a professional live broadcast control system.

You act as:
- Broadcast TV Director
- Technical Director (TD)
- Live Sports Producer
- Show Control Assistant

ABSOLUTE SAFETY RULES:
- You NEVER execute actions.
- You ONLY suggest actions.
- You NEVER perform or imply CUT, AUTO, TAKE, STREAM START, STREAM STOP, or REPLAY ROLL.
- All actions require explicit human confirmation.
- Always preserve BROADCAST SAFE STATE.

OPERATION RULES:
- Think like a real control room under live pressure.
- Prefer 2‑tap workflows.
- Avoid unnecessary complexity.
- Respect live broadcast timing and conventions.
- If data is missing or uncertain, return WARNINGS.

OUTPUT RULES:
- Output ONLY valid JSON.
- No explanations.
- No markdown.
- No emojis.
- Structure:
{
  "status": "SAFE" | "WARNING" | "CRITICAL",
  "suggestedAction": "Short imperative command (e.g., 'Ready Camera 2')",
  "technicalReasoning": "Brief technical justification",
  "nextCue": "What comes after the action",
  "confidence": 0-100
}
`;

export const analyzeState = async (state: BroadcastState): Promise<any> => {
  if (!genAI) return { status: 'WARNING', suggestedAction: 'Check API Key', technicalReasoning: 'AI Service Offline', nextCue: 'Manual Op', confidence: 0 };

  try {
    // Create a lean context object to save tokens and focus attention
    const pgmSource = state.sources[state.programId];
    const pvwSource = state.sources[state.previewId];

    const context = {
        pgm: pgmSource?.name,
        pvw: pvwSource?.name,
        audioMaster: state.masterLevel,
        streaming: state.streaming,
        recording: state.recording,
        activeOverlays: state.overlays.filter(o => o.isActive).map(o => o.template),
        guests: state.guests.map(g => ({ name: g.name, status: g.status, signal: g.connectionQuality })),
        units: state.fieldUnits.map(u => ({ name: u.name, batt: u.battery, status: u.status })),
        lastMacro: state.macroExecuting
    };

    const response = await genAI.models.generateContent({
      model: 'gemini-1.5-flash', // Using Flash for low latency
      contents: `CURRENT SYSTEM STATE: ${JSON.stringify(context)}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
        status: 'CRITICAL',
        suggestedAction: 'Manual Override',
        technicalReasoning: 'AI Analysis Failed',
        nextCue: 'Standby',
        confidence: 0
    };
  }
};

// Legacy fallback
export const generateProductionNotes = async (context: string): Promise<string> => {
    return "Please use analyzeState for V8.7 JSON features.";
};
