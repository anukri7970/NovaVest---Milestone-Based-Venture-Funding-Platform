import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Activity, ArrowLeft, Loader2 } from 'lucide-react';
import { useNova, type Campaign } from '../context/NovaContext';
import { investInCampaign } from '../services/soroban';
import toast from 'react-hot-toast';

interface DetailsProps {
  campaign: Campaign;
  onBack: () => void;
  onInvestSuccess?: (amount: number) => void;
}

export const CampaignDetails: React.FC<DetailsProps> = ({ campaign, onBack, onInvestSuccess }) => {
  const { invest, vote } = useNova();
  const [investAmount, setInvestAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsInvesting(true);
    
    // We create a custom toast to show the signing state, then update it upon success.
    const loadingToastId = toast.loading('Waiting for wallet signature...');
    
    try {
      const result = await investInCampaign(campaign.id, campaign.startup, amount.toString());
      
      // Update global context so UI changes
      invest(campaign.id, amount);
      if (onInvestSuccess) onInvestSuccess(amount);
      setInvestAmount('');
      
      toast.success(
        <div>
          Successfully invested {amount} XLM!
          <br/>
          <a 
            href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ color: '#00f0ff', fontSize: '0.85rem', textDecoration: 'underline', marginTop: '4px', display: 'block' }}
          >
            View on Stellar Expert Explorer
          </a>
        </div>,
        { id: loadingToastId, duration: 8000 }
      );
    } catch (err: any) {
      console.error(err);
      toast.error(`Transaction failed: ${err.message || 'Unknown error'}`, { id: loadingToastId });
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="campaign-details"
    >
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back to Explore
      </button>
      
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #00f0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {campaign.name}
          </h1>
          <span style={{ fontSize: '0.9rem', background: 'rgba(124, 58, 237, 0.2)', color: 'var(--accent-purple)', padding: '0.4rem 1rem', borderRadius: '16px', border: '1px solid rgba(124, 58, 237, 0.4)' }}>
            {campaign.category}
          </span>
        </div>
        
        <div className="campaign-startup" style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
          Startup ID: {campaign.startup}
        </div>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '1.5rem', lineHeight: '1.6' }}>
          {campaign.description}
        </p>
        
        <div className="progress-container" style={{ marginTop: '2.5rem' }}>
          <div className="progress-stats" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            <span>Raised: <strong style={{ color: '#00f0ff' }}>{campaign.raised.toLocaleString()} XLM</strong></span>
            <span>Goal: {campaign.goal.toLocaleString()} XLM</span>
          </div>
          <div className="progress-bar" style={{ height: '12px' }}>
            <motion.div 
              className="progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Invest in this campaign</h3>
          <form onSubmit={handleInvest} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input 
              type="number" 
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              placeholder="Amount in XLM" 
              style={{ flex: '1 1 200px' }}
              disabled={isInvesting}
              required
            />
            <motion.button 
              whileHover={isInvesting ? {} : { scale: 1.02 }}
              whileTap={isInvesting ? {} : { scale: 0.98 }}
              type="submit" 
              className="btn-primary" 
              disabled={isInvesting}
              style={{ flex: '0 0 auto', opacity: isInvesting ? 0.7 : 1 }}
            >
              {isInvesting ? (
                <>
                  <Loader2 className="spinner" size={18} />
                  Signing...
                </>
              ) : (
                "Invest & Mint Gov Tokens"
              )}
            </motion.button>
          </form>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Funding Milestones Roadmap</h2>
      <div className="milestone-list" style={{ borderTop: 'none', paddingTop: 0 }}>
        {campaign.milestones.map((m, idx) => (
          <motion.div 
            key={idx} 
            className={`milestone-item ${idx === campaign.currentMilestoneIndex ? 'active' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            style={{ padding: '1.5rem', marginBottom: '1.2rem', background: idx === campaign.currentMilestoneIndex ? 'rgba(0, 240, 255, 0.05)' : 'rgba(0,0,0,0.4)' }}
          >
            <div className="milestone-info">
              <span className="milestone-desc" style={{ fontSize: '1.2rem' }}>{m.desc}</span>
              <span className="milestone-meta" style={{ marginTop: '0.5rem' }}>
                Unlocks <strong style={{ color: 'var(--text-main)' }}>{m.percentage}%</strong> of treasury funds
              </span>
              {idx === campaign.currentMilestoneIndex && !m.approved && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-purple)' }}>
                  Current Votes: {m.votesFor.toLocaleString()} / {(campaign.raised / 2).toLocaleString()} required
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {m.approved ? (
                <span className="status-badge status-completed"><CheckCircle2 size={16} /> Approved</span>
              ) : idx === campaign.currentMilestoneIndex ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                  <span className="status-badge status-active"><Activity size={16} /> Active Vote</span>
                  <div className="vote-actions">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="btn-primary" style={{ padding: '0.5rem 1.2rem' }} 
                      onClick={() => {
                        vote(campaign.id, true);
                        toast.success('You voted YES on this milestone!');
                      }}
                    >
                      Vote YES
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="btn-danger" 
                      onClick={() => {
                        vote(campaign.id, false);
                        toast.error('You voted NO on this milestone.');
                      }}
                    >
                      Vote NO
                    </motion.button>
                  </div>
                </div>
              ) : (
                <span className="status-badge status-pending">Pending</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
