"use client";
import { supabase } from "./supabase";

// ============================================================================
// DATA MODELS
// ============================================================================

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: "upcoming" | "current" | "past";
  color: "sky" | "blue" | "cyan" | "indigo" | "purple" | "orange";
  image: string;
  description: string;
  registrationUrl?: string;
  isFeatured?: boolean;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
  skills: string[];
  branch?: string;
  level?: number;
  domain?: string;
  socials: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export interface LegacyHeadItem {
  id: string;
  name: string;
  role: string;
  tenure: string;
  placedAt?: string;
  bio: string;
  highlight: string;
  image?: string;
}

export interface SubTeamItem {
  id: string;
  title: string;
  category: string;
  color: "sky" | "purple" | "blue" | "indigo" | "cyan";
  frontDesc: string;
  backDesc: string;
  points: string[];
}

export interface CoreValueItem {
  id: string;
  title: string;
  category: string;
  color: "sky" | "blue" | "cyan" | "indigo" | "purple";
  frontDesc: string;
  backDesc: string;
  points: string[];
}

export interface SubscriberItem {
  id?: string;
  email: string;
  created_at?: string;
}

export interface NewsIssueItem {
  id: string;
  volume: string;
  month: string;
  year: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  fileSize: string;
  pageCount: number;
  topics: string[];
  isCurrent?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  detail: string;
  image: string;
  size: "small" | "large" | "wide" | "tall";
}

export interface ClubStats {
  eventsHosted: string;
  activeMembers: string;
  liveProjects: string;
  placementRate: string;
}

export interface WebsiteDataBackup {
  version: string;
  exportedAt: string;
  events: EventItem[];
  team: TeamMemberItem[];
  legacyHeads: LegacyHeadItem[];
  subTeams?: SubTeamItem[];
  coreValues?: CoreValueItem[];
  newsIssues: NewsIssueItem[];
  gallery: GalleryItem[];
  stats: ClubStats;
}

// ============================================================================
// OFFICIAL DEFAULT SEEDS
// ============================================================================

export const defaultEvents: EventItem[] = [
  { 
    id: "evt-1", 
    title: "Introduction to Flutter", 
    date: "15 October 2022", 
    time: "7:00 PM",
    location: "Google Meet",
    category: "past", 
    color: "sky",
    image: "https://images.unsplash.com/photo-1617042375876-a13e36732a30?auto=format&fit=crop&q=80&w=800&h=400",
    description: "An introductory webinar covering the fundamentals of the Flutter framework for cross-platform app development. Speaker: Markandey Pathak.",
    registrationUrl: ""
  },
  { 
    id: "evt-2", 
    title: "Introduction to Python", 
    date: "04 November 2022", 
    time: "10:00 AM",
    location: "Seminar Hall, F-Block",
    category: "past", 
    color: "blue",
    image: "/events/pythonworkshop.jpg.jpeg",
    description: "A beginner-level session introducing students to Python programming fundamentals and its applications.",
    registrationUrl: ""
  },
  { 
    id: "evt-3", 
    title: "National Youth Day Celebration", 
    date: "16 January 2023", 
    time: "12:40 PM",
    location: "Seminar Hall, A-Block",
    category: "past", 
    color: "cyan",
    image: "/events/nationalyouthday.jpg.jpeg",
    description: "Tech talk featuring discussions on Smart India Hackathon, Innovation and Technology, GSoC, and insights of Hackathons.",
    registrationUrl: ""
  },
  { 
    id: "evt-4", 
    title: "IdeaFest 2024", 
    date: "29 April 2024", 
    time: "10:00 AM - 5:00 PM",
    location: "SRMCEM, Lucknow",
    category: "past", 
    color: "purple",
    image: "/events/ideafest.jpg.jpeg",
    description: "A competitive hackathon with cash prizes up to ₹8,000. Title Sponsor: Coding Blocks, Lucknow.",
    registrationUrl: ""
  },
  { 
    id: "evt-5", 
    title: "C++ Voyage: Rookie to Industry Ace", 
    date: "05 December 2024", 
    time: "1:00 PM",
    location: "SRMCEM Campus",
    category: "past", 
    color: "indigo",
    image: "/events/c++voyaoge.jpg.jpeg",
    description: "A programming workshop designed to take beginners through the fundamentals of C++ towards industry-level proficiency.",
    registrationUrl: ""
  },
  { 
    id: "evt-6", 
    title: "Cupid Coding: The Singles-Friendly DSA Contest", 
    date: "17 February 2026", 
    time: "11:00 AM",
    location: "G-607",
    category: "past", 
    color: "orange",
    image: "/events/cupidcoding.jpg.jpeg",
    description: "\"Commit to Code, NOT Chaos\" - a Valentine-themed Data Structures & Algorithms contest.",
    registrationUrl: ""
  },
  {
    id: "evt-7",
    title: "Codeshalla - 7-Day C++ Programming Bootcamp",
    date: "22 April onwards",
    time: "Flexible",
    location: "Discord Channel",
    category: "past",
    color: "sky",
    image: "/events/codeshalla.jpg.jpeg",
    description: "A 7-day online coding bootcamp covering C++ programming, conducted through interactive Discord sessions.",
    registrationUrl: ""
  },
  {
    id: "evt-8",
    title: "Web Shalla",
    date: "15 May onwards",
    time: "Flexible",
    location: "Discord Channel",
    category: "past",
    color: "indigo",
    image: "/events/webshalla.jpg.jpeg",
    description: "'Your Journey from User to Creator Starts Here' - a comprehensive web development series.",
    registrationUrl: ""
  },
  {
    id: "evt-9",
    title: "Byte Battle",
    date: "02 May 2025",
    time: "12:15 PM",
    location: "Seminar Hall, A-Block",
    category: "past",
    color: "cyan",
    image: "/events/bytebattle.jpg.jpeg",
    description: "Multi-language coding battle (C, Python, C++, Java, C#) with prizes for winners and certificates for all participants.",
    registrationUrl: ""
  },
  {
    id: "evt-10",
    title: "Explore Tech",
    date: "14 September 2025",
    time: "8:00 PM",
    location: "SRMCEM Campus",
    category: "past",
    color: "blue",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800&h=400",
    description: "Workshop covering VS Code, GitHub, and LeetCode, mentored by 3rd-year student mentors.",
    registrationUrl: ""
  },
  {
    id: "evt-11",
    title: "Tech Talk: Dive into the World of AI",
    date: "13 November 2025",
    time: "11:00 AM",
    location: "Seminar Hall, A-Block",
    category: "past",
    color: "purple",
    image: "/events/techtalk.jpg.jpeg",
    description: "A session exploring the world of Artificial Intelligence by Arjit Verma. Certificates were provided to all attendees.",
    registrationUrl: ""
  },
  {
    id: "evt-12",
    title: "SecOps - Ethical Hacking",
    date: "TBA",
    time: "Flexible",
    location: "SRMCEM Campus",
    category: "upcoming",
    color: "orange",
    image: "/events/ethicalhacking.jpg.jpeg",
    description: "Ethical hacking contest with cash prizes for the top 3 participants.",
    registrationUrl: "",
    isFeatured: true
  }
];

