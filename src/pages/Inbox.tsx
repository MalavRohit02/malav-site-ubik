import { useState } from "react";
import { inboxMessages, inboxStats, informationalSignals } from "@/lib/mock-data";
import type { InboxChannel } from "@/lib/mock-data";
import {
  Mail,
  MessageSquare,
  Phone,
  Send,
  Bot,
  Reply,
  Forward,
  Eye,
  Zap,
} from "lucide-react";

type SmartCategory = "ALL_SIGNALS" | "ACTION_REQUIRED" | "UNREAD" | "INFORMATIONAL";

const channelIcon: Record<InboxChannel, React.ReactNode> = {
  email: <Mail className="h-3 w-3" />,
  slack: <MessageSquare className="h-3 w-3" />,
  whatsapp: <Phone className="h-3 w-3" />,
  call: <Phone className="h-3 w-3" />,
  system: <Zap className="h-3 w-3" />,
};

const channelLabel: Record<InboxChannel, string> = {
  email: "EMAIL",
  slack: "SLACK",
  whatsapp: "WHATSAPP",
  call: "CALL",
  system: "SYSTEM",
};

const priorityStyles: Record<string, string> = {
  critical: "border-l-2 border-l-primary",
  high: "border-l-2 border-l-foreground",
  medium: "",
  low: "",
};

