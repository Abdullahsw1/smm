import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/dashboard/Sidebar";
import BalanceCard from "@/components/wallet/BalanceCard";
import AddFundsForm from "@/components/wallet/AddFundsForm";
import TransactionHistory from "@/components/wallet/TransactionHistory";

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddFunds, setShowAddFunds] = useState(false);

  const handleAddFundsClick = () => {
    setShowAddFunds(true);
    setActiveTab("add-funds");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="wallet" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Wallet Management</h1>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
              <TabsTrigger value="transactions">
                Transaction History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <BalanceCard onAddFunds={handleAddFundsClick} />
                </div>
                <div className="md:col-span-2">
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-600 font-medium">
                            Total Deposits
                          </p>
                          <p className="text-2xl font-bold">$350.00</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-600 font-medium">
                            Total Spent
                          </p>
                          <p className="text-2xl font-bold">$100.00</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-purple-600 font-medium">
                            Active Orders
                          </p>
                          <p className="text-2xl font-bold">3</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-6">
                    <Card className="bg-white shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-4">
                          Recent Transactions
                        </h3>
                        <TransactionHistory transactions={[]} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="add-funds">
              <div className="max-w-md mx-auto">
                <AddFundsForm
                  onSubmit={(values) => console.log("Form submitted:", values)}
                  isProcessing={false}
                />
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <TransactionHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