export const defaultTeam: TeamMemberItem[] = [
  // L1 (President)
  { 
    id: "OP-01", 
    level: 1,
    name: "Abhay Shanker Tiwari", 
    position: "President", 
    image: "/team/abhay.jpg.jpeg", 
    bio: "Visionary leader driving the club's mission to foster technological excellence and innovation. | Tech Stack: C, C++, Python | Focus: Leadership & Tech Strategy", 
    skills: ["Leadership", "Vision", "Strategy"], 
    branch: "CSE",
    socials: { linkedin: "https://www.linkedin.com/in/abhay-shanker-tiwari-0a8031213/", github: "https://github.com", email: "abhaylibra15@gmail.com" } 
  },
  
  // L2 (Vice President)
  { 
    id: "OP-02", 
    level: 2,
    name: "Vineet Pandey", 
    position: "Vice President & PR Head", 
    image: "/team/vineet.jpg.jpeg", 
    bio: "Directing operations, business strategy, and public relations.", 
    skills: ["Operations", "Strategy", "Marketing"], 
    socials: { linkedin: "https://www.linkedin.com/in/vineet-pandey-83500a328/", github: "https://github.com" } 
  },

  // L3 (Heads)
  { 
    id: "OP-04", 
    level: 3,
    domain: "technical",
    name: "Abhishek Soni", 
    position: "Technical Head", 
    image: "/team/abhishek.jpg.jpeg", 
    bio: "Leading the technical initiatives and core engineering projects. | Tech Stack: TypeScript, JavaScript, Python | Focus: Full Stack & Operations", 
    skills: ["Engineering", "Architecture", "Leadership"], 
    socials: { linkedin: "https://www.linkedin.com/in/abhishek-soni-06725326b/", github: "https://github.com/akaabhi2005" } 
  },
  { 
    id: "OP-03", 
    level: 3,
    domain: "content",
    name: "Asmi Tiwari", 
    position: "Content Head", 
    image: "/team/asmi.jpg.jpeg", 
    bio: "Leading content strategy and creation for all club publications.", 
    skills: ["Content", "Strategy", "Writing"], 
    socials: { linkedin: "https://www.linkedin.com/in/asmi-tiwari-ba4602328/", github: "https://github.com" } 
  },
  { 
    id: "OP-06", 
    level: 3,
    domain: "design",
    name: "Jatin Pandey", 
    position: "Designing Head", 
    image: "/team/jatin.jpg.jpeg", 
    bio: "Directing UI/UX design and overall visual aesthetic of the club.", 
    skills: ["UI/UX", "Figma", "Design"], 
    socials: { linkedin: "https://www.linkedin.com/in/jatin-pandey-a1654237a/", github: "https://github.com" } 
  },
  { 
    id: "OP-09", 
    level: 3,
    domain: "photo",
    name: "Akshat Saxena", 
    position: "Photography Head", 
    image: "/team/akshat.jpg.jpeg", 
    bio: "Capturing moments and managing our digital presence. | Tech Stack: Java, Python | Focus: Digital Arts & Media", 
    skills: ["Photography", "Social Media", "Video"], 
    socials: { linkedin: "https://www.linkedin.com/in/akshat-saxena-58267a251/", github: "https://github.com" } 
  },

  // L4 (Co-Heads)
  { 
    id: "OP-05", 
    level: 4,
    domain: "technical",
    name: "Abhinav Singh", 
    position: "Technical Co-head", 
    image: "/team/abhinav.jpg.jpeg", 
    bio: "Assisting in technical operations and mentoring junior developers. | Tech Stack: C, Java, Python, JS, TS | Focus: Web & App Dev, AI/ML", 
    skills: ["Development", "Mentorship", "Cloud"], 
    socials: { linkedin: "https://www.linkedin.com/in/abhinav-singh-a70542328/", github: "https://github.com" } 
  },
  { 
    id: "OP-07", 
    level: 4,
    domain: "design",
    name: "Isha Gupta", 
    position: "Designing Co-head", 
    image: "/team/isha.jpg.jpeg", 
    bio: "Collaborating on design systems and creative marketing assets.", 
    skills: ["Creative", "Illustration", "UI"], 
    socials: { linkedin: "https://www.linkedin.com/in/isha-gupta-741317304/", github: "https://github.com" } 
  },
  { 
    id: "OP-08", 
    level: 4,
    domain: "pr",
    name: "Ayush Pratap Singh", 
    position: "PR & Marketing Co-head", 
    image: "/team/ayush.jpg.jpeg", 
    bio: "Executing marketing campaigns and managing public outreach. | Tech Stack: C, C++, Python | Focus: AI/ML, Web Dev", 
    skills: ["Marketing", "Outreach", "Strategy"], 
    socials: { linkedin: "https://www.linkedin.com/in/ayush-pratap-singh-648653319/", github: "https://github.com" } 
  },
  { 
    id: "OP-03-CO", 
    level: 4,
    domain: "content",
    name: "Tanu Mishra", 
    position: "Content Co-head", 
    image: "/team/1788512714000_IMG_4034.JPG.jpeg", 
    bio: "Passionate about content strategy, tech literature, and creative problem solving.", 
    skills: ["Development", "Problem Solving", "DSA"], 
    branch: "DS",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" } 
  },
  { 
    id: "OP-10", 
    level: 4,
    domain: "photo",
    name: "Aditya Rawat", 
    position: "Photography Co-head", 
    image: "/team/adityamaddheshiya.jpg.jpeg", 
    bio: "Co-heading photography and media team. Capturing iconic event moments and managing creative visual productions.", 
    skills: ["Photography", "Videography", "Media Production"], 
    branch: "CSE",
    socials: { linkedin: "https://www.linkedin.com/in/aditya-rawat2410?utm_source=share_via&utm_content=profile&utm_medium=member_ios", github: "https://github.com", email: "adityarawat@srmcem.ac.in" } 
  },

  // L5 (Members)
  // Technical Team
  { 
    id: "M-T0", 
    level: 5,
    domain: "technical",
    name: "Dhruv Bajpai", 
    position: "Technical Member", 
    image: "/team/dhruvbajpai.jpg.jpg", 
    bio: "Dedicated and adaptable developer exploring Python, C, HTML, Machine Learning, and Data Science. | Tech Stack: C, Python, HTML | Focus: AI/ML, Data Science", 
    skills: ["Coding", "Web Dev"], 
    branch: "CSE (DS)",
    socials: { linkedin: "https://www.linkedin.com/in/dhruv-bajpai-4bba7b423" } 
  },
  { 
    id: "M-T1", 
    level: 5,
    domain: "technical",
    name: "Naina Misra", 
    position: "Technical Member", 
    image: "/team/naina.jpg.jpeg", 
    bio: "Computer science student passionate about coding, data structures and algorithms, and applied machine learning. | Tech Stack: C++, Python | Focus: Software Dev, DSA", 
    skills: ["Coding", "Web Dev"], 
    branch: "CSE",
    socials: { linkedin: "https://www.linkedin.com/in/naina-misra-598637344" } 
  },
  { 
    id: "M-T2", 
    level: 5,
    domain: "technical",
    name: "Vaishnavi Bajpai", 
    position: "Technical Member", 
    image: "/team/vaishnavi.jpg.jpeg", 
    bio: "Interested in exploring new ideas and problem solving. Passionate about coding in C, Python, and JavaScript. | Tech Stack: C, Python, JavaScript | Focus: Data Science, DSA", 
    skills: ["Coding", "Web Dev"], 
    branch: "DS",
    socials: { linkedin: "https://www.linkedin.com/in/vaishnavi-bajpai-b7a03b383" } 
  },
  { 
    id: "M-T3", 
    level: 5,
    domain: "technical",
    name: "Aniket Tiwari", 
    position: "Technical Member", 
    image: "/team/aniket.jpg.jpg", 
    bio: "B.Tech Data Science student passionate about technology, AI, robotics, drones, and building innovative solutions. | Tech Stack: C, Python, JavaScript | Focus: Web Dev, AI/ML, DSA", 
    skills: ["Coding", "Web Dev"], 
    branch: "DS",
    socials: { linkedin: "https://www.linkedin.com/in/aniket-tiwari-704566383" } 
  },
  { 
    id: "M-T4", 
    level: 5,
    domain: "technical",
    name: "Shriyansh Verma", 
    position: "Technical Member", 
    image: "/team/shriyansh.jpg.jpeg", 
    bio: "Passionate about technology, programming, and problem-solving. Enjoys learning new technologies and building innovative projects. | Tech Stack: C, Python, JavaScript | Focus: Web & Software Dev, DSA", 
    skills: ["Coding", "Web Dev"], 
    branch: "DS",
    socials: { linkedin: "https://www.linkedin.com/in/shriyansh-verma-849a72365" } 
  },
  { 
    id: "M-T5", 
    level: 5,
    domain: "technical",
    name: "Prashant Jaisawal", 
    position: "Technical Member", 
    image: "/team/prashant.jpg.jpeg", 
    bio: "Aspiring AI/ML engineer passionate about exploring tech world and building impactful applications. | Tech Stack: Python | Focus: AI / Machine Learning", 
    skills: ["Coding", "Web Dev"], 
    branch: "AIML",
    socials: { linkedin: "https://www.linkedin.com/in/prashant-jaiswal-889ab4291" } 
  },
  { 
    id: "M-T6", 
    level: 5,
    domain: "technical",
    name: "Aditya Maddheshiya", 
    position: "Technical Member", 
    image: "/team/adityamaddheshiya.jpg.jpeg", 
    bio: "2nd-year B.Tech student passionate about Android and Web Development, building user-friendly applications. | Tech Stack: C, Java, Python | Focus: Web & App Dev", 
    skills: ["Coding", "Web Dev"], 
    branch: "CSE",
    socials: { linkedin: "https://www.linkedin.com/in/aditya-maddheshiya-717358432" } 
  },
  { 
    id: "M-T7", 
    level: 5,
    domain: "technical",
    name: "Vashu Gupta", 
    position: "Technical Member", 
    image: "/team/vashu.jpg.jpeg", 
    bio: "Aspiring software developer with foundation in C, C++, Python, Java, SQL, HTML, CSS, and JS, actively building skills in DSA. | Tech Stack: C++, Python, SQL, JS | Focus: Web & Software Dev", 
    skills: ["Coding", "Web Dev"], 
    branch: "CSE",
    socials: { linkedin: "https://www.linkedin.com/in/vashu-gupta-786064286" } 
  },

  // Content Team
  { 
    id: "M-C1", 
    level: 5,
    domain: "content",
    name: "Mugdh Tripathi", 
    position: "Content Member", 
    image: "/team/mugdh.jpg.jpeg", 
    bio: "Aspiring Tech Developer & Innovation Enthusiast skilled in HTML, CSS, JavaScript, Python, MySQL & RDBMS. | Tech Stack: C, Python, JavaScript | Focus: Web Development & DSA", 
    skills: ["Writing", "Editing"], 
    branch: "IT",
    socials: { linkedin: "https://www.linkedin.com/in/mugdh-tripathi-9728b1381" } 
  },
  { 
    id: "M-C2", 
    level: 5,
    domain: "content",
    name: "Ayushman", 
    position: "Content Member", 
    image: "/team/ayushmanpandey.jpg.jpg", 
    bio: "B.Tech student interested in programming, AI, competitive coding, cybersecurity, and data structures. | Tech Stack: C++ | Focus: DSA, AI, Problem Solving", 
    skills: ["Writing", "Editing"], 
    branch: "DS",
    socials: { linkedin: "https://www.linkedin.com/in/ayushman-pandey-aa3181367" } 
  },
  { 
    id: "M-C3", 
    level: 5,
    domain: "content",
    name: "Satakshi Nigam", 
    position: "Content Member", 
    image: "/team/sarakshi.jpg.jpg", 
    bio: "Curious and enthusiastic learner with strong interest in technology, content creation, and creative problem-solving. | Tech Stack: Java, Python | Focus: Web Dev, Content Creation", 
    skills: ["Writing", "Editing"], 
    branch: "IoT",
    socials: { linkedin: "https://www.linkedin.com/in/satakshi-nigam-a03214315" } 
  },
  { 
    id: "M-C4", 
    level: 5,
    domain: "content",
    name: "Supriya Singh", 
    position: "Content Member", 
    image: "/team/supriya.jpg.jpg", 
    bio: "B.Tech IT student passionate about exploring new technologies, coding, web development, and collaborative problem-solving. | Tech Stack: C, Python | Focus: Web Development, Software Dev", 
    skills: ["Writing", "Editing"], 
    branch: "IT",
    socials: { linkedin: "https://www.linkedin.com/in/supriya-singh-216379397" } 
  },
  { 
    id: "M-C5", 
    level: 5,
    domain: "content",
    name: "Priya Keshari", 
    position: "Content Member", 
    image: "/team/priya.jpg.jpg", 
    bio: "Passionate about discovering new ideas, technological innovation, and technical content creation. | Tech Stack: Python | Focus: AI/ML, Content Writing", 
    skills: ["Writing", "Editing"], 
    branch: "IT",
    socials: { linkedin: "https://www.linkedin.com/in/priya-keshari-273675363" } 
  },
  { 
    id: "M-C6", 
    level: 5,
    domain: "content",
    name: "Naisni", 
    position: "Content Member", 
    image: "/team/naisni.jpg.jpeg", 
    bio: "Creative writer and communicator passionate about tech literature and content design.", 
    skills: ["Writing", "Editing"], 
    branch: "CSE",
    socials: { linkedin: "https://linkedin.com" } 
  },

  // Photography & Social Media
  { 
    id: "M-P1", 
    level: 5,
    domain: "photo",
    name: "Ayan Kanojiya", 
    position: "Photography Member", 
    image: "/team/ayan.jpg.jpg", 
    bio: "Aesthetic photographer, videography expert, and content creator interested in web technologies and data science. | Tech Stack: Python, HTML, MySQL | Focus: Data Science, Videography", 
    skills: ["Photography", "Socials"], 
    branch: "CSE (DS)",
    socials: { linkedin: "https://www.linkedin.com/in/ayan-knj-644196396" } 
  },
  { 
    id: "M-P2", 
    level: 5,
    domain: "photo",
    name: "Pratik Singh", 
    position: "Photography Member", 
    image: "/team/pratik.jpg.jpg", 
    bio: "Interested in web development, backend engineering, competitive coding, and building useful projects. | Tech Stack: C, C++, Java, JavaScript, HTML | Focus: Web Dev, Backend", 
    skills: ["Photography", "Socials"], 
    branch: "DS",
    socials: { linkedin: "https://www.linkedin.com/in/pratik-singh-876471432" } 
  },
  { 
    id: "M-P3", 
    level: 5,
    domain: "photo",
    name: "Ranjeet Kumar", 
    position: "Photography Member", 
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400", 
    bio: "Passionate photographer capturing key event moments and media productions.", 
    skills: ["Photography", "Media"], 
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "M-P4", 
    level: 5,
    domain: "photo",
    name: "Arya Singh", 
    position: "Photography Member", 
    image: "/team/arya.jpg.jpg", 
    bio: "Hardworking and dedicated person interested in technical field (coding, AI) and capturing memories through photography. | Tech Stack: C, Python | Focus: AI/ML, Data Science", 
    skills: ["Photography", "Socials"], 
    branch: "CSE (DS)",
    socials: { linkedin: "https://www.linkedin.com/in/arya-singh-156351432" } 
  },

  // Design Team
  { 
    id: "M-D1", 
    level: 5,
    domain: "design",
    name: "Priyanshi Jain", 
    position: "Designing Member", 
    image: "/team/priyanshi.jpg", 
    bio: "2nd-year B.Tech CSE (DS) student aspiring to build a career as a Data Scientist. Passionate about coding, new tech, and UI/UX. | Tech Stack: Python | Focus: AI/ML, Data Science, UI/UX", 
    skills: ["UI/UX", "Figma"], 
    branch: "DS",
    socials: { linkedin: "https://www.linkedin.com/in/priyanshi-jain-544ab0366" } 
  },
  { 
    id: "M-D2", 
    level: 5,
    domain: "design",
    name: "Disha Yadav", 
    position: "Designing Member", 
    image: "/team/dishayadav.jpg.jpeg", 
    bio: "Passionate and curious learner who loves exploring technology, web development, data science, and UI/UX design. | Tech Stack: Python | Focus: Web Dev, Data Science, UI/UX", 
    skills: ["UI/UX", "Figma"], 
    branch: "DS",
    socials: { linkedin: "https://www.linkedin.com/in/disha-yadav-523083380" } 
  },
  { 
    id: "M-D3", 
    level: 5,
    domain: "design",
    name: "Naman Pandey", 
    position: "Designing Member", 
    image: "/team/naman.jpg.jpeg", 
    bio: "Interested in web development, UI/UX design, and Hackathons. | Tech Stack: C, Java, Python | Focus: Web Dev, DSA, UI/UX Design", 
    skills: ["UI/UX", "Figma"], 
    branch: "CSE",
    socials: { linkedin: "https://www.linkedin.com/in/naman-pandey-461a97380" } 
  },
  { 
    id: "M-D4", 
    level: 5,
    domain: "design",
    name: "Akhand Pande", 
    position: "Designing Member", 
    image: "/team/akhand.jpg.jpeg", 
    bio: "Interested in Artificial Intelligence, Machine Learning, AI tools, web development, and cloud computing. | Tech Stack: C, C++, Python, HTML/CSS | Focus: AI/ML, Web Dev, Cloud", 
    skills: ["UI/UX", "Figma"], 
    branch: "AL",
    socials: { linkedin: "https://www.linkedin.com/in/akhand-pandey-528bab382" } 
  },

  // PR & Marketing
  { 
    id: "M-PR1", 
    level: 5,
    domain: "pr",
    name: "Mahi Shukla", 
    position: "PR Member", 
    image: "/team/mahishukla.jpg.png", 
    bio: "B.Tech 2nd year student passionate to learn new tech skills, data science, and marketing campaigns. | Tech Stack: Python | Focus: Data Science, Marketing Strategy", 
    skills: ["Marketing", "PR"], 
    branch: "DS",
    socials: { linkedin: "https://www.linkedin.com/in/mahi-shukla-1152613aa" } 
  },
  { 
    id: "M-PR2", 
    level: 5,
    domain: "pr",
    name: "Anjali Yadav", 
    position: "PR Member", 
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400", 
    bio: "Passionate about event marketing, community building, and brand outreach.", 
    skills: ["Marketing", "Outreach"], 
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "M-PR3", 
    level: 5,
    domain: "pr",
    name: "Arushi Tiwari", 
    position: "PR Member", 
    image: "/team/arushi.jpg.jpeg", 
    bio: "Hardworking and enthusiastic student passionate about learning new things, programming, and personal development. | Tech Stack: C, Python | Focus: AI/ML, Event Marketing", 
    skills: ["Marketing", "PR"], 
    branch: "IT",
    socials: { linkedin: "https://www.linkedin.com/in/arushi-tiwari" } 
  },
  { 
    id: "M-PR4", 
    level: 5,
    domain: "pr",
    name: "Aditi Mishra", 
    position: "PR Member", 
    image: "/team/aditimishra.jpg.jpg", 
    bio: "Deeply interested in AI, ML, and emerging technologies with a passion for learning and building innovative projects. | Tech Stack: C, Python | Focus: AI/ML, DSA", 
    skills: ["Marketing", "PR"], 
    branch: "AL",
    socials: { linkedin: "https://www.linkedin.com/in/aditi-mishra-928117385" } 
  },
  { 
    id: "M-PR7", 
    level: 5,
    domain: "pr",
    name: "Pankaj Kumar", 
    position: "PR Member", 
    image: "/team/pankajkumar.jpg.jpeg", 
    bio: "Active in student relations, event promotion, and strategic community management.", 
    skills: ["Marketing", "PR"], 
    branch: "CSE",
    socials: { linkedin: "https://linkedin.com" } 
  }
];

