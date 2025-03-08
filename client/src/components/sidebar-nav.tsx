import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { Search, FileText, FolderOpen, Plus, FolderPlus, LogOut, Menu, Users, Brain, Book } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category, canManageUsers } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CategoryDialog } from "./category-dialog";
import { useAuth } from "@/hooks/use-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";

type SidebarNavProps = {
  onSearch: () => void;
};

export function SidebarNav({ onSearch }: SidebarNavProps) {
  const [location] = useLocation();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  const handleCategoryClick = (category: Category, event: React.MouseEvent) => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseDown = () => {
      timeoutId = setTimeout(() => {
        setEditingCategory(category);
        setCategoryDialogOpen(true);
      }, 500);
    };

    const handleMouseUp = () => {
      clearTimeout(timeoutId);
    };

    event.preventDefault();
    handleMouseDown();

    window.addEventListener('mouseup', handleMouseUp, { once: true });
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold text-sidebar-foreground flex items-center gap-2">
          <span className="text-primary">know</span>
          <span className="text-muted-foreground">|</span>
          <span>District</span>
        </h1>
      </div>

      <div className="px-4 mb-4 space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => {
            onSearch();
            setIsMobileMenuOpen(false);
          }}
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>

        <Link href="/document/new">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </Link>

        <Link href="/ai-chat">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Brain className="mr-2 h-4 w-4" />
            AI Assistant
          </Button>
        </Link>
        <Link href="/docs">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Book className="mr-2 h-4 w-4" />
            Documentation
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => {
            setEditingCategory(undefined);
            setCategoryDialogOpen(true);
            setIsMobileMenuOpen(false);
          }}
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      <Separator className="my-4" />

      <ScrollArea className="flex-1">
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
                onClick={() => setIsMobileMenuOpen(false)}
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
                  onMouseDown={(e) => handleCategoryClick(category, e)}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Only: User Management Section */}
        {canManageUsers(user) && (
          <div className="px-4 py-2">
            <h2 className="mb-2 text-lg font-semibold tracking-tight">
              Administration
            </h2>
            <div className="space-y-1">
              <Link href="/users">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    location === "/users" && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="p-4 mt-auto space-y-2">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="flex-1 justify-start ml-2 text-muted-foreground hover:text-sidebar-foreground"
            onClick={() => {
              logoutMutation.mutate();
              setIsMobileMenuOpen(false);
            }}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 md:hidden z-50 bg-background shadow-sm hover:bg-accent"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[80%] max-w-[300px] p-0">
          <div className="h-full flex flex-col bg-sidebar">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 min-h-screen flex-col bg-sidebar border-r border-border">
        <SidebarContent />
      </div>

      <CategoryDialog 
        open={categoryDialogOpen}
        onOpenChange={(open) => {
          setCategoryDialogOpen(open);
          if (!open) setEditingCategory(undefined);
        }}
        editingCategory={editingCategory}
      />
    </>
  );
}

export default SidebarNav;