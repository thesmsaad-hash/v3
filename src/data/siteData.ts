export interface NavItem {
  label: string;
  path: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon?: string;
  details?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  client: string;
  timeline: string;
  image: string;
  description: string;
  focus?: string[];
  tags: string[];
  url?: string;
}

export interface ToolItem {
  name: string;
  description: string;
  logo: string;
  category: "Creative Tools" | "Web Technologies" | "AI & Development";
}

export interface SkillItem {
  name: string;
  category: "Creative Skills" | "Web Development" | "AI & Automation";
}

export interface PhilosophyItem {
  title: string;
  description: string;
}

export interface WorkflowItem {
  step: string;
  title: string;
  description: string;
}

export interface EducationItem {
  institution: string;
  focus: string;
  details: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

export const siteConfig = {
  name: "SM SAAD",
  role: "Video Editor, VFX Compositing Artist & Web Developer",
  tagline: "Video Editing • VFX • Web Development • Motion Graphics • AI",
  heroHeading: "I Create. I Edit. I Build.",
  heroSubhead: "I combine visual storytelling, post-production and modern web technologies to create engaging content, digital experiences and creative projects.",
  website: "smsaad.online",
  email: "contact@smsaad.online",
  introText: "I'm SM SAAD — a Video Editor, VFX Compositing Artist & Web Developer. I create visual content, build digital experiences and explore modern creative technologies. My work combines video editing, VFX compositing, motion graphics and web development with AI-assisted workflows.",
  aboutText: "A Creative Professional Who Creates & Builds. I'm a multidisciplinary creative professional focused on video editing, VFX compositing, motion graphics and web development. My creative work is centered around visual storytelling — transforming raw footage, concepts and ideas into polished content. Alongside post-production, I build websites and experiment with digital products, AI tools and automation workflows.",
  socials: {
    github: "https://github.com/thesmsaad-hash",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
};

export const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Projects", path: "/works" },
  { label: "Free Assets", path: "/assets" },
  { label: "Skills", path: "/resume" },
  { label: "Blog", path: "/blogs" },
  { label: "AI Agent", path: "/agent" },
  { label: "Contact", path: "/contact" },
];

export const servicesData: ServiceItem[] = [
  {
    id: "video-editing",
    number: "01",
    title: "Video Editing",
    description: "Transform raw footage into engaging videos with strong pacing, storytelling and professional finishing.",
    details: [
      "YouTube Videos & Long-Form",
      "Instagram Reels & YouTube Shorts",
      "Promotional & Brand Videos",
      "Social Media Content & Short-Form"
    ]
  },
  {
    id: "vfx-compositing",
    number: "02",
    title: "VFX & Compositing",
    description: "Create and integrate visual effects to enhance footage and create seamless visual compositions.",
    details: [
      "Green Screen Keying & Rotoscoping",
      "Screen Replacement & Object Removal",
      "Footage Cleanup & Visual Integration",
      "Multi-Pass VFX Compositing"
    ]
  },
  {
    id: "motion-graphics",
    number: "03",
    title: "Motion Graphics",
    description: "Create animated graphics and visual elements that make content more engaging.",
    details: [
      "Title Cards & Typography Animation",
      "Logo Animation & Motion Design",
      "Social Graphics & Explainer Visuals",
      "Custom Transitions & Package Design"
    ]
  },
  {
    id: "web-development",
    number: "04",
    title: "Web Development",
    description: "Build responsive websites and modern digital interfaces.",
    details: [
      "Portfolio & Creator Websites",
      "Landing Pages & Business Sites",
      "WordPress Custom Websites",
      "Responsive Interfaces (React, Next.js, HTML/CSS, JS, PHP, APIs)"
    ]
  },
  {
    id: "ai-creative-technology",
    number: "05",
    title: "AI & Creative Technology",
    description: "Explore AI-assisted workflows and modern technologies that can improve creative production and experimentation.",
    details: [
      "AI-assisted Content Creation",
      "AI Visual Experimentation",
      "Creative & Workflow Automation",
      "AI Tools & Web Experiments for Creators"
    ]
  },
  {
    id: "social-media-content",
    number: "06",
    title: "Social Media Content",
    description: "Create content designed for modern digital platforms.",
    details: [
      "Instagram Reels & TikTok Content",
      "YouTube Shorts & Creator Content",
      "Social Advertisements & Promo Clips",
      "Platform Engagement Strategies"
    ]
  },
  {
    id: "thumbnail-graphic-design",
    number: "07",
    title: "Thumbnail & Graphic Design",
    description: "Create visually strong graphics for digital content.",
    details: [
      "High-CTR YouTube Thumbnails",
      "Social Media Graphics & Covers",
      "Promotional Graphics & Assets",
      "Digital Artwork & Brand Visuals"
    ]
  }
];

export const toolsData: ToolItem[] = [
  // Creative Tools
  {
    name: "Adobe Premiere Pro",
    description: "Primary video editing and post-production workflow.",
    logo: "/assets/images/vslogo.png",
    category: "Creative Tools"
  },
  {
    name: "Adobe After Effects",
    description: "Motion graphics, compositing and visual effects.",
    logo: "/assets/images/framerlogo.png",
    category: "Creative Tools"
  },
  {
    name: "Adobe Photoshop",
    description: "Thumbnail design, graphics and image editing.",
    logo: "/assets/images/testtt.png",
    category: "Creative Tools"
  },
  {
    name: "DaVinci Resolve",
    description: "Color grading and professional video finishing.",
    logo: "/assets/images/webflowlogo.png",
    category: "Creative Tools"
  },
  {
    name: "Blender",
    description: "3D and visual experimentation.",
    logo: "/assets/images/elementorlogo.png",
    category: "Creative Tools"
  },
  {
    name: "Canva",
    description: "Fast creative design and social media content.",
    logo: "/assets/images/logo1.png",
    category: "Creative Tools"
  },

  // Web Technologies
  {
    name: "WordPress",
    description: "CMS, custom theme implementation and creator websites.",
    logo: "/assets/images/elementorlogo.png",
    category: "Web Technologies"
  },
  {
    name: "HTML5 & CSS3",
    description: "Modern semantic structure, styling and responsive design.",
    logo: "/assets/images/webflowlogo.png",
    category: "Web Technologies"
  },
  {
    name: "JavaScript",
    description: "Client-side interactivity and web applications.",
    logo: "/assets/images/vslogo.png",
    category: "Web Technologies"
  },
  {
    name: "React & Next.js",
    description: "Modern component-based web interfaces and applications.",
    logo: "/assets/images/framerlogo.png",
    category: "Web Technologies"
  },

  // AI & Development
  {
    name: "Ollama & Local AI",
    description: "Local LLMs and experimental AI text/visual workflows.",
    logo: "/assets/images/logo2.png",
    category: "AI & Development"
  },
  {
    name: "n8n Automation",
    description: "Workflow automation and node-based integrations.",
    logo: "/assets/images/logo1.png",
    category: "AI & Development"
  },
  {
    name: "GitHub",
    description: "Version control, repositories and project deployment.",
    logo: "/assets/images/testtt.png",
    category: "AI & Development"
  }
];

export const skillsData: SkillItem[] = [
  // Creative Skills
  { name: "Video Editing", category: "Creative Skills" },
  { name: "VFX Compositing", category: "Creative Skills" },
  { name: "Motion Graphics", category: "Creative Skills" },
  { name: "Post Production", category: "Creative Skills" },
  { name: "Color Grading", category: "Creative Skills" },
  { name: "Sound Design", category: "Creative Skills" },
  { name: "Visual Storytelling", category: "Creative Skills" },
  { name: "Social Media Content", category: "Creative Skills" },

  // Web Development
  { name: "HTML & CSS", category: "Web Development" },
  { name: "JavaScript", category: "Web Development" },
  { name: "React", category: "Web Development" },
  { name: "Next.js", category: "Web Development" },
  { name: "WordPress", category: "Web Development" },
  { name: "PHP", category: "Web Development" },
  { name: "Responsive Web Design", category: "Web Development" },
  { name: "UI Implementation", category: "Web Development" },
  { name: "API Integration", category: "Web Development" },

  // AI & Automation
  { name: "AI-assisted Workflows", category: "AI & Automation" },
  { name: "AI Tools for Creators", category: "AI & Automation" },
  { name: "Automation Design", category: "AI & Automation" },
  { name: "Workflow Design", category: "AI & Automation" },
  { name: "Local AI Experimentation", category: "AI & Automation" },
  { name: "AI-powered Applications", category: "AI & Automation" }
];

export const philosophyData: PhilosophyItem[] = [
  {
    title: "Story First",
    description: "Every edit should have a purpose. Good visuals should support the story rather than distract from it."
  },
  {
    title: "Details Matter",
    description: "Timing, sound, color, transitions and small visual details can completely change the quality of a project."
  },
  {
    title: "Build & Experiment",
    description: "I enjoy creating websites, digital tools and experimental projects alongside creative work."
  },
  {
    title: "Use Technology Creatively",
    description: "AI and modern technologies can accelerate creative workflows and open new possibilities."
  }
];

export const workflowData: WorkflowItem[] = [
  {
    step: "01",
    title: "Understand",
    description: "Understand the idea, audience and objective."
  },
  {
    step: "02",
    title: "Plan",
    description: "Define the creative direction, structure and technology required."
  },
  {
    step: "03",
    title: "Create",
    description: "Edit, design, develop or build the project."
  },
  {
    step: "04",
    title: "Refine",
    description: "Improve visuals, functionality, performance and user experience."
  },
  {
    step: "05",
    title: "Deliver",
    description: "Prepare the final project for real-world use."
  }
];

export const currentlyExploring = [
  "AI-powered creative tools",
  "Local AI & Ollama workflows",
  "AI automation & n8n nodes",
  "Modern web development (React / Next.js)",
  "Creator-focused web applications",
  "Video editing automation",
  "WordPress theme & custom development",
  "Digital product prototyping"
];

export const educationData: EducationItem[] = [
  {
    institution: "Arena Animation",
    focus: "Animation, VFX, Compositing & Creative Production",
    details: "Comprehensive professional training in digital post-production, visual effects compositing, 2D/3D motion graphics, and audio-visual production."
  }
];

// SOLE PROJECT: SYNAPTO ONLY
export const projectsData: ProjectItem[] = [
  {
    id: "synapto",
    title: "Synapto",
    category: "Web Application",
    client: "Personal Project",
    timeline: "Concept / Development",
    image: "/assets/images/works1.jpg",
    description: "An experimental knowledge-management application focused on organizing notes, ideas and connected knowledge through a modern digital interface.",
    focus: [
      "Knowledge Organization",
      "Notes & Connected Information",
      "Personal Knowledge Management",
      "Modern User Interface",
      "Productivity"
    ],
    tags: ["React", "TypeScript", "Knowledge Management", "UI/UX", "Experimental"]
  }
];

export const blogsData: BlogPost[] = [
  {
    id: "1",
    title: "Kalakar AI Review: AI Captioning Software for Desi Creators",
    excerpt: "Discover Kalakar AI, an AI captioning platform built for Desi creators with multilingual captions, templates, audio enhancement, and professional editing integrations.",
    category: "Web & AI",
    date: "2026",
    readTime: "5 min read",
    image: "/assets/images/works4.jpg",
    author: "SM SAAD"
  },
  {
    id: "2",
    title: "How AI Is Changing Creative Workflows",
    excerpt: "Exploring how modern AI tools accelerate visual ideation, concept generation, and repetitive task automation without replacing human creativity.",
    category: "AI Technology",
    date: "2026",
    readTime: "5 min read",
    image: "/assets/images/works2.jpg",
    author: "SM SAAD"
  },
  {
    id: "3",
    title: "Why Sound Design Matters in Video Editing",
    excerpt: "How subtle audio layering, Foley effects, risers, and impact cues transform average edits into immersive visual experiences.",
    category: "Post Production",
    date: "2026",
    readTime: "4 min read",
    image: "/assets/images/works3.jpg",
    author: "SM SAAD"
  },
  {
    id: "4",
    title: "My Video Editing Workflow",
    excerpt: "A step-by-step walkthrough of organizing media, rough cuts, fine tuning, VFX integration, color grading, and final platform delivery.",
    category: "Workflow",
    date: "2026",
    readTime: "6 min read",
    image: "/assets/images/works4.jpg",
    author: "SM SAAD"
  },
  {
    id: "5",
    title: "VFX Compositing Techniques Every Editor Should Understand",
    excerpt: "Essential compositing principles including light wrap, color matching, grain management, and edge blending for seamless visual integration.",
    category: "VFX & Compositing",
    date: "2026",
    readTime: "5 min read",
    image: "/assets/images/why.jpg",
    author: "SM SAAD"
  },
  {
    id: "6",
    title: "Building Digital Projects With AI-Assisted Development",
    excerpt: "Combining web development fundamentals with AI tools to build experimental interfaces, automations, and modern web applications.",
    category: "Web & AI",
    date: "2026",
    readTime: "5 min read",
    image: "/assets/images/about.jpg",
    author: "SM SAAD"
  }
];

export const faqsData: FaqItem[] = [
  {
    id: "faq-1",
    question: "What services do you offer?",
    answer: "I offer Video Editing, VFX & Compositing, Motion Graphics, Web Development (React, Next.js, WordPress), AI & Creative Workflows, Social Media Content, and Thumbnail Design.",
    category: "Services"
  },
  {
    id: "faq-2",
    question: "What software and technologies do you use?",
    answer: "For post-production: Adobe Premiere Pro, After Effects, Photoshop, DaVinci Resolve, Blender. For web development: HTML, CSS, JavaScript, React, Next.js, WordPress, PHP. For AI & automation: Ollama, n8n, GitHub, and AI creative tools.",
    category: "Stack"
  },
  {
    id: "faq-3",
    question: "What is Synapto?",
    answer: "Synapto is an experimental knowledge-management application I am developing to explore how notes, ideas, and connected information can be organized through a clean, modern digital experience.",
    category: "Projects"
  },
  {
    id: "faq-4",
    question: "How do you combine video editing and web development?",
    answer: "I treat post-production and web development as two sides of the same creative coin—visual storytelling through video and interactive storytelling through digital interfaces.",
    category: "Workflow"
  },
  {
    id: "faq-5",
    question: "How can I start a project with you?",
    answer: "Simply navigate to the Contact page, fill out the project inquiry form with your requirements (video, VFX, web, or AI project), or send an inquiry directly to smsaad.online.",
    category: "Getting Started"
  }
];

export const pricingData: PricingPlan[] = [
  {
    id: "creative-post",
    name: "Video & Post-Production",
    price: "Custom",
    period: "Per Project",
    description: "Video editing, VFX compositing, motion graphics, sound design, and color finishing.",
    features: [
      "YouTube & Social Video Editing",
      "VFX Compositing & Green Screen",
      "Motion Graphics & Title Animations",
      "Color Grading & Audio Finishing"
    ],
    ctaText: "Start Video Project"
  },
  {
    id: "web-development-plan",
    name: "Web Development",
    price: "Custom",
    period: "Per Project",
    description: "Custom responsive websites, portfolio sites, creator hubs, and WordPress development.",
    features: [
      "Custom Responsive Web Design",
      "React / Next.js or WordPress",
      "Performance & SEO Optimization",
      "Clean Component Architecture"
    ],
    popular: true,
    ctaText: "Start Web Project"
  },
  {
    id: "creative-tech-plan",
    name: "AI & Creative Tech Scope",
    price: "Custom",
    period: "Project / Retainer",
    description: "AI-assisted workflows, creator automations, and custom digital product experiments.",
    features: [
      "AI-Assisted Content Workflows",
      "n8n & Local AI Integrations",
      "Experimental Product Concepts",
      "Ongoing Creative Technology Scope"
    ],
    ctaText: "Inquire Tech Scope"
  }
];
