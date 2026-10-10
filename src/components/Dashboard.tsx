import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
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
import { HatchStrip, TopBar } from "./brand";
import { GridFloor } from "./landing/graphics";

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

  // Auto-dismiss the welcome notification
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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

  const tokens = [
    { name: "Ethereum", symbol: "ETH", balance: balances.eth ?? 0, icon: "/LogoWallets/ethereum.png", value: getTokenValue("ETH") },
    { name: "Solana", symbol: "SOL", balance: balances.sol ?? 0, icon: "/LogoWallets/Solana_logo.png", value: getTokenValue("SOL") },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <TopBar
        right={
          <>
            <button onClick={() => setShowKeysModal(true)} className="btn-bracket">
              .keys [show]
            </button>
            <button onClick={() => navigate("/")} className="btn-bracket hidden sm:inline-flex">
              .exit
            </button>
          </>
        }
      />

      <main className="relative z-10 mx-auto max-w-xl px-4 pb-24 pt-4">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[11px] text-white/40">03 / dashboard</p>
            <h1 className="display text-3xl">{nickname || "Account 1"}</h1>
          </div>
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
            <span className="h-1.5 w-1.5 animate-pulse bg-kiwi" />
            {selectedNetwork.type}
          </span>
        </div>

        {/* ---------- Balance panel ---------- */}
        <section className="border border-white/40 bg-black">
          <HatchStrip label={selectedNetwork.name} />

          <div className="flex items-center justify-between gap-3 border-b border-white/15 px-5 py-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/45">Address</span>
            <button
              onClick={copyPublicKey}
              className="flex min-w-0 items-center gap-2 border border-white/20 px-2.5 py-1 text-[11px] text-white/80 transition-colors hover:border-kiwi hover:text-kiwi"
            >
              <span className="truncate">
                {publicKey ? `${publicKey.slice(0, 6)}…${publicKey.slice(-4)}` : "No wallet"}
              </span>
              {copiedPublicKey ? <Check className="h-3 w-3 shrink-0" /> : <Copy className="h-3 w-3 shrink-0" />}
            </button>
          </div>

          <div className="relative overflow-hidden px-5 pb-10 pt-8 text-center">
            <GridFloor className="top-[55%] h-[90%] opacity-50" />
            <div className="relative z-10">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="mx-auto mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/45 transition-colors hover:text-white"
              >
                Balance {showBalance ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>
              {selectedCurrency ? (
                <>
                  <div className="font-display text-5xl font-medium tracking-tight text-white">
                    {showBalance ? getTokenBalance(selectedCurrency) : "••••"}
                    <span className="ml-2 text-2xl text-kiwi">{selectedCurrency}</span>
                  </div>
                  <div className="mt-2 text-[12px] text-white/50">
                    {showBalance ? `≈ $${getTokenValue(selectedCurrency)} USD` : "••••••"}
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-white/45">Select a token below</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/15">
            <ActionButton
              label="Send"
              primary
              disabled={!selectedCurrency}
              onClick={() => setSendModalOpen(true)}
              icon={<ArrowUpRight className="h-4 w-4" />}
            />
            <ActionButton label="Receive" onClick={() => setReceiveModalOpen(true)} icon={<ArrowDownLeft className="h-4 w-4" />} />
            <ActionButton
              label="Swap"
              onClick={() => alertMessage()}
              icon={
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
                </svg>
              }
            />
          </div>
        </section>

        {/* ---------- Network ---------- */}
        <div className="mt-4">
          <NetworkSelector
            selectedNetwork={selectedNetwork}
            onSelectNetwork={(network) => {
              setSelectedNetwork(network);
              addNotification("success", `Switched to ${network.name}`);
            }}
            onAddNetwork={() => alertMessage("Add custom network feature coming soon")}
          />
        </div>

        {selectedNetwork.type === "testnet" && (
          <div className="mt-4">
            <AirdropPanel
              publicKey={publicKey}
              selectedNetwork={selectedNetwork.type}
              selectedCurrency={selectedCurrency}
              onSuccess={(msg) => addNotification("success", msg)}
              onError={(msg) => addNotification("error", msg)}
            />
          </div>
        )}

        {/* ---------- Assets / Activity ---------- */}
        <section className="mt-4 border border-white/25">
          <div role="tablist" className="flex border-b border-white/15">
            {(["assets", "activity"] as const).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 py-3 text-[10px] uppercase tracking-[0.35em] transition-colors ${
                  activeTab === tab ? "text-white" : "text-white/35 hover:text-white/70"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.span layoutId="dash-tab" className="absolute inset-x-6 -bottom-px h-px bg-kiwi" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "assets" ? (
            <div>
              {tokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleCurrencyChange(token.symbol)}
                  className={`relative flex w-full items-center justify-between border-b border-white/10 px-4 py-3.5 transition-colors hover:bg-white/[0.04] ${
                    selectedCurrency === token.symbol ? "bg-white/[0.04]" : ""
                  }`}
                >
                  {selectedCurrency === token.symbol && <span className="absolute inset-y-0 left-0 w-0.5 bg-kiwi" />}
                  <div className="flex items-center gap-3">
                    <img src={token.icon} alt="" className="h-8 w-8 rounded-full bg-white/5 object-contain p-0.5" />
                    <div className="text-left">
                      <div className="text-[12px] text-white">
                        {token.balance} {token.symbol}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-white/40">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-[12px] text-white/80">${token.value}</div>
                </button>
              ))}

              <button
                onClick={() => alertMessage("Import tokens feature coming soon")}
                className="m-4 w-[calc(100%-2rem)] border border-dashed border-white/25 py-3 text-[10px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:border-kiwi hover:text-kiwi"
              >
                + Import tokens
              </button>
            </div>
          ) : (
            <ActivityList publicKey={publicKey} selectedCurrency={selectedCurrency} />
          )}
        </section>
      </main>

      <NotificationContainer notifications={notifications} />

      {/* Welcome toast */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="fixed right-4 top-20 z-50 max-w-xs border border-kiwi/60 bg-black p-4 font-mono"
          >
            <button
              className="absolute right-2 top-2 text-white/40 transition-colors hover:text-kiwi"
              onClick={() => setShowWelcome(false)}
              aria-label="Close welcome notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="text-[10px] uppercase tracking-[0.25em] text-kiwi">[ready]</p>
            <p className="mt-1 text-[12px] text-white">Welcome, {nickname}.</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-white/50">
              Your wallet is live. Keys stay on this device.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 z-50 border border-kiwi bg-black p-4 font-mono"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-kiwi">[confirmed]</p>
            <p className="mt-1 text-[12px] text-white">Transaction completed</p>
            <p className="mt-1 text-[10.5px] text-white/50">Your transaction has been processed successfully.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {receiveModalOpen && (
          <ReceiveCrypto
            publicKey={publicKey}
            copiedPublicKey={copiedPublicKey}
            copyPublicKey={copyPublicKey}
            shareAddress={shareAddress}
            setReceiveModalOpen={setReceiveModalOpen}
          />
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
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  primary = false,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-1.5 border-r border-white/15 py-4 text-[10px] uppercase tracking-[0.25em] transition-colors last:border-r-0 disabled:cursor-not-allowed disabled:opacity-35 ${
        primary ? "bg-kiwi text-black hover:bg-white" : "text-white hover:bg-white hover:text-black"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
