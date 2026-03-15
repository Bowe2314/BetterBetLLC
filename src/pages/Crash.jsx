import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BetControls from "../components/BetControls";
import { useCasino } from "../components/useCasino";
import CurrencyDisplay from "../components/CurrencyDisplay";
import { useTheme } from "../components/ThemeContext";

export default function Crash() {
  const { balance, updateBalance, addHistory } = useCasino();
  const { theme } = useTheme();
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState("betting");
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(0);
  const [cashedOut, setCashedOut] = useState(false);

  useEffect(() => {
    if (gameState === "running") {
      const interval = setInterval(() => {
        setMultiplier((prev) => {
          const next = prev + 0.01;
          if (next >= crashPoint) {
            endGame(false);
            return crashPoint;
          }
          return next;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [gameState, crashPoint]);

  const startGame = () => {
    if (balance < betAmount) return;

    const crash = 1 + Math.random() * 5;
    setCrashPoint(crash);
    setMultiplier(1.0);
    setGameState("running");
    setCashedOut(false);
  };

  const cashOut = () => {
    if (gameState !== "running" || cashedOut) return;
    setCashedOut(true);
    endGame(true);
  };

  const endGame = (won) => {
    setGameState("ended");

    const payout = won ? betAmount * multiplier : 0;
    const newBalance = balance + payout - betAmount;

    updateBalance(newBalance);
    addHistory({
      game: "Crash",
      bet: betAmount,
      won,
      profit: payout - betAmount,
      result: won ? `${multiplier.toFixed(2)}x` : `Crashed at ${crashPoint.toFixed(2)}x`
    });
  };

  const resetGame = () => {
    setGameState("betting");
    setMultiplier(1.0);
    setCrashPoint(0);
    setCashedOut(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Crash</h1>
        <p className="text-gray-400">Cash out before it crashes!</p>
      </div>

      <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-8">
        <div className="mb-8 h-64 bg-[#0f1419] rounded-xl flex items-center justify-center relative overflow-hidden">
          <motion.div
            animate={{
              scale: gameState === "running" ? [1, 1.2, 1] : 1,
              opacity: gameState === "running" ? 1 : 0.5
            }}
            transition={{ duration: 1, repeat: gameState === "running" ? Infinity : 0 }}
            className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"
          />
          <div className="relative z-10 text-center">
            <motion.p
              animate={{
                scale: gameState === "running" ? [1, 1.1, 1] : 1,
                color: gameState === "ended" && !cashedOut ? "#ef4444" : "#ffffff"
              }}
              transition={{ duration: 0.3 }}
              className="text-8xl font-black"
            >
              {multiplier.toFixed(2)}x
            </motion.p>
            {gameState === "ended" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xl font-bold mt-4 ${
                  cashedOut ? "text-green-400" : "text-red-400"
                }`}
              >
                {cashedOut ? `Cashed out!` : `Crashed at ${crashPoint.toFixed(2)}x`}
              </motion.p>
            )}
          </div>
        </div>

        {gameState === "betting" ? (
          <div className="space-y-6">
            <BetControls
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              balance={balance}
              disabled={false}
            />
            <Button
              onClick={startGame}
              disabled={balance < betAmount}
              className={`w-full h-14 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-bold text-lg rounded-xl disabled:opacity-50`}
            >
              Start Game
            </Button>
          </div>
        ) : gameState === "running" ? (
          <Button
            onClick={cashOut}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-xl"
          >
            Cash Out <CurrencyDisplay coins={betAmount * multiplier} className="ml-2 font-black" />
          </Button>
        ) : (
          <div className="space-y-4">
            {cashedOut && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                <p className="text-green-400 font-semibold">You won</p>
                <CurrencyDisplay coins={betAmount * multiplier - betAmount} className="text-2xl font-bold text-green-400" />
              </div>
            )}
            <Button
              onClick={resetGame}
              className={`w-full h-12 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-semibold rounded-xl`}
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}