/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { Award, Trophy, ArrowUpRight, Flame, Layers } from "lucide-react";

interface StandingsViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function StandingsView({ onNavigate }: StandingsViewProps) {
  const [activeTab, setActiveTab] = useState<"drivers" | "constructors">("drivers");
  const [driverStandings, setDriverStandings] = useState(store.getDriverStandings());
  const [constructorStandings, setConstructorStandings] = useState(store.getConstructorStandings());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setDriverStandings(store.getDriverStandings());
      setConstructorStandings(store.getConstructorStandings());
    });
    return unsub;
  }, []);

  const leaderPoints = driverStandings[0]?.points || 1;
  const constructorLeaderPoints = constructorStandings[0]?.points || 1;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-[#E10600]" /> Championship Centre
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Official Championship points tables with automated calculations from completed races
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex gap-1 bg-white/5 p-1 rounded border border-white/5 text-xs font-mono">
          {(["drivers", "constructors"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded font-bold uppercase transition-all flex items-center gap-2 ${
                activeTab === tab ? "bg-[#E10600] text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab === "drivers" ? <Trophy className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
              {tab === "drivers" ? "Drivers Championship" : "Constructors Championship"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "drivers" ? (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-white/1 uppercase tracking-wider text-[10px] text-zinc-500">
                  <th className="py-4 px-6 font-bold text-center w-16">Pos</th>
                  <th className="py-4 px-4 font-bold">Driver</th>
                  <th className="py-4 px-4 font-bold">Constructor</th>
                  <th className="py-4 px-4 font-bold text-center">Wins</th>
                  <th className="py-4 px-4 font-bold text-center">Points Progression</th>
                  <th className="py-4 px-6 font-bold text-right w-32">Total Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {driverStandings.map((ds, idx) => {
                  const percent = (ds.points / leaderPoints) * 100;
                  const gap = idx === 0 ? 0 : leaderPoints - ds.points;

                  return (
                    <tr key={ds.driverId} className="hover:bg-white/3 transition-colors text-zinc-300">
                      
                      {/* Position */}
                      <td className="py-4 px-6 text-center font-display font-black text-base text-white">
                        {ds.position}
                      </td>

                      {/* Driver Details */}
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => ds.driverId && onNavigate("drivers", { driverId: ds.driverId })}
                          className="font-sans font-bold text-sm text-white hover:text-[#E10600] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                        >
                          {ds.driverName}
                          {ds.streak && (
                            <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 fill-emerald-400" /> ON FIRE
                            </span>
                          )}
                        </button>
                        <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Maranello Center</p>
                      </td>

                      {/* Constructor */}
                      <td className="py-4 px-4 font-sans text-xs text-zinc-400">
                        {ds.teamName}
                      </td>

                      {/* Wins count */}
                      <td className="py-4 px-4 text-center font-display font-bold text-sm text-white">
                        {ds.wins || "-"}
                      </td>

                      {/* Bar Progression visualizer */}
                      <td className="py-4 px-4 min-w-[140px]">
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${idx === 0 ? "bg-[#E10600]" : "bg-zinc-400"}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </td>

                      {/* Total Points */}
                      <td className="py-4 px-6 text-right font-display font-black text-sm text-white">
                        <div>
                          <span>{ds.points}</span>
                          {idx > 0 && (
                            <p className="text-[9px] font-mono text-[#E10600] mt-0.5">-{gap} gap</p>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-white/1 uppercase tracking-wider text-[10px] text-zinc-500">
                  <th className="py-4 px-6 font-bold text-center w-16">Pos</th>
                  <th className="py-4 px-4 font-bold">Constructor Team</th>
                  <th className="py-4 px-4 font-bold text-center">Wins</th>
                  <th className="py-4 px-4 font-bold text-center">Points Progression</th>
                  <th className="py-4 px-6 font-bold text-right w-32">Total Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {constructorStandings.map((cs, idx) => {
                  const percent = (cs.points / constructorLeaderPoints) * 100;
                  const gap = idx === 0 ? 0 : constructorLeaderPoints - cs.points;

                  return (
                    <tr key={cs.teamId} className="hover:bg-white/3 transition-colors text-zinc-300">
                      
                      {/* Pos */}
                      <td className="py-4 px-6 text-center font-display font-black text-base text-white">
                        {cs.position}
                      </td>

                      {/* Team details */}
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => cs.teamId && onNavigate("teams", { teamId: cs.teamId })}
                          className="font-sans font-bold text-sm text-white hover:text-[#E10600] transition-colors text-left cursor-pointer"
                        >
                          {cs.teamName}
                        </button>
                      </td>

                      {/* Wins */}
                      <td className="py-4 px-4 text-center font-display font-bold text-sm text-white">
                        {cs.wins || "-"}
                      </td>

                      {/* Bar Progression */}
                      <td className="py-4 px-4 min-w-[140px]">
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${idx === 0 ? "bg-[#E10600]" : "bg-zinc-500"}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </td>

                      {/* Pts */}
                      <td className="py-4 px-6 text-right font-display font-black text-sm text-white">
                        <div>
                          <span>{cs.points}</span>
                          {idx > 0 && (
                            <p className="text-[9px] font-mono text-[#E10600] mt-0.5">-{gap} gap</p>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
