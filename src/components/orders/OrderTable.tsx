import React from "react";
import { Eye, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  service: string;
  link: string;
  quantity: number;
  price: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  date: string;
}

interface OrderTableProps {
  orders?: Order[];
  showCaption?: boolean;
}

const getStatusBadgeVariant = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "in-progress":
      return "default";
    case "completed":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const OrderTable = ({
  orders = [
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
  ],
  showCaption = true,
}: OrderTableProps) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <Table>
        {showCaption && (
          <TableCaption>A list of your recent orders.</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.service}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                <a
                  href={order.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {order.link}
                </a>
              </TableCell>
              <TableCell className="text-right">
                {order.quantity.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                ${order.price.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeVariant(
                    order.status as Order["status"],
                  )}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
