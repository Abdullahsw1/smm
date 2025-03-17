import { supabase } from "./supabase";

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeServices: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  failedOrders: number;
  recentActivity: Array<{
    type: string;
    message: string;
    timestamp: string;
    details?: any;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // Get user count
  const { count: userCount, error: userError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (userError) {
    console.error("Error fetching user count:", userError);
  }

  // Get order counts by status
  const { data: orderStats, error: orderError } = await supabase
    .from("orders")
    .select("status, count")
    .order("status")
    .group("status");

  if (orderError) {
    console.error("Error fetching order stats:", orderError);
  }

  // Get total revenue
  const { data: revenueData, error: revenueError } = await supabase
    .from("orders")
    .select("price")
    .in("status", ["completed", "in_progress"]);

  if (revenueError) {
    console.error("Error fetching revenue data:", revenueError);
  }

  // Get active services count
  const { count: serviceCount, error: serviceError } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  if (serviceError) {
    console.error("Error fetching service count:", serviceError);
  }

  // Get recent activity
  const { data: recentOrders, error: recentOrdersError } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      created_at,
      user:user_id(email),
      service:service_id(name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (recentOrdersError) {
    console.error("Error fetching recent orders:", recentOrdersError);
  }

  const { data: recentUsers, error: recentUsersError } = await supabase
    .from("users")
    .select("id, email, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (recentUsersError) {
    console.error("Error fetching recent users:", recentUsersError);
  }

  // Calculate stats
  const totalUsers = userCount || 0;
  const totalOrders =
    orderStats?.reduce((sum, item) => sum + item.count, 0) || 0;
  const totalRevenue =
    revenueData?.reduce((sum, item) => sum + item.price, 0) || 0;
  const activeServices = serviceCount || 0;

  const pendingOrders =
    orderStats?.find((item) => item.status === "pending")?.count || 0;
  const inProgressOrders =
    orderStats?.find((item) => item.status === "in_progress")?.count || 0;
  const completedOrders =
    orderStats?.find((item) => item.status === "completed")?.count || 0;
  const failedOrders =
    orderStats?.find((item) => item.status === "failed")?.count || 0;

  // Combine recent activity
  const recentActivity = [
    ...(recentOrders?.map((order) => ({
      type: "order",
      message: `New order for ${order.service.name}`,
      timestamp: order.created_at,
      details: {
        id: order.id,
        status: order.status,
        user: order.user.email,
      },
    })) || []),
    ...(recentUsers?.map((user) => ({
      type: "user",
      message: `New user registered: ${user.email}`,
      timestamp: user.created_at,
      details: {
        id: user.id,
        email: user.email,
      },
    })) || []),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 5);

  return {
    totalUsers,
    totalOrders,
    totalRevenue,
    activeServices,
    pendingOrders,
    inProgressOrders,
    completedOrders,
    failedOrders,
    recentActivity,
  };
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export async function getOrdersTimeSeries(
  days = 30,
): Promise<TimeSeriesData[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("orders")
    .select("created_at")
    .gte("created_at", startDate.toISOString())
    .order("created_at");

  if (error) {
    console.error("Error fetching orders time series:", error);
    return [];
  }

  // Group by date
  const dateMap = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    dateMap.set(dateStr, 0);
  }

  data.forEach((order) => {
    const dateStr = order.created_at.split("T")[0];
    if (dateMap.has(dateStr)) {
      dateMap.set(dateStr, dateMap.get(dateStr)! + 1);
    }
  });

  // Convert to array and sort by date
  return Array.from(dateMap.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface CategoryData {
  category: string;
  count: number;
}

export async function getOrdersByCategory(): Promise<CategoryData[]> {
  const { data, error } = await supabase.from("orders").select(`
      service:service_id(category)
    `);

  if (error) {
    console.error("Error fetching orders by category:", error);
    return [];
  }

  // Group by category
  const categoryMap = new Map<string, number>();
  data.forEach((order) => {
    const category = order.service.category;
    if (categoryMap.has(category)) {
      categoryMap.set(category, categoryMap.get(category)! + 1);
    } else {
      categoryMap.set(category, 1);
    }
  });

  // Convert to array and sort by count
  return Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
