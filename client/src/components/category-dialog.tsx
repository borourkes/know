import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory?: { id: number; name: string; description: string };
};

export function CategoryDialog({ open, onOpenChange, editingCategory }: CategoryDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    description: ""
  });

  // Update form when editingCategory changes
  useEffect(() => {
    if (editingCategory) {
      setCategory({
        name: editingCategory.name,
        description: editingCategory.description
      });
    } else {
      setCategory({ name: "", description: "" });
    }
  }, [editingCategory]);

  const { mutate: createCategory, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/categories", category);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create category");
      }
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
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create category",
        variant: "destructive"
      });
    }
  });

  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!editingCategory) return;
      const res = await apiRequest("PATCH", `/api/categories/${editingCategory.id}`, category);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive"
      });
    }
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!editingCategory) return;
      const res = await apiRequest("DELETE", `/api/categories/${editingCategory.id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      onOpenChange(false);
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive"
      });
    }
  });

  const isPending = isCreating || isUpdating || isDeleting;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
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
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={() => editingCategory ? updateCategory() : createCategory()}
                disabled={isPending || !category.name}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
              {editingCategory && (
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and all its associations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteCategory()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}