/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { Race } from "../types";
import { 
  RaceHero, RacePodium, StartingGrid, QualifyingTable, PracticeHub 
} from "../components/RaceDetailsComponents";
import { RaceCard } from "../components/F1Cards";
import { 
  Trophy, ChevronLeft, Calendar, Flag, Activity, Clock, ShieldAlert, List, RotateCcw, AlertTriangle 
} from "lucide-react";

interface RacesViewProps {
  initialRaceId?: string | null;
  onNavigate: (view: string, params?: any) => void;
}

export default function RacesView({ initialRaceId, onNavigate }: RacesViewProps) {
  const [races, setRaces] = useState(store.getRaces());
  const [drivers, setDrivers] = useState(store.getDrivers());
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [calendarFilter, setCalendarFilter] = useState<"all" | "completed" | "upcoming">("all");
  const [activeDetailsTab, setActiveDetailsTab] = useState<"results" | "grid" | "qualifying" | "practice" | "pit_stops">("results");

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const freshRaces = store.getRaces();
      setRaces(freshRaces);
      setDrivers(store.getDrivers());
      
      // Sync selected race state if currently viewing details
      if (selectedRace) {
        const updated = freshRaces.find(r => r.id === selectedRace.id);
        if (updated) setSelectedRace(updated);
      }
    });
    return unsub;
  }, [selectedRace]);

  const getDriverImage = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver?.image || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=100&auto=format&fit=crop";
  };

  useEffect(() => {
    if (initialRaceId) {
      const found = races.find(r => r.id === initialRaceId);
      if (found) {
        setSelectedRace(found);
      }
    } else {
      setSelectedRace(null);
    }
  }, [initialRaceId, races]);

  // Filtered calendar list
  const filteredRaces = races.filter(r => {
    if (calendarFilter === "completed") return r.completed;
    if (calendarFilter === "upcoming") return !r.completed;
    return true;
  });

  const handleSelectRace = (race: Race) => {
    setSelectedRace(race);
    onNavigate("races", { raceId: race.id });
  };

  const handleBackToCalendar = () => {
    setSelectedRace(null);
    onNavigate("races");
  };

  if (selectedRace) {
    const isCompleted = selectedRace.completed;

    return (
      <div className="space-y-8 pb-16">
        
        {/* Back navigation */}
        <button
          onClick={handleBackToCalendar}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] hover:bg-[#1c1c1c] border border-white/5 rounded text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Race Calendar
        </button>

        {/* Detailed Race Hero */}
        <RaceHero race={selectedRace} onNavigate={onNavigate} />

        {/* Dynamic Multi-Tab Details Module */}
        {isCompleted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle Column (Tabs) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Tabs list */}
              <div className="flex border-b border-white/10 gap-1 overflow-x-auto pb-px">
                {(["results", "grid", "qualifying", "practice", "pit_stops"] as const).map((tab) => {
                  const labelMap = {
                    results: "Race Results",
                    grid: "Starting Grid",
                    qualifying: "Qualifying",
                    practice: "Practice (FP)",
                    pit_stops: "Pit Stops"
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveDetailsTab(tab)}
                      className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                        activeDetailsTab === tab 
                          ? "border-[#E10600] text-[#E10600]" 
                          : "border-transparent text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {labelMap[tab]}
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 shadow-xl">
                {activeDetailsTab === "results" && selectedRace.results && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/10 text-zinc-500 uppercase tracking-wider text-[10px]">
                          <th className="pb-3 px-2">Pos</th>
                          <th className="pb-3 px-2">Driver</th>
                          <th className="pb-3 px-2">Team</th>
                          <th className="pb-3 px-2">Grid</th>
                          <th className="pb-3 px-2">Interval</th>
                          <th className="pb-3 px-2">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {selectedRace.results.map((res) => (
                          <tr key={res.driverId} className="hover:bg-white/3 text-zinc-300">
                            <td className={`py-3.5 px-2 font-display font-black text-sm ${
                              res.position === 1 ? "text-amber-400" : res.position === 2 ? "text-zinc-300" : res.position === 3 ? "text-amber-800" : "text-white"
                            }`}>
                              {res.position}
                            </td>
                            <td className="py-2.5 px-2 font-sans font-bold text-white flex items-center gap-2.5">
                              <img
                                src={getDriverImage(res.driverId)}
                                alt={res.driverName}
                                referrerPolicy="no-referrer"
                                className="w-[34px] h-[34px] rounded-none object-cover flex-shrink-0"
                              />
                              <span className="flex items-center gap-1.5">
                                {res.driverName}
                                {res.fastestLap && (
                                  <span className="bg-purple-500/20 text-purple-400 text-[8px] font-mono font-bold px-1 py-0.5 rounded uppercase">FL</span>
                                )}
                              </span>
                            </td>
                            <td className="py-3.5 px-2 text-zinc-400">{res.teamName}</td>
                            <td className="py-3.5 px-2">{res.grid}</td>
                            <td className="py-3.5 px-2">{res.time}</td>
                            <td className={`py-3.5 px-2 font-bold ${res.points > 0 ? "text-[#E10600]" : "text-zinc-600"}`}>
                              +{res.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeDetailsTab === "grid" && selectedRace.startingGrid && (
                  <StartingGrid grid={selectedRace.startingGrid} />
                )}

                {activeDetailsTab === "qualifying" && selectedRace.qualifying && (
                  <QualifyingTable qualifying={selectedRace.qualifying} />
                )}

                {activeDetailsTab === "practice" && selectedRace.practice && (
                  <PracticeHub practice={selectedRace.practice} />
                )}

                {activeDetailsTab === "pit_stops" && (
                  <div className="space-y-4">
                    <h4 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-[#E10600]" />
                      Surgical Pit Lane Stops
                    </h4>
                    {selectedRace.pitStops && selectedRace.pitStops.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead>
                            <tr className="border-b border-white/10 text-zinc-500 uppercase tracking-wider text-[10px]">
                              <th className="pb-3 px-2">Lap</th>
                              <th className="pb-3 px-2">Driver</th>
                              <th className="pb-3 px-2">Team</th>
                              <th className="pb-3 px-2">Stop Duration</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {selectedRace.pitStops.map((pit, idx) => (
                              <tr key={idx} className="hover:bg-white/3 text-zinc-300">
                                <td className="py-3 px-2 text-white font-bold">{pit.lap}</td>
                                <td className="py-3 px-2 font-sans font-bold text-white">{pit.driverName}</td>
                                <td className="py-3 px-2 text-zinc-400">{pit.teamName}</td>
                                <td className="py-3 px-2 text-[#E10600] font-bold">{pit.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-zinc-500 font-mono text-xs">
                        No pit lane logs found for this race.
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Right Column: Podium / Dynamic info */}
            <div className="space-y-6">
              {selectedRace.results && (
                <RacePodium results={selectedRace.results} />
              )}

              {/* Race Centre Broadcast notes */}
              <div className="bg-[#111] border border-white/5 rounded-xl p-5 text-xs font-mono space-y-3">
                <h4 className="text-white uppercase font-bold tracking-wider">Race Coordinator Summary</h4>
                <div className="h-px bg-white/5 my-2" />
                <p className="text-zinc-400 font-sans leading-relaxed">
                  Total Race Distance of 53 Laps completed successfully under dry conditions. 
                  Weather parameters: 28°C Ambient, 38°C Track temperature. Zero deployments of the Safety Car.
                </p>
                <div className="pt-2 flex justify-between text-zinc-500">
                  <span>Track Status:</span>
                  <span className="text-emerald-400 font-bold">● DRY TRACK</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-[#0A0A0A] border border-[#E10600]/20 rounded-xl p-8 max-w-2xl mx-auto text-center space-y-6">
            <AlertTriangle className="w-12 h-12 text-[#E10600] mx-auto animate-pulse" />
            <div>
              <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">Race Has Not Started Yet</h3>
              <p className="text-zinc-400 text-xs font-sans mt-2 max-w-md mx-auto leading-relaxed">
                The Formula 1 {selectedRace.name} event is scheduled to broadcast live on {selectedRace.date}. 
                Admins can simulate a live data import in the Admin Dashboard to instantaneously publish results.
              </p>
            </div>
            
            <div className="p-4 bg-white/3 rounded border border-white/5 text-xs font-mono text-left space-y-2">
              <p className="text-zinc-500 uppercase tracking-widest text-[9px]">Event Schedule (Local time)</p>
              <div className="flex justify-between">
                <span>Free Practice 1 (FP1):</span>
                <span className="text-white">Friday 11:30</span>
              </div>
              <div className="flex justify-between">
                <span>Qualifying Shootout:</span>
                <span className="text-white">Saturday 15:00</span>
              </div>
              <div className="flex justify-between">
                <span>Grand Prix Race:</span>
                <span className="text-[#E10600] font-bold">{selectedRace.time} Sunday</span>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
            <Flag className="w-6 h-6 text-[#E10600]" /> Race Calendar
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Immersive Schedule and live telemetry from the 2026 World Championship
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex gap-1 bg-white/5 p-1 rounded border border-white/5">
          {([
            { id: "all", label: "Full Calendar" },
            { id: "completed", label: "Completed" },
            { id: "upcoming", label: "Upcoming" }
          ] as const).map(filter => (
            <button
              key={filter.id}
              onClick={() => setCalendarFilter(filter.id)}
              className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                calendarFilter === filter.id 
                  ? "bg-[#E10600] text-white" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of race calendar cards */}
      <div className="space-y-4">
        {filteredRaces.length > 0 ? (
          filteredRaces.map(race => (
            <RaceCard 
              key={race.id} 
              race={race} 
              onClick={() => handleSelectRace(race)} 
            />
          ))
        ) : (
          <div className="text-center py-12 bg-[#0A0A0A] border border-white/5 rounded-lg text-zinc-500 text-xs font-mono">
            No events found matching current calendar criteria.
          </div>
        )}
      </div>

    </div>
  );
}
