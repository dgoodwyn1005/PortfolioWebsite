import { ProjectCard } from "@/components/project-card"

import type {
  Project,
} from "@/lib/content/projects"

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({
  projects,
}: ProjectsSectionProps) {
  if (!projects.length) {
    return null
  }

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-20 border-t border-border/60 py-16 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 sm:mb-14 lg:mb-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Selected Work
            </p>
          </div>

          <div className="lg:col-span-8">
            <h2
              id="projects-heading"
              className="max-w-3xl text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl"
            >
              Ideas become reality.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Products, experiments, and client work across software,
              design, and technology.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-20">
          {projects.map(
            (project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ),
          )}
        </div>
      </div>
    </section>
  )
}