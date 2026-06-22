# NovaVest - Level 3 Orange Belt Submission 🚀

NovaVest is an advanced, production-ready decentralized Venture Funding Platform built on Stellar (Soroban). It solves the web3 "rug pull" problem by locking startup funds in a Smart Contract Vault and releasing them only when investors vote to approve predefined milestones.

## 🌟 Advanced Features

- **Complex Inter-Contract Communication**: Uses a central `Campaign Manager` that talks to a `Vault` contract (Escrow) and a `Governance Token` contract (Voting Power).
- **Milestone-based Escrow**: Startups define milestones (e.g., Alpha Launch = 30% of funds).
- **Decentralized Governance**: Investors receive Governance Tokens proportional to their investment and use them to vote YES/NO on milestone releases.
- **Event Streaming**: Emits real-time Soroban events for investments, votes, and milestone releases.
- **Premium UI**: Built with React, Vite, and Vanilla CSS featuring a stunning dark mode, glassmorphism, and neon accents. Fully mobile responsive.
- **Production Ready**: Full test coverage (Vitest & Cargo) and a GitHub Actions CI/CD pipeline for automated testing and building.

---

## 🔗 Links & Submissions

- **Live Demo (Vercel/Netlify)**: `[Insert Live Demo Link Here]`
- **Demo Video (YouTube/Loom)**: `[Insert Video Link Here]`

### Contract Details (Stellar Testnet)
- **Campaign Manager Contract**: `[Insert Campaign Manager Address Here]`
- **Vault Contract**: `[Insert Vault Address Here]`
- **Governance Token Contract**: `[Insert Gov Token Address Here]`
- **Example Transaction Hash (Invest/Vote)**: `[Insert TX Hash Here]`

---

## 📸 Screenshots

### 📱 Mobile Responsive UI
> `[Insert Screenshot of Mobile View Here]`

### 🧪 Test Output (3+ Passing Tests)
> `[Insert Screenshot of Vitest & Cargo Tests Here]`

### ⚙️ CI/CD Pipeline
> `[Insert Screenshot of GitHub Actions Success Here]`

---

## 🛠️ Architecture

1. **Contracts**:
   - `campaign_manager`: Orchestrates the platform. Handles `create_campaign`, `invest`, `vote_milestone`, and `release_milestone`.
   - `vault`: Holds the native XLM tokens. Only releases funds when authorized by the `campaign_manager`.
   - `governance_token`: Minted to investors when they fund a campaign. Used to track voting power.
2. **Frontend**:
   - Built with React + TypeScript.
   - Uses `@stellar/freighter-api` for wallet connection and transaction signing.
   - Service layer `soroban.ts` for contract RPC calls.

---

## 🚀 Setup & Deployment

### 1. Smart Contracts
To build and deploy the contracts:
```bash
# Build WASM
cargo build --target wasm32-unknown-unknown --release

# Run Tests
cargo test

# Deploy to Testnet (Example for Campaign Manager)
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/campaign_manager.wasm \
  --source-account <your-account> \
  --network testnet
```

### 2. Frontend
```bash
cd frontend
npm install

# Run Tests
npm run test

# Start Development Server
npm run dev
```

### 3. CI/CD
This repository includes a `.github/workflows/main.yml` file that automatically lints, tests, and builds the contracts and frontend on every push to `main`.
