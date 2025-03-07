import { useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { SidebarNav } from "@/components/sidebar-nav";
import { SearchDialog } from "@/components/search-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Document from "@/pages/document";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";

function Router() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      <Switch>
        <Route path="/auth" component={AuthPage} />

        <Route>
          <>
            <div className="flex w-full">
              <SidebarNav onSearch={() => setSearchOpen(true)} />
              <main className="flex-1 p-4 md:p-6 min-h-screen">
                <Switch>
                  <ProtectedRoute path="/" component={Home} />
                  <ProtectedRoute path="/document/:id" component={Document} />
                  <ProtectedRoute path="/category/:id" component={Home} />
                  <Route component={NotFound} />
                </Switch>
              </main>
            </div>

            <SearchDialog 
              open={searchOpen} 
              onOpenChange={setSearchOpen} 
            />
          </>
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;