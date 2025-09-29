import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SwapInterface } from "@/components/SwapInterface";
import { AIAssistant } from "@/components/AIAssistant";
import { NFTBadge } from "@/components/NFTBadge";
import { WalletConnection } from "@/components/WalletConnection";
import { Wallet, Zap, Bot, Award } from "lucide-react";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [swapCount, setSwapCount] = useState(0);
  const [networkStatus, setNetworkStatus] = useState<'connected' | 'disconnected' | 'wrong-network'>('disconnected');

  const handleSwapComplete = () => {
    setSwapCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ZenRelay
              </h1>
              <p className="text-xs text-muted-foreground">ZenChain Testnet</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant={networkStatus === 'connected' ? 'default' : 'secondary'} className="hidden sm:flex">
              {networkStatus === 'connected' ? '🟢 ZTC Connected' : '🔴 Not Connected'}
            </Badge>
            <WalletConnection 
              isConnected={isConnected}
              onConnectionChange={setIsConnected}
              onNetworkStatusChange={setNetworkStatus}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Experimental Crypto Swap
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Swap ZTC and test tokens with AI-powered fee optimization on ZenChain Testnet
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Swap Interface */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-gradient-to-br from-card to-card/50 border border-border/50">
                <div className="flex items-center space-x-2 mb-6">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Token Swap</h3>
                </div>
                <SwapInterface 
                  onSwapComplete={handleSwapComplete}
                  isConnected={isConnected}
                />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Assistant */}
              <Card className="p-6 bg-gradient-to-br from-card to-card/50 border border-border/50">
                <div className="flex items-center space-x-2 mb-4">
                  <Bot className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold">AI Assistant</h3>
                </div>
                <AIAssistant />
              </Card>

              {/* NFT Badge */}
              <Card className="p-6 bg-gradient-to-br from-card to-card/50 border border-border/50">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-5 h-5 text-warning" />
                  <h3 className="text-lg font-semibold">NFT Badge</h3>
                </div>
                <NFTBadge 
                  swapCount={swapCount}
                  isConnected={isConnected}
                />
              </Card>
            </div>
          </div>

          {/* Network Info */}
          <Card className="mt-8 p-6 bg-gradient-to-r from-muted/50 to-accent/10 border border-border/50">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">ZenChain Testnet Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">RPC URL</p>
                  <p className="font-mono text-xs break-all">https://zenchain-testnet.api.onfinality.io/public</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Chain ID</p>
                  <p className="font-mono">8408</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Currency</p>
                  <p className="font-mono">ZTC</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;