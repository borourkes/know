import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState({ name: "", description: "" });

  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/categories", category);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      onOpenChange(false);
      setCategory({ name: "", description: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Category Name"
              value={category.name}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Category Description (optional)"
              value={category.description}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={() => createCategory()}
            disabled={isPending || !category.name}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
