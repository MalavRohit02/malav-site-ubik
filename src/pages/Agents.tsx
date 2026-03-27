import { useState } from "react";
import {
  agents,
  approvals,
  connectedApps,
  agentPreferences,
} from "@/lib/mock-data";
import {
  Mail,
  Brain,
  MessageSquare,
  FileText,
  Database,
  AlertTriangle,
  Globe,
  Monitor,
  Send,
  Calendar,
  CheckSquare,
  Phone,
  ChevronDown,
  ChevronRight,
  Plus,
  Check,
  X,
  Edit3,
  Zap,
  Power,
  GripVertical,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const toolIcons: Record<string, React.ReactNode> = {
  Mail: <Mail className="h-3.5 w-3.5" />,
  Brain: <Brain className="h-3.5 w-3.5" />,
  MessageSquare: <MessageSquare className="h-3.5 w-3.5" />,
  FileText: <FileText className="h-3.5 w-3.5" />,
  Database: <Database className="h-3.5 w-3.5" />,
  AlertTriangle: <AlertTriangle className="h-3.5 w-3.5" />,
  Globe: <Globe className="h-3.5 w-3.5" />,
  Monitor: <Monitor className="h-3.5 w-3.5" />,
  Send: <Send className="h-3.5 w-3.5" />,
  Calendar: <Calendar className="h-3.5 w-3.5" />,
  CheckSquare: <CheckSquare className="h-3.5 w-3.5" />,
  Phone: <Phone className="h-3.5 w-3.5" />,
  Figma: <Globe className="h-3.5 w-3.5" />,
};

type AgentView = "kanban" | "approvals" | "preferences";

export default function Agents() {
  const [activeView, setActiveView] = useState<AgentView>("kanban");
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null);
  const [agentStates, setAgentStates] = useState<Record<number, boolean>>(
    Object.fromEntries(agents.map((a) => [a.id, a.active]))
  );

  const toggleAgent = (id: number) => {
    setAgentStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeAgents = agents.filter((a) => agentStates[a.id]);
  const pausedAgents = agents.filter((a) => !agentStates[a.id]);

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-[1200px]">
        <div className="mb-6">
          <h1 className="font-mono text-3xl font-bold tracking-tight">
            AGENTS<span className="text-primary">.</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure workflows, review approvals, manage connected tools
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-0 border-b border-border mb-6">
          {(["kanban", "approvals", "preferences"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`font-mono text-[11px] tracking-widest px-4 py-2.5 border-b-2 transition-colors ${
                activeView === tab
                  ? "border-primary text-primary"
                  : "border-transparent hover:text-foreground/70"
              }`}
            >
              {tab.toUpperCase()}
              {tab === "approvals" && (
                <span className="ml-1.5 bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 font-mono">
                  {approvals.filter((a) => a.urgent).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* KANBAN VIEW */}
        {activeView === "kanban" && (
          <div>
            {/* Top rules slider */}
            <div className="border border-border p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] tracking-widest font-semibold">RULES / ACTIONS / DECISION_MAKING</span>
                <div className="flex gap-0">
                  {(["conservative", "balanced", "autonomous"] as const).map((level) => (
                    <button
                      key={level}
                      className={`px-3 py-1.5 font-mono text-[10px] tracking-wider border transition-colors ${
                        agentPreferences.aggressiveness === level
                          ? "bg-foreground text-background border-foreground"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[9px] text-muted-foreground">AUTO_APPROVE_THRESHOLD</span>
                    <span className="font-mono text-[10px] font-bold">{agentPreferences.autoApproveThreshold}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border">
                    <div className="h-full bg-primary" style={{ width: `${agentPreferences.autoApproveThreshold}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-3 gap-4">
              {/* Active */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-primary animate-pulse-dot" />
                    <span className="font-mono text-[11px] tracking-widest font-semibold">ACTIVE</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{activeAgents.length}</span>
                </div>
                <div className="space-y-2">
                  {activeAgents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      active={agentStates[agent.id]}
                      expanded={expandedAgent === agent.id}
                      onToggle={() => toggleAgent(agent.id)}
                      onExpand={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Paused */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-border" />
                    <span className="font-mono text-[11px] tracking-widest font-semibold">PAUSED</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{pausedAgents.length}</span>
                </div>
                <div className="space-y-2">
                  {pausedAgents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      active={agentStates[agent.id]}
                      expanded={expandedAgent === agent.id}
                      onToggle={() => toggleAgent(agent.id)}
                      onExpand={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Templates */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] tracking-widest font-semibold">TEMPLATES</span>
                  <button className="h-6 w-6 border border-dashed border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {["EXIM Data Scraper", "Revenue Estimator", "Market Rate Scanner", "Compliance Monitor"].map((name) => (
                    <div key={name} className="border border-dashed border-border p-3 hover:border-foreground/20 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Plus className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-[11px]">{name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Workflow Canvas Section */}
            <div className="mt-8 border border-border">
              <div className="border-b border-border p-4">
                <span className="font-mono text-[11px] tracking-widest font-semibold">WORKFLOW_CANVAS</span>
                <span className="font-mono text-[10px] text-muted-foreground ml-3">
                  {expandedAgent ? agents.find(a => a.id === expandedAgent)?.name : "Select an agent to view pipeline"}
                </span>
              </div>

              {/* Canvas with grid background */}
              <div
                className="relative p-6 min-h-[200px] overflow-x-auto"
                style={{
                  backgroundImage: `radial-gradient(circle, hsl(var(--foreground) / 0.06) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              >
                {expandedAgent ? (
                  <div className="flex items-center gap-0">
                    {agents
                      .find((a) => a.id === expandedAgent)
                      ?.steps.map((step, i, arr) => (
                        <div key={step.id} className="flex items-center">
                          <div
                            className={`border p-4 min-w-[160px] bg-background ${
                              step.status === "connected"
                                ? "border-border"
                                : "border-primary border-dashed"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className={step.status === "connected" ? "text-primary" : "text-muted-foreground"}>
                                {toolIcons[step.icon] || <Zap className="h-3.5 w-3.5" />}
                              </span>
                              <span className="font-mono text-[11px] font-semibold">{step.tool}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mb-2">{step.name}</p>
                            <span
                              className={`font-mono text-[9px] tracking-wider inline-block px-1.5 py-0.5 border ${
                                step.status === "connected"
                                  ? "border-border"
                                  : "border-primary text-primary"
                              }`}
                            >
                              {step.status.toUpperCase()}
                            </span>
                          </div>
                          {i < arr.length - 1 && (
                            <div className="flex items-center shrink-0">
                              <div className="w-8 h-px bg-foreground/20" />
                              <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent border-l-foreground/20" />
                            </div>
                          )}
                        </div>
                      ))}
                    <button className="ml-4 h-12 w-12 border border-dashed border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors shrink-0 bg-background">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[160px]">
                    <p className="font-mono text-[11px] text-muted-foreground">
                      SELECT AN AGENT TO VIEW WORKFLOW PIPELINE
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* APPROVALS TAB */}
        {activeView === "approvals" && (
          <div className="space-y-3">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className={`border p-4 ${
                  approval.urgent
                    ? "border-l-2 border-l-primary border-t border-r border-b border-border"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                        {approval.agent}
                      </span>
                      {approval.urgent && (
                        <span className="font-mono text-[9px] tracking-wider text-primary border border-primary px-1.5 py-0.5">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium">{approval.action}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="font-mono text-lg font-bold">{approval.confidence}%</span>
                    <p className="font-mono text-[9px] text-muted-foreground">CONFIDENCE</p>
                  </div>
                </div>

                <div className="border border-border p-3 mb-3">
                  <span className="font-mono text-[9px] tracking-widest text-muted-foreground block mb-1">
                    CONTEXT
                  </span>
                  <p className="text-[11px] text-muted-foreground">{approval.context}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{approval.timestamp}</span>
                  <div className="flex items-center gap-1.5">
                    <button className="h-7 px-3 bg-primary text-primary-foreground font-mono text-[10px] tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                      <Check className="h-3 w-3" />
                      APPROVE
                    </button>
                    <button className="h-7 px-3 border border-border font-mono text-[10px] tracking-wider hover:border-foreground/30 transition-colors flex items-center gap-1.5">
                      <X className="h-3 w-3" />
                      REJECT
                    </button>
                    <button className="h-7 px-3 border border-border font-mono text-[10px] tracking-wider hover:border-foreground/30 transition-colors flex items-center gap-1.5">
                      <Edit3 className="h-3 w-3" />
                      MODIFY
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeView === "preferences" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Connected Apps */}
            <div>
              <h3 className="font-mono text-[11px] tracking-widest font-semibold mb-3">CONNECTED_TOOLS</h3>
              <div className="space-y-1.5">
                {connectedApps.map((app) => (
                  <div key={app.id} className="border border-border p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={app.status === "connected" ? "" : "text-muted-foreground"}>
                        {toolIcons[app.icon] || <Zap className="h-3.5 w-3.5" />}
                      </span>
                      <div>
                        <span className="font-mono text-xs font-semibold">{app.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {app.status === "connected" ? (
                            <>
                              {app.permissions.read && (
                                <span className="font-mono text-[8px] tracking-wider text-muted-foreground">READ</span>
                              )}
                              {app.permissions.write && (
                                <span className="font-mono text-[8px] tracking-wider text-muted-foreground">WRITE</span>
                              )}
                              {app.permissions.execute && (
                                <span className="font-mono text-[8px] tracking-wider text-muted-foreground">EXEC</span>
                              )}
                            </>
                          ) : (
                            <span className="font-mono text-[8px] tracking-wider text-primary">DISCONNECTED</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      className={`h-7 px-3 font-mono text-[10px] tracking-wider transition-colors flex items-center gap-1.5 ${
                        app.status === "connected"
                          ? "border border-border hover:border-primary hover:text-primary"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      <Power className="h-3 w-3" />
                      {app.status === "connected" ? "MANAGE" : "CONNECT"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h3 className="font-mono text-[11px] tracking-widest font-semibold mb-3">NOTIFICATIONS</h3>
              <div className="border border-border p-4">
                <div className="space-y-2.5">
                  {Object.entries(agentPreferences.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="font-mono text-xs">{key.toUpperCase()}</span>
                      <Switch checked={value} className="scale-75" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Agent Card Component ───
function AgentCard({
  agent,
  active,
  expanded,
  onToggle,
  onExpand,
}: {
  agent: (typeof agents)[0];
  active: boolean;
  expanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
}) {
  return (
    <div className={`border transition-colors ${expanded ? "border-foreground/20" : "border-border"}`}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <GripVertical className="h-3 w-3 text-muted-foreground cursor-grab" />
            <div
              className={`h-2 w-2 ${
                active ? "bg-primary animate-pulse-dot" : "bg-border"
              }`}
            />
            <span className="font-mono text-[11px] font-semibold">{agent.name}</span>
          </div>
          <Switch
            checked={active}
            onCheckedChange={onToggle}
            className="scale-[0.6]"
          />
        </div>
        <p className="text-[10px] text-muted-foreground mb-2 pl-7">{agent.description}</p>
        <div className="flex items-center justify-between pl-7">
          <span className="font-mono text-[9px] text-muted-foreground">{agent.lastRun}</span>
          <button
            onClick={onExpand}
            className="font-mono text-[9px] tracking-wider text-primary hover:underline"
          >
            {expanded ? "HIDE_PIPELINE" : "VIEW_PIPELINE"}
          </button>
        </div>
      </div>
    </div>
  );
}
