import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import hero from "@/assets/hero-character.png";
import sky from "@/assets/night-sky.jpg";
import { fmt, useGame, MAX_SPINS } from "@/lib/game";
import { ART } from "@/lib/art";
import nftIcon from "@/assets/nav-nft.png";

export function TopBar() {
  const { s, toggleSound } = useGame();
  return (
    <header className="relative z-30 flex h-13 shrink-0 items-center gap-2 border-b border-white/10 bg-ink/35 px-3 backdrop-blur-xl">
      <div className="relative shrink-0">
        <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/25 bg-ink shadow-[0_2px_6px_-1px_oklch(0_0_0/.5)]">
          <img src={hero} alt="" className="h-full w-full scale-125 object-cover object-top" />
        </div>
        <span className="absolute -bottom-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-sun px-0.5 font-display text-[9px] leading-none text-cream text-outline shadow-[0_1px_2px_oklch(0_0_0/.4)]">{s.level}</span>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Pill icon={ART.coin} value={fmt(s.coins)} />
        <Pill icon={ART.gem} value={fmt(s.solo)} />
        <Pill icon={ART.bolt} value={String(s.spins)} />
      </div>
      <button onClick={toggleSound} aria-label="Toggle sound" className="glass-card grid h-8 w-8 shrink-0 place-items-center !rounded-full text-cream transition-transform active:scale-90">
        {s.sound ? <Volume2 className="h-4 w-4" strokeWidth={3} /> : <VolumeX className="h-4 w-4" strokeWidth={3} />}
      </button>
    </header>
  );
}

function Pill({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="relative flex h-7 items-center rounded-full border border-white/15 bg-ink/55 pl-5 pr-2.5 backdrop-blur-md">
      <img src={icon} alt="" className="absolute -left-1.5 h-6 w-6 object-contain drop-shadow-[0_2px_0_var(--ink)]" />
      <span className="font-display text-xs leading-none text-cream">{value}</span>
    </div>
  );
}

type To = "/" | "/upgrade" | "/earn" | "/nft" | "/wheel";
function NavItem({ icon, label, to, divider }: { icon: string; label: string; to: To; divider?: "l" | "r" }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className="group flex flex-col items-center justify-center gap-1"
    >
      <span className={`grid h-10 w-10 place-items-center rounded-2xl transition-all group-data-[status=active]:bg-white/12 ${divider ? "" : ""}`}>
        <img src={icon} alt="" className="h-9 w-9 object-contain transition-transform group-active:scale-90 group-data-[status=active]:scale-110" />
      </span>
      <span className="font-display text-[11px] leading-none text-muted-foreground group-data-[status=active]:text-sun">{label}</span>
    </Link>
  );
}

/** Bottom bar: big diamond SPIN rises out of the middle on the slot page; a compact chip elsewhere. */
export function BottomNav({ center }: { center?: ReactNode }) {
  const { s } = useGame();
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  const compact = !center && pathname !== "/";
  const pct = Math.min(100, (s.spins / MAX_SPINS) * 100);
  return (
    <nav className="relative z-30 pb-[env(safe-area-inset-bottom)]">
      <div className={`relative grid grid-cols-[1fr_1fr_1.9fr_1fr_1fr] border-t border-white/10 bg-ink/45 backdrop-blur-2xl ${compact ? "h-[66px]" : "h-[78px]"}`}>
        <NavItem icon={ART.rocket} label="UPGRADE" to="/upgrade" />
        <NavItem icon={ART.bag} label="EARN" to="/earn" />
        <div className="relative">
          <div className={`absolute left-1/2 -translate-x-1/2 ${compact ? "top-[-26px] h-[80px] w-[80px]" : "top-[-58px] h-[112px] w-[112px]"}`}>
            {center ?? (
              <Link to="/" className="chunk-btn h-full w-full rounded-[2rem] bg-gradient-to-b from-sun to-sun-dark">
                <span className={`font-display leading-none ${compact ? "text-xl" : "text-2xl"}`}>SPIN</span>
              </Link>
            )}
          </div>
          <div className={`absolute inset-x-2 flex items-center rounded-full border border-white/15 bg-ink/60 pl-4 pr-2 backdrop-blur-md ${compact ? "bottom-2 h-[20px]" : "bottom-2.5 h-[22px]"}`}>
            <img src={ART.bolt} alt="" className={`absolute left-1 object-contain ${compact ? "h-5 w-5" : "h-6 w-6"}`} />
            <div className={`flex-1 overflow-hidden rounded-full bg-ink/70 ${compact ? "h-3" : "h-3.5"}`}>
              <div className="h-full rounded-full bg-gradient-to-r from-sky to-grape transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
            <span className={`absolute inset-0 grid place-items-center font-display leading-none text-cream ${compact ? "pl-2.5 text-[11px]" : "pl-3 text-[12px]"}`}>{s.spins}/{MAX_SPINS}</span>
          </div>
        </div>
        <NavItem icon={nftIcon} label="NFT" to="/nft" />
        <NavItem icon={ART.wheel} label="WHEEL" to="/wheel" />
      </div>
    </nav>
  );
}

/** Full-height, non-scrolling app frame. `scroll` lets inner pages scroll their content area only. */
export function Screen({ children, center, bare, scroll = true, navigation = true }: { children: ReactNode; center?: ReactNode; bare?: boolean; scroll?: boolean; navigation?: boolean }) {
  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-night">
      <img src={sky} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <TopBar />
      <main className={`relative min-h-0 flex-1 ${scroll ? "overflow-y-auto" : "overflow-hidden"} ${bare ? "" : "px-3 py-3"}`}>{children}</main>
      {navigation && <BottomNav center={center} />}
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="glass-card relative w-full max-w-sm border-white/15 bg-night/80 p-5 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-3 text-center font-display text-2xl text-sun">{title}</h2>
        <button onClick={onClose} aria-label="Close" className="absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full bg-berry text-cream shadow-[0_2px_6px_oklch(0_0_0/.4)] transition-transform active:scale-90"><X className="h-4 w-4" strokeWidth={3.5} /></button>
        {children}
      </div>
    </div>
  );
}
