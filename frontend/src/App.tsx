import { useState } from 'react';
import { Rocket, Wallet, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { useFreighter } from './hooks/useFreighter';
import './index.css';

// Mock Data for UI demonstration before contract is wired
const MOCK_CAMPAIGNS = [
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

function App() {
  const { address, connect, error } = useFreighter();
  const [activeTab, setActiveTab] = useState<'explore' | 'portfolio'>('explore');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState('');

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Initiating investment of ${investAmount} XLM to ${selectedCampaign.name}... (Contract integration pending)`);
    setInvestAmount('');
  };

  const handleVote = (voteYes: boolean) => {
    alert(`Voting ${voteYes ? 'YES' : 'NO'} for milestone. (Contract integration pending)`);
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <Rocket size={28} color="#00f0ff" />
          NovaVest
        </div>
        <div>
          {address ? (
            <div className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet size={18} />
              {address.substring(0, 6)}...{address.substring(52)}
            </div>
          ) : (
            <button className="btn-primary" onClick={connect} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet size={18} />
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {error && (
        <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff5555', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {selectedCampaign ? (
        <div className="campaign-details">
          <button className="btn-secondary" onClick={() => setSelectedCampaign(null)} style={{ marginBottom: '2rem' }}>
            &larr; Back to Explore
          </button>
          
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selectedCampaign.name}</h1>
            <div className="campaign-startup">Startup: {selectedCampaign.startup}</div>
            
            <div className="progress-container" style={{ marginTop: '2rem' }}>
              <div className="progress-stats">
                <span>Raised: {selectedCampaign.raised.toLocaleString()} XLM</span>
                <span>Goal: {selectedCampaign.goal.toLocaleString()} XLM</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(selectedCampaign.raised / selectedCampaign.goal) * 100}%` }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <form onSubmit={handleInvest} style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                <input 
                  type="number" 
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder="Amount in XLM" 
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                  required
                />
                <button type="submit" className="btn-primary">Invest & Get Gov Tokens</button>
              </form>
            </div>
          </div>

          <h2>Funding Milestones</h2>
          <div className="milestone-list">
            {selectedCampaign.milestones.map((m: any, idx: number) => (
              <div key={idx} className={`milestone-item ${idx === selectedCampaign.currentMilestoneIndex ? 'active' : ''}`}>
                <div className="milestone-info">
                  <span className="milestone-desc">{m.desc}</span>
                  <span className="milestone-meta">Unlocks {m.percentage}% of funds</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {m.approved ? (
                    <span className="status-badge status-completed"><CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }}/> Approved</span>
                  ) : idx === selectedCampaign.currentMilestoneIndex ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="status-badge status-active"><Activity size={14} style={{ display: 'inline', marginRight: '4px' }}/> Active Vote</span>
                      <div className="vote-actions">
                        <button className="btn-secondary" style={{ padding: '0.4rem 1rem' }} onClick={() => handleVote(true)}>Vote YES</button>
                        <button className="btn-secondary" style={{ padding: '0.4rem 1rem', borderColor: '#ff5555', color: '#ff5555' }} onClick={() => handleVote(false)}>Vote NO</button>
                      </div>
                    </div>
                  ) : (
                    <span className="status-badge status-pending">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <>
          <div className="hero">
            <h1>Decentralized Venture Funding</h1>
            <p>Invest in startups safely. Funds are locked in smart contracts and released only when milestones are approved by investor vote.</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button className={activeTab === 'explore' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('explore')}>Explore Campaigns</button>
            <button className={activeTab === 'portfolio' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('portfolio')}>My Portfolio</button>
          </div>

          {activeTab === 'explore' && (
            <div className="grid">
              {MOCK_CAMPAIGNS.map(campaign => (
                <div key={campaign.id} className="glass-card" onClick={() => setSelectedCampaign(campaign)} style={{ cursor: 'pointer' }}>
                  <div className="campaign-header">
                    <div className="campaign-title">{campaign.name}</div>
                    <div className="campaign-startup">{campaign.startup}</div>
                  </div>
                  
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}></div>
                    </div>
                    <div className="progress-stats">
                      <span>{campaign.raised.toLocaleString()} XLM raised</span>
                      <span>{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>View Details</span>
                    <ChevronRight size={18} color="var(--accent-color)" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              {address ? (
                <>
                  <h3 style={{ marginBottom: '1rem' }}>Your Governance Tokens</h3>
                  <p style={{ color: 'var(--text-muted)' }}>You haven't invested in any campaigns yet.</p>
                </>
              ) : (
                <>
                  <Wallet size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ marginBottom: '1rem' }}>Connect Wallet</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Connect your Freighter wallet to view your investments.</p>
                  <button className="btn-primary" onClick={connect}>Connect Freighter</button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
