import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents']
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Recent Documents</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents?.map((doc) => (
          <Link key={doc.id} href={`/document/${doc.id}`}>
            <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last updated {formatDistanceToNow(new Date(doc.lastUpdated))} ago
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {doc.content}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
