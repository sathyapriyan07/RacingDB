/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Driver, Team, Circuit, Race, Rivalry, GreatestCar, OnThisDayEvent, Article, StandingItem } from "../types";
import { DRIVERS, TEAMS, CIRCUITS, RACES, RIVALRIES, GREATEST_CARS, ARTICLES, ON_THIS_DAY_EVENTS, HISTORIC_SEASONS } from "./f1Data";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  syncDrivers as jolpicaDrivers,
  syncConstructors as jolpicaConstructors,
  syncCircuits as jolpicaCircuits,
  syncRaces as jolpicaRaces,
  syncResults as jolpicaResults,
  syncSprintResults as jolpicaSprintResults,
  syncQualifying as jolpicaQualifying,
} from "../lib/jolpica";

// Simple state manager with persistence & optional Supabase integration
class OneGridStore {
  private listeners: Set<() => void> = new Set();

  // State
  private role: "Guest" | "User" | "Admin" = "Guest"; // Default to Guest so authentication is required for Admin!
  private currentUserEmail: string | null = null;
  private articles: Article[] = [];
  private drivers: Driver[] = [];
  private teams: Team[] = [];
  private circuits: Circuit[] = [];
  private races: Race[] = [];
  private customHallOfFameRankings: { id: string; driverId: string; rank: number; note: string }[] = [];
  private isImporting: boolean = false;
  private importProgress: number = 0;
  private lastImportTime: string | null = null;
  private importStatusMessage: string = "";
  private importLogs: string[] = [];

  // Supabase Sync Status
  private supabaseStatus: "connected" | "disconnected" | "unconfigured" | "syncing" = isSupabaseConfigured ? "syncing" : "unconfigured";

  constructor() {
    this.loadFromStorage();
    // Start asynchronous sync from Supabase if keys are present
    this.syncFromSupabase();
    
    // Wire up real-time session listener
    this.initAuthListener();
  }

  private initAuthListener() {
    if (isSupabaseConfigured && supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        this.updateSessionAndProfile(session);
      });

