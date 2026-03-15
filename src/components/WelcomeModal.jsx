import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import CurrencyDisplay from "./CurrencyDisplay";
import { useTheme } from "./ThemeContext";

export default function WelcomeModal({ show, onClose }) {
  const { theme } = useTheme();
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10">
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <img
                  src={theme.welcomeImage}
                  alt="Welcome bonus treasure"
                  className="w-32 h-32 mx-auto rounded-2xl"
                />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">Welcome Bonus!</h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className={`w-5 h-5 ${theme.accentColor}`} />
                <CurrencyDisplay coins={2500} className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`} />
                <Sparkles className={`w-5 h-5 ${theme.accentColor}`} />
              </div>
              <p className="text-gray-400 mb-6">Free bonus has been added to your account. Time to test your luck!</p>

              <Button
                onClick={onClose}
                className={`w-full h-12 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-semibold text-base rounded-xl`}
              >
                Start Playing!
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}