"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { LazyMotion, domAnimation, m, MotionConfig } from "motion/react";
import { categories, type Project } from "@/content/projects";
import { ProjectCard } from "./project-card";

export function Portfolio({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [technology, setTechnology] = useState("");
  const technologies = [
    ...new Set(projects.flatMap((project) => project.technologies)),
  ].sort();
  const matches = projects.filter(
    (project) =>
      (!category || project.categories.some((item) => item === category)) &&
      (!technology || project.technologies.includes(technology)) &&
      query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .every((term) =>
          [
            project.title,
            project.summary,
            project.description,
            ...project.categories,
            ...project.technologies,
          ]
            .join(" ")
            .toLowerCase()
            .includes(term),
        ),
  );

  return (
    <>
      <div className="filters">
        <label>
          <span>Search projects</span>
          <span className="search-shell">
            <Search aria-hidden size={18} />
            <input
              type="search"
              value={query}
              placeholder="Search by name, topic or technology"
              onChange={(event) => setQuery(event.target.value)}
            />
          </span>
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All Projects</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Technology
          <select
            value={technology}
            onChange={(event) => setTechnology(event.target.value)}
          >
            <option value="">All technologies</option>
            {technologies.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="filter-count" role="status">
        {matches.length} {matches.length === 1 ? "project" : "projects"}
      </p>
      {matches.length ? (
        <LazyMotion features={domAnimation}>
          <MotionConfig reducedMotion="user">
            <div className="projects-grid">
              {matches.map((project) => (
                <m.div
                  key={project.id}
                  initial={{ opacity: 0.85 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.16 }}
                >
                  <ProjectCard project={project} />
                </m.div>
              ))}
            </div>
          </MotionConfig>
        </LazyMotion>
      ) : (
        <div className="empty">
          <p>No projects match these filters.</p>
          <button
            className="action action-outline"
            onClick={() => {
              setQuery("");
              setCategory("");
              setTechnology("");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
