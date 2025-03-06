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
          content: "You are an expert content editor. Analyze the given document content and provide suggestions for improvements, formatting, and possible content expansions. Return JSON in this format: { 'improvements': string[], 'formatting': string[], 'expansion': string[] }"
        },
        {
          role: "user",
          content
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to get AI suggestions: " + error.message);
  }
}