export default function Inbox() {
  const [category, setCategory] = useState<SmartCategory>("ALL_SIGNALS");
  const [expandedThread, setExpandedThread] = useState<number | null>(null);

  const filtered = inboxMessages.filter((m) => {
    if (category === "ACTION_REQUIRED") return m.category === "ACTION_REQUIRED";
    if (category === "UNREAD") return m.unread;
    if (category === "INFORMATIONAL") return m.category === "INFORMATIONAL";
    return true;
  });

  // Split into columns for smart inbox
  const unreadMessages = filtered.filter((m) => m.unread && m.category !== "ACTION_REQUIRED");
  const actionMessages = filtered.filter((m) => m.category === "ACTION_REQUIRED");
  const infoMessages = filtered.filter((m) => m.category === "INFORMATIONAL");

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-[1200px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight">
              MY INBOX<span className="text-primary">.</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-mono text-[11px] tracking-wider">
                <span className="inline-block w-2 h-2 bg-primary mr-1.5" />
                {inboxStats.critical} CRITICAL
              </span>
              <span className="font-mono text-[11px] tracking-wider">
                <span className="inline-block w-2 h-2 bg-foreground mr-1.5" />
                {inboxStats.actionRequired} ACTION
              </span>
              <span className="font-mono text-[11px] tracking-wider">
                <span className="inline-block w-2 h-2 bg-foreground mr-1.5" />
                {inboxStats.updates} UPDATES
              </span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-0 border border-border mb-6">
          <div className="p-4 border-r border-border">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">INBOUND_QUEUE</span>
            <p className="font-mono text-2xl font-bold mt-1">{inboxStats.inboundQueue}</p>
            <span className="text-[11px] text-muted-foreground">UNREAD E-MAILS</span>
          </div>
          <div className="p-4 border-r border-border bg-primary text-primary-foreground">
            <span className="font-mono text-[10px] tracking-wider text-primary-foreground/70">SYSTEM_PRIORITY</span>
            <p className="font-mono text-2xl font-bold mt-1">{inboxStats.critical}</p>
            <span className="text-[11px] text-primary-foreground/70">CRITICAL TASKS</span>
          </div>
          <div className="p-4 border-r border-border">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">USER_TASKS</span>
            <p className="font-mono text-2xl font-bold mt-1">{inboxStats.actionRequired}</p>
            <span className="text-[11px] text-muted-foreground">ACTION ITEMS</span>
          </div>
          <div className="p-4">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">EFFICIENCY_METRIC</span>
            <p className="font-mono text-2xl font-bold mt-1">{inboxStats.timeSaved}</p>
            <span className="text-[11px] text-muted-foreground">TIME SAVED</span>
          </div>
        </div>

        {/* Smart Inbox heading + filters */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-lg font-bold tracking-tight">
            SMART_INBOX
          </h2>
          <div className="flex items-center gap-0">
            {(["ALL_SIGNALS", "ACTION_REQUIRED", "UNREAD", "INFORMATIONAL"] as SmartCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`font-mono text-[10px] tracking-widest px-3 py-2 border transition-colors ${
                  category === cat
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-column smart inbox when ALL_SIGNALS */}
        {category === "ALL_SIGNALS" ? (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Unread Messages */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px] tracking-widest font-semibold">UNREAD_MESSAGES</span>
              </div>
              <div className="space-y-2">
                {[...actionMessages.filter(m => m.unread), ...unreadMessages].slice(0, 3).map((msg) => (
                  <MessageCard
                    key={msg.id}
                    msg={msg}
                    expanded={expandedThread === msg.id}
                    onToggle={() => setExpandedThread(expandedThread === msg.id ? null : msg.id)}
                  />
                ))}
              </div>
            </div>

            {/* Action Required */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px] tracking-widest font-semibold">ACTION_REQUIRED</span>
              </div>
              <div className="space-y-2">
                {actionMessages.map((msg) => (
                  <MessageCard
                    key={msg.id}
                    msg={msg}
                    expanded={expandedThread === msg.id}
                    onToggle={() => setExpandedThread(expandedThread === msg.id ? null : msg.id)}
                    showActions
                  />
                ))}
              </div>
            </div>

            {/* Good to Read */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px] tracking-widest font-semibold">GOOD_TO_READ</span>
              </div>
              <div className="space-y-2">
                {infoMessages.map((msg) => (
                  <MessageCard
                    key={msg.id}
                    msg={msg}
                    expanded={expandedThread === msg.id}
                    onToggle={() => setExpandedThread(expandedThread === msg.id ? null : msg.id)}
                    dashed
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Filtered list view */
          <div className="space-y-2 mb-8">
            {filtered.map((msg) => (
              <MessageCard
                key={msg.id}
                msg={msg}
                expanded={expandedThread === msg.id}
                onToggle={() => setExpandedThread(expandedThread === msg.id ? null : msg.id)}
                showActions={msg.category === "ACTION_REQUIRED"}
              />
            ))}
          </div>
        )}

        {/* Informational Signals */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[11px] tracking-widest font-semibold">INFORMATIONAL_SIGNALS</span>
          </div>
          <div className="space-y-3">
            {informationalSignals.map((signal) => (
              <div key={signal.id} className="border border-border p-5 flex items-start justify-between gap-6">
                <div className="flex-1">
                  <span className="font-mono text-[9px] tracking-wider bg-primary text-primary-foreground px-2 py-0.5 inline-block mb-3">
                    {signal.tag}
                  </span>
                  <h3 className="text-base font-semibold mb-1">
                    {signal.from}: {signal.subject}
                  </h3>
                  <p className="text-[12px] text-muted-foreground">{signal.summary}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="space-y-1 mb-3">
                    <p className="font-mono text-[10px] text-muted-foreground">METRIC_IMPACT: {signal.impact}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">TIMESTAMP: {signal.timestamp}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">SOURCE: {signal.source}</p>
                  </div>
                  <button className="font-mono text-[10px] tracking-wider bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors">
                    {signal.impact === "HIGH" ? "INITIALIZE_REVIEW" : "PENDING_REVIEW"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Message Card Component ───
function MessageCard({
  msg,
  expanded,
  onToggle,
  showActions,
  dashed,
}: {
  msg: (typeof inboxMessages)[0];
  expanded: boolean;
  onToggle: () => void;
  showActions?: boolean;
  dashed?: boolean;
}) {
  return (
    <div
      className={`border transition-colors ${priorityStyles[msg.priority] || ""} ${
        dashed ? "border-dashed border-border" : "border-border"
      } ${expanded ? "border-foreground/20" : ""}`}
    >
      <button onClick={onToggle} className="w-full text-left p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] tracking-wider bg-foreground/10 px-1.5 py-0.5 flex items-center gap-1">
              {channelIcon[msg.channel]}
              {channelLabel[msg.channel]}
            </span>
            {msg.priority === "critical" && (
              <span className="font-mono text-[9px] tracking-wider bg-primary text-primary-foreground px-1.5 py-0.5">
                CRITICAL
              </span>
            )}
            {msg.priority === "high" && (
              <span className="font-mono text-[9px] tracking-wider border border-foreground px-1.5 py-0.5">
                HIGH
              </span>
            )}
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">{msg.time}</span>
        </div>

        <p className={`text-sm font-semibold mb-1 ${msg.unread ? "" : "text-muted-foreground"}`}>
          {msg.from}
        </p>
        <p className="text-xs mb-1">{msg.subject}</p>
        <p className="text-[11px] text-muted-foreground line-clamp-2">{msg.summary}</p>

        {msg.labels.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {msg.labels.map((label) => (
              <span
                key={label}
                className="font-mono text-[8px] tracking-wider text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </button>

      {/* Actions row */}
      {showActions && !expanded && (
        <div className="px-4 pb-3 flex items-center gap-1.5">
          {msg.agentSuggestion ? (
            <>
              <button className="h-7 px-3 bg-primary text-primary-foreground font-mono text-[10px] tracking-wider hover:bg-primary/90 transition-colors">
                APPROVE
              </button>
              <button className="h-7 px-3 border border-border font-mono text-[10px] tracking-wider hover:border-foreground/30 transition-colors">
                REJECT
              </button>
            </>
          ) : (
            <span className="font-mono text-[9px] tracking-wider text-primary">
              ACCESS_PAYMENT
            </span>
          )}
        </div>
      )}

      {/* Expanded view */}
      {expanded && (
        <div className="border-t border-border p-4">
          <p className="text-xs mb-4">{msg.summary}</p>

          {msg.agentSuggestion && (
            <div className="border border-primary/30 p-3 mb-4 bg-primary/5">
              <div className="flex items-center gap-2 mb-1.5">
                <Bot className="h-3 w-3 text-primary" />
                <span className="font-mono text-[9px] tracking-widest text-primary font-semibold">
                  AGENT_SUGGESTION
                </span>
              </div>
              <p className="text-[11px]">{msg.agentSuggestion}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button className="h-7 px-3 bg-primary text-primary-foreground font-mono text-[10px] tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              <Reply className="h-3 w-3" />
              QUICK REPLY
            </button>
            <button className="h-7 px-3 border border-border font-mono text-[10px] tracking-wider hover:border-foreground/30 transition-colors flex items-center gap-1.5">
              <Forward className="h-3 w-3" />
              DELEGATE
            </button>
            <button className="h-7 px-3 border border-border font-mono text-[10px] tracking-wider hover:border-foreground/30 transition-colors flex items-center gap-1.5">
              <Eye className="h-3 w-3" />
              VIEW_LOGS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
