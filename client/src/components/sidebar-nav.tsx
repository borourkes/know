import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { Search, FileText, FolderOpen, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  onSearch: () => void;
};

export function SidebarNav({ onSearch }: SidebarNavProps) {
  const [location] = useLocation();
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  return (
    <div className="min-h-screen w-64 bg-sidebar border-r border-border">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-sidebar-foreground">
          Know | District
        </h1>
      </div>
      
      <div className="px-4 mb-4 space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={onSearch}
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        
        <Link href="/document/new">
          <Button 
            variant="outline" 
            className="w-full justify-start"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </Link>
      </div>

      <Separator className="my-4" />
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="px-4 py-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">
            All Documents
          </h2>
          <div className="space-y-1">
            <Link href="/">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location === "/" && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <FileText className="mr-2 h-4 w-4" />
                Recent
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="px-4 py-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">
            Categories
          </h2>
          <div className="space-y-1">
            {categories?.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.id}`}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location === `/category/${category.id}` && 
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
