import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNova, type Campaign } from '../context/NovaContext';

interface ExploreProps {
  onSelect: (campaign: Campaign) => void;
}

export const ExploreCampaigns: React.FC<ExploreProps> = ({ onSelect }) => {
  const { campaigns } = useNova();

  return (
    <div className="grid">
      {campaigns.map((campaign, index) => (
        <motion.div 
          key={campaign.id} 
          className="glass-card" 
          onClick={() => onSelect(campaign)} 
          style={{ cursor: 'pointer' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="campaign-header">
            <div className="campaign-title">{campaign.name}</div>
            <div className="campaign-startup">{campaign.startup}</div>
          </div>
          
          <div className="progress-container">
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
