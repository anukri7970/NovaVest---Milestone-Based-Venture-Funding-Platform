import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NovaProvider, useNova, type Campaign } from './context/NovaContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExploreCampaigns } from './components/ExploreCampaigns';
import { CampaignDetails } from './components/CampaignDetails';
import { CreatorDashboard } from './components/CreatorDashboard';
import { Governance } from './components/Governance';
import { Wallet } from 'lucide-react';
import { useFreighter } from './hooks/useFreighter';
import { Toaster } from 'react-hot-toast';
import './index.css';

type Tab = 'explore' | 'portfolio' | 'create' | 'governance';

function AppContent() {
  const { address, balance, connect, disconnect, error, deductBalance } = useFreighter();
  const [activeTab, setActiveTab] = useState<Tab>('explore');
  const { campaigns, investments } = useNova();
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  const activeCampaign = selectedCampaignId 
    ? campaigns.find(c => c.id === selectedCampaignId) || null 
    : null;

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaignId(campaign.id);
  };

  const handleBackToExplore = () => {
    setSelectedCampaignId(null);
  };

  return (
    <div className="app-container">
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: 'rgba(25, 25, 45, 0.9)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '12px',
        }
      }} />
      <Navbar address={address} balance={balance} connect={connect} disconnect={disconnect} />

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeCampaign ? (
          <CampaignDetails 
            key="details" 
            campaign={activeCampaign} 
            onBack={handleBackToExplore} 
            onInvestSuccess={(amount) => deductBalance(amount)}
          />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Hero />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="tab-container">
                <div className={`tab ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>Explore</div>
                <div className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>Portfolio</div>
                <div className={`tab ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}>Governance</div>
                <div className={`tab ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>Create Campaign</div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'explore' && <ExploreCampaigns onSelect={handleSelectCampaign} />}
                
                {activeTab === 'portfolio' && (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
                    {address ? (
                      <>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Your Investments</h3>
                        {investments.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)' }}>You haven't invested in any campaigns yet.</p>
                        ) : (
                          <div style={{ textAlign: 'left' }}>
                            {investments.map((inv, idx) => {
                              const campaignName = campaigns.find(c => c.id === inv.campaignId)?.name || 'Unknown Campaign';
                              return (
                                <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <span style={{ fontWeight: 'bold' }}>{campaignName}</span>
                                  <span style={{ color: '#00f0ff' }}>{inv.amount.toLocaleString()} XLM</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <Wallet size={48} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ marginBottom: '1rem' }}>Connect Wallet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Connect your Freighter wallet to view your secure investments.</p>
                        <button className="btn-primary" onClick={connect}>Connect Freighter</button>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'create' && <CreatorDashboard />}
                
                {activeTab === 'governance' && <Governance />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <NovaProvider>
      <AppContent />
    </NovaProvider>
  );
}

export default App;
