# 🚀 NovaVest - Decentralized Milestone-Based Venture Funding

NovaVest is an advanced, production-ready decentralized Venture Funding Platform built on Stellar (Soroban). It solves the web3 "rug pull" problem by locking startup funds in a Smart Contract Vault and releasing them only when investors vote to approve predefined milestones.

## 🔗 Live Demo & Video Pitch
- **Live Platform**: [nova-vest-milestone-based-venture-f.vercel.app](https://nova-vest-milestone-based-venture-f.vercel.app/)
- **Demo Video**: [Watch the Demo on Google Drive](https://drive.google.com/file/d/1rJg1da4KQjCT_VO30-phupnAD05b-yll/view?usp=sharing)

## 🌟 Key Features

1. **Milestone-based Escrow**: Startups define milestones (e.g., Alpha Launch = 30% of funds). Capital is locked and protected.
2. **Decentralized Governance**: Investors act as a DAO, voting YES/NO on milestone releases. >50% approval automatically unlocks funds.
3. **Real Wallet Integration**: Full Freighter wallet connection with live balance tracking and cryptographic transaction signing on the Stellar Testnet.
4. **Premium UI**: Built with React, Vite, and Vanilla CSS featuring a stunning dark mode, glassmorphism, and neon accents. Fully mobile responsive.

---

## 📸 Platform Gallery

### 1. The Explore Dashboard
Browse high-quality, verified Web3 startups seeking funding.
<img src="scrrenshots/explore_page.png" width="100%" alt="Explore Page" />

### 2. Campaign Details & Investment
Deep dive into a startup's vision, view their funding progress, and invest XLM directly.
<img src="scrrenshots/campaign_details.png" width="100%" alt="Campaign Details" />

### 3. Live Freighter Signature & Investment
Real-time integration with the Freighter Wallet to securely sign Soroban transactions.
<img src="scrrenshots/freighter_signature.png" width="100%" alt="Freighter Signature" />

### 4. Successful Investment Notification
Live feedback and transaction tracking on the Stellar Expert Explorer.
<img src="scrrenshots/invested.png" width="100%" alt="Invested" />

### 5. Investor Portfolio
Track all your active investments and live wallet balances in one place.
<img src="scrrenshots/portfolio.png" width="100%" alt="Portfolio" />
<br />
<img src="scrrenshots/wallet_balance.png" width="100%" alt="Wallet Balance" />

### 6. Decentralized Governance
Vote on active startup milestones to decide if they should receive their next tranche of funding.
<img src="scrrenshots/governance_dashboard.png" width="100%" alt="Governance Dashboard" />
<br />
<img src="scrrenshots/vote_notification.png" width="100%" alt="Vote Notification" />

### 7. Propose New Campaign
Submit your own Web3 startup for community funding, complete with automated 3-stage milestone tracking.
<img src="scrrenshots/propose.png" width="100%" alt="Propose Campaign" />

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React, Vite, TypeScript, Vanilla CSS (Glassmorphism UI)
- **Blockchain**: Stellar Network, Soroban Smart Contracts
- **Wallet Integration**: `@stellar/freighter-api`, `@stellar/stellar-sdk`
- **CI/CD**: GitHub Actions (Automated testing & deployments)
- **Deployment**: Vercel

## 🚀 Setup & Deployment

### Run Locally
```bash
cd frontend
npm install
npm run dev
```

### Run Tests
```bash
cd frontend
npm run test
```