export const defaultLegacyHeads: LegacyHeadItem[] = [
  {
    id: "legacy-1",
    name: "Shraddha Singhdal",
    role: "Lead (AIML)",
    tenure: "2023-Present",
    placedAt: "TBA",
    image: "/team/shraddha.jpg.png",
    bio: "Lead at CSI SRMCEM. Driving technical excellence in Artificial Intelligence and Machine Learning.",
    highlight: "AIML Leadership"
  },
  {
    id: "legacy-2",
    name: "Aastha Prakash",
    role: "Chapter Lead",
    tenure: "2024-2025",
    placedAt: "Josh Technology Group",
    image: "/team/aastha.jpg.png",
    bio: "Former Chapter Lead at CSI SRMCEM. Currently working as a Software Quality Analyst at Josh Technology Group.",
    highlight: "SQA @ Josh Technology"
  }
];

export const defaultSubTeams: SubTeamItem[] = [
  {
    id: "subteam-1",
    title: "Technical Team",
    category: "Core Engineering",
    color: "sky",
    frontDesc: "Full-stack development, AI/ML, and open-source software.",
    backDesc: "Our core engineering wing powering club web platforms, competitive tools, AI workflows, and automated judge systems.",
    points: ["Next.js & Cloud Deployments", "AI/ML Model Pipelines", "Open Source Repositories"]
  },
  {
    id: "subteam-2",
    title: "Design & Media",
    category: "UI/UX & Branding",
    color: "purple",
    frontDesc: "Visual aesthetics, interactive design & creative direction.",
    backDesc: "From Figma wireframes to sleek 3D motion graphics and brand identity, we ensure every digital asset touches a world-class standard.",
    points: ["Figma UI/UX & Prototypes", "3D Graphics & Animations", "Visual Brand Identity"]
  },
  {
    id: "subteam-3",
    title: "Event Management",
    category: "Logistics & Hackathons",
    color: "blue",
    frontDesc: "Managing 48h hackathons, workshops & speaker logistics.",
    backDesc: "We oversee end-to-end event execution, speaker hosting, platform judging setups, and physical venue coordination for 500+ attendees.",
    points: ["48h Hackathon Operations", "Speaker Accommodations", "Live Bootcamp Coordination"]
  },
  {
    id: "subteam-4",
    title: "PR & Outreach",
    category: "Sponsorships & Connect",
    color: "indigo",
    frontDesc: "Handling sponsorships, institutional partnerships & reach.",
    backDesc: "We are the public ambassadors of the chapter. We secure corporate sponsorships, collaborate with top tech communities, and expand alumni networks.",
    points: ["Corporate Sponsorships", "Inter-College Outreach", "Alumni Career Guidance"]
  },
  {
    id: "subteam-5",
    title: "Photography & Socials",
    category: "Media & Social Channels",
    color: "cyan",
    frontDesc: "Capturing moments & managing our digital social presence.",
    backDesc: "We capture high-octane moments from our tech events, produce cinematic recaps, and manage high-engagement channels on LinkedIn, Instagram & YouTube.",
    points: ["Cinematic Event Shoots", "Social Media Campaigns", "Post-Event Video Recaps"]
  }
];

