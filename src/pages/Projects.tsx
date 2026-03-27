import { useState } from "react";
import { projectsDetailed, tasks } from "@/lib/mock-data";
import {
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
  Users,
  Clock,
  DollarSign,
  GitMerge,
  Mail,
  Calendar,
  Ship,
  FileText,
  BarChart3,
} from "lucide-react";

export default function Projects() {
  const [expandedProject, setExpandedProject] = useState<number | null>(1);
  const [activeContextTab, setActiveContextTab] = useState<Record<number, string>>({
    1: "overview",
    2: "overview",
    3: "overview",
  });

  const setTab = (projectId: number, tabId: string) => {
    setActiveContextTab((prev) => ({ ...prev, [projectId]: tabId }));
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-[1200px]">
        <h1 className="font-mono text-3xl font-bold tracking-tight mb-1">
          PROJECTS<span className="text-primary">.</span>
        </h1>
        <p className="text-xs text-muted-foreground mb-6">
          Active operations & task intelligence
        </p>

        {/* Project summary bar */}
        <div className="grid grid-cols-3 gap-0 border border-border mb-6">
          <div className="p-4 border-r border-border">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">ACTIVE</span>
            <p className="font-mono text-2xl font-bold mt-1">{projectsDetailed.length}</p>
          </div>
          <div className="p-4 border-r border-border">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">AT_RISK</span>
            <p className="font-mono text-2xl font-bold text-primary mt-1">
              {projectsDetailed.filter((p) => p.status === "AT_RISK").length}
            </p>
          </div>
          <div className="p-4">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL_TASKS</span>
            <p className="font-mono text-2xl font-bold mt-1">
              {projectsDetailed.reduce((sum, p) => sum + p.tasks.total, 0)}
            </p>
          </div>
        </div>

        {/* Project cards */}
        <div className="space-y-3">
          {projectsDetailed.map((project) => (
            <div key={project.id} className="border border-border">
              {/* Header */}
              <button
                onClick={() =>
                  setExpandedProject(expandedProject === project.id ? null : project.id)
                }
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                    {project.code}
                  </span>
                  <span className="font-mono text-sm font-bold">{project.name}</span>
                  <span
                    className={`font-mono text-[9px] tracking-wider px-1.5 py-0.5 border ${
                      project.status === "AT_RISK"
                        ? "border-primary text-primary"
                        : "border-border"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-border">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] font-bold">{project.progress}%</span>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      expandedProject === project.id ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Expanded view */}
              {expandedProject === project.id && (
                <div className="border-t border-border">
                  {/* Context tabs */}
                  <div className="flex items-center border-b border-border">
                    {project.contextTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setTab(project.id, tab.id)}
                        className={`font-mono text-[10px] tracking-widest px-4 py-2.5 border-b-2 transition-colors ${
                          activeContextTab[project.id] === tab.id
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div className="p-4">
                    {activeContextTab[project.id] === "overview" && (
                      <ProjectOverview project={project} />
                    )}
                    {activeContextTab[project.id] === "emails" && (
                      <ProjectEmails emails={project.contextData.emails} />
                    )}
                    {activeContextTab[project.id] === "meetings" && (
                      <ProjectMeetings meetings={project.contextData.meetings} />
                    )}
                    {activeContextTab[project.id] === "logistics" && (
                      <ProjectLogistics logistics={project.contextData.logistics} />
                    )}
                    {(activeContextTab[project.id] === "documents" ||
                      activeContextTab[project.id] === "compliance" ||
                      activeContextTab[project.id] === "finance") && (
                      <div className="text-center py-8">
                        <FileText className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <p className="font-mono text-[11px] text-muted-foreground">
                          REAL-TIME DATA SYNC ACTIVE
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Connected to ERP & document management systems
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Related tasks */}
                  <div className="border-t border-border p-4">
                    <span className="font-mono text-[9px] tracking-widest text-muted-foreground block mb-3">
                      RELATED_TASKS
                    </span>
                    <div className="space-y-1">
                      {tasks
                        .filter((t) => t.project === project.name)
                        .map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-2 p-2 border border-border"
                          >
                            {task.status === "DONE" ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                            ) : task.status === "IN_PROGRESS" ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 shrink-0" />
                            )}
                            <span className={`text-xs flex-1 ${task.status === "DONE" ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </span>
                            {task.duplicatesMerged > 0 && (
                              <span className="flex items-center gap-0.5 font-mono text-[9px] text-primary">
                                <GitMerge className="h-2.5 w-2.5" />
                                {task.duplicatesMerged}
                              </span>
                            )}
                            <span className="font-mono text-[8px] tracking-wider text-muted-foreground">
                              {task.source}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───

function ProjectOverview({ project }: { project: (typeof projectsDetailed)[0] }) {
  return (
    <>
      {/* KPIs row */}
      <div className="grid grid-cols-4 gap-0 border border-border mb-4">
        <div className="p-3 border-r border-border">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[9px] tracking-wider text-muted-foreground">BUDGET</span>
          </div>
          <p className="font-mono text-xs font-bold">
            ${(project.kpis.budget.spent / 1000).toFixed(0)}K
            <span className="text-muted-foreground font-normal">
              {" "}/ ${(project.kpis.budget.total / 1000).toFixed(0)}K
            </span>
          </p>
          <div className="w-full h-1 bg-border mt-1.5">
            <div
              className={`h-full ${
                project.kpis.budget.spent / project.kpis.budget.total > 0.9
                  ? "bg-primary"
                  : "bg-foreground"
              }`}
              style={{
                width: `${(project.kpis.budget.spent / project.kpis.budget.total) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="p-3 border-r border-border">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[9px] tracking-wider text-muted-foreground">TEAM</span>
          </div>
          <p className="text-[11px]">{project.team.join(", ")}</p>
        </div>
        <div className="p-3 border-r border-border">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[9px] tracking-wider text-muted-foreground">DAYS_LEFT</span>
          </div>
          <p className={`font-mono text-lg font-bold ${project.kpis.daysRemaining <= 5 ? "text-primary" : ""}`}>
            {project.kpis.daysRemaining}
          </p>
        </div>
        <div className="p-3">
          <span className="font-mono text-[9px] tracking-wider text-muted-foreground block mb-1">TASKS</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs">{project.tasks.done}/{project.tasks.total}</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[8px] text-muted-foreground">{project.tasks.inProgress} IP</span>
              <span className="font-mono text-[8px] text-muted-foreground">{project.tasks.todo} TD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground block mb-3">
          MILESTONES
        </span>
        <div className="flex items-center gap-0">
          {project.milestones.map((ms, i) => (
            <div key={ms.name} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                {ms.done ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={`font-mono text-[8px] tracking-wider text-center max-w-[80px] ${
                  ms.done ? "" : "text-muted-foreground"
                }`}>
                  {ms.name.toUpperCase()}
                </span>
              </div>
              {i < project.milestones.length - 1 && (
                <div className={`w-8 h-px mx-1 ${ms.done ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ProjectEmails({ emails }: { emails: { id: number; from: string; subject: string; time: string; status: string }[] }) {
  return (
    <div className="space-y-1.5">
      {emails.map((email) => (
        <div key={email.id} className="flex items-center gap-3 p-3 border border-border">
          <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{email.subject}</p>
            <p className="text-[10px] text-muted-foreground">{email.from} • {email.time}</p>
          </div>
          <span className={`font-mono text-[9px] tracking-wider px-1.5 py-0.5 border shrink-0 ${
            email.status === "reply_needed" ? "border-primary text-primary" :
            email.status === "flagged" ? "border-primary text-primary" :
            "border-border text-muted-foreground"
          }`}>
            {email.status.toUpperCase().replace("_", " ")}
          </span>
        </div>
      ))}
      {emails.length === 0 && (
        <p className="text-[11px] text-muted-foreground text-center py-4">No related emails</p>
      )}
    </div>
  );
}

function ProjectMeetings({ meetings }: { meetings: { id: number; title: string; time: string; attendees: number; status: string; actionItems?: number }[] }) {
  return (
    <div className="space-y-1.5">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="flex items-center gap-3 p-3 border border-border">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium">{meeting.title}</p>
            <p className="text-[10px] text-muted-foreground">
              {meeting.time} • {meeting.attendees} attendees
              {meeting.actionItems && ` • ${meeting.actionItems} action items`}
            </p>
          </div>
          <span className={`font-mono text-[9px] tracking-wider px-1.5 py-0.5 border shrink-0 ${
            meeting.status === "upcoming" ? "border-primary text-primary" : "border-border text-muted-foreground"
          }`}>
            {meeting.status.toUpperCase()}
          </span>
        </div>
      ))}
      {meetings.length === 0 && (
        <p className="text-[11px] text-muted-foreground text-center py-4">No related meetings</p>
      )}
    </div>
  );
}

function ProjectLogistics({ logistics }: { logistics: { id: number; container: string; status: string; location: string; eta: string }[] }) {
  return (
    <div className="space-y-1.5">
      {logistics.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-3 border border-border">
          <Ship className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold">{item.container}</span>
              <span className={`font-mono text-[9px] tracking-wider px-1.5 py-0.5 border ${
                item.status === "DELAYED" ? "border-primary text-primary" : "border-border"
              }`}>
                {item.status}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">{item.location} • ETA: {item.eta}</p>
          </div>
        </div>
      ))}
      {logistics.length === 0 && (
        <p className="text-[11px] text-muted-foreground text-center py-4">No logistics data</p>
      )}
    </div>
  );
}
