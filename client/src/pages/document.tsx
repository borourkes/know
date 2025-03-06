import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { DocumentEditor } from "@/components/document-editor";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();

  const { data: document, isLoading } = useQuery<Document>({
    queryKey: ['/api/documents', id],
    enabled: id !== 'new'
  });

  if (id === 'new') {
    return <DocumentEditor />;
  }

  if (isLoading) {
    return (
      <div className="animate-pulse p-6">
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
      <div className="p-6">
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

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{document.title}</h1>
        <p className="text-sm text-muted-foreground">
          Last updated {formatDistanceToNow(new Date(document.lastUpdated))} ago
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            {document.content}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}