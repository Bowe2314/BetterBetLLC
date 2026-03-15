import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BetControls from "../components/BetControls";
import { useCasino } from "../components/useCasino";
import { useTheme } from "../components/ThemeContext";

const PAYOUTS = {
  1: [0, 2.5],
  2: [0, 0, 4],
  3: [0, 0, 1.5, 8],
  4: [0, 0, 1, 3, 15],
  5: [0, 0, 0.5, 2, 5, 25],
  6: [0, 0, 0, 1, 3, 8, 40],
  7: [0, 0, 0, 0.5, 2, 4, 12, 60],
  8: [0, 0, 0, 0, 1, 2.5, 6, 20, 100],
};

export default function Keno() {
  const { balance, updateBalance, addHistory } = useCasino();
  const { theme } = useTheme();
  const [betAmount, setBetAmount] = useState(10);
  const [selected, setSelected] = useState([]);
  const [drawn, setDrawn] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState(null);

  const toggleNumber = (num) => {
    if (drawing) return;
    if (selected.includes(num)) {
      setSelected(selected.filter(n => n !== num));
    } else if (selected.length < 8) {
      setSelected([...selected, num]);
    }
  };

  const play = () => {
    if (betAmount > balance || selected.length === 0 || drawing) return;
    setDrawing(true);
    setResult(null);

    // Draw 20 random numbers
    const drawnNumbers = [];
    while (drawnNumbers.length < 20) {
      const num = Math.floor(Math.random() * 40) + 1;
      if (!drawnNumbers.includes(num)) drawnNumbers.push(num);
    }

    setDrawn(drawnNumbers);

    setTimeout(() => {
      const matches = selected.filter(n => drawnNumbers.includes(n)).length;
      const payoutTable = PAYOUTS[selected.length] || [];
      const multiplier = payoutTable[matches] || 0;
      const profit = Math.floor(betAmount * multiplier);
      const won = multiplier > 0;
      const newBalance = won ? balance + profit - betAmount : balance - betAmount;

      setResult({ matches, multiplier, profit, won });
      updateBalance(newBalance);
      addHistory({
        game: "Keno",
        bet: betAmount,
        won,
        profit: won ? profit - betAmount : -betAmount,
        result: `${matches}/${selected.length} matches`
      });
      setDrawing(false);
    }, 2000);
  };

  const reset = () => {
    setSelected([]);
    setDrawn([]);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Keno</h1>
        <p className="text-gray-400">Pick your numbers and hope they match!</p>
      </div>

      <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-8">
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-3">Select 1-8 numbers ({selected.length}/8)</p>
          <div className="grid grid-cols-8 gap-2">
            {[...Array(40)].map((_, i) => {
              const num = i + 1;
              const isSelected = selected.includes(num);
              const isDrawn = drawn.includes(num);
              const isMatch = isSelected && isDrawn;

              return (
                <motion.button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  disabled={drawing}
                  whileHover={!drawing ? { scale: 1.1 } : {}}
                  whileTap={!drawing ? { scale: 0.95 } : {}}
                  className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                    isMatch
                      ? "bg-green-500 text-white border-2 border-green-300"
                      : isDrawn
                      ? "bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500"
                      : isSelected
                      ? `${theme.accentBg} text-white border-2 ${theme.accentBorder}`
                      : "bg-[#0f1419] text-gray-400 border-2 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {num}
                </motion.button>
              );
            })}
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center p-4 rounded-xl mb-6 ${
              result.won
                ? "bg-green-500/20 border border-green-500/30"
                : "bg-red-500/20 border border-red-500/30"
            }`}
          >
            <p className={`text-xl font-bold ${result.won ? "text-green-400" : "text-red-400"}`}>
              {result.matches}/{selected.length} matches - {result.multiplier}x
            </p>
            <p className="text-sm mt-1 text-gray-400">
              {result.won ? `Won ${result.profit - betAmount} coins!` : `Lost ${betAmount} coins`}
            </p>
          </motion.div>
        )}

        <BetControls betAmount={betAmount} setBetAmount={setBetAmount} balance={balance} disabled={drawing} />

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            onClick={reset}
            disabled={drawing}
            variant="outline"
            className="h-12 border-gray-700 text-white hover:bg-gray-700"
          >
            Clear
          </Button>
          <Button
            onClick={play}
            disabled={drawing || selected.length === 0 || betAmount > balance}
            className={`h-12 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-bold rounded-xl disabled:opacity-50`}
          >
            {drawing ? "Drawing..." : "Play"}
          </Button>
        </div>
      </div>
    </div>
  );
}