import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key'
});

export async function getContentSuggestions(content: string): Promise<{
  improvements: string[],
  formatting: string[],
  expansion: string[]
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert content editor. Analyze the given document content and provide specific, actionable suggestions based on the actual content provided. Focus on concrete improvements rather than general writing advice. Return JSON in this format: { 'improvements': string[], 'formatting': string[], 'expansion': string[] }"
        },
        {
          role: "user",
          content: `Here is the document content to analyze and provide specific suggestions for:\n\n${content}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    const err = error as Error;
    throw new Error("Failed to get AI suggestions: " + err.message);
  }
}

export async function chatWithAI(messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful writing assistant that can help with content creation, templates, and writing suggestions. For any content suggestions, provide them in a clear, formatted structure with proper markdown formatting for headings, lists, and emphasis. Be concise and practical in your responses."
        },
        ...messages
      ]
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    const err = error as Error;
    throw new Error("Failed to chat with AI: " + err.message);
  }
}