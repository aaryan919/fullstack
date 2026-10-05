import React from 'react';

export default function Logo({ className = "", dark = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Mark */}
      <div className="relative flex items-center justify-center h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#022c22] to-[#064e3b] shadow-lg ring-1 ring-emerald-500/30">
        
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 h-full w-full bg-gradient-to-bl from-emerald-400/40 to-transparent blur-md" />
        
        {/* The 'V' Formation */}
        <div className="absolute inset-0 flex items-end justify-center pb-[18%]">
          {/* Left stroke */}
          <div className="h-[55%] w-[22%] rounded-full bg-gradient-to-b from-emerald-200 to-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.8)] origin-bottom-right -rotate-[35deg] z-10 translate-x-[2px]" />
          
          {/* Right stroke */}
          <div className="h-[75%] w-[26%] rounded-full bg-gradient-to-t from-emerald-600 to-emerald-300 origin-bottom-left rotate-[35deg] -translate-x-[2px]" />
        </div>
        
        {/* Accent dot (Active Node) */}
        <div className="absolute top-[22%] left-[22%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] z-20">
          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-50" />
        </div>
      </div>
      
      {/* Text Mark */}
      <span className={`font-display text-2xl font-black tracking-tighter ${dark ? "text-white" : "text-[#022c22]"}`}>
        Project<span className="text-emerald-500">VPN</span>
      </span>
    </div>
  );
}
