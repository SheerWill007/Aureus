import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Settings, Eye, Copy, Check } from "lucide-react";

type Account = {
  name: string;
  address: string;
  balance: number;
  icon: string;
};

type AccountPickerProps = {
  currentAccount: Account;
  accounts?: Account[];
  onSelectAccount?: (account: Account) => void;
  onAddAccount?: () => void;
};

export default function AccountPicker({
  currentAccount,
  accounts = [],
  onSelectAccount,
  onAddAccount,
}: AccountPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyAddress = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleSelectAccount = (account: Account) => {
    if (onSelectAccount) {
      onSelectAccount(account);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-[#1C1C1E] hover:bg-gray-200 dark:hover:bg-[#2C2C2E] rounded-lg transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">
            {currentAccount.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="text-left">
          <div className="text-sm font-medium">{currentAccount.name}</div>
          <div className="text-xs text-gray-500">
            {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
          </div>
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
              style={{ minWidth: "320px" }}
            >
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">My Accounts</span>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded transition-colors">
                    <Settings className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {/* Current Account */}
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {currentAccount.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{currentAccount.name}</div>
                        <div className="text-xs text-gray-500">
                          {currentAccount.balance.toFixed(4)} ETH
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => copyAddress(currentAccount.address, e)}
                      className="p-1.5 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded transition-colors"
                    >
                      {copiedAddress ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
                    {currentAccount.address}
                  </div>
                </div>

                {/* Other Accounts */}
                {accounts.length > 0 && (
                  <div className="space-y-1">
                    {accounts.map((account, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectAccount(account)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {account.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium">{account.name}</div>
                            <div className="text-xs text-gray-500">
                              {account.balance.toFixed(4)} ETH
                            </div>
                          </div>
                        </div>
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Add Account Button */}
                <button
                  onClick={() => {
                    if (onAddAccount) onAddAccount();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 mt-2 border-t border-gray-200 dark:border-[#3A3A3F] text-orange-500 hover:bg-gray-50 dark:hover:bg-[#3A3A3F] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">Add Account</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
