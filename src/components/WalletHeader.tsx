import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WalletHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onShowKeys: () => void;
}

export function WalletHeader({ darkMode, toggleDarkMode, onShowKeys }: WalletHeaderProps) {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountSelectorOpen, setAccountSelectorOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("Main Account");

  const accounts = ["Main Account", "Savings Account", "Trading Account"];

  const toggleSettings = () => setSettingsOpen(!settingsOpen);
  const toggleAccountSelector = () => setAccountSelectorOpen(!accountSelectorOpen);

  return (
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
              aria-label="Select account"
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
                      onShowKeys();
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
  );
}
