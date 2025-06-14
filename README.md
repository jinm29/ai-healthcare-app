# XEN Calendar

A modern web application that allows XEN Crypto users to connect their wallet and export all their active mints to a calendar file. The app supports XenFTs, single mints, and Cointool bulk mints across multiple EVM chains.

## Features

- 🔗 **Wallet Connection**: Connect using RainbowKit with support for multiple wallets
- 🌐 **Multi-Chain Support**: Switch between 11+ EVM chains directly in your wallet
- 🔌 **Wallet RPC**: Uses your wallet's RPC provider - no external RPC endpoints needed
- 📊 **Comprehensive Mint Detection**:
  - XenFT mints
  - Single XEN mints
  - Cointool batch mints (Ethereum only)
- 📅 **Calendar Export**: Export all your mints to an ICS file compatible with Google Calendar, Apple Calendar, and more
- 🎨 **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Supported Chains

- Ethereum
- BSC (Binance Smart Chain)
- Polygon
- Avalanche
- Ethereum PoW
- Moonbeam
- EVMOS
- Fantom
- PulseChain
- Optimism
- Base

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Web3 wallet (MetaMask, Rainbow, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/xen-calendar-app.git
cd xen-calendar-app
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. (Optional) Create a `.env` file in the root directory for your own WalletConnect project ID:
```env
REACT_APP_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your WalletConnect project ID from [https://cloud.walletconnect.com](https://cloud.walletconnect.com). The app includes a default project ID for testing, but you should use your own for production.

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Usage

1. **Connect Your Wallet**: Click the "Connect Wallet" button and choose your preferred wallet
2. **Switch Network**: Use the network switcher to change to your desired chain, or switch directly in your wallet
3. **Fetch Mints**: Click "Fetch Mints on [Network]" to load your mints for the current network
4. **Review**: View all your mints in the table with maturity dates and time remaining
5. **Export**: Click "Export to Calendar" to download an ICS file
6. **Import**: Import the ICS file into your preferred calendar application

Note: The app uses your wallet's RPC provider, so make sure your wallet is connected to a reliable RPC endpoint for the best experience.

## Building for Production

```bash
npm run build
```

The build files will be in the `build` directory, ready for deployment.

## Technology Stack

- **React** with TypeScript
- **Wagmi** & **RainbowKit** for Web3 integration
- **Ethers.js** for blockchain interactions
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **date-fns** for date formatting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by the original Python XenFT export tool by TreeCityWes.eth
- XEN Crypto community for the amazing protocol
