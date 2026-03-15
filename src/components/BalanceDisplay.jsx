import React from "react";
import { motion } from "framer-motion";
import CurrencyDisplay, { useCurrency } from "./CurrencyDisplay";
import { useTheme } from "./ThemeContext";

export default function BalanceDisplay({ balance }) {
  const { theme } = useTheme();
  
  return (
    <motion.div
      key={balance}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      className={`flex items-center gap-2 bg-[#0f1419] border ${theme.accentBorderLight} rounded-xl px-4 py-2`}
    >
      <CurrencyDisplay coins={balance} className={`${theme.accentColor} font-bold text-lg`} />
    </motion.div>
  );
}