import { supabase } from "./supabase";

export interface ServiceData {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  min_quantity: number;
  max_quantity: number;
  provider_id: string;
  provider_service_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  provider?: {
    name: string;
  };
}

export async function getServices(
  category?: string,
  status = "active",
): Promise<ServiceData[]> {
  let query = supabase
    .from("services")
    .select(
      `
      *,
      provider:provider_id(name)
    `,
    )
    .eq("status", status)
    .order("name");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to fetch services");
  }

  return data as ServiceData[];
}

export async function getService(serviceId: string): Promise<ServiceData> {
  const { data, error } = await supabase
    .from("services")
    .select(
      `
      *,
      provider:provider_id(name)
    `,
    )
    .eq("id", serviceId)
    .single();

  if (error || !data) {
    throw new Error("Service not found");
  }

  return data as ServiceData;
}

export async function updateService(
  serviceId: string,
  updates: Partial<
    Omit<ServiceData, "id" | "created_at" | "updated_at" | "provider">
  >,
): Promise<ServiceData> {
  const { data, error } = await supabase
    .from("services")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", serviceId)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Failed to update service");
  }

  return data as ServiceData;
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("services")
    .select("category")
    .eq("status", "active")
    .order("category");

  if (error) {
    throw new Error("Failed to fetch categories");
  }

  // Extract unique categories
  const categories = [...new Set(data.map((item) => item.category))];
  return categories;
}
