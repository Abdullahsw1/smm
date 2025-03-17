import { supabase } from "./supabase";

// Provider API integration
export interface ProviderService {
  service_id: string;
  name: string;
  category: string;
  type: string;
  rate: number;
  min: number;
  max: number;
  description?: string;
}

export interface ProviderOrderStatus {
  order_id: string;
  status: string;
  start_count?: number;
  current_count?: number;
  remains?: number;
}

export async function fetchProviderServices(
  providerId: string,
): Promise<ProviderService[]> {
  try {
    // Get provider details from database
    const { data: provider, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", providerId)
      .single();

    if (error || !provider) throw new Error("Provider not found");

    // This is a mock implementation - in a real app, you would call the actual API
    // Example: const response = await fetch(`${provider.api_url}/services`, {
    //   headers: { 'API-Key': provider.api_key }
    // });

    // For demo purposes, we'll return mock data
    return [
      {
        service_id: "1",
        name: "Instagram Followers",
        category: "Instagram",
        type: "Default",
        rate: 0.99,
        min: 100,
        max: 10000,
        description: "High quality Instagram followers that stay permanently.",
      },
      {
        service_id: "2",
        name: "Facebook Page Likes",
        category: "Facebook",
        type: "Default",
        rate: 1.49,
        min: 100,
        max: 5000,
        description: "Increase your Facebook page popularity with real likes.",
      },
      {
        service_id: "3",
        name: "YouTube Views",
        category: "YouTube",
        type: "Default",
        rate: 1.99,
        min: 1000,
        max: 50000,
        description:
          "High retention YouTube views to boost your video ranking.",
      },
    ];
  } catch (error) {
    console.error("Error fetching provider services:", error);
    throw error;
  }
}

export async function syncProviderServices(providerId: string): Promise<void> {
  try {
    // Fetch services from provider API
    const services = await fetchProviderServices(providerId);

    // For each service, update or insert into our database
    for (const service of services) {
      const { data: existingService, error: fetchError } = await supabase
        .from("services")
        .select("id")
        .eq("provider_id", providerId)
        .eq("provider_service_id", service.service_id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking for existing service:", fetchError);
        continue;
      }

      if (existingService) {
        // Update existing service
        const { error: updateError } = await supabase
          .from("services")
          .update({
            name: service.name,
            description: service.description || "",
            category: service.category,
            price: service.rate,
            min_quantity: service.min,
            max_quantity: service.max,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingService.id);

        if (updateError) {
          console.error("Error updating service:", updateError);
        }
      } else {
        // Insert new service
        const { error: insertError } = await supabase.from("services").insert({
          name: service.name,
          description: service.description || "",
          category: service.category,
          price: service.rate,
          min_quantity: service.min,
          max_quantity: service.max,
          provider_id: providerId,
          provider_service_id: service.service_id,
          status: "active",
        });

        if (insertError) {
          console.error("Error inserting service:", insertError);
        }
      }
    }
  } catch (error) {
    console.error("Error syncing provider services:", error);
    throw error;
  }
}

export async function placeProviderOrder(
  providerId: string,
  serviceId: string,
  link: string,
  quantity: number,
): Promise<string> {
  try {
    // Get provider details from database
    const { data: provider, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", providerId)
      .single();

    if (error || !provider) throw new Error("Provider not found");

    // This is a mock implementation - in a real app, you would call the actual API
    // Example: const response = await fetch(`${provider.api_url}/order`, {
    //   method: 'POST',
    //   headers: { 'API-Key': provider.api_key, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ service: serviceId, link, quantity })
    // });

    // For demo purposes, we'll return a mock order ID
    return `PROVIDER-${Math.floor(Math.random() * 10000)}`;
  } catch (error) {
    console.error("Error placing provider order:", error);
    throw error;
  }
}

export async function checkProviderOrderStatus(
  providerId: string,
  providerOrderId: string,
): Promise<ProviderOrderStatus> {
  try {
    // Get provider details from database
    const { data: provider, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", providerId)
      .single();

    if (error || !provider) throw new Error("Provider not found");

    // This is a mock implementation - in a real app, you would call the actual API
    // Example: const response = await fetch(`${provider.api_url}/status`, {
    //   method: 'POST',
    //   headers: { 'API-Key': provider.api_key, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ order: providerOrderId })
    // });

    // For demo purposes, we'll return a mock status
    const statuses = ["pending", "in_progress", "completed"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      order_id: providerOrderId,
      status: randomStatus,
      start_count: 1000,
      current_count: randomStatus === "completed" ? 2000 : 1500,
      remains: randomStatus === "completed" ? 0 : 500,
    };
  } catch (error) {
    console.error("Error checking provider order status:", error);
    throw error;
  }
}
