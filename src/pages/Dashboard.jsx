import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CircleDot, Dices, Cherry, CircleDollarSign, Spade, TrendingUp, TrendingDown, History } from "lucide-react";
import GameCard from "../components/GameCard";
import WelcomeModal from "../components/WelcomeModal";
import CurrencyDisplay, { useCurrency } from "../components/CurrencyDisplay";
import { useTheme } from "../components/ThemeContext";

export default function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [user, setUser] = useState(null);
  const { symbol } = useCurrency();
  const { theme } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem("casino_user");
    if (stored) setUser(JSON.parse(stored));
    
    if (localStorage.getItem("show_welcome") === "true") {
      setShowWelcome(true);
      localStorage.removeItem("show_welcome");
    }

    // Listen for balance updates
    const handleUpdate = () => {
      const stored = localStorage.getItem("casino_user");
      if (stored) setUser(JSON.parse(stored));
    };
    window.addEventListener("balanceUpdate", handleUpdate);
    return () => window.removeEventListener("balanceUpdate", handleUpdate);
  }, []);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      const allHistory = JSON.parse(localStorage.getItem("casino_history") || "[]");
      const userHistory = allHistory.filter(h => h.userId === user.id);
      setHistory(userHistory);
    }
  }, [user]);

  if (!user) return null;

  const totalWon = history.filter(h => h.won).reduce((s, h) => s + (h.profit || 0), 0);
  const totalLost = history.filter(h => !h.won).reduce((s, h) => s + (h.bet || 0), 0);
  const winRate = history.length > 0 ? Math.round((history.filter(h => h.won).length / history.length) * 100) : 0;

  const games = [
    { title: "Coin Flip", description: "48% chance. Double your bet!", icon: CircleDot, path: "/CoinFlip", gradient: "bg-gradient-to-br from-blue-600 to-blue-900" },
    { title: "Dice Roll", description: "Roll the dice. Beat the house!", icon: Dices, path: "/DiceRoll", gradient: "bg-gradient-to-br from-green-600 to-emerald-900" },
    { title: "Slot Machine", description: "Spin to win jackpots!", icon: Cherry, path: "/SlotMachine", gradient: "bg-gradient-to-br from-purple-600 to-purple-900" },
    { title: "Roulette", description: "Spin the wheel and place bets!", icon: CircleDollarSign, path: "/Roulette", gradient: "bg-gradient-to-br from-red-600 to-red-900" },
    { title: "Blackjack", description: "Beat the dealer to 21!", icon: Spade, path: "/Blackjack", gradient: "bg-gradient-to-br from-gray-600 to-gray-900" },
    { title: "Crash", description: "Cash out before it crashes!", icon: TrendingUp, path: "/Crash", gradient: "bg-gradient-to-br from-orange-600 to-orange-900" },

    { title: "Mines", description: "Find gems, avoid bombs!", icon: CircleDollarSign, path: "/Mines", gradient: "bg-gradient-to-br from-yellow-600 to-yellow-900" },
    { title: "Keno", description: "Pick numbers and match them!", icon: History, path: "/Keno", gradient: "bg-gradient-to-br from-indigo-600 to-indigo-900" },
  ];

  return (
    <div className="space-y-8">
      <WelcomeModal show={showWelcome} onClose={() => setShowWelcome(false)} />

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl h-48 md:h-56 bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-blue-600/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1419]/90 via-[#0f1419]/60 to-transparent flex items-center p-8">
          <div>
            <p className="text-gray-400 text-sm">Welcome back,</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{user.username}</h1>
            <div className="flex items-center gap-2 mt-2">
              <CurrencyDisplay coins={user.balance || 0} className={`${theme.accentColor} font-bold text-2xl`} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-[#1a2028] border border-gray-800/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-500 text-xs">Balance</span>
          </div>
          <CurrencyDisplay coins={user.balance || 0} className={`text-xl font-bold ${theme.accentColor}`} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a2028] border border-gray-800/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-gray-500 text-xs">Total Won</span>
          </div>
          <CurrencyDisplay coins={totalWon} className="text-xl font-bold text-green-400" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a2028] border border-gray-800/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-gray-500 text-xs">Total Lost</span>
          </div>
          <CurrencyDisplay coins={totalLost} className="text-xl font-bold text-red-400" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a2028] border border-gray-800/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <History className="w-4 h-4 text-blue-400" />
            <span className="text-gray-500 text-xs">Win Rate</span>
          </div>
          <p className="text-xl font-bold text-blue-400">{winRate}%</p>
        </motion.div>
      </div>

      {/* Games */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Games</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {games.map((game, i) => (
            <GameCard key={game.title} {...game} delay={i * 0.1} />
          ))}
        </div>
      </div>

      {/* Recent History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recent Bets</h2>
          <div className="bg-[#1a2028] border border-gray-800/50 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-800/50">
              {history.slice(0, 10).map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${h.won ? "bg-green-400" : "bg-red-400"}`} />
                    <div>
                      <p className="text-white text-sm font-medium">{h.game}</p>
                      <p className="text-gray-500 text-xs">{new Date(h.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Bet: <CurrencyDisplay coins={h.bet} className="text-gray-400" /></p>
                    <p className={`text-sm font-bold ${h.won ? "text-green-400" : "text-red-400"}`}>
                      {h.won ? "+" : "-"}<CurrencyDisplay coins={h.won ? h.profit : h.bet} className={h.won ? "text-green-400" : "text-red-400"} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}