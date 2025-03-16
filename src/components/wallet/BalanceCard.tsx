import React from "react";
import { PlusCircle, DollarSign } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";

interface BalanceCardProps {
  balance?: number;
  currency?: string;
  onAddFunds?: () => void;
}

const BalanceCard = ({
  balance = 250.0,
  currency = "USD",
  onAddFunds = () => console.log("Add funds clicked"),
}: BalanceCardProps) => {
  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Wallet Balance
        </CardTitle>
        <CardDescription>Your current available funds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-4xl font-bold text-center mb-2">
            {currency === "USD" ? "$" : ""}
            {balance.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            Available for purchasing services
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button
          onClick={onAddFunds}
          className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Funds
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BalanceCard;
