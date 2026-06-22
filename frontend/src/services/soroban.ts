import { Contract, rpc, scValToNative, nativeToScVal } from '@stellar/stellar-sdk';
import { getPublicKey, signTransaction } from '@stellar/freighter-api';

const SERVER_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

// Example Contract IDs (to be populated after deployment)
const CAMPAIGN_MANAGER_ID = 'C...'; 

export const sorobanServer = new rpc.Server(SERVER_URL);

/**
 * Initiates an investment transaction
 */
export async function investInCampaign(campaignId: number, amount: string) {
  try {
    const pubKey = await getPublicKey();
    const contract = new Contract(CAMPAIGN_MANAGER_ID);
    
    // Convert to stroops (1 XLM = 10,000,000 stroops)
    const stroops = BigInt(parseFloat(amount) * 10000000);

    const txBuilder = await sorobanServer.prepareTransaction(
      contract.call('invest', nativeToScVal(pubKey, { type: 'address' }), nativeToScVal(campaignId, { type: 'u32' }), nativeToScVal(stroops, { type: 'i128' }))
    );

    // Normally we would sign and submit here. 
    // const signedTx = await signTransaction(txBuilder.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    // const response = await sorobanServer.sendTransaction(signedTx);
    // return response;

    return { status: 'mock_success' };
  } catch (error) {
    console.error('Investment error:', error);
    throw error;
  }
}

/**
 * Votes on a milestone
 */
export async function voteMilestone(campaignId: number, voteYes: boolean) {
  try {
    const pubKey = await getPublicKey();
    const contract = new Contract(CAMPAIGN_MANAGER_ID);
    
    const txBuilder = await sorobanServer.prepareTransaction(
      contract.call('vote_milestone', nativeToScVal(pubKey, { type: 'address' }), nativeToScVal(campaignId, { type: 'u32' }), nativeToScVal(voteYes, { type: 'bool' }))
    );

    return { status: 'mock_success' };
  } catch (error) {
    console.error('Voting error:', error);
    throw error;
  }
}
