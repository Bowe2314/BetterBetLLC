import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Coins, LayoutDashboard, Dices, CircleDot, Cherry, CircleDollarSign, Spade, TrendingUp, TrendingDown, Bomb, Grid3x3, DollarSign, LogOut, Menu, X } from "lucide-react";
import BalanceDisplay from "./BalanceDisplay";
import { useTheme } from "./ThemeContext";
import DisclaimerBanner from "./DisclaimerBanner";

export default function CasinoLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try localStorage first
    let stored = localStorage.getItem("casino_user");
    
    // If not in localStorage, check cookies
    if (!stored) {
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find(c => c.trim().startsWith('casino_session='));
      
      if (sessionCookie) {
        const userId = sessionCookie.split('=')[1];
        const users = JSON.parse(localStorage.getItem("casino_users") || "[]");
        const user = users.find(u => u.id === userId);
        
        if (user) {
          localStorage.setItem("casino_user", JSON.stringify(user));
          stored = JSON.stringify(user);
        }
      }
    }
    
    if (!stored) {
      navigate("/SignIn");
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  // Listen for balance updates
  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("casino_user");
      if (stored) setUser(JSON.parse(stored));
    };
    window.addEventListener("balanceUpdate", handleUpdate);
    return () => window.removeEventListener("balanceUpdate", handleUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("casino_user");
    document.cookie = "casino_session=; max-age=0; path=/";
    navigate("/SignIn");
  };

  const navItems = [
    { label: "Dashboard", path: "/Dashboard", icon: LayoutDashboard },
    { label: "Coin Flip", path: "/CoinFlip", icon: CircleDot },
    { label: "Dice Roll", path: "/DiceRoll", icon: Dices },
    { label: "Slots", path: "/SlotMachine", icon: Cherry },
    { label: "Roulette", path: "/Roulette", icon: CircleDollarSign },
    { label: "Blackjack", path: "/Blackjack", icon: Spade },
    { label: "Crash", path: "/Crash", icon: TrendingUp },

    { label: "Mines", path: "/Mines", icon: Bomb },
    { label: "Keno", path: "/Keno", icon: Grid3x3 },
    { label: "Withdraw", path: "/Withdraw", icon: DollarSign },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-[#1a2028]/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/Dashboard" className="flex items-center gap-2">
              <img src="https://media.base44.com/images/public/69b582f9d363f0bf479606ff/5c0318117_BetterBetsLogo.png" alt="Logo" className="w-9 h-9 rounded-lg" />
              <span className="text-white font-bold text-lg hidden sm:block">
                {window.location.hostname.replace(/\.(com|net|nl|org|io|co|app|gg|bet|win).*$/, '').replace(/-/g, ' ')}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/Dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === "/Dashboard"
                    ? `${theme.accentBgLight} ${theme.accentColor}`
                    : "text-gray-400 hover:text-white hover:bg-[#0f1419]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/Withdraw"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === "/Withdraw"
                    ? `${theme.accentBgLight} ${theme.accentColor}`
                    : "text-gray-400 hover:text-white hover:bg-[#0f1419]"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Withdraw
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BalanceDisplay balance={user.balance || 0} />
            <span className="text-gray-400 text-sm hidden sm:block">{user.username}</span>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 transition-colors p-2"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-400 p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 bg-[#1a2028]/95 backdrop-blur-xl p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? `${theme.accentBgLight} ${theme.accentColor}`
                      : "text-gray-400 hover:text-white hover:bg-[#0f1419]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <DisclaimerBanner />
    </div>
  );
}