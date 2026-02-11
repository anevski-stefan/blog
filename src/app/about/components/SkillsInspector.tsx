"use client"

import { useState } from "react"

const skills = [
  {
    symbol: "Ts",
    name: "TypeScript",
    number: "01",
    group: "Language",
    color: "text-blue-400",
    desc: "Strongly typed JS superset",
  },
  {
    symbol: "Re",
    name: "React.js",
    number: "02",
    group: "Frontend",
    color: "text-cyan-400",
    desc: "UI Library",
  },
  {
    symbol: "Nx",
    name: "Next.js",
    number: "03",
    group: "Framework",
    color: "text-white",
    desc: "React Framework",
  },
  {
    symbol: "Sb",
    name: "Spring Boot",
    number: "04",
    group: "Backend",
    color: "text-green-500",
    desc: "Java Framework",
  },
  {
    symbol: "Pg",
    name: "PostgreSQL",
    number: "05",
    group: "Database",
    color: "text-blue-300",
    desc: "Relational DB",
  },
  {
    symbol: "Ai",
    name: "Gen AI",
    number: "06",
    group: "Intelligence",
    color: "text-purple-400",
    desc: "LLM Integration",
  },
  {
    symbol: "Tw",
    name: "Tailwind",
    number: "07",
    group: "Styling",
    color: "text-teal-400",
    desc: "Utility CSS",
  },
  {
    symbol: "No",
    name: "Node.js",
    number: "08",
    group: "Runtime",
    color: "text-green-600",
    desc: "JS Runtime",
  },
  {
    symbol: "Aw",
    name: "AWS",
    number: "09",
    group: "Cloud",
    color: "text-orange-400",
    desc: "Cloud Provider",
  },
  {
    symbol: "Do",
    name: "Docker",
    number: "10",
    group: "DevOps",
    color: "text-blue-500",
    desc: "Containerization",
  },
  {
    symbol: "Gi",
    name: "Git",
    number: "11",
    group: "Version Control",
    color: "text-red-400",
    desc: "Source Control",
  },
  {
    symbol: "Gr",
    name: "GraphQL",
    number: "12",
    group: "API",
    color: "text-pink-400",
    desc: "Query Language",
  },
]

export function SkillsInspector() {
  const [hoveredSkill, setHoveredSkill] = useState<(typeof skills)[0] | null>(
    null
  )

  return (
    <section id="skills-grid" className="relative">
      <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
        <div className="md:sticky md:top-32 md:w-1/3 space-y-8">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-4">
              Technical Arsenal
            </h2>
            <p className="text-home-muted text-sm leading-relaxed">
              My toolkit is curated for high-performance, scalable modern web
              development. Each technology is selected for its reliability and
              developer experience.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md min-h-[200px] transition-all duration-300">
            {hoveredSkill ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`font-heading text-4xl font-bold ${hoveredSkill.color}`}
                  >
                    {hoveredSkill.symbol}
                  </span>
                  <span className="font-mono text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                    No. {hoveredSkill.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{hoveredSkill.name}</h3>
                <p className="text-sm text-home-accent mb-3 font-mono text-xs tracking-wider uppercase">
                  {hoveredSkill.group}
                </p>
                <p className="text-sm text-home-muted">{hoveredSkill.desc}</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <span className="text-4xl mb-4">⌘</span>
                <p className="text-sm font-mono">
                  Hover over an element to inspect
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map(skill => (
            <div
              key={skill.symbol}
              className="skill-card aspect-square relative group cursor-crosshair"
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 group-hover:bg-white/10 group-hover:border-home-accent/50 group-hover:shadow-[0_0_30px_-5px_var(--home-accent)] shadow-none" />

              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-white/40">
                    {skill.number}
                  </span>
                </div>

                <div className="text-center">
                  <span
                    className={`font-heading text-3xl md:text-4xl font-bold ${skill.color} transition-all duration-300 group-hover:scale-110 block`}
                  >
                    {skill.symbol}
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-[10px] font-mono tracking-wider text-white/60 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {skill.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
