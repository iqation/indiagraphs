"use client";

import { ExternalLink } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  source?: string | null;
};

export default function GraphHeader({ title, subtitle, source }: Props) {
  return (
    <header
      className="flex flex-col items-center text-center gap-4 sm:gap-5 
                 animate-fadeIn mt-4 sm:mt-6"
    >
      {/* 🌟 Title */}
      <h1
        className="font-extrabold text-[#1B1B33]
                   text-[clamp(1.9rem,2.2vw+1.2rem,2.6rem)]
                   leading-tight tracking-tight
                   bg-gradient-to-r from-[#1B1B33] via-[#2C2C5B] to-[#3B5BDB]
                   bg-clip-text text-transparent"
      >
        {title}
      </h1>

      {/* 🪶 Subtitle */}
      {subtitle && (
        <p
          className="text-[clamp(0.95rem,0.6vw+0.8rem,1.1rem)]
                     text-neutral-600 leading-relaxed max-w-2xl mx-auto
                     px-4 sm:px-0 font-medium"
        >
          {subtitle}
        </p>
      )}

      {/* 🔗 Source Tag */}
      {source && (
        <a
          href="#"
          aria-label={`Data Source: ${source}`}
          className="inline-flex items-center gap-2 rounded-full
                     bg-gradient-to-r from-white to-[#f9faff]
                     border border-indigo-100 px-4 py-1.5
                     text-sm font-semibold text-[#3B5BDB]
                     shadow-[0_3px_10px_rgba(59,91,219,0.08)]
                     hover:shadow-[0_5px_16px_rgba(59,91,219,0.15)]
                     hover:bg-indigo-50/40 transition-all duration-300
                     hover:scale-[1.03] backdrop-blur-sm"
        >
          <span className="text-gray-500 font-medium opacity-80">Source:</span>
          <span className="uppercase tracking-wide">{source}</span>
         {/* <ExternalLink size={14} className="text-indigo-500 opacity-80" /> */}
        </a>
      )}
    </header>
  );
}