import { useEffect, useState, useMemo } from "react";
import { commandSections } from "@/lib/mock-data";
import {
  Search,
  Brain,
  Mail,
  BarChart3,
  FolderKanban,
  Bot,
  MessageSquare,
  Globe,
  Calendar,
  CheckSquare,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="h-3.5 w-3.5" />,
  Brain: <Brain className="h-3.5 w-3.5" />,
  Mail: <Mail className="h-3.5 w-3.5" />,
  BarChart3: <BarChart3 className="h-3.5 w-3.5" />,
  FolderKanban: <FolderKanban className="h-3.5 w-3.5" />,
  Bot: <Bot className="h-3.5 w-3.5" />,
  MessageSquare: <MessageSquare className="h-3.5 w-3.5" />,
  Globe: <Globe className="h-3.5 w-3.5" />,
  Calendar: <Calendar className="h-3.5 w-3.5" />,
  CheckSquare: <CheckSquare className="h-3.5 w-3.5" />,
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedSection(0);
        setSelectedItem(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredSections = useMemo(() => {
    if (!query) return commandSections;
    return commandSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            section.label.toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [query]);

  // Flat list for keyboard navigation
  const flatItems = useMemo(() => {
    return filteredSections.flatMap((s, si) =>
      s.items.map((item, ii) => ({ ...item, sectionIndex: si, itemIndex: ii, sectionLabel: s.label }))
    );
  }, [filteredSections]);

  const globalIndex = useMemo(() => {
    let idx = 0;
    for (let s = 0; s < selectedSection; s++) {
      idx += (filteredSections[s]?.items.length || 0);
    }
    return idx + selectedItem;
  }, [selectedSection, selectedItem, filteredSections]);

  useEffect(() => {
    setSelectedSection(0);
    setSelectedItem(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newGlobal = Math.min(globalIndex + 1, flatItems.length - 1);
      const item = flatItems[newGlobal];
      if (item) {
        setSelectedSection(item.sectionIndex);
        setSelectedItem(item.itemIndex);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newGlobal = Math.max(globalIndex - 1, 0);
      const item = flatItems[newGlobal];
      if (item) {
        setSelectedSection(item.sectionIndex);
        setSelectedItem(item.itemIndex);
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const section = filteredSections[selectedSection];
      if (section?.layout === "horizontal") {
        setSelectedItem((i) => Math.min(i + 1, section.items.length - 1));
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const section = filteredSections[selectedSection];
      if (section?.layout === "horizontal") {
        setSelectedItem((i) => Math.max(i - 1, 0));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div
        className="relative mx-auto mt-[12vh] w-full max-w-[600px] border border-border bg-background shadow-[0_24px_80px_-12px_hsl(var(--foreground)/0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, projects, agents..."
            className="flex-1 bg-transparent py-3.5 px-3 text-sm font-mono outline-none placeholder:text-muted-foreground"
          />
          <kbd className="font-mono text-[10px] tracking-wider text-muted-foreground border border-border px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Sections */}
        <div className="max-h-[420px] overflow-y-auto">
          {filteredSections.map((section, sIdx) => (
            <div key={section.id} className="border-b border-border last:border-b-0">
              <div className="px-4 py-2 font-mono text-[9px] tracking-widest text-muted-foreground">
                {section.label}
              </div>

              {section.layout === "horizontal" ? (
                /* Horizontal scrollable cards */
                <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
                  {section.items.map((item, iIdx) => {
                    const isSelected = selectedSection === sIdx && selectedItem === iIdx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setOpen(false)}
                        className={`shrink-0 flex flex-col items-start gap-1.5 px-3 py-2.5 border min-w-[120px] transition-colors ${
                          isSelected
                            ? "bg-foreground text-background border-foreground"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <span className={isSelected ? "text-background" : "text-muted-foreground"}>
                          {iconMap[item.icon] || <Search className="h-3.5 w-3.5" />}
                        </span>
                        <span className="text-[11px] font-mono font-medium">{item.label}</span>
                        {item.shortcut && (
                          <kbd className={`font-mono text-[9px] ${isSelected ? "text-background/60" : "text-muted-foreground"}`}>
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Vertical list */
                <div>
                  {section.items.map((item, iIdx) => {
                    const isSelected = selectedSection === sIdx && selectedItem === iIdx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setOpen(false)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                          isSelected
                            ? "bg-foreground text-background"
                            : "hover:bg-accent/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={isSelected ? "text-background" : "text-muted-foreground"}>
                            {iconMap[item.icon] || <Search className="h-3.5 w-3.5" />}
                          </span>
                          <span className="text-xs font-mono">{item.label}</span>
                        </div>
                        {item.shortcut && (
                          <kbd
                            className={`font-mono text-[10px] px-1.5 py-0.5 ${
                              isSelected
                                ? "text-background/60"
                                : "text-muted-foreground border border-border"
                            }`}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {filteredSections.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-xs text-muted-foreground">NO_RESULTS</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] text-muted-foreground">↑↓ NAVIGATE</span>
            <span className="font-mono text-[9px] text-muted-foreground">←→ SCROLL</span>
            <span className="font-mono text-[9px] text-muted-foreground">↵ SELECT</span>
          </div>
          <span className="font-mono text-[9px] text-muted-foreground">⌘K TO TOGGLE</span>
        </div>
      </div>
    </div>
  );
}
