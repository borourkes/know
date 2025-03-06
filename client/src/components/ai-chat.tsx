import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export function AIChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (content: string) => {
      const newMessages = [
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;
    sendMessage(input);
  };

  const quickPrompts = [
    "Can you help me write an introduction for this document?",
    "Can you suggest a structure for this content?",
    "Can you help me make this content more engaging?",
    "Can you help me summarize this content?"
  ];

  return (
    <Card className="mt-4">
      <CardContent className="p-4 space-y-4">
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
                      : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
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
      </CardContent>
    </Card>
  );
}
