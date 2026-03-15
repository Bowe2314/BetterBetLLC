import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "../components/BetControls";
import { useCasino } from "../components/useCasino";

const diceFaces = {
  1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅"
};

export default function DiceRoll() {
  const { balance, updateBalance, addHistory } = useCasino();
  const [betAmount, setBetAmount] = useState(10);
  const [prediction, setPrediction] = useState("over");
  const [target, setTarget] = useState(4);
  const [result, setResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  const multipliers = { 3: 1.3, 4: 1.8, 5: 2.5, 6: 5 };

  const getMultiplier = () => {
    if (prediction === "over") return multipliers[target] || 2;
    if (prediction === "under") return multipliers[7 - target] || 2;
    return 6; // exact
  };

  const roll = () => {
    if (betAmount > balance || betAmount < 1 || isRolling) return;
    setIsRolling(true);
    setResult(null);

    setTimeout(() => {
      const diceResult = Math.floor(Math.random() * 6) + 1;
      let won = false;
      if (prediction === "over") won = diceResult > target;
      else if (prediction === "under") won = diceResult < target;
      else won = diceResult === target;

      const multiplier = getMultiplier();
      const profit = won ? Math.floor(betAmount * (multiplier - 1)) : 0;
      const newBalance = won ? balance + profit : balance - betAmount;

      setResult({ dice: diceResult, won, profit });
      updateBalance(newBalance);
      addHistory({ game: "Dice Roll", bet: betAmount, won, profit, result: `Rolled ${diceResult}` });
      setIsRolling(false);
    }, 1200);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Dice Roll</h1>
        <p className="text-gray-400 mt-1">Predict the outcome. Higher risk, higher reward!</p>
      </div>

      {/* Dice display */}
      <div className="flex justify-center py-6">
        <motion.div
          animate={isRolling ? { rotate: [0, 360, 720], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1.2 }}
          className="w-28 h-28 rounded-2xl bg-gray-800 border-2 border-gray-700 flex items-center justify-center shadow-2xl"
        >
          <span className="text-6xl">
            {result ? diceFaces[result.dice] : "🎲"}
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
              {result.won ? `You won ${result.profit} coins!` : `You lost ${betAmount} coins!`}
            </p>
            <p className="text-sm opacity-70">Rolled a {result.dice}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-6 space-y-6">
        {/* Prediction type */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Prediction</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "over", label: "Over" },
              { value: "under", label: "Under" },
              { value: "exact", label: "Exact" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPrediction(p.value)}
                disabled={isRolling}
                className={`py-2.5 rounded-xl font-medium text-sm transition-all ${
                  prediction === p.value
                    ? "bg-pink-500/20 border-2 border-pink-500 text-pink-400"
                    : "bg-[#0f1419] border-2 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target number */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            {prediction === "over" ? "Roll over" : prediction === "under" ? "Roll under" : "Roll exactly"}
          </label>
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setTarget(n)}
                disabled={isRolling}
                className={`py-3 rounded-xl text-2xl transition-all ${
                  target === n
                    ? "bg-pink-500/20 border-2 border-pink-500"
                    : "bg-[#0f1419] border-2 border-gray-700 hover:border-gray-600"
                }`}
              >
                {diceFaces[n]}
              </button>
            ))}
          </div>
          <p className="text-center text-pink-400 text-sm mt-2">Multiplier: {getMultiplier()}x</p>
        </div>

        <BetControls betAmount={betAmount} setBetAmount={setBetAmount} balance={balance} disabled={isRolling} />

        <Button
          onClick={roll}
          disabled={isRolling || betAmount > balance || balance === 0}
          className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-500/20 disabled:opacity-50"
        >
          {isRolling ? "Rolling..." : balance === 0 ? "No coins left!" : "Roll Dice"}
        </Button>
      </div>
    </div>
  );
}