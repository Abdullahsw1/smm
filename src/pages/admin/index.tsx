import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Users,
  Package,
  BarChart,
  Settings,
  RefreshCw,
  Plus,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/auth";
import { getDashboardStats } from "@/lib/stats";
import { getUsers } from "@/lib/users";
import { getOrders } from "@/lib/orders";
import { getServices } from "@/lib/services";
import { getProviders } from "@/lib/providers";
import { syncProviderServices } from "@/lib/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, adminData, isAdmin } = useAuth();

  // Redirect if not logged in as admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      // Wait a short time to ensure auth context is fully loaded
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Admin dashboard check:", {
        user: !!user,
        userId: user?.id,
        isAdmin,
        isLoading,
        adminData: !!adminData,
      });

      if (!isLoading && (!user || !isAdmin)) {
        console.log("Not admin, redirecting to login");
        navigate("/admin/login");
      } else if (!isLoading && user && isAdmin) {
        console.log("Admin confirmed, showing dashboard");
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, isAdmin, isLoading, navigate, adminData]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard | SMM Panel</title>
      </Helmet>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-col md:w-64 md:bg-gray-900 md:text-white">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold">SMM Panel Admin</h2>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center w-full p-3 rounded-md ${activeTab === "dashboard" ? "bg-gray-800" : "hover:bg-gray-800"}`}
            >
              <BarChart className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center w-full p-3 rounded-md ${activeTab === "users" ? "bg-gray-800" : "hover:bg-gray-800"}`}
            >
              <Users className="mr-3 h-5 w-5" />
              <span>User Management</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center w-full p-3 rounded-md ${activeTab === "orders" ? "bg-gray-800" : "hover:bg-gray-800"}`}
            >
              <Package className="mr-3 h-5 w-5" />
              <span>Order Management</span>
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`flex items-center w-full p-3 rounded-md ${activeTab === "services" ? "bg-gray-800" : "hover:bg-gray-800"}`}
            >
              <RefreshCw className="mr-3 h-5 w-5" />
              <span>Service Management</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center w-full p-3 rounded-md ${activeTab === "settings" ? "bg-gray-800" : "hover:bg-gray-800"}`}
            >
              <Settings className="mr-3 h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                {adminData?.full_name?.charAt(0) || "A"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {adminData?.full_name || "Admin User"}
                </p>
                <p className="text-xs text-gray-400">
                  {adminData?.email || "admin@smmpanel.com"}
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="mt-4 w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">1,248</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        +12% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">3,427</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        +8% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$24,780</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        +15% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">142</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        +3 new services added
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4 py-2">
                        <p className="font-medium">New Order #ORD-5782</p>
                        <p className="text-sm text-muted-foreground">
                          User johndoe placed an order for Instagram Followers
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          2 hours ago
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4 py-2">
                        <p className="font-medium">Order Completed #ORD-5780</p>
                        <p className="text-sm text-muted-foreground">
                          Order for Facebook Page Likes was completed
                          successfully
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          3 hours ago
                        </p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4 py-2">
                        <p className="font-medium">New User Registration</p>
                        <p className="text-sm text-muted-foreground">
                          jane.smith@example.com registered a new account
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          5 hours ago
                        </p>
                      </div>
                      <div className="border-l-4 border-yellow-500 pl-4 py-2">
                        <p className="font-medium">API Integration Updated</p>
                        <p className="text-sm text-muted-foreground">
                          Updated API connection with SMMStone provider
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Yesterday
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">User Management</h2>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="search"
                        placeholder="Search users..."
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Add User
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">
                              ID
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Name
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Registered
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Orders
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Balance
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">1</td>
                            <td className="py-3 px-4">John Doe</td>
                            <td className="py-3 px-4">john.doe@example.com</td>
                            <td className="py-3 px-4">2023-05-12</td>
                            <td className="py-3 px-4">24</td>
                            <td className="py-3 px-4">$125.50</td>
                            <td className="py-3 px-4">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                Active
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive">
                                  Block
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">2</td>
                            <td className="py-3 px-4">Jane Smith</td>
                            <td className="py-3 px-4">
                              jane.smith@example.com
                            </td>
                            <td className="py-3 px-4">2023-06-18</td>
                            <td className="py-3 px-4">12</td>
                            <td className="py-3 px-4">$78.25</td>
                            <td className="py-3 px-4">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                Active
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive">
                                  Block
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">3</td>
                            <td className="py-3 px-4">Robert Johnson</td>
                            <td className="py-3 px-4">robert.j@example.com</td>
                            <td className="py-3 px-4">2023-04-05</td>
                            <td className="py-3 px-4">36</td>
                            <td className="py-3 px-4">$210.75</td>
                            <td className="py-3 px-4">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                Pending
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive">
                                  Block
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Order Management</h2>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="search"
                        placeholder="Search orders..."
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button>
                      <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">
                              Order ID
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              User
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Service
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Link
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Quantity
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Price
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Date
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">ORD-5782</td>
                            <td className="py-3 px-4">John Doe</td>
                            <td className="py-3 px-4">Instagram Followers</td>
                            <td className="py-3 px-4 truncate max-w-[150px]">
                              <a
                                href="#"
                                className="text-blue-600 hover:underline"
                              >
                                https://instagram.com/johndoe
                              </a>
                            </td>
                            <td className="py-3 px-4">1,000</td>
                            <td className="py-3 px-4">$9.99</td>
                            <td className="py-3 px-4">2023-06-20</td>
                            <td className="py-3 px-4">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                In Progress
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                <Button size="sm" variant="outline">
                                  Update
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">ORD-5781</td>
                            <td className="py-3 px-4">Jane Smith</td>
                            <td className="py-3 px-4">YouTube Views</td>
                            <td className="py-3 px-4 truncate max-w-[150px]">
                              <a
                                href="#"
                                className="text-blue-600 hover:underline"
                              >
                                https://youtube.com/watch?v=abc123
                              </a>
                            </td>
                            <td className="py-3 px-4">5,000</td>
                            <td className="py-3 px-4">$24.99</td>
                            <td className="py-3 px-4">2023-06-19</td>
                            <td className="py-3 px-4">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                Pending
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                <Button size="sm" variant="outline">
                                  Update
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">ORD-5780</td>
                            <td className="py-3 px-4">Robert Johnson</td>
                            <td className="py-3 px-4">Facebook Page Likes</td>
                            <td className="py-3 px-4 truncate max-w-[150px]">
                              <a
                                href="#"
                                className="text-blue-600 hover:underline"
                              >
                                https://facebook.com/robertj
                              </a>
                            </td>
                            <td className="py-3 px-4">500</td>
                            <td className="py-3 px-4">$14.99</td>
                            <td className="py-3 px-4">2023-06-18</td>
                            <td className="py-3 px-4">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                Completed
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                <Button size="sm" variant="outline">
                                  Update
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Service Management</h2>
                  <div className="flex space-x-2">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Add Service
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" /> Sync with API
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">
                              ID
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Service Name
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Category
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Price
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Min
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Max
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              API Provider
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">1</td>
                            <td className="py-3 px-4">Instagram Followers</td>
                            <td className="py-3 px-4">Instagram</td>
                            <td className="py-3 px-4">$0.99 per 100</td>
                            <td className="py-3 px-4">100</td>
                            <td className="py-3 px-4">10,000</td>
                            <td className="py-3 px-4">SMMStone</td>
                            <td className="py-3 px-4">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                Active
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive">
                                  Disable
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">2</td>
                            <td className="py-3 px-4">Facebook Page Likes</td>
                            <td className="py-3 px-4">Facebook</td>
                            <td className="py-3 px-4">$1.49 per 100</td>
                            <td className="py-3 px-4">100</td>
                            <td className="py-3 px-4">5,000</td>
                            <td className="py-3 px-4">SMMStone</td>
                            <td className="py-3 px-4">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                Active
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive">
                                  Disable
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">3</td>
                            <td className="py-3 px-4">YouTube Views</td>
                            <td className="py-3 px-4">YouTube</td>
                            <td className="py-3 px-4">$1.99 per 1000</td>
                            <td className="py-3 px-4">1000</td>
                            <td className="py-3 px-4">50,000</td>
                            <td className="py-3 px-4">SMMStone</td>
                            <td className="py-3 px-4">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                Active
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive">
                                  Disable
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <h2 className="text-2xl font-bold">System Settings</h2>

                <Card>
                  <CardHeader>
                    <CardTitle>API Integration Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        SMMStone API Key
                      </label>
                      <Input
                        type="password"
                        value="*************************"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        SMMStone API URL
                      </label>
                      <Input
                        type="text"
                        value="https://smmstone.com/api/v2"
                        className="w-full"
                      />
                    </div>
                    <div className="pt-4">
                      <Button>Save API Settings</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Site Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Site Name
                      </label>
                      <Input type="text" value="SMM Panel" className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Site Description
                      </label>
                      <Input
                        type="text"
                        value="Social Media Marketing Services"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Contact Email
                      </label>
                      <Input
                        type="email"
                        value="support@smmpanel.com"
                        className="w-full"
                      />
                    </div>
                    <div className="pt-4">
                      <Button>Save Site Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