export const defaultCoreValues: CoreValueItem[] = [
  {
    id: "core-1",
    title: "Hackathons & Tech Talks",
    category: "Innovation & Build",
    color: "sky",
    frontDesc: "Workshops, Speaker Sessions & 48h Hackathons exploring cutting-edge technology.",
    backDesc: "We regularly organize 24-48 hour Hackathons and Tech Talks where students interact with experienced industry speakers, gain valuable real-world insights, and convert ambitious ideas into production-ready software.",
    points: ["24-48 Hour Code Sprints", "Industry Expert Speakers", "Hands-on Tech Workshops"]
  },
  {
    id: "core-2",
    title: "Daily DSA & Contests",
    category: "Algorithmic Excellence",
    color: "blue",
    frontDesc: "Daily Algorithm Practice & Live Coding Contests to sharpen problem solving under pressure.",
    backDesc: "Focusing heavily on coding excellence through Daily DSA sessions with guided explanations, discussions, and practice. Regular contests challenge students to improve their algorithmic reasoning in a healthy, competitive environment.",
    points: ["Daily Problem Practice", "Live Coding Contests", "Placement Interview Prep"]
  },
  {
    id: "core-3",
    title: "Real-World Projects",
    category: "Full-Stack & Systems",
    color: "cyan",
    frontDesc: "Hands-on Development & Industry Stacks across Web, AI/ML, Cloud & Cybersecurity.",
    backDesc: "Collaborative software development bridging the gap between classroom theory and production engineering. Students build scalable web platforms, machine learning models, and open-source tooling with senior mentorship.",
    points: ["Production-Grade Apps", "Open-Source Collaboration", "Mentorship from Seniors"]
  },
  {
    id: "core-4",
    title: "Leadership & Community",
    category: "Team & Growth",
    color: "indigo",
    frontDesc: "Teamwork, Content Creation & Growth cultivating the next generation of tech leaders.",
    backDesc: "Beyond technical learning, we promote teamwork, technical content creation, and community engagement, ensuring every member gets opportunities to lead initiatives, collaborate, and build enduring networks.",
    points: ["Peer Mentorship Network", "Technical Leadership Roles", "Alumni Career Guidance"]
  }
];

