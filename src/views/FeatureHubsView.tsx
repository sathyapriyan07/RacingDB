/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { DriverDNAChart, DriverCareerStatsChart, TeamStrengthsChart } from "../components/ComparisonCharts";
import { HISTORIC_SEASONS, RIVALRIES, GREATEST_CARS, ON_THIS_DAY_EVENTS } from "../data/f1Data";
import { 
  Users, Layers, Compass, ArrowRightLeft, Calendar, Clock, 
  Trophy, Settings, Flame, Landmark, Activity, Heart, ArrowRight, Shield 
} from "lucide-react";

interface FeatureHubsViewProps {
  subView: "comparisons" | "rivalries" | "on-this-day" | "greatest-cars" | "race-archive";
  params?: any;
  onNavigate: (view: string, params?: any) => void;
}

export default function FeatureHubsView({ subView, params, onNavigate }: FeatureHubsViewProps) {
  const [drivers] = useState(store.getDrivers());
  const [teams] = useState(store.getTeams());
  const [circuits] = useState(store.getCircuits());
  const [races] = useState(store.getRaces());

  // Comparative dropdown selections
  const [compDriver1Id, setCompDriver1Id] = useState(params?.driver1Id || "hamilton");
  const [compDriver2Id, setCompDriver2Id] = useState(params?.driver2Id || "verstappen");
  
  const [compTeam1Id, setCompTeam1Id] = useState(params?.team1Id || "ferrari");
  const [compTeam2Id, setCompTeam2Id] = useState(params?.team2Id || "mclaren");

  const [activeComparisonTab, setActiveComparisonTab] = useState<"drivers" | "teams">("drivers");

  // On this day selector - let's default to current date
  const [otdMonth, setOtdMonth] = useState(6);
  const [otdDay, setOtdDay] = useState(24);

  const compDriver1 = drivers.find(d => d.id === compDriver1Id) || drivers[0];
  const compDriver2 = drivers.find(d => d.id === compDriver2Id) || drivers[1];

  const compTeam1 = teams.find(t => t.id === compTeam1Id) || teams[0];
  const compTeam2 = teams.find(t => t.id === compTeam2Id) || teams[1];

  // ==================== 1. COMPARISONS VIEW ====================
  if (subView === "comparisons") {
    return (
      <div className="space-y-8 pb-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
              <ArrowRightLeft className="w-6 h-6 text-[#E10600]" /> Visual Comparison Lab
            </h1>
            <p className="text-zinc-400 text-xs font-sans mt-1">
              Select any driver, team, or circuit for a head-to-head performance analytics comparison
            </p>
          </div>

          <div className="flex bg-white/5 p-1 rounded border border-white/5 text-xs font-mono">
            {(["drivers", "teams"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveComparisonTab(tab)}
                className={`px-3 py-1 rounded font-bold uppercase transition-all ${
                  activeComparisonTab === tab ? "bg-[#E10600] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab === "drivers" ? "Compare Drivers" : "Compare Constructors"}
              </button>
            ))}
          </div>
        </div>

        {activeComparisonTab === "drivers" ? (
          <div className="space-y-8">
            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Driver 1 (Left)</label>
                <select 
                  value={compDriver1Id}
                  onChange={(e) => setCompDriver1Id(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Driver 2 (Right)</label>
                <select 
                  value={compDriver2Id}
                  onChange={(e) => setCompDriver2Id(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.id} disabled={d.id === compDriver1Id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Charts comparison rendering */}
            {compDriver1 && compDriver2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DriverDNAChart driver1={compDriver1} driver2={compDriver2} />
                <DriverCareerStatsChart driver1={compDriver1} driver2={compDriver2} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Constructor 1</label>
                <select 
                  value={compTeam1Id}
                  onChange={(e) => setCompTeam1Id(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Constructor 2</label>
                <select 
                  value={compTeam2Id}
                  onChange={(e) => setCompTeam2Id(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id} disabled={t.id === compTeam1Id}>{t.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Team Strengths */}
            {compTeam1 && compTeam2 && (
              <div className="max-w-4xl mx-auto">
                <TeamStrengthsChart team1={compTeam1} team2={compTeam2} />
              </div>
            )}
          </div>
        )}

      </div>
    );
  }

  // ==================== 2. RIVALRIES VIEW ====================
  if (subView === "rivalries") {
    return (
      <div className="space-y-8 pb-16">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#E10600]" /> Legendary Driver Rivalries
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Re-evaluate the historic, fierce psychological duels that defined racing generations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RIVALRIES.map((rival) => (
            <div 
              key={rival.id}
              className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden hover:border-[#E10600]/30 transition-colors"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={rival.image} alt="" className="w-full h-full object-cover filter brightness-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="font-mono text-xs text-[#E10600] uppercase font-bold tracking-widest">{rival.subtitle}</span>
                  <h3 className="font-display font-black text-xl text-white mt-1 uppercase">{rival.title}</h3>
                </div>

                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                  {rival.summary}
                </p>

                {/* Performance stats Head-To-Head list */}
                <div className="border-t border-white/5 pt-4 mt-4 space-y-2.5">
                  <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Metrics Head-to-Head</p>
                  {rival.stats.map((metric, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-500">{metric.metric}</span>
                      <div className="flex gap-4">
                        <span className="text-white font-bold">{metric.d1Value}</span>
                        <span className="text-zinc-600">vs</span>
                        <span className="text-white font-bold">{metric.d2Value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== 3. ON THIS DAY ====================
  if (subView === "on-this-day") {
    // Filter events matching active selected day & month
    const matchingEvents = ON_THIS_DAY_EVENTS.filter(e => e.month === otdMonth && e.day === otdDay);

    return (
      <div className="space-y-8 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-amber-500" /> On This Day In F1 History
            </h1>
            <p className="text-zinc-400 text-xs font-sans mt-1">
              Select any date of the year to discover historic milestones, GP wins, or birthdays of racing legends
            </p>
          </div>

          {/* Date Selector form */}
          <div className="flex gap-3 text-xs font-mono text-zinc-400">
            <div>
              <label className="block text-[9px] text-zinc-500 mb-1">Month</label>
              <select 
                value={otdMonth} 
                onChange={(e) => setOtdMonth(Number(e.target.value))}
                className="bg-[#111] border border-white/10 rounded px-2 py-1 text-white"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i+1} value={i+1}>{new Date(2020, i).toLocaleString("default", { month: "long" })}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[9px] text-zinc-500 mb-1">Day</label>
              <select 
                value={otdDay} 
                onChange={(e) => setOtdDay(Number(e.target.value))}
                className="bg-[#111] border border-white/10 rounded px-2 py-1 text-white"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* List of matches */}
        <div className="max-w-3xl mx-auto space-y-6">
          {matchingEvents.length > 0 ? (
            matchingEvents.map((evt) => (
              <div 
                key={evt.id}
                className="bg-[#0A0A0A] border border-white/5 hover:border-[#E10600]/20 rounded-xl p-6 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    evt.type === "win" ? "bg-[#E10600] text-white" : "bg-purple-500/10 text-purple-400"
                  }`}>
                    {evt.type}
                  </span>
                  <span className="font-display font-black text-lg text-zinc-500">{evt.year}</span>
                </div>

                <h3 className="font-display font-black text-xl text-white uppercase">{evt.title}</h3>
                <p className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed">
                  {evt.description}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[#0A0A0A] border border-white/5 rounded-xl text-zinc-500 text-xs font-mono space-y-2">
              <p>No major recorded events for June {otdDay} in our database.</p>
              <p className="text-[10px] text-zinc-600">Try choosing June 23 or June 24 to explore historic milestones!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== 4. GREATEST CARS ====================
  if (subView === "greatest-cars") {
    return (
      <div className="space-y-8 pb-16">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" /> Greatest F1 Cars Ever Built
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Browse engineering specs, legendary designer notes, and achievements of cars that broke all records
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GREATEST_CARS.map((car) => (
            <div 
              key={car.id}
              className="bg-[#0A0A0A] border border-white/5 hover:border-[#E10600]/30 rounded-xl overflow-hidden flex flex-col justify-between h-full transition-colors"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={car.image} alt="" className="w-full h-full object-cover filter brightness-90" />
                <span className="absolute bottom-3 left-3 bg-[#E10600] text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                  {car.year} Season
                </span>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-zinc-500 font-mono text-[9px] uppercase">{car.teamName}</p>
                  <h3 className="font-display font-black text-lg text-white mt-1 uppercase leading-none">{car.name}</h3>
                  <p className="text-zinc-400 text-xs font-sans mt-3 line-clamp-3 leading-relaxed">
                    {car.description}
                  </p>
                </div>

                {/* Specs */}
                <div className="border-t border-white/5 pt-4 space-y-2 text-[10px] font-mono text-zinc-400">
                  <p className="text-zinc-500 font-bold uppercase tracking-wider text-[8px] mb-2">Engine Specs & Design</p>
                  <div className="flex justify-between">
                    <span>Power output:</span>
                    <span className="text-white font-bold">{car.specs.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engine Type:</span>
                    <span className="text-white">{car.specs.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Design Lead:</span>
                    <span className="text-white truncate max-w-[120px]">{car.specs.designer}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== 5. RACE ARCHIVE ====================
  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[#E10600]" /> Formula 1 Historic Race Archive
        </h1>
        <p className="text-zinc-400 text-xs font-sans mt-1">
          Complete winners, podium pole sitters, and fastest lap recordings of completed Grand Prix events
        </p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-white/1 uppercase text-[10px] text-zinc-500">
                <th className="py-3 px-4 font-bold">Round</th>
                <th className="py-3 px-4 font-bold">Grand Prix Name</th>
                <th className="py-3 px-4 font-bold">Venue / Location</th>
                <th className="py-3 px-4 font-bold">Date Held</th>
                <th className="py-3 px-4 font-bold">Winner</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {races.filter(r => r.completed).map((race) => (
                <tr key={race.id} className="hover:bg-white/3 transition-colors">
                  <td className="py-3.5 px-4 text-white font-bold">{race.round}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-white">{race.name}</td>
                  <td className="py-3.5 px-4">{race.circuitName}</td>
                  <td className="py-3.5 px-4 text-zinc-500">{race.date}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    {race.results?.[0]?.driverName || "N/A"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => onNavigate("races", { raceId: race.id })}
                      className="text-xs font-mono font-bold text-[#E10600] hover:underline"
                    >
                      Race Centre →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
