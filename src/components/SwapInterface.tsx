import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SwapInterfaceProps {
  onSwapComplete: () => void;
  isConnected: boolean;
}

const tokens = [
  { symbol: "ZTC", name: "ZenChain Token", balance: "1,250.00" },
  { symbol: "USDT", name: "Tether USD", balance: "500.00" },
  { symbol: "WETH", name: "Wrapped Ethereum", balance: "0.75" },
  { symbol: "DAI", name: "Dai Stablecoin", balance: "750.00" },
];

export const SwapInterface = ({ onSwapComplete, isConnected }: SwapInterfaceProps) => {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const { toast } = useToast();

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const calculateToAmount = (amount: string) => {
    if (!amount) return "";
    // Mock exchange rate calculation
    const rate = 0.98; // 2% slippage
    return (parseFloat(amount) * rate).toFixed(4);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(calculateToAmount(value));
  };

  const handleSwap = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your MetaMask wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }

    setIsSwapping(true);
    
    // Simulate swap transaction
    setTimeout(() => {
      setIsSwapping(false);
      onSwapComplete();
      toast({
        title: "Swap successful!",
        description: `Swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
      });
      setFromAmount("");
      setToAmount("");
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* From Token */}
      <Card className="p-4 bg-muted/30 border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">From</span>
          <span className="text-sm text-muted-foreground">
            Balance: {fromToken.balance}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-background/50 px-3 py-2 rounded-lg cursor-pointer hover:bg-background/70 transition-colors">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full"></div>
            <span className="font-medium">{fromToken.symbol}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input
            type="number"
            placeholder="0.0"
            value={fromAmount}
            onChange={(e) => handleFromAmountChange(e.target.value)}
            className="flex-1 text-right text-lg font-medium bg-transparent border-none shadow-none focus-visible:ring-0"
          />
        </div>
      </Card>

      {/* Swap Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSwapTokens}
          className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      </div>

      {/* To Token */}
      <Card className="p-4 bg-muted/30 border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">To</span>
          <span className="text-sm text-muted-foreground">
            Balance: {toToken.balance}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-background/50 px-3 py-2 rounded-lg cursor-pointer hover:bg-background/70 transition-colors">
            <div className="w-6 h-6 bg-gradient-to-br from-accent to-primary rounded-full"></div>
            <span className="font-medium">{toToken.symbol}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input
            type="number"
            placeholder="0.0"
            value={toAmount}
            readOnly
            className="flex-1 text-right text-lg font-medium bg-transparent border-none shadow-none focus-visible:ring-0"
          />
        </div>
      </Card>

      {/* Swap Details */}
      {fromAmount && (
        <Card className="p-3 bg-muted/20 border-border/30">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span>1 {fromToken.symbol} = 0.98 {toToken.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage</span>
              <Badge variant="secondary" className="text-xs">2.0%</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="text-warning">~0.001 ZTC</span>
            </div>
          </div>
        </Card>
      )}

      {/* Swap Button */}
      <Button 
        onClick={handleSwap}
        disabled={!isConnected || !fromAmount || isSwapping}
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium py-6"
      >
        {isSwapping ? "Swapping..." : !isConnected ? "Connect Wallet" : "Swap Tokens"}
      </Button>
    </div>
  );
};