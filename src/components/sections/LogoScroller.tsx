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
    <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-8">
        <p className="text-sm text-warm-gray">
          Brett has spoken at and conducted training for organizations including:
        </p>
      </div>

      {/* Scrolling container */}
      <div className="relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex animate-scroll hover:pause-animation">
          {doubledLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 mx-8 lg:mx-12 flex items-center justify-center"
            >
              <div
                className={`relative h-14 flex items-center ${
                  logo.hasBackground
                    ? "bg-white rounded-lg px-4 py-2 shadow-sm"
                    : ""
                }`}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={56}
                  className={`h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 ${
                    logo.hasBackground ? "mix-blend-multiply" : ""
                  }`}
                />
              </div>
            </div>
          ))}
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
          animation: scroll 40s linear infinite;
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
