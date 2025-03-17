import { supabase } from "./supabase";
import { UserData } from "./auth";

export interface UserWithStats extends UserData {
  order_count: number;
  total_spent: number;
}

export async function getUsers(): Promise<UserWithStats[]> {
  // Get users with their order stats
  const { data, error } = await supabase.rpc("get_users_with_stats");

  if (error) {
    console.error("Error fetching users:", error);
    // Fallback to just getting users without stats
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersError) {
      throw new Error("Failed to fetch users");
    }

    return usersData.map((user) => ({
      ...user,
      order_count: 0,
      total_spent: 0,
    })) as UserWithStats[];
  }

  return data as UserWithStats[];
}

export async function updateUser(
  userId: string,
  updates: Partial<Omit<UserData, "id" | "created_at">>,
): Promise<UserData> {
  const { data, error } = await supabase
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Failed to update user");
  }

  return data as UserData;
}

export async function addFunds(
  userId: string,
  amount: number,
  paymentMethod: string,
): Promise<void> {
  // Get current balance
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("balance")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    throw new Error("User not found");
  }

  // Update balance
  const { error: updateError } = await supabase
    .from("users")
    .update({ balance: user.balance + amount })
    .eq("id", userId);

  if (updateError) {
    throw new Error("Failed to update balance");
  }

  // Record transaction
  const { error: transactionError } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      type: "deposit",
      amount,
      details: `Deposit via ${paymentMethod}`,
      status: "completed",
    });

  if (transactionError) {
    console.error("Failed to record transaction:", transactionError);
  }
}

export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch transactions");
  }

  return data;
}
