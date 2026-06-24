/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Driver, Team, Circuit, Race } from "../types";
import { Flag, Trophy, Landmark, Timer, Compass, Map, User, Users } from "lucide-react";

// ==================== DRIVER CARD ====================
interface DriverCardProps {
  driver: Driver;
  onClick: () => void;
  key?: React.Key;
}

export function DriverCard({ driver, onClick }: DriverCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#111111] hover:bg-[#161616] border border-white/5 hover:border-[#E10600]/30 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full"
      id={`driver-card-${driver.id}`}
    >
      {/* Background Accent Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

      {/* Driver Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={driver.image} 
          alt={driver.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
          referrerPolicy="no-referrer"
        />
        {/* Driver Number Badge */}
        <div className="absolute top-3 right-3 z-20 font-display font-black text-3xl italic text-white/20 group-hover:text-[#E10600]/40 transition-colors">
          #{driver.number}
        </div>
        {/* Active / Retired Tag */}
        <div className="absolute top-3 left-3 z-20">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
            driver.active 
              ? "bg-[#E10600] text-white" 
              : "bg-zinc-700 text-zinc-300"
          }`}>
            {driver.active ? "Active" : "Retired"}
          </span>
        </div>
      </div>

      {/* Driver Info */}
      <div className="relative p-5 z-20 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
              {driver.nationality}
            </span>
            <span className="font-mono text-xs font-bold text-white bg-white/5 px-1.5 py-0.5 rounded">
              {driver.code}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-white group-hover:text-[#E10600] transition-colors leading-tight">
            {driver.name}
          </h3>
          <p className="text-zinc-500 text-xs font-mono mt-1">
            {driver.teamName}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/5 mt-4 pt-3 text-center">
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Titles</p>
            <p className="font-display font-black text-sm text-white">{driver.stats.championships || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Wins</p>
            <p className="font-display font-black text-sm text-[#E10600]">{driver.stats.wins}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Podiums</p>
            <p className="font-display font-black text-sm text-white">{driver.stats.podiums}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TEAM CARD ====================
interface TeamCardProps {
  team: Team;
  onClick: () => void;
  key?: React.Key;
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#111111] hover:bg-[#161616] border border-white/5 hover:border-[#E10600]/30 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full"
      id={`team-card-${team.id}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

      {/* Banner / Livery Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={team.banner} 
          alt={team.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75 group-hover:brightness-90"
          referrerPolicy="no-referrer"
        />
        {/* Team Logo Overlay */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 p-1 backdrop-blur-md overflow-hidden">
            <img src={team.logo} alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Team Details */}
      <div className="relative p-5 z-20 flex-grow flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] text-[#E10600] uppercase tracking-widest font-bold">
            {team.nationality}
          </span>
          <h3 className="font-display font-black text-lg text-white group-hover:text-[#E10600] transition-colors mt-0.5 leading-snug">
            {team.fullName}
          </h3>
          <p className="text-zinc-400 text-xs mt-2 line-clamp-2">
            {team.bio}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 mt-4 pt-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-mono text-zinc-500 uppercase leading-none">Championships</p>
              <p className="font-display font-bold text-xs text-white mt-1">{team.stats.championships} Titles</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-[#E10600] flex-shrink-0" />
            <div>
              <p className="text-[9px] font-mono text-zinc-500 uppercase leading-none">GP Wins</p>
              <p className="font-display font-bold text-xs text-white mt-1">{team.stats.wins} Wins</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== CIRCUIT CARD ====================
interface CircuitCardProps {
  circuit: Circuit;
  onClick: () => void;
  key?: React.Key;
}

export function CircuitCard({ circuit, onClick }: CircuitCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#111111] hover:bg-[#161616] border border-white/5 hover:border-[#E10600]/30 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full"
      id={`circuit-card-${circuit.id}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

      {/* Circuit Scenic Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={circuit.image} 
          alt={circuit.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75 group-hover:brightness-90"
          referrerPolicy="no-referrer"
        />
        {/* Track Map Shape Overlay */}
        <div className="absolute bottom-3 right-3 z-20 w-16 h-16 bg-black/40 backdrop-blur-md border border-white/10 rounded-md p-1.5 flex items-center justify-center">
          <svg className="w-full h-full stroke-white stroke-[2.5] fill-none" viewBox="0 0 300 150">
            <path d={circuit.trackMap} />
          </svg>
        </div>
      </div>

      {/* Circuit Info */}
      <div className="relative p-5 z-20 flex-grow flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
            {circuit.location}, {circuit.country}
          </span>
          <h3 className="font-display font-extrabold text-base text-white group-hover:text-[#E10600] transition-colors mt-0.5 leading-snug">
            {circuit.name}
          </h3>
          <p className="text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {circuit.history}
          </p>
        </div>

        {/* Technical spec chips */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-zinc-400">
          <span className="bg-white/5 px-2 py-0.5 rounded flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#E10600]" />
            {circuit.specs.length}
          </span>
          <span className="bg-white/5 px-2 py-0.5 rounded flex items-center gap-1">
            <Map className="w-3 h-3 text-emerald-500" />
            {circuit.specs.turns} Turns
          </span>
          <span className="bg-white/5 px-2 py-0.5 rounded">
            Prestige: {circuit.specs.prestigeScore}/100
          </span>
        </div>
      </div>
    </div>
  );
}

// ==================== RACE CARD ====================
interface RaceCardProps {
  race: Race;
  onClick: () => void;
  key?: React.Key;
}

export function RaceCard({ race, onClick }: RaceCardProps) {
  const isCompleted = race.completed;

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-[#111111] hover:bg-[#161616] border rounded-lg overflow-hidden transition-all duration-300 cursor-pointer p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isCompleted ? "border-white/5 hover:border-[#E10600]/30" : "border-[#E10600]/20 hover:border-[#E10600]/50"
      }`}
      id={`race-card-${race.id}`}
    >
      {/* Race Left Profile */}
      <div className="flex items-center gap-4">
        {/* Round Badge */}
        <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/5 flex flex-col items-center justify-center font-mono">
          <span className="text-[10px] text-zinc-500 uppercase font-bold">RND</span>
          <span className="text-lg font-display font-black text-white">{race.round}</span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">{race.date}</span>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold ${
              isCompleted ? "bg-zinc-800 text-zinc-400" : "bg-[#E10600] text-white animate-pulse-glow"
            }`}>
              {isCompleted ? "Completed" : "Upcoming"}
            </span>
          </div>
          <h3 className="font-display font-bold text-base text-white group-hover:text-[#E10600] transition-colors">
            {race.name}
          </h3>
          <p className="text-zinc-500 text-xs font-mono mt-0.5">{race.circuitName}</p>
        </div>
      </div>

      {/* Race Right Profile - Winner or Event Details */}
      <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
        {isCompleted && race.results && race.results[0] ? (
          <div className="text-left md:text-right">
            <p className="text-[9px] font-mono text-zinc-500 uppercase leading-none">WINNER</p>
            <p className="font-display font-black text-sm text-white mt-1 flex items-center md:justify-end gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              {race.results[0].driverName}
            </p>
            <p className="text-[10px] font-mono text-zinc-400">{race.results[0].teamName}</p>
          </div>
        ) : (
          <div className="text-left md:text-right">
            <p className="text-[9px] font-mono text-zinc-500 uppercase leading-none">BROADCAST SCHEDULE</p>
            <p className="font-display font-bold text-xs text-white mt-1 flex items-center md:justify-end gap-1.5">
              <Timer className="w-3.5 h-3.5 text-[#E10600]" />
              {race.time} Local
            </p>
            <p className="text-[10px] font-mono text-zinc-400">ESPN / Sky Sports F1</p>
          </div>
        )}
      </div>
    </div>
  );
}
