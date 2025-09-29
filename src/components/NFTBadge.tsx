import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Star, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NFTBadgeProps {
  swapCount: number;
  isConnected: boolean;
}

const NFT_CONTRACT = "0x4d22778d0EBfc692fbE6D08a3268421c9DfBAd09";

export const NFTBadge = ({ swapCount, isConnected }: NFTBadgeProps) => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintedBadges, setMintedBadges] = useState(0);
  const { toast } = useToast();

  const canMint = swapCount >= 3 && isConnected;
  const progress = Math.min((swapCount / 3) * 100, 100);
  const swapsNeeded = Math.max(3 - swapCount, 0);

  const handleMintNFT = async () => {
    if (!canMint) return;

    setIsMinting(true);
    
    // Simulate NFT minting transaction
    setTimeout(() => {
      setIsMinting(false);
      setMintedBadges(prev => prev + 1);
      toast({
        title: "NFT Badge Minted! 🎉",
        description: "Your OmniHub NFT badge has been successfully minted to your wallet.",
      });
    }, 3000);
  };

  const openEtherscan = () => {
    window.open(`https://zenchain-testnet.blockscout.com/address/${NFT_CONTRACT}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Progress Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Swap Progress</span>
          <Badge variant={canMint ? "default" : "secondary"} className="text-xs">
            {swapCount}/3 Swaps
          </Badge>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <p className="text-xs text-muted-foreground text-center">
          {canMint 
            ? "🎉 Ready to mint your NFT badge!" 
            : `${swapsNeeded} more swap${swapsNeeded !== 1 ? 's' : ''} needed`
          }
        </p>
      </div>

      {/* NFT Preview */}
      <Card className="p-4 bg-gradient-to-br from-warning/10 to-primary/10 border-border/50">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-warning via-primary to-accent rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-background" />
          </div>
          
          <div>
            <h4 className="font-semibold mb-1">OmniHub NFT Badge</h4>
            <p className="text-xs text-muted-foreground">
              Commemorative badge for early ZenRelay users
            </p>
          </div>

          {/* Badge Stats */}
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-warning" />
              <span>Rare</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-3 h-3 text-accent" />
              <span>Achievement</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Mint Button */}
      <Button
        onClick={handleMintNFT}
        disabled={!canMint || isMinting}
        className="w-full bg-gradient-to-r from-warning to-primary hover:from-warning/90 hover:to-primary/90 text-primary-foreground font-medium"
      >
        {isMinting 
          ? "Minting NFT..." 
          : !isConnected 
            ? "Connect Wallet to Mint"
            : !canMint 
              ? `Complete ${swapsNeeded} More Swap${swapsNeeded !== 1 ? 's' : ''}`
              : "Mint NFT Badge"
        }
      </Button>

      {/* Minted Badges */}
      {mintedBadges > 0 && (
        <Card className="p-3 bg-success/10 border-success/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className="bg-success/20 text-success text-xs">
                Owned: {mintedBadges}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openEtherscan}
              className="text-xs p-1 h-auto"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      )}

      {/* Contract Info */}
      <Card className="p-3 bg-muted/20 border-border/30">
        <div className="text-center space-y-2">
          <p className="text-xs font-medium">NFT Contract</p>
          <div className="flex items-center justify-center space-x-2">
            <code className="text-xs bg-background/50 px-2 py-1 rounded font-mono">
              {NFT_CONTRACT.slice(0, 6)}...{NFT_CONTRACT.slice(-4)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={openEtherscan}
              className="p-1 h-auto"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};