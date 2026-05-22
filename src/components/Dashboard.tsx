import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  Copy,
  Check,
  X,
  TrendingUp,
} from "lucide-react";
import ReceiveCrypto from "./ReceiveCrypto";
import SendCrypto from "./SendCrypto";
import ShowKeys from "./ShowKeys";
import {
  CryptoRow,
  DashboardCard,
  Transaction,
  QuickActionButton,
} from "./DashboardComponents";
import { WalletHeader } from "./WalletHeader";
import { AirdropPanel } from "./AirdropPanel";
import { NotificationContainer } from "./NotificationContainer";
import { useNotifications } from "../hooks/useNotifications";
import { useWalletBalance, MultiWalletKeys } from "../hooks/useWalletBalance";

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
  const [selectedNetwork, setSelectedNetwork] = useState("mainnet");
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

  const { notifications, addNotification } = useNotifications();
  
  const { balances } = useWalletBalance({
    publicKey,
    selectedCurrency,
    multipleWallets,
    multiWalletKeys,
    pollingInterval: 10000, // 10 seconds instead of 1 second
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

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
  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-web3-dark-primary dark:to-web3-dark-surface text-gray-900 dark:text-web3-white transition-colors duration-300">
        
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-web3-gold/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-web3-blue/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <WalletHeader 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          onShowKeys={() => setShowKeysModal(true)}
        />
        <main className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-space font-bold mb-2">Dashboard</h1>
            <p className="text-web3-muted">Manage your digital assets</p>
          </motion.div>

          <div className="mb-8 glass-card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <span className="text-sm font-medium text-web3-muted flex-shrink-0">Wallet:</span>
              <span className="text-sm font-mono bg-white/5 rounded px-3 py-1 truncate">
                {publicKey ? `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}` : "No wallet"}
              </span>
              <button
                onClick={copyPublicKey}
                className="text-web3-gold hover:text-web3-gold/80 transition-colors flex-shrink-0"
                aria-label="Copy public key"
              >
                {copiedPublicKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-web3-muted">Network:</span>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-web3-gold"
                aria-label="Select network"
              >
                <option value="mainnet">Mainnet</option>
                <option value="devnet">Devnet</option>
              </select>
            </div>
          </div>

          {/* Airdrop Section */}
          <AirdropPanel
            publicKey={publicKey}
            selectedNetwork={selectedNetwork}
            selectedCurrency={selectedCurrency}
            onSuccess={(msg) => addNotification("success", msg)}
            onError={(msg) => addNotification("error", msg)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <DashboardCard
              title="Total Balance"
              value="$24,567.89"
              icon={<Wallet className="h-6 w-6" />}
            />
            <DashboardCard
              title="24h Change"
              value="+5.67%"
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <DashboardCard
              title="Active Assets"
              value="4"
              icon={<BarChart3 className="h-6 w-6" />}
            />
          </div>

          {/* Selected Currency Balance */}
          {selectedCurrency && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-8 glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-space font-bold">{selectedCurrency} Wallet</h2>
                <span className={selectedCurrency === "SOL" ? "chain-badge-sol" : "chain-badge-eth"}>
                  {selectedCurrency}
                </span>
              </div>
              <p className="text-4xl font-space font-bold text-web3-gold mb-2">
                {selectedCurrency === "ETH" ? balances.eth ?? 0 : balances.sol ?? 0} {selectedCurrency}
              </p>
              <p className="text-lg text-web3-muted">
                ≈ $
                {selectedCurrency === "ETH"
                  ? balances.eth
                    ? (balances.eth * 3562.38).toFixed(2)
                    : "0.00"
                  : balances.sol
                  ? (balances.sol * 210.41).toFixed(2)
                  : "0.00"}
              </p>
            </motion.div>
          )}

          {/* Holdings and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-space font-bold mb-4">Your Assets</h2>
              <div className="glass-card p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left pb-4 text-sm font-medium text-web3-muted">Asset</th>
                      <th className="text-right pb-4 text-sm font-medium text-web3-muted">Balance</th>
                      <th className="text-right pb-4 text-sm font-medium text-web3-muted">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CryptoRow
                      name="Bitcoin"
                      type="BTC"
                      iconPath="/LogoWallets/Bitcoin.png"
                      balance="0.5"
                      value="$2,500,000"
                      onClick={() => handleCurrencyChange("BTC")}
                    />
                    <CryptoRow
                      name="Ethereum"
                      type="ETH"
                      iconPath="/LogoWallets/ethereum.png"
                      balance={balances.eth ?? 0}
                      value="$1,000,000"
                      onClick={() => handleCurrencyChange("ETH")}
                    />
                    <CryptoRow
                      name="Solana"
                      type="SOL"
                      iconPath="/LogoWallets/Solana_logo.png"
                      balance={balances.sol ?? 0}
                      value="$500,000"
                      onClick={() => handleCurrencyChange("SOL")}
                    />
                    <CryptoRow
                      name="Ripple"
                      type="XRP"
                      iconPath="/LogoWallets/ripple.png"
                      balance="1000"
                      value="$50,000"
                      onClick={() => handleCurrencyChange("XRP")}
                    />
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-space font-bold mb-4">Recent Activity</h2>
              <div className="glass-card p-6 space-y-3">
                <Transaction
                  type="sent"
                  amount="0.1 BTC"
                  recipient="0x1234...5678"
                  sender="0xabcd...efgh"
                />
                <Transaction
                  type="received"
                  amount="100 XRP"
                  recipient="0x1234...5678"
                  sender="0xabcd...efgh"
                />
                <Transaction
                  type="sent"
                  amount="1.5 ETH"
                  recipient="0x9876...5432"
                  sender="0x1234...5678"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-2xl font-space font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <QuickActionButton
                label="Send"
                icon={<ArrowUpRight className="h-6 w-6" />}
                onClick={() => setSendModalOpen(true)}
              />
              <QuickActionButton
                label="Receive"
                icon={<ArrowDownLeft className="h-6 w-6" />}
                onClick={() => setReceiveModalOpen(true)}
              />
              <QuickActionButton
                label="Swap"
                icon={<ArrowUpRight className="h-6 w-6 transform rotate-90" />}
                onClick={() => alertMessage()}
              />
              <QuickActionButton
                label="Buy"
                icon={<Wallet className="h-6 w-6" />}
                onClick={() => alertMessage()}
              />
            </div>
          </div>
        </main>
        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-web3-dark-surface/50 backdrop-blur-sm py-8 mt-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2L35 12V28L20 38L5 28V12L20 2Z" fill="url(#gold-gradient-footer)" stroke="#F59E0B" strokeWidth="2"/>
                  <path d="M20 10L28 15V25L20 30L12 25V15L20 10Z" fill="#0A0B0F" stroke="#F59E0B" strokeWidth="1.5"/>
                  <defs>
                    <linearGradient id="gold-gradient-footer" x1="5" y1="2" x2="35" y2="38" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F59E0B"/>
                      <stop offset="1" stopColor="#D97706"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-xl font-space font-bold text-gradient">Aureus</span>
                <span className="text-sm text-web3-muted">by</span>
                <a
                  href="https://github.com/SheerWill007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-web3-gold hover:text-web3-gold/80 transition-colors"
                >
                  SheerWill007
                </a>
              </div>
              <nav className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0 text-sm text-web3-muted">
                <button onClick={() => alertMessage("Feature coming soon")} className="hover:text-web3-gold transition-colors">
                  Privacy Policy
                </button>
                <button onClick={() => alertMessage("Feature coming soon")} className="hover:text-web3-gold transition-colors">
                  Terms of Service
                </button>
                <a
                  href="mailto:manashpratimbhuyan8134@gmail.com"
                  className="hover:text-web3-gold transition-colors"
                >
                  Contact
                </a>
              </nav>
              <p className="text-sm text-web3-muted">
                © 2024 Aureus. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Notification Container */}
        <NotificationContainer notifications={notifications} />

        {/* Welcome Notification */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-6 right-6 glass-card p-4 z-50 max-w-sm"
            >
              <button
                className="absolute top-2 right-2 text-web3-muted hover:text-web3-white transition-colors"
                onClick={() => setShowWelcome(false)}
                aria-label="Close welcome notification"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-lg font-space font-semibold mb-1">
                Welcome, {nickname}!
              </p>
              <p className="text-sm text-web3-muted">
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
              className="fixed bottom-6 right-6 glass-card p-4 z-50 border-green-500/50"
            >
              <p className="text-lg font-space font-semibold text-green-500 mb-1">
                Transaction Completed
              </p>
              <p className="text-sm text-web3-muted">
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