export const defaultNewsIssues: NewsIssueItem[] = [
  {
    id: "news-oct-2024",
    volume: "Vol. 08",
    month: "October",
    year: "2024",
    title: "CSI_SRMCEM X D'CODERS Monthly Gazette — Autumn 2024 Edition",
    description: "Featuring complete coverage of Hackathon Decoded 2024, deep dive into Agentic AI workflows, campus recruitment success stories, and our Daily DSA leaderboard champions.",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=1000",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "5.4 MB",
    pageCount: 16,
    topics: ["Hackathon Decoded 2024", "Agentic AI & LLMs", "100% Placement Record", "DSA Contest Champions"],
    isCurrent: true
  },
  {
    id: "news-sep-2024",
    volume: "Vol. 07",
    month: "September",
    year: "2024",
    title: "Web3 Protocols, Open Source Sprints & Freshers Induction",
    description: "Welcoming the incoming cohort of engineers, exploring decentralized systems, and recapping 500+ GitHub contributions.",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600&h=800",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "4.8 MB",
    pageCount: 14,
    topics: ["Web3 Architecture", "Open Source Sprint", "Freshers Induction"],
    isCurrent: false
  },
  {
    id: "news-aug-2024",
    volume: "Vol. 06",
    month: "August",
    year: "2024",
    title: "AI & Neural Networks Bootcamp Special Gazette",
    description: "Student projects spotlight, building your first neural network from scratch, and hands-on PyTorch workshop recap.",
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=600&h=800",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "6.1 MB",
    pageCount: 18,
    topics: ["Neural Networks", "PyTorch Special", "Alumni Tech Talk"],
    isCurrent: false
  },
  {
    id: "news-jul-2024",
    volume: "Vol. 05",
    month: "July",
    year: "2024",
    title: "Cloud Infrastructure, DevOps & Containerization",
    description: "Deploying microservices with Docker and Kubernetes, cloud security fundamentals, and mid-year coding contest winners.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=800",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "4.5 MB",
    pageCount: 12,
    topics: ["Docker & K8s", "DevOps Pipelines", "DSA Leaderboard"],
    isCurrent: false
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: "gal-1",
    image: "/events/ideafest.jpg.jpeg",
    title: "IdeaFest 2024",
    detail: "A competitive hackathon with cash prizes and intense coding sessions.",
    size: "large"
  },
  {
    id: "gal-2",
    image: "/events/bytebattle.jpg.jpeg",
    title: "Byte Battle",
    detail: "Multi-language coding battle featuring top programmers.",
    size: "small"
  },
  {
    id: "gal-3",
    image: "/events/nationalyouthday.jpg.jpeg",
    title: "National Youth Day",
    detail: "Tech talk on Smart India Hackathon and Innovation.",
    size: "small"
  },
  {
    id: "gal-4",
    image: "/events/cupidcoding.jpg.jpeg",
    title: "Cupid Coding Contest",
    detail: "\"Commit to Code, NOT Chaos\" - Our signature Valentine-themed DSA contest.",
    size: "wide"
  },
  {
    id: "gal-5",
    image: "/events/techtalk.jpg.jpeg",
    title: "AI Tech Talk",
    detail: "Deep dive into the world of Artificial Intelligence by Arjit Verma.",
    size: "small"
  },
  {
    id: "gal-6",
    image: "/events/codeshalla.jpg.jpeg",
    title: "Codeshalla Bootcamp",
    detail: "Interactive 7-day C++ programming bootcamp over Discord.",
    size: "tall"
  }
];

