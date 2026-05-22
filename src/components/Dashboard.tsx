import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  Settings,
  MoreVertical,
  ChevronDown,
  Copy,
  Check,
  X,
  CloudDrizzle,
  TrendingUp,
} from "lucide-react";
import ReceiveCrypto from "./RecieveCrypto";
import SendCrypto from "./SendCrypto";
import ShowKeys from "./ShowKeys";
import {
  CryptoRow,
  DashboardCard,
  Transaction,
  QuickActionButton,
} from "./DashboardComponents";

import { useLocation, useNavigate } from "react-router-dom";
import { solBalance, ethBalance } from "./scripts/balance.ts";
import { airdrop } from "./scripts/airdropSol.ts";

export default function Component() {
  const location = useLocation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  //@ts-expect-error    //ts-ignore
  const [secretPhrase, setSecretPhrase] = useState("");
  const [accountSelectorOpen, setAccountSelectorOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("Main Account");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("mainnet");
  const [showWelcome, setShowWelcome] = useState(true);
  const [copiedPublicKey, setCopiedPublicKey] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletedNotification, setShowCompletedNotification] =
    useState(false);
  const [showKeysModal, setShowKeysModal] = useState(false);
  // oncopy functionfor notification general component
  //@ts-expect-error //ts-ignore
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [airdropAmount, setAirdropAmount] = useState(1);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [nickname, setNickname] = useState("");

  //state vars for fetching balance
  const [sol, setSol] = useState<number | null>(null);
  const [eth, setEth] = useState<number | null>(null);
  const [multipleWallets, setMultipleWallets] = useState(false);
  const [multiWalletKeys, setMultiWalletKeys] = useState<
    MultiWalletKwys | object
  >({});

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);
  const toggleAccountSelector = () =>
    setAccountSelectorOpen(!accountSelectorOpen);

  type MultiWalletKwys = {
    solana: {
      publicKey: string;
      privateKey: string;
    };
    ethereum: {
      publicKey: string;
      privateKey: string;
    };
  };

  useEffect(() => {
    // If user directly tries to access the dashboard without giving accounts and stuff
    if (!location.state?.currentWalletDetails) {
      alert(
        "Can't access the dashboard without account selection/creation! Redirecting to Homepage"
      );
      navigate("/"); // Redirect to the homepage
      return; // Return early
    }

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

    const { currentWalletDetails } = location.state as LocationState;

    type WalletDetails = {
      type: string;
      publicKey: string;
      privateKey: string;
      secretPhrase: string;
      nickname: string;
    };

    let walletDetails: WalletDetails | undefined;
    let multipleWalletDetails: MultipleWalletDetails | undefined;

    if (currentWalletDetails) {
      if ("type" in currentWalletDetails) {
        // Single wallet case
        walletDetails = currentWalletDetails as WalletDetails;
      } else if (currentWalletDetails.solana && currentWalletDetails.ethereum) {
        // Multiple wallets case - handle as needed
        walletDetails = currentWalletDetails.ethereum as WalletDetails;
        setMultipleWallets(true);
        multipleWalletDetails = currentWalletDetails as MultipleWalletDetails;
        const newMultiWalletKeys: MultiWalletKwys = {
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
        alert("no wallet details found");
      }
    }

    // All wallet set the public key and private key
    if (walletDetails) {
      const { type, publicKey, privateKey, secretPhrase, nickname } =
        walletDetails;
      setSelectedCurrency(type);
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      setSecretPhrase(secretPhrase);
      const name = nickname ? nickname.split(" ")[0] : "User";
      setNickname(name);
    }

    // Define the fetch function for fetching balances
    const fetchBalance = async () => {
      try {
        if (multipleWallets) {
          // Fetch balance for multiple wallets
          const { solana, ethereum } = multipleWalletDetails as {
            solana: WalletDetails;
            ethereum: WalletDetails;
          };

          const solanaPublicKey = solana.publicKey;
          const ethereumPublicKey = ethereum.publicKey;

          const fetchedSolBalance = await solBalance(solanaPublicKey);
          setSol(fetchedSolBalance);
          const fetchedEthBalance = await ethBalance(ethereumPublicKey);
          setEth(fetchedEthBalance);
        } else {
          if (selectedCurrency === "SOL") {
            const fetchedSolBalance = await solBalance(publicKey);
            setSol(fetchedSolBalance);
          } else if (selectedCurrency === "ETH") {
            const fetchedEthBalance = await ethBalance(publicKey);
            setEth(fetchedEthBalance);
          }
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    // Initial fetch of balances
    fetchBalance();

    // Periodic fetch of balances every 2 seconds
    const intervalId = setInterval(fetchBalance, 1000);

    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => clearInterval(intervalId);
  }, [location.state, multipleWallets, navigate]);

  //
  //
  //

  //

  //Fetches the Dark mode state from earlier and also shows the welcome notification
  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") !== "false";
    setDarkMode(isDarkMode);
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  //darkMode Changer
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const accounts = ["Main Account", "Savings Account", "Trading Account"];

  const handleAirdropRequest = async () => {
    try {
      const response = await airdrop(publicKey, airdropAmount);
      console.log(response, "response is this");
    } catch (e: unknown) {
      let errorMessage = "Unknown error";

      if (e instanceof Error) {
        try {
          // Try to parse e.message assuming it contains the JSON string
          const jsonString = e.message.substring(e.message.indexOf("{"));
          const errorObj = JSON.parse(jsonString);
          errorMessage =
            (errorObj.error?.message || e.message) +
            "before fallback original message";
        } catch {
          errorMessage = e.message; // Fallback to the original message if parsing fails
        }
      }

      alert(errorMessage);
    }
  };
  //@ts-expect-error    //ts-ignore
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const addNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    }, 5000);
  };

  const copyPublicKey = () => {
    navigator.clipboard.writeText(publicKey);
    setCopiedPublicKey(true);
    addNotification("success", "Public key copied!");
    setTimeout(() => setCopiedPublicKey(false), 2000);
  };

  const copyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey);
    setCopiedPrivateKey(true);
    addNotification("success", "Private key copied!");
    setTimeout(() => setCopiedPrivateKey(false), 2000);
  };

  //fix the transaction

  //ts-ignore

  // const handleSendSubmit = (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setTimeout(() => {
  //     setIsSubmitting(false);
  //     setSendModalOpen(false);
  //     addNotification("success", "Transaction completed successfully!");
  //   }, 3000);
  // };

  const alertMessage = (message?: string) => {
    const alertMessage = !message
      ? "This feature is not available yet. Please wait for the next update"
      : message;
    alert(alertMessage);
  };

  const shareAddress = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Crypto Address",
          text: `Here's my public key: ${publicKey}`,
          url: `https:///${publicKey}`,
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
  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-web3-dark-primary dark:to-web3-dark-surface text-gray-900 dark:text-web3-white transition-colors duration-300">
        
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-web3-gold/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-web3-blue/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-web3-dark-surface/80 border-b border-gray-200 dark:border-white/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2L35 12V28L20 38L5 28V12L20 2Z" fill="url(#gold-gradient)" stroke="#F59E0B" strokeWidth="2"/>
                <path d="M20 10L28 15V25L20 30L12 25V15L20 10Z" fill="#0A0B0F" stroke="#F59E0B" strokeWidth="1.5"/>
                <defs>
                  <linearGradient id="gold-gradient" x1="5" y1="2" x2="35" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F59E0B"/>
                    <stop offset="1" stopColor="#D97706"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-2xl font-space font-bold text-gradient">Aureus</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={toggleAccountSelector}
                  className="flex items-center space-x-2 glass px-4 py-2 text-sm font-medium hover:border-web3-gold/50 transition-colors"
                >
                  <span>{selectedAccount}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {accountSelectorOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass-card py-1 z-20"
                    >
                      {accounts.map((account) => (
                        <button
                          key={account}
                          onClick={() => {
                            setSelectedAccount(account);
                            setAccountSelectorOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                        >
                          {account}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="relative">
                <button
                  onClick={toggleSettings}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  aria-label="Settings"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                <AnimatePresence>
                  {settingsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass-card py-1 z-20"
                    >
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                        Profile Settings
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                        Security
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                        Notifications
                      </button>
                      <button
                        onClick={() => {
                          setSettingsOpen(false);
                          setShowKeysModal(true);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                      >
                        View Account Keys
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
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
                {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
              </span>
              <button
                onClick={copyPublicKey}
                className="text-web3-gold hover:text-web3-gold/80 transition-colors flex-shrink-0"
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
              >
                <option value="mainnet">Mainnet</option>
                <option value="devnet">Devnet</option>
              </select>
            </div>
          </div>

          {/* Airdrop Section */}
          {selectedNetwork === "devnet" && selectedCurrency === "SOL" && (
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
              >
                <option value="0.5">0.5 SOL</option>
                <option value="1">1 SOL</option>
                <option value="2">2 SOL</option>
                <option value="2.5">2.5 SOL</option>
              </select>
              <button
                onClick={() => {
                  handleAirdropRequest();
                  setButtonDisabled(true);
                }}
                className={`px-4 py-2 rounded-lg bg-web3-blue hover:bg-web3-blue/90 font-medium transition-colors flex items-center ${
                  buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={buttonDisabled}
              >
                Request Airdrop
              </button>
            </motion.div>
          )}

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
                {selectedCurrency === "ETH" ? eth : sol} {selectedCurrency}
              </p>
              <p className="text-lg text-web3-muted">
                ≈ $
                {selectedCurrency === "ETH"
                  ? eth
                    ? (eth * 3562.38).toFixed(2)
                    : "0.00"
                  : sol
                  ? (sol * 210.41).toFixed(2)
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
                      onClick={() => setSelectedCurrency("BTC")}
                    />
                    <CryptoRow
                      name="Ethereum"
                      type="ETH"
                      iconPath="/LogoWallets/ethereum.png"
                      balance={eth ? eth : 0}
                      value="$1,000,000"
                      onClick={() => {
                        setSelectedCurrency("ETH");
                        if (multipleWallets) {
                          setPrivateKey(
                            (multiWalletKeys as MultiWalletKwys).ethereum
                              .privateKey
                          );
                          setPublicKey(
                            (multiWalletKeys as MultiWalletKwys).ethereum
                              .publicKey
                          );
                        }
                      }}
                    />
                    <CryptoRow
                      name="Solana"
                      type="SOL"
                      iconPath="/LogoWallets/Solana_logo.png"
                      balance={sol ? sol : 0}
                      value="$500,000"
                      onClick={() => {
                        setSelectedCurrency("SOL");
                        if (multipleWallets) {
                          setPrivateKey(
                            (multiWalletKeys as MultiWalletKwys).solana
                              .privateKey
                          );
                          setPublicKey(
                            (multiWalletKeys as MultiWalletKwys).solana
                              .publicKey
                          );
                        }
                      }}
                    />
                    <CryptoRow
                      name="Ripple"
                      type="XRP"
                      iconPath="/LogoWallets/ripple.png"
                      balance="1000"
                      value="$50,000"
                      onClick={() => setSelectedCurrency("XRP")}
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
                <button onClick={() => alert("Feature coming soon")} className="hover:text-web3-gold transition-colors">
                  Privacy Policy
                </button>
                <button onClick={() => alert("Feature coming soon")} className="hover:text-web3-gold transition-colors">
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

interface Notification {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}
function Notification({ id, type, message }: Notification) {
  const icons = {
    success: <Check className="h-6 w-6 text-green-500" />,
    error: <AlertCircle className="h-6 w-6 text-red-500" />,
    info: <AlertCircle className="h-6 w-6 text-blue-500" />,
  };

  const colors = {
    success: "bg-green-100 dark:bg-green-800 border-green-500",
    error: "bg-red-100 dark:bg-red-800 border-red-500",
    info: "bg-blue-100 dark:bg-blue-800 border-blue-500",
  };

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`fixed bottom-4 right-4 flex items-center space-x-2 rounded-lg border-l-4 p-4 shadow-lg ${colors[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
}
