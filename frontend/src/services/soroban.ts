import { Horizon, TransactionBuilder, Networks, Asset, Operation } from '@stellar/stellar-sdk';
import { requestAccess, signTransaction } from '@stellar/freighter-api';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const NETWORK_PASSPHRASE = Networks.TESTNET;

/**
 * Initiates an investment transaction on the Stellar Testnet
 * Builds a real XLM payment transaction to the startup's wallet,
 * signs it using Freighter, and submits it to Horizon.
 */
export async function investInCampaign(_campaignId: number, startupAddress: string, amount: string) {
  try {
    // 1. Get user's public key from Freighter
    const response = await requestAccess();
    if (!response || !response.address) throw new Error("Wallet not connected");
    const pubKey = response.address;

    // 2. Load the user's account to get their sequence number
    const account = await server.loadAccount(pubKey);

    // 3. Build the payment transaction
    const tx = new TransactionBuilder(account, {
      fee: '100', // 100 stroops minimum fee
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.payment({
          destination: startupAddress,
          asset: Asset.native(),
          amount: amount, // e.g. "100.50"
        })
      )
      .setTimeout(30)
      .build();

    // 4. Sign the transaction using Freighter
    const signedResponse = await signTransaction(tx.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE
    });

    if (signedResponse.error) {
      throw new Error(signedResponse.error as string);
    }

    // 5. Submit the transaction to the network
    // We rebuild the transaction from the signed XDR so we can submit it
    const txToSubmit = TransactionBuilder.fromXDR(signedResponse.signedTxXdr as string, NETWORK_PASSPHRASE);
    const result = await server.submitTransaction(txToSubmit as any);
    
    return { status: 'success', hash: result.hash };
  } catch (error) {
    console.error('Investment error:', error);
    throw error;
  }
}

/**
 * Votes on a milestone
 * Currently mocked since voting doesn't transfer funds in this demo.
 */
export async function voteMilestone(campaignId: number, voteYes: boolean) {
  try {
    const response = await requestAccess();
    void campaignId;
    void voteYes;
    void response;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return { status: 'mock_success' };
  } catch (error) {
    console.error('Voting error:', error);
    throw error;
  }
}
