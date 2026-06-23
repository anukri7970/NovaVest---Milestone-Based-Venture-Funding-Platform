import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle } from 'lucide-react';
import { useNova } from '../context/NovaContext';

export const Governance: React.FC = () => {
  const { campaigns, vote } = useNova();

  // Find campaigns that have an active vote
  const activeVotes = campaigns.filter(c => 
    c.currentMilestoneIndex < c.milestones.length && 
    !c.milestones[c.currentMilestoneIndex].approved
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Governance Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review and vote on active funding milestones across all your invested campaigns.</p>
      </div>

      {activeVotes.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <AlertTriangle size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Active Proposals</h3>
          <p style={{ color: 'var(--text-muted)' }}>There are currently no active milestones requiring a vote.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activeVotes.map((campaign, idx) => {
            const milestone = campaign.milestones[campaign.currentMilestoneIndex];
            const requiredVotes = campaign.raised / 2;
            const progress = (milestone.votesFor / requiredVotes) * 100;

            return (
              <motion.div 
                key={campaign.id}
                className="glass-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--gradient-btn)' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>{campaign.name}</h3>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Proposal: Unlock {milestone.percentage}% for {milestone.desc}</div>
                  </div>
                  <span className="status-badge status-active"><Activity size={14} /> Active Vote</span>
                </div>

                <div className="progress-container" style={{ marginTop: '2rem' }}>
                  <div className="progress-stats" style={{ marginBottom: '0.5rem' }}>
                    <span>Approval Progress</span>
                    <span>{milestone.votesFor.toLocaleString()} / {requiredVotes.toLocaleString()} Votes</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill" 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 1 }}
                      style={{ background: progress >= 100 ? 'var(--success)' : 'var(--gradient-btn)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                    onClick={() => vote(campaign.id, true)}
                  >
                    Approve (Vote YES)
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="btn-danger"
                    onClick={() => vote(campaign.id, false)}
                  >
                    Reject
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
