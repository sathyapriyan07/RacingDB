/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { RaceHero } from "../components/RaceDetailsComponents";
import ChampionshipBattle from "../components/ChampionshipBattle";
import { DriverCard, TeamCard, CircuitCard } from "../components/F1Cards";
import { 
  Trophy, Flame, Users, LayoutGrid, Calendar, Compass, 
  BookOpen, Star, AlertCircle, ArrowRight, Sparkles 
} from "lucide-react";

interface HomeViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [articles, setArticles] = useState(store.getArticles());
  const [drivers, setDrivers] = useState(store.getDrivers());
  const [teams, setTeams] = useState(store.getTeams());
  const [circuits, setCircuits] = useState(store.getCircuits());
  const [races, setRaces] = useState(store.getRaces());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setArticles(store.getArticles());
      setDrivers(store.getDrivers());
      setTeams(store.getTeams());
      setCircuits(store.getCircuits());
      setRaces(store.getRaces());
    });
    return unsub;
  }, []);

  // Filter latest or active race
  const activeRace = races.find(r => !r.completed) || races[races.length - 1];
  const lastCompletedRace = [...races].reverse().find(r => r.completed);

  // Filter featured entities
  const featuredDrivers = drivers.filter(d => d.stats.championships > 0).slice(0, 3);
  const activeTeams = teams.filter(t => t.active).slice(0, 3);
  const featuredCircuits = circuits.slice(0, 3);

  // On this day
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  
  // Custom fallback: look for month 6 (June) as pre-seeded in data
  const otdEvents = store.getArticles().slice(0, 1); // latest highlight

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Race Centre Hero Splash */}
      {activeRace && (
        <section id="hero-race-centre" className="animate-fade-in">
          <RaceHero race={activeRace} onNavigate={onNavigate} />
        </section>
      )}

      {/* Hero Sub-Grid (Championship progression & Latest completed result) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Championship Battle Visualizer */}
        <div className="lg:col-span-2">
          <ChampionshipBattle />
        </div>

        {/* Latest Race Result Block */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold">
                Latest GP Winner
              </h3>
            </div>

            {lastCompletedRace ? (
              <div className="space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">Grand Prix</p>
                  <h4 className="font-display font-bold text-white text-base">
                    {lastCompletedRace.name}
                  </h4>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E10600] to-black p-1 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=200&auto=format&fit=crop" 
                      alt="" 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase leading-none">P1 - Podium Leader</p>
                    <p className="font-display font-black text-white text-lg mt-1 uppercase">
                      {lastCompletedRace.results?.[0]?.driverName}
                    </p>
                    <p className="text-zinc-400 text-xs font-mono">
                      {lastCompletedRace.results?.[0]?.teamName}
                    </p>
                  </div>
                </div>

                <div className="bg-[#111111] p-3 rounded border border-white/5 space-y-2 mt-4 text-xs font-mono text-zinc-400">
                  <div className="flex justify-between">
                    <span>Interval Time:</span>
                    <span className="text-white font-bold">{lastCompletedRace.results?.[0]?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grid Position:</span>
                    <span className="text-white">P{lastCompletedRace.results?.[0]?.grid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Championship Pts:</span>
                    <span className="text-[#E10600] font-bold">+{lastCompletedRace.results?.[0]?.points}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-zinc-500 text-xs font-mono">
                No races completed yet in this season.
              </div>
            )}
          </div>

          <button 
            onClick={() => lastCompletedRace && onNavigate("races", { raceId: lastCompletedRace.id })}
            className="w-full mt-6 py-2 bg-white/5 hover:bg-[#E10600]/10 border border-white/5 hover:border-[#E10600]/30 rounded text-xs font-mono font-bold text-zinc-300 hover:text-[#E10600] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Open Full Race Centre <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 2. Premium News & Featured Stories section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#E10600]" />
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight">
              RacingDB F1 Journal
            </h2>
          </div>
          <span className="text-zinc-500 font-mono text-xs hidden sm:inline">
            Curated analysis & broadcast notes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((art) => (
            <div 
              key={art.id}
              className="group bg-[#0A0A0A] hover:bg-[#111111] border border-white/5 hover:border-white/10 rounded-lg overflow-hidden transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={art.imageUrl} 
                  alt={art.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 left-3 bg-[#E10600] text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest">
                  {art.category}
                </span>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500">{art.publishedAt}</span>
                  <h3 className="font-display font-bold text-base text-white group-hover:text-[#E10600] transition-colors mt-1.5 leading-snug line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-zinc-400 text-xs font-sans mt-2 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
                <div className="border-t border-white/5 mt-4 pt-3 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>Author: RACINGDB TEAM</span>
                  <span className="group-hover:text-white transition-colors">Read Analysis →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Athletes and Teams section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-amber-500" />
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight">
              Featured Champions
            </h2>
          </div>
          <button 
            onClick={() => onNavigate("drivers")}
            className="text-xs font-mono font-bold text-zinc-400 hover:text-[#E10600] flex items-center gap-1 transition-colors"
          >
            Explore Drivers <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredDrivers.map(d => (
            <DriverCard 
              key={d.id} 
              driver={d} 
              onClick={() => onNavigate("drivers", { driverId: d.id })} 
            />
          ))}
        </div>
      </section>

      {/* 4. Constructors & Technical Centers */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-5 h-5 text-emerald-500" />
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight">
              Elite Constructors
            </h2>
          </div>
          <button 
            onClick={() => onNavigate("teams")}
            className="text-xs font-mono font-bold text-zinc-400 hover:text-[#E10600] flex items-center gap-1 transition-colors"
          >
            Explore Teams <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTeams.map(t => (
            <TeamCard 
              key={t.id} 
              team={t} 
              onClick={() => onNavigate("teams", { teamId: t.id })} 
            />
          ))}
        </div>
      </section>

      {/* 5. Historical Spotlights and Circuits */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#E10600]" />
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight">
              Iconic Racing Arenas
            </h2>
          </div>
          <button 
            onClick={() => onNavigate("circuits")}
            className="text-xs font-mono font-bold text-zinc-400 hover:text-[#E10600] flex items-center gap-1 transition-colors"
          >
            Explore Circuits <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCircuits.map(c => (
            <CircuitCard 
              key={c.id} 
              circuit={c} 
              onClick={() => onNavigate("circuits", { circuitId: c.id })} 
            />
          ))}
        </div>
      </section>

    </div>
  );
}
