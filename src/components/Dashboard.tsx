import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  Settings,
  ChevronDown,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import ReceiveCrypto from "./ReceiveCrypto";
import SendCrypto from "./SendCrypto";
import ShowKeys from "./ShowKeys";
import { AirdropPanel } from "./AirdropPanel";
import { NotificationContainer } from "./NotificationContainer";
import { useNotifications } from "../hooks/useNotifications";
import { useWalletBalance, MultiWalletKeys } from "../hooks/useWalletBalance";
import ActivityList from "./ActivityList";
import NetworkSelector, { type Network } from "./NetworkSelector";

import { useLocation, useNavigate } from "react-router-dom";

type SingleWalletDetails = {
  count: number;
  type: string;
  nickname: string;
  privateKey: string;
  publicKey: string;
  secretPhrase: string;
};

type MultipleWalletDetails = {
  solana?: SingleWalletDetails;
  ethereum?: SingleWalletDetails;
};

type LocationState = {
  currentWalletDetails?: SingleWalletDetails | MultipleWalletDetails;
};

type WalletDetails = {
  type: string;
  publicKey: string;
  privateKey: string;
  secretPhrase: string;
  nickname: string;
};

export default function Component() {
  const location = useLocation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<Network>({
    id: "eth-mainnet",
    name: "Ethereum Mainnet",
    chainId: "1",
    icon: "/LogoWallets/ethereum.png",
    rpcUrl: "https://mainnet.infura.io/v3/",
    type: "mainnet",
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const [copiedPublicKey, setCopiedPublicKey] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletedNotification, setShowCompletedNotification] = useState(false);
  const [showKeysModal, setShowKeysModal] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [nickname, setNickname] = useState("");
  const [multipleWallets, setMultipleWallets] = useState(false);
  const [multiWalletKeys, setMultiWalletKeys] = useState<MultiWalletKeys | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<"assets" | "activity">("assets");

  const { notifications, addNotification } = useNotifications();
  
  const { balances } = useWalletBalance({
    publicKey,
    selectedCurrency,
    multipleWallets,
    multiWalletKeys,
    pollingInterval: 10000,
  });

  useEffect(() => {
    // If user directly tries to access the dashboard without giving accounts and stuff
    if (!location.state?.currentWalletDetails) {
      addNotification("error", "Can't access the dashboard without account selection/creation! Redirecting to Homepage");
      navigate("/");
      return;
    }

    const { currentWalletDetails } = location.state as LocationState;

    let walletDetails: WalletDetails | undefined;

    if (currentWalletDetails) {
      if ("type" in currentWalletDetails) {
        // Single wallet case
        walletDetails = currentWalletDetails as WalletDetails;
      } else if (currentWalletDetails.solana && currentWalletDetails.ethereum) {
        // Multiple wallets case
        walletDetails = currentWalletDetails.ethereum as WalletDetails;
        setMultipleWallets(true);
        const newMultiWalletKeys: MultiWalletKeys = {
          solana: {
            publicKey: currentWalletDetails.solana.publicKey,
            privateKey: currentWalletDetails.solana.privateKey,
          },
          ethereum: {
            publicKey: currentWalletDetails.ethereum.publicKey,
            privateKey: currentWalletDetails.ethereum.privateKey,
          },
        };
        setMultiWalletKeys(newMultiWalletKeys);
      } else {
        addNotification("error", "No wallet details found");
        navigate("/");
        return;
      }
    }

    // Set wallet details
    if (walletDetails) {
      const { type, publicKey, privateKey, nickname } = walletDetails;
      setSelectedCurrency(type);
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      const name = nickname ? nickname.split(" ")[0] : "User";
      setNickname(name);
    }
  }, [location.state, navigate, addNotification]);

  // Fetch dark mode state and show welcome notification
  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") !== "false";
    setDarkMode(isDarkMode);
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Dark mode changer
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const copyPublicKey = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey);
    setCopiedPublicKey(true);
    addNotification("success", "Public key copied!");
    setTimeout(() => setCopiedPublicKey(false), 2000);
  };

  const copyPrivateKey = () => {
    if (!privateKey) return;
    navigator.clipboard.writeText(privateKey);
    addNotification("success", "Private key copied!");
  };

  const alertMessage = (message?: string) => {
    const alertText = message || "This feature is not available yet. Please wait for the next update";
    addNotification("info", alertText);
  };

  const shareAddress = () => {
    if (!publicKey) {
      addNotification("error", "No public key available");
      return;
    }

    if (navigator.share) {
      navigator
        .share({
          title: "My Crypto Address",
          text: `Here's my public key: ${publicKey}`,
          url: `https://blockchain.explorer/${publicKey}`,
        })
        .then(() => {
          addNotification("success", "Address shared successfully!");
        })
        .catch(() => {
          addNotification("error", "Failed to share address");
        });
    } else {
      addNotification("error", "Sharing is not supported on this device");
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    if (multipleWallets && multiWalletKeys) {
      if (currency === "ETH") {
        setPrivateKey(multiWalletKeys.ethereum.privateKey);
        setPublicKey(multiWalletKeys.ethereum.publicKey);
      } else if (currency === "SOL") {
        setPrivateKey(multiWalletKeys.solana.privateKey);
        setPublicKey(multiWalletKeys.solana.publicKey);
      }
    }
  };

  const getTokenBalance = (currency: string) => {
    if (currency === "ETH") return balances.eth ?? 0;
    if (currency === "SOL") return balances.sol ?? 0;
    return 0;
  };

  const getTokenValue = (currency: string) => {
    if (currency === "ETH") {
      return balances.eth ? (balances.eth * 3562.38).toFixed(2) : "0.00";
    }
    if (currency === "SOL") {
      return balances.sol ? (balances.sol * 210.41).toFixed(2) : "0.00";
    }
    return "0.00";
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-gray-50 dark:bg-[#1C1C1E] text-gray-900 dark:text-white transition-colors duration-300">
        
        {/* MetaMask-style Container */}
        <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-[#24242A] shadow-2xl">
          
          {/* Header */}
          <div className="bg-white dark:bg-[#24242A] border-b border-gray-200 dark:border-[#3A3A3F] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                    <path d="M20 2L35 12V28L20 38L5 28V12L20 2Z" fill="white" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">{nickname || "Account 1"}</span>
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-500 capitalize">{selectedNetwork}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowKeysModal(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-full transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Address Bar */}
            <div className="mt-3 flex items-center justify-center space-x-2 bg-gray-100 dark:bg-[#1C1C1E] rounded-full px-3 py-2">
              <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : "No wallet"}
              </span>
              <button
                onClick={copyPublicKey}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {copiedPublicKey ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>

          {/* Balance Section */}
          <div className="px-4 py-6 text-center bg-gradient-to-b from-white to-gray-50 dark:from-[#24242A] dark:to-[#1C1C1E]">
            <div className="flex items-center justify-center mb-2">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            
            {selectedCurrency ? (
              <>
                <div className="text-4xl font-bold mb-1">
                  {showBalance ? `${getTokenBalance(selectedCurrency)} ${selectedCurrency}` : "••••••"}
                </div>
                <div className="text-gray-500 text-sm">
                  {showBalance ? `$${getTokenValue(selectedCurrency)}` : "••••••"}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm">Select a token below</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-4 pb-4 flex gap-3">
            <button
              onClick={() => setSendModalOpen(true)}
              disabled={!selectedCurrency}
              className="flex-1 flex flex-col items-center justify-center py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <ArrowUpRight className="h-5 w-5 mb-1" />
              <span className="text-sm font-medium">Send</span>
            </button>
            <button
              onClick={() => setReceiveModalOpen(true)}
              className="flex-1 flex flex-col items-center justify-center py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              <ArrowDownLeft className="h-5 w-5 mb-1" />
              <span className="text-sm font-medium">Receive</span>
            </button>
            <button
              onClick={() => alertMessage()}
              className="flex-1 flex flex-col items-center justify-center py-3 border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors"
            >
              <svg className="h-5 w-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
              </svg>
              <span className="text-sm font-medium">Swap</span>
            </button>
          </div>

          {/* Network Selector */}
          <div className="px-4 pb-4">
            <NetworkSelector
              selectedNetwork={selectedNetwork}
              onSelectNetwork={(network) => {
                setSelectedNetwork(network);
                addNotification("success", `Switched to ${network.name}`);
              }}
              onAddNetwork={() => alertMessage("Add custom network feature coming soon")}
            />
          </div>

          {/* Airdrop Section - Compact */}
          {selectedNetwork.type === "testnet" && (
            <div className="px-4 pb-4">
              <AirdropPanel
                publicKey={publicKey}
                selectedNetwork={selectedNetwork.type}
                selectedCurrency={selectedCurrency}
                onSuccess={(msg) => addNotification("success", msg)}
                onError={(msg) => addNotification("error", msg)}
              />
            </div>
          )}

          {/* Tabs */}
          <div className="border-t border-b border-gray-200 dark:border-[#3A3A3F]">
            <div className="flex">
              <button
                onClick={() => setActiveTab("assets")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "assets"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Assets
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "activity"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Activity
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "assets" ? (
            /* Assets List */
            <div className="px-4 py-2">
              {[
                { name: "Ethereum", symbol: "ETH", balance: balances.eth ?? 0, icon: "/LogoWallets/ethereum.png", value: getTokenValue("ETH") },
                { name: "Solana", symbol: "SOL", balance: balances.sol ?? 0, icon: "/LogoWallets/Solana_logo.png", value: getTokenValue("SOL") },
              ].map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleCurrencyChange(token.symbol)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3A3A3F] transition-colors ${
                    selectedCurrency === token.symbol ? "bg-gray-100 dark:bg-[#3A3A3F]" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img src={token.icon} alt={token.name} className="w-8 h-8 rounded-full" />
                    <div className="text-left">
                      <div className="text-sm font-medium">{token.balance} {token.symbol}</div>
                      <div className="text-xs text-gray-500">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${token.value}</div>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => alertMessage("Import tokens feature coming soon")}
                className="w-full mt-4 py-3 text-sm text-orange-500 font-medium hover:bg-gray-50 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors"
              >
                + Import tokens
              </button>
            </div>
          ) : (
            /* Activity List */
            <ActivityList publicKey={publicKey} selectedCurrency={selectedCurrency} />
          )}

        </div>
        


        {/* Notification Container */}
        <NotificationContainer notifications={notifications} />

        {/* Welcome Notification */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-6 right-6 bg-white dark:bg-[#24242A] border border-gray-200 dark:border-[#3A3A3F] rounded-lg shadow-lg p-4 z-50 max-w-sm"
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                onClick={() => setShowWelcome(false)}
                aria-label="Close welcome notification"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-lg font-semibold mb-1">
                Welcome, {nickname}!
              </p>
              <p className="text-sm text-gray-500">
                Your wallet is ready. Start managing your digital assets securely.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {/* Send Crypto Modal */}
          {sendModalOpen && (
            <SendCrypto
              privateKey={privateKey}
              selectedCurrency={selectedCurrency}
              setShowCompletedNotification={setShowCompletedNotification}
              publicKey={publicKey}
              isSubmitting={isSubmitting}
              setSendModalOpen={setSendModalOpen}
              setIsSubmitting={setIsSubmitting}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showCompletedNotification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 bg-white dark:bg-[#24242A] border border-green-500 rounded-lg shadow-lg p-4 z-50"
            >
              <p className="text-lg font-semibold text-green-500 mb-1">
                Transaction Completed
              </p>
              <p className="text-sm text-gray-500">
                Your transaction has been processed successfully.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {receiveModalOpen && (
            <>
              <ReceiveCrypto
                publicKey={publicKey}
                copiedPublicKey={copiedPublicKey}
                copyPublicKey={copyPublicKey}
                shareAddress={shareAddress}
                setReceiveModalOpen={setReceiveModalOpen}
              />
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showKeysModal && (
            <ShowKeys
              classname={""}
              setShowKeysModal={setShowKeysModal}
              privateKey={privateKey}
              publicKey={publicKey}
              copyPrivateKey={copyPrivateKey}
              copyPublicKey={copyPublicKey}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}