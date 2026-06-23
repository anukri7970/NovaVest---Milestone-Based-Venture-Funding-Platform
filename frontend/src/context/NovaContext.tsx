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
    startup: 'GDEBQ...7X2A',
    name: 'Orbit Protocol',
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
    startup: 'GXXXX...YYYY',
    name: 'Stellar DEX Aggregator',
    goal: 100000,
    raised: 95000,
    milestones: [
      { desc: 'Smart Contracts', percentage: 50, approved: true, votesFor: 60000 },
      { desc: 'Frontend UI', percentage: 50, approved: false, votesFor: 40000 },
    ],
    currentMilestoneIndex: 1
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
