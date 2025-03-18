import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderDetails from "../../components/orders/OrderDetails";
import { getOrder } from "../../lib/orders";
import { Layout, LayoutContent } from "../../components/ui/layout";
import { Button } from "../../components/ui/button";
import { AlertCircle } from "lucide-react";

interface OrderPageParams {
  id: string;
}

const OrderPage: React.FC = () => {
  const { id } = useParams<OrderPageParams>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) {
        setError("Order ID not provided");
        setLoading(false);
        return;
      }

      try {
        const order = await getOrder(id);

        // Map the order data to the format expected by OrderDetails component
        setOrderDetails({
          orderId: order.id,
          service: {
            name: order.service?.name || "Unknown Service",
            platform: order.service?.category || "Unknown",
            type: order.service?.category || "Unknown",
          },
          status: order.status === "in_progress" ? "in-progress" : order.status,
          link: order.link,
          quantity: order.quantity,
          price: order.price,
          createdAt: order.created_at,
          completedAt: order.status === "completed" ? order.updated_at : "",
          timeline: [
            {
              status: "Order Placed",
              time: order.created_at,
              description:
                "Your order has been received and is being processed.",
            },
            ...(order.status !== "pending"
              ? [
                  {
                    status: "In Progress",
                    time: order.updated_at,
                    description:
                      "Your order is now being fulfilled by our service provider.",
                  },
                ]
              : []),
            ...(order.status === "completed"
              ? [
                  {
                    status: "Completed",
                    time: order.updated_at,
                    description: `Your order has been successfully delivered.`,
                  },
                ]
              : []),
            ...(order.status === "failed"
              ? [
                  {
                    status: "Failed",
                    time: order.updated_at,
                    description:
                      "There was an issue with your order. Please contact support.",
                  },
                ]
              : []),
          ],
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Order not found");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <LayoutContent className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </LayoutContent>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <LayoutContent className="container mx-auto py-8">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{error}</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
          </div>
        </LayoutContent>
      </Layout>
    );
  }

  return (
    <Layout>
      <LayoutContent className="container mx-auto py-8 bg-background">
        {orderDetails && <OrderDetails {...orderDetails} />}
      </LayoutContent>
    </Layout>
  );
};

export default OrderPage;
