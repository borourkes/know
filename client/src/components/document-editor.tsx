import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Category, Document } from "@shared/schema";
import { Loader2, X } from "lucide-react";
import { AIChat } from "./ai-chat";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

type DocumentEditorProps = {
  documentId?: number;
  initialDoc?: Document;
  onSaved?: () => void;
};

type AISuggestions = {
  improvements: string[];
  formatting: string[];
  expansion: string[];
};

export function DocumentEditor({ documentId, initialDoc, onSaved }: DocumentEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);
  const [showChat, setShowChat] = useState(false);

  const [doc, setDoc] = useState<Partial<Document>>(initialDoc || {
    title: "",
    content: "",
    categoryId: undefined
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  const { mutate: saveDocument, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!doc.title || !doc.content) {
        throw new Error("Please fill in all required fields");
      }

      if (documentId) {
        const res = await apiRequest("PATCH", `/api/documents/${documentId}`, doc);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/documents", doc);
        return res.json();
      }
    },
    onSuccess: (savedDoc) => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      if (onSaved) {
        onSaved();
      } else if (!documentId) {
        setLocation(`/document/${savedDoc.id}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save document",
        variant: "destructive"
      });
    }
  });

  const { mutate: getAiSuggestions, isPending: isGettingSuggestions } = useMutation({
    mutationFn: async (content: string) => {
      if (!content.trim()) {
        throw new Error("Please add some content first");
      }
      const res = await apiRequest("POST", "/api/ai/suggest", { content });
      return res.json();
    },
    onSuccess: (data) => {
      setSuggestions(data);
      setShowChat(true);
      toast({
        title: "AI Suggestions Ready",
        description: "Scroll down to view the suggestions and chat with AI for more help.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI suggestions",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Document Title"
          value={doc.title}
          onChange={(e) => setDoc({ ...doc, title: e.target.value })}
          className="text-2xl font-bold"
        />

        <Select
          value={doc.categoryId?.toString()}
          onValueChange={(value) =>
            setDoc({ ...doc, categoryId: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category (Optional)" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Textarea
          placeholder="Start writing your document..."
          value={doc.content}
          onChange={(e) => setDoc({ ...doc, content: e.target.value })}
          className="min-h-[400px] p-4"
        />
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => getAiSuggestions(doc.content || "")}
          disabled={isGettingSuggestions || !doc.content}
        >
          {isGettingSuggestions && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Get AI Suggestions
        </Button>

        <Button
          onClick={() => saveDocument()}
          disabled={isSaving || !doc.title || !doc.content}
        >
          {isSaving && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Document
        </Button>
      </div>

      {suggestions && (
        <Collapsible className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold">AI Suggestions</CardTitle>
                <CollapsibleTrigger className="hover:opacity-70">
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSuggestions(null);
                  setShowChat(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Suggested Improvements</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    {suggestions.improvements.map((imp, i) => (
                      <li key={i} className="text-muted-foreground">{imp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Formatting Suggestions</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    {suggestions.formatting.map((fmt, i) => (
                      <li key={i} className="text-muted-foreground">{fmt}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Content Expansion Ideas</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    {suggestions.expansion.map((exp, i) => (
                      <li key={i} className="text-muted-foreground">{exp}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {showChat && (
        <Collapsible className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold">AI Chat Assistant</CardTitle>
                <CollapsibleTrigger className="hover:opacity-70">
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <AIChat />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
}