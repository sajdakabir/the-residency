'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { polygonMumbai, polygon } from 'wagmi/chains';
import { metaMask, walletConnect, injected } from 'wagmi/connectors';

// Configure chains
const chains = [polygonMumbai, polygon] as const;

// Create wagmi config
const config = createConfig({
  chains,
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "dummy-project-id",
    }),
  ],
  transports: {
    [polygonMumbai.id]: http(),
    [polygon.id]: http(),
  },
});

// Create a client
const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
} 