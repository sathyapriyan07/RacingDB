/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { HISTORIC_SEASONS } from "../data/f1Data";
import { 
  Clock, Landmark, Award, ShieldAlert, Trophy, List, Plus, 
  Trash, BookOpen, Compass, Layers, Star, Info, ShieldCheck
} from "lucide-react";

interface HistoricalHubsViewProps {
  subView: "timeline" | "hall-of-fame" | "records" | "championships";
  onNavigate: (view: string, params?: any) => void;
}

export default function HistoricalHubsView({ subView, onNavigate }: HistoricalHubsViewProps) {
  const [role, setRole] = useState(store.getRole());
  const [drivers] = useState(store.getDrivers());
  const [customRankings, setCustomRankings] = useState(store.getCustomHallOfFameRankings());

  // Input states for custom HOF rank adding
  const [newHofDriverId, setNewHofDriverId] = useState("");
  const [newHofRank, setNewHofRank] = useState(1);
  const [newHofNote, setNewHofNote] = useState("");

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRole(store.getRole());
      setCustomRankings(store.getCustomHallOfFameRankings());
    });
    return unsub;
  }, []);

  const handleAddCustomRanking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHofDriverId) return;
    store.addHofRanking(newHofDriverId, newHofRank, newHofNote);
    setNewHofNote("");
    setNewHofRank(prev => prev + 1);
  };

  const handleDeleteCustomRanking = (id: string) => {
    store.deleteHofRanking(id);
  };

  // ==================== 1. TIMELINE SUBVIEW ====================
  if (subView === "timeline") {
    return (
      <div className="space-y-8 pb-16">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#E10600]" /> 1950 → Present Seasons Timeline
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Browse world champions, constructors laurels, and defining moments of each key Formula 1 era
          </p>
        </div>

        <div className="space-y-6 relative border-l border-white/10 pl-6 ml-4">
          {HISTORIC_SEASONS.map((season, idx) => (
            <div key={season.year} className="relative group">
              {/* Bullet circle */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-black border-2 border-[#E10600] group-hover:bg-[#E10600] transition-colors" />

              <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5 hover:border-white/10 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <span className="font-display font-black text-xl text-white">
                    {season.year} Season
                  </span>
                  
                  <div className="flex flex-wrap gap-3 font-mono text-[10px] text-zinc-400">
                    <span className="bg-white/5 px-2 py-0.5 rounded flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      Driver: {season.champion}
                    </span>
                    {season.constructor !== "N/A" && (
                      <span className="bg-white/5 px-2 py-0.5 rounded flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-emerald-500" />
                        Team: {season.constructor}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-zinc-300 text-xs font-sans mt-3 leading-relaxed">
                  {season.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== 2. HALL OF FAME SUBVIEW ====================
  if (subView === "hall-of-fame") {
    return (
      <div className="space-y-8 pb-16">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-amber-500" /> All-Time Greatest Hall of Fame
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Browse legendary records and manage custom ranked shortlists of F1 absolute immortals
          </p>
        </div>

        {/* Custom Rankings editor panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Editor block (Only for Users & Admins) */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 shadow-lg h-fit space-y-4">
            <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Plus className="w-4 h-4 text-[#E10600]" /> Create Custom Rankings
            </h3>

            {role === "Guest" ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-400 space-y-2">
                <Info className="w-4 h-4" />
                <p>Guest view limits: switch role to 'User' or 'Admin' at the top right header to submit custom rankings edits.</p>
              </div>
            ) : (
              <form onSubmit={handleAddCustomRanking} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Select Driver</label>
                  <select 
                    value={newHofDriverId}
                    onChange={(e) => setNewHofDriverId(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                    required
                  >
                    <option value="">-- Choose Athlete --</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Rank Position</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={100}
                      value={newHofRank}
                      onChange={(e) => setNewHofRank(Number(e.target.value))}
                      className="w-full bg-[#111] border border-white/10 rounded px-3 py-1.5 text-xs font-mono text-white"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="submit"
                      className="w-full py-1.5 bg-[#E10600] hover:bg-[#ff0700] rounded text-xs font-mono font-bold text-white transition-all cursor-pointer"
                    >
                      Add To Grid
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Curator's Note</label>
                  <textarea 
                    value={newHofNote}
                    onChange={(e) => setNewHofNote(e.target.value)}
                    placeholder="Enter short justification..."
                    rows={2}
                    className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </form>
            )}
          </div>

          {/* List display */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold">
              Ranked Hallway shortlists
            </h3>

            {customRankings.length > 0 ? (
              <div className="space-y-3">
                {customRankings.map((rank) => {
                  const driver = drivers.find(d => d.id === rank.driverId);
                  if (!driver) return null;

                  return (
                    <div 
                      key={rank.id}
                      className="flex items-start justify-between bg-[#0A0A0A] border border-white/5 hover:border-white/10 rounded-lg p-5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        {/* Circle position badge */}
                        <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 text-[#E10600] font-display font-black flex items-center justify-center text-lg">
                          #{rank.rank}
                        </div>

                        <div>
                          <h4 
                            onClick={() => onNavigate("drivers", { driverId: driver.id })}
                            className="font-sans font-bold text-sm text-white hover:text-[#E10600] cursor-pointer transition-colors"
                          >
                            {driver.name}
                          </h4>
                          <p className="text-[10px] font-mono text-zinc-500">{driver.teamName} | GOAT score: {driver.stats.goatScore}/100</p>
                          {rank.note && (
                            <p className="text-zinc-400 text-xs font-sans mt-2 italic leading-relaxed border-l-2 border-white/10 pl-2">
                              "{rank.note}"
                            </p>
                          )}
                        </div>
                      </div>

                      {role !== "Guest" && (
                        <button
                          onClick={() => handleDeleteCustomRanking(rank.id)}
                          className="p-1.5 hover:bg-white/5 hover:text-[#E10600] rounded text-zinc-500 transition-colors"
                          title="Delete from list"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#0A0A0A] border border-white/5 rounded-lg text-zinc-500 text-xs font-mono">
                No rankings listed. Add your first driver using the curator panel on the left!
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // ==================== 3. RECORDS SUBVIEW ====================
  if (subView === "records") {
    const allRecords = [
      { category: "World Championships", leader: "Michael Schumacher / Lewis Hamilton", val: "7 Titles", icon: Award },
      { category: "Grand Prix Wins", leader: "Lewis Hamilton", val: "105 Wins", icon: Trophy },
      { category: "Pole Positions", leader: "Lewis Hamilton", val: "104 Poles", icon: Compass },
      { category: "Fastest Laps", leader: "Michael Schumacher", val: "77 Laps", icon: Clock },
      { category: "Podium Finishes", leader: "Lewis Hamilton", val: "198 Podiums", icon: Trophy },
      { category: "Grand Prix Starts", leader: "Fernando Alonso", val: "395 Starts", icon: Clock }
    ];

    return (
      <div className="space-y-8 pb-16">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-[#E10600]" /> All-Time F1 World Records
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Browse statistically unmatched all-time milestone achievements of the cockpit and pitlane
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allRecords.map((rec, idx) => (
            <div key={idx} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5 flex items-start gap-4 hover:border-[#E10600]/30 transition-colors">
              <div className="p-3 bg-white/3 rounded-lg text-[#E10600]">
                <rec.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-zinc-500 font-mono text-[10px] uppercase leading-none">{rec.category}</p>
                <h3 className="font-display font-black text-white text-base mt-2">{rec.val}</h3>
                <p className="text-zinc-400 text-xs font-sans">{rec.leader}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== 4. CHAMPIONSHIPS battles ====================
  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" /> Historic Championships Battles
        </h1>
        <p className="text-zinc-400 text-xs font-sans mt-1">
          Relive the most dramatic championship deciders and team duels in F1 folklore
        </p>
      </div>

      <div className="space-y-6">
        {[
          { title: "2021: Max Verstappen vs Lewis Hamilton", description: "One of the most intense, continuous generation conflicts in F1 history. Tied on points heading into the Abu Dhabi final showdown, Verstappen overtaken Hamilton on the final lap under controversial safety car settings.", key: "21-battle" },
          { title: "2012: Sebastian Vettel vs Fernando Alonso", description: "Vettel's Red Bull against Alonso's struggling Ferrari. Decided on a chaotic rainy afternoon in Interlagos where Vettel recovered from a first-lap spin to win his 3rd consecutive title by just 3 points.", key: "12-battle" },
          { title: "1976: James Hunt vs Niki Lauda", description: "The legendary clash of character and philosophy. Following Lauda's life-threatening Nürburgring crash, Hunt fought back, leading to a dramatic final rain-soaked duel in Fuji.", key: "76-battle" }
        ].map((bat) => (
          <div key={bat.key} className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
            <h3 className="font-display font-black text-lg text-white group-hover:text-[#E10600] transition-colors mb-2">
              {bat.title}
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              {bat.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
