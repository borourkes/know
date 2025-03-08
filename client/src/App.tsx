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
import { ThemeProvider } from "@/hooks/use-theme";
import Home from "@/pages/home";
import Document from "@/pages/document";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import UserManagement from "@/pages/user-management";
import { useAuth } from "@/hooks/use-auth";
import { canManageUsers } from "@shared/schema";
import AiChat from "@/pages/ai-chat";
import Help from "@/pages/documentation"; 

function ProtectedAdminRoute({ component: Component, ...props }: { component: React.ComponentType, path: string }) {
  const { user } = useAuth();
  return canManageUsers(user) ? <Component {...props} /> : <NotFound />;
}

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
              <main className="flex-1 min-h-screen pl-16 md:pl-0">
                <Switch>
                  <ProtectedRoute path="/" component={Home} />
                  <ProtectedRoute path="/document/:id" component={Document} />
                  <ProtectedRoute path="/category/:id" component={Home} />
                  <Route
                    path="/users"
                    component={() => <ProtectedAdminRoute component={UserManagement} path="/users" />}
                  />
                  <ProtectedRoute path="/ai-chat" component={AiChat} />
                  <ProtectedRoute path="/docs" component={Help} /> {/* Help documentation route */}
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
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;