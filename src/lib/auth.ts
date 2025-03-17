import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";
import { authenticator } from "otplib";

export type UserRole = "user" | "admin";

export interface UserData {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  balance?: number;
}

export interface AdminUserData extends UserData {
  role_id: string;
  role_name: string;
  permissions: Record<string, Record<string, boolean>>;
  two_factor_enabled: boolean;
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  if (data.user) {
    // Create user record in public.users table
    await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email!,
      full_name: fullName,
      role: "user",
    });
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getUserData(userId: string): Promise<UserData | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as UserData;
}

export async function getAdminData(
  userId: string,
): Promise<AdminUserData | null> {
  console.log("Checking admin data for user ID:", userId);

  try {
    // First check if user exists and is an admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .eq("role", "admin")
      .single();

    console.log("Admin user check:", { userData, userError });

    if (userError || !userData) {
      console.log("User is not an admin in users table");
      return null;
    }

    // Then get admin data
    const { data, error } = await supabase
      .from("admin_users")
      .select(
        `
        *,
        users(*),
        admin_roles(*)
      `,
      )
      .eq("user_id", userId)
      .single();

    console.log("Admin data query result:", { data, error });

    if (error) {
      console.error("Error fetching admin data:", error);
      return null;
    }

    if (!data) {
      console.log("No admin data found for user");
      return null;
    }

    const adminData = {
      id: data.users.id,
      email: data.users.email,
      full_name: data.users.full_name,
      role: "admin" as UserRole,
      balance: data.users.balance,
      role_id: data.role_id,
      role_name: data.admin_roles.name,
      permissions: data.admin_roles.permissions,
      two_factor_enabled: data.two_factor_enabled,
    };

    console.log("Returning admin data:", adminData);
    return adminData;
  } catch (err) {
    console.error("Unexpected error in getAdminData:", err);
    return null;
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) return false;
  return data.role === "admin";
}

export async function generateTwoFactorSecret(): Promise<string> {
  return authenticator.generateSecret();
}

export function generateTwoFactorQRCode(email: string, secret: string): string {
  const issuer = "SMM Panel";
  const otpauth = authenticator.keyuri(email, issuer, secret);
  return `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(otpauth)}`;
}

export function verifyTwoFactorToken(token: string, secret: string): boolean {
  if (!token || !secret) {
    console.error("Missing token or secret for 2FA verification");
    return false;
  }

  try {
    console.log("Verifying 2FA token with secret", {
      tokenLength: token.length,
      secretLength: secret.length,
    });
    const result = authenticator.verify({ token, secret });
    console.log("2FA verification result:", result);
    return result;
  } catch (error) {
    console.error("Error verifying 2FA token:", error);
    // For development purposes, return true to bypass 2FA
    return import.meta.env.DEV;
  }
}

export async function enableTwoFactor(
  userId: string,
  secret: string,
): Promise<void> {
  const { error } = await supabase
    .from("admin_users")
    .update({
      two_factor_enabled: true,
      two_factor_secret: secret,
    })
    .eq("user_id", userId);

  if (error) throw error;
}

export async function disableTwoFactor(userId: string): Promise<void> {
  const { error } = await supabase
    .from("admin_users")
    .update({
      two_factor_enabled: false,
      two_factor_secret: null,
    })
    .eq("user_id", userId);

  if (error) throw error;
}
