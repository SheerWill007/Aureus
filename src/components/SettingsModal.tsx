import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  Key,
  HelpCircle,
  Info,
  ChevronRight,
  Lock,
} from "lucide-react";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowKeys: () => void;
};

export default function SettingsModal({
  isOpen,
  onClose,
  darkMode,
  onToggleDarkMode,
  onShowKeys,
}: SettingsModalProps) {
  const [autoLockTime, setAutoLockTime] = useState("5");

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-0"
      style={{ margin: 0 }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#24242A] w-full max-w-md rounded-t-3xl shadow-2xl"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#24242A] border-b border-gray-200 dark:border-[#3A3A3F] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">GENERAL</h3>
            <div className="space-y-2">
              <button
                onClick={onToggleDarkMode}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <span className="text-sm font-medium">Dark Mode</span>
                </div>
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    darkMode ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                      darkMode ? "translate-x-6" : "translate-x-0.5"
                    } mt-0.5`}
                  />
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium">Language</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">English</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium">Notifications</span>
                </div>
                <div
                  className="w-12 h-6 rounded-full bg-orange-500"
                >
                  <div className="w-5 h-5 bg-white rounded-full transition-transform transform translate-x-6 mt-0.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">SECURITY</h3>
            <div className="space-y-2">
              <button
                onClick={onShowKeys}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium">Show Private Keys</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium">Auto-Lock Timer</span>
                </div>
                <select
                  value={autoLockTime}
                  onChange={(e) => setAutoLockTime(e.target.value)}
                  className="px-3 py-1 bg-gray-100 dark:bg-[#1C1C1E] border border-gray-300 dark:border-[#3A3A3F] rounded text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="1">1 min</option>
                  <option value="5">5 min</option>
                  <option value="10">10 min</option>
                  <option value="30">30 min</option>
                </select>
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium">Security & Privacy</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Support & Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">SUPPORT</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium">Help Center</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#3A3A3F] rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Info className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium">About</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-[#3A3A3F]">
            <p className="text-xs text-gray-500">Aureus Wallet</p>
            <p className="text-xs text-gray-400 mt-1">Version 2.0.0</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
