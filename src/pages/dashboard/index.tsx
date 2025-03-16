import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Sidebar from "@/components/dashboard/Sidebar";
import StatCards from "@/components/dashboard/StatCards";
import RecentOrders from "@/components/dashboard/RecentOrders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, TrendingUp, Bell, Calendar } from "lucide-react";

interface DashboardProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  walletBalance?: string;
  activeOrders?: number;
  completedOrders?: number;
  totalSpent?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  userName = "John Doe",
  userEmail = "john@example.com",
  userAvatar = "",
  walletBalance = "$250.00",
  activeOrders = 5,
  completedOrders = 42,
  totalSpent = "$1,250.00",
}) => {
  const navigate = useNavigate();

  const handleViewOrder = (id: string) => {
    navigate(`/orders/${id}`);
  };

  const handleViewAllOrders = () => {
    navigate("/orders");
  };

  const handleAddFunds = () => {
    navigate("/wallet");
  };

  const handleNewOrder = () => {
    navigate("/services");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Helmet>
        <title>Dashboard | SMM Panel</title>
      </Helmet>

      <Sidebar
        userName={userName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        activeItem="dashboard"
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {userName}</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-3 flex">
              <Button onClick={handleAddFunds} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
              <Button
                onClick={handleNewOrder}
                variant="outline"
                className="flex items-center"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </div>
          </div>

          {/* Stat Cards */}
          <StatCards
            walletBalance={walletBalance}
            activeOrders={activeOrders}
            completedOrders={completedOrders}
            totalSpent={totalSpent}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <RecentOrders
                onViewOrder={handleViewOrder}
                onViewAllOrders={handleViewAllOrders}
              />
            </div>

            {/* Side Cards */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleNewOrder}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Place New Order
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleAddFunds}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Funds to Wallet
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/account")}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Update Account Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Order Completed</p>
                        <p className="text-xs text-gray-500">
                          Your order #ORD-1234 has been completed
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Funds Added</p>
                        <p className="text-xs text-gray-500">
                          $50.00 has been added to your wallet
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Bell className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">New Service Added</p>
                        <p className="text-xs text-gray-500">
                          Check out our new Instagram Reels Views service
                        </p>
                        <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
