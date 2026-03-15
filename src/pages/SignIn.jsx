import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Coins, Eye, EyeOff, Mail, Lock } from "lucide-react";
import CurrencyDisplay from "../components/CurrencyDisplay";
import { useTheme } from "../components/ThemeContext";
import DisclaimerBanner from "../components/DisclaimerBanner";

export default function SignIn() {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    // Check if user is already logged in
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
    
    // If logged in, redirect to dashboard
    if (stored) {
      navigate("/Dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignup) {
      if (!username || !email || !password || !confirmPassword) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // Get existing users
      const users = JSON.parse(localStorage.getItem("casino_users") || "[]");
      
      // Check if email already exists
      if (users.find(u => u.email === email)) {
        setError("Email already registered");
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        balance: 2500,
        total_won: 0,
        total_lost: 0,
        games_played: 0,
        created_date: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem("casino_users", JSON.stringify(users));
      localStorage.setItem("casino_user", JSON.stringify(newUser));
      
      // Save to cookies (7 days)
      document.cookie = `casino_session=${newUser.id}; max-age=${7 * 24 * 60 * 60}; path=/`;
      
      localStorage.setItem("show_welcome", "true");
      navigate("/Dashboard");
    } else {
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Find user
      const users = JSON.parse(localStorage.getItem("casino_users") || "[]");
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("casino_user", JSON.stringify(user));
      
      // Save to cookies (7 days)
      document.cookie = `casino_session=${user.id}; max-age=${7 * 24 * 60 * 60}; path=/`;
      
      navigate("/Dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] relative flex flex-col">
      <div className="flex flex-1">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={theme.loginImage} 
          alt="Casino background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69b582f9d363f0bf479606ff/5c0318117_BetterBetsLogo.png" alt="Logo" className="w-10 h-10 rounded-xl" />
          <span className="text-white font-bold text-xl drop-shadow-lg">
            {window.location.hostname.replace(/\..*$/, '').replace(/-/g, ' ')}
          </span>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >


            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">
                {isSignup ? "Register Now" : "Welcome Back"}
              </h1>
              {isSignup && (
                <p className="text-xl font-bold text-white mb-1">AND GET <CurrencyDisplay coins={2500} className={theme.accentColor} /> FOR FREE</p>
              )}
            </div>

            {isSignup && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full ${theme.accentBg} flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white font-bold">1</span>
                  </div>
                  <p className={`${theme.accentColor} text-xs font-semibold uppercase`}>Just Register</p>
                </div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full ${theme.accentBg} flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white font-bold">2</span>
                  </div>
                  <p className={`${theme.accentColor} text-xs font-semibold uppercase`}>Get a Reward</p>
                </div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full ${theme.accentBg} flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white font-bold">3</span>
                  </div>
                  <p className={`${theme.accentColor} text-xs font-semibold uppercase`}>Play or Withdraw</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <div className="relative">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="bg-[#1a2028] border-gray-700 text-white placeholder:text-gray-500 h-14 pl-12 rounded-xl"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>
              )}
              
              <div>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-[#1a2028] border-gray-700 text-white placeholder:text-gray-500 h-14 pl-12 rounded-xl"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="bg-[#1a2028] border-gray-700 text-white placeholder:text-gray-500 h-14 pl-12 pr-12 rounded-xl"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isSignup && (
                <div>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="bg-[#1a2028] border-gray-700 text-white placeholder:text-gray-500 h-14 pl-12 pr-12 rounded-xl"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}

              {isSignup && (
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <input type="checkbox" className="mt-0.5" required />
                  <p>I agree to the User Agreement & confirm I am at least 18 years old</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-14 bg-gradient-to-r ${theme.gradient} hover:${theme.gradientHover} text-white font-bold text-base rounded-xl uppercase tracking-wide disabled:opacity-50`}
              >
                {loading ? "Loading..." : isSignup ? "Register" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsSignup(!isSignup); setError(""); setConfirmPassword(""); }}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {isSignup ? (
                  <>Already have an account? <span className={`${theme.accentColor} font-semibold`}>Sign in</span></>
                ) : (
                  <>Don't have an account? <span className={`${theme.accentColor} font-semibold`}>Register now</span></>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <DisclaimerBanner />
      </div>
    </div>
  );
}