export const defaultStats: ClubStats = {
  eventsHosted: "50+",
  activeMembers: "1000+",
  liveProjects: "50+",
  placementRate: "100%"
};

// ============================================================================
// STORAGE HELPERS (SUPABASE ONLY - NO LOCAL STORAGE)
// ============================================================================

// In-Memory Cache (For 0ms fast tab navigation within current session)
const memCache: {
  events?: EventItem[];
  team?: TeamMemberItem[];
  legacyHeads?: LegacyHeadItem[];
  subTeams?: SubTeamItem[];
  coreValues?: CoreValueItem[];
  newsIssues?: NewsIssueItem[];
  gallery?: GalleryItem[];
  stats?: ClubStats;
  subscribers?: SubscriberItem[];
} = {};

// Helper: Fetch strictly from Supabase
async function fetchFromSupabase<T>(table: string, fallback: T[]): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    
    // If Supabase returns data (even an empty array []), respect it completely as single source of truth
    const result = data ? (data as T[]) : [];
    memCache[table as keyof typeof memCache] = result as any;
    return result;
  } catch (error) {
    console.warn(`Notice fetching from Supabase (${table}):`, error);
    // On genuine network/connection error, return memory cache or empty array (never inject deleted seeds!)
    return (memCache[table as keyof typeof memCache] as unknown as T[]) || [];
  }
}

// Multi-Tab & Multi-Window Realtime Broadcast Sync
export function notifyDataUpdated() {
  if (typeof window !== "undefined") {
    // 1. Same-tab DOM Event
    window.dispatchEvent(new Event("csi_data_updated"));

    // 2. BroadcastChannel (0ms Instant Multi-Tab Broadcast)
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("csi_cms_realtime_sync");
        bc.postMessage({ type: "CSI_DATA_UPDATED", timestamp: Date.now() });
        bc.close();
      }
    } catch (e) {}
  }
}

export function subscribeToUpdates(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = () => callback();
  window.addEventListener("csi_data_updated", handleCustomEvent);

  let bc: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== "undefined") {
      bc = new BroadcastChannel("csi_cms_realtime_sync");
      bc.onmessage = (event) => {
        if (event.data?.type === "CSI_DATA_UPDATED") {
          callback();
        }
      };
    }
  } catch (e) {}

  return () => {
    window.removeEventListener("csi_data_updated", handleCustomEvent);
    if (bc) {
      bc.close();
    }
  };
}

