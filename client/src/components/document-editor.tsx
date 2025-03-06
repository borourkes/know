import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";

type DocumentEditorProps = {
  documentId?: number;
  initialDoc?: Partial<Document>;
};

export function DocumentEditor({ documentId, initialDoc }: DocumentEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();

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
      if (!documentId) {
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
      toast({
        title: "AI Suggestions",
        description: (
          <div className="mt-2 space-y-2">
            <div>
              <strong>Improvements:</strong>
              <ul className="list-disc pl-4">
                {data.improvements.map((imp: string, i: number) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Formatting:</strong>
              <ul className="list-disc pl-4">
                {data.formatting.map((fmt: string, i: number) => (
                  <li key={i}>{fmt}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Expansion Ideas:</strong>
              <ul className="list-disc pl-4">
                {data.expansion.map((exp: string, i: number) => (
                  <li key={i}>{exp}</li>
                ))}
              </ul>
            </div>
          </div>
        )
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Input
          placeholder="Document Title"
          value={doc.title}
          onChange={(e) => setDoc({ ...doc, title: e.target.value })}
          className="text-2xl font-bold mb-4"
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

      <Card className="mb-6">
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
    </div>
  );
}