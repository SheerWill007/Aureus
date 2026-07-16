# Aureus Wallet

A modern, MetaMask-inspired cryptocurrency wallet built with React, TypeScript, and Tailwind CSS. Support for Ethereum and Solana networks with a clean, professional interface.

## Features

- **Multi-Chain Support**: Manage Ethereum and Solana assets from a single interface
- **MetaMask-Style Design**: Clean, professional UI inspired by MetaMask
- **Secure**: Non-custodial wallet - you control your private keys
- **Network Switching**: Easy switching between Mainnet and Devnet
- **Send & Receive**: Transfer crypto with a simple, intuitive interface
- **Balance Visibility Toggle**: Show/hide your balance for privacy
- **Airdrop Support**: Request testnet tokens on Devnet
- **Responsive**: Works on desktop and mobile devices

## Tech Stack

- **React** 18.3.1 - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Framer Motion** - Animations
- **@solana/web3.js** - Solana blockchain interaction
- **ethers.js** - Ethereum blockchain interaction
- **shadcn/ui** - UI components

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # Reusable UI components (shadcn/ui)
│   ├── scripts/       # Blockchain interaction scripts
│   ├── Dashboard.tsx  # Main wallet dashboard
│   ├── Landing.tsx    # Landing page
│   ├── SetupWallet.tsx
│   ├── SendCrypto.tsx
│   ├── ReceiveCrypto.tsx
│   └── ...
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── App.tsx            # App router
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Key Changes (MetaMask Redesign)

### Design Updates
- Simplified UI with MetaMask-inspired design
- Fixed-width container (max-w-md) for wallet interface
- Orange accent color (#F97316) matching MetaMask branding
- Cleaner header with account dropdown and network indicator
- Balance visibility toggle
- Simplified asset list view
- Removed complex gradients and animations

### Removed Files
- `WalletHeader.tsx` - Replaced with inline header
- `DashboardComponents.tsx` - Components now inline
- `FeatureCard.tsx` - Simplified landing page
- `AllDailogBox.tsx` - Unused
- `EssentialDialogBoxes.tsx` - Unused
- `App.css` - Styles moved to Tailwind
- Various unused SVG assets

### Updated Styling
- Removed custom Web3 theme colors
- Simplified Tailwind configuration
- Clean, minimal CSS with no glassmorphism effects
- System font stack for better performance

## License

MIT

## Author

**SheerWill007**
- GitHub: [@SheerWill007](https://github.com/SheerWill007)
- Email: manashpratimbhuyan8134@gmail.com

---

© 2024 Aureus. All rights reserved.
