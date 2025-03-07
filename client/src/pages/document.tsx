import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { DocumentEditor } from "@/components/document-editor";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const documentId = id === 'new' ? undefined : parseInt(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: document, isLoading } = useQuery({
    queryKey: [`document`, documentId],
    queryFn: async () => {
      if (!documentId) return null;
      const response = await fetch(`/api/documents/${documentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      return response.json();
    },
    enabled: !!documentId,
  });

  const { mutate: deleteDocument } = useMutation({
    mutationFn: async () => {
      if (!documentId) return;
      await apiRequest("DELETE", `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      window.location.href = '/';
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete document",
        variant: "destructive"
      });
    }
  });

  if (id === 'new') {
    return <DocumentEditor />;
  }

  if (isLoading) {
    return (
      <div className="animate-pulse p-4 md:p-6">
        <div className="h-8 bg-muted rounded w-1/3 mb-4" />
        <div className="h-4 bg-muted rounded w-1/4 mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-destructive">Document Not Found</h1>
            <p className="mt-2 text-muted-foreground">
              The document you're looking for doesn't exist or has been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEditing) {
    return (
      <DocumentEditor 
        documentId={documentId}
        initialDoc={document}
        onSaved={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold truncate">{document.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated {document.lastUpdated ? formatDistanceToNow(new Date(document.lastUpdated)) : 'Never'} ago
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {/* Desktop buttons */}
            <div className="hidden md:flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
            {/* Mobile icon buttons */}
            <div className="flex md:hidden gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit document</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete document</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: document.content }}
          />
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteDocument()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}