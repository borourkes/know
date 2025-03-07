import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const { loginMutation, registerMutation, user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-[1000px] gap-8">
        {/* Brand section - Always visible on mobile */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="md:hidden mb-6">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">know</span> | District
            </h1>
            <p className="text-muted-foreground mt-2">
              Get to KNOW all the internal processes and everything that is District
            </p>
          </div>
          <div className="hidden md:block">
            <h1 className="text-4xl font-bold">
              <span className="text-primary">know</span> | District
            </h1>
            <p className="text-muted-foreground text-lg mt-4">
              Get to KNOW all the internal processes and everything that is District
            </p>
          </div>
        </div>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <Button 
                    className="w-full" 
                    onClick={() => loginMutation.mutate(formData)}
                    disabled={loginMutation.isPending || !formData.username || !formData.password}
                  >
                    {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <Button 
                    className="w-full"
                    onClick={() => registerMutation.mutate(formData)}
                    disabled={registerMutation.isPending || !formData.username || !formData.password}
                  >
                    {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}