import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [_, setLocation] = useLocation();

  const { mutate: search, data: results } = useMutation<Document[]>({
    mutationFn: async (query: string) => {
      const res = await apiRequest("POST", "/api/documents/search", { query });
      return res.json();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <div className="p-4">
          <Input
            placeholder="Search documents..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) {
                search(e.target.value);
              }
            }}
            className="w-full"
          />
        </div>

        <ScrollArea className="max-h-[300px] mt-2">
          <div className="p-4 space-y-2">
            {results?.map((doc) => (
              <div
                key={doc.id}
                className="p-2 cursor-pointer hover:bg-accent rounded-md"
                onClick={() => {
                  setLocation(`/document/${doc.id}`);
                  onOpenChange(false);
                }}
              >
                <h3 className="font-medium">{doc.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {doc.content}
                </p>
              </div>
            ))}

            {query && results?.length === 0 && (
              <p className="text-center text-muted-foreground">
                No documents found
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}