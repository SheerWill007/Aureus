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
      className="flex flex-wrap items-center gap-3 border border-dashed border-kiwi/50 p-3"
    >
      <span className="flex flex-1 items-center text-[10px] uppercase tracking-[0.2em] text-kiwi">
        <CloudDrizzle className="h-4 w-4 mr-2" />
        Devnet Airdrop
      </span>
      <select
        value={airdropAmount}
        onChange={(e) => setAirdropAmount(parseFloat(e.target.value))}
        className="border border-white/25 bg-black px-2 py-1.5 text-[11px] text-white focus:border-kiwi focus:outline-none"
        aria-label="Select airdrop amount"
      >
        <option value="0.5">0.5 SOL</option>
        <option value="1">1 SOL</option>
        <option value="2">2 SOL</option>
        <option value="2.5">2.5 SOL</option>
      </select>
      <button
        onClick={handleAirdropRequest}
        className={`btn-kiwi px-3 py-1.5 ${
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
