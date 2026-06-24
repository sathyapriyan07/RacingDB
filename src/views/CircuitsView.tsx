/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { Circuit } from "../types";
import { CircuitCard } from "../components/F1Cards";
import { 
  Compass, ChevronLeft, Map, Timer, Settings, Landmark, Shield, Clock, Search 
} from "lucide-react";

interface CircuitsViewProps {
  initialCircuitId?: string | null;
  onNavigate: (view: string, params?: any) => void;
}

export default function CircuitsView({ initialCircuitId, onNavigate }: CircuitsViewProps) {
  const [circuits, setCircuits] = useState(store.getCircuits());
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const freshCircuits = store.getCircuits();
      setCircuits(freshCircuits);
      if (selectedCircuit) {
        const updated = freshCircuits.find(c => c.id === selectedCircuit.id);
        if (updated) setSelectedCircuit(updated);
      }
    });
    return unsub;
  }, [selectedCircuit]);

  useEffect(() => {
    if (initialCircuitId) {
      const found = circuits.find(c => c.id === initialCircuitId);
      if (found) {
        setSelectedCircuit(found);
      }
    } else {
      setSelectedCircuit(null);
    }
  }, [initialCircuitId, circuits]);

  const handleSelectCircuit = (circuit: Circuit) => {
    setSelectedCircuit(circuit);
    onNavigate("circuits", { circuitId: circuit.id });
  };

  const handleBackToExplorer = () => {
    setSelectedCircuit(null);
    onNavigate("circuits");
  };

  const filteredCircuits = circuits.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedCircuit) {
    const specs = selectedCircuit.specs;

    return (
      <div className="space-y-8 pb-16">
        
        {/* Back navigation */}
        <button
          onClick={handleBackToExplorer}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] hover:bg-[#1c1c1c] border border-white/5 rounded text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Circuit Explorer
        </button>

        {/* Scenic header */}
        <div className="relative rounded-xl overflow-hidden border border-white/5 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          
          <div className="relative aspect-[21/9] w-full max-h-[300px] overflow-hidden">
            <img 
              src={selectedCircuit.image} 
              alt={selectedCircuit.name} 
              className="w-full h-full object-cover filter brightness-75"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-[#E10600] font-bold uppercase tracking-widest bg-[#E10600]/10 px-2 py-0.5 rounded">
                {selectedCircuit.location}, {selectedCircuit.country}
              </span>
              <h1 className="font-display font-black text-2xl md:text-4xl text-white uppercase mt-2 tracking-tight leading-none">
                {selectedCircuit.name}
              </h1>
            </div>

            {/* Prestige Score rating badges */}
            <div className="flex gap-4 font-mono text-xs text-zinc-400">
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase">Prestige Score</p>
                <p className="font-display font-black text-white text-base mt-1">{specs.prestigeScore}/100</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase">Difficulty Index</p>
                <p className="font-display font-black text-[#E10600] text-base mt-1">{specs.difficultyIndex}/10</p>
              </div>
            </div>
          </div>
        </div>

        {/* History and Track geometry overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Technical Specs box */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#E10600]" />
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-white/3 p-3 rounded border border-white/5">
                  <p className="text-zinc-500 text-[10px] uppercase">Track Length</p>
                  <p className="text-white font-bold text-sm mt-1">{specs.length}</p>
                </div>
                <div className="bg-white/3 p-3 rounded border border-white/5">
                  <p className="text-zinc-500 text-[10px] uppercase">Turns Count</p>
                  <p className="text-white font-bold text-sm mt-1">{specs.turns} Corners</p>
                </div>
                <div className="bg-white/3 p-3 rounded border border-white/5">
                  <p className="text-zinc-500 text-[10px] uppercase">Grandstand Capacity</p>
                  <p className="text-white font-bold text-sm mt-1">{specs.capacity}</p>
                </div>
                <div className="bg-white/3 p-3 rounded border border-white/5">
                  <p className="text-zinc-500 text-[10px] uppercase">Lap Record</p>
                  <p className="text-[#E10600] font-bold text-xs mt-1 truncate" title={specs.lapRecord.driver}>
                    {specs.lapRecord.time} ({specs.lapRecord.driver})
                  </p>
                </div>
              </div>
            </div>

            {/* Encyclopedia / History text */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Landmark className="w-4 h-4 text-amber-500" />
                Track History & Legacy
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed">
                {selectedCircuit.history}
              </p>
            </div>

            {/* Historical winners archive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Most successful drivers */}
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 shadow-lg">
                <h4 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-3">
                  Most Successful Drivers
                </h4>
                <div className="space-y-2">
                  {selectedCircuit.mostSuccessfulDrivers.map((drv, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-mono text-zinc-400 border-b border-white/5 pb-2">
                      <span className="text-white font-semibold">{drv.name}</span>
                      <span className="text-[#E10600] font-bold">{drv.wins} Wins</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most successful teams */}
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 shadow-lg">
                <h4 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-3">
                  Most Successful Teams
                </h4>
                <div className="space-y-2">
                  {selectedCircuit.mostSuccessfulTeams.map((team, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-mono text-zinc-400 border-b border-white/5 pb-2">
                      <span className="text-white font-semibold">{team.name}</span>
                      <span className="text-purple-400 font-bold">{team.wins} Wins</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Sidebar Geometry shape and Timeline */}
          <div className="space-y-6">
            
            {/* Track Layout Map Canvas */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 text-center flex flex-col items-center shadow-lg">
              <p className="text-zinc-500 font-mono text-[10px] uppercase mb-4 tracking-wider">Telemetry Track Geometry Shape</p>
              
              <div className="w-48 h-48 bg-black/60 border border-white/5 rounded-xl flex items-center justify-center p-4">
                <svg className="w-full h-full stroke-[#E10600] stroke-[4] fill-none drop-shadow-[0_0_15px_rgba(225,6,0,0.4)]" viewBox="0 0 300 150">
                  <path d={selectedCircuit.trackMap} />
                </svg>
              </div>

              {/* Dynamic stats list */}
              <div className="w-full grid grid-cols-2 gap-4 mt-6 text-left border-t border-white/5 pt-4 text-xs font-mono">
                <div>
                  <p className="text-zinc-500 uppercase text-[9px]">Speed Characteristic:</p>
                  <p className="text-white font-bold">{specs.characteristics.speed}/100</p>
                </div>
                <div>
                  <p className="text-zinc-500 uppercase text-[9px]">Flow Characteristic:</p>
                  <p className="text-white font-bold">{specs.characteristics.flow}/100</p>
                </div>
                <div>
                  <p className="text-zinc-500 uppercase text-[9px]">Overtaking Rating:</p>
                  <p className="text-emerald-400 font-bold">{specs.characteristics.overtaking}/100</p>
                </div>
                <div>
                  <p className="text-zinc-500 uppercase text-[9px]">Technical Difficulty:</p>
                  <p className="text-purple-400 font-bold">{specs.characteristics.tech}/100</p>
                </div>
              </div>
            </div>

            {/* Timeline moment events */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 shadow-lg">
              <h4 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-500" />
                Milestone Moments
              </h4>
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                {selectedCircuit.timeline.map((evt, idx) => (
                  <div key={idx} className="border-l border-[#E10600] pl-3 text-xs">
                    <p className="font-mono font-bold text-white">{evt.year}</p>
                    <p className="font-sans text-zinc-400 mt-0.5 leading-relaxed">{evt.event}</p>
                  </div>
                ))}
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
            <Compass className="w-6 h-6 text-[#E10600]" /> Circuit Encyclopedia
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Browse track geometry shapes, telemetry specs, prestige scores, and historical milestones
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search Circuits, Countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#111111] border border-white/5 rounded-md text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#E10600]/50"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCircuits.length > 0 ? (
          filteredCircuits.map(circuit => (
            <CircuitCard 
              key={circuit.id} 
              circuit={circuit} 
              onClick={() => handleSelectCircuit(circuit)} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-[#0A0A0A] border border-white/5 rounded-lg text-zinc-500 text-xs font-mono">
            No circuit records matched your search query.
          </div>
        )}
      </div>

    </div>
  );
}
