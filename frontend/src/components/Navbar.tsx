import React from 'react';
import { Rocket, Wallet, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  address: string | null;
  balance: string | null;
  connect: () => void;
  disconnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ address, balance, connect, disconnect }) => {

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.5rem 0', 
        borderBottom: '1px solid var(--border-color)', 
        marginBottom: '3rem' 
      }}
    >
      <div className="logo" style={{ fontSize: '1.8rem', fontWeight: 800, background: 'var(--gradient-btn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Rocket size={28} color="#00f0ff" />
        NovaVest
      </div>
      <div>
        {address ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'default' }}>
              <Wallet size={18} />
              {balance ? `${balance} XLM` : 'Loading...'} 
              <span style={{ opacity: 0.5, marginLeft: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '0.5rem' }}>
                {address.substring(0, 4)}...{address.substring(52)}
              </span>
            </div>
            <button onClick={disconnect} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }} title="Disconnect">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary" 
            onClick={connect} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Wallet size={18} />
            Connect Wallet
          </motion.button>
        )}
      </div>
    </motion.header>
  );
};
