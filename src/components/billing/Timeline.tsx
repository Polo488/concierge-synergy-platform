import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock, Circle, XCircle } from "lucide-react";
import { useSession, type StepDef } from "@/hooks/useFacturationSession";
import { cn } from "@/lib/utils";
import type { StepState } from "@/mocks/facturation";

const ICON: Record<StepState, typeof CheckCircle2> = {
  done: CheckCircle2,
  action: AlertCircle,
  waiting: Clock,
  pending: Circle,
  blocked: XCircle,
};

const COLOR: Record<StepState, string> = {
  done: "text-[#4ADE80]",
  action: "text-[#FF5C1A]",
  waiting: "text-white/40",
  pending: "text-white/25",
  blocked: "text-[#F87171]",
};

const BG: Record<StepState, string> = {
  done: "bg-[#4ADE80]/10 ring-[#4ADE80]/20",
  action: "bg-[#FF5C1A]/10 ring-[#FF5C1A]/25",
  waiting: "bg-white/[0.04] ring-white/10",
  pending: "bg-white/[0.02] ring-white/5",
  blocked: "bg-[#F87171]/10 ring-[#F87171]/25",
};

function StepRow({ step, active, onClick }: { step: StepDef; active: boolean; onClick: () => void }) {
  const Icon = ICON[step.state];
  const disabled = step.state === "pending" && step.number > 1;
  const clickable = !disabled || active;

  return (
    <button
      disabled={disabled && !active}
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-[14px] px-3 py-3 transition-all duration-200",
        "flex items-center gap-3",
        active ? "bg-white/[0.04]" : "hover:bg-white/[0.02]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {active && (
        <motion.span
          layoutId="step-active"
          className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[#FF5C1A]"
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset", BG[step.state])}>
        {step.state === "done" || step.state === "blocked" || step.state === "action" ? (
          <Icon className={cn("h-4 w-4", COLOR[step.state])} strokeWidth={1.8} />
        ) : (
          <span className={cn("text-[11px] font-medium tabular-nums", COLOR[step.state])}>{step.number}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[13.5px] font-medium text-white truncate">{step.title}</p>
          {step.counter !== undefined && step.counter > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold bg-[#FF5C1A]/20 text-[#FF5C1A]">
              {step.counter}
            </span>
          )}
        </div>
        <p className="text-[11.5px] text-white/45 truncate mt-0.5">{step.subtitle}</p>
      </div>
    </button>
  );
}

export function Timeline() {
  const { steps, activeStep, setActiveStep } = useSession();
  return (
    <nav className="flex flex-col gap-1">
      {steps.map(s => (
        <StepRow
          key={s.key}
          step={s}
          active={activeStep === s.key}
          onClick={() => setActiveStep(s.key)}
        />
      ))}
    </nav>
  );
}
