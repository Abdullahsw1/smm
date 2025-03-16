import React from "react";
import { useParams } from "react-router-dom";
import OrderDetails from "../../components/orders/OrderDetails";

interface OrderPageParams {
  id: string;
}

const OrderPage: React.FC = () => {
  const { id } = useParams<OrderPageParams>();

  // In a real application, you would fetch the order details based on the ID
  // This is just a placeholder for the UI scaffolding
  const orderDetails = {
    orderId: id || "ORD-12345",
    service: {
      name: "Instagram Followers",
      platform: "Instagram",
      type: "Followers",
    },
    status: "in-progress" as const,
    link: "https://instagram.com/username",
    quantity: 1000,
    price: 9.99,
    createdAt: "2023-06-15T10:30:00",
    completedAt: "",
    timeline: [
      {
        status: "Order Placed",
        time: "2023-06-15T10:30:00",
        description: "Your order has been received and is being processed.",
      },
      {
        status: "In Progress",
        time: "2023-06-15T10:35:00",
        description:
          "Your order is now being fulfilled by our service provider.",
      },
      {
        status: "Partial Delivery",
        time: "2023-06-15T11:15:00",
        description: "500 followers have been delivered so far.",
      },
    ],
  };

  return (
    <div className="container mx-auto py-8 bg-background">
      <OrderDetails {...orderDetails} />
    </div>
  );
};

export default OrderPage;
