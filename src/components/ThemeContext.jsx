import React, { createContext, useContext, useState, useEffect } from "react";

const THEMES = {
  pink: {
    name: "Pink Casino",
    primary: "pink",
    gradient: "from-pink-500 to-pink-600",
    gradientHover: "from-pink-600 to-pink-700",
    accentColor: "text-pink-400",
    accentBg: "bg-pink-500",
    accentBorder: "border-pink-500",
    accentBgLight: "bg-pink-500/10",
    accentBorderLight: "border-pink-500/20",
    shadowColor: "shadow-pink-500/20",
    loginImage: "https://i.imgur.com/OTBhKEK.png",
    welcomeImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b582f9d363f0bf479606ff/083a2da61_generated_80c97f5b.png"
  },
  purple: {
    name: "Purple Palace",
    primary: "purple",
    gradient: "from-purple-500 to-purple-600",
    gradientHover: "from-purple-600 to-purple-700",
    accentColor: "text-purple-400",
    accentBg: "bg-purple-500",
    accentBorder: "border-purple-500",
    accentBgLight: "bg-purple-500/10",
    accentBorderLight: "border-purple-500/20",
    shadowColor: "shadow-purple-500/20",
    loginImage: "https://i.imgur.com/NWZSTdk.png",
    welcomeImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b582f9d363f0bf479606ff/083a2da61_generated_80c97f5b.png"
  },
  gold: {
    name: "Golden Luck",
    primary: "amber",
    gradient: "from-amber-500 to-amber-600",
    gradientHover: "from-amber-600 to-amber-700",
    accentColor: "text-amber-400",
    accentBg: "bg-amber-500",
    accentBorder: "border-amber-500",
    accentBgLight: "bg-amber-500/10",
    accentBorderLight: "border-amber-500/20",
    shadowColor: "shadow-amber-500/20",
    loginImage: "https://i.imgur.com/aZ66RSf.png",
    welcomeImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b582f9d363f0bf479606ff/083a2da61_generated_80c97f5b.png"
  },
  emerald: {
    name: "Emerald Club",
    primary: "emerald",
    gradient: "from-emerald-500 to-emerald-600",
    gradientHover: "from-emerald-600 to-emerald-700",
    accentColor: "text-emerald-400",
    accentBg: "bg-emerald-500",
    accentBorder: "border-emerald-500",
    accentBgLight: "bg-emerald-500/10",
    accentBorderLight: "border-emerald-500/20",
    shadowColor: "shadow-emerald-500/20",
    loginImage: "https://i.imgur.com/aNNqCMw.png",
    welcomeImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b582f9d363f0bf479606ff/083a2da61_generated_80c97f5b.png"
  },
  cyan: {
    name: "Cyan Dreams",
    primary: "cyan",
    gradient: "from-cyan-500 to-cyan-600",
    gradientHover: "from-cyan-600 to-cyan-700",
    accentColor: "text-cyan-400",
    accentBg: "bg-cyan-500",
    accentBorder: "border-cyan-500",
    accentBgLight: "bg-cyan-500/10",
    accentBorderLight: "border-cyan-500/20",
    shadowColor: "shadow-cyan-500/20",
    loginImage: "https://i.imgur.com/0RQZJQd.png",
    welcomeImage: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b582f9d363f0bf479606ff/083a2da61_generated_80c97f5b.png"
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Change the theme here by editing the key below (pink, purple, gold, emerald, or cyan)
  const currentTheme = "cyan";

  return (
    <ThemeContext.Provider value={{ theme: THEMES[currentTheme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}