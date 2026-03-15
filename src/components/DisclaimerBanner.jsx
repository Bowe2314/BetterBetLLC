import React from "react";
import { Link } from "react-router-dom";

export default function DisclaimerBanner() {
  return (
    <div className="w-full py-2 flex items-center justify-center bg-transparent">
      <Link to="/Disclaimer" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
        Our policy
      </Link>
    </div>
  );
}
