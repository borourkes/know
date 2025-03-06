import { useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { SidebarNav } from "@/components/sidebar-nav";
import { SearchDialog } from "@/components/search-dialog";
import Home from "@/pages/home";
import Document from "@/pages/document";
import NotFound from "@/pages/not-found";

function Router() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex">
      <SidebarNav onSearch={() => setSearchOpen(true)} />
      
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/document/:id" component={Document} />
          <Route path="/category/:id" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <SearchDialog 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
