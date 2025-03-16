import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Package, CheckCircle, DollarSign } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  bgColor?: string;
}

const StatCard = ({
  title = "Stat Title",
  value = "$0.00",
  icon = <DollarSign className="h-5 w-5" />,
  trend,
  bgColor = "bg-white",
}: StatCardProps) => {
  return (
    <Card className={`${bgColor} shadow-sm border-none`}>
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && (
            <p
              className={`text-xs ${trend.positive ? "text-green-500" : "text-red-500"} flex items-center`}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="p-3 rounded-full bg-primary/10">{icon}</div>
      </CardContent>
    </Card>
  );
};

interface StatCardsProps {
  walletBalance?: string;
  activeOrders?: number;
  completedOrders?: number;
  totalSpent?: string;
}

const StatCards = ({
  walletBalance = "$250.00",
  activeOrders = 5,
  completedOrders = 42,
  totalSpent = "$1,250.00",
}: StatCardsProps) => {
  return (
    <div className="w-full bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Wallet Balance"
          value={walletBalance}
          icon={<Wallet className="h-5 w-5 text-primary" />}
          trend={{ value: "10% this week", positive: true }}
          bgColor="bg-white"
        />
        <StatCard
          title="Active Orders"
          value={activeOrders.toString()}
          icon={<Package className="h-5 w-5 text-amber-500" />}
          bgColor="bg-white"
        />
        <StatCard
          title="Completed Orders"
          value={completedOrders.toString()}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          trend={{ value: "23% this month", positive: true }}
          bgColor="bg-white"
        />
        <StatCard
          title="Total Spent"
          value={totalSpent}
          icon={<DollarSign className="h-5 w-5 text-blue-500" />}
          trend={{ value: "5% this month", positive: false }}
          bgColor="bg-white"
        />
      </div>
    </div>
  );
};

export default StatCards;
