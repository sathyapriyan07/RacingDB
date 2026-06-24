/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { Search, Trophy, Compass, Users, Layers, Flag, ArrowRight } from "lucide-react";

interface SearchViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function SearchView({ onNavigate }: SearchViewProps) {
  const [query, setQuery] = useState("");
  const [drivers] = useState(store.getDrivers());
  const [teams] = useState(store.getTeams());
  const [circuits] = useState(store.getCircuits());
  const [races] = useState(store.getRaces());

  const matchingDrivers = query ? drivers.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) || 
    d.nationality.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const matchingTeams = query ? teams.filter(t => 
    t.fullName.toLowerCase().includes(query.toLowerCase()) || 
    t.nationality.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const matchingCircuits = query ? circuits.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.country.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const matchingRaces = query ? races.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.circuitName.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const hasResults = matchingDrivers.length > 0 || matchingTeams.length > 0 || matchingCircuits.length > 0 || matchingRaces.length > 0;

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-4 pt-4">
        <h1 className="font-display font-black text-3xl md:text-5xl text-white uppercase tracking-tight">
          RacingDB Global Search
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-md mx-auto">
          Query anything inside the F1 Universe—drivers, legendary teams, circuits, and historical championship milestones.
        </p>
      </div>

      {/* Input bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search e.g. Hamilton, Ferrari, Silverstone, Monaco..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E10600]/80 focus:ring-1 focus:ring-[#E10600]/40 shadow-2xl"
          autoFocus
        />
      </div>

      {/* Results lists */}
      {query ? (
        <div className="space-y-6">
          
          {hasResults ? (
            <div className="space-y-6">
              
              {/* Drivers match */}
              {matchingDrivers.length > 0 && (
                <div className="space-y-3 bg-[#0A0A0A] border border-white/5 rounded-xl p-5">
                  <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Users className="w-3.5 h-3.5 text-amber-500" /> Drivers Match ({matchingDrivers.length})
                  </h3>
                  <div className="divide-y divide-white/5">
                    {matchingDrivers.map(d => (
                      <div 
                        key={d.id} 
                        onClick={() => onNavigate("drivers", { driverId: d.id })}
                        className="flex items-center justify-between py-2.5 hover:text-[#E10600] transition-colors cursor-pointer text-xs font-mono"
                      >
                        <span className="font-sans font-bold text-white text-sm">{d.name}</span>
                        <span className="text-zinc-500 flex items-center gap-1">View profile <ArrowRight className="w-3.5 h-3.5" /></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teams match */}
              {matchingTeams.length > 0 && (
                <div className="space-y-3 bg-[#0A0A0A] border border-white/5 rounded-xl p-5">
                  <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Layers className="w-3.5 h-3.5 text-[#E10600]" /> Constructors Match ({matchingTeams.length})
                  </h3>
                  <div className="divide-y divide-white/5">
                    {matchingTeams.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => onNavigate("teams", { teamId: t.id })}
                        className="flex items-center justify-between py-2.5 hover:text-[#E10600] transition-colors cursor-pointer text-xs font-mono"
                      >
                        <span className="font-sans font-bold text-white text-sm">{t.fullName}</span>
                        <span className="text-zinc-500 flex items-center gap-1">Open museum <ArrowRight className="w-3.5 h-3.5" /></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Circuits match */}
              {matchingCircuits.length > 0 && (
                <div className="space-y-3 bg-[#0A0A0A] border border-white/5 rounded-xl p-5">
                  <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Compass className="w-3.5 h-3.5 text-emerald-500" /> Circuits Match ({matchingCircuits.length})
                  </h3>
                  <div className="divide-y divide-white/5">
                    {matchingCircuits.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => onNavigate("circuits", { circuitId: c.id })}
                        className="flex items-center justify-between py-2.5 hover:text-[#E10600] transition-colors cursor-pointer text-xs font-mono"
                      >
                        <span className="font-sans font-bold text-white text-sm">{c.name}</span>
                        <span className="text-zinc-500 flex items-center gap-1">Explore specs <ArrowRight className="w-3.5 h-3.5" /></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Races match */}
              {matchingRaces.length > 0 && (
                <div className="space-y-3 bg-[#0A0A0A] border border-white/5 rounded-xl p-5">
                  <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Flag className="w-3.5 h-3.5 text-[#E10600]" /> GP Races Match ({matchingRaces.length})
                  </h3>
                  <div className="divide-y divide-white/5">
                    {matchingRaces.map(r => (
                      <div 
                        key={r.id} 
                        onClick={() => onNavigate("races", { raceId: r.id })}
                        className="flex items-center justify-between py-2.5 hover:text-[#E10600] transition-colors cursor-pointer text-xs font-mono"
                      >
                        <span className="font-sans font-bold text-white text-sm">{r.name}</span>
                        <span className="text-zinc-500 flex items-center gap-1">Open Race Centre <ArrowRight className="w-3.5 h-3.5" /></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-10 bg-[#0A0A0A] border border-white/5 rounded-lg text-zinc-500 text-xs font-mono">
              No matching records found for "{query}".
            </div>
          )}

        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-center pt-4">
          <div className="bg-white/3 p-4 border border-white/5 rounded-lg text-xs font-mono text-zinc-500">
            Type keyword to search
          </div>
          <div className="bg-white/3 p-4 border border-white/5 rounded-lg text-xs font-mono text-zinc-500">
            Instant search updates
          </div>
        </div>
      )}

    </div>
  );
}
