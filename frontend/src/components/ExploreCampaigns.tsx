import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNova, type Campaign } from '../context/NovaContext';

interface ExploreProps {
  onSelect: (campaign: Campaign) => void;
}

export const ExploreCampaigns: React.FC<ExploreProps> = ({ onSelect }) => {
  const { campaigns } = useNova();

  // Helper to truncate Stellar address
  const truncateAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="grid">
      {campaigns.map((campaign, index) => (
        <motion.div 
          key={campaign.id} 
          className="glass-card" 
          onClick={() => onSelect(campaign)} 
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="campaign-header" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div className="campaign-title" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{campaign.name}</div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(124, 58, 237, 0.2)', color: 'var(--accent-purple)', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(124, 58, 237, 0.4)' }}>
                {campaign.category}
              </span>
            </div>
            <div className="campaign-startup" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {truncateAddress(campaign.startup)}
            </div>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', flexGrow: 1 }}>
            {campaign.description}
          </p>
          
          <div className="progress-container" style={{ marginTop: 'auto' }}>
            <div className="progress-bar">
              <motion.div 
                className="progress-fill" 
                initial={{ width: 0 }}
                animate={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <div className="progress-stats">
              <span>{campaign.raised.toLocaleString()} XLM raised</span>
              <span>{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>View Details</span>
            <ChevronRight size={18} color="var(--accent-cyan)" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
