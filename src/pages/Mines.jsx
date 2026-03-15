import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BetControls from "../components/BetControls";
import { useCasino } from "../components/useCasino";
import { useTheme } from "../components/ThemeContext";
import { Gem, Bomb } from "lucide-react";

export default function Mines() {
  const { balance, updateBalance, addHistory } = useCasino();
  const { theme } = useTheme();
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState("betting");
  const [mineCount, setMineCount] = useState(3);
  const [revealed, setRevealed] = useState([]);
  const [mines, setMines] = useState([]);
  const [multiplier, setMultiplier] = useState(1);

  const startGame = () => {
    if (balance < betAmount) return;
    
    // Generate random mine positions
    const minePositions = [];
    while (minePositions.length < mineCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!minePositions.includes(pos)) minePositions.push(pos);
    }
    
    setMines(minePositions);
    setRevealed([]);
    setMultiplier(1);
    setGameState("playing");
  };

  const revealTile = (index) => {
    if (revealed.includes(index) || gameState !== "playing") return;

    if (mines.includes(index)) {
      // Hit a mine
      setRevealed([...revealed, index]);
      endGame(false);
    } else {
      // Safe tile
      const newRevealed = [...revealed, index];
      setRevealed(newRevealed);
      
      const safeCount = newRevealed.length;
      const totalSafe = 25 - mineCount;
      const newMultiplier = 1 + (safeCount / totalSafe) * (mineCount * 0.8);
      setMultiplier(newMultiplier);
    }
  };

  const cashOut = () => {
    endGame(true);
  };

  const endGame = (won) => {
    setGameState("ended");
    const profit = won ? Math.floor(betAmount * multiplier) : 0;
    const newBalance = won ? balance + profit - betAmount : balance - betAmount;

    updateBalance(newBalance);
    addHistory({
      game: "Mines",
      bet: betAmount,
      won,
      profit: won ? profit - betAmount : 0,
      result: won ? `${multiplier.toFixed(2)}x` : "Hit a mine"
    });

    // Reveal all tiles
    setRevealed([...Array(25).keys()]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Mines</h1>
        <p className="text-gray-400">Find gems, avoid mines!</p>
      </div>

      <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-8">
        {gameState === "betting" ? (
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Number of Mines</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 3, 5, 10, 15].map((count) => (
                  <button
                    key={count}
                    onClick={() => setMineCount(count)}
                    className={`py-2 rounded-xl font-medium transition-all ${
                      mineCount === count
                        ? `${theme.accentBg} text-white`
                        : `${theme.accentBgLight} ${theme.accentColor} border ${theme.accentBorderLight}`
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <BetControls betAmount={betAmount} setBetAmount={setBetAmount} balance={balance} disabled={false} />

            <Button
              onClick={startGame}
              disabled={balance < betAmount}
              className={`w-full h-14 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-bold text-lg rounded-xl disabled:opacity-50`}
            >
              Start Game
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-2">
              {[...Array(25)].map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => revealTile(i)}
                  disabled={revealed.includes(i) || gameState === "ended"}
                  whileHover={!revealed.includes(i) && gameState === "playing" ? { scale: 1.05 } : {}}
                  whileTap={!revealed.includes(i) && gameState === "playing" ? { scale: 0.95 } : {}}
                  className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-bold transition-all ${
                    revealed.includes(i)
                      ? mines.includes(i)
                        ? "bg-red-500/20 border-2 border-red-500"
                        : "bg-green-500/20 border-2 border-green-500"
                      : "bg-[#0f1419] border-2 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {revealed.includes(i) && (
                    mines.includes(i) ? <Bomb className="text-red-400" /> : <Gem className="text-green-400" />
                  )}
                </motion.button>
              ))}
            </div>

            {gameState === "playing" && revealed.length > 0 && (
              <div className="text-center">
                <p className={`text-3xl font-bold ${theme.accentColor} mb-3`}>
                  {multiplier.toFixed(2)}x
                </p>
                <Button
                  onClick={cashOut}
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl"
                >
                  Cash Out {Math.floor(betAmount * multiplier)} coins
                </Button>
              </div>
            )}

            {gameState === "ended" && (
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-center p-4 rounded-xl mb-4 ${
                    multiplier > 1
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-red-500/20 border border-red-500/30"
                  }`}
                >
                  <p className={`text-xl font-bold ${multiplier > 1 ? "text-green-400" : "text-red-400"}`}>
                    {multiplier > 1 ? `Won ${Math.floor(betAmount * multiplier - betAmount)} coins!` : "Hit a mine!"}
                  </p>
                </motion.div>

                <Button
                  onClick={() => setGameState("betting")}
                  className={`w-full h-12 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-semibold rounded-xl`}
                >
                  New Game
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}