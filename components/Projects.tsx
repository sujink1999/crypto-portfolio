"use client";

import { useState } from "react";
import BeansDetail from "@/components/projects/BeansDetail";
import CaddiDetail from "@/components/projects/CaddiDetail";
import KeomDetail from "@/components/projects/KeomDetail";
import MudrexDetail from "@/components/projects/MudrexDetail";
import ScrollReveal from "@/components/ScrollReveal";

const projects = [
  {
    number: "01",
    name: "Beans",
    type: "Token Trading Platform",
    tags: "React / AWS Lambda / Figma",
    year: "2024",
    color: "#fb923c",
    image: "/projects/beans.png",
  },
  {
    number: "02",
    name: "Caddi",
    type: "Chrome Extension",
    tags: "JavaScript / AWS / React",
    year: "2023",
    color: "#c084fc",
    image: "/projects/caddi.png",
  },
  {
    number: "03",
    name: "0vix",
    type: "DeFi Lending Protocol",
    tags: "React / Solidity / Web3",
    year: "2023",
    color: "#38bdf8",
    image: "/projects/0vix.png",
  },
  {
    number: "04",
    name: "Mudrex",
    type: "CeFi Investment Platform",
    tags: "React / React Native / Figma",
    year: "2022",
    color: "#4ade80",
    image: "/projects/mudrex-1.png",
  },
];

function ProjectRow({
  project,
  onClick,
}: {
  project: (typeof projects)[number];
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative border-b border-white/10 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-4 md:gap-8 py-6 md:py-8 transition-all duration-300 group-hover:px-2">
        {/* Number — green only on hover */}
        <span className="font-mono text-xs md:text-sm text-white/30 transition-colors duration-300 group-hover:text-accent shrink-0 w-6">
          {project.number}
        </span>

        {/* Name + Type */}
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white/90 transition-colors duration-300 group-hover:text-white">
            {project.name}
          </h3>
          <p className="text-xs md:text-sm text-white/30 mt-1 font-mono">
            {project.type}
          </p>
        </div>

        {/* Tags + Year (hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-6 md:gap-10 shrink-0">
          <span className="font-mono text-xs md:text-sm text-white/40">
            {project.tags}
          </span>
          <span className="font-mono text-xs md:text-sm text-white/30">
            {project.year}
          </span>
        </div>

        {/* Arrow — always visible */}
        <svg
          className="w-4 h-4 md:w-5 md:h-5 text-white/20 transition-all duration-300 group-hover:text-accent group-hover:translate-x-1 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </div>

      {/* Hover preview — right-aligned, slight 3D curve */}
      <div
        className={`pointer-events-none absolute z-10 left-1/2 top-1/2 hidden md:block rounded-2xl overflow-hidden transition-all duration-300 ease-out ${
          project.name === "Caddi" || project.name === "Mudrex" ? "w-48 lg:w-56" : "w-96 lg:w-[28rem]"
        }`}
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered
            ? "translate(-50%, -50%) rotate(-3deg) scale(1)"
            : "translate(-50%, -50%) rotate(-3deg) scale(0.9)",
        }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-auto rounded-2xl"
            style={{
              border: "2px solid rgba(255, 255, 255, 0.15)",
              boxShadow: hovered ? `0 8px 32px ${project.color}15` : "none",
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${project.color}18 0%, ${project.color}08 50%, transparent 100%)`,
              border: "2px solid rgba(255, 255, 255, 0.15)",
              boxShadow: hovered ? `0 8px 32px ${project.color}15` : "none",
            }}
          >
            <span
              className="text-5xl md:text-6xl font-bold opacity-10"
              style={{ color: project.color }}
            >
              {project.name[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const [detailOpen, setDetailOpen] = useState<string | null>(null);

  return (
    <section id="work" className="relative px-6 md:px-16 lg:px-24 py-32">
      {/* Section header */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight">
            Selected Works
          </h2>
          <span className="font-mono text-xs text-white/30">
            // 04 PROJECTS
          </span>
        </div>
      </ScrollReveal>

      {/* Top border */}
      <div className="border-t border-white/10">
        {projects.map((project, i) => (
          <ScrollReveal key={project.number} delay={i * 100}>
          <ProjectRow
            key={project.number}
            project={project}
            onClick={
              project.name === "Beans"
                ? () => setDetailOpen("Beans")
                : project.name === "Caddi"
                  ? () => setDetailOpen("Caddi")
                  : project.name === "0vix"
                    ? () => setDetailOpen("0vix")
                    : project.name === "Mudrex"
                      ? () => setDetailOpen("Mudrex")
                      : undefined
            }
          />
          </ScrollReveal>
        ))}
      </div>

      {detailOpen === "Beans" && (
        <BeansDetail onClose={() => setDetailOpen(null)} />
      )}
      {detailOpen === "Caddi" && (
        <CaddiDetail onClose={() => setDetailOpen(null)} />
      )}
      {detailOpen === "0vix" && (
        <KeomDetail onClose={() => setDetailOpen(null)} />
      )}
      {detailOpen === "Mudrex" && (
        <MudrexDetail onClose={() => setDetailOpen(null)} />
      )}
    </section>
  );
}
