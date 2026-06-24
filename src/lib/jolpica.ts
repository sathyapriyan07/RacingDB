const BASE = "https://api.jolpi.ca/ergast/f1";

interface JolpicaResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    [key: string]: any;
  };
}

async function fetchJolpica(path: string, timeoutMs: number = 15000): Promise<any> {
  const url = `${BASE}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Jolpica API error: ${res.status} ${res.statusText} for ${url}`);
    const json: JolpicaResponse = await res.json();
    return json.MRData;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchSeasons(): Promise<{ season: string; url: string }[]> {
  const data = await fetchJolpica("/seasons.json?limit=100");
  return data.SeasonTable?.Seasons || [];
}

export async function fetchDrivers(season: string = "2026"): Promise<any[]> {
  const data = await fetchJolpica(`/${season}/drivers.json?limit=50`);
  return data.DriverTable?.Drivers || [];
}

export async function fetchConstructors(season: string = "2026"): Promise<any[]> {
  const data = await fetchJolpica(`/${season}/constructors.json?limit=50`);
  return data.ConstructorTable?.Constructors || [];
}

export async function fetchCircuits(): Promise<any[]> {
  const data = await fetchJolpica("/circuits.json?limit=100");
  return data.CircuitTable?.Circuits || [];
}

export async function fetchRaces(season: string = "2026"): Promise<any[]> {
  const data = await fetchJolpica(`/${season}/races.json?limit=50`);
  return data.RaceTable?.Races || [];
}

export async function fetchResults(season: string = "2026"): Promise<any[]> {
  const data = await fetchJolpica(`/${season}/results.json?limit=100`);
  return data.RaceTable?.Races || [];
}

export async function fetchSprintResults(season: string = "2026"): Promise<any[]> {
  const data = await fetchJolpica(`/${season}/sprint.json?limit=100`);
  return data.RaceTable?.Races || [];
}

export async function fetchQualifying(season: string = "2026"): Promise<any[]> {
  const data = await fetchJolpica(`/${season}/qualifying.json?limit=100`);
  return data.RaceTable?.Races || [];
}

export async function fetchDriverStandings(season: string = "2026"): Promise<any[]> {
  const data = await fetchJolpica(`/${season}/driverstandings.json?limit=50`);
  return data.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
}

