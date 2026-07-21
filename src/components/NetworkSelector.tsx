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
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-[#1C1C1E] hover:bg-gray-200 dark:hover:bg-[#2C2C2E] rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium">{selectedNetwork.name}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
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
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#24242A] border border-gray-200 dark:border-[#3A3A3F] rounded-lg shadow-xl z-50 overflow-hidden"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <div className="p-2">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">Select Network</span>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded transition-colors">
                    <Settings className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {/* Networks List */}
                <div className="space-y-1">
                  {filteredNetworks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => handleSelectNetwork(network)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={network.icon}
                          alt={network.name}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/LogoWallets/ethereum.png";
                          }}
                        />
                        <div className="text-left">
                          <div className="text-sm font-medium">{network.name}</div>
                          <div className="text-xs text-gray-500">Chain ID: {network.chainId}</div>
                        </div>
                      </div>
                      {selectedNetwork.id === network.id && (
                        <Check className="h-5 w-5 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Show/Hide Testnets Toggle */}
                <button
                  onClick={() => setShowTestnets(!showTestnets)}
                  className="w-full flex items-center justify-between px-3 py-2 mt-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors"
                >
                  <span>{showTestnets ? "Hide Test Networks" : "Show Test Networks"}</span>
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      showTestnets ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                        showTestnets ? "translate-x-5" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </div>
                </button>

                {/* Add Network Button */}
                <button
                  onClick={() => {
                    if (onAddNetwork) onAddNetwork();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 mt-2 border-t border-gray-200 dark:border-[#3A3A3F] text-orange-500 hover:bg-gray-50 dark:hover:bg-[#3A3A3F] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">Add Network</span>
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
