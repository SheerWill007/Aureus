import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Sun, Moon, Github, Twitter, ArrowRight, Shield, Zap, Lock, Layers, Smartphone, Link2 } from "lucide-react";
import FeatureCard from "./FeatureCard";
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

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-web3-dark-primary dark:to-web3-dark-surface text-gray-900 dark:text-web3-white transition-colors duration-300">

        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-web3-gold/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-web3-blue/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-web3-violet/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>

        {/* Sticky Navigation */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-web3-dark-surface/80 border-b border-gray-200 dark:border-white/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Logo SVG */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2L35 12V28L20 38L5 28V12L20 2Z" fill="url(#gold-gradient)" stroke="#F59E0B" strokeWidth="2" />
                <path d="M20 10L28 15V25L20 30L12 25V15L20 10Z" fill="#0A0B0F" stroke="#F59E0B" strokeWidth="1.5" />
                <defs>
                  <linearGradient id="gold-gradient" x1="5" y1="2" x2="35" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-2xl font-space font-bold text-gradient">Aureus</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection("features")} className="text-sm font-medium hover:text-web3-gold transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection("security")} className="text-sm font-medium hover:text-web3-gold transition-colors">
                Security
              </button>
              <button onClick={() => scrollToSection("networks")} className="text-sm font-medium hover:text-web3-gold transition-colors">
                Networks
              </button>
              <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" aria-label="Toggle theme">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Button onClick={() => navigate("/setupWallet/")} className="glow-button">
                Crea <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Button onClick={() => navigate("/setupWallet/")} size="sm" className="bg-web3-gold hover:bg-web3-gold/90">
                Launch
              </Button>
            </div>
          </div>
        </header>

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="inline-block">
                  <span className="px-4 py-2 rounded-full bg-web3-gold/10 text-web3-gold text-sm font-medium border border-web3-gold/20">
                    Premium Web3 Wallet
                  </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-space font-bold leading-tight">
                  Your assets.
                  <br />
                  <span className="text-gradient">Your keys.</span>
                  <br />
                  Your future.
                </h1>

                <p className="text-xl text-gray-600 dark:text-web3-muted leading-relaxed">
                  Experience the next generation of digital asset management. Secure, fast, and built for the multi-chain future.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => navigate("/setupWallet/")} size="lg" className="glow-button text-lg">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button onClick={() => scrollToSection("features")} size="lg" variant="outline" className="border-web3-gold/20 hover:bg-web3-gold/10 text-lg">
                    Learn More
                  </Button>
                </div>
              </motion.div>

              {/* Floating Wallet Card Mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative animate-float">
                  <div className="glass-card p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-web3-gold to-web3-blue" />
                        <div>
                          <p className="text-sm text-web3-muted">Total Balance</p>
                          <p className="text-2xl font-space font-bold">$24,567.89</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-ethereum/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-ethereum">ETH</span>
                          </div>
                          <div>
                            <p className="font-medium">Ethereum</p>
                            <p className="text-sm text-web3-muted">5.234 ETH</p>
                          </div>
                        </div>
                        <p className="font-semibold">$18,234.56</p>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-solana/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-solana">SOL</span>
                          </div>
                          <div>
                            <p className="font-medium">Solana</p>
                            <p className="text-sm text-web3-muted">45.67 SOL</p>
                          </div>
                        </div>a
                        <p className="font-semibold">$6,333.33</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="py-3 rounded-lg bg-web3-gold hover:bg-web3-gold/90 font-medium transition-colors">
                        Send
                      </button>
                      <button className="py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition-colors">
                        Receive
                      </button>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-web3-gold/20 to-web3-blue/20 blur-3xl -z-10 animate-glow" />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Stats Bar */}
          <section className="border-y border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-4xl font-space font-bold text-gradient mb-2">30M+</p>
                  <p className="text-web3-muted">Trusted Users Worldwide</p>
                </div>
                <div>
                  <p className="text-4xl font-space font-bold text-gradient mb-2">Multi-Chain</p>
                  <p className="text-web3-muted">Ethereum, Solana & More</p>
                </div>
                <div>
                  <p className="text-4xl font-space font-bold text-gradient mb-2">Non-Custodial</p>
                  <p className="text-web3-muted">You Own Your Keys</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 lg:py-32 scroll-mt-24">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl lg:text-5xl font-space font-bold mb-4">
                  Built for the <span className="text-gradient">Web3 Era</span>
                </h2>
                <p className="text-xl text-web3-muted max-w-2xl mx-auto">
                  Everything you need to manage your digital assets securely and efficiently
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<Layers className="h-12 w-12" />}
                  title="Multi-Chain Support"
                  description="Seamlessly manage assets across Ethereum, Solana, and other leading blockchains from a single interface."
                />
                <FeatureCard
                  icon={<Shield className="h-12 w-12" />}
                  title="Secure Vault"
                  description="Military-grade encryption protects your private keys. Your assets remain under your complete control."
                />
                <FeatureCard
                  icon={<Zap className="h-12 w-12" />}
                  title="Token Swap"
                  description="Exchange tokens instantly with the best rates. Built-in DEX aggregation for optimal pricing."
                />
                <FeatureCard
                  icon={<Lock className="h-12 w-12" />}
                  title="NFT Ready"
                  description="View, manage, and showcase your NFT collection. Full support for all major NFT standards."
                />
                <FeatureCard
                  icon={<Link2 className="h-12 w-12" />}
                  title="DApp Browser"
                  description="Connect to thousands of decentralized applications. Explore DeFi, gaming, and more."
                />
                <FeatureCard
                  icon={<Smartphone className="h-12 w-12" />}
                  title="Hardware Support"
                  description="Compatible with Ledger and Trezor. Add an extra layer of security to your holdings."
                />
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section id="security" className="py-20 lg:py-32 bg-white/50 dark:bg-white/5 scroll-mt-24">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl lg:text-5xl font-space font-bold mb-6">
                    Security <span className="text-gradient">First</span>
                  </h2>
                  <p className="text-xl text-web3-muted mb-8">
                    Your security is our top priority. Aureus implements industry-leading security measures to protect your assets.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-web3-gold/10 flex items-center justify-center flex-shrink-0">
                        <Lock className="h-6 w-6 text-web3-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-space font-semibold mb-2">End-to-End Encryption</h3>
                        <p className="text-web3-muted">Your private keys are encrypted locally and never leave your device.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-web3-blue/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-6 w-6 text-web3-blue" />
                      </div>
                      <div>
                        <h3 className="text-lg font-space font-semibold mb-2">Open Source & Audited</h3>
                        <p className="text-web3-muted">Our code is publicly available and regularly audited by security experts.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-web3-violet/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-6 w-6 text-web3-violet" />
                      </div>
                      <div>
                        <h3 className="text-lg font-space font-semibold mb-2">Biometric Authentication</h3>
                        <p className="text-web3-muted">Use fingerprint or face recognition for quick and secure access.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="glass-card p-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <span className="font-medium">Encryption Status</span>
                        <span className="text-green-500 font-semibold">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <span className="font-medium">Backup Status</span>
                        <span className="text-green-500 font-semibold">Secured</span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <span className="font-medium">2FA Protection</span>
                        <span className="text-green-500 font-semibold">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <span className="font-medium">Hardware Wallet</span>
                        <span className="text-green-500 font-semibold">Connected</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl -z-10" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Networks Section */}
          <section id="networks" className="py-20 lg:py-32 scroll-mt-24">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl lg:text-5xl font-space font-bold mb-4">
                  <span className="text-gradient">Multi-Chain</span> by Design
                </h2>
                <p className="text-xl text-web3-muted max-w-2xl mx-auto">
                  Access the entire Web3 ecosystem from one powerful wallet
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 text-center group hover:border-ethereum/50 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ethereum/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-ethereum">ETH</span>
                  </div>
                  <p className="font-space font-semibold">Ethereum</p>
                </div>

                <div className="glass-card p-6 text-center group hover:border-solana/50 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-solana/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-solana">SOL</span>
                  </div>
                  <p className="font-space font-semibold">Solana</p>
                </div>

                <div className="glass-card p-6 text-center group hover:border-web3-gold/50 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-web3-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-web3-gold">BTC</span>
                  </div>
                  <p className="font-space font-semibold">Bitcoin</p>
                </div>

                <div className="glass-card p-6 text-center group hover:border-web3-blue/50 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-web3-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl font-bold text-web3-blue">+10</span>
                  </div>
                  <p className="font-space font-semibold">More Chains</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 lg:py-32 bg-gradient-to-r from-web3-gold/10 via-web3-blue/10 to-web3-violet/10">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-4xl lg:text-5xl font-space font-bold mb-6">
                  Ready to take control of your <span className="text-gradient">digital future?</span>
                </h2>
                <p className="text-xl text-web3-muted mb-8">
                  Join millions of users who trust Aureus to secure their digital assets
                </p>
                <Button onClick={() => navigate("/setupWallet/")} size="lg" className="glow-button text-lg">
                  Create Your Wallet <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-web3-dark-surface/50 backdrop-blur-sm py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2L35 12V28L20 38L5 28V12L20 2Z" fill="url(#gold-gradient-footer)" stroke="#F59E0B" strokeWidth="2" />
                    <path d="M20 10L28 15V25L20 30L12 25V15L20 10Z" fill="#0A0B0F" stroke="#F59E0B" strokeWidth="1.5" />
                    <defs>
                      <linearGradient id="gold-gradient-footer" x1="5" y1="2" x2="35" y2="38" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F59E0B" />
                        <stop offset="1" stopColor="#D97706" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-xl font-space font-bold text-gradient">Aureus</span>
                </div>
                <p className="text-sm text-web3-muted">Premium Web3 Wallet</p>
                <p className="text-sm text-web3-muted">Your assets. Your keys. Your future.</p>
              </div>

              <div>
                <h3 className="font-space font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-web3-muted">
                  <li><button onClick={() => scrollToSection("features")} className="hover:text-web3-gold transition-colors">Features</button></li>
                  <li><button onClick={() => scrollToSection("security")} className="hover:text-web3-gold transition-colors">Security</button></li>
                  <li><button onClick={() => scrollToSection("networks")} className="hover:text-web3-gold transition-colors">Networks</button></li>
                  <li><button className="hover:text-web3-gold transition-colors">Download</button></li>
                </ul>
              </div>

              <div>
                <h3 className="font-space font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-web3-muted">
                  <li><a href="#" className="hover:text-web3-gold transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-web3-gold transition-colors">Support</a></li>
                  <li><a href="#" className="hover:text-web3-gold transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-web3-gold transition-colors">Blog</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-space font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-web3-muted">
                  <li><a href="#" className="hover:text-web3-gold transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-web3-gold transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-web3-gold transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-web3-muted mb-4 md:mb-0">
                © 2024 Aureus Wallet. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/SheerWill007" target="_blank" rel="noopener noreferrer" className="text-web3-muted hover:text-web3-gold transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://x.com/KitsuneKode" target="_blank" rel="noopener noreferrer" className="text-web3-muted hover:text-web3-gold transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
