/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { Team } from "../types";
import { TeamCard } from "../components/F1Cards";
import { TeamStrengthsChart } from "../components/ComparisonCharts";
import { 
  Search, ChevronLeft, Layers, Trophy, Shield, 
  Clock, Award, ArrowRightLeft, Landmark, Users 
} from "lucide-react";

interface TeamsViewProps {
  initialTeamId?: string | null;
  onNavigate: (view: string, params?: any) => void;
}

export default function TeamsView({ initialTeamId, onNavigate }: TeamsViewProps) {
  const [teams, setTeams] = useState(store.getTeams());
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "historic">("all");

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const freshTeams = store.getTeams();
      setTeams(freshTeams);
      if (selectedTeam) {
        const updated = freshTeams.find(t => t.id === selectedTeam.id);
        if (updated) setSelectedTeam(updated);
      }
    });
    return unsub;
  }, [selectedTeam]);

  useEffect(() => {
    if (initialTeamId) {
      const found = teams.find(t => t.id === initialTeamId);
      if (found) {
        setSelectedTeam(found);
      }
    } else {
      setSelectedTeam(null);
    }
  }, [initialTeamId, teams]);

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    onNavigate("teams", { teamId: team.id });
  };

  const handleBackToMuseum = () => {
    setSelectedTeam(null);
    onNavigate("teams");
  };

  // Filter list
  const filteredTeams = teams.filter(t => {
    const matchesSearch = t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.nationality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = activeFilter === "all" ? true :
                         activeFilter === "active" ? t.active : !t.active;
    return matchesSearch && matchesActive;
  });

  if (selectedTeam) {
    const defaultCompareTarget = teams.find(t => t.id !== selectedTeam.id) || selectedTeam;

    return (
      <div className="space-y-8 pb-16">
        
        {/* Back navigation */}
        <button
          onClick={handleBackToMuseum}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] hover:bg-[#1c1c1c] border border-white/5 rounded text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Team Museum
        </button>

        {/* Team Museum Hero Header */}
        <div className="relative rounded-xl overflow-hidden border border-white/5 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
          
          <div className="relative aspect-[21/9] w-full max-h-[340px] overflow-hidden">
            <img 
              src={selectedTeam.banner} 
              alt={selectedTeam.name} 
              className="w-full h-full object-cover filter brightness-75"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-20 p-6 md:p-8 -mt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-black border border-white/10 rounded-xl p-3 shadow-2xl flex items-center justify-center overflow-hidden">
                <img src={selectedTeam.logo} alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-mono text-xs text-[#E10600] uppercase font-bold tracking-widest">{selectedTeam.nationality}</span>
                <h1 className="font-display font-black text-2xl md:text-4xl text-white uppercase mt-1 tracking-tight leading-none">
                  {selectedTeam.fullName}
                </h1>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onNavigate("comparisons", { team1Id: selectedTeam.id, team2Id: defaultCompareTarget.id })}
                className="flex items-center gap-2 px-4 py-2 bg-[#E10600] hover:bg-[#ff0700] rounded text-xs font-mono font-bold text-white transition-all cursor-pointer shadow-lg"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> Compare Constructor
              </button>
            </div>
          </div>
        </div>

        {/* Brief Overview Bio */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
          <p className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed">
            {selectedTeam.bio}
          </p>
        </div>

        {/* Big numbers row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Constructors Titles", val: selectedTeam.stats.championships, color: "text-amber-500" },
            { label: "Grand Prix Wins", val: selectedTeam.stats.wins, color: "text-[#E10600]" },
            { label: "Poles Achieved", val: selectedTeam.stats.poles, color: "text-purple-400" },
            { label: "Total Podiums", val: selectedTeam.stats.podiums, color: "text-zinc-300" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5">
              <p className="text-[10px] font-mono text-zinc-500 uppercase leading-none">{stat.label}</p>
              <p className={`font-display font-black text-2xl mt-2 ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Analytics and Hall of fame list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Legacy Strength chart */}
          <div className="space-y-4">
            <TeamStrengthsChart team1={selectedTeam} team2={defaultCompareTarget} />
            <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 text-xs font-mono space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider">Historical Metadata</h4>
              <div className="flex justify-between">
                <span>Team Legacy Rating:</span>
                <span className="text-[#E10600] font-black">{selectedTeam.stats.legacyScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Total Starts Logged:</span>
                <span className="text-white font-bold">{selectedTeam.stats.starts} Grand Prix</span>
              </div>
            </div>
          </div>

          {/* Greatest drivers and Livery evolution */}
          <div className="space-y-6">
            
            {/* Greatest Drivers card */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 shadow-lg">
              <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-amber-500" />
                Greatest Drivers Archive
              </h3>
              <div className="space-y-3">
                {selectedTeam.greatestDrivers.map((drv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/3 rounded border border-white/5 text-xs font-mono">
                    <div>
                      <p className="text-white font-bold font-sans">{drv.name}</p>
                      <p className="text-zinc-500 text-[10px] mt-0.5">Hall of Fame Hallway</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-500 font-bold">{drv.championships} Titles</p>
                      <p className="text-zinc-400 text-[10px]">{drv.wins} GP Wins</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Livery Evolution timeline */}
            {selectedTeam.liveryEvolution.length > 0 && (
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 shadow-lg">
                <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Livery & Car Evolution
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedTeam.liveryEvolution.map((liv, idx) => (
                    <div key={idx} className="bg-black rounded border border-white/5 overflow-hidden text-center">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={liv.imageUrl} alt="" className="w-full h-full object-cover filter brightness-90" />
                      </div>
                      <div className="p-2 text-[10px] font-mono">
                        <p className="text-white font-bold">{liv.name}</p>
                        <p className="text-zinc-500 text-[9px] mt-0.5">{liv.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Principals / Engines checklist */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 space-y-4">
              <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                Leadership & Engine History
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <p className="text-zinc-500 uppercase text-[9px] mb-2 font-bold">Principals</p>
                  <ul className="space-y-1 text-zinc-300">
                    {selectedTeam.principals.map((p, idx) => (
                      <li key={idx} className="truncate">
                        {p.name} <span className="text-zinc-500 text-[9px]">({p.period})</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-zinc-500 uppercase text-[9px] mb-2 font-bold">Engine Supplier</p>
                  <ul className="space-y-1 text-zinc-300">
                    {selectedTeam.engines.map((e, idx) => (
                      <li key={idx} className="truncate">
                        {e.name} <span className="text-zinc-500 text-[9px]">({e.period})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#E10600]" /> Constructor Museum
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Immersive archives of legacy engineering and iconic constructors
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search Constructors, Engines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#111111] border border-white/5 rounded-md text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#E10600]/50"
            />
          </div>

          {/* Active / All filter */}
          <div className="flex gap-1 bg-white/5 p-1 rounded border border-white/5 text-xs font-mono">
            {(["all", "active", "historic"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded font-bold uppercase transition-all ${
                  activeFilter === tab ? "bg-[#E10600] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTeams.length > 0 ? (
          filteredTeams.map(team => (
            <TeamCard 
              key={team.id} 
              team={team} 
              onClick={() => handleSelectTeam(team)} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-[#0A0A0A] border border-white/5 rounded-lg text-zinc-500 text-xs font-mono">
            No constructor records matched your search query.
          </div>
        )}
      </div>

    </div>
  );
}
