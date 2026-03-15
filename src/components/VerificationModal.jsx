import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, RefreshCw } from "lucide-react";

export default function VerificationModal({ email, onVerify, onResend }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Please enter the complete code");
      return;
    }
    
    setLoading(true);
    const result = await onVerify(code);
    if (!result.success) {
      setError(result.error || "Invalid verification code");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const result = await onResend();
    if (result.success) {
      setResendTimer(60);
      setError("");
    } else {
      setError(result.error || "Failed to resend code");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a2028] border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-pink-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
        <p className="text-gray-400 mb-6">
          We've sent a verification code to<br />
          <span className="text-white font-medium">{email}</span>
        </p>

        <div className="mb-6">
          <InputOTP maxLength={6} value={code} onChange={(value) => { setCode(value); setError(""); }}>
            <InputOTPGroup className="gap-2 mx-auto">
              <InputOTPSlot index={0} className="w-12 h-14 text-xl border-gray-700 bg-[#0f1419] text-white" />
              <InputOTPSlot index={1} className="w-12 h-14 text-xl border-gray-700 bg-[#0f1419] text-white" />
              <InputOTPSlot index={2} className="w-12 h-14 text-xl border-gray-700 bg-[#0f1419] text-white" />
              <InputOTPSlot index={3} className="w-12 h-14 text-xl border-gray-700 bg-[#0f1419] text-white" />
              <InputOTPSlot index={4} className="w-12 h-14 text-xl border-gray-700 bg-[#0f1419] text-white" />
              <InputOTPSlot index={5} className="w-12 h-14 text-xl border-gray-700 bg-[#0f1419] text-white" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mb-4"
          >
            {error}
          </motion.p>
        )}

        <Button
          onClick={handleVerify}
          disabled={code.length !== 6 || loading}
          className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-xl mb-4 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </Button>

        <button
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mx-auto disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend code"}
        </button>
      </motion.div>
    </div>
  );
}