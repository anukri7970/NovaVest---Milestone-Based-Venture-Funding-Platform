import { useState, useEffect } from 'react';
import { 
  isConnected, 
  requestAccess, 
  getNetworkDetails
} from '@stellar/freighter-api';

export function useFreighter() {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (await isConnected()) {
          const access: any = await requestAccess();
          setAddress(typeof access === 'string' ? access : access.address);
          const net = await getNetworkDetails();
          setNetwork(net);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkConnection();
  }, []);

  const connect = async () => {
    try {
      if (await isConnected()) {
        const access: any = await requestAccess();
        setAddress(typeof access === 'string' ? access : access.address);
        const net = await getNetworkDetails();
        setNetwork(net);
        setError(null);
      } else {
        setError('Freighter is not installed or locked.');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to connect Freighter');
    }
  };

  return { address, network, connect, error };
}
