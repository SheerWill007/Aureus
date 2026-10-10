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
        return <CheckCircle className="h-4 w-4 text-kiwi" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-300" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-white/40" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-red-400" />;
      case "receive":
        return <ArrowDownLeft className="h-5 w-5 text-kiwi" />;
      case "swap":
        return (
          <svg className="h-5 w-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
          </svg>
        );
      default:
        return <AlertCircle className="h-5 w-5 text-white/40" />;
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
        <div className="h-6 w-6 animate-spin border border-kiwi border-t-transparent"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-white/30">
          <Clock className="h-6 w-6 text-white/40" strokeWidth={1.4} />
        </div>
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-white/60">No transactions yet</p>
        <p className="mt-1 text-center text-[10px] text-white/35">
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
          className="flex w-full items-center justify-between border-b border-white/10 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25">
              {getTypeIcon(tx.type)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase tracking-[0.15em]">{tx.type}</span>
                {getStatusIcon(tx.status)}
              </div>
              <span className="text-[10px] text-white/40">{formatDate(tx.timestamp)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-[12px] ${tx.type === "receive" ? "text-kiwi" : "text-white"}`}>
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0"
            style={{ margin: 0 }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md border border-b-0 border-white/25 bg-black p-6 font-mono"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg uppercase tracking-wide">Transaction details</h3>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="text-white/50 hover:text-kiwi"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-dashed border-white/15">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">Status</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedTx.status)}
                    <span className="text-[11px] uppercase tracking-[0.15em]">{selectedTx.status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-dashed border-white/15">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">Amount</span>
                  <span className="text-[11px]">
                    {selectedTx.amount} {selectedTx.token}
                  </span>
                </div>

                {selectedTx.to && (
                  <div className="flex items-center justify-between py-3 border-b border-dashed border-white/15">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">To</span>
                    <span className="text-[11px]">{selectedTx.to}</span>
                  </div>
                )}

                {selectedTx.from && (
                  <div className="flex items-center justify-between py-3 border-b border-dashed border-white/15">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">From</span>
                    <span className="text-[11px]">{selectedTx.from}</span>
                  </div>
                )}

                {selectedTx.gasUsed && (
                  <div className="flex items-center justify-between py-3 border-b border-dashed border-white/15">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">Network Fee</span>
                    <span className="text-[11px]">{selectedTx.gasUsed} {selectedTx.token}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">Transaction Hash</span>
                  <span className="text-[11px]">{selectedTx.hash}</span>
                </div>
              </div>

              <button
                onClick={() => openExplorer(selectedTx.hash)}
                className="btn-kiwi mt-6 w-full"
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
