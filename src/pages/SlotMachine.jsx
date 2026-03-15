import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import BetControls from "../components/BetControls";
import { useCasino } from "../components/useCasino";

const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣", "⭐"];
const payouts = {
  "7️⃣": 8,
  "💎": 5,
  "⭐": 3.5,
  "🍇": 2.5,
  "🍊": 1.8,
  "🍋": 1.3,
  "🍒": 1,
};

export default function SlotMachine() {
  const { balance, updateBalance, addHistory } = useCasino();
  const [betAmount, setBetAmount] = useState(10);
  const [reels, setReels] = useState(["❓", "❓", "❓"]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [animatingReels, setAnimatingReels] = useState([[], [], []]);

  const spin = () => {
    if (betAmount > balance || betAmount < 1 || spinning) return;
    setSpinning(true);
    setResult(null);

    // Generate animation frames
    const frames = [[], [], []];
    for (let r = 0; r < 3; r++) {
      for (let i = 0; i < 10 + r * 3; i++) {
        frames[r].push(symbols[Math.floor(Math.random() * symbols.length)]);
      }
    }

    // Final results
    const finalReels = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];

    frames[0].push(finalReels[0]);
    frames[1].push(finalReels[1]);
    frames[2].push(finalReels[2]);

    setAnimatingReels(frames);

    // Animate reels
    let step = 0;
    const maxSteps = Math.max(...frames.map(f => f.length));
    const interval = setInterval(() => {
      step++;
      setReels([
        frames[0][Math.min(step, frames[0].length - 1)],
        frames[1][Math.min(step, frames[1].length - 1)],
        frames[2][Math.min(step, frames[2].length - 1)],
      ]);
      if (step >= maxSteps) {
        clearInterval(interval);

        // Calculate result
        const allSame = finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2];
        const twoSame = finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2];

        let won = false;
        let profit = 0;

        if (allSame) {
          won = true;
          profit = Math.floor(betAmount * (payouts[finalReels[0]] || 1));
        } else if (twoSame) {
          won = true;
          const matchSymbol = finalReels[0] === finalReels[1] ? finalReels[0] : finalReels[0] === finalReels[2] ? finalReels[0] : finalReels[1];
          profit = Math.floor(betAmount * ((payouts[matchSymbol] || 1) * 0.3));
        }

        const newBalance = won ? balance + profit : balance - betAmount;
        setResult({ won, profit, allSame, twoSame });
        updateBalance(newBalance);
        addHistory({
          game: "Slot Machine",
          bet: betAmount,
          won,
          profit,
          result: finalReels.join(" "),
        });
        setSpinning(false);
      }
    }, 80);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Slot Machine</h1>
        <p className="text-gray-400 mt-1">Match symbols to win big!</p>
      </div>

      {/* Slot machine display */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
        <div className="bg-gray-950 rounded-xl p-4 border-2 border-amber-500/30">
          <div className="grid grid-cols-3 gap-3">
            {reels.map((symbol, i) => (
              <motion.div
                key={i}
                animate={spinning ? { y: [0, -10, 5, 0] } : {}}
                transition={{ duration: 0.15, repeat: spinning ? Infinity : 0 }}
                className="h-24 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center"
              >
                <span className="text-5xl">{symbol}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payline indicator */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent my-3" />

        {/* Mini payout table */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {Object.entries(payouts).slice(0, 4).map(([sym, mult]) => (
            <div key={sym} className="text-xs text-gray-500">
              <span className="text-lg">{sym}</span>
              <br />{mult}x
            </div>
          ))}
        </div>
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
                ? result.allSame
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                  : "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            <p className="text-lg font-bold">
              {result.allSame
                ? `JACKPOT! +${result.profit} coins!`
                : result.won
                ? `Nice! +${result.profit} coins!`
                : `No match. -${betAmount} coins`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-6 space-y-6">
        <BetControls betAmount={betAmount} setBetAmount={setBetAmount} balance={balance} disabled={spinning} />

        <Button
          onClick={spin}
          disabled={spinning || betAmount > balance || balance === 0}
          className="w-full h-14 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/20 disabled:opacity-50"
        >
          {spinning ? "Spinning..." : balance === 0 ? "No coins left!" : "🎰 SPIN"}
        </Button>
      </div>
    </div>
  );
}