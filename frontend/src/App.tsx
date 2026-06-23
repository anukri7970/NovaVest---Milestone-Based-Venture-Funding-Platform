import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NovaProvider, type Campaign } from './context/NovaContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExploreCampaigns } from './components/ExploreCampaigns';
import { CampaignDetails } from './components/CampaignDetails';
import { CreatorDashboard } from './components/CreatorDashboard';
import { Governance } from './components/Governance';
import { Wallet } from 'lucide-react';
import { useFreighter } from './hooks/useFreighter';
import './index.css';

type Tab = 'explore' | 'portfolio' | 'create' | 'governance';

function AppContent() {
  const { address, connect, error } = useFreighter();
  const [activeTab, setActiveTab] = useState<Tab>('explore');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleBackToExplore = () => {
    setSelectedCampaign(null);
  };

  return (
    <div className="app-container">
      <Navbar />

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedCampaign ? (
          <CampaignDetails 
            key="details" 
            campaign={selectedCampaign} 
            onBack={handleBackToExplore} 
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
                        <p style={{ color: 'var(--text-muted)' }}>You haven't invested in any campaigns yet.</p>
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
