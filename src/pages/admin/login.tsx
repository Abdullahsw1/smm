import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { Helmet } from "react-helmet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { signIn, verifyTwoFactorToken } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  twoFactorCode: z
    .string()
    .min(6, { message: "2FA code must be 6 digits" })
    .max(6, { message: "2FA code must be 6 digits" })
    .optional(),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const navigate = useNavigate();
  const { user, adminData, isAdmin } = useAuth();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      // Use setTimeout to ensure navigation happens after auth state is fully processed
      setTimeout(() => {
        navigate("/admin");
      }, 500);
    }
  }, [user, isAdmin, navigate]);

  // Set initial loading state
  useEffect(() => {
    // Check if user is already authenticated
    if (user) {
      setIsLoading(true);
      // Give time for adminData to load
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      twoFactorCode: "",
    },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true);
    console.log("Login form submitted", { showTwoFactor, data });

    try {
      // First step: validate credentials
      if (!showTwoFactor) {
        console.log("Step 1: Validating credentials");
        // Sign in with email and password
        const authData = await signIn(data.email, data.password);

        if (!authData.user) {
          console.error("No user returned from signIn");
          form.setError("email", {
            type: "manual",
            message: "Invalid email or password",
          });
          setIsLoading(false);
          return;
        }

        console.log(
          "User authenticated, checking admin status",
          authData.user.id,
        );

        // First check if user has admin role in users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        console.log("User role check:", { userData, userError });

        if (userError || !userData || userData.role !== "admin") {
          console.error("User is not an admin in users table");
          form.setError("email", {
            type: "manual",
            message: "You do not have admin privileges",
          });
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        // Check if user is in admin_users table
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("two_factor_enabled, two_factor_secret")
          .eq("user_id", authData.user.id)
          .single();

        console.log("Admin check result:", { adminUser, adminError });

        if (adminError || !adminUser) {
          console.error("Admin check failed", adminError);
          form.setError("email", {
            type: "manual",
            message: "You do not have admin privileges",
          });
          // Sign out since this is not an admin
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        console.log("Admin status confirmed", adminUser);
        // Check if 2FA is enabled
        if (adminUser.two_factor_enabled && adminUser.two_factor_secret) {
          console.log("2FA is enabled, showing 2FA form");
          setTwoFactorSecret(adminUser.two_factor_secret);
          setShowTwoFactor(true);
          setIsLoading(false);
          return;
        }

        // If 2FA is not enabled, redirect to admin dashboard
        console.log("2FA not enabled, redirecting to admin dashboard");
        // Wait a moment for the auth context to update
        await supabase.auth.refreshSession(); // Force refresh the session
        setIsLoading(false);
        // Use push instead of navigate to ensure proper routing
        setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 1000);
        return;
      }

      // Second step: validate 2FA code
      console.log("Step 2: Validating 2FA code");
      if (!data.twoFactorCode) {
        console.error("No 2FA code provided");
        form.setError("twoFactorCode", {
          type: "manual",
          message: "Please enter your authentication code",
        });
        setIsLoading(false);
        return;
      }

      let isValid = false;
      try {
        // Verify 2FA code
        console.log("Verifying 2FA token");
        isValid = verifyTwoFactorToken(data.twoFactorCode, twoFactorSecret);
        console.log("2FA verification result:", isValid);

        // For development, always allow login
        if (import.meta.env.DEV) {
          console.log("Development mode: Bypassing 2FA");
          isValid = true;
        }

        if (!isValid) {
          console.error("Invalid 2FA code");
          form.setError("twoFactorCode", {
            type: "manual",
            message: "Invalid authentication code",
          });
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("2FA verification error:", error);
        // For development purposes, allow login even if 2FA fails
        if (import.meta.env.DEV) {
          console.log("Development mode: Bypassing 2FA due to error");
          isValid = true;
        } else {
          form.setError("twoFactorCode", {
            type: "manual",
            message: "Error verifying code",
          });
          setIsLoading(false);
          return;
        }
      }

      // Redirect to admin dashboard
      console.log("2FA verified, redirecting to admin dashboard");
      // Wait a moment for the auth context to update
      await supabase.auth.refreshSession(); // Force refresh the session
      setIsLoading(false);
      // Use push instead of navigate to ensure proper routing
      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 1500);
    } catch (error: any) {
      console.error("Login error:", error);
      form.setError("email", {
        type: "manual",
        message: error.message || "An error occurred during login",
      });
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // For development/testing purposes - allows quick login without Supabase
  const handleDevLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/admin");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Helmet>
        <title>Admin Login | SMM Panel</title>
      </Helmet>
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            {showTwoFactor
              ? "Enter your two-factor authentication code"
              : "Enter your credentials to access the admin panel"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!showTwoFactor ? (
                // Step 1: Email and Password
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="admin@example.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
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
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1 h-7 w-7"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                // Step 2: Two-Factor Authentication
                <FormField
                  control={form.control}
                  name="twoFactorCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authentication Code</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="123456"
                            className="pl-10 text-center tracking-widest"
                            maxLength={6}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Verifying..."
                  : showTwoFactor
                    ? "Verify"
                    : "Continue"}
              </Button>

              {/* Development mode quick login button */}
              {import.meta.env.DEV && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={handleDevLogin}
                >
                  Dev Mode: Quick Login
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            <a href="/" className="font-medium text-primary hover:underline">
              Return to main site
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
