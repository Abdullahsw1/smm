import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Link as LinkIcon,
  User,
  Calendar,
  DollarSign,
  ArrowLeft,
} from "lucide-react";

interface OrderDetailsProps {
  orderId?: string;
  service?: {
    name: string;
    platform: string;
    type: string;
  };
  status?: "pending" | "in-progress" | "completed" | "failed";
  link?: string;
  quantity?: number;
  price?: number;
  createdAt?: string;
  completedAt?: string;
  timeline?: {
    status: string;
    time: string;
    description: string;
  }[];
}

const OrderDetails = ({
  orderId = "ORD-12345",
  service = {
    name: "Instagram Followers",
    platform: "Instagram",
    type: "Followers",
  },
  status = "in-progress",
  link = "https://instagram.com/username",
  quantity = 1000,
  price = 9.99,
  createdAt = "2023-06-15T10:30:00",
  completedAt = "",
  timeline = [
    {
      status: "Order Placed",
      time: "2023-06-15T10:30:00",
      description: "Your order has been received and is being processed.",
    },
    {
      status: "In Progress",
      time: "2023-06-15T10:35:00",
      description: "Your order is now being fulfilled by our service provider.",
    },
    {
      status: "Partial Delivery",
      time: "2023-06-15T11:15:00",
      description: "500 followers have been delivered so far.",
    },
  ],
}: OrderDetailsProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get status badge color and icon
  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return { color: "secondary", icon: <Clock className="h-4 w-4 mr-1" /> };
      case "in-progress":
        return {
          color: "default",
          icon: <RefreshCw className="h-4 w-4 mr-1" />,
        };
      case "completed":
        return {
          color: "secondary",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
        };
      case "failed":
        return {
          color: "destructive",
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
        };
      default:
        return { color: "secondary", icon: <Clock className="h-4 w-4 mr-1" /> };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="bg-background p-6 w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Button>
        <h1 className="text-2xl font-bold mb-2">Order Details</h1>
        <p className="text-muted-foreground">
          View detailed information about your order
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Order ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orderId}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                statusBadge.color as
                  | "default"
                  | "secondary"
                  | "destructive"
                  | "outline"
              }
              className="flex items-center w-fit"
            >
              {statusBadge.icon}
              <span className="capitalize">{status}</span>
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{formatDate(createdAt)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
            <CardDescription>
              Details about the service you ordered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-muted-foreground">
                  {service.platform} - {service.type}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <LinkIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Target Link</p>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline break-all"
                >
                  {link}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Order Details</p>
                <p className="text-sm text-muted-foreground">
                  {quantity} {service.type} for ${price.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Timeline</CardTitle>
            <CardDescription>Progress updates for your order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="relative pl-6 pb-4">
                  {index !== timeline.length - 1 && (
                    <div className="absolute top-2 left-[9px] bottom-0 w-[2px] bg-muted" />
                  )}
                  <div className="absolute top-1 left-0 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                  <div>
                    <p className="font-medium">{event.status}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(event.time)}
                    </p>
                    <p className="text-sm mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Available actions for this order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh Status
            </Button>
            <Button variant="outline">
              <AlertCircle className="h-4 w-4 mr-2" /> Report Issue
            </Button>
            {status === "completed" && (
              <Button>
                <CheckCircle className="h-4 w-4 mr-2" /> Place Similar Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
