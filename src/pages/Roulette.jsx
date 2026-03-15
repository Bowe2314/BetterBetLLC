import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BetControls from "../components/BetControls";
import { useCasino } from "../components/useCasino";
import CurrencyDisplay from "../components/CurrencyDisplay";
import { useTheme } from "../components/ThemeContext";

const NUMBERS = [
  { num: 0, color: "green" },
  { num: 1, color: "red" }, { num: 2, color: "black" }, { num: 3, color: "red" },
  { num: 4, color: "black" }, { num: 5, color: "red" }, { num: 6, color: "black" },
  { num: 7, color: "red" }, { num: 8, color: "black" }, { num: 9, color: "red" },
  { num: 10, color: "black" }, { num: 11, color: "black" }, { num: 12, color: "red" },
  { num: 13, color: "black" }, { num: 14, color: "red" }, { num: 15, color: "black" },
  { num: 16, color: "red" }, { num: 17, color: "black" }, { num: 18, color: "red" },
  { num: 19, color: "red" }, { num: 20, color: "black" }, { num: 21, color: "red" },
  { num: 22, color: "black" }, { num: 23, color: "red" }, { num: 24, color: "black" },
  { num: 25, color: "red" }, { num: 26, color: "black" }, { num: 27, color: "red" },
  { num: 28, color: "black" }, { num: 29, color: "black" }, { num: 30, color: "red" },
  { num: 31, color: "black" }, { num: 32, color: "red" }, { num: 33, color: "black" },
  { num: 34, color: "red" }, { num: 35, color: "black" }, { num: 36, color: "red" }
];

export default function Roulette() {
  const { balance, updateBalance, addHistory } = useCasino();
  const { theme } = useTheme();
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (balance < betAmount || !betType) return;

    setSpinning(true);
    setResult(null);

    const winningNumber = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    const spins = 5 + Math.random() * 3;
    const newRotation = rotation + spins * 360 + (winningNumber.num / 37) * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setResult(winningNumber);
      
      let won = false;
      let payout = 0;

      if (betType === winningNumber.color) {
        won = true;
        payout = betAmount * 1.9;
      } else if (betType === "even" && winningNumber.num > 0 && winningNumber.num % 2 === 0) {
        won = true;
        payout = betAmount * 1.9;
      } else if (betType === "odd" && winningNumber.num % 2 === 1) {
        won = true;
        payout = betAmount * 1.9;
      } else if (betType === "low" && winningNumber.num >= 1 && winningNumber.num <= 18) {
        won = true;
        payout = betAmount * 1.9;
      } else if (betType === "high" && winningNumber.num >= 19 && winningNumber.num <= 36) {
        won = true;
        payout = betAmount * 1.9;
      } else if (betType === "green" && winningNumber.num === 0) {
        won = true;
        payout = betAmount * 30;
      }

      const newBalance = won ? balance + payout - betAmount : balance - betAmount;
      updateBalance(newBalance);
      addHistory({
        game: "Roulette",
        bet: betAmount,
        won,
        profit: won ? payout - betAmount : 0,
        result: `${winningNumber.num} ${winningNumber.color}`
      });

      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Roulette</h1>
        <p className="text-gray-400">Place your bets and spin the wheel!</p>
      </div>

      <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-8">
        <div className="flex items-center justify-center mb-8">
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="w-64 h-64 rounded-full border-8 border-amber-500 relative"
            style={{
              background: `conic-gradient(${NUMBERS.map((n, i) => 
                `${n.color === "green" ? "#10b981" : n.color === "red" ? "#ef4444" : "#1f2937"} ${(i/37)*100}%, ${n.color === "green" ? "#10b981" : n.color === "red" ? "#ef4444" : "#1f2937"} ${((i+1)/37)*100}%`
              ).join(", ")})`
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </motion.div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center mb-6 p-4 rounded-xl ${
              result.color === "green" ? "bg-green-500/20 border border-green-500/30" :
              result.color === "red" ? "bg-red-500/20 border border-red-500/30" :
              "bg-gray-500/20 border border-gray-500/30"
            }`}
          >
            <p className="text-2xl font-bold text-white">
              {result.num} <span className="uppercase text-sm">({result.color})</span>
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => setBetType("red")}
            disabled={spinning}
            className={`p-4 rounded-xl font-semibold transition-all ${
              betType === "red" 
                ? "bg-red-500 text-white" 
                : "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
            }`}
          >
            Red (2x)
          </button>
          <button
            onClick={() => setBetType("black")}
            disabled={spinning}
            className={`p-4 rounded-xl font-semibold transition-all ${
              betType === "black" 
                ? "bg-gray-700 text-white" 
                : "bg-gray-700/20 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30"
            }`}
          >
            Black (2x)
          </button>
          <button
            onClick={() => setBetType("green")}
            disabled={spinning}
            className={`p-4 rounded-xl font-semibold transition-all ${
              betType === "green" 
                ? "bg-green-500 text-white" 
                : "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
            }`}
          >
            Green (35x)
          </button>
          <button
            onClick={() => setBetType("odd")}
            disabled={spinning}
            className={`p-4 rounded-xl font-semibold transition-all ${
              betType === "odd" 
                ? `${theme.accentBg} text-white` 
                : `${theme.accentBgLight} ${theme.accentBorderLight} border ${theme.accentColor} hover:bg-opacity-30`
            }`}
          >
            Odd (2x)
          </button>
          <button
            onClick={() => setBetType("even")}
            disabled={spinning}
            className={`p-4 rounded-xl font-semibold transition-all ${
              betType === "even" 
                ? `${theme.accentBg} text-white` 
                : `${theme.accentBgLight} ${theme.accentBorderLight} border ${theme.accentColor} hover:bg-opacity-30`
            }`}
          >
            Even (2x)
          </button>
          <button
            onClick={() => setBetType("low")}
            disabled={spinning}
            className={`p-4 rounded-xl font-semibold transition-all ${
              betType === "low" 
                ? `${theme.accentBg} text-white` 
                : `${theme.accentBgLight} ${theme.accentBorderLight} border ${theme.accentColor} hover:bg-opacity-30`
            }`}
          >
            1-18 (2x)
          </button>
          <button
            onClick={() => setBetType("high")}
            disabled={spinning}
            className={`p-4 rounded-xl font-semibold transition-all ${
              betType === "high" 
                ? `${theme.accentBg} text-white` 
                : `${theme.accentBgLight} ${theme.accentBorderLight} border ${theme.accentColor} hover:bg-opacity-30`
            }`}
          >
            19-36 (2x)
          </button>
        </div>

        <BetControls
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          balance={balance}
          disabled={spinning}
        />

        <Button
          onClick={spin}
          disabled={spinning || balance < betAmount || !betType}
          className={`w-full h-14 mt-4 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-bold text-lg rounded-xl disabled:opacity-50`}
        >
          {spinning ? "Spinning..." : "Spin Wheel"}
        </Button>
      </div>
    </div>
  );
}