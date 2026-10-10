# Kiwi Wallet

A non-custodial, multi-chain cryptocurrency wallet for Ethereum and Solana, built as a modern single-page web application.

[![Live Demo](https://img.shields.io/badge/demo-kiwiwallet.vercel.app-84CC16?style=flat-square)](https://kiwiwallet.vercel.app)
![Version](https://img.shields.io/badge/version-3.0.0-10B981?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?style=flat-square&logo=vite&logoColor=white)

**Live application:** https://kiwiwallet.vercel.app

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Supported Networks](#supported-networks)
4. [Technology Stack](#technology-stack)
5. [Architecture](#architecture)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [Configuration](#configuration)
9. [Available Scripts](#available-scripts)
10. [Application Walkthrough](#application-walkthrough)
11. [Security Model](#security-model)
12. [Design System](#design-system)
13. [Deployment](#deployment)
14. [Roadmap](#roadmap)
15. [Contributing](#contributing)
16. [License](#license)
17. [Disclaimer](#disclaimer)
18. [Acknowledgments](#acknowledgments)
19. [Contact](#contact)

---

## Overview

Kiwi Wallet is a browser-based wallet that lets users create, import, and manage accounts on both Ethereum and Solana from a single interface. It is non-custodial: wallet keys are generated and held on the user's own device, and the application has no backend that stores or has access to them.

The goal of the project is to provide a clean, approachable alternative to existing browser wallets while keeping the underlying model transparent and open to review. Users can create a wallet from a fresh recovery phrase or import an existing one, hold multiple accounts, switch between mainnet and test networks, send and receive assets, and review their transaction history.

Kiwi is inspired by MetaMask and other modern Web3 wallets, with a focus on a simple user experience, multi-chain support from the start, and a maintainable TypeScript codebase.

## Features

**Wallet management**
- Create a new wallet with a generated 12-word recovery (seed) phrase.
- Import an existing wallet from a seed phrase.
- Manage multiple accounts within the same wallet.
- View and manage account keys from the settings area.

**Multi-chain support**
- Ethereum and Solana handled side by side in a single interface.
- Chain-specific logic is isolated so each network uses its native tooling.

**Network switching**
- Toggle between mainnet and test networks for each chain.
- Ethereum: Mainnet, Sepolia, and Goerli.
- Solana: Mainnet Beta, Devnet, and Testnet.

**Transactions**
- Send assets through a guided transfer modal.
- Receive assets using the account address.
- Activity tab showing transaction history.

**Interface**
- Responsive layout for desktop and mobile browsers.
- Dark mode support.
- Animated landing page and smooth transitions.
- Accessible, unstyled primitives (Radix UI) for dialogs, menus, and tabs.

**Privacy**
- Private keys stay on the user's device.
- No analytics or tracking is built into the application.

## Supported Networks

| Chain    | Network      | Type    |
|----------|--------------|---------|
| Ethereum | Mainnet      | Mainnet |
| Ethereum | Sepolia      | Testnet |
| Ethereum | Goerli       | Testnet |
| Solana   | Mainnet Beta | Mainnet |
| Solana   | Devnet       | Testnet |
| Solana   | Testnet      | Testnet |

Note: Goerli has been deprecated by the Ethereum community in favor of Sepolia. It is retained for compatibility but Sepolia is recommended for testing.

## Technology Stack

| Area            | Technology                                   |
|-----------------|----------------------------------------------|
| Framework       | React 18                                     |
| Language        | TypeScript 5                                 |
| Build tooling   | Vite                                         |
| Styling         | Tailwind CSS                                 |
| UI primitives   | Radix UI                                     |
| Animation       | Framer Motion                                |
| Routing         | React Router DOM                             |
| Ethereum        | Ethers.js                                    |
| Solana          | @solana/web3.js                              |
| RPC providers   | Infura, Alchemy (configurable via env vars)  |
| Hosting         | Vercel                                       |

## Architecture

Kiwi is a client-only application. All wallet logic runs in the browser, and the only network traffic is JSON-RPC communication with blockchain nodes.

```
+-----------------------------------------------------------+
|                         Browser                           |
|                                                           |
|   +---------------+     +-----------------------------+   |
|   |   UI Layer    |<--->|      State / Context        |   |
|   | (React, Radix,|     | accounts, active network,   |   |
|   |  Tailwind)    |     | balances, wallet lock state |   |
|   +---------------+     +--------------+--------------+   |
|                                        |                  |
|                         +--------------v--------------+   |
|                         |        Chain Services       |   |
|                         |  Ethereum (Ethers.js)       |   |
|                         |  Solana (@solana/web3.js)   |   |
|                         +------+----------------+-----+   |
|                                |                |         |
|                  +-------------v---+   +--------v------+  |
|                  | Encrypted local |   |  JSON-RPC     |  |
|                  | key storage     |   |  requests     |  |
|                  +-----------------+   +--------+------+  |
+-------------------------------------------------|---------+
                                                  |
                          +-----------------------v---------+
                          | Infura / Alchemy / public RPC   |
                          | Ethereum and Solana nodes       |
                          +---------------------------------+
```

**Layers**

1. **UI layer.** React components organized by page and feature. Radix UI supplies accessible primitives, Tailwind CSS handles styling, and Framer Motion handles animation.
2. **State layer.** Application state such as the list of accounts, the active account, the selected network, and balances is shared across the interface.
3. **Chain services.** Ethereum and Solana each have a dedicated service module wrapping the native SDK. The UI interacts with a consistent interface and does not depend on chain-specific details.
4. **Storage layer.** Sensitive wallet data is encrypted and persisted locally in the browser. Nothing is transmitted to a Kiwi-operated server.
5. **Network layer.** Balances, fees, and transaction submission happen over JSON-RPC to the configured provider for the selected network.

## Project Structure

<!-- Keep this tree in sync with the repository when directories change. -->

```
kiwi-wallet/
├── public/                     Static assets (favicon, images)
├── src/
│   ├── components/
│   │   ├── ui/                 Reusable primitives (buttons, dialogs, tabs, inputs)
│   │   ├── landing/            Landing page sections and animated elements
│   │   ├── wallet/             Wallet setup (create, import, seed phrase backup)
│   │   ├── dashboard/          Dashboard layout, asset list, activity feed
│   │   ├── modals/             Send and Receive modals
│   │   └── settings/           Account management and key viewing
│   ├── pages/                  Route-level views (Landing, Setup, Dashboard)
│   ├── context/                Shared application state providers
│   ├── hooks/                  Custom React hooks
│   ├── lib/
│   │   ├── ethereum/           Ethers.js service layer
│   │   ├── solana/             @solana/web3.js service layer
│   │   ├── networks.ts         Network and RPC endpoint definitions
│   │   ├── crypto.ts           Encryption and secure storage helpers
│   │   └── utils.ts            Formatting and shared helpers
│   ├── types/                  Shared TypeScript types
│   ├── App.tsx                 Router and top-level providers
│   ├── main.tsx                Application entry point
│   └── index.css               Tailwind directives and global styles
├── .env                        Local environment variables (not committed)
├── index.html                  HTML entry and metadata
├── package.json
├── tailwind.config.js          Theme and design tokens
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Key Components

| Component            | Responsibility                                                                          |
|----------------------|-----------------------------------------------------------------------------------------|
| Landing page         | Introduces the product with a hero section and animated kiwi-themed elements.          |
| Wallet setup         | Create a new wallet or import an existing seed phrase; guides the user through backup.  |
| Dashboard            | Main interface with tabs for assets and activity.                                       |
| Send / Receive       | Modal flows for transferring assets and displaying the receiving address.               |
| Network selector     | Switches between mainnet and test networks for the active chain.                        |
| Settings             | Account management, key viewing, and preference controls.                               |

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kiwi-wallet.git
cd kiwi-wallet

# Install dependencies
npm install

# Create the environment file (see Configuration)
cp .env.example .env

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Configuration

Create a `.env` file in the project root:

```env
VITE_INFURA_API_KEY=your_infura_key_here
VITE_ALCHEMY_API_KEY=your_alchemy_key_here
```

| Variable               | Description                                         |
|------------------------|-----------------------------------------------------|
| `VITE_INFURA_API_KEY`  | API key for Infura RPC endpoints.                   |
| `VITE_ALCHEMY_API_KEY` | API key for Alchemy RPC endpoints.                  |

Because Vite embeds `VITE_` variables into the client bundle, these keys are visible to anyone who loads the application. Restrict them using the allowlist and rate-limit options provided by your RPC provider, and never place secrets in these variables.

## Available Scripts

| Command           | Description                                          |
|-------------------|------------------------------------------------------|
| `npm run dev`     | Start the development server with hot reload.        |
| `npm run build`   | Create an optimized production build.                |
| `npm run preview` | Serve the production build locally for verification. |

## Application Walkthrough

1. **Landing.** The user arrives at the landing page and chooses to get started.
2. **Wallet setup.** The user either creates a new wallet or imports one. For a new wallet, a 12-word recovery phrase is generated and must be backed up before continuing.
3. **Dashboard.** After setup, the dashboard shows the active account, its balances, and an activity tab with transaction history.
4. **Network selection.** The user can switch the active chain and network, for example from Ethereum Mainnet to Sepolia, using the network selector.
5. **Send and receive.** The Send modal builds and submits a transfer on the active network. The Receive modal exposes the account address for incoming funds.
6. **Settings.** The user can add or switch accounts, view keys after confirmation, and adjust preferences.

## Security Model

Kiwi follows a non-custodial design.

- **Local key storage.** Private keys and recovery phrases are generated and stored on the user's device. They are not sent to any server.
- **Encrypted storage.** Sensitive data is encrypted before being persisted in the browser.
- **Recovery phrase.** Wallets are recoverable through a 12-word mnemonic. Whoever holds this phrase controls the funds.
- **No tracking.** The application does not include analytics or data collection.
- **Open source.** The codebase is public so that the community can inspect and review it.

### Limitations and recommendations

- Browser-based wallets are exposed to the risks of the browser environment, including malicious extensions, compromised devices, and phishing sites. Only use the application from the official URL listed above.
- The project has not undergone a formal third-party security audit. Do not use it to hold funds you cannot afford to lose.
- Use test networks (Sepolia, Devnet) while evaluating the application.
- Store the recovery phrase offline. Never share it, and never enter it on any site other than a wallet you trust.

To report a vulnerability, please open a private security advisory on the repository rather than a public issue.

## Design System

The interface uses a fresh palette inspired by the kiwi fruit.

| Role      | Color         | Hex       |
|-----------|---------------|-----------|
| Primary   | Lime Green    | `#84CC16` |
| Secondary | Emerald Green | `#10B981` |
| Accent    | Fresh Lime    | `#BEF264` |

Tailwind CSS provides the utility-first styling layer, with Radix UI primitives supplying accessible interactive components and Framer Motion driving animation.

## Deployment

The application is a static Vite build and deploys to any static hosting provider. The production instance runs on Vercel.

```bash
npm run build
```

The output is written to the `dist/` directory. To deploy on Vercel, import the repository, set the framework preset to Vite, and define the environment variables listed in the Configuration section in the project settings.

## Roadmap

Planned or potential areas of improvement:

- Token and NFT support beyond native assets
- Hardware wallet integration
- Transaction simulation and fee estimation improvements
- Additional EVM-compatible networks
- Automated test coverage and a third-party security audit

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request describing the change and its motivation.

Please keep changes focused, follow the existing TypeScript and formatting conventions, and include a clear description of any security-relevant behavior.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Disclaimer

Kiwi Wallet is provided "as is", without warranty of any kind. Use at your own risk. The authors are not responsible for any loss of funds. Always keep your seed phrase secure and never share it with anyone.

## Acknowledgments

- Inspired by MetaMask and other modern Web3 wallets.
- Built by Amcha.
- Thanks to the Ethereum and Solana communities and the maintainers of the open source libraries this project depends on.

## Contact

- Portfolio: [WillxTech](https://willx.tech)
- GitHub: [SheerWill007](https://github.com/SheerWill007)