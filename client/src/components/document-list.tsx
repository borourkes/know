import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { DocumentViewer } from "./document-viewer";

export function DocumentList() {
  const { data: documents } = useQuery<Document[]>({
    queryKey: ['/api/documents']
  });

  if (!documents?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No documents yet. Create your first document to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Link key={doc.id} href={`/document/${doc.id}`}>
          <Card className="p-4 hover:bg-muted/50 cursor-pointer">
            <h3 className="font-semibold mb-2">{doc.title}</h3>
            <div className="text-sm text-muted-foreground line-clamp-3">
              <DocumentViewer content={doc.content} />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
