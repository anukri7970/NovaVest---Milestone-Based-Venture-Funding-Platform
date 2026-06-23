import React from 'react';
import { Rocket, Wallet } from 'lucide-react';
import { useFreighter } from '../hooks/useFreighter';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { address, connect } = useFreighter();

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
          <div className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wallet size={18} />
            {address.substring(0, 6)}...{address.substring(52)}
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
