import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

export default function BetControls({ betAmount, setBetAmount, balance, disabled }) {
  const quickBets = [10, 50, 100, 500];

  const adjustBet = (delta) => {
    const newBet = Math.max(1, Math.min(balance, betAmount + delta));
    setBetAmount(newBet);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm text-gray-400">Bet Amount</label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => adjustBet(-10)}
          disabled={disabled || betAmount <= 1}
          className="border-gray-700 bg-[#0f1419] text-white hover:bg-gray-700 h-10 w-10 shrink-0"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Input
          type="number"
          value={betAmount}
          onChange={(e) => {
            const val = Math.max(1, Math.min(balance, parseInt(e.target.value) || 1));
            setBetAmount(val);
          }}
          disabled={disabled}
          className="bg-[#1a2028] border-gray-700 text-white text-center h-10 text-lg font-bold"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => adjustBet(10)}
          disabled={disabled || betAmount >= balance}
          className="border-gray-700 bg-[#0f1419] text-white hover:bg-gray-700 h-10 w-10 shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        {quickBets.map((amt) => (
          <button
            key={amt}
            onClick={() => setBetAmount(Math.min(amt, balance))}
            disabled={disabled}
            className="flex-1 py-1.5 rounded-lg bg-[#0f1419] border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-pink-400 transition-all disabled:opacity-50"
          >
            {amt}
          </button>
        ))}
        <button
          onClick={() => setBetAmount(balance)}
          disabled={disabled}
          className="flex-1 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-medium hover:bg-pink-500/20 transition-all disabled:opacity-50"
        >
          MAX
        </button>
      </div>
    </div>
  );
}