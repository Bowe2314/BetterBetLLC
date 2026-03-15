import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wallet, ArrowLeft, Shield, Lock, CheckCircle, Info, CircleDollarSign } from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useCurrency } from "../components/CurrencyDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAYPAL_CLIENT_ID = "AUtn_NdqLzI9lIw_zWafxAOioxn8YRAZGppaYSKFUmrB2HdLIv1XM7YnnRQ3ucG_SfY2zmXtC007Waeq";

export default function Payment() {
  const [user, setUser] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [paypalReady, setPaypalReady] = useState(false);
  const paypalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { formatCurrency } = useCurrency();

  const depositAmount = location.state?.amount || 0;
  const stepId = location.state?.stepId || null;
  const userId = location.state?.userId || null;

  useEffect(() => {
    const stored = localStorage.getItem("casino_user");
    if (!stored) {
      navigate("/SignIn");
      return;
    }
    setUser(JSON.parse(stored));

    if (!depositAmount) {
      navigate("/Withdraw");
    }
  }, [navigate, depositAmount]);

  // Load PayPal SDK
  useEffect(() => {
    if (window.paypal) {
      setPaypalReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.onload = () => setPaypalReady(true);
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  // Render PayPal buttons when method selected and SDK ready
  useEffect(() => {
    if (selectedPayment !== "paypal" || !paypalReady || !paypalRef.current) return;
    paypalRef.current.innerHTML = "";
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: depositAmount.toFixed(2) } }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(() => {
          if (stepId && userId) {
            const completed = JSON.parse(localStorage.getItem(`completed_steps_${userId}`) || "[]");
            if (!completed.includes(stepId)) completed.push(stepId);
            localStorage.setItem(`completed_steps_${userId}`, JSON.stringify(completed));
          }
          alert("Payment successful! Redirecting...");
          navigate("/Withdraw");
        });
      },
      onError: (err) => {
        alert("Payment failed. Please try again.");
      }
    }).render(paypalRef.current);
  }, [selectedPayment, paypalReady, depositAmount]);

  const paymentMethods = [
    { id: "paypal", name: "PayPal", icon: CircleDollarSign, description: "Fast & secure" },
    { id: "crypto", name: "Cryptocurrency", icon: Wallet, description: "Bitcoin, USDT" },
  ];

  const handleDeposit = () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (stepId && userId) {
      const completed = JSON.parse(localStorage.getItem(`completed_steps_${userId}`) || "[]");
      if (!completed.includes(stepId)) completed.push(stepId);
      localStorage.setItem(`completed_steps_${userId}`, JSON.stringify(completed));
    }
    alert("Deposit request submitted! You will be contacted with payment instructions.");
    navigate("/Withdraw");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f1419] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/Withdraw")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Verification Payment</h1>
            <p className="text-gray-400">Secure payment processing</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-6 md:p-8 space-y-6">
              {/* Security Notice */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Secure Payment</h3>
                    <p className="text-gray-400 text-sm">
                      All transactions are encrypted and secure. This verification deposit unlocks full withdrawal access.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-white font-semibold mb-4">Select Payment Method</h3>
                <div className="grid gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedPayment === method.id
                            ? `${theme.accentBorder} ${theme.accentBgLight}`
                            : "border-gray-700 bg-[#0f1419] hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${selectedPayment === method.id ? theme.accentBg : "bg-gray-800"} flex items-center justify-center`}>
                              <Icon className={`w-6 h-6 ${selectedPayment === method.id ? "text-white" : "text-gray-400"}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-semibold">{method.name}</h4>
                                {method.id === "paypal" && (
                                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full border border-green-500/30">FASTEST</span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">{method.description}</p>
                            </div>
                          </div>
                          {selectedPayment === method.id && (
                            <CheckCircle className={`w-5 h-5 ${theme.accentColor}`} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedPayment === "paypal" && (
                <div className="bg-[#0f1419] border border-gray-700 rounded-xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">PayPal Payment</h4>
                      <p className="text-gray-400 text-sm">
                        Complete your payment of {formatCurrency(depositAmount)} securely via PayPal.
                      </p>
                    </div>
                  </div>
                  {paypalReady ? (
                    <div ref={paypalRef} />
                  ) : (
                    <p className="text-gray-400 text-sm text-center">Loading PayPal...</p>
                  )}
                </div>
              )}

              {selectedPayment === "crypto" && (
                <div className="bg-[#0f1419] border border-gray-700 rounded-xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">Crypto Payment Instructions</h4>
                      <p className="text-gray-400 text-sm">
                        Send the exact amount to one of the wallet addresses below, then contact support with your transaction ID.
                      </p>
                    </div>
                  </div>
                  {[
                    { label: "Bitcoin (BTC)", address: "bc1q7ygh74sfpnxgs59hj49juphm2ge5uypl0gt8gl" },
                    { label: "Ethereum (ETH)", address: "0xD0237c19ea10b1493ee06F18Dd1e292C6Fe9076D" },
                    { label: "USDT (ERC20)", address: "0xD0237c19ea10b1493ee06F18Dd1e292C6Fe9076D" },
                    { label: "XRP", address: "raB6dzKMSW5i5AGMAwJ717uQSzybujaSeD" },
                  ].map(({ label, address }) => (
                    <div key={label} className="bg-[#1a2028] border border-gray-600 rounded-lg p-4">
                      <label className="text-xs text-gray-400 block mb-2">{label}</label>
                      <div className="flex items-center gap-2">
                        <code className="text-white text-sm font-mono break-all flex-1">{address}</code>
                        <button
                          onClick={() => { navigator.clipboard.writeText(address); alert("Copied!"); }}
                          className="text-blue-400 hover:text-blue-300 text-xs whitespace-nowrap"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPayment !== "paypal" && (
                <Button
                  onClick={handleDeposit}
                  disabled={!selectedPayment}
                  className={`w-full h-12 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-semibold disabled:opacity-50`}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Continue to Payment
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a2028] border border-gray-800/50 rounded-2xl p-6 sticky top-6">
              <h3 className="text-white font-semibold mb-6">Payment Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Deposit Amount</span>
                  <span className="text-white font-medium">{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Processing Fee</span>
                  <span className="text-white font-medium">{formatCurrency(0)}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className={`text-xl font-bold ${theme.accentColor}`}>{formatCurrency(depositAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span className="text-gray-400">Instant account verification</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span className="text-gray-400">Unlock withdrawal access</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span className="text-gray-400">Secure encrypted payment</span>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}