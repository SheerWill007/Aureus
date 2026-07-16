import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowRight, Shield, Zap, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage(): JSX.Element {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") !== "false";
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-[#24242A] text-gray-900 dark:text-white transition-colors duration-300">

        {/* Header */}
        <header className="border-b border-gray-200 dark:border-[#3A3A3F]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                  <path d="M20 2L35 12V28L20 38L5 28V12L20 2Z" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-bold">Aureus</span>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3A3A3F] transition-colors">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Button onClick={() => navigate("/setupWallet/")} className="bg-orange-500 hover:bg-orange-600 text-white">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="max-w-6xl mx-auto px-4 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  A crypto wallet & gateway to blockchain apps
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Start exploring blockchain applications in seconds. Trusted by over 30 million users worldwide.
                </p>

                <Button onClick={() => navigate("/setupWallet/")} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              {/* Wallet Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="max-w-sm mx-auto bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#3A3A3F] overflow-hidden">
                  {/* Mock Wallet Header */}
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">Account 1</span>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-3xl font-bold mb-2">$24,567.89</div>
                    <div className="text-sm opacity-90">0x1234...5678</div>
                  </div>

                  {/* Mock Assets */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#24242A]">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                        <div>
                          <div className="text-sm font-medium">Ethereum</div>
                          <div className="text-xs text-gray-500">5.234 ETH</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">$18,234</div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#24242A]">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                        <div>
                          <div className="text-sm font-medium">Solana</div>
                          <div className="text-xs text-gray-500">30.5 SOL</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">$6,333</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button className="py-2 bg-orange-500 text-white rounded-lg text-sm font-medium">Send</button>
                      <button className="py-2 bg-gray-200 dark:bg-[#3A3A3F] rounded-lg text-sm font-medium">Receive</button>
                      <button className="py-2 bg-gray-200 dark:bg-[#3A3A3F] rounded-lg text-sm font-medium">Buy</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features */}
          <section className="bg-gray-50 dark:bg-[#1C1C1E] py-20">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Why Aureus?</h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your keys, your crypto. Always non-custodial. Industry-leading security.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fast</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Send and receive crypto instantly. Swap tokens with the best rates.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Private</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We don't track your data. Your privacy is fully protected.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to start your Web3 journey?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Join millions of users who trust Aureus to manage their digital assets
              </p>
              <Button onClick={() => navigate("/setupWallet/")} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6">
                Create Your Wallet <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-[#3A3A3F] py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
                    <path d="M20 2L35 12V28L20 38L5 28V12L20 2Z" fill="white" />
                  </svg>
                </div>
                <span className="font-bold">Aureus</span>
                <span className="text-sm text-gray-500">by SheerWill007</span>
              </div>
              <p className="text-sm text-gray-500">
                © 2024 Aureus. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
