"use client";

import { useState } from "react";

const navLinks = [
  { label: "Skills", id: "capabilities" },
  { label: "Projects", id: "work" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
] as const;

export default function Navbar() {
  const [active, setActive] = useState<string>("Skills");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="flex items-center rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 backdrop-blur-md">
        <span className="font-mono text-sm font-semibold tracking-wide text-foreground">
          &lt;/&gt;
        </span>
      </div>

      {/* Center nav links */}
      <div className="hidden md:flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.02] px-2 py-1.5 backdrop-blur-md transition-transform duration-200 hover:scale-105">
        {navLinks.map((link) => (
          <button
            key={link.label}
            onClick={() => {
              setActive(link.label);
              document
                .getElementById(link.id)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`relative rounded-full px-4 py-1.5 font-mono text-xs tracking-wide transition-all duration-200 ${
              active === link.label
                ? "bg-white/10 text-foreground"
                : "text-white/50 hover:text-foreground cursor-pointer"
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right — status */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 backdrop-blur-md">
          <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-mono text-xs tracking-wide text-white/50">
            SHIPPING
          </span>
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 4h10M2 7h10M2 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
