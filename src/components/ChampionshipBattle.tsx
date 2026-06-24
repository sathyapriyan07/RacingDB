/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { store } from "../data/store";
import { Trophy, ArrowUp, ArrowDown, TrendingUp, Sparkles } from "lucide-react";

export default function ChampionshipBattle() {
  const drivers = store.getDriverStandings().slice(0, 4); // Top 4 contenders
  const leaderPoints = drivers[0]?.points || 1;

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-white font-display font-extrabold text-lg uppercase tracking-tight">
            Championship Contenders
          </h2>
        </div>
        <div className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono font-bold rounded flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Live Forecast
        </div>
      </div>

      {/* Grid Comparison Progression Rows */}
      <div className="space-y-6">
        {drivers.map((drv, idx) => {
          const percentage = (drv.points / leaderPoints) * 100;
          const diff = idx === 0 ? 0 : leaderPoints - drv.points;

          // Visual direction indicators
          const isClimbing = drv.driverName === "Charles Leclerc" || drv.driverName === "Lando Norris";

          return (
            <div key={drv.driverId} className="group">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-sm text-zinc-600">
                      #{idx + 1}
                    </span>
                    <span className="font-sans font-bold text-sm text-white group-hover:text-[#E10600] transition-colors">
                      {drv.driverName}
                    </span>
                    {isClimbing ? (
                      <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 text-zinc-600" />
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 ml-5">
                    {drv.teamName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-base text-white">
                    {drv.points} <span className="text-[10px] text-zinc-500 font-mono">PTS</span>
                  </span>
                  {idx > 0 && (
                    <p className="text-[10px] font-mono text-[#E10600]">
                      -{diff} gap
                    </p>
                  )}
                </div>
              </div>

              {/* Progress visual slider */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    idx === 0 
                      ? "bg-[#E10600]" 
                      : idx === 1 
                      ? "bg-amber-400" 
                      : idx === 2 
                      ? "bg-purple-500" 
                      : "bg-zinc-600"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/5 mt-6 pt-4 text-center">
        <p className="text-zinc-500 text-[10px] font-mono flex items-center justify-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          Projections updated automatically via simulated Jolpica results.
        </p>
      </div>
    </div>
  );
}
