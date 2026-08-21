import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Bot,
  BookOpen,
  Download,
  Briefcase,
  BarChart3,
  Search,
  Send,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  FileText,
  Volume2,
  Copy,
  Check
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getLiveSiteKnowledge, ComprehensiveSiteKnowledge } from '../utils/aiKnowledgeBase';
import { processUserQuery, AgentMessage, getStoredAISettings } from '../utils/siteAIAgent';
import { ChatMarkdown } from '../components/ChatAgent/ChatMarkdown';
import { ChatCards } from '../components/ChatAgent/ChatCards';

export const AIAgentPage: React.FC = () => {
  const [kb, setKb] = useState<ComprehensiveSiteKnowledge | null>(null);
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conversation, setConversation] = useState<AgentMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'agent' | 'articles-matrix' | 'site-graph'>('agent');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const liveKb = getLiveSiteKnowledge();
    setKb(liveKb);

    // Initial greeting
    const welcomeMsg: AgentMessage = {
      id: 'agent_page_welcome',
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `## 🤖 Welcome to the SM SAAD Deep Intelligence & Article Hub

This AI agent is connected directly to the real-time knowledge graph of **smsaad.online**, analyzing **${liveKb.statistics.totalArticles} articles**, **${liveKb.statistics.totalServices} services**, **${liveKb.statistics.totalAssets} digital asset packs**, and portfolio data.

### 💡 What Would You Like to Analyze?
- **Article Deep Dive:** "Summarize the 5 video editing techniques that make short-form content engaging"
- **VFX Analysis:** "Extract the key compositing principles explained in the VFX article"
- **Asset Recommendations:** "Which free overlay packs are best for DaVinci Resolve & Premiere?"
- **Scope & Pricing:** "Compare the Video Post-Production and Web Development packages"
- **Data Breakdown:** "Show me the distribution of skills and published articles"`,
      metadata: {
        suggestedFollowUps: [
          '📰 Summarize all blog articles with key takeaways',
          '🎬 What VFX compositing techniques are explained on this site?',
          '📦 Show all free digital assets for video editors',
          '📊 Analyze overall platform data and metrics'
        ]
      }
    };
    setConversation([welcomeMsg]);
  }, []);

  const handleRunAnalysis = async (userPrompt?: string) => {
    const promptToSend = (userPrompt || query).trim();
    if (!promptToSend || isAnalyzing) return;

    const userMessage: AgentMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation((prev) => [...prev, userMessage]);
    setQuery('');
    setIsAnalyzing(true);

    try {
      const response = await processUserQuery(promptToSend, conversation, getStoredAISettings());
      setConversation((prev) => [...prev, response]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!kb) return null;

  return (
    <>
      <SEO
        title="AI Content & Site Intelligence Agent — Real-Time Knowledge Hub"
        description="Deeply analyze articles, technical blogs, video editing techniques, VFX principles, free digital assets, and portfolio data with SM SAAD's AI Site Agent."
        keywords="AI site agent, video editing analyzer, VFX article summary, digital assets search, SM SAAD AI, knowledge graph"
        canonical="https://smsaad.online/agent"
        breadcrumbs={[{ name: 'AI Site Agent', url: '/agent' }]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'SM SAAD AI Site & Content Intelligence Agent',
          operatingSystem: 'All Modern Web Browsers',
          applicationCategory: 'BusinessApplication / DeveloperApplication',
          offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
          },
        }}
      />

      <div className="max-w-container mx-auto px-4 py-8 md:py-14 border-x border-north-black">
        {/* Page Heading */}
        <div className="border-b border-north-black pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-north-black text-north-lime font-heading font-extrabold text-xs tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              AI Site Agent & Analyzer
            </span>
            <span className="text-xs font-mono text-north-gray">
              v2.0 • Real-Time RAG
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-north-black">
            Analyze Articles, Data & Entire Website
          </h1>
          <p className="text-sm md:text-base font-body text-north-gray max-w-3xl mt-3">
            Interact with our content intelligence engine to query technical articles, summarize video editing and VFX principles, find free assets, and analyze portfolio architecture.
          </p>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-north-black bg-white">
          <div className="p-5 border-r border-b md:border-b-0 border-north-black">
            <div className="text-xs font-mono uppercase text-north-gray">Published Articles</div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-north-black mt-1">
              {kb.statistics.totalArticles}
            </div>
            <div className="text-[11px] text-north-green-dark font-semibold mt-1">
              100% Indexed & Searchable
            </div>
          </div>

          <div className="p-5 border-r md:border-r border-b md:border-b-0 border-north-black">
            <div className="text-xs font-mono uppercase text-north-gray">Free Asset Packs</div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-north-black mt-1">
              {kb.statistics.totalAssets}
            </div>
            <div className="text-[11px] text-north-gray font-semibold mt-1">
              {kb.statistics.totalAssetDownloads.toLocaleString()}+ Downloads
            </div>
          </div>

          <div className="p-5 border-r border-north-black">
            <div className="text-xs font-mono uppercase text-north-gray">Core Services</div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-north-black mt-1">
              {kb.statistics.totalServices}
            </div>
            <div className="text-[11px] text-north-gray font-semibold mt-1">
              Post-Production & Web
            </div>
          </div>

          <div className="p-5">
            <div className="text-xs font-mono uppercase text-north-gray">Skills & Tools</div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-north-black mt-1">
              {kb.statistics.totalSkills + kb.statistics.totalTools}
            </div>
            <div className="text-[11px] text-north-gray font-semibold mt-1">
              Categorized Matrix
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-north-black bg-north-dark-sand/40">
          <button
            onClick={() => setActiveTab('agent')}
            className={`px-6 py-3.5 font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-r border-north-black transition-all ${
              activeTab === 'agent'
                ? 'bg-north-black text-north-lime'
                : 'text-north-black hover:bg-white'
            }`}
          >
            <Bot className="w-4 h-4" /> Interactive AI Chat Agent
          </button>
          <button
            onClick={() => setActiveTab('articles-matrix')}
            className={`px-6 py-3.5 font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-r border-north-black transition-all ${
              activeTab === 'articles-matrix'
                ? 'bg-north-black text-north-lime'
                : 'text-north-black hover:bg-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Articles Knowledge Matrix
          </button>
          <button
            onClick={() => setActiveTab('site-graph')}
            className={`px-6 py-3.5 font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'site-graph'
                ? 'bg-north-black text-north-lime'
                : 'text-north-black hover:bg-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Data Analytics & Graph
          </button>
        </div>

        {/* ── TAB 1: INTERACTIVE AGENT ── */}
        {activeTab === 'agent' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px] border-b border-north-black">
            {/* Left Column: Quick Analysis Presets */}
            <div className="lg:border-r border-b lg:border-b-0 border-north-black p-6 bg-white space-y-6">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-north-black mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Popular Inquiries
                </h3>
                <p className="text-xs text-north-gray mb-3">
                  Click any instant analysis to run a deep dive query:
                </p>
                <div className="space-y-2">
                  {[
                    '📰 Summarize all blog articles with key takeaways',
                    '🎬 What VFX compositing techniques are explained on this site?',
                    '🔊 Why is sound design critical in video editing?',
                    '⚡ What video editing workflow does SM Saad follow?',
                    '📦 What free digital assets can I download right now?',
                    '💡 Explain the Synapto knowledge management project',
                    '💼 What is the process for hiring SM Saad for a project?'
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => handleRunAnalysis(preset)}
                      className="w-full text-left p-2.5 bg-north-bg hover:bg-north-lime border border-north-black/20 hover:border-north-black rounded text-xs text-north-black font-medium transition-all group flex items-center justify-between"
                    >
                      <span>{preset}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics Breakdown */}
              <div className="pt-4 border-t border-north-black/10">
                <h4 className="font-heading font-bold text-xs uppercase text-north-black mb-2">
                  Indexed Knowledge Categories
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(kb.statistics.articlesByCategory).map(([cat, count]) => (
                    <button
                      key={cat}
                      onClick={() => handleRunAnalysis(`Analyze all articles under "${cat}" category`)}
                      className="text-[11px] bg-north-dark-sand/70 hover:bg-north-black hover:text-white px-2 py-1 rounded font-medium transition-colors"
                    >
                      {cat} ({count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Chat History & Input */}
            <div className="lg:col-span-2 flex flex-col justify-between bg-north-bg/60">
              {/* Messages container */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[600px]">
                {conversation.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[95%] p-4 rounded border transition-all ${
                          isUser
                            ? 'bg-north-black text-white border-north-black'
                            : 'bg-white text-north-black border-north-black/20 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-north-black/10 text-[11px] font-mono opacity-80">
                          <span className="font-heading font-bold uppercase flex items-center gap-1.5">
                            {isUser ? 'You' : <Bot className="w-3.5 h-3.5" />}
                            {isUser ? 'You' : 'SM SAAD AI Agent'}
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>

                        {isUser ? (
                          <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        ) : (
                          <ChatMarkdown content={msg.text} />
                        )}

                        {!isUser && msg.metadata && (
                          <ChatCards
                            articles={msg.metadata.articles}
                            assets={msg.metadata.assets}
                            services={msg.metadata.services}
                            projects={msg.metadata.projects}
                            pricing={msg.metadata.pricing}
                            onSelectPrompt={(p) => handleRunAnalysis(p)}
                          />
                        )}

                        {!isUser && (
                          <div className="mt-3 pt-2 border-t border-north-black/10 flex items-center justify-between text-[11px] text-north-gray">
                            <span className="font-mono text-[10px]">
                              {msg.metadata?.modelUsed || 'Site Intelligence Engine'}
                            </span>
                            <button
                              onClick={() => handleCopy(msg.text, msg.id)}
                              className="hover:text-north-black transition-colors flex items-center gap-1"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-green-600" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" /> Copy Analysis
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Follow-up chips */}
                      {!isUser && msg.metadata?.suggestedFollowUps && (
                        <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                          {msg.metadata.suggestedFollowUps.map((chip, ci) => (
                            <button
                              key={ci}
                              onClick={() => handleRunAnalysis(chip)}
                              className="bg-white border border-north-black/20 text-north-black text-[11px] font-medium px-3 py-1 rounded hover:bg-north-lime hover:border-north-black transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <span>{chip}</span>
                              <ArrowUpRight className="w-3 h-3 opacity-60" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isAnalyzing && (
                  <div className="flex items-center gap-2 bg-white border border-north-black/20 px-4 py-3 rounded-lg w-fit shadow-xs animate-pulse">
                    <Sparkles className="w-4 h-4 text-north-black animate-spin" />
                    <span className="font-heading font-bold text-xs text-north-black">
                      Analyzing website index, articles, and data models...
                    </span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-north-black flex items-center gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleRunAnalysis();
                    }
                  }}
                  placeholder="Ask any question to analyze articles, VFX techniques, services, or site data..."
                  className="flex-1 bg-north-bg border border-north-black/30 px-4 py-2.5 rounded text-xs font-body text-north-black focus:outline-none focus:border-north-black focus:ring-1 focus:ring-north-black"
                  disabled={isAnalyzing}
                />
                <button
                  type="button"
                  onClick={() => handleRunAnalysis()}
                  disabled={!query.trim() || isAnalyzing}
                  className={`px-6 py-2.5 font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-north-black ${
                    query.trim() && !isAnalyzing
                      ? 'bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black cursor-pointer'
                      : 'bg-north-dark-sand text-north-gray cursor-not-allowed'
                  }`}
                >
                  <span>Analyze</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ARTICLES KNOWLEDGE MATRIX ── */}
        {activeTab === 'articles-matrix' && (
          <div className="p-6 md:p-8 bg-white space-y-6">
            <div className="flex items-center justify-between border-b border-north-black/10 pb-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg uppercase text-north-black">
                  Complete Articles & Blog Index ({kb.articles.length})
                </h3>
                <p className="text-xs text-north-gray">
                  Every published post indexed with extracted key themes, category, and read times.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kb.articles.map((post) => (
                <div
                  key={post.id}
                  className="border border-north-black p-5 rounded-none hover:shadow-md transition-all flex flex-col justify-between group bg-north-bg/30"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="bg-north-dark-sand px-2 py-0.5 font-semibold text-north-black">
                        {post.category}
                      </span>
                      <span className="text-north-gray">{post.readTime}</span>
                    </div>
                    <h4 className="font-heading font-extrabold text-base text-north-black group-hover:text-north-green-dark transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-xs text-north-gray font-body mt-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-north-black/10 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveTab('agent');
                        handleRunAnalysis(`Give me a complete deep dive summary and takeaways of the article "${post.title}"`);
                      }}
                      className="text-xs font-heading font-bold text-north-black hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-north-green-dark" /> AI Summary
                    </button>
                    <a
                      href={`/blogs/${post.id}`}
                      className="inline-flex items-center gap-1 text-xs font-heading font-bold text-white bg-north-black px-3 py-1 hover:bg-north-lime hover:text-north-black transition-colors"
                    >
                      Full Article <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: DATA ANALYTICS & GRAPH ── */}
        {activeTab === 'site-graph' && (
          <div className="p-6 md:p-8 bg-white space-y-8">
            <div>
              <h3 className="font-heading font-extrabold text-lg uppercase text-north-black">
                Comprehensive Site Knowledge Analytics
              </h3>
              <p className="text-xs text-north-gray">
                Real-time breakdown of skills, tools, content distribution, and digital asset metrics.
              </p>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Skills */}
              <div className="border border-north-black p-5">
                <h4 className="font-heading font-bold text-xs uppercase text-north-black mb-3 pb-2 border-b border-north-black/10 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Skills Matrix ({kb.skills.length})
                </h4>
                <div className="space-y-3">
                  {Object.entries(kb.statistics.skillsByCategory).map(([cat, skills]) => (
                    <div key={cat}>
                      <div className="text-[11px] font-mono font-bold text-north-gray uppercase">
                        {cat}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {skills.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] bg-north-dark-sand/60 px-1.5 py-0.5 rounded font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="border border-north-black p-5">
                <h4 className="font-heading font-bold text-xs uppercase text-north-black mb-3 pb-2 border-b border-north-black/10 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Tools & Software ({kb.tools.length})
                </h4>
                <div className="space-y-3">
                  {Object.entries(kb.statistics.toolsByCategory).map(([cat, tools]) => (
                    <div key={cat}>
                      <div className="text-[11px] font-mono font-bold text-north-gray uppercase">
                        {cat}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tools.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-north-lime/40 px-1.5 py-0.5 rounded font-medium text-north-black"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asset Downloads & Storage */}
              <div className="border border-north-black p-5">
                <h4 className="font-heading font-bold text-xs uppercase text-north-black mb-3 pb-2 border-b border-north-black/10 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Asset Store Stats
                </h4>
                <div className="space-y-3">
                  <div className="bg-north-bg p-3 border border-north-black/20">
                    <div className="text-xs text-north-gray font-mono">Total Asset Downloads</div>
                    <div className="text-2xl font-heading font-extrabold text-north-black mt-1">
                      {kb.statistics.totalAssetDownloads.toLocaleString()}+
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5">
                    {kb.assets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between text-[11px] py-1 border-b border-north-black/5">
                        <span className="font-medium truncate max-w-[180px]">{asset.title}</span>
                        <span className="font-mono font-bold">{asset.downloadCount} dl</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
