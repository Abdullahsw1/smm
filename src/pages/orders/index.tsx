import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Layout, LayoutHeader, LayoutContent } from "@/components/ui/layout";
import OrderFilters from "@/components/orders/OrderFilters";
import OrderTable from "@/components/orders/OrderTable";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface Order {
  id: string;
  service: string;
  link: string;
  quantity: number;
  price: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  date: string;
}

const OrdersPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-1234",
      service: "Instagram Followers",
      link: "https://instagram.com/username",
      quantity: 1000,
      price: 9.99,
      status: "completed",
      date: "2023-06-15",
    },
    {
      id: "ORD-1235",
      service: "Facebook Page Likes",
      link: "https://facebook.com/page",
      quantity: 500,
      price: 5.99,
      status: "in-progress",
      date: "2023-06-16",
    },
    {
      id: "ORD-1236",
      service: "YouTube Views",
      link: "https://youtube.com/watch?v=abcdef",
      quantity: 5000,
      price: 19.99,
      status: "pending",
      date: "2023-06-17",
    },
    {
      id: "ORD-1237",
      service: "Twitter Followers",
      link: "https://twitter.com/username",
      quantity: 300,
      price: 7.99,
      status: "cancelled",
      date: "2023-06-18",
    },
    {
      id: "ORD-1238",
      service: "Instagram Likes",
      link: "https://instagram.com/post/123",
      quantity: 2000,
      price: 12.99,
      status: "completed",
      date: "2023-06-19",
    },
    {
      id: "ORD-1239",
      service: "TikTok Followers",
      link: "https://tiktok.com/@username",
      quantity: 1500,
      price: 14.99,
      status: "in-progress",
      date: "2023-06-20",
    },
  ]);

  const handleFilterChange = (filters: {
    status: string;
    dateRange: string;
    serviceType: string;
    search: string;
  }) => {
    // In a real application, this would filter the orders based on the selected filters
    // For now, we'll just simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // In a real application, this would fetch the latest orders from the server
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Orders | SMM Panel</title>
      </Helmet>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-500 mt-1">
                View and manage all your orders
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <OrderFilters onFilterChange={handleFilterChange} />

          {isLoading ? (
            <div className="w-full bg-white rounded-lg shadow-sm p-8 flex justify-center items-center">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-gray-500">Loading orders...</p>
              </div>
            </div>
          ) : (
            <OrderTable orders={orders} />
          )}

          <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{orders.length}</span>{" "}
              orders
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary/10">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