// Helper: Save strictly to Supabase
async function saveToSupabase<T extends { id: string }>(table: string, items: T[]): Promise<void> {
  try {
    // 1. Delete removed items from Supabase DB first
    const newIds = new Set(items.map(i => i.id));
    const { data: currentData, error: fetchErr } = await supabase.from(table).select('id');
    if (fetchErr) {
      console.warn(`Notice reading IDs from ${table}:`, fetchErr.message);
    }
    if (currentData && currentData.length > 0) {
      const idsToDelete = currentData.map(c => c.id).filter(id => !newIds.has(id));
      if (idsToDelete.length > 0) {
        const { error: delErr } = await supabase.from(table).delete().in('id', idsToDelete);
        if (delErr) {
          console.error(`Failed to delete IDs [${idsToDelete.join(', ')}] from ${table}:`, delErr.message);
        }
      }
    }

    // 2. Upsert remaining items if any
    if (items.length > 0) {
      const { error: upsertErr } = await supabase.from(table).upsert(items);
      if (upsertErr) throw upsertErr;
    }

    memCache[table as keyof typeof memCache] = items as any;
    notifyDataUpdated();
  } catch (error: any) {
    console.warn(`Notice saving to ${table}:`, error?.message || error?.details || JSON.stringify(error));
    memCache[table as keyof typeof memCache] = items as any;
    notifyDataUpdated();
  }
}

function getMemCached<T>(key: string, fallback: T): T {
  if (memCache[key as keyof typeof memCache] !== undefined) {
    return memCache[key as keyof typeof memCache] as unknown as T;
  }
  return fallback;
}

export function getEffectiveCategory(event: EventItem): "upcoming" | "current" | "past" {
  if (event.category === "past") return "past";

  if (event.date) {
    let cleanStr = event.date
      .replace(/onwards/i, "")
      .replace(/Multiple Days/i, "")
      .replace(/Flexible/i, "")
      .replace(/TBA/i, "")
      .trim();

    if (/^[A-Za-z]+\s+\d{4}$/.test(cleanStr)) {
      cleanStr = `1 ${cleanStr}`;
    }

    const eventTime = new Date(cleanStr).getTime();
    if (!isNaN(eventTime)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventTime < today.getTime()) {
        return "past";
      }
    }
  }

  return event.category || "upcoming";
}

