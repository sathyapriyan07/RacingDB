/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Driver, Team, Circuit } from "../types";
import { store } from "../data/store";
import { Sparkles, BarChart2, ShieldAlert } from "lucide-react";

// ==================== DRIVER DNA RADAR CHART ====================
interface DriverComparisonChartProps {
  driver1: Driver;
  driver2: Driver;
}

export function DriverDNAChart({ driver1, driver2 }: DriverComparisonChartProps) {
  const data = [
    {
      subject: "Aggression",
      [driver1.name]: driver1.stats.driverDNA.aggression,
      [driver2.name]: driver2.stats.driverDNA.aggression,
      fullMark: 100
    },
    {
      subject: "Consistency",
      [driver1.name]: driver1.stats.driverDNA.consistency,
      [driver2.name]: driver2.stats.driverDNA.consistency,
      fullMark: 100
    },
    {
      subject: "Racecraft",
      [driver1.name]: driver1.stats.driverDNA.racecraft,
      [driver2.name]: driver2.stats.driverDNA.racecraft,
      fullMark: 100
    },
    {
      subject: "Qualifying",
      [driver1.name]: driver1.stats.driverDNA.qualifying,
      [driver2.name]: driver2.stats.driverDNA.qualifying,
      fullMark: 100
    },
    {
      subject: "Wet Weather",
      [driver1.name]: driver1.stats.driverDNA.wetWeather,
      [driver2.name]: driver2.stats.driverDNA.wetWeather,
      fullMark: 100
    }
  ];

  return (
    <div className="bg-[#111111] border border-white/5 rounded-lg p-5">
      <h4 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        Driver DNA Radar Metrics
      </h4>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#A1A1AA", fontSize: 10, fontFamily: "monospace" }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#666" }} />
            
            <Radar
              name={driver1.name}
              dataKey={driver1.name}
              stroke="#E10600"
              fill="#E10600"
              fillOpacity={0.25}
            />
            <Radar
              name={driver2.name}
              dataKey={driver2.name}
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.25}
            />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace", paddingTop: 10 }} />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12, borderRadius: 6 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ==================== STATS HEAD TO HEAD CHART ====================
export function DriverCareerStatsChart({ driver1, driver2 }: DriverComparisonChartProps) {
  const data = [
    {
      name: "Championships",
      [driver1.name]: driver1.stats.championships,
      [driver2.name]: driver2.stats.championships
    },
    {
      name: "Wins (scaled)",
      [driver1.name]: Math.round(driver1.stats.wins / 5),
      [driver2.name]: Math.round(driver2.stats.wins / 5)
    },
    {
      name: "Poles (scaled)",
      [driver1.name]: Math.round(driver1.stats.poles / 5),
      [driver2.name]: Math.round(driver2.stats.poles / 5)
    },
    {
      name: "Podiums (scaled)",
      [driver1.name]: Math.round(driver1.stats.podiums / 10),
      [driver2.name]: Math.round(driver2.stats.podiums / 10)
    }
  ];

  return (
    <div className="bg-[#111111] border border-white/5 rounded-lg p-5">
      <h4 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-[#E10600]" />
        Stat Scaled Breakdown (Championships vs OTHERS)
      </h4>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 10, fontFamily: "monospace" }} />
            <YAxis tick={{ fill: "#666", fontSize: 10 }} />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
            <Bar dataKey={driver1.name} fill="#E10600" radius={[4, 4, 0, 0]} />
            <Bar dataKey={driver2.name} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ==================== TEAM STRENGTHS BAR CHART ====================
interface TeamComparisonProps {
  team1: Team;
  team2: Team;
}

export function TeamStrengthsChart({ team1, team2 }: TeamComparisonProps) {
  const data = [
    {
      metric: "Legacy Score",
      [team1.name]: team1.stats.legacyScore,
      [team2.name]: team2.stats.legacyScore
    },
    {
      metric: "Championships (x5)",
      [team1.name]: team1.stats.championships * 5,
      [team2.name]: team2.stats.championships * 5
    },
    {
      metric: "Wins (scaled /2)",
      [team1.name]: Math.round(team1.stats.wins / 2),
      [team2.name]: Math.round(team2.stats.wins / 2)
    },
    {
      metric: "Poles (scaled /2)",
      [team1.name]: Math.round(team1.stats.poles / 2),
      [team2.name]: Math.round(team2.stats.poles / 2)
    }
  ];

  return (
    <div className="bg-[#111111] border border-white/5 rounded-lg p-5">
      <h4 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-emerald-500" />
        Constructor Legacy Comparison
      </h4>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="metric" tick={{ fill: "#A1A1AA", fontSize: 10, fontFamily: "monospace" }} />
            <YAxis tick={{ fill: "#666", fontSize: 10 }} />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
            <Bar dataKey={team1.name} fill="#E10600" radius={[4, 4, 0, 0]} />
            <Bar dataKey={team2.name} fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
