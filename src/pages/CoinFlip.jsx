import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "../components/BetControls";
import { useCasino } from "../components/useCasino";

export default function CoinFlip() {
  const { balance, updateBalance, addHistory } = useCasino();
  const [betAmount, setBetAmount] = useState(10);
  const [choice, setChoice] = useState("heads");
  const [result, setResult] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const flip = () => {
    if (betAmount > balance || betAmount < 1 || isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const coinResult = Math.random() < 0.48 ? "heads" : "tails";
      const won = coinResult === choice;
      const profit = won ? betAmount : 0;
      const newBalance = won ? balance + betAmount : balance - betAmount;

      setResult({ side: coinResult, won });
      updateBalance(newBalance);
      addHistory({ game: "Coin Flip", bet: betAmount, won, profit, result: coinResult });
      setIsFlipping(false);
    }, 1500);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Coin Flip</h1>
        <p className="text-gray-400 mt-1">Pick a side. Double your bet!</p>
      </div>

      {/* Coin animation */}
      <div className="flex justify-center py-8">
        <motion.div
          animate={isFlipping ? { rotateY: [0, 1800] } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black shadow-2xl"
          style={{
            background: result
              ? result.side === "heads"
                ? "linear-gradient(135deg, #f59e0b, #d97706)"
                : "linear-gradient(135deg, #8b5cf6, #6d28d9)"
              : "linear-gradient(135deg, #374151, #4b5563)",
          }}
        >
          <span className="text-white">
            {result ? (result.side === "heads" ? "H" : "T") : "?"}
          </span>
        </motion.div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-center p-4 rounded-xl ${
              result.won
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            <p className="text-lg font-bold">
              {result.won ? `You won ${betAmount} coins!` : `You lost ${betAmount} coins!`}
            </p>
            <p className="text-sm opacity-70">Coin landed on {result.side}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-6 space-y-6">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Pick Your Side</label>
          <div className="grid grid-cols-2 gap-3">
            {["heads", "tails"].map((side) => (
              <button
                key={side}
                onClick={() => setChoice(side)}
                disabled={isFlipping}
                className={`py-3 rounded-xl font-semibold text-lg capitalize transition-all ${
                  choice === side
                    ? side === "heads"
                      ? "bg-pink-500/20 border-2 border-pink-500 text-pink-400"
                      : "bg-purple-500/20 border-2 border-purple-500 text-purple-400"
                      : "bg-[#0f1419] border-2 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        </div>

        <BetControls betAmount={betAmount} setBetAmount={setBetAmount} balance={balance} disabled={isFlipping} />

        <Button
          onClick={flip}
          disabled={isFlipping || betAmount > balance || balance === 0}
          className="w-full h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-pink-500/20 disabled:opacity-50"
        >
          {isFlipping ? "Flipping..." : balance === 0 ? "No coins left!" : "Flip Coin"}
        </Button>
      </div>
    </div>
  );
}