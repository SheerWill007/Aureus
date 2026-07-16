# Quick Start Guide - Aureus Wallet

## For Developers

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## Project Overview

### Main Routes
- `/` - Landing page
- `/setupWallet` - Create/import wallet
- `/dashboard` - Main wallet interface

### Key Components

#### Dashboard (`src/components/Dashboard.tsx`)
- MetaMask-style wallet interface
- Balance display with visibility toggle
- Send/Receive/Swap actions
- Asset list (ETH, SOL)
- Network selector

#### Landing (`src/components/Landing.tsx`)
- Simple marketing page
- Wallet preview
- Get started CTA

#### SetupWallet (`src/components/SetupWallet.tsx`)
- Create new wallet
- Import existing wallet
- Generate seed phrase

---

## Customization Guide

### Change Primary Color (Orange)
Replace `orange-500` throughout:
```tsx
// Current
className="bg-orange-500"

// Your color
className="bg-blue-500"
```

### Adjust Wallet Width
In `Dashboard.tsx`:
```tsx
// Current
<div className="max-w-md mx-auto">

// Wider
<div className="max-w-lg mx-auto">
```

### Modify Header
Edit the header section in `Dashboard.tsx` (lines ~100-150)

### Add New Token
In `Dashboard.tsx`, add to the token array:
```tsx
{ 
  name: "Bitcoin", 
  symbol: "BTC", 
  balance: 0, 
  icon: "/LogoWallets/Bitcoin.png", 
  value: "0.00" 
}
```

---

## Environment Setup

### Required Environment Variables
Create `.env` file if needed:
```env
VITE_NETWORK=mainnet
VITE_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

### Network Configuration
Edit in component state or create config file:
```typescript
const networks = {
  mainnet: { rpc: "https://..." },
  devnet: { rpc: "https://..." }
}
```

---

## Common Tasks

### Add New Blockchain
1. Create script in `src/components/scripts/`
2. Add balance hook in `src/hooks/`
3. Update Dashboard token list
4. Add logo to `public/LogoWallets/`

### Modify Send Flow
Edit `src/components/SendCrypto.tsx`

### Modify Receive Flow
Edit `src/components/ReceiveCrypto.tsx`

### Change Theme Colors
Edit `tailwind.config.js` and component styles

---

## Testing Locally

### Test Wallet Creation
1. Go to `/setupWallet`
2. Click "Create New Wallet"
3. Save seed phrase
4. Verify dashboard loads

### Test Send Transaction (Devnet)
1. Switch to Devnet
2. Request airdrop
3. Wait for balance
4. Try sending small amount

### Test Network Switching
1. Go to dashboard
2. Use network selector
3. Verify balance updates

---

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Netlify
```bash
npm run build
# Upload dist/ folder
```

### Custom Server
```bash
npm run build
# Serve dist/ folder with any static server
```

---

## Troubleshooting

### "PowerShell execution policy" Error
Run in Command Prompt instead:
```cmd
npm run dev
```

Or run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Balance Not Updating
- Check network connection
- Verify RPC endpoint
- Check wallet address is valid
- Try different RPC in code

### Dark Mode Not Working
- Check localStorage: `localStorage.getItem('darkMode')`
- Verify Tailwind dark mode is enabled
- Check class toggle in useEffect

---

## File Structure Quick Reference

```
aureus/
├── public/
│   └── LogoWallets/          # Token logos
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── scripts/          # Blockchain logic
│   │   ├── Dashboard.tsx     # 🎯 Main wallet
│   │   ├── Landing.tsx       # 🎯 Homepage
│   │   ├── SetupWallet.tsx   # Wallet creation
│   │   ├── SendCrypto.tsx    # Send modal
│   │   └── ReceiveCrypto.tsx # Receive modal
│   ├── hooks/
│   │   ├── useWalletBalance.ts
│   │   └── useNotifications.ts
│   ├── App.tsx               # Router
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## Next Steps

1. ✅ Development environment set up
2. ✅ Understand project structure
3. 🔄 Customize colors/branding
4. 🔄 Add features you need
5. 🔄 Test thoroughly
6. 🔄 Deploy to production

---

## Getting Help

- **Documentation**: See README.md
- **Design Comparison**: See DESIGN_COMPARISON.md
- **Full Changes**: See REDESIGN_SUMMARY.md
- **GitHub Issues**: Report bugs on GitHub
- **Email**: manashpratimbhuyan8134@gmail.com

---

## Resources

- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Ethers.js](https://docs.ethers.org/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Happy Building! 🚀**
