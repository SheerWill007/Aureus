import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Droplets,
  GitBranch,
  KeyRound,
  QrCode,
  Radio,
  Send,
} from "lucide-react";
import { BoltNode, HatchStrip, Logo, NumberNode, TopBar } from "./brand";
import Globe from "./landing/Globe";
import { At, Connector, GridFloor, IsoBolt, IsoStack, Marquee, Reveal, Scramble } from "./landing/graphics";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  { id: "hero", n: "01" },
  { id: "stack", n: "02" },
  { id: "features", n: "03" },
  { id: "use-cases", n: "04" },
  { id: "mission", n: "05" },
  { id: "start", n: "06" },
];

const TICKER = [
  "Solana devnet airdrops live",
  "Sepolia testnet sends supported",
  "One seed — Ethereum + Solana",
  "Keys never leave your device",
  "v3.0 multi-account release",
];

const PILLARS = [
  "Non-custodial",
  "BIP-39 seed phrase",
  "HD multi-account",
  "Ethereum + Solana",
  "Testnet ready",
  "Open source",
];

const FEATURES_LEFT = [
  { icon: KeyRound, title: "Seed Generation", body: "A 12-word BIP-39 recovery phrase generated locally in your browser." },
  { icon: GitBranch, title: "HD Accounts", body: "Derive as many Ethereum and Solana accounts as you need from one phrase." },
  { icon: Radio, title: "Network Switching", body: "Hop between mainnets and testnets from a single selector." },
];

const FEATURES_RIGHT = [
  { icon: Send, title: "Send", body: "Sign and broadcast ETH and SOL transfers straight from the dashboard." },
  { icon: QrCode, title: "Receive", body: "Share your address as a QR code or through the native share sheet." },
  { icon: Droplets, title: "Devnet Airdrop", body: "Request test SOL from the faucet without leaving the app." },
];

type Tag = "eth" | "sol" | "sec";
const FILTERS: { id: "all" | Tag; label: string }[] = [
  { id: "all", label: "All" },
  { id: "eth", label: "Ethereum" },
  { id: "sol", label: "Solana" },
  { id: "sec", label: "Security" },
];

const USE_CASES: { title: string; body: string; tags: Tag[] }[] = [
  { title: "Create Wallet", body: "Generate a fresh 12-word recovery phrase and derive your first accounts in seconds.", tags: ["eth", "sol", "sec"] },
  { title: "Ethereum Accounts", body: "Accounts derived on m/44'/60'/n'/0/0 and wrapped with ethers.js.", tags: ["eth"] },
  { title: "Solana Accounts", body: "Ed25519 keys derived on m/44'/501'/n'/0' — the standard Solana path.", tags: ["sol"] },
  { title: "Send ETH", body: "Sign and broadcast transfers on the Sepolia testnet from a single form.", tags: ["eth"] },
  { title: "Send SOL", body: "Build, sign and submit Solana transfers on Devnet in one step.", tags: ["sol"] },
  { title: "Devnet Airdrop", body: "Request 0.5 – 2.5 test SOL from the faucet without leaving the dashboard.", tags: ["sol"] },
  { title: "QR Receive", body: "Share your public address as a scannable QR code, or copy it in one tap.", tags: ["eth", "sol"] },
  { title: "Network Switching", body: "Ethereum, Sepolia, Polygon, Arbitrum, Optimism and Base in one selector.", tags: ["eth"] },
  { title: "Key Export", body: "Reveal and copy private keys on demand — hidden behind a toggle by default.", tags: ["sec"] },
  { title: "Activity Feed", body: "Review sends and receives with explorer links to Etherscan and Solscan.", tags: ["eth", "sol"] },
  { title: "Local-Only Keys", body: "Secrets are held in memory on your device and never sent to a server.", tags: ["sec"] },
  { title: "Dual-Chain Setup", body: "Create an Ethereum and a Solana wallet from the same phrase at once.", tags: ["eth", "sol"] },
];

