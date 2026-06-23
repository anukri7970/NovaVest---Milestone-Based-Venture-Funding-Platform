import { useState, useCallback } from 'react';
import { requestAccess, setAllowed } from '@stellar/freighter-api';
import { Horizon } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

export const useFreighter = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async (pubKey: string) => {
    try {
      const account = await server.loadAccount(pubKey);
      const nativeBalance = account.balances.find(b => b.asset_type === 'native');
      if (nativeBalance) {
        setBalance(parseFloat(nativeBalance.balance).toFixed(2));
      }
    } catch (e) {
      console.warn("Could not fetch balance. Account might not be funded on testnet.", e);
      setBalance("0.00");
    }
  };

  const connect = useCallback(async () => {
    try {
      setError(null);
      await setAllowed();
      const response = await requestAccess();
      
      if (response && response.address) {
        setAddress(response.address);
        await fetchBalance(response.address);
      } else if (response && response.error) {
        setError(response.error as string);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to Freighter. Please ensure the extension is installed and unlocked.');
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
  }, []);

  const deductBalance = useCallback((amount: number) => {
    setBalance(prev => {
      if (!prev) return prev;
      const newBal = parseFloat(prev) - amount;
      return newBal > 0 ? newBal.toFixed(2) : "0.00";
    });
  }, []);

  return { address, balance, connect, disconnect, error, deductBalance };
};
