import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreditCard, DollarSign } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  amount: z.string().min(1, { message: "Amount is required" }),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

interface AddFundsFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  isProcessing?: boolean;
}

const AddFundsForm = ({
  onSubmit = () => {},
  isProcessing = false,
}: AddFundsFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      paymentMethod: "creditCard",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Add Funds to Wallet</CardTitle>
        <CardDescription>
          Add funds to your wallet to purchase services on our platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="0.00" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the amount you want to add to your wallet.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setPaymentMethod(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="creditCard">
                        Credit/Debit Card
                      </SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bankTransfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod === "creditCard" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="1234 5678 9012 3456"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="p-4 border rounded-md bg-blue-50">
                <p className="text-sm text-center">
                  You will be redirected to PayPal to complete your payment.
                </p>
              </div>
            )}

            {paymentMethod === "bankTransfer" && (
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-sm mb-2">Bank Account Details:</p>
                <p className="text-sm">Bank: Example Bank</p>
                <p className="text-sm">Account Number: 1234567890</p>
                <p className="text-sm">Routing Number: 987654321</p>
                <p className="text-sm mt-2">
                  Please include your username in the transfer description.
                </p>
              </div>
            )}

            {paymentMethod === "crypto" && (
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-sm mb-2">Cryptocurrency Wallet Address:</p>
                <p className="text-sm break-all font-mono">
                  0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
                </p>
                <p className="text-sm mt-2">
                  We accept Bitcoin, Ethereum, and USDT.
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Add Funds"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 border-t pt-4">
        <p className="text-xs text-muted-foreground">
          All transactions are secure and encrypted.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=40&q=80"
            alt="Visa"
            className="h-6"
          />
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=40&q=80"
            alt="Mastercard"
            className="h-6"
          />
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=40&q=80"
            alt="PayPal"
            className="h-6"
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default AddFundsForm;
