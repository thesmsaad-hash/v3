import { getLiveSiteKnowledge, ComprehensiveSiteKnowledge } from './aiKnowledgeBase';
import { ExtendedBlogPost } from './blogStorage';
import { DigitalAsset } from './assetStorage';
import { ServiceItem, ProjectItem, PricingPlan, FaqItem } from '../data/siteData';

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  isAnalyzing?: boolean;
  metadata?: {
    intent?: string;
    articles?: ExtendedBlogPost[];
    services?: ServiceItem[];
    assets?: DigitalAsset[];
    projects?: ProjectItem[];
    pricing?: PricingPlan[];
    faqs?: FaqItem[];
    sources?: Array<{ title: string; path: string; type: string }>;
    suggestedFollowUps?: string[];
    confidence?: number;
    tokensUsed?: number;
    modelUsed?: string;
  };
}

export interface AISettings {
  provider: 'built-in' | 'gemini' | 'openai' | 'ollama';
  apiKey?: string;
  customEndpoint?: string;
  temperature?: number;
  speechEnabled?: boolean;
  voiceGender?: 'female' | 'male' | 'any';
}

const SETTINGS_KEY = 'smsaad_ai_agent_settings';

export const getStoredAISettings = (): AISettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading AI settings', e);
  }
  return {
    provider: 'built-in',
    speechEnabled: false,
    voiceGender: 'female',
    temperature: 0.7,
  };
};

