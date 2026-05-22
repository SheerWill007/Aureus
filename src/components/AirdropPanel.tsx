import { useState } from "react";
import { motion } from "framer-motion";
import { CloudDrizzle } from "lucide-react";
import { airdrop } from "./scripts/airdropSol";

interface AirdropPanelProps {
  publicKey: string;
  selectedNetwork: string;
  selectedCurrency: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function AirdropPanel({
  publicKey,
  selectedNetwork,
  selectedCurrency,
  onSuccess,
  onError,
}: AirdropPanelProps) {
  const [airdropAmount, setAirdropAmount] = useState(1);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleAirdropRequest = async () => {
    if (isRequesting || !publicKey) return;

    setIsRequesting(true);
    try {
      const response = await airdrop(publicKey, airdropAmount);
      console.log("Airdrop response:", response);
      onSuccess(`Successfully requested ${airdropAmount} SOL airdrop`);
    } catch (e: unknown) {
      let errorMessage = "Unknown error occurred";

      if (e instanceof Error) {
        try {
          const jsonString = e.message.substring(e.message.indexOf("{"));
          const errorObj = JSON.parse(jsonString);
          errorMessage = errorObj.error?.message || e.message;
        } catch {
          errorMessage = e.message;
        }
      }

      onError(errorMessage);
    } finally {
      // Reset button after 5 seconds
      setTimeout(() => setIsRequesting(false), 5000);
    }
  };

  if (selectedNetwork !== "devnet" || selectedCurrency !== "SOL") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-8 glass-card p-4 flex flex-wrap items-center gap-4"
    >
      <span className="text-sm font-medium text-web3-gold flex items-center">
        <CloudDrizzle className="h-4 w-4 mr-2" />
        Devnet Airdrop
      </span>
      <select
        value={airdropAmount}
        onChange={(e) => setAirdropAmount(parseFloat(e.target.value))}
        className="text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-web3-gold"
        aria-label="Select airdrop amount"
      >
        <option value="0.5">0.5 SOL</option>
        <option value="1">1 SOL</option>
        <option value="2">2 SOL</option>
        <option value="2.5">2.5 SOL</option>
      </select>
      <button
        onClick={handleAirdropRequest}
        className={`px-4 py-2 rounded-lg bg-web3-blue hover:bg-web3-blue/90 font-medium transition-colors flex items-center ${
          isRequesting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isRequesting}
        aria-label="Request airdrop"
      >
        {isRequesting ? "Requesting..." : "Request Airdrop"}
      </button>
    </motion.div>
  );
}
