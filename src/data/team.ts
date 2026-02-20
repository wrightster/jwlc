export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  phone: string;
  email: string;
  specialties: string[];
  photo: string;
}

export const team: TeamMember[] = [
  {
    name: "Julie Wright",
    role: "Broker In Charge / Owner",
    bio: "With over 40 years in Triangle area land sales, Julie brings unmatched expertise across Wake, Durham, Granville, Franklin, Vance, Harnett, Nash, and Chatham counties. A registered nurse turned real estate powerhouse, she combines deep knowledge of soil, topography, and zoning with genuine care for every client. Julie is an active Rotary International member supporting projects in Nicaragua.",
    phone: "(919) 632-8264",
    email: "juliannawright@gmail.com",
    specialties: ["Land Brokerage", "Estate Planning", "Investment Properties"],
    photo: "/images/team/julie-wright.jpg",
  },
  {
    name: "Alex Bailey",
    role: "Broker — Developer",
    bio: "A third-generation developer from Wake Forest, Alex holds degrees in Accounting and Supply Chain from NC State University. He specializes in residential and commercial development, guiding projects from site planning through construction management.",
    phone: "(919) 741-7575",
    email: "alextbailey@icloud.com",
    specialties: ["Residential Development", "Commercial Development", "Site Planning"],
    photo: "/images/team/alex-bailey.jpg",
  },
  {
    name: "Robert Powell",
    role: "Broker",
    bio: "Based in Oxford, NC, Robert brings over 20 years of experience in real estate and mortgage finance. A former Oxford City Council member, Kiwanis Director, and VP of the Costa Rica Consul, he combines civic leadership with deep market knowledge.",
    phone: "(919) 691-1663",
    email: "robert@powellox.com",
    specialties: ["Real Estate Sales", "Mortgage Finance", "Community Development"],
    photo: "/images/team/robert-powell.jpg",
  },
  {
    name: "Rusty Ammons",
    role: "Broker — Developer",
    bio: "With 40 years in real estate since 1984, Rusty specializes in new home development across Raleigh, Holly Springs, and Morrisville. He partners with his wife Mary Ammons to deliver quality residential projects throughout the Triangle.",
    phone: "(919) 270-2100",
    email: "rusty@ammonsrealty.com",
    specialties: ["New Home Development", "Residential Projects", "Triangle Area"],
    photo: "/images/team/rusty-ammons.jpg",
  },
  {
    name: "Jeff Hunter",
    role: "Broker — Developer",
    bio: "An NC State graduate with over 40 years of business experience, Jeff developed the acclaimed Colvard Farms community near Jordan Lake. Named CFO of the Year by the Triangle Business Journal in 2013, he has been a licensed broker since 2021.",
    phone: "(919) 730-9420",
    email: "jeffnhunter@aol.com",
    specialties: ["Community Development", "Financial Strategy", "Land Development"],
    photo: "/images/team/jeff-hunter.jpg",
  },
];