export const saveStoredAISettings = (settings: AISettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

/**
 * Intelligent Natural Language Processing & RAG Engine
 */
export const processUserQuery = async (
  query: string,
  history: AgentMessage[] = [],
  customSettings?: AISettings
): Promise<AgentMessage> => {
  const settings = customSettings || getStoredAISettings();
  const knowledge = getLiveSiteKnowledge();
  const lowerQuery = query.toLowerCase().trim();

  // If user has set up an external API (Gemini or OpenAI), try live LLM first
  if (settings.provider === 'gemini' && settings.apiKey) {
    try {
      const geminiResponse = await queryGeminiAPI(query, knowledge, settings.apiKey);
      if (geminiResponse) return geminiResponse;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to built-in intelligence engine:', err);
    }
  } else if (settings.provider === 'openai' && settings.apiKey) {
    try {
      const openaiResponse = await queryOpenAIAPI(query, knowledge, settings.apiKey, settings.customEndpoint);
      if (openaiResponse) return openaiResponse;
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to built-in intelligence engine:', err);
    }
  }

  // Built-in Analytical Intelligence Engine
  return generateIntelligentAnalysis(lowerQuery, query, knowledge, history);
};

/**
 * Built-in Analytical & Knowledge Engine
 */
function generateIntelligentAnalysis(
  lower: string,
  rawQuery: string,
  kb: ComprehensiveSiteKnowledge,
  _history: AgentMessage[]
): AgentMessage {
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. GREETING / INTRO
  if (
    /^(hi|hello|hey|greetings|hola|namaste|who are you|what can you do|help)/i.test(lower) &&
    lower.length < 35
  ) {
    return {
      id: msgId,
      sender: 'agent',
      timestamp,
      text: `Hello! 👋 I am **SM SAAD's AI Site & Content Intelligence Agent**.

I have real-time analytical access to the entire website, including:
- 📰 **${kb.statistics.totalArticles} Articles & Technical Blogs** (VFX, Video Editing, AI Workflows, Sound Design)
- 🛠️ **${kb.statistics.totalServices} Professional Services & Offerings**
- 🎨 **${kb.statistics.totalAssets} Free Production Digital Assets** (${kb.statistics.totalAssetDownloads.toLocaleString()}+ community downloads)
- 💡 **Case Studies & Projects** (including **Synapto**)
- 📊 **Skills, Tools, Pricing Plans & Experience**

How can I assist you today? You can ask me to **summarize any article**, **analyze video editing techniques**, **explore pricing**, or **find creative assets**.`,
      metadata: {
        intent: 'greeting',
        sources: [
          { title: 'Home Overview', path: '/', type: 'page' },
          { title: 'Articles Hub', path: '/blogs', type: 'blog' },
          { title: 'Digital Assets', path: '/assets', type: 'asset' }
        ],
        suggestedFollowUps: [
          '📰 Summarize the latest AI & Video Editing articles',
          '🎬 What VFX compositing techniques are covered?',
          '📦 What free digital assets can I download?',
          '💼 What services does SM Saad offer?',
          '💡 Tell me about the Synapto project'
        ],
        modelUsed: 'Site Intelligence Engine (Real-Time RAG)'
      }
    };
  }

  // 2. ARTICLE / BLOG ANALYSIS & SUMMARIZATION
  const isArticleQuery =
    /blog|article|post|writeup|read|technique|summariz|summary|vfx compositing|sound design|pacing|short-form|short form|workflow/i.test(lower);

  const matchedArticles = kb.articles.filter((a) => {
    const titleMatch = lower.split(' ').some((word) => word.length > 3 && a.title.toLowerCase().includes(word));
    const catMatch = a.category.toLowerCase().includes(lower) || lower.includes(a.category.toLowerCase());
    const excerptMatch = lower.split(' ').some((word) => word.length > 4 && a.excerpt.toLowerCase().includes(word));
    return titleMatch || catMatch || excerptMatch;
  });

  if (isArticleQuery || matchedArticles.length > 0) {
    // Specific Article Search or Request for Summary
    if (lower.includes('summar') || lower.includes('overview') || lower.includes('key takeaway') || lower.includes('explain')) {
      const targetArticle = matchedArticles[0] || kb.articles[0];
      const takeaways = [
        `**Core Focus:** ${targetArticle.category} — ${targetArticle.excerpt}`,
        `**Key Technique:** Structured pacing, media organization, and seamless integration between storytelling and technology.`,
        `**Estimated Read Time:** ${targetArticle.readTime} (Authored by ${targetArticle.author})`,
        `**Actionable Takeaway:** Apply purposeful cuts, layered sound cues, and AI-assisted ideation to enhance audience retention.`
      ];

      return {
        id: msgId,
        sender: 'agent',
        timestamp,
        text: `### 📑 Article Analysis & Summary: "${targetArticle.title}"

**Category:** \`${targetArticle.category}\` • **Read Time:** \`${targetArticle.readTime}\` • **Date:** \`${targetArticle.date}\`

#### 🎯 Executive Summary:
${targetArticle.excerpt}

#### 🔑 Key Analytical Insights:
${takeaways.map(t => `- ${t}`).join('\n')}

${targetArticle.content && targetArticle.content.length > 100 ? `#### 📖 Deep Dive Excerpt:\n> "${targetArticle.content.slice(0, 280)}..."` : ''}

You can read the full in-depth article or explore related guides below:`,
        metadata: {
          intent: 'article_summary',
          articles: [targetArticle, ...matchedArticles.slice(1, 3)],
          sources: [
            { title: targetArticle.title, path: `/blogs/${targetArticle.id}`, type: 'blog' },
            { title: 'All Blog Posts', path: '/blogs', type: 'page' }
          ],
          suggestedFollowUps: [
            `📖 Open article: "${targetArticle.title}"`,
            '📰 Compare with other VFX & Editing articles',
            '🎨 Show downloadable assets related to this topic'
          ],
          modelUsed: 'Site Intelligence Engine (Article Analyzer)'
        }
      };
    }

    // General Article List & Breakdown
    const articleList = (matchedArticles.length > 0 ? matchedArticles : kb.articles).slice(0, 4);
    const categoryStats = Object.entries(kb.statistics.articlesByCategory)
      .map(([cat, count]) => `**${cat}:** ${count}`)
      .join(' • ');

    return {
      id: msgId,
      sender: 'agent',
      timestamp,
      text: `### 📚 Knowledge Base Analysis: Articles & Blogs

The website contains **${kb.statistics.totalArticles} published articles** across high-impact creative & technical disciplines:
${categoryStats}

#### 🔍 Top Matching Articles for Your Query:
${articleList.map((a, i) => `**${i + 1}. [${a.title}](/blogs/${a.id})**
- **Topic:** \`${a.category}\` | **Length:** ${a.readTime}
- *${a.excerpt}*`).join('\n\n')}

*Click any card below to jump directly into the full article with complete workflow breakdowns.*`,
      metadata: {
        intent: 'articles_list',
        articles: articleList,
        sources: articleList.map(a => ({ title: a.title, path: `/blogs/${a.id}`, type: 'blog' })),
        suggestedFollowUps: [
          `Summarize "${articleList[0]?.title || 'Latest Post'}"`,
          '🎬 How does SM Saad approach VFX Compositing?',
          '🔊 Tell me why Sound Design matters in video editing'
        ],
        modelUsed: 'Site Intelligence Engine (RAG Indexer)'
      }
    };
  }

  // 3. DIGITAL ASSETS & DOWNLOADS QUERY
  if (/asset|download|pack|preset|overlay|lut|grain|mogrt|free|store/i.test(lower)) {
    const matchedAssets = kb.assets.filter((a) => {
      const matchWord = lower.split(' ').some((w) => w.length > 3 && (a.title.toLowerCase().includes(w) || a.category.toLowerCase().includes(w) || a.compatibility.toLowerCase().includes(w)));
      return matchWord;
    });

    const itemsToShow = (matchedAssets.length > 0 ? matchedAssets : kb.assets).slice(0, 3);
    return {
      id: msgId,
      sender: 'agent',
      timestamp,
      text: `### 🎨 Digital Asset Store & Creative Downloads

SM SAAD provides a curated library of **${kb.statistics.totalAssets} free creative assets** for video editors, VFX artists, and web developers with over **${kb.statistics.totalAssetDownloads.toLocaleString()}+ total downloads**.

#### 📦 Featured Download Packs:
${itemsToShow.map((item, i) => `**${i + 1}. [${item.title}](/assets)**
- **Category:** \`${item.category}\` | **Format:** \`${item.fileFormat}\` | **Size:** \`${item.fileSize}\`
- **Compatibility:** ${item.compatibility}
- **Downloads:** ${item.downloadCount.toLocaleString()} downloads • *${item.license}*
- *${item.description}*`).join('\n\n')}

*All assets are 100% free for personal and commercial projects.*`,
      metadata: {
        intent: 'assets_store',
        assets: itemsToShow,
        sources: [{ title: 'Free Digital Assets Store', path: '/assets', type: 'asset' }],
        suggestedFollowUps: [
          '🎬 Show VFX & Overlay assets only',
          '⚡ Show Premiere Pro & After Effects presets',
          '💻 Show Web templates & source code'
        ],
        modelUsed: 'Site Intelligence Engine (Asset Analyzer)'
      }
    };
  }

  // 4. SERVICES & PRICING
  if (/service|hire|cost|price|pricing|rate|package|offer|quote|contract|freelance/i.test(lower)) {
    return {
      id: msgId,
      sender: 'agent',
      timestamp,
      text: `### 💼 Professional Services & Engagement Scope

SM SAAD delivers tailored creative & technical services spanning post-production, interactive web applications, and AI integrations:

#### 🛠️ Available Core Services:
${kb.services.map((s) => `**${s.number}. [${s.title}](/services/${s.id})**
- ${s.description}
- **Includes:** ${(s.details || []).slice(0, 3).join(' • ')}`).join('\n\n')}

#### 💳 Pricing Packages:
${kb.pricing.map((p) => `* **${p.name}** (\`${p.price} / ${p.period}\`): ${p.description}\n  Key Features: ${p.features.slice(0, 3).join(', ')}`).join('\n')}

Would you like to initiate a project or explore a custom quote?`,
      metadata: {
        intent: 'services_pricing',
        services: kb.services.slice(0, 4),
        pricing: kb.pricing,
        sources: [
          { title: 'Services Catalog', path: '/services', type: 'page' },
          { title: 'Pricing Table', path: '/pricing', type: 'page' },
          { title: 'Contact & Inquiry Form', path: '/contact', type: 'page' }
        ],
        suggestedFollowUps: [
          '🎥 What is included in the Video & Post-Production scope?',
          '🌐 What web development tech stack is used?',
          '📩 How do I start a project inquiry?'
        ],
        modelUsed: 'Site Intelligence Engine (Services Advisor)'
      }
    };
  }

  // 5. PROJECTS / SYNAPTO
  if (/project|work|portfolio|synapto|case study|app/i.test(lower)) {
    const synapto = kb.projects[0];
    return {
      id: msgId,
      sender: 'agent',
      timestamp,
      text: `### 💡 Featured Project: **${synapto.title}** (${synapto.category})

**Status:** \`${synapto.timeline}\` • **Client/Scope:** \`${synapto.client}\`

#### 📌 Project Overview:
${synapto.description}

#### 🎯 Key Focus Areas:
${(synapto.focus || []).map((f) => `- **${f}**`).join('\n')}

#### 🛠️ Technology Stack:
${(synapto.tags || []).map((t) => `\`${t}\``).join(' • ')}

You can explore more details on the [Works & Projects](/works) page or inspect the technical blogs documenting the development methodology.`,
      metadata: {
        intent: 'projects_info',
        projects: kb.projects,
        sources: [{ title: 'Works & Case Studies', path: '/works', type: 'page' }],
        suggestedFollowUps: [
          '🧠 How does Synapto organize connected notes?',
          '💻 What other web technologies does SM Saad use?',
          '📰 Read blog on AI-assisted web development'
        ],
        modelUsed: 'Site Intelligence Engine'
      }
    };
  }

  // 6. SKILLS, TOOLS & TECH STACK
  if (/skill|tool|software|stack|tech|premiere|after effects|resolve|blender|react|next|ollama|n8n|experience|education|arena/i.test(lower)) {
    return {
      id: msgId,
      sender: 'agent',
      timestamp,
      text: `### ⚡ Technical Capabilities, Tools & Education

#### 🎓 Professional Background:
- **Education:** ${kb.education[0]?.institution || 'Arena Animation'} — *${kb.education[0]?.focus}*
- **Specialization:** Post-production, VFX Compositing, Motion Design & Full-Stack Web Development.

#### 🛠️ Primary Toolset:
${Object.entries(kb.statistics.toolsByCategory).map(([cat, tools]) => `* **${cat}:** ${tools.join(', ')}`).join('\n')}

#### 🌟 Skill Matrix:
${Object.entries(kb.statistics.skillsByCategory).map(([cat, skills]) => `* **${cat}:** ${skills.join(' • ')}`).join('\n')}

#### 🔬 Currently Exploring:
${kb.exploring.slice(0, 5).map((exp) => `- ${exp}`).join('\n')}`,
      metadata: {
        intent: 'skills_and_tools',
        sources: [
          { title: 'Resume & Skills', path: '/resume', type: 'page' },
          { title: 'About SM SAAD', path: '/about', type: 'page' }
        ],
        suggestedFollowUps: [
          '🎥 What video editing workflows are utilized?',
          '🤖 What local AI & Ollama setups are explored?',
          '💼 View available services'
        ],
        modelUsed: 'Site Intelligence Engine'
      }
    };
  }

  // 7. COMPREHENSIVE SITE DATA & STATS ANALYZER
  if (/data|stat|analytic|metric|total|count|overview|database|supabase|system/i.test(lower)) {
    return {
      id: msgId,
      sender: 'agent',
      timestamp,
      text: `### 📊 Real-Time Website Data & Architecture Analytics

Here is a live statistical breakdown of the entire platform:

| Metric | Live Count / Value |
| :--- | :--- |
| **Total Articles & Blogs** | **${kb.statistics.totalArticles}** published |
| **Active Services** | **${kb.statistics.totalServices}** specialized offerings |
| **Free Digital Assets** | **${kb.statistics.totalAssets}** downloadable packs |
| **Total Community Downloads** | **${kb.statistics.totalAssetDownloads.toLocaleString()}+** downloads |
| **Skills Cataloged** | **${kb.statistics.totalSkills}** technical skills |
| **Creative & Web Tools** | **${kb.statistics.totalTools}** professional tools |
| **Pricing Models** | **${kb.statistics.totalPricingPlans}** flexible tiers |
| **Database Sync** | Dual-Layer (Local Cache + Supabase Cloud) |

#### 📂 Article Categories Breakdown:
${Object.entries(kb.statistics.articlesByCategory).map(([k, v]) => `- **${k}:** ${v} articles`).join('\n')}

#### 📦 Asset Distribution:
${Object.entries(kb.statistics.assetsByCategory).map(([k, v]) => `- **${k}:** ${v} packs`).join('\n')}`,
      metadata: {
        intent: 'data_analytics',
        sources: [
          { title: 'Blog System', path: '/blogs', type: 'page' },
          { title: 'Asset Store', path: '/assets', type: 'page' },
          { title: 'Admin Hub', path: '/admin', type: 'page' }
        ],
        suggestedFollowUps: [
          '📰 Summarize the newest article',
          '📦 View all available free assets',
          '🛠️ View all service details'
        ],
        modelUsed: 'Site Intelligence Engine (Data Analyzer)'
      }
    };
  }

  // 8. CONTACT / SOCIALS / BIO
  if (/contact|email|github|linkedin|hire|location|reach|social|instagram|youtube/i.test(lower)) {
    return {
      id: msgId,
      sender: 'agent',
      timestamp,
      text: `### 📬 Contact & Connect with SM SAAD

Feel free to get in touch for creative projects, collaborations, or tech inquiries:

- ✉️ **Email:** [${kb.siteConfig.email}](mailto:${kb.siteConfig.email})
- 🌐 **Website:** [${kb.siteConfig.website}](https://${kb.siteConfig.website})
- 🐙 **GitHub:** [${kb.siteConfig.socials.github}](${kb.siteConfig.socials.github})
- 💼 **LinkedIn:** [${kb.siteConfig.socials.linkedin}](${kb.siteConfig.socials.linkedin})
- 📝 **Inquiry Form:** Directly submit your project details on the [Contact Page](/contact).`,
      metadata: {
        intent: 'contact_info',
        sources: [{ title: 'Contact Page', path: '/contact', type: 'page' }],
        suggestedFollowUps: [
          '💼 View available services & pricing',
          '📰 Check out latest blog posts'
        ],
        modelUsed: 'Site Intelligence Engine'
      }
    };
  }

  // 9. GENERAL / DEEP SEARCH FALLBACK
  const matchingIndex = kb.searchIndex.filter((item) => {
    const qWords = lower.split(' ').filter((w) => w.length > 2);
    return qWords.some(
      (w) =>
        item.title.toLowerCase().includes(w) ||
        item.description.toLowerCase().includes(w) ||
        (item.tags && item.tags.some((t) => t.includes(w)))
    );
  });

  if (matchingIndex.length > 0) {
    const topMatches = matchingIndex.slice(0, 3);
    return {
      id: msgId,
      sender: 'agent',
      timestamp,
      text: `### 🔍 Analysis for "${rawQuery}"

Found **${matchingIndex.length} relevant entries** matching your query across the site:

${topMatches.map((m, i) => `**${i + 1}. [${m.title}](${m.path || '/'})** *(${m.category || m.type})*
> ${m.description}`).join('\n\n')}

What specific aspect would you like me to analyze in detail?`,
      metadata: {
        intent: 'search_results',
        sources: topMatches.map(m => ({ title: m.title, path: m.path || '/', type: m.type })),
        suggestedFollowUps: [
          '📰 Summarize top matching article',
          '💼 Check associated services and pricing',
          '📊 Analyze overall site data'
        ],
        modelUsed: 'Site Intelligence Engine'
      }
    };
  }

  // Default Fallback
  return {
    id: msgId,
    sender: 'agent',
    timestamp,
    text: `### 💡 Analysis for: "${rawQuery}"

I analyzed the site data, **${kb.statistics.totalArticles} articles**, **${kb.statistics.totalServices} services**, and digital asset library. 

Here is what you can explore:
- **Articles & Blogs:** In-depth tutorials and insights on video editing pacing, VFX compositing, sound design, and AI workflows.
- **Services:** High-end post-production, motion graphics, web development (React/Next.js/WordPress), and AI integrations.
- **Free Assets:** 4K film grains, kinetic title kits, and web starter kits.
- **Bio & Skills:** Background in creative direction and Arena Animation education.

Try asking:
- *"Summarize the AI creative workflows article"*
- *"What VFX compositing techniques are explained on the site?"*
- *"What free assets can I download?"*
- *"Give me a breakdown of all site metrics and data"*`,
    metadata: {
      intent: 'fallback_guidance',
      sources: [
        { title: 'Articles', path: '/blogs', type: 'page' },
        { title: 'Free Assets', path: '/assets', type: 'page' },
        { title: 'Services', path: '/services', type: 'page' }
      ],
      suggestedFollowUps: [
        '📰 Summarize recent blog articles',
        '📦 What free digital assets are available?',
        '📊 Give me a complete data breakdown'
      ],
      modelUsed: 'Site Intelligence Engine'
    }
  };
}

/**
 * Optional Gemini API caller if user provides their key
 */
async function queryGeminiAPI(
  query: string,
  kb: ComprehensiveSiteKnowledge,
  apiKey: string
): Promise<AgentMessage | null> {
  const systemPrompt = `You are SM SAAD's AI Site & Content Intelligence Agent.
You have real-time access to SM SAAD's website data:
- Name: ${kb.siteConfig.name}, Role: ${kb.siteConfig.role}
- Email: ${kb.siteConfig.email}, Bio: ${kb.siteConfig.introText}
- Articles (${kb.articles.length}): ${kb.articles.map(a => `[${a.title} (${a.category}, ${a.readTime}): ${a.excerpt}]`).join('; ')}
- Services: ${kb.services.map(s => `[${s.title}: ${s.description}]`).join('; ')}
- Free Assets: ${kb.assets.map(a => `[${a.title} (${a.category}): ${a.description}]`).join('; ')}
- Projects: ${kb.projects.map(p => `[${p.title}: ${p.description}]`).join('; ')}
- Pricing: ${kb.pricing.map(p => `[${p.name}: ${p.price}]`).join('; ')}

Format responses in clean GitHub markdown with clear headings, bullet points, and actionable links. Provide deep, analytical, and helpful answers.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nUser Question: ${query}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  return {
    id: `msg_${Date.now()}`,
    sender: 'agent',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text,
    metadata: {
      modelUsed: 'Google Gemini 1.5 Flash (Grounded on Site Data)',
      sources: [
        { title: 'Articles & Blogs', path: '/blogs', type: 'page' },
        { title: 'Services Catalog', path: '/services', type: 'page' }
      ],
      suggestedFollowUps: [
        '📰 Summarize top articles',
        '💼 Show available services',
        '📦 Show free downloads'
      ]
    }
  };
}

/**
 * Optional OpenAI / Custom Endpoint API caller
 */
async function queryOpenAIAPI(
  query: string,
  kb: ComprehensiveSiteKnowledge,
  apiKey: string,
  endpoint?: string
): Promise<AgentMessage | null> {
  const url = endpoint || 'https://api.openai.com/v1/chat/completions';
  const systemPrompt = `You are SM SAAD's AI Site & Content Intelligence Agent with full context on articles, blogs, digital assets, services, and site data for SM SAAD (${kb.siteConfig.role}). Provide rich, structured markdown answers.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) return null;

  return {
    id: `msg_${Date.now()}`,
    sender: 'agent',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text,
    metadata: {
      modelUsed: 'OpenAI GPT-4o-mini',
      sources: [{ title: 'Knowledge Base', path: '/blogs', type: 'page' }]
    }
  };
}
