import React from "react";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "order_payment";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  description: string;
}

interface TransactionHistoryProps {
  transactions?: Transaction[];
}

const TransactionHistory = ({ transactions = [] }: TransactionHistoryProps) => {
  // Default mock data if no transactions are provided
  const defaultTransactions: Transaction[] = [
    {
      id: "TX123456",
      type: "deposit",
      amount: 100.0,
      date: "2023-06-15T10:30:00",
      status: "completed",
      description: "Added funds via PayPal",
    },
    {
      id: "TX123457",
      type: "order_payment",
      amount: -25.5,
      date: "2023-06-14T15:45:00",
      status: "completed",
      description: "Payment for Instagram followers service",
    },
    {
      id: "TX123458",
      type: "deposit",
      amount: 50.0,
      date: "2023-06-10T09:15:00",
      status: "pending",
      description: "Added funds via Credit Card",
    },
    {
      id: "TX123459",
      type: "withdrawal",
      amount: -30.0,
      date: "2023-06-05T14:20:00",
      status: "completed",
      description: "Withdrawal to bank account",
    },
    {
      id: "TX123460",
      type: "order_payment",
      amount: -15.75,
      date: "2023-06-01T11:10:00",
      status: "failed",
      description: "Failed payment for Facebook likes service",
    },
  ];

  const displayTransactions =
    transactions.length > 0 ? transactions : defaultTransactions;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: Transaction["type"], amount: number) => {
    if (type === "deposit") {
      return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
    } else if (type === "withdrawal" || type === "order_payment") {
      return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Transaction History
        </h2>
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search transactions..."
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>A list of your recent transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(transaction.type, transaction.amount)}
                    <span className="capitalize">
                      {transaction.type.replace("_", " ")}
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className={
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toFixed(2)} USD
                </TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionHistory;
