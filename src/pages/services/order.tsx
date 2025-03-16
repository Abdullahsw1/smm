import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import OrderForm from "@/components/services/OrderForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServiceDetails {
  id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  estimatedDelivery: string;
  platform: string;
  category: string;
}

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Mock service data - in a real app, this would be fetched from an API
  const serviceDetails: ServiceDetails = {
    id: id || "instagram-followers-1",
    name: "Instagram Followers",
    description:
      "High quality Instagram followers that stay. No password required.",
    pricePerUnit: 0.99,
    estimatedDelivery: "1-2 days",
    platform: "Instagram",
    category: "Followers",
  };

  const handleOrderSubmit = (data: any) => {
    // In a real app, this would send the order to an API
    console.log("Order submitted:", { serviceId: serviceDetails.id, ...data });

    // Redirect to orders page after successful submission
    setTimeout(() => {
      navigate("/orders");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 flex items-center gap-2"
            onClick={() => navigate("/services")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">Place Order</h1>
          <p className="text-gray-500 mt-2">
            Complete the form below to place your order
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <OrderForm
              serviceId={serviceDetails.id}
              serviceName={serviceDetails.name}
              serviceDescription={serviceDetails.description}
              pricePerUnit={serviceDetails.pricePerUnit}
              estimatedDelivery={serviceDetails.estimatedDelivery}
              onSubmit={handleOrderSubmit}
            />
          </div>

          <div className="md:col-span-1">
            <Card className="bg-white sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Service Information
                </CardTitle>
                <CardDescription>
                  Details about the selected service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <p className="text-gray-500">Platform:</p>
                      <p className="font-medium">{serviceDetails.platform}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Category:</p>
                      <p className="font-medium">{serviceDetails.category}</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-500">Description:</p>
                    <p className="mt-1">{serviceDetails.description}</p>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">How it works:</h4>
                    <ol className="text-sm space-y-2 list-decimal list-inside">
                      <li>Enter your social media profile or post link</li>
                      <li>Select the desired quantity</li>
                      <li>Review the total price</li>
                      <li>Submit your order</li>
                      <li>We'll process your order automatically</li>
                    </ol>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Need help?</h4>
                    <p className="text-sm">
                      If you have any questions about this service, please
                      contact our support team.
                    </p>
                    <Button variant="outline" className="w-full mt-2">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
