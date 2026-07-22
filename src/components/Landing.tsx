import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";
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
      <div className="bg-gradient-to-br from-lime-50 via-white to-green-50 dark:from-[#0F1A0F] dark:via-[#1C1C1E] dark:to-[#0F1A0F] text-gray-900 dark:text-white transition-colors duration-300">

        {/* Header */}
        <header className="border-b border-lime-200 dark:border-lime-900/30 backdrop-blur-sm bg-white/50 dark:bg-[#1C1C1E]/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-lg shadow-lime-500/30 rotate-12 transform hover:rotate-0 transition-transform duration-300">
                  <span className="text-2xl">🥝</span>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">Kiwi</span>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-2 rounded-xl hover:bg-lime-100 dark:hover:bg-lime-900/20 transition-all duration-200">
                {darkMode ? <Sun className="h-5 w-5 text-lime-400" /> : <Moon className="h-5 w-5 text-lime-600" />}
              </button>
              <Button onClick={() => navigate("/setupWallet/")} className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white shadow-lg shadow-lime-500/30 rounded-xl">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="max-w-6xl mx-auto px-4 py-20 relative overflow-hidden">
            {/* Floating Kiwis Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-20 left-10 text-6xl opacity-10"
              >
                🥝
              </motion.div>
              <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-40 right-20 text-8xl opacity-10"
              >
                🥝
              </motion.div>
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute bottom-20 left-1/4 text-5xl opacity-10"
              >
                🥝
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-lime-100 dark:bg-lime-900/30 rounded-full text-sm font-medium text-lime-700 dark:text-lime-300">
                  <Sparkles className="h-4 w-4" />
                  <span>The freshest way to manage crypto</span>
                </div>

                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Fresh.
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
                    Simple.
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">
                    Secure.
                  </span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Your gateway to Web3. Manage Ethereum and Solana with the wallet that's as refreshing as its name. 
                  <span className="inline-block ml-1">🥝</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => navigate("/setupWallet/")} 
                    size="lg" 
                    className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white text-lg px-8 py-6 rounded-xl shadow-xl shadow-lime-500/30 transform hover:scale-105 transition-all duration-200"
                  >
                    Create Wallet <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={() => navigate("/setupWallet/")} 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 py-6 rounded-xl border-2 border-lime-300 dark:border-lime-700 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-all duration-200"
                  >
                    Import Wallet
                  </Button>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-lime-500"></div>
                    <span>Non-custodial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-lime-500"></div>
                    <span>Open source</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-lime-500"></div>
                    <span>No tracking</span>
                  </div>
                </div>
              </motion.div>

              {/* Wallet Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-green-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative max-w-sm mx-auto bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-2xl border-2 border-lime-200 dark:border-lime-900/50 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  {/* Mock Wallet Header */}
                  <div className="bg-gradient-to-br from-lime-400 via-green-500 to-emerald-500 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 text-9xl opacity-20">🥝</div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">My Kiwi Wallet</span>
                          <span className="text-lg">🥝</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                          <div className="w-2 h-2 rounded-full bg-lime-300 animate-pulse"></div>
                          <span className="text-xs">Active</span>
                        </div>
                      </div>
                      <div className="text-4xl font-bold mb-2">$32,456.78</div>
                      <div className="text-sm opacity-90 font-mono">0x742d...9f2a</div>
                    </div>
                  </div>

                  {/* Mock Assets */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 border border-lime-200 dark:border-lime-900/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                          Ξ
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Ethereum</div>
                          <div className="text-xs text-gray-500">7.234 ETH</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">$25,234</div>
                        <div className="text-xs text-green-500">+5.2%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 border border-lime-200 dark:border-lime-900/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                          ◎
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Solana</div>
                          <div className="text-xs text-gray-500">34.5 SOL</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">$7,222</div>
                        <div className="text-xs text-green-500">+2.8%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button className="py-3 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-lime-500/30 transform hover:scale-105 transition-all">
                        Send
                      </button>
                      <button className="py-3 bg-lime-100 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300 rounded-xl text-sm font-medium hover:bg-lime-200 dark:hover:bg-lime-900/30 transition-all">
                        Receive
                      </button>
                      <button className="py-3 bg-lime-100 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300 rounded-xl text-sm font-medium hover:bg-lime-200 dark:hover:bg-lime-900/30 transition-all">
                        Swap
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features */}
          <section className="bg-white/50 dark:bg-[#1C1C1E]/50 backdrop-blur-sm py-20 border-y border-lime-200 dark:border-lime-900/30">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-4">
                <span className="bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                  Why Choose Kiwi?
                </span>
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg">
                Fresh features for a fresh start in Web3
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 border border-lime-200 dark:border-lime-900/30"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-lg shadow-lime-500/30">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Bank-Level Security</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your keys never leave your device. Military-grade encryption keeps your assets safe.
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -10 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 border border-lime-200 dark:border-lime-900/30"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-lg shadow-lime-500/30">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Instant transactions, real-time balance updates, and the smoothest swap experience.
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -10 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 border border-lime-200 dark:border-lime-900/30"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-lg shadow-lime-500/30">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Delightfully Simple</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Beautiful UI, intuitive design. Managing crypto has never been this refreshing.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 to-green-500/10 dark:from-lime-900/20 dark:to-green-900/20"></div>
            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-6xl mb-6 inline-block animate-bounce">🥝</span>
                <h2 className="text-5xl font-bold mb-6">
                  Ready for something <span className="bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">fresh</span>?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Join thousands of users who've chosen the freshest way to manage their crypto
                </p>
                <Button 
                  onClick={() => navigate("/setupWallet/")} 
                  size="lg" 
                  className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white text-lg px-10 py-7 rounded-xl shadow-xl shadow-lime-500/30 transform hover:scale-105 transition-all duration-200"
                >
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-lime-200 dark:border-lime-900/30 py-8 bg-white/50 dark:bg-[#1C1C1E]/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-lg">
                  <span className="text-xl">🥝</span>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">Kiwi</span>
                <span className="text-sm text-gray-500">by Amcha</span>
              </div>
              <p className="text-sm text-gray-500">
                © 2024 Kiwi Wallet. Fresh and secure. 🥝
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
