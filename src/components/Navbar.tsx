/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { store } from "../data/store";
import { 
  Tv, Flag, Users, Compass, Award, Search, Clock, 
  Calendar, Layers, Shield, ChevronDown, UserCheck, Menu, X, Landmark,
  User, LogIn
} from "lucide-react";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [role, setRole] = useState(store.getRole());
  const [currentUserEmail, setCurrentUserEmail] = useState(store.getCurrentUserEmail());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRole(store.getRole());
      setCurrentUserEmail(store.getCurrentUserEmail());
    });
    return unsub;
  }, []);

  const navItems = [
    { id: "home", label: "Season Hub", icon: Tv },
    { id: "races", label: "Races", icon: Flag },
    { id: "drivers", label: "Drivers", icon: Users },
    { id: "teams", label: "Teams", icon: Layers },
    { id: "circuits", label: "Circuits", icon: Compass },
    { id: "standings", label: "Standings", icon: Award },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "rivalries", label: "Rivalries", icon: Users },
    { id: "on-this-day", label: "On This Day", icon: Calendar },
    { id: "search", label: "Search", icon: Search }
  ];

  const secondaryNavItems = [
    { id: "hall-of-fame", label: "Hall of Fame", icon: Landmark },
    { id: "records", label: "Records" },
    { id: "comparisons", label: "Compare" },
    { id: "championships", label: "Championships" },
    { id: "greatest-cars", label: "Greatest Cars" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#000000]/95 border-b border-white/5 backdrop-blur-md">
      {/* Top Ticker / Broadcast bar */}
      <div className="bg-[#E10600] text-black py-1 px-4 text-xs font-mono font-bold tracking-widest text-center flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
        <span>● RACINGDB LIVE LIVE LIVE</span>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:inline">2026 FORMULA 1 CHAMPIONSHIP BATTLE INTENSIFIES</span>
        <span>|</span>
        <span>NEXT RACE: FORMULA 1 BRITISH GRAND PRIX - SILVERSTONE</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate("home")} 
            className="flex items-center gap-2 cursor-pointer group"
            id="nav-logo"
          >
            <span className="bg-[#E10600] text-white px-2 py-0.5 rounded font-display font-black text-xl italic tracking-tighter group-hover:scale-105 transition-transform">
              RACING
            </span>
            <span className="font-display font-extrabold text-lg tracking-widest text-white group-hover:text-[#E10600] transition-colors">
              DB
            </span>
          </div>

          {/* Desktop Primary Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive 
                      ? "text-[#E10600] bg-white/5 font-extrabold" 
                      : "text-zinc-400 hover:text-white hover:bg-white/3"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Secondary Views Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-md text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                <span>Archives & Lab</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-[#111111] border border-white/10 rounded-md shadow-2xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                {secondaryNavItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="w-full text-left px-4 py-2 text-xs font-mono text-zinc-400 hover:text-[#E10600] hover:bg-white/5 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Indicator Badge (Read-Only) */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-white/5 rounded-md text-xs font-mono text-zinc-400">
              <Shield className={`w-3.5 h-3.5 ${role === "Admin" ? "text-[#E10600]" : "text-zinc-500"}`} />
              <span className="font-medium text-zinc-500">Role:</span>
              <span className={`font-bold uppercase ${role === "Admin" ? "text-white" : "text-zinc-400"}`}>{role}</span>
            </div>

            {/* Admin shortcut icon */}
            {role === "Admin" && (
              <button
                id="admin-nav-btn"
                onClick={() => onNavigate("admin")}
                className={`p-2 rounded-md transition-all ${
                  currentView === "admin" 
                    ? "bg-[#E10600]/20 text-[#E10600] border border-[#E10600]/30" 
                    : "bg-[#111111] hover:bg-[#222] text-zinc-400 hover:text-white border border-white/5"
                }`}
                title="Admin Panel"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}

            {/* Auth Button */}
            <button
              id="nav-login-btn"
              onClick={() => onNavigate("login")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase transition-all duration-200 border ${
                currentView === "login"
                  ? "bg-[#E10600]/20 text-[#E10600] border-[#E10600]/30"
                  : currentUserEmail
                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
                    : "bg-[#E10600] hover:bg-[#ff0700] text-white border-transparent"
              }`}
              title={currentUserEmail ? `Logged in as ${currentUserEmail}` : "Login to Paddock"}
            >
              {currentUserEmail ? (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[80px] truncate">{currentUserEmail.split('@')[0]}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Quick mobile role change indicator */}
            <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono border border-white/5 text-zinc-300">
              Role: <span className="font-bold text-white">{role}</span>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-md bg-white/5 border border-white/5"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0A] border-t border-white/5 max-h-[85vh] overflow-y-auto pb-6">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-mono font-bold uppercase tracking-wider transition-all ${
                    isActive 
                      ? "text-white bg-[#E10600] font-extrabold" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            <div className="border-t border-white/5 my-3 pt-3">
              <p className="px-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Archives & Insights</p>
              {secondaryNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

             {role === "Admin" && (
              <div className="border-t border-white/5 my-3 pt-3 px-4">
                <button
                  onClick={() => {
                    onNavigate("admin");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#E10600]/10 border border-[#E10600]/30 hover:bg-[#E10600]/20 rounded text-xs font-mono font-bold text-[#E10600] uppercase tracking-wider transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 animate-pulse" />
                  Launch Admin Console
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
