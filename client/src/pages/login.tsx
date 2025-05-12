import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { signIn, user, loading, resetPassword } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        throw error;
      }
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">SafeGuard</h1>
          <p className="mt-2 text-sm text-gray-600">Parental Control Dashboard</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                )}
              />

              <div className="text-sm">
                <Button 
                  variant="link" 
                  className="p-0 font-medium text-primary hover:text-blue-700"
                  onClick={() => {
                    const email = form.getValues('email');
                    if (!email) {
                      toast({
                        title: "Email Required",
                        description: "Please enter your email address first.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    resetPassword(email).then(({ error }) => {
                      if (error) {
                        toast({
                          title: "Error",
                          description: error.message || "Failed to send password reset email.",
                          variant: "destructive",
                        });
                      } else {
                        toast({
                          title: "Password Reset Email Sent",
                          description: "Please check your email for password reset instructions.",
                        });
                      }
                    });
                  }}
                >
                  Forgot your password?
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:text-blue-700">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
