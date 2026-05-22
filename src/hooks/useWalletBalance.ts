import { useState, useEffect, useCallback } from "react";
import { solBalance, ethBalance } from "../components/scripts/balance";

interface WalletBalances {
  sol: number | null;
  eth: number | null;
}

interface UseWalletBalanceProps {
  publicKey: string;
  selectedCurrency: string;
  multipleWallets: boolean;
  multiWalletKeys: MultiWalletKeys | null;
  pollingInterval?: number;
}

export interface MultiWalletKeys {
  solana: {
    publicKey: string;
    privateKey: string;
  };
  ethereum: {
    publicKey: string;
    privateKey: string;
  };
}

export function useWalletBalance({
  publicKey,
  selectedCurrency,
  multipleWallets,
  multiWalletKeys,
  pollingInterval = 10000, // Default 10 seconds
}: UseWalletBalanceProps) {
  const [balances, setBalances] = useState<WalletBalances>({
    sol: null,
    eth: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey && !multipleWallets) return;

    setIsLoading(true);
    setError(null);

    try {
      if (multipleWallets && multiWalletKeys) {
        // Fetch balance for multiple wallets
        const solanaPublicKey = multiWalletKeys.solana.publicKey;
        const ethereumPublicKey = multiWalletKeys.ethereum.publicKey;

        const [fetchedSolBalance, fetchedEthBalance] = await Promise.all([
          solBalance(solanaPublicKey),
          ethBalance(ethereumPublicKey),
        ]);

        setBalances({
          sol: fetchedSolBalance,
          eth: fetchedEthBalance,
        });
      } else {
        // Single wallet
        if (selectedCurrency === "SOL") {
          const fetchedSolBalance = await solBalance(publicKey);
          setBalances((prev) => ({ ...prev, sol: fetchedSolBalance }));
        } else if (selectedCurrency === "ETH") {
          const fetchedEthBalance = await ethBalance(publicKey);
          setBalances((prev) => ({ ...prev, eth: fetchedEthBalance }));
        }
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, selectedCurrency, multipleWallets, multiWalletKeys]);

  useEffect(() => {
    // Initial fetch
    fetchBalance();

    // Set up polling
    const intervalId = setInterval(fetchBalance, pollingInterval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [fetchBalance, pollingInterval]);

  return { balances, isLoading, error, refetch: fetchBalance };
}
