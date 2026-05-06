"use client";

import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
  triggerOrder: () => string[];
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* must be used inside <Tabs />");
  return ctx;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlledValue ?? internal;
  const setValue = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };
  const triggers = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const order = useRef<string[]>([]);
  const baseId = useId();

  const ctx: TabsContextValue = {
    value,
    setValue,
    baseId,
    registerTrigger: (v, el) => {
      triggers.current.set(v, el);
      if (!order.current.includes(v)) order.current.push(v);
    },
    triggerOrder: () => order.current,
  };

  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function TabsList({ children, className, ariaLabel }: TabsListProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex flex-wrap items-center gap-1 border-b border-foreground/10 print:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: active, setValue, baseId, registerTrigger, triggerOrder } = useTabs();
  const isActive = active === value;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const order = triggerOrder();
    const idx = order.indexOf(value);
    if (idx === -1) return;
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % order.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + order.length) % order.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = order.length - 1;
    else return;
    e.preventDefault();
    setValue(order[next]);
  };

  return (
    <button
      ref={(el) => registerTrigger(value, el)}
      role="tab"
      type="button"
      id={`${baseId}-trigger-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setValue(value)}
      onKeyDown={onKeyDown}
      className={cn(
        "relative px-4 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors duration-200 cursor-pointer",
        "outline-none focus-visible:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
        className,
      )}
    >
      {children}
      {isActive && (
        <span
          aria-hidden
          className="absolute -bottom-px left-2 right-2 h-px"
          style={{ background: "var(--color-accent)" }}
        />
      )}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
  printHeading?: string;
}

export function TabsContent({ value, children, className, printHeading }: TabsContentProps) {
  const { value: active, baseId } = useTabs();
  const isActive = active === value;
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-trigger-${value}`}
      hidden={!isActive}
      data-tab-panel={value}
      className={cn(
        "pt-6 print:!block print:pt-4",
        className,
      )}
    >
      {printHeading && (
        <h3 className="hidden print:mb-2 print:block print:text-sm print:font-bold print:uppercase print:tracking-widest">
          {printHeading}
        </h3>
      )}
      {children}
    </div>
  );
}