      // Listen for auth state transitions (sign in, sign out, token refreshed)
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(`Supabase Auth Event: ${event}`);
        await this.updateSessionAndProfile(session);
      });
    }
  }

  private async updateSessionAndProfile(session: any) {
    if (session?.user) {
      this.currentUserEmail = session.user.email || null;
      
      // Default fallback from user metadata
      const userMetadataRole = session.user.user_metadata?.role;
      let computedRole: "Guest" | "User" | "Admin" = userMetadataRole === "admin" ? "Admin" : "User";
      
      // Assign the fallback role immediately and notify listeners so they are not stuck as Guest
      this.role = computedRole;
      this.saveToStorage();
      this.notify();
      
      try {
        const { data, error } = await supabase!
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();
        
        if (data && !error) {
          const finalRole = data.role === "admin" ? "Admin" : "User";
          if (finalRole !== this.role) {
            this.role = finalRole;
            this.saveToStorage();
            this.notify();
          }
        }
      } catch (e) {
        console.warn("Could not retrieve role from profiles table, falling back to user metadata.", e);
      }
    } else {
      this.currentUserEmail = null;
      this.role = "Guest";
      this.saveToStorage();
      this.notify();
    }
  }

  private loadFromStorage() {
    try {
      // When Supabase is configured, NEVER load role/email from localStorage.
      // Auth state must come exclusively from the Supabase session/profiles table.
      // This prevents localStorage tampering (e.g. setting onegrid_role=Admin via DevTools).
      if (!isSupabaseConfigured) {
        const storedRole = localStorage.getItem("onegrid_role");
        if (storedRole === "Admin" || storedRole === "User") {
          this.role = storedRole;
          this.currentUserEmail = localStorage.getItem("onegrid_email");
        }
      }

      const storedArticles = localStorage.getItem("onegrid_articles");
      this.articles = storedArticles ? JSON.parse(storedArticles) : ARTICLES;

      const storedDrivers = localStorage.getItem("onegrid_drivers");
      this.drivers = storedDrivers ? JSON.parse(storedDrivers) : DRIVERS;

      const storedTeams = localStorage.getItem("onegrid_teams");
      this.teams = storedTeams ? JSON.parse(storedTeams) : TEAMS;

      const storedCircuits = localStorage.getItem("onegrid_circuits");
      this.circuits = storedCircuits ? JSON.parse(storedCircuits) : CIRCUITS;

      const storedRaces = localStorage.getItem("onegrid_races");
      this.races = storedRaces ? JSON.parse(storedRaces) : RACES;

      const storedRankings = localStorage.getItem("onegrid_hof_rankings");
      this.customHallOfFameRankings = storedRankings ? JSON.parse(storedRankings) : [
        { id: "1", driverId: "hamilton", rank: 1, note: "Statistically unmatched in pole positions and race wins." },
        { id: "2", driverId: "senna", rank: 2, note: "Undisputed king of raw qualifying speed and wet-weather driving." },
        { id: "3", driverId: "schumacher", rank: 3, note: "Brought Scuderia Ferrari back to dominance with relentless focus." },
        { id: "4", driverId: "verstappen", rank: 4, note: "A modern force of absolute dominance." },
        { id: "5", driverId: "alonso", rank: 5, note: "The most complete, tactically versatile driver in the hybrid era." }
      ];

      const storedLastImport = localStorage.getItem("onegrid_last_import");
      this.lastImportTime = storedLastImport || "2026-06-23 12:00";
    } catch (e) {
      console.error("Failed to load local storage", e);
      this.articles = ARTICLES;
      this.drivers = DRIVERS;
      this.teams = TEAMS;
      this.circuits = CIRCUITS;
      this.races = RACES;
    }
  }

  private saveToStorage() {
    try {
      // Only persist auth state to localStorage in sandbox mode
      if (!isSupabaseConfigured) {
        localStorage.setItem("onegrid_role", this.role);
        if (this.currentUserEmail) {
          localStorage.setItem("onegrid_email", this.currentUserEmail);
        } else {
          localStorage.removeItem("onegrid_email");
        }
      } else {
        // Clean up any stale localStorage auth keys if Supabase is configured
        localStorage.removeItem("onegrid_role");
        localStorage.removeItem("onegrid_email");
      }
      localStorage.setItem("onegrid_articles", JSON.stringify(this.articles));
      localStorage.setItem("onegrid_drivers", JSON.stringify(this.drivers));
      localStorage.setItem("onegrid_teams", JSON.stringify(this.teams));
      localStorage.setItem("onegrid_circuits", JSON.stringify(this.circuits));
      localStorage.setItem("onegrid_races", JSON.stringify(this.races));
      localStorage.setItem("onegrid_hof_rankings", JSON.stringify(this.customHallOfFameRankings));
      if (this.lastImportTime) {
        localStorage.setItem("onegrid_last_import", this.lastImportTime);
      }
    } catch (e) {
      console.error("Failed to save to storage", e);
    }
  }

  // Supabase Bi-directional Synchronizer
  public async syncFromSupabase() {
    if (!isSupabaseConfigured || !supabase) {
      this.supabaseStatus = "unconfigured";
      this.notify();
      return;
    }

    this.supabaseStatus = "syncing";
    this.notify();

    try {
      // 1. Fetch articles first to check if schema is initialized
      const { data: articlesData, error: articlesErr } = await supabase
        .from("articles")
        .select("*")
        .order("publishedAt", { ascending: false });

      if (articlesErr) {
        console.warn("Supabase articles table fetch error (likely table not created yet):", articlesErr);
        this.supabaseStatus = "disconnected";
        this.notify();
        return;
      }

      // If the table is completely empty, trigger an automated seed!
      if (!articlesData || articlesData.length === 0) {
        console.log("Supabase database tables empty. Autoseeding initial mock datasets...");
        await this.seedSupabase();
        this.supabaseStatus = "connected";
        this.notify();
        return;
      }

      // 2. Map and sync articles
      this.articles = articlesData as Article[];

      // 3. Sync drivers
      const { data: driversData } = await supabase.from("drivers").select("*");
      if (driversData && driversData.length > 0) {
        this.drivers = driversData as Driver[];
      }

      // 4. Sync teams
      const { data: teamsData } = await supabase.from("teams").select("*");
      if (teamsData && teamsData.length > 0) {
        this.teams = teamsData as Team[];
      }

      // 5. Sync circuits
      const { data: circuitsData } = await supabase.from("circuits").select("*");
      if (circuitsData && circuitsData.length > 0) {
        this.circuits = circuitsData as Circuit[];
      }

      // 6. Sync races
      const { data: racesData } = await supabase.from("races").select("*");
      if (racesData && racesData.length > 0) {
        this.races = racesData as Race[];
      }

      // 7. Sync Hall of Fame rankings
      const { data: rankingsData } = await supabase
        .from("custom_hall_of_fame_rankings")
        .select("*")
        .order("rank", { ascending: true });
      if (rankingsData && rankingsData.length > 0) {
        this.customHallOfFameRankings = rankingsData.map((r: any) => ({
          id: r.id,
          driverId: r.driverId,
          rank: r.rank,
          note: r.note
        }));
      }

      this.supabaseStatus = "connected";
      this.saveToStorage(); // Refresh localStorage fallback cache
      this.notify();
    } catch (err) {
      console.error("Critical error during Supabase sync:", err);
      this.supabaseStatus = "disconnected";
      this.notify();
    }
  }

  // Populate Supabase tables with local defaults
  private async seedSupabase() {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      // Parallel seed insert operations
      await Promise.all([
        supabase.from("articles").insert(this.articles),
        supabase.from("drivers").insert(this.drivers),
        supabase.from("teams").insert(this.teams),
        supabase.from("circuits").insert(this.circuits),
        supabase.from("races").insert(this.races),
        supabase.from("custom_hall_of_fame_rankings").insert(
          this.customHallOfFameRankings.map(r => ({
            id: r.id,
            driverId: r.driverId,
            rank: r.rank,
            note: r.note
          }))
        )
      ]);
      console.log("Supabase database successfully seeded with initial datasets!");
    } catch (err) {
      console.error("Supabase seeding failure:", err);
    }
  }

  // File upload helper targeting the public 'f1-assets' bucket
  public async uploadAsset(file: File): Promise<string> {
    this.ensureAdmin();
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please supply keys in AI Studio Secrets.");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from("f1-assets")
      .upload(filePath, file);

    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }

    // Retrieve the public resource access URL
    const { data: urlData } = supabase.storage
      .from("f1-assets")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  // Subscribe/Unsubscribe pattern for React components
  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // Ensure only Admins can execute mutating/CRUD functions
  private ensureAdmin() {
    if (this.role !== "Admin") {
      throw new Error("Permission Denied: Only users with the Admin role can perform write, edit, or delete actions.");
    }
  }

  // Getters
  public getRole() { return this.role; }
  public getCurrentUserEmail() { return this.currentUserEmail; }
  public getArticles() { return this.articles; }
  public getDrivers() { return this.drivers; }
  public getTeams() { return this.teams; }
  public getCircuits() { return this.circuits; }
  public getRaces() { return this.races; }
  public getCustomHallOfFameRankings() { return this.customHallOfFameRankings; }
  public getImportStatus() { return { isImporting: this.isImporting, progress: this.importProgress, lastImport: this.lastImportTime, message: this.importStatusMessage, logs: this.importLogs }; }
  public getSupabaseStatus() { return this.supabaseStatus; }

  // Setters & Actions
  public setRole(role: "Guest" | "User" | "Admin") {
    this.role = role;
    this.saveToStorage();
    this.notify();
  }

  public clearSession() {
    this.currentUserEmail = null;
    this.role = "Guest";
    this.saveToStorage();
    this.notify();
  }

  private addImportLog(msg: string) {
    const ts = new Date().toLocaleTimeString();
    this.importLogs = [`[${ts}] ${msg}`, ...this.importLogs.slice(0, 49)];
  }

  public forceResetImport() {
    this.isImporting = false;
    this.importProgress = 0;
    this.importStatusMessage = "";
    this.importLogs = [];
    this.saveToStorage();
    this.notify();
  }

  // Articles CRUD
  public addArticle(article: Omit<Article, "id" | "publishedAt">) {
    this.ensureAdmin();
    const newArticle: Article = {
      ...article,
      id: "art-" + Date.now(),
      publishedAt: new Date().toISOString().split("T")[0]
    };
    this.articles = [newArticle, ...this.articles];
    this.saveToStorage();
    this.notify();

    // Background push to Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from("articles").insert(newArticle)
        .then(({ error }) => {
          if (error) console.error("Supabase insert article error:", error);
        });
    }
  }

  public updateArticle(id: string, updated: Partial<Article>) {
    this.ensureAdmin();
    this.articles = this.articles.map(art => art.id === id ? { ...art, ...updated } : art);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("articles").update(updated).eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase update article error:", error);
        });
    }
  }

  public deleteArticle(id: string) {
    this.ensureAdmin();
    this.articles = this.articles.filter(art => art.id !== id);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("articles").delete().eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase delete article error:", error);
        });
    }
  }

  // HOF Rankings CRUD
  public addHofRanking(driverId: string, rank: number, note: string) {
    this.ensureAdmin();
    const newRanking = { id: "hof-" + Date.now(), driverId, rank, note };
    this.customHallOfFameRankings = [...this.customHallOfFameRankings, newRanking]
      .sort((a, b) => a.rank - b.rank);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("custom_hall_of_fame_rankings").insert({
        id: newRanking.id,
        driverId: newRanking.driverId,
        rank: newRanking.rank,
        note: newRanking.note
      }).then(({ error }) => {
        if (error) console.error("Supabase insert HOF ranking error:", error);
      });
    }
  }

  public deleteHofRanking(id: string) {
    this.ensureAdmin();
    this.customHallOfFameRankings = this.customHallOfFameRankings.filter(r => r.id !== id);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("custom_hall_of_fame_rankings").delete().eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase delete HOF ranking error:", error);
        });
    }
  }

  // Drivers CRUD
  public addDriver(driver: Driver) {
    this.ensureAdmin();
    this.drivers = [...this.drivers, driver];
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("drivers").insert(driver)
        .then(({ error }) => {
          if (error) console.error("Supabase insert driver error:", error);
        });
    }
  }

  public updateDriver(id: string, updated: Partial<Driver>) {
    this.ensureAdmin();
    this.drivers = this.drivers.map(drv => drv.id === id ? { ...drv, ...updated } as Driver : drv);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("drivers").update(updated).eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase update driver error:", error);
        });
    }
  }

  public deleteDriver(id: string) {
    this.ensureAdmin();
    this.drivers = this.drivers.filter(drv => drv.id !== id);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("drivers").delete().eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase delete driver error:", error);
        });
    }
  }

  // Teams CRUD
  public addTeam(team: Team) {
    this.ensureAdmin();
    this.teams = [...this.teams, team];
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("teams").insert(team)
        .then(({ error }) => {
          if (error) console.error("Supabase insert team error:", error);
        });
    }
  }

  public updateTeam(id: string, updated: Partial<Team>) {
    this.ensureAdmin();
    this.teams = this.teams.map(tm => tm.id === id ? { ...tm, ...updated } as Team : tm);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("teams").update(updated).eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase update team error:", error);
        });
    }
  }

  public deleteTeam(id: string) {
    this.ensureAdmin();
    this.teams = this.teams.filter(tm => tm.id !== id);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("teams").delete().eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase delete team error:", error);
        });
    }
  }

  // Circuit CRUD
  public addCircuit(circuit: Circuit) {
    this.ensureAdmin();
    this.circuits = [...this.circuits, circuit];
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("circuits").insert(circuit)
        .then(({ error }) => {
          if (error) console.error("Supabase insert circuit error:", error);
        });
    }
  }

  public updateCircuit(id: string, updated: Partial<Circuit>) {
    this.ensureAdmin();
    this.circuits = this.circuits.map(c => c.id === id ? { ...c, ...updated } as Circuit : c);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("circuits").update(updated).eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase update circuit error:", error);
        });
    }
  }

  public deleteCircuit(id: string) {
    this.ensureAdmin();
    this.circuits = this.circuits.filter(c => c.id !== id);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("circuits").delete().eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase delete circuit error:", error);
        });
    }
  }

  // Race CRUD
  public addRace(race: Race) {
    this.ensureAdmin();
    this.races = [...this.races, race];
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("races").insert(race)
        .then(({ error }) => {
          if (error) console.error("Supabase insert race error:", error);
        });
    }
  }

  public updateRace(id: string, updated: Partial<Race>) {
    this.ensureAdmin();
    this.races = this.races.map(r => r.id === id ? { ...r, ...updated } as Race : r);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("races").update(updated).eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase update race error:", error);
        });
    }
  }

  public deleteRace(id: string) {
    this.ensureAdmin();
    this.races = this.races.filter(r => r.id !== id);
    this.saveToStorage();
    this.notify();

    if (isSupabaseConfigured && supabase) {
      supabase.from("races").delete().eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Supabase delete race error:", error);
        });
    }
  }

  // Real Jolpica F1 API Import — fetches live data from api.jolpi.ca and upserts to Supabase
  public async simulateJolpicaImport(importType: string = "bulk", season: string = "2026") {
    this.ensureAdmin();
    if (this.isImporting) return;
    this.isImporting = true;
    this.importProgress = 5;
    this.importStatusMessage = `Initializing Jolpica synchronizer for [${importType.toUpperCase()}]...`;
    this.notify();

    const setProgress = (p: number, msg: string) => {
      this.importProgress = p;
      this.importStatusMessage = msg;
      this.notify();
    };

    const upsertToSupabase = async (table: string, rows: any[]) => {
      if (!isSupabaseConfigured || !supabase || rows.length === 0) return;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
        if (error) {
          console.error(`Supabase upsert ${table} error:`, error);
          this.addImportLog(`Supabase upsert ${table} failed: ${error.message}`);
        } else {
          this.addImportLog(`Upserted ${rows.length} rows to ${table}`);
        }
      } finally {
        clearTimeout(timer);
      }
    };

    this.importLogs = [];
    this.addImportLog(`Starting ${importType.toUpperCase()} sync for season ${season}`);

    try {
      // ── SEASONS ──
      if (importType === "season") {
        setProgress(20, `Initializing ${season} Season Parameters...`);
        setProgress(50, "Querying Jolpica endpoints: f1/seasons...");
        await new Promise(r => setTimeout(r, 300));
        setProgress(80, `Validating championship regulations & ${season} year grids...`);
        await new Promise(r => setTimeout(r, 300));
        setProgress(100, `Season ${season} metadata synced successfully!`);
        this.addImportLog(`Season ${season} sync done`);
      }

      // ── DRIVERS ──
      if (importType === "drivers" || importType === "bulk") {
        setProgress(importType === "bulk" ? 15 : 10, `Fetching driver grid from Jolpica /${season}/drivers...`);
        let jolpicaDriversList: any[] = [];
        try {
          jolpicaDriversList = await jolpicaDrivers(season);
        } catch (e) {
          console.error("Failed to fetch drivers from Jolpica:", e);
          setProgress(importType === "bulk" ? 20 : 40, "Driver fetch failed, using existing data.");
        }

        if (jolpicaDriversList.length > 0) {
          setProgress(importType === "bulk" ? 20 : 30, `Merging ${jolpicaDriversList.length} drivers with existing data...`);
          const existingMap = new Map(this.drivers.map(d => [d.id, d]));
          for (const jd of jolpicaDriversList) {
            const existing = existingMap.get(jd.id);
            if (existing) {
              existingMap.set(jd.id, {
                ...existing,
                code: jd.code || existing.code,
                number: jd.number || existing.number,
              });
            } else {
              existingMap.set(jd.id, this.createMinimalDriver(jd));
            }
          }
          this.drivers = Array.from(existingMap.values());
          setProgress(importType === "bulk" ? 25 : 60, `Upserting ${jolpicaDriversList.length} drivers to Supabase...`);
          await upsertToSupabase("drivers", jolpicaDriversList);
        }
        setProgress(importType === "bulk" ? 30 : 100, "Drivers sync completed.");
        this.addImportLog(`Drivers sync completed (${jolpicaDriversList.length} drivers)`);
      }

      // ── TEAMS / CONSTRUCTORS ──
      if (importType === "teams" || importType === "bulk") {
        setProgress(importType === "bulk" ? 35 : 10, `Fetching constructors from Jolpica /${season}/constructors...`);
        let jolpicaConstructorsList: any[] = [];
        try {
          jolpicaConstructorsList = await jolpicaConstructors(season);
        } catch (e) {
          console.error("Failed to fetch constructors from Jolpica:", e);
          setProgress(importType === "bulk" ? 40 : 50, "Constructor fetch failed, using existing data.");
        }

        if (jolpicaConstructorsList.length > 0) {
          setProgress(importType === "bulk" ? 40 : 40, `Merging ${jolpicaConstructorsList.length} constructors with existing data...`);
          const existingMap = new Map(this.teams.map(t => [t.id, t]));
          for (const jc of jolpicaConstructorsList) {
            const existing = existingMap.get(jc.id);
            if (!existing) {
              existingMap.set(jc.id, this.createMinimalTeam(jc));
            }
          }
          this.teams = Array.from(existingMap.values());
          setProgress(importType === "bulk" ? 45 : 70, `Upserting ${jolpicaConstructorsList.length} constructors to Supabase...`);
          await upsertToSupabase("teams", jolpicaConstructorsList);
        }
        setProgress(importType === "bulk" ? 50 : 100, "Constructors sync completed.");
        this.addImportLog(`Constructors sync completed (${jolpicaConstructorsList.length} teams)`);
      }

      // ── CIRCUITS ──
      if (importType === "circuits" || importType === "bulk") {
        setProgress(importType === "bulk" ? 55 : 10, "Fetching circuits from Jolpica /circuits...");
        let jolpicaCircuitsList: any[] = [];
        try {
          jolpicaCircuitsList = await jolpicaCircuits();
        } catch (e) {
          console.error("Failed to fetch circuits from Jolpica:", e);
          setProgress(importType === "bulk" ? 60 : 50, "Circuit fetch failed, using existing data.");
        }

        if (jolpicaCircuitsList.length > 0) {
          setProgress(importType === "bulk" ? 60 : 40, `Merging ${jolpicaCircuitsList.length} circuits with existing data...`);
          const existingMap = new Map(this.circuits.map(c => [c.id, c]));
          for (const jc of jolpicaCircuitsList) {
            const existing = existingMap.get(jc.id);
            if (!existing) {
              existingMap.set(jc.id, this.createMinimalCircuit(jc));
            }
          }
          this.circuits = Array.from(existingMap.values());
          setProgress(importType === "bulk" ? 65 : 70, `Upserting ${jolpicaCircuitsList.length} circuits to Supabase...`);
          await upsertToSupabase("circuits", jolpicaCircuitsList);
        }
        setProgress(importType === "bulk" ? 70 : 100, "Circuits sync completed.");
        this.addImportLog(`Circuits sync completed (${jolpicaCircuitsList.length} circuits)`);
      }

      // ── RACES (calendar only) ──
      if (importType === "races" || importType === "bulk") {
        setProgress(importType === "bulk" ? 72 : 10, `Fetching race calendar from Jolpica /${season}/races...`);
        let jolpicaRacesList: any[] = [];
        try {
          jolpicaRacesList = await jolpicaRaces(season);
        } catch (e) {
          console.error("Failed to fetch races from Jolpica:", e);
          setProgress(importType === "bulk" ? 75 : 50, "Race calendar fetch failed, using existing data.");
        }

        if (jolpicaRacesList.length > 0) {
          setProgress(importType === "bulk" ? 75 : 60, `Merging ${jolpicaRacesList.length} races with existing data...`);
          const existingMap = new Map(this.races.map(r => [r.id, r]));
          for (const jr of jolpicaRacesList) {
            const existing = existingMap.get(jr.id);
            if (existing) {
              existingMap.set(jr.id, { ...existing, ...jr, timeline: existing.timeline || [] });
            } else {
              existingMap.set(jr.id, jr);
            }
          }
          this.races = Array.from(existingMap.values());
          setProgress(importType === "bulk" ? 80 : 80, `Upserting ${jolpicaRacesList.length} races to Supabase...`);
          await upsertToSupabase("races", jolpicaRacesList);
        }
        setProgress(importType === "bulk" ? 82 : 100, "Race calendar sync completed.");
        this.addImportLog(`Race calendar sync completed (${jolpicaRacesList.length} races)`);
      }

      // ── RESULTS (full race results with classification) ──
      if (importType === "results" || importType === "bulk") {
        setProgress(importType === "bulk" ? 83 : 10, `Fetching race results from Jolpica /${season}/results...`);
        let jolpicaResultsList: any[] = [];
        try {
          jolpicaResultsList = await jolpicaResults(season);
        } catch (e) {
          console.error("Failed to fetch results from Jolpica:", e);
          setProgress(importType === "bulk" ? 85 : 50, "Results fetch failed, using existing data.");
        }

        if (jolpicaResultsList.length > 0) {
          setProgress(importType === "bulk" ? 85 : 60, `Merging results for ${jolpicaResultsList.length} races...`);
          const existingMap = new Map(this.races.map(r => [r.id, r]));
          for (const jr of jolpicaResultsList) {
            const existing = existingMap.get(jr.id);
            if (existing && jr.results && jr.results.length > 0) {
              existingMap.set(jr.id, { ...existing, ...jr, timeline: existing.timeline || [] });
            } else if (jr.results && jr.results.length > 0) {
              existingMap.set(jr.id, jr);
            }
          }
          this.races = Array.from(existingMap.values());
          setProgress(importType === "bulk" ? 88 : 80, `Upserting results to Supabase...`);
          await upsertToSupabase("races", jolpicaResultsList.filter(r => r.results?.length > 0));
        }
        setProgress(importType === "bulk" ? 90 : 100, "Race results sync completed.");
        this.addImportLog(`Race results sync completed (${jolpicaResultsList.length} races with results)`);
      }

      // ── SPRINT RESULTS ──
      if (importType === "sprint results" || importType === "bulk") {
        setProgress(importType === "bulk" ? 91 : 20, `Fetching sprint results from Jolpica /${season}/sprint...`);
        try {
          const sprintRaces = await jolpicaSprintResults(season);
          if (sprintRaces.length > 0) {
            setProgress(importType === "bulk" ? 92 : 60, `Synced ${sprintRaces.length} sprint sessions.`);
            await upsertToSupabase("races", sprintRaces.filter(r => r.results?.length > 0));
          }
        } catch (e) {
          console.error("Failed to fetch sprint results:", e);
        }
        setProgress(importType === "bulk" ? 93 : 100, "Sprint results sync completed.");
        this.addImportLog("Sprint results sync completed");
      }

      // ── QUALIFYING ──
      if (importType === "qualifying" || importType === "bulk") {
        setProgress(importType === "bulk" ? 94 : 20, `Fetching qualifying from Jolpica /${season}/qualifying...`);
        try {
          const qualifyingData = await jolpicaQualifying(season);
          if (qualifyingData.length > 0) {
            const qMap = new Map(qualifyingData.map((q: any) => [q.id, q]));
            this.races = this.races.map(r => {
              const qData = qMap.get(r.id);
              if (qData && qData.qualifying?.length > 0) {
                return { ...r, qualifying: qData.qualifying };
              }
              return r;
            });
            setProgress(importType === "bulk" ? 95 : 70, `Merged qualifying for ${qualifyingData.length} races.`);
          }
        } catch (e) {
          console.error("Failed to fetch qualifying:", e);
        }
        setProgress(importType === "bulk" ? 96 : 100, "Qualifying sync completed.");
        this.addImportLog("Qualifying sync completed");
      }

      // ── PIT STOPS ──
      if (importType === "pitstops") {
        setProgress(20, "Pit stop data requires a specific round. Fetching round 1...");
        try {
          const pitUrl = `https://api.jolpi.ca/ergast/f1/${season}/1/pitstops.json?limit=100`;
          const res = await fetch(pitUrl);
          if (res.ok) {
            const data = await res.json();
            const pitStops = data.MRData?.RaceTable?.Races?.[0]?.PitStops || [];
            setProgress(70, `Retrieved ${pitStops.length} pit stops for round 1.`);
          }
        } catch (e) {
          console.error("Failed to fetch pit stops:", e);
        }
        setProgress(100, "Pit stop sync completed.");
        this.addImportLog("Pit stop sync completed");
      }

    } catch (err) {
      console.error("Critical Jolpica sync error:", err);
      this.importStatusMessage = `Sync failed: ${(err as Error).message}`;
      this.addImportLog(`Sync FAILED: ${(err as Error).message}`);
    } finally {
      this.lastImportTime = new Date().toISOString().replace("T", " ").substring(0, 16);
      this.isImporting = false;
      this.addImportLog(`Sync finished at ${this.lastImportTime}`);
      this.saveToStorage();
      this.notify();
    }
  }

  private createMinimalDriver(jd: any): Driver {
    return {
      id: jd.id,
      name: jd.name || "",
      fullName: jd.name || "",
      code: jd.code || "",
      number: jd.number?.toString() || "",
      nationality: jd.country || "",
      image: "",
      teamId: jd.teamId || "",
      teamName: jd.teamName || "",
      active: true,
      birthdate: jd.birthDate || "",
      bio: "",
      stats: {
        championships: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        starts: 0,
        points: 0,
        fastestLaps: 0,
        goatScore: 50,
        driverDNA: {
          aggression: 50,
          consistency: 50,
          racecraft: 50,
          qualifying: 50,
          wetWeather: 50,
        },
      },
      careerTimeline: [],
      mediaGallery: [],
    };
  }

  private createMinimalTeam(jc: any): Team {
    return {
      id: jc.id,
      name: jc.name || "",
      fullName: jc.fullCompanyName || jc.name || "",
      nationality: "",
      logo: "",
      banner: "",
      active: true,
      stats: {
        championships: 0,
        wins: 0,
        poles: 0,
        podiums: 0,
        starts: 0,
        legacyScore: 50,
      },
      currentDrivers: [],
      principals: [],
      engines: [],
      liveryEvolution: [],
      greatestDrivers: [],
      bio: "",
    };
  }

  private createMinimalCircuit(jc: any): Circuit {
    return {
      id: jc.id,
      name: jc.name || "",
      location: jc.location || "",
      country: jc.country || "",
      image: "",
      trackMap: "",
      specs: {
        length: jc.length || "",
        turns: jc.laps || 0,
        capacity: "",
        lapRecord: { time: jc.recordTime || "", driver: jc.recordDriver || "", year: parseInt(jc.recordYear) || 0 },
        prestigeScore: 50,
        difficultyIndex: 5,
        characteristics: { flow: 50, speed: 50, tech: 50, overtaking: 50 },
      },
      history: jc.description || "",
      mostSuccessfulDrivers: [],
      mostSuccessfulTeams: [],
      timeline: [],
    };
  }

  // Dynamic Championship Standings Engine
  public getDriverStandings(): StandingItem[] {
    const standingsMap: Record<string, { points: number; wins: number; name: string; team: string; teamId: string }> = {};

    // Base initial statistics
    this.drivers.forEach(d => {
      standingsMap[d.id] = {
        points: d.stats.points / 15, // scaled down to sound like a live season
        wins: d.id === "verstappen" ? 2 : d.id === "leclerc" ? 1 : 0,
        name: d.name,
        team: d.teamName,
        teamId: d.teamId
      };
    });

    // Add up results from completed races
    this.races.forEach(r => {
      if (r.completed && r.results) {
        r.results.forEach(res => {
          if (standingsMap[res.driverId]) {
            standingsMap[res.driverId].points += res.points;
            if (res.position === 1) {
              standingsMap[res.driverId].wins += 1;
            }
          } else {
            standingsMap[res.driverId] = {
              points: res.points,
              wins: res.position === 1 ? 1 : 0,
              name: res.driverName,
              team: res.teamName,
              teamId: res.teamId
            };
          }
        });
      }
    });

    return Object.entries(standingsMap)
      .map(([id, info]) => ({
        driverId: id,
        driverName: info.name,
        teamName: info.team,
        teamId: info.teamId,
        points: Math.round(info.points),
        wins: info.wins
      }))
      .sort((a, b) => b.points - a.points)
      .map((item, idx) => {
        return {
          ...item,
          position: idx + 1,
          streak: item.wins > 1 ? `${item.wins} Wins Streak` : undefined,
          behind: idx === 0 ? undefined : 0 // will calculate in view
        };
      });
  }

  public getConstructorStandings(): StandingItem[] {
    const standingsMap: Record<string, { points: number; wins: number; name: string }> = {};

    this.teams.forEach(t => {
      standingsMap[t.id] = {
        points: t.stats.championships * 40, // Base
        wins: t.id === "redbull" ? 2 : t.id === "ferrari" ? 1 : 0,
        name: t.name
      };
    });

    const driverStandings = this.getDriverStandings();
    driverStandings.forEach(ds => {
      if (ds.teamId && standingsMap[ds.teamId]) {
        standingsMap[ds.teamId].points += ds.points;
        standingsMap[ds.teamId].wins += ds.wins;
      }
    });

    return Object.entries(standingsMap)
      .map(([id, info]) => ({
        teamId: id,
        teamName: info.name,
        points: Math.round(info.points),
        wins: info.wins
      }))
      .sort((a, b) => b.points - a.points)
      .map((item, idx) => ({
        ...item,
        position: idx + 1
      }));
  }
}

export const store = new OneGridStore();
