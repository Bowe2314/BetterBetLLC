import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CURRENCY_CONFIG = {
  USD: { symbol: "$", rate: 1, locale: "en-US" },
  EUR: { symbol: "€", rate: 0.92, locale: "de-DE" },
  GBP: { symbol: "£", rate: 0.79, locale: "en-GB" },
  JPY: { symbol: "¥", rate: 149.50, locale: "ja-JP" },
  AUD: { symbol: "A$", rate: 1.52, locale: "en-AU" },
  CAD: { symbol: "C$", rate: 1.36, locale: "en-CA" },
  INR: { symbol: "₹", rate: 83.12, locale: "en-IN" },
  BRL: { symbol: "R$", rate: 4.97, locale: "pt-BR" },
  MXN: { symbol: "MX$", rate: 17.08, locale: "es-MX" },
  CNY: { symbol: "¥", rate: 7.24, locale: "zh-CN" },
};

const COUNTRY_TO_CURRENCY = {
  US: "USD", GB: "GBP", JP: "JPY", AU: "AUD", CA: "CAD",
  IN: "INR", BR: "BRL", MX: "MXN", CN: "CNY",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", PT: "EUR",
  NL: "EUR", BE: "EUR", AT: "EUR", IE: "EUR", GR: "EUR",
};

async function detectCurrencyByIP() {
  const cached = localStorage.getItem("user_currency");
  if (cached) return cached;

  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    const countryCode = data.country_code;
    const currency = COUNTRY_TO_CURRENCY[countryCode] || "USD";
    localStorage.setItem("user_currency", currency);
    return currency;
  } catch (error) {
    const userLocale = navigator.language || "en-US";
    if (userLocale.includes("GB")) return "GBP";
    if (userLocale.includes("JP")) return "JPY";
    if (userLocale.includes("AU")) return "AUD";
    if (userLocale.includes("CA")) return "CAD";
    if (userLocale.includes("IN")) return "INR";
    if (userLocale.includes("BR")) return "BRL";
    if (userLocale.includes("MX")) return "MXN";
    if (userLocale.includes("CN")) return "CNY";
    if (userLocale.includes("de") || userLocale.includes("fr") || userLocale.includes("it") || userLocale.includes("es")) return "EUR";
    return "USD";
  }
}

export function useCurrency() {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    detectCurrencyByIP().then(setCurrency);
  }, []);

  const config = CURRENCY_CONFIG[currency];

  const convertCoins = (coins) => {
    return Math.round(coins * config.rate);
  };

  const formatCurrency = (coins) => {
    const amount = convertCoins(coins);
    return `${config.symbol}${amount.toLocaleString(config.locale)}`;
  };

  return { currency, convertCoins, formatCurrency, symbol: config.symbol };
}

export default function CurrencyDisplay({ coins, className = "" }) {
  const { formatCurrency } = useCurrency();

  return (
    <motion.span
      key={coins}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      className={className}
    >
      {formatCurrency(coins)}
    </motion.span>
  );
}