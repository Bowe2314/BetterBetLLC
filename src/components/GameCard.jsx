import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function GameCard({ title, description, icon: Icon, path, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link to={path} className="group block">
        <div className={`relative overflow-hidden rounded-2xl p-6 h-52 ${gradient} transition-transform duration-300 group-hover:scale-[1.02]`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-10 -translate-x-10" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-white/70 text-sm mt-1">{description}</p>
            </div>
            <div className="flex items-center gap-1 text-white/80 text-sm font-medium group-hover:text-white transition-colors">
              Play Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}