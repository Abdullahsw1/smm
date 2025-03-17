import { supabase } from "./supabase";
import { placeProviderOrder, checkProviderOrderStatus } from "./api";

export interface OrderData {
  id: string;
  user_id: string;
  service_id: string;
  quantity: number;
  link: string;
  price: number;
  status: "pending" | "in_progress" | "completed" | "canceled" | "failed";
  start_count?: number | null;
  current_count?: number | null;
  remains?: number | null;
  created_at: string;
  updated_at: string;
  provider_order_id?: string | null;
  service?: {
    name: string;
    category: string;
  };
  user?: {
    email: string;
    full_name: string;
  };
}

export async function createOrder(
  userId: string,
  serviceId: string,
  quantity: number,
  link: string,
): Promise<OrderData> {
  // Get service details
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single();

  if (serviceError || !service) {
    throw new Error("Service not found");
  }

  // Calculate price
  const price = (service.price * quantity) / 1000;

  // Check user balance
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("balance")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    throw new Error("User not found");
  }

  if (user.balance < price) {
    throw new Error("Insufficient balance");
  }

  // Start a transaction
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      service_id: serviceId,
      quantity,
      link,
      price,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error("Failed to create order");
  }

  // Deduct from user balance
  const { error: updateError } = await supabase
    .from("users")
    .update({ balance: user.balance - price })
    .eq("id", userId);

  if (updateError) {
    // If balance update fails, cancel the order
    await supabase
      .from("orders")
      .update({ status: "canceled" })
      .eq("id", order.id);
    throw new Error("Failed to update balance");
  }

  // Record transaction
  const { error: transactionError } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      type: "order",
      amount: -price,
      details: `Order for ${service.name}`,
      status: "completed",
      order_id: order.id,
    });

  if (transactionError) {
    console.error("Failed to record transaction:", transactionError);
  }

  // Place order with provider
  try {
    const providerOrderId = await placeProviderOrder(
      service.provider_id,
      service.provider_service_id,
      link,
      quantity,
    );

    // Update order with provider order ID
    await supabase
      .from("orders")
      .update({
        provider_order_id: providerOrderId,
        status: "in_progress",
      })
      .eq("id", order.id);

    return {
      ...order,
      status: "in_progress",
      provider_order_id: providerOrderId,
    };
  } catch (error) {
    console.error("Failed to place provider order:", error);
    // If provider order fails, mark as failed but don't refund yet (admin should review)
    await supabase
      .from("orders")
      .update({ status: "failed" })
      .eq("id", order.id);
    throw new Error("Failed to place order with provider");
  }
}

export async function getOrders(
  userId?: string,
  status?: string,
): Promise<OrderData[]> {
  let query = supabase
    .from("orders")
    .select(
      `
      *,
      service:service_id(name, category),
      user:user_id(email, full_name)
    `,
    )
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to fetch orders");
  }

  return data as OrderData[];
}

export async function getOrder(orderId: string): Promise<OrderData> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      service:service_id(name, category),
      user:user_id(email, full_name)
    `,
    )
    .eq("id", orderId)
    .single();

  if (error || !data) {
    throw new Error("Order not found");
  }

  return data as OrderData;
}

export async function updateOrderStatus(orderId: string): Promise<OrderData> {
  // Get order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      *,
      service:service_id(provider_id)
    `,
    )
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error("Order not found");
  }

  if (!order.provider_order_id) {
    throw new Error("No provider order ID found");
  }

  // Check status with provider
  const providerStatus = await checkProviderOrderStatus(
    order.service.provider_id,
    order.provider_order_id,
  );

  // Map provider status to our status
  let status = order.status;
  if (providerStatus.status === "completed") {
    status = "completed";
  } else if (providerStatus.status === "in_progress") {
    status = "in_progress";
  } else if (providerStatus.status === "canceled") {
    status = "canceled";
  } else if (providerStatus.status === "failed") {
    status = "failed";
  }

  // Update order status
  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({
      status,
      start_count: providerStatus.start_count,
      current_count: providerStatus.current_count,
      remains: providerStatus.remains,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (updateError || !updatedOrder) {
    throw new Error("Failed to update order status");
  }

  return updatedOrder as OrderData;
}

export async function cancelOrder(orderId: string): Promise<OrderData> {
  // Get order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      *,
      user:user_id(balance)
    `,
    )
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error("Order not found");
  }

  // Only pending orders can be canceled
  if (order.status !== "pending") {
    throw new Error("Only pending orders can be canceled");
  }

  // Update order status
  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (updateError || !updatedOrder) {
    throw new Error("Failed to cancel order");
  }

  // Refund user
  const { error: refundError } = await supabase
    .from("users")
    .update({ balance: order.user.balance + order.price })
    .eq("id", order.user_id);

  if (refundError) {
    console.error("Failed to refund user:", refundError);
  } else {
    // Record refund transaction
    await supabase.from("transactions").insert({
      user_id: order.user_id,
      type: "refund",
      amount: order.price,
      details: `Refund for canceled order #${order.id}`,
      status: "completed",
      order_id: order.id,
    });
  }

  return updatedOrder as OrderData;
}