// Public CMS Getters & Setters
export const DataStore = {
  notifyDataUpdated,
  subscribeToUpdates,
  getEffectiveCategory,
  // Synchronous Memory Cache Getters (Instant 0ms first render fallback)
  getEventsSync: (): EventItem[] => getMemCached("events", defaultEvents),
  getTeamSync: (): TeamMemberItem[] => getMemCached("team", defaultTeam),
  getLegacyHeadsSync: (): LegacyHeadItem[] => getMemCached("legacyHeads", defaultLegacyHeads),
  getSubTeamsSync: (): SubTeamItem[] => getMemCached("subTeams", defaultSubTeams),
  getCoreValuesSync: (): CoreValueItem[] => getMemCached("coreValues", defaultCoreValues),
  getNewsIssuesSync: (): NewsIssueItem[] => getMemCached("newsIssues", defaultNewsIssues),
  getGallerySync: (): GalleryItem[] => getMemCached("gallery", defaultGallery),
  getStatsSync: (): ClubStats => getMemCached("stats", defaultStats),

  // Seed Getters
  getEventsSeed: (): EventItem[] => [],
  getTeamSeed: (): TeamMemberItem[] => [],
  getLegacyHeadsSeed: (): LegacyHeadItem[] => [],
  getSubTeamsSeed: (): SubTeamItem[] => [],
  getCoreValuesSeed: (): CoreValueItem[] => [],
  getNewsIssuesSeed: (): NewsIssueItem[] => [],
  getGallerySeed: (): GalleryItem[] => [],
  getStatsSeed: (): ClubStats => defaultStats,
  getSubscribersSync: (): SubscriberItem[] => getMemCached("subscribers", []),

  // Events
  getEvents: async (): Promise<EventItem[]> => {
    const fetched = await fetchFromSupabase<EventItem>('events', defaultEvents);
    const processed = fetched.map(item => ({
      ...item,
      image: item.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400",
      isFeatured: item.isFeatured ?? (item.category === "upcoming" || item.category === "current")
    }));
    memCache.events = processed;
    return processed;
  },
  saveEvents: async (data: EventItem[]) => {
    memCache.events = data;
    const dbData = data.map(({ isFeatured, ...rest }) => rest);
    await saveToSupabase('events', dbData as any);
  },

  // Team
  getTeam: async (): Promise<TeamMemberItem[]> => {
    const fetched = await fetchFromSupabase<TeamMemberItem>('team', defaultTeam);
    const processed = fetched.map(item => {
      let rawImg = (item.image && item.image.trim()) ? item.image.trim() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";
      if (rawImg.startsWith("data:") && rawImg.length > 50000) {
        const nameLower = (item.name || "").toLowerCase();
        if (nameLower.includes("tanu")) rawImg = "/team/1788512714000_IMG_4034.JPG.jpeg";
        else if (nameLower.includes("aditya")) rawImg = "/team/adityamaddheshiya.jpg.jpeg";
        else rawImg = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";
      }
      return {
        ...item,
        image: rawImg,
        level: item.level || 5,
        domain: item.domain || "technical",
        skills: Array.isArray(item.skills) ? item.skills : [],
        socials: item.socials || {}
      };
    });
    memCache.team = processed;
    return processed;
  },
  saveTeam: async (data: TeamMemberItem[]) => {
    memCache.team = data;
    await saveToSupabase('team', data);
  },

  // Legacy Heads
  getLegacyHeads: async (): Promise<LegacyHeadItem[]> => {
    const fetched = await fetchFromSupabase('legacy_heads', defaultLegacyHeads);
    const processed = fetched.map(item => ({
      ...item,
      image: item.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400"
    }));
    memCache.legacyHeads = processed;
    return processed;
  },
  saveLegacyHeads: async (data: LegacyHeadItem[]) => {
    memCache.legacyHeads = data;
    await saveToSupabase('legacy_heads', data);
  },

  // Sub-Teams
  getSubTeams: async (): Promise<SubTeamItem[]> => {
    const res = await fetchFromSupabase('sub_teams', defaultSubTeams);
    memCache.subTeams = res;
    return res;
  },
  saveSubTeams: async (data: SubTeamItem[]) => {
    memCache.subTeams = data;
    await saveToSupabase('sub_teams', data);
  },

  // Core Values
  getCoreValues: async (): Promise<CoreValueItem[]> => {
    const res = await fetchFromSupabase('core_values', defaultCoreValues);
    memCache.coreValues = res;
    return res;
  },
  saveCoreValues: async (data: CoreValueItem[]) => {
    memCache.coreValues = data;
    await saveToSupabase('core_values', data);
  },

  // News Issues
  getNewsIssues: async (): Promise<NewsIssueItem[]> => {
    const fetched = await fetchFromSupabase<NewsIssueItem>('news_issues', defaultNewsIssues);
    const processed = fetched.map(item => ({
      ...item,
      pdfUrl: item.pdfUrl || "/documents/csi-gazette-october-2024.pdf"
    }));
    memCache.newsIssues = processed;
    return processed;
  },
  saveNewsIssues: async (data: NewsIssueItem[]) => {
    memCache.newsIssues = data;
    await saveToSupabase('news_issues', data);
  },

  // Gallery
  getGallery: async (): Promise<GalleryItem[]> => {
    const res = await fetchFromSupabase('gallery', defaultGallery);
    memCache.gallery = res;
    return res;
  },
  saveGallery: async (data: GalleryItem[]) => {
    memCache.gallery = data;
    await saveToSupabase('gallery', data);
  },

  // Stats
  getStats: async (): Promise<ClubStats> => {
    try {
      const { data, error } = await supabase.from('stats').select('*').eq('id', 'main').single();
      if (error) {
        if (error.code === 'PGRST116') {
          memCache.stats = defaultStats;
          return defaultStats;
        }
        throw error;
      }
      const res = data as ClubStats;
      memCache.stats = res;
      return res;
    } catch (error) {
      console.warn(`Notice fetching stats:`, error);
      return memCache.stats || defaultStats;
    }
  },
  saveStats: async (data: ClubStats) => {
    try {
      memCache.stats = data;
      const { error } = await supabase.from('stats').upsert({ id: 'main', ...data });
      if (error) throw error;
      notifyDataUpdated();
    } catch (error) {
      console.warn(`Notice saving stats:`, error);
      notifyDataUpdated();
    }
  },

  getAdminPassword: (): string => {
    return process.env.NEXT_PUBLIC_ADMIN_SECRET || "admin123";
  },
  saveAdminPassword: (_pwd: string) => {
    // Admin password managed via env or Supabase Auth
  },

  // Export Complete Backup JSON
  exportBackup: async (): Promise<WebsiteDataBackup> => ({
    version: "3.0 (Supabase)",
    exportedAt: new Date().toISOString(),
    events: await DataStore.getEvents(),
    team: await DataStore.getTeam(),
    legacyHeads: await DataStore.getLegacyHeads(),
    subTeams: await DataStore.getSubTeams(),
    coreValues: await DataStore.getCoreValues(),
    newsIssues: await DataStore.getNewsIssues(),
    gallery: await DataStore.getGallery(),
    stats: await DataStore.getStats(),
  }),

  // Import Complete Backup JSON
  importBackup: async (backup: Partial<WebsiteDataBackup>): Promise<boolean> => {
    try {
      if (backup.events) await DataStore.saveEvents(backup.events);
      if (backup.team) await DataStore.saveTeam(backup.team);
      if (backup.legacyHeads) await DataStore.saveLegacyHeads(backup.legacyHeads);
      if (backup.subTeams) await DataStore.saveSubTeams(backup.subTeams);
      if (backup.coreValues) await DataStore.saveCoreValues(backup.coreValues);
      if (backup.newsIssues) await DataStore.saveNewsIssues(backup.newsIssues);
      if (backup.gallery) await DataStore.saveGallery(backup.gallery);
      if (backup.stats) await DataStore.saveStats(backup.stats);
      return true;
    } catch (e) {
      console.error("Failed to import backup", e);
      return false;
    }
  },

  // Add Newsletter Subscriber
  addSubscriber: async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("subscribers").insert([{ email, created_at: new Date().toISOString() }]);
      if (error && error.code !== "PGRST204") {
        console.warn("Supabase subscriber save notice:", error.message);
      }
      notifyDataUpdated();
      return true;
    } catch (err: any) {
      console.warn("Subscriber save error:", err?.message || err);
      return false;
    }
  },

  // Get Newsletter Subscribers
  getSubscribers: async (): Promise<SubscriberItem[]> => {
    try {
      const { data, error } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        memCache.subscribers = data as SubscriberItem[];
        return data as SubscriberItem[];
      }
    } catch (err) {
      console.warn("Fetch subscribers notice:", err);
    }
    return memCache.subscribers || [];
  },

  // Delete Subscriber
  deleteSubscriber: async (emailOrId: string): Promise<boolean> => {
    try {
      if (emailOrId.includes("@")) {
        await supabase.from("subscribers").delete().eq("email", emailOrId);
      } else {
        await supabase.from("subscribers").delete().eq("id", emailOrId);
      }
      notifyDataUpdated();
      return true;
    } catch (err) {
      console.warn("Delete subscriber notice:", err);
      return false;
    }
  },

  // Reset Everything to Official Defaults
  resetToDefaults: async () => {
    await DataStore.saveEvents(defaultEvents);
    await DataStore.saveTeam(defaultTeam);
    await DataStore.saveLegacyHeads(defaultLegacyHeads);
    await DataStore.saveSubTeams(defaultSubTeams);
    await DataStore.saveCoreValues(defaultCoreValues);
    await DataStore.saveNewsIssues(defaultNewsIssues);
    await DataStore.saveGallery(defaultGallery);
    await DataStore.saveStats(defaultStats);
  }
};

// Auto Pre-warm Memory Cache on Client Module Load for 0ms Instant Page Loads
if (typeof window !== "undefined") {
  Promise.all([
    DataStore.getEvents(),
    DataStore.getTeam(),
    DataStore.getLegacyHeads(),
    DataStore.getSubTeams(),
    DataStore.getCoreValues(),
    DataStore.getNewsIssues(),
    DataStore.getGallery(),
    DataStore.getStats()
  ]).catch(() => {});
}


