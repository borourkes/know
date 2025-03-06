import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

type LoginData = Pick<InsertUser, "username" | "password">;

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const loginForm = useForm<LoginData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: "",
      role: "viewer",
    },
  });

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await apiRequest("POST", "/api/login", data);
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Login failed");
      }
      return resData;
    },
    onSuccess: () => {
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: async (data: InsertUser) => {
      try {
        const res = await apiRequest("POST", "/api/register", data);
        return await res.json();
      } catch (error: any) {
        throw new Error(error.message || "Registration failed");
      }
    },
    onSuccess: () => {
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold flex items-center justify-center gap-2">
              <span className="text-primary">know</span>
              <span className="text-muted-foreground">|</span>
              <span>District</span>
            </h1>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form
                onSubmit={loginForm.handleSubmit((data) => login(data))}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Input
                    placeholder="Username"
                    {...loginForm.register("username")}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    {...loginForm.register("password")}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form
                onSubmit={registerForm.handleSubmit((data) => register(data))}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Input
                    placeholder="Username"
                    {...registerForm.register("username")}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Display Name"
                    {...registerForm.register("displayName")}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    {...registerForm.register("password")}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isRegistering}
                >
                  {isRegistering && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Register
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-muted p-8">
        <div className="max-w-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to know | District</h2>
          <p className="text-muted-foreground text-lg">
            Get to KNOW all the internal processes and everything that is District
          </p>
        </div>
      </div>
    </div>
  );
}