const MISSION = [
  "Handing your keys to a custodian carries the same inherent risks as handing your money to a bank.",
  "Frozen withdrawals, de-platforming, opaque fees, data harvesting. The opposite of what crypto was supposed to be.",
  "Crypto was meant to be open, permissionless, borderless and free of centralized gatekeepers.",
  "Yet self-custody is still too hard. Seed phrases, derivation paths and chain-specific tooling keep most people on exchanges.",
  "Kiwi has a real chance to change that. To compete, self-custody has to feel as good as the apps people already use.",
  "Simplicity is critical. Our mission is to bring that simplicity to Web3 — and keep your keys yours.",
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage(): JSX.Element {
  const navigate = useNavigate();
  const [active, setActive] = useState("hero");
  const [filter, setFilter] = useState<"all" | Tag>("all");

  const goSetup = () => navigate("/setupWallet/");

  // Highlight the index entry for the last section whose top has passed mid-viewport
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let current = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < mid) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cards = useMemo(
    () => (filter === "all" ? USE_CASES : USE_CASES.filter((c) => c.tags.includes(filter))),
    [filter]
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <TopBar
        links={[
          { label: "Features", href: "#features" },
          { label: "Use cases", href: "#use-cases" },
          { label: "Mission", href: "#mission" },
        ]}
        right={
          <>
            <button onClick={goSetup} className="btn-bracket">
              .open [wallet]
            </button>
            <button onClick={goSetup} className="btn-bracket hidden sm:inline-flex">
              .import [seed]
            </button>
          </>
        }
      />

      {/* Section index rail */}
      <nav aria-label="Sections" className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
        {SECTIONS.map(({ id, n }) => (
          <a
            key={id}
            href={`#${id}`}
            className={cn(
              "flex items-center gap-2 text-[10px] transition-colors",
              active === id ? "text-white" : "text-white/25 hover:text-white/60"
            )}
          >
            <span className={cn("h-px bg-white transition-all", active === id ? "w-4" : "w-0")} />
            {n}
          </a>
        ))}
      </nav>

      <main>
        {/* ============================ 01 HERO ============================ */}
        <section
          id="hero"
          className="relative mx-auto grid max-w-6xl items-center gap-6 px-6 pt-6 sm:px-10 lg:min-h-[560px] lg:grid-cols-[1fr_1.1fr]"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 pt-6 lg:pt-0"
          >
            <p className="mb-3 text-[11px] text-white/40">01</p>
            <h1 className="display text-[2.4rem] sm:text-5xl">
              Non-custodial
              <br />
              multi-chain wallet
            </h1>
            <p className="mt-5 max-w-sm text-[12px] leading-relaxed text-white/60">
              Kiwi is a self-custody wallet for Ethereum and Solana. Generate a seed phrase, derive accounts, then send,
              receive and airdrop on testnets — your keys never leave your device.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={goSetup} className="btn-line min-w-[150px]">
                Create wallet
              </button>
              <button onClick={goSetup} className="btn-line min-w-[150px]">
                Import wallet
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="relative -mx-6 sm:mx-0"
          >
            <Globe className="mx-auto w-full max-w-[540px]" />
          </motion.div>
        </section>

        <Connector points="50,0 50,100" height={110}>
          <At x={50} y={62}>
            <BoltNode />
          </At>
        </Connector>

        <Marquee items={TICKER} />

        <Connector points="50,0 50,100" height={70} />

        {/* ============================ 02 STACK ============================ */}
        <section id="stack" className="mx-auto grid max-w-6xl items-center gap-10 px-6 sm:px-10 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <IsoStack className="mx-auto w-full max-w-[620px]" />
            <p className="mt-2 text-center text-[11px] uppercase tracking-[0.2em] text-white/70">
              <Scramble text="/: modern web3 wallet :/" />
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mb-3 text-[11px] text-white/40">02</p>
            <h2 className="display text-3xl sm:text-4xl">
              Giving your keys
              <br />
              an edge
            </h2>
            <ul className="mt-6 space-y-2.5 border-l border-white/30 pl-4">
              {PILLARS.map((p) => (
                <li key={p} className="relative flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/85">
                  <span className="absolute -left-[19px] h-px w-2.5 bg-white/40" />
                  <span className="text-kiwi">⫽</span>
                  <Scramble text={p} />
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <Connector points="64,0 64,40 50,72 50,100" height={190}>
          <At x={50} y={72}>
            <NumberNode n="03" />
          </At>
        </Connector>

        {/* ============================ 03 FEATURES ============================ */}
        <section id="features" className="relative px-6 sm:px-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="display text-3xl sm:text-4xl">Supercharge your self-custody</h2>
            <p className="mx-auto mt-4 max-w-md text-[11px] leading-relaxed text-white/55">
              Kiwi is an open-source wallet for holding, moving and testing assets across Ethereum and Solana — with no
              sign-ups, no custody and no tracking.
            </p>
          </Reveal>

          <div className="relative mx-auto mt-10 grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.3fr_1fr]">
            <GridFloor className="top-[45%] hidden h-[60%] lg:block" />
            <div className="relative z-10 space-y-10 lg:order-1">
              {FEATURES_LEFT.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.08}>
                  <Feature {...f} align="left" />
                </Reveal>
              ))}
            </div>
            <div className="relative z-10 lg:order-2">
              <IsoBolt className="mx-auto w-full max-w-[460px]" />
            </div>
            <div className="relative z-10 space-y-10 lg:order-3">
              {FEATURES_RIGHT.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.08}>
                  <Feature {...f} align="right" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Connector points="50,0 50,35 22,70 22,100" height={170}>
          <At x={22} y={84}>
            <NumberNode n="04" />
          </At>
        </Connector>

        {/* ============================ 04 USE CASES ============================ */}
        <section id="use-cases" className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <h2 className="display text-3xl sm:text-[2.6rem]">
                Don&apos;t just hold
                <br />
                assets, use them.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-md text-[11px] leading-relaxed text-white/60">
                Builders, testers and everyday users can create wallets, derive accounts and move value on Ethereum and
                Solana without trusting a third party. Spin up a wallet on testnet, fund it from the faucet and ship
                faster — then take the same phrase to mainnet.
              </p>
              <button onClick={goSetup} className="btn-line mt-6 tracking-[0.35em]">
                Get started ( free )
              </button>
            </Reveal>
          </div>

          {/* filter tabs */}
          <div role="tablist" aria-label="Filter use cases" className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-3 border-t border-white/20 pt-5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "relative pb-1.5 text-[10px] uppercase tracking-[0.4em] transition-colors",
                  filter === f.id ? "text-white" : "text-white/35 hover:text-white/70"
                )}
              >
                {f.label}
                {filter === f.id && (
                  <motion.span layoutId="filter-underline" className="absolute inset-x-0 -bottom-px h-px bg-kiwi" />
                )}
              </button>
            ))}
          </div>

          <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {cards.map((c) => (
                <motion.button
                  layout
                  key={c.title}
                  onClick={goSetup}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="group flex min-h-[150px] flex-col border border-white/60 bg-black text-left transition-colors hover:border-kiwi"
                >
                  <span className="m-1.5 bg-white px-2 py-1 text-[10px] font-medium text-black transition-colors group-hover:bg-kiwi">
                    {c.title}
                  </span>
                  <span className="flex-1 px-3 pb-2 pt-1 text-[10.5px] leading-relaxed text-white/65">{c.body}</span>
                  <span className="flex items-center justify-between px-3 pb-2.5">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                      {c.tags.map((t) => FILTERS.find((f) => f.id === t)?.label).join(" · ")}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-kiwi" />
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <Connector points="22,0 22,35 50,70 50,100" height={170}>
          <At x={50} y={78}>
            <NumberNode n="05" />
          </At>
        </Connector>

        {/* ============================ 05 MISSION ============================ */}
        <section id="mission" className="relative overflow-hidden px-6 pb-4 sm:px-10">
          <GridFloor className="top-0 h-[420px] opacity-70" />
          <Reveal className="relative z-10 mx-auto max-w-xl text-center">
            <h2 className="display text-3xl sm:text-4xl">
              Bringing bank-grade UX
              <br />
              to self-custody
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="relative z-10 mx-auto mt-10 max-w-3xl border border-white/50 bg-black">
            <HatchStrip label="Our mission" />
            <div className="space-y-5 px-6 py-10 text-center text-[11px] leading-relaxed text-white/60 sm:px-16">
              {MISSION.map((m) => (
                <p key={m}>{m}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <Connector points="50,0 50,100" height={120}>
          <At x={50} y={55}>
            <BoltNode />
          </At>
        </Connector>

        {/* ============================ 06 START ============================ */}
        <section id="start" className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal className="text-center">
            <h2 className="display text-3xl sm:text-4xl">Want to start with Kiwi?</h2>
            <p className="mt-4 text-[11px] text-white/55">Create a brand-new wallet, or bring an existing one with you.</p>
          </Reveal>

          <Connector points={["50,0 50,45 25,45 25,100", "50,45 75,45 75,100"]} height={110} className="hidden sm:block" />

          {/* no column gap: column centres sit exactly on the 25% / 75% connector drops */}
          <div className="mt-10 grid gap-14 sm:mt-0 sm:grid-cols-2 sm:gap-0">
            <StartCard
              title="New users"
              body="Generate a recovery phrase and get an Ethereum account, a Solana account, or both."
              cta="Create wallet"
              onClick={goSetup}
            />
            <StartCard
              title="Existing users"
              body="Already have a 12-word phrase? Bring it to Kiwi and pick up where you left off."
              cta="Import wallet"
              onClick={goSetup}
            />
          </div>
        </section>
      </main>

      {/* ============================ FOOTER ============================ */}
      <footer className="mt-28 border-t border-white/15">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 text-[10px] text-white/35">© {new Date().getFullYear()} Kiwi Wallet · MIT licensed</p>
          </div>
          <FooterCol
            links={[
              { label: "Create wallet", onClick: goSetup },
              { label: "Import wallet", onClick: goSetup },
            ]}
          />
          <FooterCol
            links={[
              { label: "Features", href: "#features" },
              { label: "Use cases", href: "#use-cases" },
            ]}
          />
          <FooterCol
            links={[
              { label: "Mission", href: "#mission" },
              { label: "Back to top", href: "#hero" },
            ]}
          />
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

function Feature({
  icon: Icon,
  title,
  body,
  align,
}: {
  icon: typeof Send;
  title: string;
  body: string;
  align: "left" | "right";
}) {
  return (
    <div className={cn("flex items-start gap-4", align === "left" && "lg:flex-row-reverse lg:text-left")}>
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60">
        <span className="absolute inset-[4px] rounded-full border border-white/15" />
        <Icon className="h-4 w-4 text-white" strokeWidth={1.4} />
      </div>
      <div className={cn("flex-1", align === "left" && "lg:max-w-[180px]")}>
        <h3 className="text-[11px] font-bold text-white">{title}</h3>
        <p className="mt-1 text-[10.5px] leading-relaxed text-white/55">{body}</p>
      </div>
    </div>
  );
}

function StartCard({ title, body, cta, onClick }: { title: string; body: string; cta: string; onClick: () => void }) {
  return (
    <Reveal className="text-center sm:px-8 lg:px-16">
      <h3 className="mx-auto w-fit border-b border-white pb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white">
        {title}
      </h3>
      <p className="mt-3 min-h-[36px] text-[11px] leading-relaxed text-white/60">{body}</p>
      <button onClick={onClick} className="btn-line mt-6 w-full tracking-[0.4em]">
        {cta}
      </button>
    </Reveal>
  );
}

function FooterCol({ links }: { links: { label: string; href?: string; onClick?: () => void }[] }) {
  return (
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.label}>
          {l.href ? (
            <a href={l.href} className="text-[11px] text-white/55 transition-colors hover:text-kiwi">
              <span className="text-white/25">// </span>
              {l.label}
            </a>
          ) : (
            <button onClick={l.onClick} className="text-[11px] text-white/55 transition-colors hover:text-kiwi">
              <span className="text-white/25">// </span>
              {l.label}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
