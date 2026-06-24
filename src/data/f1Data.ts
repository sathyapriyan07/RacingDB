/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Driver, Team, Circuit, Race, Rivalry, GreatestCar, OnThisDayEvent, Article } from "../types";

export const DRIVERS: Driver[] = [
  {
    id: "hamilton",
    name: "Lewis Hamilton",
    fullName: "Sir Lewis Carl Davidson Hamilton",
    code: "HAM",
    number: "44",
    nationality: "British",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop",
    teamId: "ferrari",
    teamName: "Scuderia Ferrari",
    active: true,
    birthdate: "1985-01-07",
    bio: "The most successful driver in Formula 1 history by many metrics, Sir Lewis Hamilton holds the record for most wins, pole positions, and podium finishes. Having won 6 titles with Mercedes and 1 with McLaren, his blockbuster transfer to Ferrari stands as one of the biggest moves in sporting history.",
    stats: {
      championships: 7,
      wins: 105,
      podiums: 198,
      poles: 104,
      starts: 350,
      points: 4725.5,
      fastestLaps: 67,
      goatScore: 99,
      driverDNA: {
        aggression: 80,
        consistency: 96,
        racecraft: 98,
        qualifying: 97,
        wetWeather: 98
      }
    },
    careerTimeline: [
      { year: 2007, team: "McLaren", standing: 2, wins: 4 },
      { year: 2008, team: "McLaren", standing: 1, wins: 5 },
      { year: 2014, team: "Mercedes", standing: 1, wins: 11 },
      { year: 2015, team: "Mercedes", standing: 1, wins: 10 },
      { year: 2017, team: "Mercedes", standing: 1, wins: 9 },
      { year: 2018, team: "Mercedes", standing: 1, wins: 11 },
      { year: 2019, team: "Mercedes", standing: 1, wins: 11 },
      { year: 2020, team: "Mercedes", standing: 1, wins: 11 },
      { year: 2021, team: "Mercedes", standing: 2, wins: 8 },
      { year: 2024, team: "Mercedes", standing: 6, wins: 2 }
    ],
    mediaGallery: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop"
    ]
  },
  {
    id: "verstappen",
    name: "Max Verstappen",
    fullName: "Max Emilian Verstappen",
    code: "VER",
    number: "1",
    nationality: "Dutch",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop",
    teamId: "redbull",
    teamName: "Red Bull Racing",
    active: true,
    birthdate: "1997-09-30",
    bio: "Formula 1's youngest-ever race winner, Max Verstappen has rewritten the record books with his ruthless speed and tactical dominance. Operating in a state of absolute synergy with Red Bull Racing, he secured multiple consecutive world championships, establishing himself as a modern-day titan of the sport.",
    stats: {
      championships: 3,
      wins: 62,
      podiums: 110,
      poles: 40,
      starts: 206,
      points: 2950,
      fastestLaps: 32,
      goatScore: 95,
      driverDNA: {
        aggression: 96,
        consistency: 98,
        racecraft: 95,
        qualifying: 94,
        wetWeather: 97
      }
    },
    careerTimeline: [
      { year: 2015, team: "Toro Rosso", standing: 12, wins: 0 },
      { year: 2016, team: "Red Bull", standing: 5, wins: 1 },
      { year: 2021, team: "Red Bull", standing: 1, wins: 10 },
      { year: 2022, team: "Red Bull", standing: 1, wins: 15 },
      { year: 2023, team: "Red Bull", standing: 1, wins: 19 },
      { year: 2024, team: "Red Bull", standing: 1, wins: 9 }
    ],
    mediaGallery: []
  },
  {
    id: "leclerc",
    name: "Charles Leclerc",
    fullName: "Charles Marc Hervé Perceval Leclerc",
    code: "LEC",
    number: "16",
    nationality: "Monegasque",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=600&auto=format&fit=crop",
    teamId: "ferrari",
    teamName: "Scuderia Ferrari",
    active: true,
    birthdate: "1997-10-16",
    bio: "Ferrari's beloved star, Charles Leclerc is renowned for his extraordinary one-lap qualifying pace. The Monegasque prodigy carries the dreams of Italy on his shoulders, driving with a combination of raw passion, loyalty, and unmatched natural speed.",
    stats: {
      championships: 0,
      wins: 8,
      podiums: 41,
      poles: 26,
      starts: 145,
      points: 1380,
      fastestLaps: 10,
      goatScore: 82,
      driverDNA: {
        aggression: 88,
        consistency: 85,
        racecraft: 89,
        qualifying: 98,
        wetWeather: 84
      }
    },
    careerTimeline: [
      { year: 2018, team: "Sauber", standing: 13, wins: 0 },
      { year: 2019, team: "Ferrari", standing: 4, wins: 2 },
      { year: 2022, team: "Ferrari", standing: 2, wins: 3 },
      { year: 2024, team: "Ferrari", standing: 3, wins: 3 }
    ],
    mediaGallery: []
  },
  {
    id: "norris",
    name: "Lando Norris",
    fullName: "Lando Norris",
    code: "NOR",
    number: "4",
    nationality: "British",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600&auto=format&fit=crop",
    teamId: "mclaren",
    teamName: "McLaren F1 Team",
    active: true,
    birthdate: "1999-11-13",
    bio: "Lando Norris is the face of McLaren's modern renaissance. Pairing a highly engaging personality off-track with lethal, surgical precision on-track, Norris has emerged as a premier championship contender in modern F1, leading McLaren's surge back to the front.",
    stats: {
      championships: 0,
      wins: 4,
      podiums: 25,
      poles: 8,
      starts: 125,
      points: 980,
      fastestLaps: 8,
      goatScore: 83,
      driverDNA: {
        aggression: 84,
        consistency: 91,
        racecraft: 88,
        qualifying: 90,
        wetWeather: 87
      }
    },
    careerTimeline: [
      { year: 2019, team: "McLaren", standing: 11, wins: 0 },
      { year: 2021, team: "McLaren", standing: 6, wins: 0 },
      { year: 2024, team: "McLaren", standing: 2, wins: 3 }
    ],
    mediaGallery: []
  },
  {
    id: "alonso",
    name: "Fernando Alonso",
    fullName: "Fernando Alonso Díaz",
    code: "ALO",
    number: "14",
    nationality: "Spanish",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop",
    teamId: "astonmartin",
    teamName: "Aston Martin F1 Team",
    active: true,
    birthdate: "1981-07-29",
    bio: "A true tactical mastermind, Fernando Alonso is widely considered one of the most complete drivers in motorsport history. A two-time World Champion who broke Schumacher's dominance in the mid-2000s, Alonso continues to perform at an elite level, defying father time in his fifth decade.",
    stats: {
      championships: 2,
      wins: 32,
      podiums: 106,
      poles: 22,
      starts: 395,
      points: 2310,
      fastestLaps: 26,
      goatScore: 94,
      driverDNA: {
        aggression: 92,
        consistency: 95,
        racecraft: 99,
        qualifying: 89,
        wetWeather: 93
      }
    },
    careerTimeline: [
      { year: 2001, team: "Minardi", standing: 23, wins: 0 },
      { year: 2003, team: "Renault", standing: 6, wins: 1 },
      { year: 2005, team: "Renault", standing: 1, wins: 7 },
      { year: 2006, team: "Renault", standing: 1, wins: 7 },
      { year: 2007, team: "McLaren", standing: 3, wins: 4 },
      { year: 2010, team: "Ferrari", standing: 2, wins: 5 },
      { year: 2012, team: "Ferrari", standing: 2, wins: 3 },
      { year: 2023, team: "Aston Martin", standing: 4, wins: 0 }
    ],
    mediaGallery: []
  },
  {
    id: "senna",
    name: "Ayrton Senna",
    fullName: "Ayrton Senna da Silva",
    code: "SEN",
    number: "12",
    nationality: "Brazilian",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    teamId: "mclaren_classic",
    teamName: "McLaren Classic",
    active: false,
    birthdate: "1960-03-21",
    bio: "An enigmatic figure whose intense driving style, unparalleled speed in the wet, and spiritual approach to racing captured the world's imagination. A three-time World Champion with McLaren, his qualifying speed and epic battles with Alain Prost represent the golden era of Formula 1.",
    stats: {
      championships: 3,
      wins: 41,
      podiums: 80,
      poles: 65,
      starts: 161,
      points: 614,
      fastestLaps: 19,
      goatScore: 98,
      driverDNA: {
        aggression: 99,
        consistency: 92,
        racecraft: 95,
        qualifying: 100,
        wetWeather: 100
      }
    },
    careerTimeline: [
      { year: 1984, team: "Toleman", standing: 9, wins: 0 },
      { year: 1985, team: "Lotus", standing: 4, wins: 2 },
      { year: 1988, team: "McLaren", standing: 1, wins: 8 },
      { year: 1989, team: "McLaren", standing: 2, wins: 6 },
      { year: 1990, team: "McLaren", standing: 1, wins: 6 },
      { year: 1991, team: "McLaren", standing: 1, wins: 7 },
      { year: 1993, team: "McLaren", standing: 2, wins: 5 }
    ],
    mediaGallery: []
  },
  {
    id: "schumacher",
    name: "Michael Schumacher",
    fullName: "Michael Schumacher",
    code: "MSC",
    number: "5",
    nationality: "German",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600&auto=format&fit=crop",
    teamId: "ferrari_classic",
    teamName: "Ferrari Classic",
    active: false,
    birthdate: "1969-01-03",
    bio: "The absolute icon of Scuderia Ferrari, Michael Schumacher redefined fitness, technical understanding, and team integration in Formula 1. Securing seven world championships, including an unprecedented streak of five consecutive titles, he brought Ferrari back to absolute dominance.",
    stats: {
      championships: 7,
      wins: 91,
      podiums: 155,
      poles: 68,
      starts: 308,
      points: 1566,
      fastestLaps: 77,
      goatScore: 98,
      driverDNA: {
        aggression: 95,
        consistency: 97,
        racecraft: 97,
        qualifying: 93,
        wetWeather: 99
      }
    },
    careerTimeline: [
      { year: 1991, team: "Jordan/Benetton", standing: 14, wins: 0 },
      { year: 1994, team: "Benetton", standing: 1, wins: 8 },
      { year: 1995, team: "Benetton", standing: 1, wins: 9 },
      { year: 1996, team: "Ferrari", standing: 3, wins: 3 },
      { year: 2000, team: "Ferrari", standing: 1, wins: 9 },
      { year: 2001, team: "Ferrari", standing: 1, wins: 9 },
      { year: 2002, team: "Ferrari", standing: 1, wins: 11 },
      { year: 2003, team: "Ferrari", standing: 1, wins: 6 },
      { year: 2004, team: "Ferrari", standing: 1, wins: 13 }
    ],
    mediaGallery: []
  },
  {
    id: "piastri",
    name: "Oscar Piastri",
    fullName: "Oscar Jack Piastri",
    code: "PIA",
    number: "81",
    nationality: "Australian",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=600&auto=format&fit=crop",
    teamId: "mclaren",
    teamName: "McLaren F1 Team",
    active: true,
    birthdate: "2001-04-06",
    bio: "Highly composed, ice-cool, and incredibly gifted, Oscar Piastri boasts one of the most stellar junior careers ever seen. Since entering F1, he has quickly matched veterans with his calm demeanor, blistering speed, and mature racecraft.",
    stats: {
      championships: 0,
      wins: 2,
      podiums: 9,
      poles: 0,
      starts: 44,
      points: 350,
      fastestLaps: 3,
      goatScore: 80,
      driverDNA: {
        aggression: 81,
        consistency: 90,
        racecraft: 89,
        qualifying: 88,
        wetWeather: 82
      }
    },
    careerTimeline: [
      { year: 2023, team: "McLaren", standing: 9, wins: 0 },
      { year: 2024, team: "McLaren", standing: 4, wins: 2 }
    ],
    mediaGallery: []
  },
  {
    id: "sainz",
    name: "Carlos Sainz",
    fullName: "Carlos Sainz Vázquez de Castro",
    code: "SAI",
    number: "55",
    nationality: "Spanish",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
    teamId: "williams",
    teamName: "Williams Racing",
    active: true,
    birthdate: "1994-09-01",
    bio: "Affectionately known as the 'Smooth Operator', Carlos Sainz is famous for his analytical approach and high racing intelligence. A multiple race winner with Ferrari, his transfer to Williams signifies an ambitious new era for both driver and team.",
    stats: {
      championships: 0,
      wins: 4,
      podiums: 23,
      poles: 5,
      starts: 203,
      points: 1120,
      fastestLaps: 4,
      goatScore: 81,
      driverDNA: {
        aggression: 83,
        consistency: 93,
        racecraft: 92,
        qualifying: 85,
        wetWeather: 81
      }
    },
    careerTimeline: [
      { year: 2015, team: "Toro Rosso", standing: 15, wins: 0 },
      { year: 2019, team: "McLaren", standing: 6, wins: 0 },
      { year: 2021, team: "Ferrari", standing: 5, wins: 0 },
      { year: 2023, team: "Ferrari", standing: 7, wins: 1 },
      { year: 2024, team: "Ferrari", standing: 5, wins: 2 }
    ],
    mediaGallery: []
  },
  {
    id: "russell",
    name: "George Russell",
    fullName: "George William Russell",
    code: "RUS",
    number: "63",
    nationality: "British",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    teamId: "mercedes",
    teamName: "Mercedes-AMG F1 Team",
    active: true,
    birthdate: "1998-02-15",
    bio: "George Russell represents the future of Mercedes-AMG. With blistering qualifying speed and an assertive driving style, Russell's leadership within the Silver Arrows has turned him into a formidable contender for race wins and titles.",
    stats: {
      championships: 0,
      wins: 3,
      podiums: 14,
      poles: 3,
      starts: 125,
      points: 620,
      fastestLaps: 7,
      goatScore: 81,
      driverDNA: {
        aggression: 86,
        consistency: 87,
        racecraft: 85,
        qualifying: 92,
        wetWeather: 86
      }
    },
    careerTimeline: [
      { year: 2019, team: "Williams", standing: 20, wins: 0 },
      { year: 2022, team: "Mercedes", standing: 4, wins: 1 },
      { year: 2024, team: "Mercedes", standing: 7, wins: 1 }
    ],
    mediaGallery: []
  }
];

