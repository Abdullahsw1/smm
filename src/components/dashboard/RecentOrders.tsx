import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Order {
  id: string;
  service: string;
  platform: string;
  link: string;
  quantity: number;
  price: number;
  status: "pending" | "in-progress" | "completed" | "failed";
  date: string;
}

interface RecentOrdersProps {
  orders?: Order[];
  limit?: number;
  showViewAll?: boolean;
  onViewOrder?: (id: string) => void;
  onViewAllOrders?: () => void;
}

const getStatusColor = (status: Order["status"]): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "in-progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "failed":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders = [
    {
      id: "ORD-1234",
      service: "Instagram Followers",
      platform: "Instagram",
      link: "instagram.com/username",
      quantity: 1000,
      price: 9.99,
      status: "completed",
      date: "2023-06-15",
    },
    {
      id: "ORD-1235",
      service: "YouTube Views",
      platform: "YouTube",
      link: "youtube.com/watch?v=abc123",
      quantity: 5000,
      price: 24.99,
      status: "in-progress",
      date: "2023-06-14",
    },
    {
      id: "ORD-1236",
      service: "Facebook Likes",
      platform: "Facebook",
      link: "facebook.com/post/123",
      quantity: 500,
      price: 4.99,
      status: "pending",
      date: "2023-06-13",
    },
    {
      id: "ORD-1237",
      service: "Twitter Retweets",
      platform: "Twitter",
      link: "twitter.com/username/status/123",
      quantity: 200,
      price: 7.99,
      status: "failed",
      date: "2023-06-12",
    },
  ],
  limit = 5,
  showViewAll = true,
  onViewOrder = () => {},
  onViewAllOrders = () => {},
}) => {
  const displayedOrders = orders.slice(0, limit);

  return (
    <div className="w-full rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
        {showViewAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAllOrders}
            className="text-sm"
          >
            View All
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedOrders.length > 0 ? (
            displayedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <div>{order.service}</div>
                    <div className="text-xs text-gray-500">
                      {order.platform}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{order.quantity.toLocaleString()}</TableCell>
                <TableCell>${order.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(order.status)}
                  >
                    {order.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(order.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewOrder(order.id)}
                    title="View Order Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No recent orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption>A list of your recent orders.</TableCaption>
      </Table>
    </div>
  );
};

export default RecentOrders;
