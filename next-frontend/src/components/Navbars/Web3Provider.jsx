'use client';

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http } from '@wagmi/core';
import { mainnet, sepolia, polygon } from '@wagmi/chains';
import { 
  metaMask, 
  walletConnect, 
  coinbaseWallet 
} from '@wagmi/connectors';

// Create a query client
const queryClient = new QueryClient();

// Create wagmi config
const config = createConfig({
  chains: [mainnet, sepolia, polygon],
  connectors: [
    metaMask(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '' 
    }),
    coinbaseWallet({ 
      appName: 'Your App Name' 
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http()
  }
});

export function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}