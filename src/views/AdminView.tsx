/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { store } from "../data/store";
import { SUPABASE_SETUP_SQL, isSupabaseConfigured } from "../lib/supabase";
import { 
  Database, Plus, Trash, AlertCircle, RefreshCcw, 
  BookOpen, Layers, ShieldCheck, Check, Sparkles, Terminal,
  Copy, Upload, Info, ExternalLink, FileCode, CheckCircle2,
  Edit, MapPin, Users, User, Calendar, Award, Search, Flag
} from "lucide-react";

export default function AdminView({ onNavigate }: { onNavigate?: (view: string, params?: any) => void }) {
  const [role, setRole] = useState(store.getRole());
  const [articles, setArticles] = useState(store.getArticles());
  const [importStatus, setImportStatus] = useState(store.getImportStatus());
  const [supabaseStatus, setSupabaseStatus] = useState(store.getSupabaseStatus());
  const [activeTab, setActiveTab] = useState<"journal" | "schema" | "storage" | "datasets">("journal");

  // F1 datasets reactive states
  const [drivers, setDrivers] = useState(store.getDrivers());
  const [teams, setTeams] = useState(store.getTeams());
  const [circuits, setCircuits] = useState(store.getCircuits());
  const [races, setRaces] = useState(store.getRaces());

  // Dataset manager specific states
  const [activeDataset, setActiveDataset] = useState<"drivers" | "teams" | "circuits" | "races">("drivers");
  const [datasetSearch, setDatasetSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isEditingDataset, setIsEditingDataset] = useState(false);
  const [isCreatingDataset, setIsCreatingDataset] = useState(false);

  // Sub-form states
  const [driverForm, setDriverForm] = useState({
    id: "",
    name: "",
    fullName: "",
    code: "",
    number: "",
    nationality: "",
    teamId: "",
    teamName: "",
    image: "",
    birthdate: "",
    bio: "",
    active: true,
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    starts: 0,
    points: 0,
    fastestLaps: 0,
    goatScore: 50
  });

  const [teamForm, setTeamForm] = useState({
    id: "",
    name: "",
    fullName: "",
    nationality: "",
    logo: "",
    banner: "",
    active: true,
    bio: "",
    championships: 0,
    wins: 0,
    poles: 0,
    podiums: 0,
    starts: 0,
    legacyScore: 50
  });

  const [circuitForm, setCircuitForm] = useState({
    id: "",
    name: "",
    location: "",
    country: "",
    image: "",
    trackMap: "",
    history: "",
    length: "5.0 km",
    turns: 15,
    capacity: "100,000",
    prestigeScore: 50,
    difficultyIndex: 5
  });

  const [raceForm, setRaceForm] = useState({
    id: "",
    name: "",
    round: 1,
    circuitId: "",
    circuitName: "",
    date: "",
    time: "",
    completed: false,
    championshipImpact: "",
    winnerId: "",
    driverOfTheDayId: ""
  });

  // Form states
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"news" | "analysis" | "opinion" | "historical">("news");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop");
  const [featured, setFeatured] = useState(false);

  // Storage bucket states
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard state
  const [copied, setCopied] = useState(false);

  // Jolpica selected import type
  const [selectedImportTab, setSelectedImportTab] = useState<"season" | "races" | "drivers" | "teams" | "circuits" | "results" | "sprint results" | "qualifying" | "sprint qualifying" | "pitstops" | "bulk">("bulk");
  const [importYear, setImportYear] = useState(new Date().getFullYear().toString());

  // Status logs
  const [logs, setLogs] = useState<string[]>([
    "RacingDB PostgreSQL connection: initialized.",
    isSupabaseConfigured 
      ? "Supabase Realtime Sync: active on 'f1-assets' & tables." 
      : "Supabase Connection: standing by (local storage cache enabled).",
    "Jolpica API Mirror client: standby."
  ]);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRole(store.getRole());
      setArticles(store.getArticles());
      setImportStatus(store.getImportStatus());
      setSupabaseStatus(store.getSupabaseStatus());
      setDrivers(store.getDrivers());
      setTeams(store.getTeams());
      setCircuits(store.getCircuits());
      setRaces(store.getRaces());
    });
    return unsub;
  }, []);

  const addLog = (text: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev.slice(0, 10)]);
  };

  const handleSimulateImport = async (type: string = "bulk") => {
    const year = importYear.trim() || new Date().getFullYear().toString();
    addLog(`Triggering Jolpica API sync for [${type.toUpperCase()}] season ${year}...`);

    // Safety fallback — if importing state gets stuck for 15s, force-reset it
    const stuckTimer = setTimeout(() => {
      if (store.getImportStatus().isImporting) {
        store.forceResetImport();
        addLog("⚠️ Import safety timeout triggered — state force-reset.");
      }
    }, 15000);

    await store.simulateJolpicaImport(type, year);
    clearTimeout(stuckTimer);

    addLog(`Successfully processed Jolpica F1 [${type.toUpperCase()}] season ${year} synchronization step.`);
    addLog("Championship standings & cache refreshed.");
  };

  // Handler helpers for Driver CRUD
  const handleEditDriver = (driver: any) => {
    setDriverForm({
      id: driver.id,
      name: driver.name || "",
      fullName: driver.fullName || "",
      code: driver.code || "",
      number: driver.number || "",
      nationality: driver.nationality || "",
      teamId: driver.teamId || "",
      teamName: driver.teamName || "",
      image: driver.image || "",
      birthdate: driver.birthdate || "",
      bio: driver.bio || "",
      active: driver.active !== false,
      championships: driver.stats?.championships || 0,
      wins: driver.stats?.wins || 0,
      podiums: driver.stats?.podiums || 0,
      poles: driver.stats?.poles || 0,
      starts: driver.stats?.starts || 0,
      points: driver.stats?.points || 0,
      fastestLaps: driver.stats?.fastestLaps || 0,
      goatScore: driver.stats?.goatScore || 50
    });
    setSelectedItem(driver);
    setIsEditingDataset(true);
    setIsCreatingDataset(false);
  };

  const handleCreateNewDriver = () => {
    setDriverForm({
      id: "driver-" + Date.now(),
      name: "",
      fullName: "",
      code: "",
      number: "",
      nationality: "",
      teamId: "mclaren",
      teamName: "McLaren F1 Team",
      image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600&auto=format&fit=crop",
      birthdate: "1997-01-01",
      bio: "",
      active: true,
      championships: 0,
      wins: 0,
      podiums: 0,
      poles: 0,
      starts: 0,
      points: 0,
      fastestLaps: 0,
      goatScore: 50
    });
    setSelectedItem(null);
    setIsEditingDataset(false);
    setIsCreatingDataset(true);
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: driverForm.id,
      name: driverForm.name,
      fullName: driverForm.fullName,
      code: driverForm.code,
      number: driverForm.number,
      nationality: driverForm.nationality,
      teamId: driverForm.teamId,
      teamName: driverForm.teamName,
      image: driverForm.image,
      birthdate: driverForm.birthdate,
      bio: driverForm.bio,
      active: driverForm.active,
      stats: {
        championships: Number(driverForm.championships),
        wins: Number(driverForm.wins),
        podiums: Number(driverForm.podiums),
        poles: Number(driverForm.poles),
        starts: Number(driverForm.starts),
        points: Number(driverForm.points),
        fastestLaps: Number(driverForm.fastestLaps),
        goatScore: Number(driverForm.goatScore),
        driverDNA: selectedItem?.stats?.driverDNA || {
          aggression: 75,
          consistency: 80,
          racecraft: 82,
          qualifying: 78,
          wetWeather: 70
        }
      },
      careerTimeline: selectedItem?.careerTimeline || [],
      mediaGallery: selectedItem?.mediaGallery || []
    };

    if (isCreatingDataset) {
      store.addDriver(payload);
      addLog(`Created driver row: "${driverForm.name}"`);
    } else {
      store.updateDriver(driverForm.id, payload);
      addLog(`Updated driver row: "${driverForm.name}"`);
    }
    setIsEditingDataset(false);
    setIsCreatingDataset(false);
  };

  const handleDeleteDriver = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete driver ${name}?`)) {
      store.deleteDriver(id);
      addLog(`Deleted driver row: "${name}"`);
    }
  };

  // Handler helpers for Team CRUD
  const handleEditTeam = (team: any) => {
    setTeamForm({
      id: team.id,
      name: team.name || "",
      fullName: team.fullName || "",
      nationality: team.nationality || "",
      logo: team.logo || "",
      banner: team.banner || "",
      active: team.active !== false,
      bio: team.bio || "",
      championships: team.stats?.championships || 0,
      wins: team.stats?.wins || 0,
      poles: team.stats?.poles || 0,
      podiums: team.stats?.podiums || 0,
      starts: team.stats?.starts || 0,
      legacyScore: team.stats?.legacyScore || 50
    });
    setSelectedItem(team);
    setIsEditingDataset(true);
    setIsCreatingDataset(false);
  };

  const handleCreateNewTeam = () => {
    setTeamForm({
      id: "team-" + Date.now(),
      name: "",
      fullName: "",
      nationality: "",
      logo: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop",
      banner: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600&auto=format&fit=crop",
      active: true,
      bio: "",
      championships: 0,
      wins: 0,
      poles: 0,
      podiums: 0,
      starts: 0,
      legacyScore: 50
    });
    setSelectedItem(null);
    setIsEditingDataset(false);
    setIsCreatingDataset(true);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: teamForm.id,
      name: teamForm.name,
      fullName: teamForm.fullName,
      nationality: teamForm.nationality,
      logo: teamForm.logo,
      banner: teamForm.banner,
      active: teamForm.active,
      bio: teamForm.bio,
      stats: {
        championships: Number(teamForm.championships),
        wins: Number(teamForm.wins),
        poles: Number(teamForm.poles),
        podiums: Number(teamForm.podiums),
        starts: Number(teamForm.starts),
        legacyScore: Number(teamForm.legacyScore)
      },
      currentDrivers: selectedItem?.currentDrivers || [],
      principals: selectedItem?.principals || [],
      engines: selectedItem?.engines || [],
      liveryEvolution: selectedItem?.liveryEvolution || [],
      greatestDrivers: selectedItem?.greatestDrivers || []
    };

    if (isCreatingDataset) {
      store.addTeam(payload);
      addLog(`Created team row: "${teamForm.name}"`);
    } else {
      store.updateTeam(teamForm.id, payload);
      addLog(`Updated team row: "${teamForm.name}"`);
    }
    setIsEditingDataset(false);
    setIsCreatingDataset(false);
  };

  const handleDeleteTeam = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete team ${name}?`)) {
      store.deleteTeam(id);
      addLog(`Deleted team row: "${name}"`);
    }
  };

  // Handler helpers for Circuit CRUD
  const handleEditCircuit = (circuit: any) => {
    setCircuitForm({
      id: circuit.id,
      name: circuit.name || "",
      location: circuit.location || "",
      country: circuit.country || "",
      image: circuit.image || "",
      trackMap: circuit.trackMap || "",
      history: circuit.history || "",
      length: circuit.specs?.length || "5.0 km",
      turns: circuit.specs?.turns || 15,
      capacity: circuit.specs?.capacity || "100,000",
      prestigeScore: circuit.specs?.prestigeScore || 50,
      difficultyIndex: circuit.specs?.difficultyIndex || 5
    });
    setSelectedItem(circuit);
    setIsEditingDataset(true);
    setIsCreatingDataset(false);
  };

  const handleCreateNewCircuit = () => {
    setCircuitForm({
      id: "circuit-" + Date.now(),
      name: "",
      location: "",
      country: "",
      image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600&auto=format&fit=crop",
      trackMap: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600&auto=format&fit=crop",
      history: "",
      length: "5.0 km",
      turns: 15,
      capacity: "100,000",
      prestigeScore: 50,
      difficultyIndex: 5
    });
    setSelectedItem(null);
    setIsEditingDataset(false);
    setIsCreatingDataset(true);
  };

  const handleSaveCircuit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: circuitForm.id,
      name: circuitForm.name,
      location: circuitForm.location,
      country: circuitForm.country,
      image: circuitForm.image,
      trackMap: circuitForm.trackMap,
      history: circuitForm.history,
      specs: {
        length: circuitForm.length,
        turns: Number(circuitForm.turns),
        capacity: circuitForm.capacity,
        prestigeScore: Number(circuitForm.prestigeScore),
        difficultyIndex: Number(circuitForm.difficultyIndex),
        characteristics: selectedItem?.specs?.characteristics || { flow: 70, speed: 75, tech: 65, overtaking: 60 },
        lapRecord: selectedItem?.specs?.lapRecord || { time: "1:30.000", driver: "Lewis Hamilton", year: 2020 }
      },
      mostSuccessfulDrivers: selectedItem?.mostSuccessfulDrivers || [],
      mostSuccessfulTeams: selectedItem?.mostSuccessfulTeams || [],
      timeline: selectedItem?.timeline || []
    };

    if (isCreatingDataset) {
      store.addCircuit(payload);
      addLog(`Created circuit row: "${circuitForm.name}"`);
    } else {
      store.updateCircuit(circuitForm.id, payload);
      addLog(`Updated circuit row: "${circuitForm.name}"`);
    }
    setIsEditingDataset(false);
    setIsCreatingDataset(false);
  };

  const handleDeleteCircuit = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete circuit ${name}?`)) {
      store.deleteCircuit(id);
      addLog(`Deleted circuit row: "${name}"`);
    }
  };

  // Handler helpers for Race CRUD
  const handleEditRace = (race: any) => {
    setRaceForm({
      id: race.id,
      name: race.name || "",
      round: race.round || 1,
      circuitId: race.circuitId || "",
      circuitName: race.circuitName || "",
      date: race.date || "",
      time: race.time || "",
      completed: race.completed || false,
      championshipImpact: race.championshipImpact || "",
      winnerId: race.winnerId || "",
      driverOfTheDayId: race.driverOfTheDayId || ""
    });
    setSelectedItem(race);
    setIsEditingDataset(true);
    setIsCreatingDataset(false);
  };

  const handleCreateNewRace = () => {
    setRaceForm({
      id: "race-" + Date.now(),
      name: "",
      round: races.length + 1,
      circuitId: circuits[0]?.id || "",
      circuitName: circuits[0]?.name || "",
      date: new Date().toISOString().split("T")[0],
      time: "14:00",
      completed: false,
      championshipImpact: "",
      winnerId: "",
      driverOfTheDayId: ""
    });
    setSelectedItem(null);
    setIsEditingDataset(false);
    setIsCreatingDataset(true);
  };

  const handleSaveRace = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: raceForm.id,
      name: raceForm.name,
      round: Number(raceForm.round),
      circuitId: raceForm.circuitId,
      circuitName: circuits.find(c => c.id === raceForm.circuitId)?.name || raceForm.circuitName || "Custom Circuit",
      date: raceForm.date,
      time: raceForm.time,
      completed: raceForm.completed,
      championshipImpact: raceForm.championshipImpact,
      winnerId: raceForm.winnerId,
      driverOfTheDayId: raceForm.driverOfTheDayId,
      results: selectedItem?.results || [],
      startingGrid: selectedItem?.startingGrid || [],
      qualifying: selectedItem?.qualifying || [],
      practice: selectedItem?.practice || [],
      pitStops: selectedItem?.pitStops || [],
      timeline: selectedItem?.timeline || [],
      fastestLap: selectedItem?.fastestLap || { driverId: "", driverName: "", time: "" }
    };

    if (isCreatingDataset) {
      store.addRace(payload);
      addLog(`Created race row: "${raceForm.name}"`);
    } else {
      store.updateRace(raceForm.id, payload);
      addLog(`Updated race row: "${raceForm.name}"`);
    }
    setIsEditingDataset(false);
    setIsCreatingDataset(false);
  };

  const handleDeleteRace = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete race ${name}?`)) {
      store.deleteRace(id);
      addLog(`Deleted race row: "${name}"`);
    }
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    store.addArticle({
      title,
      summary,
      content,
      category,
      imageUrl,
      featured
    });

    setTitle("");
    setSummary("");
    setContent("");
    setFeatured(false);
    
    addLog(`Published new article: "${title.substring(0, 30)}..."`);
  };

  const handleDeleteArticle = (id: string) => {
    store.deleteArticle(id);
    addLog("Deleted article from Supabase journal table.");
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    addLog("Copied Supabase SQL setup script to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setUploadedUrl(null);
    addLog(`Initiating storage upload for "${file.name}"...`);

    try {
      const url = await store.uploadAsset(file);
      setUploadedUrl(url);
      setImageUrl(url); // Auto-fill published article image url
      addLog(`File uploaded successfully to 'f1-assets' bucket! URL: ${url.substring(0, 40)}...`);
    } catch (err: any) {
      const errMsg = err.message || "Upload failed. Verify 'f1-assets' bucket exists and RLS allows inserts.";
      setUploadError(errMsg);
      addLog(`[ERROR] Storage upload failed: ${errMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleTriggerResync = async () => {
    addLog("Manually re-syncing datasets with Supabase...");
    await store.syncFromSupabase();
    addLog("Supabase table refresh operation completed.");
  };

  if (role !== "Admin") {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-5" id="admin-access-restricted">
        <AlertCircle className="w-12 h-12 text-[#E10600] mx-auto animate-bounce" />
        <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">Access Restricted</h2>
        <p className="text-zinc-400 text-xs font-sans leading-relaxed">
          The Admin Operations dashboard is strictly limited to authorized users with the **Admin** security role.
        </p>
        <div className="p-4 bg-[#0A0A0A] border border-white/5 rounded-lg text-left space-y-3 font-mono text-[11px] text-zinc-500">
          <p>Please log in with an administrator account to perform CRUD mutations, or create an account with Admin privileges on our secure authentication terminal.</p>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate("login")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E10600] hover:bg-[#ff0700] text-white font-mono font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer shadow-lg"
          >
            Go to Authentication Hub
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="border-b border-white/5 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-[#E10600]" /> Admin Control Centre
          </h1>
          <p className="text-zinc-400 text-xs font-sans mt-1">
            Perform Supabase PostgreSQL migrations, manage F1 Storage Buckets, and edit live datasets
          </p>
        </div>

        {/* Database Status Widget */}
        <div className="flex items-center gap-2 bg-[#0E0E0E] border border-white/10 rounded-lg p-3">
          <div className="space-y-0.5">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Supabase Integration</p>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                supabaseStatus === "connected" ? "bg-emerald-500 animate-pulse" :
                supabaseStatus === "syncing" ? "bg-amber-500 animate-pulse" :
                supabaseStatus === "disconnected" ? "bg-red-500" : "bg-zinc-600"
              }`} />
              <p className="text-xs font-mono font-bold text-white capitalize">
                {supabaseStatus === "connected" ? "Connected" :
                 supabaseStatus === "syncing" ? "Syncing..." :
                 supabaseStatus === "disconnected" ? "Connection Error" : "Unconfigured Fallback"}
              </p>
            </div>
          </div>
          {isSupabaseConfigured && (
            <button 
              onClick={handleTriggerResync}
              className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-all ml-2"
              title="Refresh Sync"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/5 gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab("journal")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase transition-all border-b-2 cursor-pointer ${
            activeTab === "journal" 
              ? "border-[#E10600] text-white bg-white/5" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> F1 Journal & Sync</span>
        </button>
        <button
          onClick={() => setActiveTab("datasets")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase transition-all border-b-2 cursor-pointer ${
            activeTab === "datasets" 
              ? "border-[#E10600] text-white bg-white/5" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2"><Database className="w-3.5 h-3.5" /> F1 Datasets Manager</span>
        </button>
        <button
          onClick={() => setActiveTab("schema")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase transition-all border-b-2 cursor-pointer ${
            activeTab === "schema" 
              ? "border-[#E10600] text-white bg-white/5" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2"><FileCode className="w-3.5 h-3.5" /> Supabase Setup SQL</span>
        </button>
        <button
          onClick={() => setActiveTab("storage")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase transition-all border-b-2 cursor-pointer ${
            activeTab === "storage" 
              ? "border-[#E10600] text-white bg-white/5" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2"><Upload className="w-3.5 h-3.5" /> Storage Bucket Tester</span>
        </button>
      </div>

      {/* Main Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Changes based on active tab) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TAB 1: JOURNAL & SYNC */}
          {activeTab === "journal" && (
            <>
              {/* Jolpica Sync Block with Separate Tabs */}
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4 text-emerald-400" />
                    Live Jolpica Sync & Import
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">Supabase Table Sync</span>
                </div>

                <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                  Connect and fetch real-time F1 database tables from the Jolpica Ergast API. 
                  Choose a separate sync category below to target specific collections, or execute a comprehensive bulk import to refresh all schemas.
                </p>

                {/* Import Sub-Tabs */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Select Import Target Segment</label>
                  <div className="flex flex-wrap gap-1.5 p-1.5 bg-black rounded-lg border border-white/5">
                    {(["season", "races", "drivers", "teams", "circuits", "results", "sprint results", "qualifying", "sprint qualifying", "pitstops", "bulk"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedImportTab(tab)}
                        disabled={importStatus.isImporting}
                        className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-bold capitalize transition-all cursor-pointer ${
                          selectedImportTab === tab
                            ? "bg-[#E10600] text-white"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {tab === "bulk" ? "Bulk Import" : tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Selected Tab Info Box */}
                <div className="bg-[#111] border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-400 space-y-1">
                  <p className="font-bold text-white uppercase text-[10px] text-[#E10600]">
                    Target: {selectedImportTab === "bulk" ? "Comprehensive Bulk Sync" : `${selectedImportTab.toUpperCase()} synchronizer`}
                  </p>
                  <p className="text-[11px]">
                    {selectedImportTab === "season" && "Fetches official F1 season codes, regulatory structures, and championship point distribution profiles."}
                    {selectedImportTab === "races" && "Syncs the 24-round championship race calendar, grand prix locations, timetables, and schedules."}
                    {selectedImportTab === "drivers" && "Synchronizes the active F1 grid drivers, driver codes, biometric birthdates, and bio details."}
                    {selectedImportTab === "teams" && "Imports official constructor definitions, livery banners, team nationalities, and logo references."}
                    {selectedImportTab === "circuits" && "Syncs track specs including official lap records, capacity, difficulty level, and geometric maps."}
                    {selectedImportTab === "results" && "Fetches full Grand Prix race results, classification sheets, retirements, and points allocation."}
                    {selectedImportTab === "sprint results" && "Fetches Saturday sprint race metrics and point distributions for the top 8 positions."}
                    {selectedImportTab === "qualifying" && "Retrieves official qualifying segment logs, fastest laps, and Q1/Q2/Q3 grid intervals."}
                    {selectedImportTab === "sprint qualifying" && "Pulls sprint shootout timing tables to compile Saturday shootout grids."}
                    {selectedImportTab === "pitstops" && "Downloads strategy metrics, compound histories, and individual lane duration times."}
                    {selectedImportTab === "bulk" && "Sequentially rebuilds all 10 F1 schemas. High impact comprehensive cloud database refresh."}
                  </p>
                </div>

                {importStatus.isImporting ? (
                  <div className="space-y-3 bg-[#0F0F0F] p-4 border border-emerald-500/10 rounded-lg">
                    <div className="flex justify-between text-xs font-mono text-emerald-400 font-bold">
                      <span className="flex items-center gap-2">
                        <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                        Synchronizing...
                      </span>
                      <span>{importStatus.progress}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${importStatus.progress}%` }} />
                    </div>

                    {/* Dynamic Sub-Step Message */}
                    <p className="text-[10px] font-mono text-zinc-500 italic">
                      Current Step: <span className="text-zinc-300">{importStatus.message || "Working..."}</span>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                        <span>Season:</span>
                        <input
                          type="number"
                          value={importYear}
                          onChange={(e) => setImportYear(e.target.value)}
                          min="1950"
                          max="2099"
                          className="w-20 bg-black border border-white/10 rounded px-2 py-1.5 text-white font-mono text-xs text-center focus:outline-none focus:border-[#E10600]"
                        />
                      </label>
                      <button
                        onClick={() => handleSimulateImport(selectedImportTab)}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded font-mono font-bold text-xs text-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                      >
                        <RefreshCcw className="w-4 h-4" /> Trigger Jolpica Sync: {selectedImportTab === "bulk" ? "Bulk Import" : selectedImportTab}
                      </button>
                    </div>
                    <div className="text-xs font-mono text-zinc-500">
                      Last Sync: <span className="text-zinc-300 font-bold">{importStatus.lastImport || "Never"}</span>
                    </div>
                  </div>
                )}

                {/* Import Log Display */}
                {importStatus.logs && importStatus.logs.length > 0 && (
                  <div className="bg-black border border-white/5 rounded-lg p-3 max-h-32 overflow-y-auto space-y-0.5">
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider font-bold mb-1">Import Log</p>
                    {importStatus.logs.map((log: string, i: number) => (
                      <p key={i} className="text-[10px] font-mono text-zinc-400 leading-relaxed">{log}</p>
                    ))}
                  </div>
                )}

              </div>

              {/* Journal Article Creator */}
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 shadow-lg">
                <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#E10600]" />
                  Publish F1 Journal Article
                </h3>

                <form onSubmit={handleCreateArticle} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-500 uppercase mb-1">Article Title</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Verstappen's Aerodynamic Edge"
                        className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#E10600]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 uppercase mb-1 flex items-center justify-between">
                        <span>Visual Image URL</span>
                        {uploadedUrl && <span className="text-[10px] text-emerald-400 lowercase font-bold">Uploaded asset</span>}
                      </label>
                      <input 
                        type="text" 
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-500 uppercase mb-1">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                      >
                        <option value="news">News Update</option>
                        <option value="analysis">Deep Technical Analysis</option>
                        <option value="opinion">Paddock Opinion</option>
                        <option value="historical">Historical spotlight</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input 
                        type="checkbox" 
                        id="featured-check"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="accent-[#E10600] w-4 h-4 rounded"
                      />
                      <label htmlFor="featured-check" className="text-zinc-300 font-bold select-none cursor-pointer">Feature Article on Homepage</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-500 uppercase mb-1">Summary Abstract</label>
                    <input 
                      type="text" 
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Enter a 1-sentence abstract..."
                      className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-500 uppercase mb-1">Full Article Body Content (Supports text logs)</label>
                    <textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter detailed paddock notes..."
                      rows={4}
                      className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#E10600] font-sans text-sm"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-[#E10600] hover:bg-[#ff0700] rounded text-xs font-mono font-bold text-white transition-all cursor-pointer shadow-lg"
                  >
                    Publish Live to Supabase
                  </button>
                </form>
              </div>
            </>
          )}

          {/* TAB 2: SUPABASE SETUP SQL */}
          {activeTab === "schema" && (
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Setup Queries: Tables, RLS Policies, & Storage
                  </h3>
                  <p className="text-zinc-500 text-[11px] font-sans mt-0.5">
                    Run the script below in your Supabase project's SQL Editor to set up everything.
                  </p>
                </div>
                <button
                  onClick={handleCopySQL}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-mono font-bold text-xs text-white flex items-center gap-2 transition-all cursor-pointer self-start"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy SQL Code
                    </>
                  )}
                </button>
              </div>

              {/* Quick Instructions Alert */}
              <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 text-xs">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-zinc-300">
                  <p className="font-bold text-white uppercase font-mono text-[10px] tracking-wide">Quick Integration Steps:</p>
                  <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
                    <li>Go to your <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline inline-flex items-center gap-0.5 hover:text-emerald-300">Supabase Dashboard <ExternalLink className="w-3 h-3" /></a> and create a new project.</li>
                    <li>Click on the <strong>SQL Editor</strong> in the left sidebar navigation.</li>
                    <li>Paste the queries shown below, and click the <strong>Run</strong> button at the bottom-right.</li>
                    <li>Go to your project <strong>Settings &gt; API</strong> and grab your <code className="text-white font-bold bg-white/5 px-1 py-0.5 rounded">Project URL</code> and <code className="text-white font-bold bg-white/5 px-1 py-0.5 rounded">anon public key</code>.</li>
                    <li>Add them in AI Studio via <strong>Settings &gt; Secrets</strong> under <code className="text-white">VITE_SUPABASE_URL</code> and <code className="text-white">VITE_SUPABASE_ANON_KEY</code> to enable full cloud synchronization!</li>
                  </ol>
                </div>
              </div>

              {/* Beautiful SQL Viewer Panel */}
              <div className="relative border border-white/10 rounded-lg overflow-hidden bg-black">
                <div className="flex items-center justify-between bg-zinc-950 px-4 py-2 text-[10px] font-mono text-zinc-400 border-b border-white/5">
                  <span>supabase_schema_setup.sql</span>
                  <span className="text-[#E10600] font-bold">PostgreSQL</span>
                </div>
                <pre className="p-4 overflow-x-auto max-h-[400px] text-[11px] font-mono text-zinc-300 leading-relaxed text-left selection:bg-white/20">
                  <code>{SUPABASE_SETUP_SQL}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 1.5: DATASETS MANAGER CRUD */}
          {activeTab === "datasets" && (
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#E10600]" />
                    F1 Live Datasets Manager (CRUD)
                  </h3>
                  <p className="text-zinc-500 text-[11px] font-sans mt-0.5">
                    Create, Read, Update, and Delete rows in your local state and Supabase Postgres database.
                  </p>
                </div>

                {!isEditingDataset && !isCreatingDataset && (
                  <button
                    onClick={() => {
                      if (activeDataset === "drivers") handleCreateNewDriver();
                      else if (activeDataset === "teams") handleCreateNewTeam();
                      else if (activeDataset === "circuits") handleCreateNewCircuit();
                      else if (activeDataset === "races") handleCreateNewRace();
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    + Add New Row
                  </button>
                )}
              </div>

              {/* Dataset Selection Pills */}
              <div className="flex flex-wrap gap-2">
                {(["drivers", "teams", "circuits", "races"] as const).map((dataset) => (
                  <button
                    key={dataset}
                    onClick={() => {
                      setActiveDataset(dataset);
                      setIsEditingDataset(false);
                      setIsCreatingDataset(false);
                    }}
                    className={`px-4 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      activeDataset === dataset
                        ? "bg-[#E10600]/10 border-[#E10600] text-white"
                        : "bg-black/55 border-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {dataset}
                  </button>
                ))}
              </div>

              {/* Editing Form Section */}
              {(isEditingDataset || isCreatingDataset) ? (
                <div className="bg-black/50 border border-white/5 rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <h4 className="text-white font-mono text-xs uppercase tracking-wider font-bold">
                      {isCreatingDataset ? "Create New" : "Edit"} {activeDataset.slice(0, -1)}
                    </h4>
                    <button
                      onClick={() => {
                        setIsEditingDataset(false);
                        setIsCreatingDataset(false);
                      }}
                      className="text-zinc-500 hover:text-white font-mono text-xs uppercase"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* FORM 1: DRIVERS */}
                  {activeDataset === "drivers" && (
                    <form onSubmit={handleSaveDriver} className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Driver ID (Slug)</label>
                          <input
                            type="text"
                            value={driverForm.id}
                            onChange={(e) => setDriverForm({ ...driverForm, id: e.target.value })}
                            placeholder="e.g. norris"
                            disabled={!isCreatingDataset}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-700 disabled:opacity-50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Short Name</label>
                          <input
                            type="text"
                            value={driverForm.name}
                            onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                            placeholder="e.g. Lando Norris"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Full Name</label>
                          <input
                            type="text"
                            value={driverForm.fullName}
                            onChange={(e) => setDriverForm({ ...driverForm, fullName: e.target.value })}
                            placeholder="e.g. Lando Norris"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Three-letter Code</label>
                          <input
                            type="text"
                            value={driverForm.code}
                            onChange={(e) => setDriverForm({ ...driverForm, code: e.target.value.toUpperCase() })}
                            placeholder="e.g. NOR"
                            maxLength={3}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Driver Number</label>
                          <input
                            type="text"
                            value={driverForm.number}
                            onChange={(e) => setDriverForm({ ...driverForm, number: e.target.value })}
                            placeholder="e.g. 4"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Nationality</label>
                          <input
                            type="text"
                            value={driverForm.nationality}
                            onChange={(e) => setDriverForm({ ...driverForm, nationality: e.target.value })}
                            placeholder="e.g. British"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Active Status</label>
                          <select
                            value={driverForm.active ? "yes" : "no"}
                            onChange={(e) => setDriverForm({ ...driverForm, active: e.target.value === "yes" })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          >
                            <option value="yes">Active Grid</option>
                            <option value="no">Inactive</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Team ID Slug</label>
                          <input
                            type="text"
                            value={driverForm.teamId}
                            onChange={(e) => setDriverForm({ ...driverForm, teamId: e.target.value })}
                            placeholder="e.g. mclaren"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Team Display Name</label>
                          <input
                            type="text"
                            value={driverForm.teamName}
                            onChange={(e) => setDriverForm({ ...driverForm, teamName: e.target.value })}
                            placeholder="e.g. McLaren F1 Team"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Championships</label>
                          <input
                            type="number"
                            value={driverForm.championships}
                            onChange={(e) => setDriverForm({ ...driverForm, championships: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Grand Prix Wins</label>
                          <input
                            type="number"
                            value={driverForm.wins}
                            onChange={(e) => setDriverForm({ ...driverForm, wins: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Podiums</label>
                          <input
                            type="number"
                            value={driverForm.podiums}
                            onChange={(e) => setDriverForm({ ...driverForm, podiums: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">GOAT Score (0-100)</label>
                          <input
                            type="number"
                            value={driverForm.goatScore}
                            onChange={(e) => setDriverForm({ ...driverForm, goatScore: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-500 uppercase mb-1">Profile Image URL</label>
                        <input
                          type="text"
                          value={driverForm.image}
                          onChange={(e) => setDriverForm({ ...driverForm, image: e.target.value })}
                          placeholder="Image URL"
                          className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded font-mono font-bold text-xs text-black transition-all cursor-pointer"
                      >
                        Save Driver Row
                      </button>
                    </form>
                  )}

                  {/* FORM 2: TEAMS */}
                  {activeDataset === "teams" && (
                    <form onSubmit={handleSaveTeam} className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Team ID Slug</label>
                          <input
                            type="text"
                            value={teamForm.id}
                            onChange={(e) => setTeamForm({ ...teamForm, id: e.target.value })}
                            placeholder="e.g. mclaren"
                            disabled={!isCreatingDataset}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-700 disabled:opacity-50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Short Name</label>
                          <input
                            type="text"
                            value={teamForm.name}
                            onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                            placeholder="e.g. McLaren"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Full Constructor Name</label>
                          <input
                            type="text"
                            value={teamForm.fullName}
                            onChange={(e) => setTeamForm({ ...teamForm, fullName: e.target.value })}
                            placeholder="e.g. McLaren F1 Team"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Base Nationality</label>
                          <input
                            type="text"
                            value={teamForm.nationality}
                            onChange={(e) => setTeamForm({ ...teamForm, nationality: e.target.value })}
                            placeholder="e.g. British"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Engine supplier</label>
                          <input
                            type="text"
                            value={teamForm.engine}
                            onChange={(e) => setTeamForm({ ...teamForm, engine: e.target.value })}
                            placeholder="e.g. Mercedes"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Constructor Legacy Score</label>
                          <input
                            type="number"
                            value={teamForm.legacyScore}
                            onChange={(e) => setTeamForm({ ...teamForm, legacyScore: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">World Championships</label>
                          <input
                            type="number"
                            value={teamForm.championships}
                            onChange={(e) => setTeamForm({ ...teamForm, championships: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Grand Prix Wins</label>
                          <input
                            type="number"
                            value={teamForm.wins}
                            onChange={(e) => setTeamForm({ ...teamForm, wins: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Grand Prix Starts</label>
                          <input
                            type="number"
                            value={teamForm.starts}
                            onChange={(e) => setTeamForm({ ...teamForm, starts: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#E10600] hover:bg-[#ff0700] rounded text-xs font-mono font-bold text-white transition-all cursor-pointer"
                      >
                        Save Team Row
                      </button>
                    </form>
                  )}

                  {/* FORM 3: CIRCUITS */}
                  {activeDataset === "circuits" && (
                    <form onSubmit={handleSaveCircuit} className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Circuit ID Slug</label>
                          <input
                            type="text"
                            value={circuitForm.id}
                            onChange={(e) => setCircuitForm({ ...circuitForm, id: e.target.value })}
                            placeholder="e.g. silverstone"
                            disabled={!isCreatingDataset}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-700 disabled:opacity-50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Circuit Name</label>
                          <input
                            type="text"
                            value={circuitForm.name}
                            onChange={(e) => setCircuitForm({ ...circuitForm, name: e.target.value })}
                            placeholder="e.g. Silverstone Circuit"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Location / City</label>
                          <input
                            type="text"
                            value={circuitForm.location}
                            onChange={(e) => setCircuitForm({ ...circuitForm, location: e.target.value })}
                            placeholder="e.g. Silverstone"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Country</label>
                          <input
                            type="text"
                            value={circuitForm.country}
                            onChange={(e) => setCircuitForm({ ...circuitForm, country: e.target.value })}
                            placeholder="e.g. United Kingdom"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Track Length</label>
                          <input
                            type="text"
                            value={circuitForm.length}
                            onChange={(e) => setCircuitForm({ ...circuitForm, length: e.target.value })}
                            placeholder="e.g. 5.891 km"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Turns Count</label>
                          <input
                            type="number"
                            value={circuitForm.turns}
                            onChange={(e) => setCircuitForm({ ...circuitForm, turns: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Capacity</label>
                          <input
                            type="text"
                            value={circuitForm.capacity}
                            onChange={(e) => setCircuitForm({ ...circuitForm, capacity: e.target.value })}
                            placeholder="e.g. 150,000"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Prestige Rating (0-100)</label>
                          <input
                            type="number"
                            value={circuitForm.prestigeScore}
                            onChange={(e) => setCircuitForm({ ...circuitForm, prestigeScore: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Difficulty Index (1-10)</label>
                          <input
                            type="number"
                            value={circuitForm.difficultyIndex}
                            onChange={(e) => setCircuitForm({ ...circuitForm, difficultyIndex: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded font-mono font-bold text-xs text-black transition-all cursor-pointer"
                      >
                        Save Circuit Row
                      </button>
                    </form>
                  )}

                  {/* FORM 4: RACES */}
                  {activeDataset === "races" && (
                    <form onSubmit={handleSaveRace} className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Race ID Slug</label>
                          <input
                            type="text"
                            value={raceForm.id}
                            onChange={(e) => setRaceForm({ ...raceForm, id: e.target.value })}
                            placeholder="e.g. 2026-03-silverstone"
                            disabled={!isCreatingDataset}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white placeholder-zinc-700 disabled:opacity-50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Race Name</label>
                          <input
                            type="text"
                            value={raceForm.name}
                            onChange={(e) => setRaceForm({ ...raceForm, name: e.target.value })}
                            placeholder="e.g. British Grand Prix"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Round Number</label>
                          <input
                            type="number"
                            value={raceForm.round}
                            onChange={(e) => setRaceForm({ ...raceForm, round: Number(e.target.value) })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Circuit ID Slug</label>
                          <input
                            type="text"
                            value={raceForm.circuitId}
                            onChange={(e) => setRaceForm({ ...raceForm, circuitId: e.target.value })}
                            placeholder="e.g. silverstone"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Circuit Display Name</label>
                          <input
                            type="text"
                            value={raceForm.circuitName}
                            onChange={(e) => setRaceForm({ ...raceForm, circuitName: e.target.value })}
                            placeholder="e.g. Silverstone Circuit"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Race Date</label>
                          <input
                            type="date"
                            value={raceForm.date}
                            onChange={(e) => setRaceForm({ ...raceForm, date: e.target.value })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Race Time</label>
                          <input
                            type="text"
                            value={raceForm.time}
                            onChange={(e) => setRaceForm({ ...raceForm, time: e.target.value })}
                            placeholder="e.g. 15:00 UTC"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Completed</label>
                          <select
                            value={raceForm.completed ? "yes" : "no"}
                            onChange={(e) => setRaceForm({ ...raceForm, completed: e.target.value === "yes" })}
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          >
                            <option value="no">Scheduled</option>
                            <option value="yes">Completed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase mb-1">Winner Driver ID</label>
                          <input
                            type="text"
                            value={raceForm.winnerId}
                            onChange={(e) => setRaceForm({ ...raceForm, winnerId: e.target.value })}
                            placeholder="e.g. norris"
                            className="w-full bg-[#111] border border-white/10 rounded px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#E10600] hover:bg-[#ff0700] rounded text-xs font-mono font-bold text-white transition-all cursor-pointer"
                      >
                        Save Race Row
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* Listing Records Grid */
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={datasetSearch}
                      onChange={(e) => setDatasetSearch(e.target.value)}
                      placeholder={`Search ${activeDataset} by name or code...`}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#E10600]"
                    />
                  </div>

                  {/* Dynamic Items Listing List */}
                  <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                    {/* LIST 1: DRIVERS */}
                    {activeDataset === "drivers" &&
                      drivers
                        .filter(
                          (d) =>
                            d.name.toLowerCase().includes(datasetSearch.toLowerCase()) ||
                            d.code.toLowerCase().includes(datasetSearch.toLowerCase()) ||
                            d.teamName.toLowerCase().includes(datasetSearch.toLowerCase())
                        )
                        .map((driver) => (
                          <div
                            key={driver.id}
                            className="flex justify-between items-center bg-black/40 border border-white/5 hover:border-white/10 rounded-lg p-3 text-xs font-mono text-zinc-300"
                          >
                            <div>
                              <p className="text-white font-bold flex items-center gap-2">
                                <span className="text-zinc-500">#{driver.number}</span> {driver.name}
                                <span className="bg-white/5 text-[9px] px-1 rounded text-zinc-400">{driver.code}</span>
                              </p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">
                                Team: {driver.teamName} | Nationality: {driver.nationality} | GOAT: {driver.stats?.goatScore || 50}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditDriver(driver)}
                                className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white"
                                title="Edit Row"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteDriver(driver.id, driver.name)}
                                className="p-1.5 hover:bg-white/5 rounded text-zinc-500 hover:text-[#E10600]"
                                title="Delete Row"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}

                    {/* LIST 2: TEAMS */}
                    {activeDataset === "teams" &&
                      teams
                        .filter((t) => t.name.toLowerCase().includes(datasetSearch.toLowerCase()))
                        .map((team) => (
                          <div
                            key={team.id}
                            className="flex justify-between items-center bg-black/40 border border-white/5 hover:border-white/10 rounded-lg p-3 text-xs font-mono text-zinc-300"
                          >
                            <div>
                              <p className="text-white font-bold">{team.name}</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">
                                Nationality: {team.nationality} | Engine: {team.specs?.engine || "Mercedes"} | Legacy Score: {team.specs?.legacyScore || 50}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditTeam(team)}
                                className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white"
                                title="Edit Row"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTeam(team.id, team.name)}
                                className="p-1.5 hover:bg-white/5 rounded text-zinc-500 hover:text-[#E10600]"
                                title="Delete Row"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}

                    {/* LIST 3: CIRCUITS */}
                    {activeDataset === "circuits" &&
                      circuits
                        .filter((c) => c.name.toLowerCase().includes(datasetSearch.toLowerCase()))
                        .map((circuit) => (
                          <div
                            key={circuit.id}
                            className="flex justify-between items-center bg-black/40 border border-white/5 hover:border-white/10 rounded-lg p-3 text-xs font-mono text-zinc-300"
                          >
                            <div>
                              <p className="text-white font-bold">{circuit.name}</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">
                                Location: {circuit.location}, {circuit.country} | Length: {circuit.specs?.length} | Prestige: {circuit.specs?.prestigeScore}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditCircuit(circuit)}
                                className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white"
                                title="Edit Row"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCircuit(circuit.id, circuit.name)}
                                className="p-1.5 hover:bg-white/5 rounded text-zinc-500 hover:text-[#E10600]"
                                title="Delete Row"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}

                    {/* LIST 4: RACES */}
                    {activeDataset === "races" &&
                      races
                        .filter((r) => r.name.toLowerCase().includes(datasetSearch.toLowerCase()))
                        .map((race) => (
                          <div
                            key={race.id}
                            className="flex justify-between items-center bg-black/40 border border-white/5 hover:border-white/10 rounded-lg p-3 text-xs font-mono text-zinc-300"
                          >
                            <div>
                              <p className="text-white font-bold">
                                Round {race.round}: {race.name}
                              </p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">
                                Circuit: {race.circuitName} | Date: {race.date} | Status:{" "}
                                <span className={race.completed ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                                  {race.completed ? "Completed" : "Scheduled"}
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditRace(race)}
                                className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white"
                                title="Edit Row"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteRace(race.id, race.name)}
                                className="p-1.5 hover:bg-white/5 rounded text-zinc-500 hover:text-[#E10600]"
                                title="Delete Row"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STORAGE BUCKET TESTER */}
          {activeTab === "storage" && (
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-6 shadow-lg">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#E10600]" />
                  F1 Assets Storage Bucket Client
                </h3>
                <p className="text-zinc-500 text-[11px] font-sans mt-0.5">
                  Verify your Supabase Storage bucket configurations by uploading assets directly into the public <code className="text-zinc-300 font-mono font-bold bg-white/5 px-1 py-0.5 rounded">f1-assets</code> bucket.
                </p>
              </div>

              {!isSupabaseConfigured ? (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-5 flex items-start gap-4 text-xs font-mono">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-2 text-zinc-300 leading-normal">
                    <p className="font-bold text-white uppercase tracking-wider">Unconfigured Client Warning</p>
                    <p>
                      Supabase keys are currently absent from your project secrets. The browser fallback engine is serving static local mock images.
                    </p>
                    <p>
                      To unlock full binary media storage, run the SQL script in your database to spin up the bucket and populate your secrets configuration!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Uploader Box */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-[#E10600]/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-white/2 hover:bg-white/3 transition-all cursor-pointer text-center group"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden" 
                      accept="image/*"
                    />
                    
                    {uploading ? (
                      <RefreshCcw className="w-10 h-10 text-amber-500 animate-spin" />
                    ) : (
                      <Upload className="w-10 h-10 text-zinc-500 group-hover:text-[#E10600] transition-colors" />
                    )}

                    <div>
                      <p className="text-white font-bold text-xs">
                        {uploading ? "Uploading Binary Stream..." : "Choose File or Drag Here"}
                      </p>
                      <p className="text-zinc-500 text-[10px] mt-1 font-sans">
                        PNG, JPG, WEBP, SVG or GIF (Max 5MB)
                      </p>
                    </div>
                  </div>

                  {/* Upload Status Details */}
                  <div className="bg-[#0E0E0E] border border-white/5 rounded-xl p-5 space-y-4 flex flex-col justify-center">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Upload Feedback Panel</p>
                    
                    {uploading && (
                      <div className="space-y-1.5 font-mono text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                          <span>Pushing binary to Supabase Storage...</span>
                        </div>
                        <p className="text-[10px] text-zinc-600">Uploading stream to /f1-assets/uploads/...</p>
                      </div>
                    )}

                    {!uploading && !uploadedUrl && !uploadError && (
                      <p className="text-xs text-zinc-500 font-sans italic">
                        No files uploaded in this session. Choose a file to perform a live upload check.
                      </p>
                    )}

                    {uploadError && (
                      <div className="bg-red-500/5 border border-red-500/10 p-3 rounded text-xs text-red-400 font-mono space-y-1">
                        <p className="font-bold flex items-center gap-1.5"><AlertCircle className="w-4 h-4 shrink-0" /> Operation Failed</p>
                        <p className="text-[10px] leading-relaxed">{uploadError}</p>
                      </div>
                    )}

                    {uploadedUrl && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Upload Succeeded!
                        </div>
                        <div className="bg-black/50 border border-white/5 p-2 rounded">
                          <p className="text-[9px] text-zinc-500 uppercase">Generated Public URI</p>
                          <a 
                            href={uploadedUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-white hover:text-emerald-400 underline break-all text-[10px] mt-1 block"
                          >
                            {uploadedUrl}
                          </a>
                        </div>
                        <div className="pt-2">
                          <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                            This URL is ready to be used in your Article Publisher forms or custom driver biographies!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column - Logs Console and CRUD indexes */}
        <div className="space-y-6">
          
          {/* Live Engineering Logs */}
          <div className="bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-[#111] px-4 py-2 flex items-center justify-between border-b border-white/5 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-[#E10600]" /> Engineering Console</span>
              <span className="text-emerald-400 font-bold">● ONLINE</span>
            </div>
            <div className="p-4 font-mono text-[10px] text-zinc-400 space-y-1.5 h-48 overflow-y-auto leading-normal">
              {logs.map((log, idx) => (
                <p key={idx} className={
                  log.includes("[ERROR]") ? "text-red-400" :
                  log.includes("Successfully") || log.includes("Succeeded") ? "text-emerald-400" : 
                  log.includes("Publish") ? "text-purple-400" : ""
                }>
                  {log}
                </p>
              ))}
            </div>
          </div>

          {/* Current Articles Index CRUD list */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 space-y-4 shadow-lg">
            <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold border-b border-white/5 pb-2">
              Supabase Article Table
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {articles.map(art => (
                <div key={art.id} className="flex justify-between items-center text-xs font-mono text-zinc-400 p-2.5 bg-white/3 border border-white/5 rounded">
                  <div className="truncate max-w-[160px]">
                    <p className="text-white font-bold truncate">{art.title}</p>
                    <p className="text-[10px] text-zinc-500">{art.publishedAt} | {art.category}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteArticle(art.id)}
                    className="p-1 hover:bg-white/5 text-zinc-500 hover:text-[#E10600] rounded transition-all cursor-pointer"
                    title="Delete row"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
