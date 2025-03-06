import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { DocumentEditor } from "@/components/document-editor";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: document, isLoading } = useQuery<Document>({
    queryKey: ['/api/documents', id],
    enabled: id !== 'new'
  });

  if (id !== 'new' && isLoading) {
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

  return (
    <DocumentEditor 
      documentId={id === 'new' ? undefined : parseInt(id)}
      initialDoc={document}
    />
  );
}