export async function fetchConstructorStandings(season: string = "2026"): Promise<any[]> {
  const data = await fetchJolpica(`/${season}/constructorstandings.json?limit=50`);
  return data.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function mapDriver(jolpicaDriver: any): any {
  const id = jolpicaDriver.driverId;
  const givenName = jolpicaDriver.givenName || "";
  const familyName = jolpicaDriver.familyName || "";
  const fullName = `${givenName} ${familyName}`;
  const code = jolpicaDriver.code || "";
  const number = jolpicaDriver.permanentNumber || "";
  const nationality = jolpicaDriver.nationality || "";
  const birthDate = jolpicaDriver.dateOfBirth || "";

  return {
    id,
    name: fullName.trim(),
    code,
    teamId: "",
    teamName: "",
    country: nationality,
    number: number ? parseInt(number, 10) : null,
    birthDate,
    biography: "",
    imageUrl: "",
    stats: null,
  };
}

function mapConstructor(jolpicaConstructor: any): any {
  const id = jolpicaConstructor.constructorId;
  const name = jolpicaConstructor.name || "";
  const nationality = jolpicaConstructor.nationality || "";

  return {
    id,
    name,
    fullCompanyName: name,
    base: "",
    teamPrincipal: "",
    chassis: "",
    engine: "",
    championships: 0,
    imageUrl: "",
    stats: null,
  };
}

function mapCircuit(jolpicaCircuit: any): any {
  const id = jolpicaCircuit.circuitId;
  const name = jolpicaCircuit.circuitName || "";
  const location = jolpicaCircuit.Location || {};
  const locality = location.locality || "";
  const country = location.country || "";

  return {
    id,
    name,
    location: locality ? `${locality}, ${country}` : country,
    country,
    length: "",
    laps: null,
    recordTime: "",
    recordDriver: "",
    recordYear: "",
    description: "",
    mapImageUrl: "",
  };
}

function mapRace(jolpicaRace: any): any {
  const id = `${jolpicaRace.season}-${String(jolpicaRace.round).padStart(2, "0")}-${slugify(jolpicaRace.raceName)}`;
  const round = parseInt(jolpicaRace.round, 10);
  const name = jolpicaRace.raceName || "";
  const circuit = jolpicaRace.Circuit || {};
  const circuitId = circuit.circuitId || "";
  const circuitName = circuit.circuitName || "";
  const date = jolpicaRace.date || "";
  const time = jolpicaRace.time ? jolpicaRace.time.replace("Z", "").substring(0, 5) : "";
  const results = (jolpicaRace.Results || []).map((r: any) => {
    const driver = r.Driver || {};
    const constructor = r.Constructor || {};
    const driverName = `${driver.givenName || ""} ${driver.familyName || ""}`.trim();
    const timeStr = r.Time?.time || "";
    const fastestLap = r.FastestLap?.Time?.time || null;
    return {
      position: parseInt(r.position, 10),
      grid: parseInt(r.grid, 10),
      driverId: driver.driverId || "",
      driverName: driverName || `${driver.givenName || ""} ${driver.familyName || ""}`.trim(),
      driverCode: driver.code || "",
      teamId: constructor.constructorId || "",
      teamName: constructor.name || "",
      time: timeStr,
      points: parseInt(r.points, 10) || 0,
      status: r.status || "",
      fastestLap: fastestLap ? true : undefined,
    };
  });
  const winnerResult = results.find((r: any) => r.position === 1);
  const fastestLapResult = results.find((r: any) => r.fastestLap);
  const fastestLap = fastestLapResult
    ? {
        driverId: fastestLapResult.driverId,
        driverName: fastestLapResult.driverName,
        time: fastestLapResult.time,
      }
    : null;

  return {
    id,
    name,
    round,
    date,
    time,
    circuitId,
    circuitName,
    completed: results.length > 0,
    winnerId: winnerResult?.driverId || null,
    fastestLap,
    driverOfTheDayId: null,
    championshipImpact: "",
    results: results.length > 0 ? results : null,
    startingGrid: [],
    qualifying: [],
    pitStops: [],
    timeline: [],
  };
}

function mapQualifying(jolpicaRace: any): any {
  const round = parseInt(jolpicaRace.round, 10);
  const name = jolpicaRace.raceName || "";
  const id = `${jolpicaRace.season}-${String(round).padStart(2, "0")}-${slugify(name)}`;
  const qualifyingResults = (jolpicaRace.QualifyingResults || []).map((q: any) => {
    const driver = q.Driver || {};
    const constructor = q.Constructor || {};
    const driverName = `${driver.givenName || ""} ${driver.familyName || ""}`.trim();
    return {
      position: parseInt(q.position, 10),
      driverId: driver.driverId || "",
      driverName,
      teamName: constructor.name || "",
      q1: q.Q1 || "",
      q2: q.Q2 || "",
      q3: q.Q3 || "",
    };
  });
  return { id, qualifying: qualifyingResults };
}

export async function syncDrivers(season: string = "2026"): Promise<any[]> {
  const raw = await fetchDrivers(season);
  return raw.map(mapDriver);
}

export async function syncConstructors(season: string = "2026"): Promise<any[]> {
  const raw = await fetchConstructors(season);
  return raw.map(mapConstructor);
}

export async function syncCircuits(): Promise<any[]> {
  const raw = await fetchCircuits();
  return raw.map(mapCircuit);
}

export async function syncRaces(season: string = "2026"): Promise<any[]> {
  const raw = await fetchRaces(season);
  return raw.map(mapRace);
}

export async function syncResults(season: string = "2026"): Promise<any[]> {
  const raw = await fetchResults(season);
  return raw.map(mapRace);
}

export async function syncSprintResults(season: string = "2026"): Promise<any[]> {
  const raw = await fetchSprintResults(season);
  return raw.map(mapRace);
}

export async function syncQualifying(season: string = "2026"): Promise<any[]> {
  const raw = await fetchQualifying(season);
  return raw.filter((r: any) => r.QualifyingResults?.length).map(mapQualifying);
}

export async function syncDriverStandings(season: string = "2026") {
  return fetchDriverStandings(season);
}

export async function syncConstructorStandings(season: string = "2026") {
  return fetchConstructorStandings(season);
}
