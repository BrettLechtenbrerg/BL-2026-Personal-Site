"use client";

import { HeroOptionA } from "@/components/sections/HeroOptionA";
import { HeroOptionB } from "@/components/sections/HeroOptionB";
import { HeroOptionC } from "@/components/sections/HeroOptionC";

export default function HeroTestPage() {
  return (
    <main>
      {/* Option A */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-50 bg-cranberry text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl">
          OPTION A: Clean & Confident
        </div>
        <HeroOptionA />
      </div>

      {/* Divider */}
      <div className="bg-gray-900 py-8 text-center">
        <p className="text-white text-2xl font-bold">↓ Scroll to see Option B ↓</p>
      </div>

      {/* Option B */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-50 bg-gold text-black px-6 py-3 rounded-full font-bold text-lg shadow-xl">
          OPTION B: Centered Impact
        </div>
        <HeroOptionB />
      </div>

      {/* Divider */}
      <div className="bg-gray-900 py-8 text-center">
        <p className="text-white text-2xl font-bold">↓ Scroll to see Option C ↓</p>
      </div>

      {/* Option C */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-50 bg-white text-black px-6 py-3 rounded-full font-bold text-lg shadow-xl">
          OPTION C: Above the Fold Focus
        </div>
        <HeroOptionC />
      </div>

      {/* Summary */}
      <div className="bg-black py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Pick Your Winner!</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-cranberry/20 border border-cranberry/30 rounded-2xl p-6">
              <h3 className="text-cranberry-light font-bold text-xl mb-3">Option A</h3>
              <p className="text-gray-300 text-sm">
                Clean & Confident — Keeps side-by-side layout, removes pillars,
                single badge, simplified headline. Best balance of current design with less clutter.
              </p>
            </div>
            <div className="bg-gold/20 border border-gold/30 rounded-2xl p-6">
              <h3 className="text-gold font-bold text-xl mb-3">Option B</h3>
              <p className="text-gray-300 text-sm">
                Centered Impact — Bold, Apple-style. Full-width background,
                centered text, credentials bar at bottom. Maximum visual impact.
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-white font-bold text-xl mb-3">Option C</h3>
              <p className="text-gray-300 text-sm">
                Above the Fold Focus — Ultra-minimal. No badges, no effects,
                just headline + subhead + button + photo. Lets copy do the work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
