import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Wallet, AlertCircle, CheckCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectionProps {
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
  onNetworkStatusChange: (status: 'connected' | 'disconnected' | 'wrong-network') => void;
}

const ZENCHAIN_CONFIG = {
  chainId: 8408,
  chainName: "ZenChain Testnet",
  nativeCurrency: {
    name: "ZTC",
    symbol: "ZTC",
    decimals: 18
  },
  rpcUrls: ["https://zenchain-testnet.api.onfinality.io/public"],
  blockExplorerUrls: ["https://zenchain-testnet.blockscout.com/"]
};

export const WalletConnection = ({ 
  isConnected, 
  onConnectionChange, 
  onNetworkStatusChange 
}: WalletConnectionProps) => {
  const [address, setAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && (window as any).ethereum;

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (!isMetaMaskInstalled) return;

    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        onConnectionChange(true);
        await checkNetwork();
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const checkNetwork = async () => {
    if (!isMetaMaskInstalled) return;

    try {
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainId, 16);
      
      if (currentChainId === ZENCHAIN_CONFIG.chainId) {
        onNetworkStatusChange('connected');
      } else {
        onNetworkStatusChange('wrong-network');
      }
    } catch (error) {
      console.error('Error checking network:', error);
      onNetworkStatusChange('disconnected');
    }
  };

  const addZenChainNetwork = async () => {
    if (!isMetaMaskInstalled) return;

    try {
      await (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [ZENCHAIN_CONFIG],
      });
      toast({
        title: "Network added successfully",
        description: "ZenChain Testnet has been added to MetaMask",
      });
      await checkNetwork();
    } catch (error) {
      console.error('Error adding network:', error);
      toast({
        title: "Failed to add network",
        description: "Please add ZenChain Testnet manually in MetaMask",
        variant: "destructive",
      });
    }
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask extension to continue",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        onConnectionChange(true);
        await checkNetwork();
        
        toast({
          title: "Wallet connected",
          description: "Successfully connected to MetaMask",
        });
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress("");
    onConnectionChange(false);
    onNetworkStatusChange('disconnected');
    toast({
      title: "Wallet disconnected",
      description: "Successfully disconnected from MetaMask",
    });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowDetails(!showDetails)}
        className="bg-card/50"
      >
        <CheckCircle className="w-4 h-4 mr-2 text-success" />
        {formatAddress(address)}
      </Button>

      {showDetails && (
        <Card className="absolute right-0 top-12 w-80 p-4 bg-card border-border/50 shadow-lg z-50">
          <div className="space-y-4">
            {/* Address */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Wallet Address</p>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-muted/50 px-2 py-1 rounded flex-1 font-mono">
                  {address}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="p-1 h-auto"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Network Status */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Network Status</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  ZenChain Testnet
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addZenChainNetwork}
                  className="text-xs h-auto p-1"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Add Network
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={disconnectWallet}
                className="flex-1"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};