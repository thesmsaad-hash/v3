import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, X, Sparkles } from 'lucide-react';
import { navItems, siteConfig } from '../data/siteData';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-north-bg border-b border-north-black">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-stretch h-16 md:h-20 border-x border-north-black">
          
          {/* 1. Logo Box: Solid Black with "S." */}
          <div className="w-16 sm:w-20 md:w-24 bg-north-black flex items-center justify-center border-r border-north-black shrink-0">
            <Link to="/" className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tighter hover:text-north-lime transition-colors">
              S.
            </Link>
          </div>

          {/* 2. Identity Block: SM SAAD / Video Editor, VFX Artist & Web Developer */}
          <div className="hidden sm:flex flex-col justify-center px-5 border-r border-north-black shrink-0">
            <Link to="/" className="font-heading font-extrabold text-sm md:text-base text-north-black uppercase tracking-tight leading-none">
              {siteConfig.name}
            </Link>
            <span className="font-body text-[10px] md:text-[11px] text-north-gray font-medium mt-1 max-w-[260px] truncate">
              {siteConfig.role}
            </span>
          </div>

          {/* 3. Navigation Menu (Desktop) */}
          <nav className="hidden lg:flex flex-1 items-center justify-center px-4">
            <ul className="flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const isAIAgent = item.path === '/agent';
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                          isAIAgent
                            ? isActive
                              ? 'bg-north-black text-north-lime px-2.5 py-1 rounded'
                              : 'text-north-black bg-north-lime/60 px-2 py-0.5 rounded hover:bg-north-lime hover:text-north-black'
                            : isActive
                            ? 'text-north-black border-b-2 border-north-black pb-1'
                            : 'text-north-gray hover:text-north-black'
                        }`
                      }
                    >
                      {isAIAgent && <Sparkles className="w-3 h-3 text-north-black animate-pulse" />}
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex flex-1 lg:hidden items-center justify-end px-4 border-r border-north-black">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-north-black focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* 4. Far-Right Black Square Arrow Box */}
          <Link
            to="/contact"
            className="w-16 md:w-20 bg-north-black flex items-center justify-center text-white hover:bg-north-lime hover:text-north-black transition-colors shrink-0 group border-l border-north-black"
            aria-label="Start A Project"
          >
            <ArrowUpRight className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-north-bg border-b border-north-black px-6 py-6 animate-fadeIn">
          <ul className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-heading font-bold uppercase py-1.5 border-b border-north-dark-sand text-north-black hover:text-north-lime-dark"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-north w-full text-center"
              >
                START A PROJECT
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
