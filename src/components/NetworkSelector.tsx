import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Plus, Settings } from "lucide-react";

type Network = {
  id: string;
  name: string;
  chainId: string;
  icon: string;
  rpcUrl: string;
  type: "mainnet" | "testnet";
};

const PREDEFINED_NETWORKS: Network[] = [
  {
    id: "eth-mainnet",
    name: "Ethereum Mainnet",
    chainId: "1",
    icon: "/LogoWallets/ethereum.png",
    rpcUrl: "https://mainnet.infura.io/v3/",
    type: "mainnet",
  },
  {
    id: "eth-sepolia",
    name: "Sepolia Testnet",
    chainId: "11155111",
    icon: "/LogoWallets/ethereum.png",
    rpcUrl: "https://sepolia.infura.io/v3/",
    type: "testnet",
  },
  {
    id: "polygon",
    name: "Polygon Mainnet",
    chainId: "137",
    icon: "/LogoWallets/polygon.png",
    rpcUrl: "https://polygon-rpc.com/",
    type: "mainnet",
  },
  {
    id: "arbitrum",
    name: "Arbitrum One",
    chainId: "42161",
    icon: "/LogoWallets/arbitrum.png",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    type: "mainnet",
  },
  {
    id: "optimism",
    name: "Optimism",
    chainId: "10",
    icon: "/LogoWallets/optimism.png",
    rpcUrl: "https://mainnet.optimism.io",
    type: "mainnet",
  },
  {
    id: "base",
    name: "Base",
    chainId: "8453",
    icon: "/LogoWallets/base.png",
    rpcUrl: "https://mainnet.base.org",
    type: "mainnet",
  },
];

type NetworkSelectorProps = {
  selectedNetwork: Network;
  onSelectNetwork: (network: Network) => void;
  onAddNetwork?: () => void;
};

export default function NetworkSelector({
  selectedNetwork,
  onSelectNetwork,
  onAddNetwork,
}: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTestnets, setShowTestnets] = useState(false);

  const filteredNetworks = PREDEFINED_NETWORKS.filter((network) =>
    showTestnets ? true : network.type === "mainnet"
  );

  const handleSelectNetwork = (network: Network) => {
    onSelectNetwork(network);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between border border-white/20 px-4 py-2.5 transition-colors hover:border-kiwi"
      >
        <div className="flex items-center space-x-2">
          <div className="h-1.5 w-1.5 bg-kiwi"></div>
          <span className="text-[11px] uppercase tracking-[0.15em]">{selectedNetwork.name}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-white/50 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden border border-white/25 bg-black shadow-[0_30px_60px_-20px_rgba(0,0,0,1)]"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <div className="p-2">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/45">Select network</span>
                  <button className="p-1 text-white/50 transition-colors hover:text-kiwi">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>

                {/* Networks List */}
                <div className="space-y-1">
                  {filteredNetworks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => handleSelectNetwork(network)}
                      className="flex w-full items-center justify-between px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={network.icon}
                          alt={network.name}
                          className="h-7 w-7 rounded-full bg-white/5 object-contain p-0.5"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/LogoWallets/ethereum.png";
                          }}
                        />
                        <div className="text-left">
                          <div className="text-[11px] text-white">{network.name}</div>
                          <div className="text-[10px] text-white/40">Chain ID: {network.chainId}</div>
                        </div>
                      </div>
                      {selectedNetwork.id === network.id && (
                        <Check className="h-4 w-4 text-kiwi" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Show/Hide Testnets Toggle */}
                <button
                  onClick={() => setShowTestnets(!showTestnets)}
                  className="mt-1 flex w-full items-center justify-between border-t border-white/10 px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
                >
                  <span>{showTestnets ? "Hide Test Networks" : "Show Test Networks"}</span>
                  <div
                    className={`h-4 w-8 border transition-colors ${
                      showTestnets ? "border-kiwi bg-kiwi/20" : "border-white/30"
                    }`}
                  >
                    <div
                      className={`mt-[3px] h-2 w-2 transition-transform ${
                        showTestnets ? "translate-x-[19px] bg-kiwi" : "translate-x-[3px] bg-white/60"
                      }`}
                    />
                  </div>
                </button>

                {/* Add Network Button */}
                <button
                  onClick={() => {
                    if (onAddNetwork) onAddNetwork();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 border-t border-white/10 p-3 text-kiwi transition-colors hover:bg-kiwi hover:text-black"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.25em]">Add network</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export { type Network };
