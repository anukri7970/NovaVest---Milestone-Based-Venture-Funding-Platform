import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Milestone {
  desc: string;
  percentage: number;
  approved: boolean;
  votesFor: number;
}

export interface Campaign {
  id: number;
  startup: string;
  name: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  milestones: Milestone[];
  currentMilestoneIndex: number;
}

export interface Investment {
  campaignId: number;
  amount: number;
}

interface NovaContextType {
  campaigns: Campaign[];
  investments: Investment[];
  addCampaign: (campaign: Campaign) => void;
  invest: (campaignId: number, amount: number) => void;
  vote: (campaignId: number, voteYes: boolean) => void;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    startup: 'GCXWUSOPSLQTMDDYLKZV7RN5J4KSB4VAMGIJGZN2ZVRLYDC7X3SW2KWW',
    name: 'Orbit Protocol',
    description: 'A decentralized lending protocol built specifically for Stellar assets, providing high-yield liquidity pools.',
    category: 'DeFi',
    goal: 50000,
    raised: 25000,
    milestones: [
      { desc: 'Alpha Launch', percentage: 30, approved: true, votesFor: 15000 },
      { desc: 'Mainnet Release', percentage: 40, approved: false, votesFor: 5000 },
      { desc: 'User Acquisition', percentage: 30, approved: false, votesFor: 0 },
    ],
    currentMilestoneIndex: 1
  },
  {
    id: 2,
    startup: 'GAP4ZFI3LZNTCDHMNVTG6J5UBAPKAQ3USFAI6ZZ72Q745TONRUCTZTBU',
    name: 'Stellar DEX Aggregator',
    description: 'An intelligent router that aggregates liquidity from all Soroban automated market makers to ensure the best swap rates.',
    category: 'Infrastructure',
    goal: 100000,
    raised: 95000,
    milestones: [
      { desc: 'Smart Contracts', percentage: 50, approved: true, votesFor: 60000 },
      { desc: 'Frontend UI', percentage: 50, approved: false, votesFor: 40000 },
    ],
    currentMilestoneIndex: 1
  },
  {
    id: 3,
    startup: 'GAA6QJ6SC3WTZLLQ4AX5CT4KPRRMY2NUEPMHPJ5KCRFDRJ52QCQ4PICF',
    name: 'Nova Wallet',
    description: 'A next-generation mobile wallet tailored specifically for seamless Soroban smart contract interactions and social recovery.',
    category: 'Wallet',
    goal: 75000,
    raised: 15000,
    milestones: [
      { desc: 'Beta Release', percentage: 40, approved: false, votesFor: 5000 },
      { desc: 'Security Audit', percentage: 30, approved: false, votesFor: 0 },
      { desc: 'Public Launch', percentage: 30, approved: false, votesFor: 0 },
    ],
    currentMilestoneIndex: 0
  },
  {
    id: 4,
    startup: 'GC5RHKBKUOIU7DXXOPUXNSJVC4F5S6OODZFU7A5G7UEMEZTEG2CDMYJQ',
    name: 'Astro Games Hub',
    description: 'The first decentralized gaming hub on Stellar, allowing players to earn and trade true on-chain assets via Soroban.',
    category: 'Gaming',
    goal: 200000,
    raised: 50000,
    milestones: [
      { desc: 'Game Engine Integration', percentage: 30, approved: true, votesFor: 120000 },
      { desc: 'First Mini-Game Launch', percentage: 40, approved: false, votesFor: 10000 },
      { desc: 'Creator Studio', percentage: 30, approved: false, votesFor: 0 },
    ],
    currentMilestoneIndex: 1
  },
  {
    id: 5,
    startup: 'GC4C7ZSNEDIHKXVDTSL4BN2G2FILGJPFM2Z4LEKF6DYDL2KEAUNHLTCX',
    name: 'Lumens AI',
    description: 'An AI-driven trading bot that executes high-frequency arbitrage opportunities across the Stellar decentralized exchange.',
    category: 'AI / Trading',
    goal: 30000,
    raised: 28000,
    milestones: [
      { desc: 'Algorithm Training', percentage: 50, approved: true, votesFor: 15000 },
      { desc: 'Live Bot Deployment', percentage: 50, approved: false, votesFor: 10000 },
    ],
    currentMilestoneIndex: 1
  },
  {
    id: 6,
    startup: 'GCIU2T43CGN6MEFNVWXFBHMFBNYVMGRWFK3OOU5OYRP4ECENMG2IKJ6N',
    name: 'Aqua Protocol',
    description: 'A liquid staking derivative protocol that allows users to earn yields on their locked XLM while retaining liquidity.',
    category: 'DeFi',
    goal: 150000,
    raised: 0,
    milestones: [
      { desc: 'Smart Contract Development', percentage: 40, approved: false, votesFor: 0 },
      { desc: 'Testnet Launch', percentage: 30, approved: false, votesFor: 0 },
      { desc: 'Mainnet & Audit', percentage: 30, approved: false, votesFor: 0 },
    ],
    currentMilestoneIndex: 0
  }
];

const NovaContext = createContext<NovaContextType | undefined>(undefined);

export const NovaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [...prev, campaign]);
  };

  const invest = (campaignId: number, amount: number) => {
    setInvestments(prev => {
      const existing = prev.find(i => i.campaignId === campaignId);
      if (existing) {
        return prev.map(i => i.campaignId === campaignId ? { ...i, amount: i.amount + amount } : i);
      }
      return [...prev, { campaignId, amount }];
    });
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, raised: c.raised + amount } : c
    ));
  };

  const vote = (campaignId: number, voteYes: boolean) => {
    if (!voteYes) return; // Currently only tracking YES votes for demo
    
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        const userInvestment = investments.find(i => i.campaignId === campaignId)?.amount || 0;
        const newMilestones = [...c.milestones];
        newMilestones[c.currentMilestoneIndex] = {
          ...newMilestones[c.currentMilestoneIndex],
          votesFor: newMilestones[c.currentMilestoneIndex].votesFor + userInvestment
        };
        
        // If votes > 50% of raised, auto-approve
        if (newMilestones[c.currentMilestoneIndex].votesFor > c.raised / 2) {
          newMilestones[c.currentMilestoneIndex].approved = true;
          return { ...c, milestones: newMilestones, currentMilestoneIndex: Math.min(c.currentMilestoneIndex + 1, c.milestones.length - 1) };
        }
        return { ...c, milestones: newMilestones };
      }
      return c;
    }));
  };

  return (
    <NovaContext.Provider value={{ campaigns, investments, addCampaign, invest, vote }}>
      {children}
    </NovaContext.Provider>
  );
};

export const useNova = () => {
  const context = useContext(NovaContext);
  if (!context) throw new Error('useNova must be used within NovaProvider');
  return context;
};
