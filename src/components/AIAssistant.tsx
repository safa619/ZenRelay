import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

interface Suggestion {
  type: 'optimization' | 'warning' | 'insight';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

const suggestions: Suggestion[] = [
  {
    type: 'optimization',
    title: 'Optimal Fee: 0.25%',
    description: 'Current network congestion is low. Reduce slippage tolerance to 0.25% for better rates.',
    impact: 'medium'
  },
  {
    type: 'insight',
    title: 'Price Trend Alert',
    description: 'ZTC has increased 3.2% in the last hour. Consider timing your swap carefully.',
    impact: 'high'
  },
  {
    type: 'warning',
    title: 'Low Liquidity Pool',
    description: 'This trading pair has limited liquidity. Large swaps may experience higher slippage.',
    impact: 'medium'
  }
];

export const AIAssistant = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState(suggestions.slice(0, 2));

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentSuggestions(suggestions);
    }, 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'insight':
        return <Lightbulb className="w-4 h-4 text-accent" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-warning/20 text-warning';
      case 'medium':
        return 'bg-accent/20 text-accent';
      case 'low':
        return 'bg-muted/50 text-muted-foreground';
      default:
        return 'bg-muted/50 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {/* Analysis Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">AI Analysis Active</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="text-xs"
        >
          {isAnalyzing ? "Analyzing..." : "Refresh"}
        </Button>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {currentSuggestions.map((suggestion, index) => (
          <Card key={index} className="p-3 bg-muted/20 border-border/30 hover:bg-muted/30 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {getIcon(suggestion.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium truncate">{suggestion.title}</h4>
                  <Badge className={`text-xs px-2 py-0.5 ${getImpactColor(suggestion.impact)}`}>
                    {suggestion.impact}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="p-3 bg-gradient-to-r from-primary/5 to-accent/5 border-border/30">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI Confidence</span>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            94%
          </div>
          <p className="text-xs text-muted-foreground">
            Based on current market conditions
          </p>
        </div>
      </Card>
    </div>
  );
};