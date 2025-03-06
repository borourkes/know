import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { marked } from "marked";

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type AIContextProps = {
  title: string;
  content: string;
};

type AIChatProps = {
  context: AIContextProps;
};

export function AIChat({ context }: AIChatProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (content: string) => {
      const systemMessage = context.title || context.content
        ? `You are assisting with a document titled "${context.title}". Current content: "${context.content}"`
        : "You are a helpful writing assistant";

      const newMessages = [
        { role: 'system' as const, content: systemMessage },
        ...messages,
        { role: 'user' as const, content }
      ];
      const res = await apiRequest("POST", "/api/ai/chat", { messages: newMessages });
      return res.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: data.message }
      ]);
      setInput("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
    }
  });

  const quickPrompts = [
    "Can you help me write an introduction for this document?",
    "Can you suggest a structure for this content?",
    "Can you help me make this content more engaging?",
    "Can you help me summarize this content?"
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {quickPrompts.map((prompt, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setInput(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted prose prose-sm max-w-none'
                }`}
                dangerouslySetInnerHTML={
                  msg.role === 'assistant' 
                    ? { __html: marked(msg.content) }
                    : { __html: msg.content }
                }
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (!input.trim() || isPending) return;
        sendMessage(input);
      }} className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for writing assistance..."
          className="min-h-[60px]"
        />
        <Button 
          type="submit" 
          disabled={isPending || !input.trim()}
          className="px-3"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}