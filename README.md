# Aureus Wallet

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SheerWill007/aureus)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/SheerWill007/aureus)

A modern, MetaMask-inspired cryptocurrency wallet built with React, TypeScript, and Tailwind CSS. Support for Ethereum and Solana networks with a clean, professional interface.

🔗 **[Live Demo](https://aureus.vercel.app)** | 📚 **[Documentation](./DEPLOYMENT.md)** | 🚀 **[Quick Start](./QUICKSTART.md)**

---

## ✨ Features

- **Multi-Chain Support**: Manage Ethereum and Solana assets from a single interface
- **MetaMask-Style Design**: Clean, professional UI inspired by MetaMask
- **Secure**: Non-custodial wallet - you control your private keys
- **Network Switching**: Easy switching between Mainnet and Devnet
- **Send & Receive**: Transfer crypto with a simple, intuitive interface
- **Balance Visibility Toggle**: Show/hide your balance for privacy
- **Airdrop Support**: Request testnet tokens on Devnet
- **Dark Mode**: Full dark mode support
- **Responsive**: Works on desktop and mobile devices

---

## 🚀 Quick Deploy

### One-Click Deployment

Click one of the buttons below to deploy instantly:

- **Vercel**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SheerWill007/aureus)
- **Netlify**: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Manual Deployment

See detailed instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)

------

## 🛠️ Tech Stack

- **React** 18.3.1 - UI framework
- **TypeScript** 5.5.3 - Type safety
- **Tailwind CSS** 3.4.10 - Styling
- **Vite** 5.4.1 - Build tool
- **Framer Motion** 11.3.29 - Animations
- **@solana/web3.js** 1.95.3 - Solana blockchain interaction
- **ethers.js** 6.13.2 - Ethereum blockchain interaction
- **shadcn/ui** - UI components

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SheerWill007/aureus.git
cd aureus

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## License

MIT

## Author

**SheerWill007**
- GitHub: [@SheerWill007](https://github.com/SheerWill007)
- Email: manashpratimbhuyan8134@gmail.com

---

© 2024 Aureus. All rights reserved.


### Build for Production

```bash
# Type check
npm run type-check

# Build
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
aureus/
├── public/
│   └── LogoWallets/          # Token logos (ETH, SOL, etc.)
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── scripts/          # Blockchain interaction
│   │   ├── Dashboard.tsx     # Main wallet interface
│   │   ├── Landing.tsx       # Homepage
│   │   ├── SetupWallet.tsx   # Wallet creation/import
│   │   ├── SendCrypto.tsx    # Send modal
│   │   └── ReceiveCrypto.tsx # Receive modal
│   ├── hooks/                # Custom React hooks
│   │   ├── useWalletBalance.ts
│   │   └── useNotifications.ts
│   ├── lib/                  # Utilities
│   ├── App.tsx               # Router
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── .env.example              # Environment template
├── vercel.json               # Vercel config
├── netlify.toml              # Netlify config
└── vite.config.ts            # Vite config

```

---

## 🎨 Design Philosophy

**Before (Web3 AI-Style)**
- Complex gradients and animations
- Glassmorphism effects
- Full-width responsive layout
- Multiple custom fonts

**After (MetaMask-Style)** ✅
- Clean, flat design
- Fixed 448px width (mobile-first)
- Orange accent color (#F97316)
- System fonts for performance
- Familiar, professional interface

See [DESIGN_COMPARISON.md](./DESIGN_COMPARISON.md) for detailed before/after comparison.

---

## 📚 Documentation

- **[README.md](./README.md)** - This file
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Developer quick start
- **[DESIGN_COMPARISON.md](./DESIGN_COMPARISON.md)** - Visual before/after
- **[REDESIGN_SUMMARY.md](./REDESIGN_SUMMARY.md)** - Complete change log
- **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** - Pre-launch checklist

---

## 🔐 Security

- **Non-Custodial**: You control your private keys
- **Client-Side Only**: Keys stored in browser localStorage
- **No Backend**: No server means no server-side vulnerabilities
- **Security Headers**: XSS, frame, and content-type protection
- **Open Source**: Code is transparent and auditable

⚠️ **Warning**: Never share your private keys or seed phrase with anyone!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**SheerWill007**
- GitHub: [@SheerWill007](https://github.com/SheerWill007)
- Email: manashpratimbhuyan8134@gmail.com
- Twitter: [@KitsuneKode](https://x.com/KitsuneKode)

---

## 🙏 Acknowledgments

- Inspired by [MetaMask](https://metamask.io/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## 📊 Stats

- **Version**: 2.0.0 (MetaMask Redesign)
- **Build Size**: ~500KB (minified + gzipped)
- **Performance**: 95+ Lighthouse score
- **Supported Networks**: Ethereum, Solana
- **Browser Support**: Chrome, Firefox, Safari, Edge

---

## 🗺️ Roadmap

- [x] MetaMask-inspired redesign
- [x] Dark mode support
- [x] Multi-chain support (ETH/SOL)
- [ ] Hardware wallet integration
- [ ] NFT gallery view
- [ ] Token swap functionality
- [ ] Transaction history
- [ ] Address book
- [ ] Multi-account support
- [ ] Mobile app

---

## 💬 Support

Need help? Have questions?

- **Issues**: [GitHub Issues](https://github.com/SheerWill007/aureus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SheerWill007/aureus/discussions)
- **Email**: manashpratimbhuyan8134@gmail.com

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

<div align="center">

**Built with ❤️ by SheerWill007**

© 2024 Aureus. All rights reserved.

</div>
