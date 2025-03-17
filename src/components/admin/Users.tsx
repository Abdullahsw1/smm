import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserWithStats } from "@/lib/users";
import { updateUser, addFunds } from "@/lib/users";

interface AdminUsersProps {
  users: UserWithStats[];
  isLoading: boolean;
  searchQuery: string;
  onRefresh: () => void;
}

export default function AdminUsers({
  users,
  isLoading,
  searchQuery,
  onRefresh,
}: AdminUsersProps) {
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("manual");

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      (user.full_name && user.full_name.toLowerCase().includes(query))
    );
  });

  const handleEditUser = (user: UserWithStats) => {
    setSelectedUser(user);
    setEditedName(user.full_name || "");
    setIsEditing(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, {
        full_name: editedName,
      });
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleAddFundsToUser = async () => {
    if (!selectedUser) return;

    try {
      const amount = parseFloat(fundAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      await addFunds(selectedUser.id, amount, paymentMethod);
      setIsAddingFunds(false);
      setFundAmount("");
      onRefresh();
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  const openAddFundsDialog = (user: UserWithStats) => {
    setSelectedUser(user);
    setIsAddingFunds(true);
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading users...</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Registered
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Orders</th>
                    <th className="text-left py-3 px-4 font-medium">Balance</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {user.id.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4">{user.full_name || "N/A"}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{user.order_count}</td>
                      <td className="py-3 px-4">
                        ${user.balance?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAddFundsDialog(user)}
                          >
                            Add Funds
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Funds Dialog */}
      <Dialog open={isAddingFunds} onOpenChange={setIsAddingFunds}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <select
                id="payment-method"
                className="w-full p-2 border rounded-md"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="manual">Manual Adjustment</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingFunds(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFundsToUser}>Add Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
