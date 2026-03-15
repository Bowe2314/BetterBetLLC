import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BetControls from "../components/BetControls";
import { useCasino } from "../components/useCasino";
import { useTheme } from "../components/ThemeContext";

const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const createDeck = () => {
  const deck = [];
  for (let suit of SUITS) {
    for (let value of VALUES) {
      deck.push({ suit, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const getCardValue = (card) => {
  if (card.value === "A") return 11;
  if (["J", "Q", "K"].includes(card.value)) return 10;
  return parseInt(card.value);
};

const calculateTotal = (hand) => {
  let total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
  let aces = hand.filter(card => card.value === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
};

export default function Blackjack() {
  const { balance, updateBalance, addHistory } = useCasino();
  const { theme } = useTheme();
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState("betting");
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [result, setResult] = useState(null);

  const startGame = () => {
    if (balance < betAmount) return;

    const newDeck = createDeck();
    const player = [newDeck.pop(), newDeck.pop()];
    const dealer = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setGameState("playing");
    setResult(null);
  };

  const hit = () => {
    const newDeck = [...deck];
    const newHand = [...playerHand, newDeck.pop()];
    setDeck(newDeck);
    setPlayerHand(newHand);

    if (calculateTotal(newHand) > 21) {
      endGame(newHand, dealerHand);
    }
  };

  const stand = () => {
    let newDeck = [...deck];
    let dealer = [...dealerHand];

    while (calculateTotal(dealer) < 17) {
      dealer.push(newDeck.pop());
    }

    setDealerHand(dealer);
    setDeck(newDeck);
    endGame(playerHand, dealer);
  };

  const endGame = (player, dealer) => {
    const playerTotal = calculateTotal(player);
    const dealerTotal = calculateTotal(dealer);

    let won = false;
    let payout = 0;
    let resultText = "";

    if (playerTotal > 21) {
      resultText = "Bust! You lose.";
    } else if (dealerTotal > 21) {
      won = true;
      payout = betAmount * 1.8;
      resultText = "Dealer busts! You win!";
    } else if (playerTotal > dealerTotal) {
      won = true;
      payout = betAmount * 1.8;
      resultText = "You win!";
    } else if (playerTotal < dealerTotal) {
      resultText = "Dealer wins.";
    } else {
      payout = betAmount;
      resultText = "Push! Bet returned.";
    }

    const newBalance = balance + payout - betAmount;
    updateBalance(newBalance);
    addHistory({
      game: "Blackjack",
      bet: betAmount,
      won,
      profit: payout - betAmount,
      result: resultText
    });

    setResult(resultText);
    setGameState("ended");
  };

  const playerTotal = calculateTotal(playerHand);
  const dealerTotal = calculateTotal(dealerHand);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Blackjack</h1>
        <p className="text-gray-400">Beat the dealer without going over 21!</p>
      </div>

      <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-8">
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
              Deal Cards
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-semibold mb-3">
                Dealer {gameState === "ended" && `(${dealerTotal})`}
              </h3>
              <div className="flex gap-2 flex-wrap">
                {dealerHand.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-20 h-28 rounded-lg flex items-center justify-center text-2xl font-bold ${
                      gameState === "playing" && i === 1
                        ? "bg-gradient-to-br from-purple-600 to-purple-900"
                        : card.suit === "♥" || card.suit === "♦"
                        ? "bg-white text-red-600"
                        : "bg-white text-black"
                    }`}
                  >
                    {gameState === "playing" && i === 1 ? "?" : (
                      <div className="text-center">
                        <div>{card.value}</div>
                        <div className="text-3xl">{card.suit}</div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">You ({playerTotal})</h3>
              <div className="flex gap-2 flex-wrap">
                {playerHand.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-20 h-28 rounded-lg flex items-center justify-center text-2xl font-bold ${
                      card.suit === "♥" || card.suit === "♦"
                        ? "bg-white text-red-600"
                        : "bg-white text-black"
                    }`}
                  >
                    <div className="text-center">
                      <div>{card.value}</div>
                      <div className="text-3xl">{card.suit}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-center p-4 rounded-xl ${
                  result.includes("win") || result.includes("Win")
                    ? "bg-green-500/20 border border-green-500/30"
                    : result.includes("Push")
                    ? "bg-blue-500/20 border border-blue-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}
              >
                <p className="text-xl font-bold text-white">{result}</p>
              </motion.div>
            )}

            {gameState === "playing" ? (
              <div className="flex gap-3">
                <Button
                  onClick={hit}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
                >
                  Hit
                </Button>
                <Button
                  onClick={stand}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
                >
                  Stand
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setGameState("betting")}
                className={`w-full h-12 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-semibold rounded-xl`}
              >
                New Game
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}