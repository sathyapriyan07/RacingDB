/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { store } from "../data/store";
import { Flag, Mail, ExternalLink, Github } from "lucide-react";

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "Season Hub", view: "home" },
    { label: "Race Centre", view: "races" },
    { label: "Driver Profiles", view: "drivers" },
    { label: "Team Museum", view: "teams" },
    { label: "Circuit Encyclopedia", view: "circuits" },
    { label: "Standings Tracker", view: "standings" }
  ];

  const historicalLinks = [
    { label: "1950 → Present Timeline", view: "timeline" },
    { label: "Championship Battles", view: "championships" },
    { label: "Hall of Fame Rankings", view: "hall-of-fame" },
    { label: "On This Day in F1", view: "on-this-day" },
    { label: "Greatest Cars of All Time", view: "greatest-cars" },
    { label: "Iconic Driver Rivalries", view: "rivalries" }
  ];

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-12 pb-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* About Section */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#E10600] text-white px-2 py-0.5 rounded font-display font-black text-xl italic tracking-tighter">
              RACING
            </span>
            <span className="font-display font-extrabold text-lg tracking-widest text-white">
              DB
            </span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
            RacingDB is the definitive premium interactive Formula 1 universe. Built for racing purists and discovery alike, integrating immersive visual statistics, complete historic records, live race simulator tools, and high-fidelity archival search.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Connected to Supabase & Jolpica API
            </span>
          </div>
        </div>

        {/* Directory Links */}
        <div>
          <h4 className="text-white text-xs font-mono uppercase tracking-widest font-bold mb-4 border-l-2 border-[#E10600] pl-2">
            Directory
          </h4>
          <ul className="space-y-2 text-xs">
            {links.map((link) => (
              <li key={link.view}>
                <button
                  onClick={() => onNavigate(link.view)}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-left font-sans"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Historical Archives */}
        <div>
          <h4 className="text-white text-xs font-mono uppercase tracking-widest font-bold mb-4 border-l-2 border-[#E10600] pl-2">
            Archives
          </h4>
          <ul className="space-y-2 text-xs">
            {historicalLinks.map((link) => (
              <li key={link.view}>
                <button
                  onClick={() => onNavigate(link.view)}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-left font-sans"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-600">
        <p>© {currentYear} RACINGDB UNIVERSE. Created for Formula 1 fans worldwide.</p>
        <p className="max-w-md text-center sm:text-right leading-relaxed">
          Disclaimer: This platform is an unofficial fan project and is in no way affiliated with Formula 1, FIA, or any of their associated entities. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX, and related marks are trademarks of Formula One Licensing B.V.
        </p>
      </div>
    </footer>
  );
}
