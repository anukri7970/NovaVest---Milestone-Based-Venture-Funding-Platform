import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useNova } from '../context/NovaContext';

export const CreatorDashboard: React.FC = () => {
  const { addCampaign } = useNova();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startup, setStartup] = useState('');
  
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !goal || !startup) return;
    
    addCampaign({
      id: Math.floor(Math.random() * 10000),
      startup,
      name,
      goal: parseFloat(goal),
      raised: 0,
      currentMilestoneIndex: 0,
      milestones: [
        { desc: 'MVP Development', percentage: 40, approved: false, votesFor: 0 },
        { desc: 'Public Beta Launch', percentage: 30, approved: false, votesFor: 0 },
        { desc: 'Mainnet & Token TGE', percentage: 30, approved: false, votesFor: 0 }
      ]
    });
    
    alert(`Campaign "${name}" successfully proposed to the DAO!`);
    setName('');
    setGoal('');
    setStartup('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
        <PlusCircle color="var(--accent-cyan)" />
        Propose New Campaign
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Submit your startup to the NovaVest community. If approved by the initial compliance check, your campaign will go live for funding.
      </p>

      <form onSubmit={handleCreate}>
        <div className="input-group">
          <label>Campaign Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Stellar Defi Protocol" required />
        </div>
        
        <div className="input-group">
          <label>Startup Wallet Address / ID</label>
          <input type="text" value={startup} onChange={e => setStartup(e.target.value)} placeholder="G..." required />
        </div>

        <div className="input-group">
          <label>Funding Goal (XLM)</label>
          <input type="number" value={goal} onChange={e => setGoal(e.target.value)} placeholder="100000" required />
        </div>

        <div style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.3)', padding: '1.5rem', borderRadius: '12px', margin: '2rem 0' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--accent-purple)' }}>Standard 3-Stage Milestone Plan</h4>
          <ul style={{ color: 'var(--text-muted)', margin: 0, paddingLeft: '1.2rem', lineHeight: '1.6' }}>
            <li>MVP Development (40% unlock)</li>
            <li>Public Beta Launch (30% unlock)</li>
            <li>Mainnet & Token TGE (30% unlock)</li>
          </ul>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          Propose Campaign to DAO
        </motion.button>
      </form>
    </motion.div>
  );
};
