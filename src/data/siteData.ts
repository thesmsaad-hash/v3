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
  youtubeId?: string;
  videoUrl?: string;
  type?: 'video' | 'web' | 'experimental';
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
  degree?: string;
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
  email: "hello@smsaad.online",
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
    degree: "Master's in Generative AI",
    institution: "Arena Animation",
    focus: "Gen AI (Media & Entertainment), Animation, VFX & Creative Production",
    details: "Master's program in Generative AI for Media & Entertainment at Arena Animation. Comprehensive professional training in AI-assisted video editing, visual effects compositing, 2D/3D motion graphics, and next-generation creative media workflows."
  }
];

export const projectsData: ProjectItem[] = [
  /* Synapto hidden for now
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
    tags: ["React", "TypeScript", "Knowledge Management", "UI/UX", "Experimental"],
    type: "web"
  },
  */
  {
    id: "ai-automation-testing-video",
    title: "Can Non-Coders Become Automation Testers Using AI?",
    category: "Video Editing & AI",
    client: "Mukesh Otwani / YouTube",
    timeline: "2026",
    image: "https://img.youtube.com/vi/_s20i3UX15M/hqdefault.jpg",
    youtubeId: "_s20i3UX15M",
    url: "https://youtu.be/_s20i3UX15M?si=ezWFMkor4EpyI9zK",
    videoUrl: "https://www.youtube.com/watch?v=_s20i3UX15M",
    description: "High-retention video editing and visual breakdowns exploring how non-coders and manual testers leverage AI coding agents, automation frameworks, and modern testing platforms.",
    focus: [
      "Visual Pacing & Pacing Rhythm",
      "Motion Graphics & Callouts",
      "AI Workflow Explanations",
      "Sound Design & Audio Layering",
      "High-Retention Editing"
    ],
    tags: ["Video Editing", "AI & Automation", "Motion Graphics", "YouTube", "Premiere Pro"],
    type: "video"
  },
  {
    id: "healing-journey-story-video",
    title: "This Is What Healing Really Looks Like",
    category: "Video Editing",
    client: "Narrative / YouTube",
    timeline: "2026",
    image: "https://img.youtube.com/vi/KMTIw3JpOfY/hqdefault.jpg",
    youtubeId: "KMTIw3JpOfY",
    url: "https://youtu.be/KMTIw3JpOfY?si=bTkJHJag8z4T8K-6",
    videoUrl: "https://www.youtube.com/watch?v=KMTIw3JpOfY",
    description: "Cinematic narrative video editing featuring atmospheric visual pacing, emotional story arcs, subtle color grading, and deeply layered soundscapes.",
    focus: [
      "Cinematic Visual Storytelling",
      "Emotional Pacing & Cuts",
      "Color Grading & Atmosphere",
      "Layered Ambient Sound Design",
      "Narrative Arc Structuring"
    ],
    tags: ["Video Editing", "Storytelling", "Color Grading", "DaVinci Resolve", "Sound Design"],
    type: "video"
  },
  {
    id: "creative-vfx-motion-showcase",
    title: "Cinematic Visuals & Creative Editing Showcase",
    category: "VFX & Motion Graphics",
    client: "Creative Showcase",
    timeline: "2026",
    image: "https://img.youtube.com/vi/G9CUoHh-jcs/hqdefault.jpg",
    youtubeId: "G9CUoHh-jcs",
    url: "https://youtu.be/G9CUoHh-jcs?si=Gtmdh_bXN4ZeK1O6",
    videoUrl: "https://www.youtube.com/watch?v=G9CUoHh-jcs",
    description: "Dynamic post-production showcase featuring multi-pass visual effects, custom kinetic typography, seamless transitions, speed ramps, and high-energy motion design.",
    focus: [
      "VFX Compositing & Multi-Pass",
      "Kinetic Motion Design",
      "After Effects Workflows",
      "Speed Ramps & Transitions",
      "Audio-Visual Synchronization"
    ],
    tags: ["VFX Compositing", "Motion Graphics", "After Effects", "Transitions", "Video Editing"],
    type: "video"
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
    question: "What creative and technical services do you offer?",
    answer: "I offer end-to-end post-production and digital solutions including Long-Form & Short-Form Video Editing, VFX Compositing, Green Screen Keying, Motion Graphics, Color Grading, Sound Design, Modern Web Development (React, Next.js, WordPress), and AI-assisted creative workflows.",
    category: "Services"
  },
  {
    id: "faq-2",
    question: "What is your typical turnaround time for video editing and VFX projects?",
    answer: "Turnaround depends on project scope: Short-form content (Reels, TikToks, Shorts) is usually delivered within 24–48 hours. Standard YouTube long-form videos take 2–4 business days. High-end VFX compositing, 3D integration, and custom motion graphics packages are scheduled according to milestone timelines.",
    category: "Timeline"
  },
  {
    id: "faq-3",
    question: "How do the project review and revision rounds work?",
    answer: "Every project includes structured milestone reviews and up to 2–3 rounds of revisions. Drafts are shared via review links with timecode feedback so revisions can be implemented accurately and quickly before final master delivery.",
    category: "Workflow"
  },
  {
    id: "faq-4",
    question: "How do I share raw footage and assets with you?",
    answer: "You can securely share your raw media, audio stems, and brand assets through Google Drive, Dropbox, WeTransfer, OneDrive, or Frame.io. I handle high-bitrate 4K RAW camera files, multi-cam setups, and log profiles smoothly.",
    category: "Delivery"
  },
  {
    id: "faq-5",
    question: "What software and tech stack do you use?",
    answer: "For video & post-production: Adobe Premiere Pro, After Effects, DaVinci Resolve Studio, Photoshop, and Blender. For web & interfaces: React, Next.js, TypeScript, Tailwind CSS, WordPress, and PHP. For AI & automation: Ollama local models, n8n workflows, and modern generative AI toolkits.",
    category: "Tech Stack"
  },
  {
    id: "faq-6",
    question: "How do I start a project inquiry and get a quote?",
    answer: "Simply head over to the Contact page and submit the project inquiry form with your project details, raw footage length, deadline, and reference links—or email directly to hello@smsaad.online. You'll receive a detailed proposal and quote within 24 hours.",
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
