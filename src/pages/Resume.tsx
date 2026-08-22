import React from 'react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { siteConfig, skillsData, educationData, workflowData } from '../data/siteData';
import { Code, Film, GraduationCap, Sparkles, Video, Wand2 } from 'lucide-react';

export const Resume: React.FC = () => {
  const creativeSkills = skillsData.filter(s => s.category === "Creative Skills");
  const webSkills = skillsData.filter(s => s.category === "Web Development");
  const aiSkills = skillsData.filter(s => s.category === "AI & Automation");

  return (
    <div className="space-y-16 md:space-y-24 pb-12 bg-north-bg text-north-black">
      <SEO
        title="Resume & Technical Skills Matrix — SM SAAD"
        description="Professional resume, technical skills matrix, Arena Animation training, and post-production capabilities of SM SAAD (Video Editor, VFX Compositor & Web Developer)."
        keywords="SM SAAD Resume, Video Editing Skills, VFX Compositing Skills, React Skills, Arena Animation Certification, SM SAAD Qualifications"
        canonical="https://smsaad.online/resume"
        breadcrumbs={[{ name: 'Resume & Skills', url: '/resume' }]}
      />
      
      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 md:pt-16">
        <div className="border border-north-black bg-white p-8 md:p-14 space-y-6">
          <div className="inline-flex items-center space-x-2 border border-north-black bg-north-bg px-3 py-1">
            <span className="w-2.5 h-2.5 bg-north-lime border border-north-black inline-block"></span>
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-north-black">
              SKILLS & PROFESSIONAL PROFILES
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight leading-none">
            {siteConfig.name} — Skills & Background
          </h1>

          <p className="text-north-gray font-body text-base md:text-lg max-w-3xl">
            <strong>{siteConfig.role}</strong> creating visual content, building digital experiences, and exploring modern creative technologies across digital platforms, brands, and creators.
          </p>

          <div className="pt-2">
            <Button to="/contact">Start a Project With Me</Button>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL PROFILES SECTION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-white p-8 md:p-12 space-y-8">
          <div className="flex items-center justify-between border-b border-north-black pb-6">
            <div>
              <span className="text-north-lime-dark font-heading font-bold text-xs uppercase tracking-widest block mb-1">
                MULTIDISCIPLINARY PROFILES
              </span>
              <h2 className="font-heading text-3xl font-bold uppercase">Professional Roles</h2>
            </div>
            <Film className="w-8 h-8 text-north-black hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Video Editor */}
            <div className="border border-north-black bg-north-bg p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-north-lime-dark" />
                <h3 className="font-heading font-bold text-xl uppercase text-north-black">Video Editor</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-north-gray font-medium pt-2">
                <li>• Video Editing & Storytelling</li>
                <li>• Post Production & Pacing</li>
                <li>• YouTube Videos & Social Media Content</li>
                <li>• Short-form Content & Reels</li>
              </ul>
            </div>

            {/* 2. VFX Compositing Artist */}
            <div className="border border-north-black bg-north-bg p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-north-lime-dark" />
                <h3 className="font-heading font-bold text-xl uppercase text-north-black">VFX Compositing Artist</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-north-gray font-medium pt-2">
                <li>• Multi-Pass Compositing</li>
                <li>• Green Screen Keying & Rotoscoping</li>
                <li>• Screen Replacement & Object Removal</li>
                <li>• Cleanup & Visual Integration</li>
              </ul>
            </div>

            {/* 3. Web Developer */}
            <div className="border border-north-black bg-north-bg p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-north-lime-dark" />
                <h3 className="font-heading font-bold text-xl uppercase text-north-black">Web Developer</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-north-gray font-medium pt-2">
                <li>• Responsive Websites (HTML/CSS/JS)</li>
                <li>• Modern Components (React & Next.js)</li>
                <li>• WordPress Custom Theme Implementation</li>
                <li>• UI/UX Implementation & API Integration</li>
              </ul>
            </div>

            {/* 4. AI Creative Technologist */}
            <div className="border border-north-black bg-north-bg p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Wand2 className="w-5 h-5 text-north-lime-dark" />
                <h3 className="font-heading font-bold text-xl uppercase text-north-black">AI Creative Technologist</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-north-gray font-medium pt-2">
                <li>• AI-assisted Creative Workflows</li>
                <li>• Node & Local AI Automation (n8n, Ollama)</li>
                <li>• Creative Experimentation</li>
                <li>• Digital Product Experimentation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS MATRIX GROUPED */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-white p-8 md:p-12 space-y-10">
          <div>
            <span className="text-north-lime-dark font-heading font-bold text-xs uppercase tracking-widest block mb-1">
              SKILLS MATRIX (NO FAKE PERCENTAGES)
            </span>
            <h2 className="font-heading text-3xl font-bold uppercase">My Skills</h2>
          </div>

          <div className="space-y-8">
            {/* Creative Skills */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg uppercase border-b border-north-black pb-2 text-north-black">
                Creative Skills
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {creativeSkills.map((skill, idx) => (
                  <div key={idx} className="border border-north-black p-4 bg-north-bg font-heading font-bold text-xs uppercase text-north-black">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Web Development */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg uppercase border-b border-north-black pb-2 text-north-black">
                Web Development
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {webSkills.map((skill, idx) => (
                  <div key={idx} className="border border-north-black p-4 bg-north-bg font-heading font-bold text-xs uppercase text-north-black">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>

            {/* AI & Automation */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg uppercase border-b border-north-black pb-2 text-north-black">
                AI & Automation
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {aiSkills.map((skill, idx) => (
                  <div key={idx} className="border border-north-black p-4 bg-north-bg font-heading font-bold text-xs uppercase text-north-black">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* EDUCATION & TRAINING */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="border border-north-black bg-white p-8 md:p-12 space-y-8">
          <div className="flex items-center justify-between border-b border-north-black pb-6">
            <div>
              <span className="text-north-lime-dark font-heading font-bold text-xs uppercase tracking-widest block mb-1">
                CREATIVE EDUCATION
              </span>
              <h2 className="font-heading text-3xl font-bold uppercase">Education & Training</h2>
            </div>
            <GraduationCap className="w-8 h-8 text-north-black hidden sm:block" />
          </div>

          {educationData.map((edu, idx) => (
            <div key={idx} className="border border-north-black bg-north-bg p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-heading font-bold text-2xl uppercase text-north-black">{edu.institution}</h3>
                {edu.degree && (
                  <span className="bg-north-black text-north-lime font-heading font-bold text-xs uppercase px-3 py-1 border border-north-black">
                    {edu.degree}
                  </span>
                )}
              </div>
              <p className="text-north-black font-bold text-sm uppercase">Focus: {edu.focus}</p>
              <p className="text-north-gray text-sm leading-relaxed">{edu.details}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
