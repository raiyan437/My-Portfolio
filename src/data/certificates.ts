export const certificateTopics = {
  ai: "AI & automation",
  security: "Cybersecurity",
  design: "Design",
  community: "Community",
  wellness: "Wellness",
} as const;

const ibmCredential = { issuer: "IBM SkillsBuild", topic: "ai", year: "2026" } as const;

export const certificates = [
  {
    title: "Information Security",
    issuer: "BJIT Academy",
    category: "CYBERSECURITY",
    topic: "security",
    year: "2025",
    file: "Information Security",
    featured: true
  },
  {
    title: "AI-ization with GitHub Copilot & Claude",
    issuer: "BJIT Academy",
    category: "GENAI & AUTOMATION",
    topic: "ai",
    year: "2025",
    file: "AI-ization-with-GitHub-Copilot-and-Claude-certificate",
    featured: true
  },
  {
    ...ibmCredential,
    title: "Artificial Intelligence Fundamentals",
    category: "AI & DATA SCIENCE",
    file: "Artificical Intelligence Fundamentals",
    featured: true
  },
  {
    ...ibmCredential,
    title: "Introduction to Generative AI",
    category: "GENERATIVE AI"
  },
  {
    ...ibmCredential,
    title: "Machine Learning & Deep Learning",
    category: "MACHINE LEARNING",
    file: "Machine Learning and Deep Learning"
  },
  {
    ...ibmCredential,
    title: "Natural Language Processing & Computer Vision",
    category: "NLP & VISION",
    file: "Natural Language Processing and Computer Vision"
  },
  {
    ...ibmCredential,
    title: "Run AI Models with IBM Watson Studio",
    category: "CLOUD & AI DEPLOYMENT"
  },
  {
    ...ibmCredential,
    title: "AI Ethics",
    category: "AI GOVERNANCE"
  },
  {
    ...ibmCredential,
    title: "Introduction to Artificial Intelligence",
    category: "AI ESSENTIALS"
  },
  {
    ...ibmCredential,
    title: "Your Future in AI: The Job Landscape",
    category: "AI CAREERS & TRENDS",
    file: "Your Future in AI The Job Landscape"
  },
  {
    title: "Graphics Design",
    issuer: "New Horizons Computer Learning Centers",
    category: "CREATIVE DESIGN",
    topic: "design",
    year: "2016",
    file: "Graphics Design Certificate"
  },
  {
    title: "Fight Against Winter",
    issuer: "Youth’s Voice",
    category: "SOCIAL WORK & COMMUNITY",
    topic: "community",
    year: "2016",
    file: "Fight against winter (Social Work)"
  },
  {
    title: "Project Chana Piyaju",
    issuer: "Youth’s Voice",
    category: "SOCIAL WORK & VOLUNTEERING",
    topic: "community",
    year: "2016",
    file: "Project chauna piyaju (Social Work)"
  },
  {
    title: "Yoga & Meditation",
    issuer: "BRAC University",
    category: "HEALTH & WELLNESS",
    topic: "wellness",
    year: "2019",
    file: "Yoga-and-Meditation-Certificate"
  }
];
