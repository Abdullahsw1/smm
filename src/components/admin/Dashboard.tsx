import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/lib/stats";

interface AdminDashboardProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export default function AdminDashboard({
  stats,
  isLoading,
}: AdminDashboardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading dashboard data...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        No dashboard data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.recentActivity.filter((a) => a.type === "user").length} new
              this week
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
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingOrders} pending, {stats.inProgressOrders} in
              progress
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
            <p className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              From {stats.completedOrders + stats.inProgressOrders} orders
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
            <p className="text-2xl font-bold">{stats.activeServices}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Across multiple categories
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
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => {
                let borderColor = "border-gray-300";
                if (activity.type === "order") {
                  borderColor = "border-blue-500";
                } else if (activity.type === "user") {
                  borderColor = "border-purple-500";
                }

                return (
                  <div
                    key={index}
                    className={`border-l-4 ${borderColor} pl-4 py-2`}
                  >
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.details && activity.details.status && (
                        <span className="mr-2">
                          Status: {activity.details.status}
                        </span>
                      )}
                      {activity.details && activity.details.user && (
                        <span>User: {activity.details.user}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground">
                No recent activity
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${(stats.completedOrders / stats.totalOrders) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">
                  {stats.completedOrders} Completed
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${(stats.inProgressOrders / stats.totalOrders) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">
                  {stats.inProgressOrders} In Progress
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{
                      width: `${(stats.pendingOrders / stats.totalOrders) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">
                  {stats.pendingOrders} Pending
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-600 h-2.5 rounded-full"
                    style={{
                      width: `${(stats.failedOrders / stats.totalOrders) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">
                  {stats.failedOrders} Failed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin?tab=orders&status=pending"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <p className="font-medium">Pending Orders</p>
                <p className="text-2xl font-bold mt-2">{stats.pendingOrders}</p>
              </a>
              <a
                href="/admin?tab=services"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <p className="font-medium">Manage Services</p>
                <p className="text-2xl font-bold mt-2">
                  {stats.activeServices}
                </p>
              </a>
              <a
                href="/admin?tab=users"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <p className="font-medium">User Management</p>
                <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
              </a>
              <a
                href="/admin?tab=settings"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <p className="font-medium">API Settings</p>
                <p className="text-sm mt-2">Configure providers</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
