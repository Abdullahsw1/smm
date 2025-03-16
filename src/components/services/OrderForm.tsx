import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

const formSchema = z.object({
  socialMediaLink: z.string().url({ message: "Please enter a valid URL" }),
  quantity: z.string().min(1, { message: "Please select a quantity" }),
});

interface OrderFormProps {
  serviceId?: string;
  serviceName?: string;
  serviceDescription?: string;
  pricePerUnit?: number;
  estimatedDelivery?: string;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
}

const OrderForm = ({
  serviceId = "instagram-followers-1",
  serviceName = "Instagram Followers",
  serviceDescription = "High quality Instagram followers that stay. No password required.",
  pricePerUnit = 0.99,
  estimatedDelivery = "1-2 days",
  onSubmit = () => {},
}: OrderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState("100");
  const [totalPrice, setTotalPrice] = useState(pricePerUnit * 100);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialMediaLink: "",
      quantity: "100",
    },
  });

  const handleQuantityChange = (value: string) => {
    setSelectedQuantity(value);
    setTotalPrice(pricePerUnit * parseInt(value));
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      onSubmit(data);

      // Reset form after success
      setTimeout(() => {
        setOrderSuccess(false);
        form.reset();
      }, 3000);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{serviceName}</CardTitle>
        <CardDescription>{serviceDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {orderSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <p className="text-center text-lg font-medium">
              Order placed successfully!
            </p>
            <p className="text-center text-sm text-gray-500">
              Your order is now being processed.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    <p className="text-sm font-medium text-blue-700">
                      Service Information
                    </p>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Price per unit:</p>
                      <p className="font-medium">${pricePerUnit.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Estimated delivery:</p>
                      <p className="font-medium">{estimatedDelivery}</p>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="socialMediaLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Media Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/yourusername"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the link to your social media profile or post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleQuantityChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quantity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="250">250</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                          <SelectItem value="1000">1,000</SelectItem>
                          <SelectItem value="2500">2,500</SelectItem>
                          <SelectItem value="5000">5,000</SelectItem>
                          <SelectItem value="10000">10,000</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the quantity you want to order
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-4 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-lg font-bold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-gray-500 text-center">
          By placing an order, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </CardFooter>
    </Card>
  );
};

export default OrderForm;
