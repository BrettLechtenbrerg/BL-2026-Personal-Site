"use client";

import Image from "next/image";

const logos = [
  { name: "American Express", src: "/logos/american-express.png", width: 160 },
  { name: "Delta", src: "/logos/delta.png", width: 140 },
  { name: "Packsize", src: "/logos/packsize.png", width: 150 },
  { name: "MemberSolutions", src: "/logos/membersolutions.jpg", width: 160, hasBackground: true },
  { name: "Purple", src: "/logos/purple.jpg", width: 120, hasBackground: true },
  { name: "Thumbtack", src: "/logos/thumbtack.png", width: 150 },
  { name: "Murray Chamber", src: "/logos/murray-chamber.png", width: 120 },
  { name: "Heber Valley Chamber", src: "/logos/heber-valley-chamber.png", width: 130 },
  { name: "Park City Chamber", src: "/logos/park-city-chamber.png", width: 130 },
];

export function LogoScroller() {
  // Double the logos for seamless infinite scroll
  const doubledLogos = [...logos, ...logos];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />

      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cranberry/30 to-transparent" />

      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative">
        {/* Header with subtle styling */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-10">
          <p className="text-sm font-semibold text-warm-gray tracking-wide uppercase">
            Trusted by Leading Organizations
          </p>
        </div>

        {/* Scrolling container */}
        <div className="relative">
          {/* Premium gradient fades on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div className="flex animate-scroll hover:pause-animation">
            {doubledLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex-shrink-0 mx-6 lg:mx-10 flex items-center justify-center group"
              >
                {/* Logo card with hover effects */}
                <div
                  className={`relative h-20 px-6 flex items-center justify-center rounded-xl transition-all duration-500 ease-out
                    bg-white/80 backdrop-blur-sm
                    border border-gray-100/50
                    shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]
                    group-hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.15)]
                    group-hover:border-cranberry/20
                    group-hover:scale-105
                    group-hover:-translate-y-1
                  `}
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cranberry/0 via-transparent to-gold/0 group-hover:from-cranberry/5 group-hover:to-gold/5 transition-all duration-500" />

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>

                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={logo.width}
                    height={56}
                    className={`relative h-10 w-auto object-contain transition-all duration-500
                      group-hover:scale-110
                      ${logo.hasBackground ? "mix-blend-multiply" : ""}
                    `}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add animation keyframes via style tag */}
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 35s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
