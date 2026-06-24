/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { Driver } from "../types";
import { DriverCard } from "../components/F1Cards";
import { DriverDNAChart } from "../components/ComparisonCharts";
import { 
  Search, SlidersHorizontal, ChevronLeft, Award, Trophy, 
  Clock, Compass, Sparkles, TrendingUp, Heart, ArrowRightLeft, Landmark
} from "lucide-react";

interface DriversViewProps {
  initialDriverId?: string | null;
  onNavigate: (view: string, params?: any) => void;
}

export default function DriversView({ initialDriverId, onNavigate }: DriversViewProps) {
  const [drivers, setDrivers] = useState(store.getDrivers());
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "retired">("all");

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const freshDrivers = store.getDrivers();
      setDrivers(freshDrivers);
      if (selectedDriver) {
        const updated = freshDrivers.find(d => d.id === selectedDriver.id);
        if (updated) setSelectedDriver(updated);
      }
    });
    return unsub;
  }, [selectedDriver]);

  useEffect(() => {
    if (initialDriverId) {
      const found = drivers.find(d => d.id === initialDriverId);
      if (found) {
        setSelectedDriver(found);
      }
    } else {
      setSelectedDriver(null);
    }
  }, [initialDriverId, drivers]);

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    onNavigate("drivers", { driverId: driver.id });
  };

  const handleBackToExplorer = () => {
    setSelectedDriver(null);
    onNavigate("drivers");
  };

  // Filter list
  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = activeFilter === "all" ? true :
                         activeFilter === "active" ? d.active : !d.active;
    return matchesSearch && matchesActive;
  });

  // Render detail view
  if (selectedDriver) {
    const defaultCompareTarget = drivers.find(d => d.id !== selectedDriver.id) || selectedDriver;

    return (
      <div className="space-y-8 pb-16">
        
        {/* Back navigation */}
        <button
          onClick={handleBackToExplorer}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] hover:bg-[#1c1c1c] border border-white/5 rounded text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Driver Explorer
        </button>

        {/* Cinematic Athlete Hero Banner */}
        <div className="relative rounded-xl overflow-hidden border border-white/5 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-20">
            {/* Driver Image Frame */}
            <div className="aspect-[4/5] overflow-hidden md:col-span-1 border-r border-white/5">
              <img 
                src={selectedDriver.image} 
                alt={selectedDriver.name} 
                className="w-full h-full object-cover filter brightness-90"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Profile specifications */}
            <div className="p-6 md:p-8 md:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-[#E10600] font-bold uppercase tracking-widest bg-[#E10600]/10 px-2 py-0.5 rounded">
                  {selectedDriver.teamName}
                </span>
                <span className="text-zinc-500 text-xs font-mono">#{selectedDriver.number}</span>
                <span className="text-zinc-400 bg-white/5 px-2 py-0.5 rounded text-xs font-mono font-bold uppercase">{selectedDriver.code}</span>
              </div>

              <h1 className="font-display font-black text-3xl md:text-5xl text-white uppercase tracking-tight leading-none">
                {selectedDriver.name}
              </h1>

              <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-zinc-400 pt-1">
                <p>Nationality: <span className="text-white font-bold">{selectedDriver.nationality}</span></p>
                <p>Birth Date: <span className="text-white">{selectedDriver.birthdate}</span></p>
              </div>

              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
                {selectedDriver.bio}
              </p>

              {/* Compare Button */}
              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate("comparisons", { driver1Id: selectedDriver.id, driver2Id: defaultCompareTarget.id })}
                  className="flex items-center gap-2 px-4 py-2 bg-[#E10600] hover:bg-[#ff0700] rounded text-xs font-mono font-bold text-white transition-all cursor-pointer shadow-lg"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" /> Compare this Athlete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Career Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "World Titles", val: selectedDriver.stats.championships, icon: Award, color: "text-amber-500" },
            { label: "Grand Prix Wins", val: selectedDriver.stats.wins, icon: Trophy, color: "text-[#E10600]" },
            { label: "Podiums", val: selectedDriver.stats.podiums, icon: Trophy, color: "text-zinc-300" },
            { label: "Pole Positions", val: selectedDriver.stats.poles, icon: Compass, color: "text-purple-400" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 flex items-center gap-4">
              <div className={`p-2.5 bg-white/5 rounded-md ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase leading-none">{stat.label}</p>
                <p className="font-display font-black text-xl text-white mt-1.5">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DNA Radar Metrics & Career Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Radar Metrics Card */}
          <div className="space-y-4">
            <DriverDNAChart driver1={selectedDriver} driver2={defaultCompareTarget} />
            <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 text-xs font-mono space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider">Driver DNA Analytics</h4>
              <div className="flex justify-between">
                <span>GOAT Score index:</span>
                <span className="text-[#E10600] font-black">{selectedDriver.stats.goatScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Wet Weather Capability:</span>
                <span className="text-white font-bold">{selectedDriver.stats.driverDNA.wetWeather}%</span>
              </div>
              <div className="flex justify-between">
                <span>Consistency Index:</span>
                <span className="text-white font-bold">{selectedDriver.stats.driverDNA.consistency}%</span>
              </div>
            </div>
          </div>

          {/* Timeline & Season History */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-6 shadow-xl space-y-6">
            <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E10600]" />
              Career Progress Timeline
            </h3>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              {selectedDriver.careerTimeline.map((item, idx) => (
                <div key={idx} className="relative pl-6 border-l border-white/10 pb-4">
                  <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-[#E10600]" />
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-bold">{item.year}</span>
                    <span className="text-zinc-500">Standing: P{item.standing}</span>
                  </div>
                  <p className="text-zinc-400 font-sans text-xs mt-1">
                    Represented <span className="text-white font-semibold">{item.team}</span>. Captured {item.wins} wins.
                  </p>
                </div>
              ))}
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
            <Award className="w-6 h-6 text-[#E10600]" /> Driver Explorer
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Browse active superstars and historic legends of the cockpit
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search Drivers, teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#111111] border border-white/5 rounded-md text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#E10600]/50"
            />
          </div>

          {/* Active / All Filter tab */}
          <div className="flex gap-1 bg-white/5 p-1 rounded border border-white/5 text-xs font-mono">
            {(["all", "active", "retired"] as const).map(tab => (
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

      {/* Dynamic Grid list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map(drv => (
            <DriverCard 
              key={drv.id} 
              driver={drv} 
              onClick={() => handleSelectDriver(drv)} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-[#0A0A0A] border border-white/5 rounded-lg text-zinc-500 text-xs font-mono">
            No driver records matched your search query.
          </div>
        )}
      </div>

    </div>
  );
}