export const TEAMS: Team[] = [
  {
    id: "ferrari",
    name: "Ferrari",
    fullName: "Scuderia Ferrari HP",
    nationality: "Italian",
    logo: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop",
    active: true,
    stats: {
      championships: 16,
      wins: 246,
      poles: 251,
      podiums: 815,
      starts: 1090,
      legacyScore: 100
    },
    currentDrivers: ["leclerc", "hamilton"],
    principals: [
      { period: "2023-Present", name: "Frédéric Vasseur" },
      { period: "2019-2022", name: "Mattia Binotto" },
      { period: "2014-2018", name: "Maurizio Arrivabene" },
      { period: "1993-2007", name: "Jean Todt" }
    ],
    engines: [
      { period: "1950-Present", name: "Ferrari" }
    ],
    liveryEvolution: [
      { year: 2026, imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=600&auto=format&fit=crop", name: "SF-26" },
      { year: 2024, imageUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600&auto=format&fit=crop", name: "SF-24" },
      { year: 2004, imageUrl: "https://images.unsplash.com/photo-1562591176-80db262bd02a?q=80&w=600&auto=format&fit=crop", name: "F2004" }
    ],
    greatestDrivers: [
      { name: "Michael Schumacher", championships: 5, wins: 72 },
      { name: "Niki Lauda", championships: 2, wins: 15 },
      { name: "Alberto Ascari", championships: 2, wins: 13 }
    ],
    bio: "Formula 1's oldest, most successful, and most iconic team. Founded by Enzo Ferrari, Scuderia Ferrari represents the heart, soul, and historical spine of the sport, operating under an intense global microscope."
  },
  {
    id: "redbull",
    name: "Red Bull Racing",
    fullName: "Oracle Red Bull Racing",
    nationality: "Austrian",
    logo: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
    active: true,
    stats: {
      championships: 6,
      wins: 120,
      poles: 103,
      podiums: 280,
      starts: 390,
      legacyScore: 92
    },
    currentDrivers: ["verstappen"],
    principals: [
      { period: "2005-Present", name: "Christian Horner" }
    ],
    engines: [
      { period: "2026-Present", name: "Red Bull Ford Powertrains" },
      { period: "2019-2025", name: "Honda" },
      { period: "2007-2018", name: "Renault" }
    ],
    liveryEvolution: [
      { year: 2026, imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop", name: "RB22" },
      { year: 2023, imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop", name: "RB19" }
    ],
    greatestDrivers: [
      { name: "Sebastian Vettel", championships: 4, wins: 38 },
      { name: "Max Verstappen", championships: 3, wins: 62 }
    ],
    bio: "Entering the sport in 2005 as a disruptor, Red Bull Racing quickly transitioned into a hyper-efficient winning machine under Christian Horner and engineering genius Adrian Newey."
  },
  {
    id: "mercedes",
    name: "Mercedes",
    fullName: "Mercedes-AMG PETRONAS F1 Team",
    nationality: "German",
    logo: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
    active: true,
    stats: {
      championships: 8,
      wins: 128,
      poles: 139,
      podiums: 295,
      starts: 320,
      legacyScore: 94
    },
    currentDrivers: ["russell"],
    principals: [
      { period: "2013-Present", name: "Toto Wolff" },
      { period: "2010-2012", name: "Ross Brawn" }
    ],
    engines: [
      { period: "2010-Present", name: "Mercedes" }
    ],
    liveryEvolution: [
      { year: 2026, imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop", name: "W17" },
      { year: 2020, imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop", name: "W11" }
    ],
    greatestDrivers: [
      { name: "Lewis Hamilton", championships: 6, wins: 84 },
      { name: "Nico Rosberg", championships: 1, wins: 23 },
      { name: "Juan Manuel Fangio", championships: 2, wins: 8 }
    ],
    bio: "The Silver Arrows dominated the turbo-hybrid era from 2014 to 2021, claiming an unprecedented eight consecutive Constructors' titles, demonstrating unmatched corporate excellence."
  },
  {
    id: "mclaren",
    name: "McLaren",
    fullName: "McLaren Formula 1 Team",
    nationality: "British",
    logo: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1200&auto=format&fit=crop",
    active: true,
    stats: {
      championships: 8,
      wins: 188,
      poles: 160,
      podiums: 505,
      starts: 970,
      legacyScore: 96
    },
    currentDrivers: ["norris", "piastri"],
    principals: [
      { period: "2023-Present", name: "Andrea Stella" },
      { period: "2019-2022", name: "Andreas Seidl" },
      { period: "1980-2009", name: "Ron Dennis" }
    ],
    engines: [
      { period: "2021-Present", name: "Mercedes" },
      { period: "2018-2020", name: "Renault" },
      { period: "1988-1992", name: "Honda" }
    ],
    liveryEvolution: [
      { year: 2026, imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600&auto=format&fit=crop", name: "MCL38" },
      { year: 1988, imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600&auto=format&fit=crop", name: "MP4/4" }
    ],
    greatestDrivers: [
      { name: "Ayrton Senna", championships: 3, wins: 35 },
      { name: "Alain Prost", championships: 3, wins: 30 },
      { name: "Mika Häkkinen", championships: 2, wins: 20 }
    ],
    bio: "Founded by Bruce McLaren in 1963, McLaren is the second-oldest active team in Formula 1. Its iconic papaya identity and legendary heritage are synonymous with motorsport innovation."
  },
  {
    id: "astonmartin",
    name: "Aston Martin",
    fullName: "Aston Martin Aramco F1 Team",
    nationality: "British",
    logo: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1200&auto=format&fit=crop",
    active: true,
    stats: {
      championships: 0,
      wins: 0,
      poles: 0,
      podiums: 9,
      starts: 90,
      legacyScore: 78
    },
    currentDrivers: ["alonso"],
    principals: [
      { period: "2022-Present", name: "Mike Krack" }
    ],
    engines: [
      { period: "2026-Present", name: "Honda" },
      { period: "2021-2025", name: "Mercedes" }
    ],
    liveryEvolution: [],
    greatestDrivers: [
      { name: "Fernando Alonso", championships: 0, wins: 0 }
    ],
    bio: "Backed by Lawrence Stroll and moving into a state-of-the-art campus, Aston Martin Racing represents one of the most ambitious engineering projects in Formula 1 history."
  },
  {
    id: "williams",
    name: "Williams",
    fullName: "Williams Racing",
    nationality: "British",
    logo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    active: true,
    stats: {
      championships: 9,
      wins: 114,
      poles: 128,
      podiums: 313,
      starts: 805,
      legacyScore: 93
    },
    currentDrivers: ["sainz"],
    principals: [
      { period: "2023-Present", name: "James Vowles" },
      { period: "1977-2013", name: "Sir Frank Williams" }
    ],
    engines: [
      { period: "2014-Present", name: "Mercedes" },
      { period: "1989-1997", name: "Renault" }
    ],
    liveryEvolution: [],
    greatestDrivers: [
      { name: "Nigel Mansell", championships: 1, wins: 28 },
      { name: "Alain Prost", championships: 1, wins: 7 },
      { name: "Damon Hill", championships: 1, wins: 21 }
    ],
    bio: "One of the absolute pillars of Formula 1 history, founded by the late Sir Frank Williams. Williams is on a dedicated modernization journey to restore its place at the top of the grid."
  }
];

export const CIRCUITS: Circuit[] = [
  {
    id: "silverstone",
    name: "Silverstone Circuit",
    location: "Silverstone, Northamptonshire",
    country: "Great Britain",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop",
    trackMap: "M10 80 Q30 20 60 40 T120 20 T180 80 T240 60 T300 120 Z",
    specs: {
      length: "5.891 km",
      turns: 18,
      capacity: "150,000",
      lapRecord: { time: "1:27.097", driver: "Max Verstappen", year: 2020 },
      prestigeScore: 98,
      difficultyIndex: 8,
      characteristics: { flow: 95, speed: 92, tech: 75, overtaking: 85 }
    },
    history: "The birthplace of Formula 1, hosting the first-ever World Championship race in 1950. Renowned for its high-speed sweeping corners like Copse, Maggots, and Becketts, Silverstone remains the ultimate tester of aerodynamic efficiency and driver bravery.",
    mostSuccessfulDrivers: [
      { name: "Lewis Hamilton", wins: 9 },
      { name: "Alain Prost", wins: 5 }
    ],
    mostSuccessfulTeams: [
      { name: "Ferrari", wins: 18 },
      { name: "McLaren", wins: 14 }
    ],
    timeline: [
      { year: 1950, event: "Hosted the inaugural Formula 1 Grand Prix" },
      { year: 1987, event: "Nigel Mansell makes legendary overtake on Piquet" },
      { year: 2020, event: "Hamilton wins on three wheels" },
      { year: 2024, event: "Lewis Hamilton wins a historic 9th British GP" }
    ]
  },
  {
    id: "monaco",
    name: "Circuit de Monaco",
    location: "Monte Carlo",
    country: "Monaco",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop",
    trackMap: "M10 50 Q40 10 90 40 T150 90 T210 50 T280 110 Z",
    specs: {
      length: "3.337 km",
      turns: 19,
      capacity: "37,000",
      lapRecord: { time: "1:12.909", driver: "Lewis Hamilton", year: 2021 },
      prestigeScore: 100,
      difficultyIndex: 10,
      characteristics: { flow: 40, speed: 20, tech: 100, overtaking: 10 }
    },
    history: "Formula 1's crown jewel. A narrow street track weaving through Monaco's luxury harbor. With absolute precision required and zero room for error, Monaco represents the ultimate driver prestige.",
    mostSuccessfulDrivers: [
      { name: "Ayrton Senna", wins: 6 },
      { name: "Graham Hill", wins: 5 },
      { name: "Michael Schumacher", wins: 5 }
    ],
    mostSuccessfulTeams: [
      { name: "McLaren", wins: 15 },
      { name: "Ferrari", wins: 10 }
    ],
    timeline: [
      { year: 1929, event: "First Grand Prix organized by Antony Noghès" },
      { year: 1992, event: "Senna defends brilliantly from Mansell" },
      { year: 2024, event: "Charles Leclerc wins his home race in dramatic fashion" }
    ]
  },
  {
    id: "spa",
    name: "Circuit de Spa-Francorchamps",
    location: "Stavelot",
    country: "Belgium",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600&auto=format&fit=crop",
    trackMap: "M20 100 L40 40 L100 20 L160 50 L220 30 L280 80 Z",
    specs: {
      length: "7.004 km",
      turns: 19,
      capacity: "100,000",
      lapRecord: { time: "1:46.286", driver: "Valtteri Bottas", year: 2018 },
      prestigeScore: 97,
      difficultyIndex: 9,
      characteristics: { flow: 98, speed: 96, tech: 80, overtaking: 90 }
    },
    history: "A majestic rollercoaster circuit nested in the Ardennes forest. Featuring 'Eau Rouge / Radillon'—one of the most famous and daunting complexes in motorsport—Spa offers classic racing drama.",
    mostSuccessfulDrivers: [
      { name: "Michael Schumacher", wins: 6 },
      { name: "Ayrton Senna", wins: 5 }
    ],
    mostSuccessfulTeams: [
      { name: "Ferrari", wins: 18 },
      { name: "McLaren", wins: 14 }
    ],
    timeline: [
      { year: 1998, event: "Infamous 13-car pileup in torrential rain" },
      { year: 2000, event: "Mika Häkkinen's legendary double overtake on Schumacher" }
    ]
  },
  {
    id: "monza",
    name: "Autodromo Nazionale Monza",
    location: "Monza",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=600&auto=format&fit=crop",
    trackMap: "M10 30 L200 30 Q280 60 200 90 L30 90 Z",
    specs: {
      length: "5.793 km",
      turns: 11,
      capacity: "120,000",
      lapRecord: { time: "1:21.046", driver: "Rubens Barrichello", year: 2004 },
      prestigeScore: 96,
      difficultyIndex: 7,
      characteristics: { flow: 70, speed: 100, tech: 40, overtaking: 88 }
    },
    history: "The 'Temple of Speed'. With long straights and brutal braking zones, Monza has drivers on full throttle for 80% of the lap. It is the spiritual home ground of Scuderia Ferrari and the Tifosi.",
    mostSuccessfulDrivers: [
      { name: "Michael Schumacher", wins: 5 },
      { name: "Lewis Hamilton", wins: 5 }
    ],
    mostSuccessfulTeams: [
      { name: "Ferrari", wins: 20 },
      { name: "McLaren", wins: 11 }
    ],
    timeline: [
      { year: 1922, event: "Track constructed, the third purpose-built motor racing track" },
      { year: 2020, event: "Pierre Gasly wins in an emotional upset for AlphaTauri" }
    ]
  }
];

export const RACES: Race[] = [
  {
    id: "2026-01-bahrain",
    name: "Bahrain Grand Prix",
    round: 1,
    circuitId: "bahrain",
    circuitName: "Bahrain International Circuit",
    date: "2026-03-08",
    time: "18:00",
    completed: true,
    winnerId: "verstappen",
    fastestLap: { driverId: "verstappen", driverName: "Max Verstappen", time: "1:32.614" },
    driverOfTheDayId: "leclerc",
    championshipImpact: "Verstappen kicks off 2026 in dominant fashion, but Ferrari close the gap with Leclerc securing second place.",
    results: [
      { position: 1, grid: 1, driverId: "verstappen", driverName: "Max Verstappen", driverCode: "VER", teamId: "redbull", teamName: "Red Bull Racing", time: "1:31:44.742", points: 26, status: "Finished", fastestLap: true },
      { position: 2, grid: 3, driverId: "leclerc", driverName: "Charles Leclerc", driverCode: "LEC", teamId: "ferrari", teamName: "Scuderia Ferrari", time: "+5.441s", points: 18, status: "Finished" },
      { position: 3, grid: 2, driverId: "hamilton", driverName: "Lewis Hamilton", driverCode: "HAM", teamId: "ferrari", teamName: "Scuderia Ferrari", time: "+12.182s", points: 15, status: "Finished" },
      { position: 4, grid: 4, driverId: "norris", driverName: "Lando Norris", driverCode: "NOR", teamId: "mclaren", teamName: "McLaren F1 Team", time: "+14.882s", points: 12, status: "Finished" },
      { position: 5, grid: 5, driverId: "piastri", driverName: "Oscar Piastri", driverCode: "PIA", teamId: "mclaren", teamName: "McLaren F1 Team", time: "+22.110s", points: 10, status: "Finished" },
      { position: 6, grid: 6, driverId: "russell", driverName: "George Russell", driverCode: "RUS", teamId: "mercedes", teamName: "Mercedes-AMG F1 Team", time: "+25.811s", points: 8, status: "Finished" },
      { position: 7, grid: 8, driverId: "sainz", driverName: "Carlos Sainz", driverCode: "SAI", teamId: "williams", teamName: "Williams Racing", time: "+35.212s", points: 6, status: "Finished" },
      { position: 8, grid: 7, driverId: "alonso", driverName: "Fernando Alonso", driverCode: "ALO", teamId: "astonmartin", teamName: "Aston Martin F1 Team", time: "+48.910s", points: 4, status: "Finished" }
    ],
    startingGrid: [
      { position: 1, driverId: "verstappen", driverName: "Max Verstappen", teamName: "Red Bull Racing", time: "1:29.179" },
      { position: 2, driverId: "hamilton", driverName: "Lewis Hamilton", teamName: "Scuderia Ferrari", time: "1:29.412" },
      { position: 3, driverId: "leclerc", driverName: "Charles Leclerc", teamName: "Scuderia Ferrari", time: "1:29.480" },
      { position: 4, driverId: "norris", driverName: "Lando Norris", teamName: "McLaren F1 Team", time: "1:29.510" }
    ],
    qualifying: [
      { position: 1, driverId: "verstappen", driverName: "Max Verstappen", teamName: "Red Bull Racing", q1: "1:30.031", q2: "1:29.501", q3: "1:29.179" },
      { position: 2, driverId: "hamilton", driverName: "Lewis Hamilton", teamName: "Scuderia Ferrari", q1: "1:30.221", q2: "1:29.620", q3: "1:29.412" },
      { position: 3, driverId: "leclerc", driverName: "Charles Leclerc", teamName: "Scuderia Ferrari", q1: "1:30.115", q2: "1:29.580", q3: "1:29.480" }
    ],
    pitStops: [
      { lap: 15, driverName: "Max Verstappen", teamName: "Red Bull Racing", duration: "2.3s" },
      { lap: 16, driverName: "Charles Leclerc", teamName: "Scuderia Ferrari", duration: "2.2s" },
      { lap: 17, driverName: "Lewis Hamilton", teamName: "Scuderia Ferrari", duration: "2.5s" }
    ],
    timeline: [
      { lap: 1, title: "Race Start", description: "Verstappen defends lead. Hamilton attacks Norris for third.", type: "lead-change" },
      { lap: 16, title: "First Pit Stops", description: "Ferrari performs a double stack pitstop successfully.", type: "pit-stop" },
      { lap: 42, title: "Leclerc Overtake", description: "Leclerc secures P2 with a daring dive down Turn 1 on Hamilton.", type: "overtake" }
    ]
  },
  {
    id: "2026-02-monaco",
    name: "Monaco Grand Prix",
    round: 2,
    circuitId: "monaco",
    circuitName: "Circuit de Monaco",
    date: "2026-05-24",
    time: "15:00",
    completed: true,
    winnerId: "leclerc",
    fastestLap: { driverId: "hamilton", driverName: "Lewis Hamilton", time: "1:14.120" },
    driverOfTheDayId: "leclerc",
    championshipImpact: "Leclerc captures the home crown. Hamilton secures podium in red. Verstappen finishes 4th due to track position limitations.",
    results: [
      { position: 1, grid: 1, driverId: "leclerc", driverName: "Charles Leclerc", driverCode: "LEC", teamId: "ferrari", teamName: "Scuderia Ferrari", time: "1:42:30.221", points: 25, status: "Finished" },
      { position: 2, grid: 2, driverId: "norris", driverName: "Lando Norris", driverCode: "NOR", teamId: "mclaren", teamName: "McLaren F1 Team", time: "+1.210s", points: 18, status: "Finished" },
      { position: 3, grid: 4, driverId: "hamilton", driverName: "Lewis Hamilton", driverCode: "HAM", teamId: "ferrari", teamName: "Scuderia Ferrari", time: "+4.112s", points: 16, status: "Finished", fastestLap: true },
      { position: 4, grid: 3, driverId: "verstappen", driverName: "Max Verstappen", driverCode: "VER", teamId: "redbull", teamName: "Red Bull Racing", time: "+5.890s", points: 12, status: "Finished" },
      { position: 5, grid: 5, driverId: "piastri", driverName: "Oscar Piastri", driverCode: "PIA", teamId: "mclaren", teamName: "McLaren F1 Team", time: "+15.110s", points: 10, status: "Finished" }
    ],
    startingGrid: [
      { position: 1, driverId: "leclerc", driverName: "Charles Leclerc", teamName: "Scuderia Ferrari", time: "1:11.272" },
      { position: 2, driverId: "norris", driverName: "Lando Norris", teamName: "McLaren F1 Team", time: "1:11.391" },
      { position: 3, driverId: "verstappen", driverName: "Max Verstappen", teamName: "Red Bull Racing", time: "1:11.512" }
    ],
    qualifying: [
      { position: 1, driverId: "leclerc", driverName: "Charles Leclerc", teamName: "Scuderia Ferrari", q1: "1:12.110", q2: "1:11.890", q3: "1:11.272" },
      { position: 2, driverId: "norris", driverName: "Lando Norris", teamName: "McLaren F1 Team", q1: "1:12.300", q2: "1:11.901", q3: "1:11.391" }
    ]
  },
  {
    id: "2026-03-silverstone",
    name: "British Grand Prix",
    round: 3,
    circuitId: "silverstone",
    circuitName: "Silverstone Circuit",
    date: "2026-07-05",
    time: "15:00",
    completed: false,
    championshipImpact: "The legendary home turf of British racing. High-speed aerodynamics will decide the outcome of this historic battle."
  }
];

export const RIVALRIES: Rivalry[] = [
  {
    id: "senna-prost",
    title: "Ayrton Senna vs Alain Prost",
    subtitle: "The Most Intense Psychological War in Motorsport History",
    driver1Id: "senna",
    driver2Id: "prost",
    summary: "From 1988 to 1993, Ayrton Senna and Alain Prost fought a war of pure philosophy. Senna drove with spiritual, high-risk devotion; Prost ('The Professor') with cold, clinical calculation. Tensions reached boiling points at Suzuka in 1989 and 1990 where collisions decided the championships.",
    stats: [
      { metric: "World Championships", d1Value: 3, d2Value: 4 },
      { metric: "Grand Prix Wins", d1Value: 41, d2Value: 51 },
      { metric: "Pole Positions", d1Value: 65, d2Value: 33 },
      { metric: "Head-To-Head Seasons", d1Value: "McLaren '88, '89", d2Value: "McLaren '88, '89" }
    ],
    timeline: [
      { year: "1988", event: "Senna joins Prost at McLaren. Senna wins the championship after a fierce, respectful battle." },
      { year: "1989", event: "Suzuka collision: Prost and Senna collide at the chicane. Senna disqualified, Prost wins title." },
      { year: "1990", event: "Suzuka revenge: Senna takes out Prost at Turn 1 at 250km/h, clinching his second title." }
    ],
    stories: [
      {
        title: "The Suzuka Chicane Controversy",
        text: "With only laps remaining in the 1989 Japanese GP, Senna launched a move down the inside of Prost. Prost turned in, locking both McLarens. Prost walked away claiming the title, but Senna got restarted, won, and was later contentiously disqualified by FIA president Balestre."
      }
    ],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "hamilton-verstappen",
    title: "Lewis Hamilton vs Max Verstappen",
    subtitle: "The Changing of the Guard",
    driver1Id: "hamilton",
    driver2Id: "verstappen",
    summary: "The 2021 season was an all-time classic battle of generations. Veteran 7-time Champion Lewis Hamilton went wheel-to-wheel against challenger Max Verstappen. Collisions at Silverstone, Monza, and Jeddah led to a dramatic, controversial final-lap showdown in Abu Dhabi.",
    stats: [
      { metric: "World Championships", d1Value: 7, d2Value: 3 },
      { metric: "Career Wins", d1Value: 105, d2Value: 62 },
      { metric: "Poles", d1Value: 104, d2Value: 40 },
      { metric: "2021 Wins", d1Value: 8, d2Value: 10 }
    ],
    timeline: [
      { year: "2021 (July)", event: "Silverstone Crash: High-speed contact at Copse sends Verstappen into the tire barriers at 51G." },
      { year: "2021 (Sept)", event: "Monza Collision: Verstappen's car lands on top of Hamilton's halo at the chicane." },
      { year: "2021 (Dec)", event: "Abu Dhabi Finale: A controversial safety car restart allows Verstappen to overtake Hamilton on the final lap." }
    ],
    stories: [],
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop"
  }
];

export const GREATEST_CARS: GreatestCar[] = [
  {
    id: "ferrari-f2004",
    name: "Ferrari F2004",
    teamName: "Scuderia Ferrari",
    year: 2004,
    specs: {
      engine: "3.0L V10 Tipo 053",
      weight: "605 kg (including driver)",
      power: "approx. 900-950 bhp @ 19,000 rpm",
      designer: "Rory Byrne, Ross Brawn, Aldo Costa"
    },
    achievements: [
      "15 Wins out of 18 Races",
      "12 Pole Positions",
      "Both Championships clinched early",
      "Held lap records for nearly two decades"
    ],
    driverPairings: ["Michael Schumacher", "Rubens Barrichello"],
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600&auto=format&fit=crop",
    description: "The absolute pinnacle of Ferrari's dominant Ross Brawn/Michael Schumacher era. Powered by a screaming, ultra-reliable 3.0L V10, the F2004 tore up the record books with devastating race pace."
  },
  {
    id: "mclaren-mp4-4",
    name: "McLaren MP4/4",
    teamName: "McLaren International",
    year: 1988,
    specs: {
      engine: "1.5L Honda V6 Turbo RA168E",
      weight: "540 kg",
      power: "650-700 bhp @ 12,500 rpm",
      designer: "Gordon Murray, Steve Nichols"
    },
    achievements: [
      "15 Wins out of 16 Races",
      "15 Pole Positions",
      "10 One-Two Finishes",
      "The most statistically dominant car in F1 history"
    ],
    driverPairings: ["Ayrton Senna", "Alain Prost"],
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600&auto=format&fit=crop",
    description: "A combination of Gordon Murray's low-line chassis engineering, Honda's hyper-efficient turbo engine, and two of the greatest drivers in F1 history. The MP4/4 missed a perfect season by just one race (Monza)."
  },
  {
    id: "mercedes-w11",
    name: "Mercedes-AMG F1 W11 EQ Performance",
    teamName: "Mercedes-AMG PETRONAS",
    year: 2020,
    specs: {
      engine: "1.6L V6 Turbo Hybrid + MGU-K & MGU-H",
      weight: "746 kg",
      power: "approx. 1020 bhp",
      designer: "James Allison, John Owen"
    },
    achievements: [
      "13 Wins in 17 Races",
      "15 Pole Positions",
      "Features Dual Axis Steering (DAS)",
      "Widely considered the fastest F1 car of all time over a single lap"
    ],
    driverPairings: ["Lewis Hamilton", "Valtteri Bottas"],
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop",
    description: "Built for a shortened, intense 2020 campaign, the W11 was a masterclass in modern technology. With DAS allowing toe-angle adjustments on the straights, it broke track records worldwide."
  }
];

export const ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "The Leclerc-Hamilton Era Begins: Behind Ferrari's Blockbuster Garage Team",
    summary: "As Lewis Hamilton settles into the Maranello team, we analyze how Frédéric Vasseur plans to manage the explosive synergy of two world-class champions.",
    content: "The transfer of Lewis Hamilton to Scuderia Ferrari is the most significant sporting event of the decade. For years, the Silver Arrows were Hamilton's home. Now, clad in scarlet red alongside Monaco's favorite son Charles Leclerc, the dynamics are fascinating. Frédéric Vasseur faces a major task: giving both drivers equal machinery while aiming to return the Drivers' trophy back to Maranello after a 19-year drought. In the pre-season simulator testing, both drivers have displayed exceptionally close times, sparking absolute hype across Italy.",
    publishedAt: "2026-06-22",
    category: "analysis",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop",
    featured: true
  },
  {
    id: "art-2",
    title: "Red Bull's 2026 Engine Project: Can Ford Powertrains Match the Titans?",
    summary: "An inside look into Milton Keynes' massive gamble of designing their own power units for the upcoming regulation changes.",
    content: "Red Bull's collaboration with Ford signals a bold new chapter. Following Honda's partial departure, the team decided to bring all engine manufacturing in-house at the new Red Bull Powertrains facility. It is a multi-million-dollar gamble that christian Horner describes as the 'largest challenge in our history.' Max Verstappen's future championships heavily rely on how this power unit performs against traditional engine giants Ferrari and Mercedes.",
    publishedAt: "2026-06-20",
    category: "news",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop",
    featured: false
  },
  {
    id: "art-3",
    title: "Silverstone Preview: High-Speed Sweepers and Aerodynamic Efficiency",
    summary: "The ultimate track preview for the upcoming British GP, evaluating which team holds the edge in fast-corner packages.",
    content: "Silverstone is the ultimate test of high-speed aerodynamics. Teams with superior floor efficiency and balanced front-end wing stability will dominate through the legendary Copse and Maggots-Becketts complex. McLaren's recent updates look highly suited for these characteristics, positioning Lando Norris as a prime favorite.",
    publishedAt: "2026-06-23",
    category: "news",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop",
    featured: false
  }
];

export const ON_THIS_DAY_EVENTS: OnThisDayEvent[] = [
  {
    id: "otd-1",
    month: 6,
    day: 23,
    year: 1985,
    type: "win",
    title: "Michele Alboreto wins in Detroit",
    description: "Ferrari driver Michele Alboreto claims a hard-fought victory at the USA East Grand Prix held on the tight streets of Detroit, propelling him into a legendary championship battle against Alain Prost."
  },
  {
    id: "otd-2",
    month: 6,
    day: 23,
    year: 2012,
    type: "milestone",
    title: "Sebastian Vettel takes Pole in Valencia",
    description: "In an incredibly competitive 2012 season, Sebastian Vettel drives a majestic qualifying lap for Red Bull Racing to claim pole position at the European Grand Prix in Valencia."
  },
  {
    id: "otd-3",
    month: 6,
    day: 24,
    year: 1911,
    type: "birth",
    title: "Juan Manuel Fangio is born",
    description: "The legendary Argentine master 'El Maestro' is born. Fangio went on to win five World Championships in the 1950s with four different manufacturers (Alfa Romeo, Maserati, Mercedes, Ferrari), a record that stood for nearly half a century."
  },
  {
    id: "otd-4",
    month: 6,
    day: 24,
    year: 1990,
    type: "win",
    title: "Alain Prost wins the Mexican GP from 13th",
    description: "In one of the greatest tactical masterclasses ever, Alain Prost conserves his tires on his Ferrari 641 to slice through the field from 13th on the grid to claim an iconic victory over Ayrton Senna."
  }
];

// Historical timelines for 1950 -> Present or key eras
export const HISTORIC_SEASONS = [
  { year: 2024, champion: "Max Verstappen", team: "Red Bull", constructor: "McLaren", details: "McLaren returns to constructors glory, while Verstappen battles hard to secure his 4th Drivers' title." },
  { year: 2021, champion: "Max Verstappen", team: "Red Bull", constructor: "Mercedes", details: "An epic, controversial battle that was decided on the final lap of the Abu Dhabi Grand Prix." },
  { year: 2020, champion: "Lewis Hamilton", team: "Mercedes", constructor: "Mercedes", details: "Hamilton matches Michael Schumacher's 7 titles in a season dominated by the sheer speed of the W11." },
  { year: 2016, champion: "Nico Rosberg", team: "Mercedes", constructor: "Mercedes", details: "An intense teammate war ending with Rosberg securing the title and immediately retiring." },
  { year: 2012, champion: "Sebastian Vettel", team: "Red Bull", constructor: "Red Bull", details: "An incredible season with 7 different winners in the first 7 races, concluding with Vettel's dramatic spin recovery in Brazil." },
  { year: 2004, champion: "Michael Schumacher", team: "Ferrari", constructor: "Ferrari", details: "Schumacher wins 13 out of 18 races, marking the peak of Ferrari's dominant era." },
  { year: 1998, champion: "Mika Häkkinen", team: "McLaren", constructor: "McLaren", details: "Mika Häkkinen beats Michael Schumacher in a thrilling final race showdown in Suzuka." },
  { year: 1988, champion: "Ayrton Senna", team: "McLaren", constructor: "McLaren", details: "McLaren wins 15 out of 16 races as Senna and Prost duel in identical machinery." },
  { year: 1976, champion: "James Hunt", team: "McLaren", constructor: "Ferrari", details: "The iconic, dramatic battle between James Hunt and Niki Lauda, who miraculously returned from a fiery crash." },
  { year: 1950, champion: "Giuseppe Farina", team: "Alfa Romeo", constructor: "N/A", details: "The inaugural season of the Formula 1 World Championship, dominated by Alfa Romeo's 'Three Fs'." }
];
