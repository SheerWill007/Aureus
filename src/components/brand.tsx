import { ReactNode } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Mark + wordmark                                                    */
/* ------------------------------------------------------------------ */

export function KiwiMark({ className = "h-4 w-4" }: { className?: string }) {
  // Two slanted blades — reads as "//" and as a split kiwi bolt.
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M9.5 2h5L8 22H3z" fill="currentColor" />
      <path d="M17 2h4l-6.5 20h-4z" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link
      to={to}
      className={cn("group inline-flex items-center gap-1.5 text-white", className)}
      aria-label="Kiwi Wallet home"
    >
      <KiwiMark className="h-4 w-4 text-kiwi transition-transform duration-300 group-hover:-skew-x-12" />
      <span className="font-display text-[17px] font-bold italic tracking-tight">kiwi</span>
      <span className="font-display text-[17px] font-light tracking-tight text-white/80">wallet</span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Top bar                                                            */
/* ------------------------------------------------------------------ */

type NavLink = { label: string; href: string };

export function TopBar({
  links = [],
  right,
  className,
}: {
  links?: NavLink[];
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative z-40 grid grid-cols-[1fr_auto_1fr] items-center px-4 py-5 sm:px-8",
        className
      )}
    >
      <nav className="hidden items-center gap-6 sm:flex">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-kiwi"
          >
            <span className="text-white/30">// </span>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="col-start-1 sm:col-start-2 justify-self-start sm:justify-self-center">
        <Logo />
      </div>
      <div className="col-start-3 flex items-center justify-end gap-2">{right}</div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagram nodes                                                      */
/* ------------------------------------------------------------------ */

export function BoltNode({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-black text-white",
        className
      )}
    >
      <span className="absolute inset-[-6px] rounded-full border border-white/10" />
      <KiwiMark className="h-4 w-4" />
    </div>
  );
}

export function NumberNode({ n, className }: { n: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-white/40 bg-black font-mono text-[11px] text-white/60",
        className
      )}
    >
      <span className="absolute inset-[5px] rounded-full border border-white/15" />
      {n}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hatched header strip — "////////// ■ OUR MISSION //////////"       */
/* ------------------------------------------------------------------ */

export function HatchStrip({
  label,
  className,
  inverted = true,
}: {
  label: string;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-7 items-center justify-center overflow-hidden",
        inverted ? "bg-white text-black" : "border-b border-white/15 bg-black text-white/30",
        className
      )}
    >
      <div className="hatch absolute inset-0 opacity-70" />
      <span
        className={cn(
          "relative z-10 flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[0.25em]",
          inverted ? "bg-white" : "bg-black text-white"
        )}
      >
        <span className={cn("h-1.5 w-1.5", inverted ? "bg-black" : "bg-kiwi")} />
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal shell for the hand-rolled framer-motion modals               */
/* ------------------------------------------------------------------ */

export function ModalShell({
  title,
  onClose,
  children,
  className,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative max-h-[90vh] w-full max-w-md overflow-y-auto border border-white/25 bg-black font-mono shadow-[0_30px_80px_-20px_rgba(200,240,60,0.15)]",
          className
        )}
      >
        <div className="flex items-stretch border-b border-white/15">
          <div className="flex-1">
            <HatchStrip label={title} className="h-9" />
          </div>
          <button
            onClick={onClose}
            className="flex w-9 items-center justify-center border-l border-white/15 text-white/60 transition-colors hover:bg-white hover:text-black"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* Small "FIELD LABEL" used in forms/modals */
export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[10px] uppercase tracking-[0.25em] text-white/45"
    >
      {children}
    </label>
  );
}
