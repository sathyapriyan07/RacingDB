/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeView from "./views/HomeView";
import RacesView from "./views/RacesView";
import DriversView from "./views/DriversView";
import TeamsView from "./views/TeamsView";
import CircuitsView from "./views/CircuitsView";
import StandingsView from "./views/StandingsView";
import HistoricalHubsView from "./views/HistoricalHubsView";
import FeatureHubsView from "./views/FeatureHubsView";
import SearchView from "./views/SearchView";
import AdminView from "./views/AdminView";
import LoginView from "./views/LoginView";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [viewParams, setViewParams] = useState<any>(null);

  // Sync address hash with custom views for natural back/forward navigation or refresh safety
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (!hash) {
        setCurrentView("home");
        setViewParams(null);
        return;
      }

      // Parse hash e.g. races?raceId=silverstone or drivers?driverId=hamilton
      const [view, queryStr] = hash.split("?");
      setCurrentView(view || "home");

      if (queryStr) {
        const params: any = {};
        const searchParams = new URLSearchParams(queryStr);
        searchParams.forEach((val, key) => {
          params[key] = val;
        });
        setViewParams(params);
      } else {
        setViewParams(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Trigger on mount
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleNavigate = (view: string, params?: any) => {
    let hash = view;
    if (params) {
      const queryStr = new URLSearchParams(params).toString();
      hash += `?${queryStr}`;
    }
    window.location.hash = hash;
  };

  // Main views routing matrix
  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <HomeView onNavigate={handleNavigate} />;
      
      case "races":
        return (
          <RacesView 
            initialRaceId={viewParams?.raceId} 
            onNavigate={handleNavigate} 
          />
        );
      
      case "drivers":
        return (
          <DriversView 
            initialDriverId={viewParams?.driverId} 
            onNavigate={handleNavigate} 
          />
        );
      
      case "teams":
        return (
          <TeamsView 
            initialTeamId={viewParams?.teamId} 
            onNavigate={handleNavigate} 
          />
        );
      
      case "circuits":
        return (
          <CircuitsView 
            initialCircuitId={viewParams?.circuitId} 
            onNavigate={handleNavigate} 
          />
        );
      
      case "standings":
        return <StandingsView onNavigate={handleNavigate} />;
      
      case "timeline":
        return (
          <HistoricalHubsView 
            subView="timeline" 
            onNavigate={handleNavigate} 
          />
        );
      
      case "hall-of-fame":
        return (
          <HistoricalHubsView 
            subView="hall-of-fame" 
            onNavigate={handleNavigate} 
          />
        );
      
      case "records":
        return (
          <HistoricalHubsView 
            subView="records" 
            onNavigate={handleNavigate} 
          />
        );
      
      case "championships":
        return (
          <HistoricalHubsView 
            subView="championships" 
            onNavigate={handleNavigate} 
          />
        );
      
      case "comparisons":
        return (
          <FeatureHubsView 
            subView="comparisons" 
            params={viewParams}
            onNavigate={handleNavigate} 
          />
        );
      
      case "rivalries":
        return (
          <FeatureHubsView 
            subView="rivalries" 
            onNavigate={handleNavigate} 
          />
        );
      
      case "on-this-day":
        return (
          <FeatureHubsView 
            subView="on-this-day" 
            onNavigate={handleNavigate} 
          />
        );
      
      case "greatest-cars":
        return (
          <FeatureHubsView 
            subView="greatest-cars" 
            onNavigate={handleNavigate} 
          />
        );
      
      case "race-archive":
        return (
          <FeatureHubsView 
            subView="race-archive" 
            onNavigate={handleNavigate} 
          />
        );
      
      case "search":
        return <SearchView onNavigate={handleNavigate} />;
      
      case "admin":
        return <AdminView onNavigate={handleNavigate} />;

      case "login":
        return <LoginView onNavigate={handleNavigate} />;

      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#E10600] selection:text-white">
      
      {/* Header Navigation with Global and sub-elements */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main content body canvas */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (viewParams ? JSON.stringify(viewParams) : "")}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Broadcast themed Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
