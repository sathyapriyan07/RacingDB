/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DriverStats {
  championships: number;
  wins: number;
  podiums: number;
  poles: number;
  starts: number;
  points: number;
  fastestLaps: number;
  goatScore: number; // Out of 100
  driverDNA: {
    aggression: number; // 0-100
    consistency: number;
    racecraft: number;
    qualifying: number;
    wetWeather: number;
  };
}

export interface Driver {
  id: string;
  name: string;
  fullName: string;
  code: string;
  number: string;
  nationality: string;
  image: string;
  teamId: string;
  teamName: string;
  active: boolean;
  birthdate: string;
  bio: string;
  stats: DriverStats;
  careerTimeline: {
    year: number;
    team: string;
    standing: number;
    wins: number;
  }[];
  mediaGallery: string[];
}

export interface TeamStats {
  championships: number;
  wins: number;
  poles: number;
  podiums: number;
  starts: number;
  legacyScore: number; // Out of 100
}

export interface Team {
  id: string;
  name: string;
  fullName: string;
  nationality: string;
  logo: string;
  banner: string;
  active: boolean;
  stats: TeamStats;
  currentDrivers: string[]; // Driver IDs
  principals: { period: string; name: string }[];
  engines: { period: string; name: string }[];
  liveryEvolution: { year: number; imageUrl: string; name: string }[];
  greatestDrivers: { name: string; championships: number; wins: number }[];
  bio: string;
}

export interface CircuitSpecs {
  length: string; // e.g. "5.891 km"
  turns: number;
  capacity: string;
  lapRecord: { time: string; driver: string; year: number };
  prestigeScore: number; // Out of 100
  difficultyIndex: number; // Out of 10
  characteristics: { flow: number; speed: number; tech: number; overtaking: number };
}

export interface Circuit {
  id: string;
  name: string;
  location: string;
  country: string;
  image: string;
  trackMap: string; // SVG or simplified SVG path/sketch
  specs: CircuitSpecs;
  history: string;
  mostSuccessfulDrivers: { name: string; wins: number }[];
  mostSuccessfulTeams: { name: string; wins: number }[];
  timeline: { year: number; event: string }[];
}

export interface RaceResult {
  position: number;
  grid: number;
  driverId: string;
  driverName: string;
  driverCode: string;
  teamId: string;
  teamName: string;
  time: string;
  points: number;
  status: string;
  fastestLap?: boolean;
}

export interface StartingGridItem {
  position: number;
  driverId: string;
  driverName: string;
  teamName: string;
  time: string;
}

export interface QualifyingResult {
  position: number;
  driverId: string;
  driverName: string;
  teamName: string;
  q1: string;
  q2?: string;
  q3?: string;
}

export interface PracticeResult {
  session: "FP1" | "FP2" | "FP3";
  results: {
    position: number;
    driverName: string;
    teamName: string;
    time: string;
    laps: number;
  }[];
}

export interface PitStop {
  lap: number;
  driverName: string;
  teamName: string;
  duration: string;
}

export interface RaceTimelineEvent {
  lap: number;
  title: string;
  description: string;
  type: "incident" | "overtake" | "lead-change" | "pit-stop";
}

export interface Race {
  id: string;
  name: string;
  round: number;
  circuitId: string;
  circuitName: string;
  date: string;
  time: string;
  completed: boolean;
  results?: RaceResult[];
  startingGrid?: StartingGridItem[];
  qualifying?: QualifyingResult[];
  practice?: PracticeResult[];
  pitStops?: PitStop[];
  timeline?: RaceTimelineEvent[];
  fastestLap?: { driverId: string; driverName: string; time: string };
  driverOfTheDayId?: string;
  winnerId?: string;
  championshipImpact?: string;
}

export interface Rivalry {
  id: string;
  title: string;
  subtitle: string;
  driver1Id: string;
  driver2Id: string;
  summary: string;
  stats: {
    metric: string;
    d1Value: string | number;
    d2Value: string | number;
  }[];
  timeline: { year: string; event: string }[];
  stories: { title: string; text: string }[];
  image: string;
}

export interface GreatestCar {
  id: string;
  name: string;
  teamName: string;
  year: number;
  specs: {
    engine: string;
    weight: string;
    power: string;
    designer: string;
  };
  achievements: string[];
  driverPairings: string[];
  image: string;
  description: string;
}

export interface OnThisDayEvent {
  id: string;
  day: number;
  month: number;
  year: number;
  type: "win" | "birth" | "championship" | "tragedy" | "milestone";
  title: string;
  description: string;
  image?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  category: "news" | "analysis" | "opinion" | "historical";
  imageUrl: string;
  featured: boolean;
}

export interface StandingItem {
  position: number;
  driverName?: string;
  driverId?: string;
  teamName: string;
  teamId?: string;
  points: number;
  wins: number;
  behind?: number;
  streak?: string;
}
