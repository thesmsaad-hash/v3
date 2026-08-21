import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Briefcase,
  Download,
  BarChart3,
  Search,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Mic,
  MicOff,
  HelpCircle,
  Share2,
  CheckCircle
} from 'lucide-react';
import {
  AgentMessage,
  processUserQuery,
  AISettings,
  getStoredAISettings,
  saveStoredAISettings
} from '../../utils/siteAIAgent';
import { getLiveSiteKnowledge } from '../../utils/aiKnowledgeBase';
import { ChatCards } from './ChatCards';
import { ChatMarkdown } from './ChatMarkdown';

export const ChatAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [selectedMode, setSelectedMode] = useState<'all' | 'articles' | 'services' | 'data'>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AISettings>(getStoredAISettings());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize initial welcome message
  useEffect(() => {
    const saved = localStorage.getItem('smsaad_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }

    const kb = getLiveSiteKnowledge();
    const initialGreeting: AgentMessage = {
      id: 'msg_welcome',
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `👋 **Welcome! I'm SM SAAD's AI Content & Site Intelligence Agent.**

I can deeply analyze:
- 📰 **${kb.statistics.totalArticles} Articles & Technical Blogs** (VFX Compositing, Editing Pacing, AI Workflows, Sound Design)
- 🛠️ **${kb.statistics.totalServices} Professional Services** & Scope breakdowns
- 🎨 **${kb.statistics.totalAssets} Free Creative Asset Packs** (${kb.statistics.totalAssetDownloads.toLocaleString()}+ downloads)
- 💡 **Case Studies** (including the **Synapto** knowledge app)
- 📊 **Live Site Metrics, Skills & Technology Stack**

Select a quick topic below or type any question:`,
      metadata: {
        intent: 'welcome',
        suggestedFollowUps: [
          '📰 Summarize top articles & takeaways',
          '🎬 What VFX compositing techniques are covered?',
          '📦 What free digital assets can I download?',
          '💼 What services are offered and at what rates?',
          '📊 Analyze total site statistics'
        ],
        modelUsed: 'Site Intelligence Engine (Real-Time Index)'
      }
    };

    setMessages([initialGreeting]);
  }, []);

  // Save history on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('smsaad_chat_history', JSON.stringify(messages.slice(-30)));
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isTyping) return;

    const userMsg: AgentMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate natural thinking delay for better UX
      const startTime = Date.now();
      const response = await processUserQuery(textToSend, messages, settings);
      const elapsed = Date.now() - startTime;
      if (elapsed < 400) {
        await new Promise((r) => setTimeout(r, 400 - elapsed));
      }

      setMessages((prev) => [...prev, response]);

      // If speech synthesis enabled
      if (settings.speechEnabled && 'speechSynthesis' in window) {
        speakText(response.text.replace(/[*#`_\[\]()]/g, ''));
      }
    } catch (err) {
      const errorMsg: AgentMessage = {
        id: `err_${Date.now()}`,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `⚠️ I encountered an issue analyzing your query. Please try rephrasing or check your settings.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleModeChange = (mode: 'all' | 'articles' | 'services' | 'data') => {
    setSelectedMode(mode);
    if (mode === 'articles') {
      handleSendMessage('Give me a full analytical summary of the blog posts and articles on this website.');
    } else if (mode === 'services') {
      handleSendMessage('What professional services and pricing plans are available?');
    } else if (mode === 'data') {
      handleSendMessage('Give me a real-time data breakdown and metrics for this entire website.');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string, id?: string) => {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    const cleanText = text.replace(/[*#`_\[\]()>|]/g, '').slice(0, 400);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    if (id) setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    localStorage.removeItem('smsaad_chat_history');
    const kb = getLiveSiteKnowledge();
    const initialGreeting: AgentMessage = {
      id: 'msg_welcome_reset',
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Chat cleared! How can I help you analyze SM SAAD's articles, video projects, digital assets, or services?`,
      metadata: {
        suggestedFollowUps: [
          '📰 Summarize top articles',
          '🎬 What VFX compositing techniques are covered?',
          '📦 What free digital assets can I download?'
        ]
      }
    };
    setMessages([initialGreeting]);
  };

  const exportChat = () => {
    const transcript = messages
      .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`)
      .join('\n---\n\n');
    const blob = new Blob([transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sm-saad-ai-chat-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Voice Input (Web Speech API)
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. FLOATING AGENT TRIGGER BUTTON
         ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-2.5 bg-north-black text-white px-4 py-3 border border-north-black rounded-none shadow-2xl hover:bg-north-lime hover:text-north-black transition-all duration-300 cursor-pointer"
              aria-label="Open AI Content & Site Agent"
            >
              {/* Glowing Pulse Ring */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-north-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-north-lime border-2 border-north-black"></span>
              </span>

              <div className="w-8 h-8 bg-north-lime text-north-black rounded flex items-center justify-center font-extrabold group-hover:bg-north-black group-hover:text-north-lime transition-colors">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>

              <div className="text-left">
                <div className="font-heading font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5">
                  AI AGENT
                  <span className="text-[9px] bg-north-lime/20 text-north-lime group-hover:bg-north-black/20 group-hover:text-north-black px-1 py-0.2 rounded font-mono font-normal">
                    ONLINE
                  </span>
                </div>
                <div className="text-[10px] text-gray-300 group-hover:text-north-black font-body">
                  Analyze Articles & Data
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING / EXPANDED CHAT MODAL
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 bg-north-bg border-2 border-north-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col ${
              isExpanded
                ? 'inset-4 md:inset-10 max-w-5xl mx-auto rounded-none'
                : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[460px] h-[620px] max-h-[90vh]'
            }`}
          >
            {/* ── HEADER ── */}
            <div className="bg-north-black text-white px-4 py-3 flex items-center justify-between border-b border-north-black shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-north-lime text-north-black flex items-center justify-center font-heading font-extrabold text-xs rounded">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                      SM SAAD AI AGENT
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono text-north-lime bg-north-lime/20 px-1.5 py-0.2 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-north-lime animate-pulse"></span>
                      RAG Live
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-body">
                    Articles • VFX • Services • Digital Assets • Data
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 text-gray-300">
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className={`p-1.5 hover:text-north-lime hover:bg-white/10 rounded transition-colors ${
                    settingsOpen ? 'text-north-lime bg-white/10' : ''
                  }`}
                  title="Agent Settings & API Keys"
                  aria-label="Agent Settings"
                >
                  <SettingsIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={clearChat}
                  className="p-1.5 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                  title="Clear Chat History"
                  aria-label="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:block p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title={isExpanded ? 'Dock Window' : 'Expand Fullscreen'}
                  aria-label="Toggle Expand"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-north-lime hover:bg-white/10 rounded transition-colors ml-1"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── MODE FILTER TABS ── */}
            <div className="bg-north-dark-sand/60 px-3 py-1.5 border-b border-north-black/20 flex items-center gap-1.5 overflow-x-auto text-[11px] font-heading font-bold uppercase tracking-wider shrink-0 no-scrollbar">
              <button
                onClick={() => setSelectedMode('all')}
                className={`px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                  selectedMode === 'all'
                    ? 'bg-north-black text-north-lime'
                    : 'text-north-black/70 hover:text-north-black hover:bg-white/50'
                }`}
              >
                🌟 All Insights
              </button>
              <button
                onClick={() => handleModeChange('articles')}
                className={`px-2.5 py-1 rounded transition-all whitespace-nowrap flex items-center gap-1 ${
                  selectedMode === 'articles'
                    ? 'bg-north-black text-north-lime'
                    : 'text-north-black/70 hover:text-north-black hover:bg-white/50'
                }`}
              >
                <BookOpen className="w-3 h-3" /> Articles & Blogs
              </button>
              <button
                onClick={() => handleModeChange('services')}
                className={`px-2.5 py-1 rounded transition-all whitespace-nowrap flex items-center gap-1 ${
                  selectedMode === 'services'
                    ? 'bg-north-black text-north-lime'
                    : 'text-north-black/70 hover:text-north-black hover:bg-white/50'
                }`}
              >
                <Briefcase className="w-3 h-3" /> Services
              </button>
              <button
                onClick={() => handleModeChange('data')}
                className={`px-2.5 py-1 rounded transition-all whitespace-nowrap flex items-center gap-1 ${
                  selectedMode === 'data'
                    ? 'bg-north-black text-north-lime'
                    : 'text-north-black/70 hover:text-north-black hover:bg-white/50'
                }`}
              >
                <BarChart3 className="w-3 h-3" /> Site Data
              </button>
            </div>

            {/* ── SETTINGS OVERLAY PANEL ── */}
            {settingsOpen && (
              <div className="bg-north-bg border-b border-north-black p-4 text-xs font-body animate-fadeIn shrink-0">
                <div className="flex items-center justify-between font-heading font-bold uppercase text-north-black mb-3">
                  <span className="flex items-center gap-1.5">
                    <SettingsIcon className="w-3.5 h-3.5" /> AI Engine Configuration
                  </span>
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="text-north-gray hover:text-north-black text-xs underline"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold mb-1 text-north-black">
                      AI Provider Model:
                    </label>
                    <select
                      value={settings.provider}
                      onChange={(e) => {
                        const updated: AISettings = {
                          ...settings,
                          provider: e.target.value as any
                        };
                        setSettings(updated);
                        saveStoredAISettings(updated);
                      }}
                      className="w-full bg-white border border-north-black px-2.5 py-1.5 rounded text-xs focus:outline-none focus:ring-1 focus:ring-north-lime"
                    >
                      <option value="built-in">⚡ Built-in Offline Analytical RAG Engine (Zero API required)</option>
                      <option value="gemini">✨ Google Gemini 1.5 (Fast & Free API key)</option>
                      <option value="openai">🤖 OpenAI GPT-4o / Compatible Endpoint</option>
                    </select>
                  </div>

                  {settings.provider !== 'built-in' && (
                    <div>
                      <label className="block font-semibold mb-1 text-north-black">
                        {settings.provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}:
                      </label>
                      <input
                        type="password"
                        placeholder="Paste your API key..."
                        value={settings.apiKey || ''}
                        onChange={(e) => {
                          const updated = { ...settings, apiKey: e.target.value };
                          setSettings(updated);
                          saveStoredAISettings(updated);
                        }}
                        className="w-full bg-white border border-north-black px-2.5 py-1.5 rounded text-xs font-mono"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!settings.speechEnabled}
                        onChange={(e) => {
                          const updated = { ...settings, speechEnabled: e.target.checked };
                          setSettings(updated);
                          saveStoredAISettings(updated);
                        }}
                        className="accent-north-black"
                      />
                      <span>Enable Text-to-Speech Voice Playback</span>
                    </label>

                    <button
                      onClick={exportChat}
                      className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-north-black hover:underline"
                    >
                      <Download className="w-3 h-3" /> Export Chat (.md)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── MESSAGES LIST ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-body text-xs bg-north-bg/60">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`relative max-w-[92%] sm:max-w-[85%] p-3.5 rounded border transition-all ${
                        isUser
                          ? 'bg-north-black text-white border-north-black rounded-tr-none'
                          : 'bg-white text-north-black border-north-black/20 shadow-sm rounded-tl-none'
                      }`}
                    >
                      {/* Sender label & Timestamp */}
                      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/10 dark:border-north-black/10 text-[10px] font-mono opacity-80">
                        <span className="font-heading font-bold uppercase">
                          {isUser ? 'You' : 'AI Site Agent'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Message Content */}
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      ) : (
                        <ChatMarkdown content={msg.text} />
                      )}

                      {/* Attached Inline Cards (Blogs, Assets, Services) */}
                      {!isUser && msg.metadata && (
                        <ChatCards
                          articles={msg.metadata.articles}
                          assets={msg.metadata.assets}
                          services={msg.metadata.services}
                          projects={msg.metadata.projects}
                          pricing={msg.metadata.pricing}
                          onSelectPrompt={(p) => handleSendMessage(p)}
                        />
                      )}

                      {/* Sources Bar */}
                      {!isUser && msg.metadata?.sources && msg.metadata.sources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-north-black/10 flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="text-north-gray font-mono">Sources:</span>
                          {msg.metadata.sources.map((src, i) => (
                            <span
                              key={i}
                              className="bg-north-dark-sand/70 text-north-black font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5"
                            >
                              {src.title}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Agent Tooling footer (Copy, Speak, Model badge) */}
                      {!isUser && (
                        <div className="mt-2 pt-1.5 border-t border-north-black/10 flex items-center justify-between text-[10px] text-north-gray">
                          <span className="font-mono text-[9px] opacity-70">
                            {msg.metadata?.modelUsed || 'Site Intelligence Engine'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => speakText(msg.text, msg.id)}
                              className="hover:text-north-black transition-colors"
                              title="Listen to text"
                              aria-label="Speak text"
                            >
                              {isSpeakingId === msg.id ? (
                                <VolumeX className="w-3.5 h-3.5 text-north-green-dark" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleCopy(msg.text, msg.id)}
                              className="hover:text-north-black transition-colors"
                              title="Copy to clipboard"
                              aria-label="Copy message"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Follow-up Question Suggestion Chips */}
                    {!isUser && msg.metadata?.suggestedFollowUps && (
                      <div className="mt-2 flex flex-wrap gap-1.5 max-w-[92%] sm:max-w-[85%]">
                        {msg.metadata.suggestedFollowUps.map((chip, ci) => (
                          <button
                            key={ci}
                            onClick={() => handleSendMessage(chip)}
                            className="bg-white border border-north-black/20 text-north-black text-[11px] font-medium px-2.5 py-1 rounded hover:bg-north-lime hover:border-north-black transition-all text-left flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <span>{chip}</span>
                            <ChevronRight className="w-3 h-3 opacity-60" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 bg-white border border-north-black/20 px-3.5 py-2.5 rounded-lg w-fit shadow-xs animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-north-black animate-spin" />
                  <span className="font-heading font-bold text-xs text-north-black">
                    Analyzing site knowledge & articles...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── QUICK PROMPTS BAR ── */}
            <div className="bg-north-dark-sand/30 px-3 py-1.5 border-t border-north-black/10 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
              <span className="text-[10px] font-mono font-bold text-north-gray uppercase shrink-0">
                Quick:
              </span>
              <button
                onClick={() => handleSendMessage('Summarize the top articles and takeaways')}
                className="bg-white px-2 py-0.5 rounded border border-north-black/20 hover:border-north-black hover:bg-north-lime text-north-black whitespace-nowrap transition-colors cursor-pointer"
              >
                📰 Summarize Articles
              </button>
              <button
                onClick={() => handleSendMessage('What VFX and video editing techniques are explained?')}
                className="bg-white px-2 py-0.5 rounded border border-north-black/20 hover:border-north-black hover:bg-north-lime text-north-black whitespace-nowrap transition-colors cursor-pointer"
              >
                🎬 VFX & Editing Insights
              </button>
              <button
                onClick={() => handleSendMessage('What free creative assets can I download?')}
                className="bg-white px-2 py-0.5 rounded border border-north-black/20 hover:border-north-black hover:bg-north-lime text-north-black whitespace-nowrap transition-colors cursor-pointer"
              >
                📦 Free Asset Packs
              </button>
              <button
                onClick={() => handleSendMessage('What services are offered and how do I get a quote?')}
                className="bg-white px-2 py-0.5 rounded border border-north-black/20 hover:border-north-black hover:bg-north-lime text-north-black whitespace-nowrap transition-colors cursor-pointer"
              >
                💼 Services & Rates
              </button>
            </div>

            {/* ── INPUT BAR ── */}
            <div className="p-3 bg-white border-t border-north-black flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded border border-north-black/30 transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-north-bg text-north-black hover:bg-north-dark-sand'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Voice Input (Dictate)'}
                aria-label="Voice Input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about articles, blogs, VFX, services, data..."
                className="flex-1 bg-north-bg border border-north-black/30 px-3.5 py-2 rounded text-xs font-body text-north-black placeholder:text-north-gray focus:outline-none focus:border-north-black focus:ring-1 focus:ring-north-black"
                disabled={isTyping}
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className={`px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all border border-north-black ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black cursor-pointer'
                    : 'bg-north-dark-sand text-north-gray cursor-not-allowed'
                }`}
                aria-label="Send Message"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
