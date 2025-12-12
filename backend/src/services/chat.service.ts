import OpenAI from 'openai';
import { settings } from '../config/env.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are the AI assistant for Super Vidéothèque, a premium video streaming rental platform.

YOUR ROLE:
- Help users understand how the site works
- Answer questions about pricing, rentals, and features
- Resolve technical issues
- Suggest popular videos
- Be friendly, concise, and helpful

SITE INFORMATION:
- Users purchase a license key on Payhip
- They enter their key + email to access the catalog
- Videos are secure streaming (no downloads)
- Previews are free (hover over a video to see)
- Rentals typically last 48 hours

STYLE:
- IMPORTANT: Always respond in the same language the user writes in. If they write in French, respond in French. If they write in English, respond in English. If they write in Spanish, respond in Spanish, etc.
- Be concise (max 3-4 sentences unless details are needed)
- Use emojis sparingly
- Be warm but professional`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatService = {
  async chat(userMessage: string, history: ChatMessage[] = []): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error("Erreur de l'assistant AI. Réessaie dans un moment.");
    }
  }
};
