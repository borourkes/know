import Anthropic from '@anthropic-ai/sdk';
import { storage } from './storage';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI assistant for 'know | District', a knowledge management platform.
You must ONLY answer questions using information from the internal documents provided.
If you cannot find relevant information in the provided documents, respond with:
"I'm sorry, there isn't any information in 'know | District' about your query at the moment."
Never make up information or use external knowledge.`;

export async function searchAndRespond(query: string) {
  try {
    // Search for relevant documents
    const relevantDocs = await storage.searchDocuments(query);
    
    if (!relevantDocs.length) {
      return "I'm sorry, there isn't any information in 'know | District' about your query at the moment.";
    }

    // Prepare context from relevant documents
    const context = relevantDocs.map(doc => 
      `Document: ${doc.title}\nContent: ${doc.content}`
    ).join('\n\n');

    // Get AI response
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Here are the relevant internal documents:\n\n${context}\n\nUser question: ${query}\n\nPlease answer based ONLY on the information provided in these documents. If the documents don't contain relevant information, say so.`
        }
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('AI Response Error:', error);
    throw new Error('Failed to process your request');
  }
}
