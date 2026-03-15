import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Coins, Ban, Info } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">

        <Link
          to="/Dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-500/10 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold">Disclaimer</h1>
        </div>
        <p className="text-gray-400 text-sm mb-10">Please read this before playing.</p>

        <div className="space-y-4">

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Coins className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-amber-300 mb-1">Virtual currency only</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  All coins and balances on this site are <strong className="text-white">100% virtual</strong> and have no real-world monetary value. You cannot purchase coins, convert them to real money, or use them outside of this platform. This is a free-to-play game for entertainment purposes only.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Ban className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-red-300 mb-1">Withdraw is a placeholder</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The <strong className="text-white">Withdraw</strong> page is a non-functional placeholder. No real money will ever be sent, transferred, or processed. Submitting a withdrawal request does nothing — no funds will leave or enter any account.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-blue-300 mb-1">For entertainment only</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This platform is built for fun and does not constitute real gambling. No real money is at stake at any point. If you or someone you know has concerns about gambling habits, please visit{" "}
                  <a
                    href="https://www.begambleaware.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                  >
                    BeGambleAware.org
                  </a>.
                </p>
              </div>
            </div>
          </div>

        </div>

        <p className="text-center text-gray-600 text-xs mt-12">
          By using this site you acknowledge that all gameplay is virtual and no real money is involved.
        </p>

      </div>
    </div>
  );
}
