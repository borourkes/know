import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Document, Category } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

function stripHtml(html: string) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export default function Home() {
  const { id: categoryId } = useParams<{ id: string }>();
  const parsedCategoryId = categoryId ? parseInt(categoryId) : undefined;

  // Fetch category details if we're viewing a specific category
  const { data: category, isLoading: isCategoryLoading } = useQuery<Category>({
    queryKey: ['/api/categories', parsedCategoryId],
    queryFn: async () => {
      if (!parsedCategoryId) return null;
      const response = await fetch(`/api/categories/${parsedCategoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      return response.json();
    },
    enabled: !!parsedCategoryId
  });

  const { data: documents, isLoading: isDocumentsLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents', parsedCategoryId],
    queryFn: async () => {
      const url = parsedCategoryId 
        ? `/api/documents?categoryId=${parsedCategoryId}`
        : '/api/documents';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      return response.json();
    }
  });

  const isLoading = isDocumentsLoading || (categoryId && isCategoryLoading);

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
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to know | District</h1>
        <p className="text-muted-foreground mb-6">
          Get to KNOW all the internal processes and everything that is District
        </p>
        <Link href="/document/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create New Document
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FileText className="h-8 w-8" />
          {categoryId ? (
            <>Category: {category?.name || 'Loading...'}</>
          ) : (
            "Recent Documents"
          )}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents?.map((doc) => (
          <Link key={doc.id} href={`/document/${doc.id}`}>
            <Card className="cursor-pointer hover:bg-accent/5 transition-colors border-2 hover:border-primary/20">
              <CardHeader>
                <CardTitle className="line-clamp-1">{doc.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last updated {doc.lastUpdated ? formatDistanceToNow(new Date(doc.lastUpdated)) : 'Never'} ago
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {stripHtml(doc.content)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {(!documents || documents.length === 0) && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">No documents yet. Start by creating your first document!</p>
            <Link href="/document/new">
              <Button variant="outline" size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Document
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}