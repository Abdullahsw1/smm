import { supabase } from "./supabase";

export interface ProviderData {
  id: string;
  name: string;
  api_url: string;
  api_key: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export async function getProviders(): Promise<ProviderData[]> {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .order("name");

  if (error) {
    throw new Error("Failed to fetch providers");
  }

  return data as ProviderData[];
}

export async function getProvider(providerId: string): Promise<ProviderData> {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", providerId)
    .single();

  if (error || !data) {
    throw new Error("Provider not found");
  }

  return data as ProviderData;
}

export async function createProvider(
  name: string,
  apiUrl: string,
  apiKey: string,
): Promise<ProviderData> {
  const { data, error } = await supabase
    .from("providers")
    .insert({
      name,
      api_url: apiUrl,
      api_key: apiKey,
      status: "active",
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error("Failed to create provider");
  }

  return data as ProviderData;
}

export async function updateProvider(
  providerId: string,
  updates: Partial<Omit<ProviderData, "id" | "created_at" | "updated_at">>,
): Promise<ProviderData> {
  const { data, error } = await supabase
    .from("providers")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", providerId)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Failed to update provider");
  }

  return data as ProviderData;
}
