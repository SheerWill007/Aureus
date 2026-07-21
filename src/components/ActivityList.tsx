import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

type Transaction = {
  hash: string;
  type: "send" | "receive" | "swap" | "approve";
  status: "pending" | "confirmed" | "failed";
  amount: string;
  token: string;
  timestamp: number;
  to?: string;
  from?: string;
  gasUsed?: string;
};

type ActivityListProps = {
  publicKey: string;
  selectedCurrency: string;
};

export default function ActivityList({ publicKey, selectedCurrency }: ActivityListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    // Fetch transactions for the current wallet
    // This is a placeholder - integrate with your actual blockchain API
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Simulated data - replace with actual API calls
        const mockTransactions: Transaction[] = [
          {
            hash: "0x1234...5678",
            type: "receive",
            status: "confirmed",
            amount: "0.5",
            token: selectedCurrency,
            timestamp: Date.now() - 3600000,
            from: "0xabcd...efgh",
          },
          {
            hash: "0x8765...4321",
            type: "send",
            status: "confirmed",
            amount: "0.25",
            token: selectedCurrency,
            timestamp: Date.now() - 7200000,
            to: "0xijkl...mnop",
            gasUsed: "0.0021",
          },
        ];
        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (publicKey && selectedCurrency) {
      fetchTransactions();
    }
  }, [publicKey, selectedCurrency]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case "receive":
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case "swap":
        return (
          <svg className="h-5 w-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
          </svg>
        );
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const openExplorer = (hash: string) => {
    const explorerUrl =
      selectedCurrency === "ETH"
        ? `https://etherscan.io/tx/${hash}`
        : `https://solscan.io/tx/${hash}`;
    window.open(explorerUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#3A3A3F] flex items-center justify-center mb-4">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm text-center">No transactions yet</p>
        <p className="text-gray-400 text-xs text-center mt-1">
          Your transaction history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {transactions.map((tx) => (
        <motion.button
          key={tx.hash}
          onClick={() => setSelectedTx(tx)}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] transition-colors text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1C1C1E] flex items-center justify-center">
              {getTypeIcon(tx.type)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium capitalize">{tx.type}</span>
                {getStatusIcon(tx.status)}
              </div>
              <span className="text-xs text-gray-500">{formatDate(tx.timestamp)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${tx.type === "receive" ? "text-green-500" : "text-gray-900 dark:text-white"}`}>
              {tx.type === "receive" ? "+" : "-"}{tx.amount} {tx.token}
            </div>
          </div>
        </motion.button>
      ))}

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTx && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTx(null)}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-0"
            style={{ margin: 0 }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#24242A] w-full max-w-md rounded-t-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#3A3A3F]">
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedTx.status)}
                    <span className="text-sm font-medium capitalize">{selectedTx.status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#3A3A3F]">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="text-sm font-medium">
                    {selectedTx.amount} {selectedTx.token}
                  </span>
                </div>

                {selectedTx.to && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#3A3A3F]">
                    <span className="text-sm text-gray-500">To</span>
                    <span className="text-sm font-mono">{selectedTx.to}</span>
                  </div>
                )}

                {selectedTx.from && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#3A3A3F]">
                    <span className="text-sm text-gray-500">From</span>
                    <span className="text-sm font-mono">{selectedTx.from}</span>
                  </div>
                )}

                {selectedTx.gasUsed && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-[#3A3A3F]">
                    <span className="text-sm text-gray-500">Network Fee</span>
                    <span className="text-sm font-medium">{selectedTx.gasUsed} {selectedTx.token}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-500">Transaction Hash</span>
                  <span className="text-sm font-mono">{selectedTx.hash}</span>
                </div>
              </div>

              <button
                onClick={() => openExplorer(selectedTx.hash)}
                className="w-full mt-6 flex items-center justify-center space-x-2 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                <span>View on Explorer</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
