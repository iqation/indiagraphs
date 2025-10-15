"use client";

export default function GraphStats({
  stats,
}: {
  stats: { label: string; value: string }[];
}) {
  // 🎨 Define color schemes
  const colorSchemes = [
    {
      from: "from-indigo-100/70",
      to: "to-indigo-50/70",
      text: "text-indigo-700",
      glow: "shadow-[0_0_15px_rgba(79,70,229,0.15)]",
    },
    {
      from: "from-green-100/70",
      to: "to-green-50/70",
      text: "text-green-700",
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]",
    },
    {
      from: "from-amber-100/70",
      to: "to-amber-50/70",
      text: "text-amber-700",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-4 sm:mt-6">
      {stats.map((card, i) => {
        const scheme = colorSchemes[i % colorSchemes.length];
        const isYearsCard = card.label.toLowerCase() === "years";

        return (
          <div
            key={i}
            className={`rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${scheme.from} ${scheme.to} 
                        border border-white/60 backdrop-blur-md text-center
                        transition-all duration-300 hover:scale-[1.02] ${scheme.glow}
                        hover:shadow-lg`}
          >
            <p className="text-[13px] sm:text-sm text-gray-600 font-medium uppercase tracking-wide">
              {card.label}
            </p>

            {/* 🎯 Special layout just for the "Years" card */}
            {isYearsCard ? (
              <div className="mt-2 flex items-center justify-center gap-2">
                {/* Split start → end dynamically */}
                {(() => {
                  const [start, end] = card.value.split("→").map((v) => v.trim());
                  return (
                    <>
                      <span className="bg-amber-400/90 text-white text-sm sm:text-base px-3 py-1 rounded-full shadow-sm font-semibold">
                        {start}
                      </span>
                      <span className="text-amber-400 text-xs font-bold">to</span>
                      <span className="bg-amber-400/90 text-white text-sm sm:text-base px-3 py-1 rounded-full shadow-sm font-semibold">
                        {end}
                      </span>
                    </>
                  );
                })()}
              </div>
            ) : (
              <p
                className={`text-2xl sm:text-3xl font-extrabold mt-1 ${scheme.text}`}
              >
                {card.value}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}