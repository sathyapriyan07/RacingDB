/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Race, RaceResult, StartingGridItem, QualifyingResult, PracticeResult } from "../types";
import { Trophy, Timer, ChevronRight, Compass, Users, Clock, Award, Star } from "lucide-react";

// ==================== RACE HERO ====================
interface RaceHeroProps {
  race: Race;
  onNavigate: (view: string, params?: any) => void;
}

export function RaceHero({ race, onNavigate }: RaceHeroProps) {
  const isCompleted = race.completed;

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/5 bg-gradient-to-r from-black via-zinc-950 to-[#111111] p-6 md:p-10 flex flex-col justify-between min-h-[320px] shadow-2xl">
      {/* Background Accent Lines */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#E10600]/10 to-transparent pointer-events-none" />
      
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-[#E10600] text-white px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-widest">
            ROUND {race.round}
          </span>
          <span className="text-zinc-400 font-mono text-xs">{race.date}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
            isCompleted ? "bg-white/10 text-white" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}>
            {isCompleted ? "Finished" : "Live Race Centre"}
          </span>
        </div>

        <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-none uppercase">
          {race.name}
        </h1>
        <p className="text-zinc-400 font-mono text-sm mt-2 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#E10600]" />
          {race.circuitName}
        </p>

        {race.championshipImpact && (
          <p className="text-zinc-500 text-xs md:text-sm max-w-2xl mt-4 leading-relaxed font-sans italic border-l-2 border-[#E10600] pl-3">
            "{race.championshipImpact}"
          </p>
        )}
      </div>

      {/* Hero Stats Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/5 mt-8 pt-6">
        <div>
          <p className="text-[10px] font-mono text-zinc-500 uppercase">Track Session Time</p>
          <p className="font-display font-bold text-white mt-1 flex items-center gap-1.5 text-sm">
            <Clock className="w-4 h-4 text-[#E10600]" />
            {race.time} (Local broadcast)
          </p>
        </div>

        {isCompleted && race.fastestLap ? (
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Fastest Lap</p>
            <p className="font-display font-bold text-white mt-1 flex items-center gap-1.5 text-sm">
              <Timer className="w-4 h-4 text-purple-400" />
              {race.fastestLap.time} - {race.fastestLap.driverName}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Track Details</p>
            <button 
              onClick={() => onNavigate("circuits", { circuitId: race.circuitId })}
              className="text-xs font-mono font-bold text-[#E10600] hover:underline flex items-center mt-1 gap-1"
            >
              Analyze Track Specs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isCompleted && race.driverOfTheDayId ? (
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Driver Of The Day</p>
            <p className="font-display font-bold text-[#E10600] mt-1 flex items-center gap-1.5 text-sm uppercase tracking-wide">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {race.driverOfTheDayId.toUpperCase()}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Channel</p>
            <p className="font-display font-bold text-white mt-1 text-sm">ESPN / Sky Sports F1</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== RACE PODIUM ====================
interface RacePodiumProps {
  results: RaceResult[];
}

export function RacePodium({ results }: RacePodiumProps) {
  const p1 = results.find(r => r.position === 1);
  const p2 = results.find(r => r.position === 2);
  const p3 = results.find(r => r.position === 3);

  if (!p1) return null;

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 flex flex-col items-center">
      <h2 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-8 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-500" />
        Podium Showcase
      </h2>

      {/* Podium Blocks Visual */}
      <div className="flex items-end justify-center w-full max-w-md gap-2 md:gap-4 h-64 mt-4">
        
        {/* P2 - Silver (Left) */}
        {p2 && (
          <div className="flex flex-col items-center w-1/3">
            <div className="text-center mb-2">
              <p className="font-display font-black text-xs text-white truncate max-w-[100px]">{p2.driverCode}</p>
              <p className="text-[9px] font-mono text-zinc-500 truncate max-w-[100px]">{p2.teamName}</p>
            </div>
            {/* Base Block */}
            <div className="w-full h-28 bg-zinc-800/80 hover:bg-zinc-800 border-t-2 border-zinc-400 rounded-t flex flex-col items-center justify-center p-2 shadow-lg transition-all duration-300">
              <span className="font-display font-black text-4xl text-zinc-400">2</span>
              <span className="text-[9px] font-mono text-zinc-400 uppercase mt-1">Silver</span>
            </div>
          </div>
        )}

        {/* P1 - Gold (Center, Highest) */}
        <div className="flex flex-col items-center w-1/3">
          <div className="text-center mb-2">
            <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1 animate-bounce" />
            <p className="font-display font-black text-sm text-white truncate max-w-[120px]">{p1.driverCode}</p>
            <p className="text-[9px] font-mono text-zinc-500 truncate max-w-[120px]">{p1.teamName}</p>
          </div>
          {/* Base Block */}
          <div className="w-full h-36 bg-gradient-to-b from-[#E10600]/80 to-[#E10600]/30 hover:brightness-110 border-t-4 border-amber-400 rounded-t flex flex-col items-center justify-center p-2 shadow-2xl relative transition-all duration-300">
            <span className="font-display font-black text-5xl text-amber-400">1</span>
            <span className="text-[9px] font-mono text-amber-400 uppercase font-extrabold mt-1">Winner</span>
          </div>
        </div>

        {/* P3 - Bronze (Right) */}
        {p3 && (
          <div className="flex flex-col items-center w-1/3">
            <div className="text-center mb-2">
              <p className="font-display font-black text-xs text-white truncate max-w-[100px]">{p3.driverCode}</p>
              <p className="text-[9px] font-mono text-zinc-500 truncate max-w-[100px]">{p3.teamName}</p>
            </div>
            {/* Base Block */}
            <div className="w-full h-20 bg-zinc-900/90 hover:bg-zinc-900 border-t-2 border-amber-800 rounded-t flex flex-col items-center justify-center p-2 shadow-md transition-all duration-300">
              <span className="font-display font-black text-3.5xl text-amber-800">3</span>
              <span className="text-[9px] font-mono text-amber-800 uppercase mt-1">Bronze</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ==================== STARTING GRID ====================
interface StartingGridProps {
  grid: StartingGridItem[];
}

export function StartingGrid({ grid }: StartingGridProps) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 shadow-lg">
      <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-[#E10600]" />
        Starting Grid Formation
      </h3>

      {/* Grid Track Visualizer */}
      <div className="space-y-4 relative pl-8 border-l border-dashed border-white/10 py-2">
        {grid.map((item, index) => {
          // Stagger grid positions (alternate left and right indent)
          const isLeft = index % 2 === 0;

          return (
            <div 
              key={item.driverId}
              className={`relative flex items-center gap-4 bg-[#111111] hover:bg-[#161616] border border-white/5 rounded p-3 transition-colors ${
                isLeft ? "max-w-[90%]" : "max-w-[90%] ml-auto"
              }`}
            >
              {/* Grid Slot Pin */}
              <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-900 border border-white/20 text-[10px] font-mono font-bold flex items-center justify-center text-white">
                {item.position}
              </div>

              {/* Box Info */}
              <div className="flex-grow">
                <p className="font-display font-bold text-xs text-white">{item.driverName}</p>
                <p className="text-[10px] font-mono text-zinc-500">{item.teamName}</p>
              </div>

              <div className="font-mono text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                {item.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== QUALIFYING TABLE ====================
interface QualifyingTableProps {
  qualifying: QualifyingResult[];
}

export function QualifyingTable({ qualifying }: QualifyingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-mono">
        <thead>
          <tr className="border-b border-white/10 text-zinc-500 uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4 font-bold">Pos</th>
            <th className="py-3 px-4 font-bold">Driver</th>
            <th className="py-3 px-4 font-bold">Team</th>
            <th className="py-3 px-4 font-bold">Q1 Time</th>
            <th className="py-3 px-4 font-bold">Q2 Time</th>
            <th className="py-3 px-4 font-bold">Q3 Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {qualifying.map((q) => (
            <tr key={q.driverId} className="hover:bg-white/3 transition-colors text-zinc-300">
              <td className="py-3 px-4 text-white font-bold">{q.position}</td>
              <td className="py-3 px-4 text-white font-sans font-bold">{q.driverName}</td>
              <td className="py-3 px-4">{q.teamName}</td>
              <td className="py-3 px-4">{q.q1}</td>
              <td className="py-3 px-4">{q.q2 || "-"}</td>
              <td className="py-3 px-4 text-[#E10600] font-bold">{q.q3 || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==================== PRACTICE HUB ====================
interface PracticeHubProps {
  practice: PracticeResult[];
}

export function PracticeHub({ practice }: PracticeHubProps) {
  const [activeSession, setActiveSession] = React.useState<"FP1" | "FP2" | "FP3">("FP1");

  const sessionData = practice.find(p => p.session === activeSession);

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400" />
          Practice Results
        </h3>

        {/* Tab selection */}
        <div className="flex gap-1.5 bg-black p-1 rounded border border-white/5">
          {(["FP1", "FP2", "FP3"] as const).map((sess) => (
            <button
              key={sess}
              onClick={() => setActiveSession(sess)}
              className={`px-3 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                activeSession === sess 
                  ? "bg-[#E10600] text-white" 
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {sess}
            </button>
          ))}
        </div>
      </div>

      {sessionData ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-zinc-500 uppercase tracking-wider text-[9px]">
                <th className="pb-3 px-2">Pos</th>
                <th className="pb-3 px-2">Driver</th>
                <th className="pb-3 px-2">Team</th>
                <th className="pb-3 px-2">Time</th>
                <th className="pb-3 px-2">Laps Run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessionData.results.map((res) => (
                <tr key={res.driverName} className="hover:bg-white/3 text-zinc-300">
                  <td className="py-2.5 px-2 text-white font-bold">{res.position}</td>
                  <td className="py-2.5 px-2 font-sans font-bold text-white">{res.driverName}</td>
                  <td className="py-2.5 px-2 text-zinc-400">{res.teamName}</td>
                  <td className="py-2.5 px-2 font-bold">{res.time}</td>
                  <td className="py-2.5 px-2 text-zinc-500">{res.laps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 text-zinc-500 text-xs font-mono">
          Session data not recorded.
        </div>
      )}
    </div>
  );
}
