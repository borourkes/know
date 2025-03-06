import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/login", formData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      return res.json();
    },
    onSuccess: () => {
      setLocation("/");
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive"
      });
    }
  });

  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/register", formData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return res.json();
    },
    onSuccess: () => {
      setLocation("/");
      toast({
        title: "Success",
        description: "Registered and logged in successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-[1000px] gap-8">
        <div className="flex-1 hidden md:block">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">
              <span className="text-primary">know</span> | District
            </h1>
            <p className="text-muted-foreground text-lg">
              Get to KNOW all the internal processes and everything that is District
            </p>
          </div>
        </div>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
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
                    onClick={() => login()}
                    disabled={isLoggingIn || !formData.username || !formData.password}
                  >
                    {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                    onClick={() => register()}
                    disabled={isRegistering || !formData.username || !formData.password}
                  >
                    {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
