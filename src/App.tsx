import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent, type ReactNode } from "react";
import Lenis from "lenis";
import { Home as HomeIcon, LogIn, User as UserIcon, Activity, ArrowRight, Award, Building2, Calendar, CheckCircle2, Clock, Code2, Coffee, Cpu, FileText, Flame, Gift, GraduationCap, Globe, HeartHandshake, HelpCircle, Info, Key, Lightbulb, Lock, Mail, MapPin, Medal, Monitor, Phone, Rocket, Shield, ShieldAlert, ShieldCheck, Sparkles, Target, Terminal, Trophy, Users, Wifi, Zap, type LucideIcon } from "lucide-react";
import "./style.css";
import "./extra.css";

/* ---------- Content (same placeholders as your original) ---------- */
const START = new Date("2026-10-15T09:00:00+05:30");
const FEE = 0; // set a number if a fee applies
const D = {
  tracks: [["AI & Machine Learning", "Build intelligent applications leveraging NLP, computer vision, generative AI, or predictive modeling."], ["Web3 & Decentralized Tech", "Explore smart contracts, decentralized finance, zero-knowledge proofs, and sovereign identity solutions."], ["HealthTech & BioInformatics", "Solve real-world healthcare challenges using data-driven insights and patient care innovations."], ["Smart Cities & Sustainability", "Develop green tech, energy management, smart mobility, and eco-friendly urban solutions."], ["Open Innovation", "Have a unique idea that crosses domain boundaries? Pitch your novel solution in open innovation."]],
  ppl: [["Placeholder Speaker 1", "Distinguished Engineer, Tech Partner Corp", "Speaker"], ["Placeholder Judge 1", "VP of Engineering, Cloud Enterprise Solutions", "Judge"], ["Placeholder Mentor 1", "Senior Product Architect, InnovateX Labs", "Mentor"]],
  tiers: [["Title", ["Title Sponsor Placeholder"]], ["Gold", ["Gold Sponsor Placeholder A", "Gold Sponsor Placeholder B"]], ["Silver", ["Silver Sponsor Placeholder"]], ["Community", ["Community Partner Placeholder"]]] as [string, string[]][],
  ev: [["Compute 50 Main Hackathon", "Day 1 - Day 2", "Hackathon", "Upcoming", "The flagship 48-hour continuous coding marathon featuring top student teams across the nation."], ["Algorithmic Coding Challenge", "Day 1, 2:00 PM", "Coding Contest", "Upcoming", "Competitive programming contest designed to test extreme speed and precision algorithms."], ["Keynote & Tech Workshop", "Day 1, 5:00 PM", "Workshop", "Upcoming", "Interactive session by industry pioneers on AI engineering and system scaling."], ["Project Pitch & Grand Finale", "Day 2, 4:00 PM", "Valedictory", "Upcoming", "Final short-listed teams present live demos to executive judges."]],
  faq: [["What is Compute 50?", "Compute 50 is a premier national-level 2-day hackathon organized by CSEA at PSG College of Technology, bringing together talented developers and innovators."], ["What is the team size limit for the hackathon?", "Teams can consist of 2 to 4 members. Individual registration is supported, but team formation must be finalized before the deadline."], ["Who is eligible to participate?", "Undergraduate and postgraduate students currently enrolled in recognized colleges or universities are eligible."], ["Is accommodation provided for outstation participants?", "Yes, basic accommodation facilities and meals will be arranged on campus for registered outstation teams."], ["Are hardware projects allowed?", "Yes, teams can build software, hardware, or hybrid solutions depending on the chosen problem track."]],
  clubs: [["Computer Science and Engineering Association", "The primary student association driving technical excellence, hackathons, and software innovation at PSG Tech.", "CSEA"], ["Open Source Software Club", "Promoting open-source culture, collaborative development, and contribution to global repositories.", "OSSC"], ["Artificial Intelligence & Robotics Society", "Fostering machine learning research, automated hardware prototyping, and intelligent algorithms.", "AIRS"], ["Developer Student Club", "Empowering campus developers with modern web, mobile, and cloud computing skillsets.", "DSC"]],
  ct: [["Venue & Address", "Department of CSE, PSG College of Technology, Peelamedu, Coimbatore - 641004"], ["Email Address", "csea@psgtech.ac.in"], ["Student Coordinators", "+91 98765 43210 / +91 91234 56789"]],
  rules: ["All team members must be present on campus during check-in on Day 1.", "Code must be written from scratch during the 50-hour hackathon window. Open-source libraries and APIs are allowed.", "Plagiarism or using pre-existing full projects will result in immediate disqualification.", "Teams must commit code to the designated GitHub repository assigned during registration.", "Decision of the judging panel and organizing committee is final and binding."],
  info: ["High-speed campus Wi-Fi credentials provided upon arrival.", "Complimentary meals, refreshments, and midnight snacks provided.", "College ID card or government photo ID mandatory for entry.", "24/7 security and medical assistance team on campus standby."],
};
const ini = (s: string) => s.split(" ").map((w) => w[0]).join("").slice(0, 2);

/* ---------- Types, routing, storage ---------- */
interface User { name: string; email: string; phone: string; college: string; dept: string; year: string }
interface Team { name: string; members: string[] }
type Route = "home" | "about" | "login" | "register" | "profile";
const routes: Route[] = ["about", "login", "register", "profile"];
const parse = (): Route => routes.find((r) => r === location.hash.replace(/^#\/?/, "")) ?? "home";
const load = <T,>(k: string): T | null => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } };
const save = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

/* ---------- Smooth scrolling ---------- */
let lenis: Lenis | null = null;
const scrollToEl = (id: string) => {
  const el = document.getElementById(id); if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 }); else el.scrollIntoView({ behavior: "smooth" });
};

/* ---------- Brand + sound ---------- */
const LOGO: string | null = null; // e.g. "/logo.png" to show your event logo in the nav
let actx: AudioContext | undefined;
let muted = load<boolean>("c50mute") ?? false;
const tone = (f: number, d: number, g = 0.04, glide?: number) => {
  if (muted || !actx) return;
  try {
    const o = actx.createOscillator(), a = actx.createGain(), t = actx.currentTime;
    o.frequency.value = f; if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + d);
    a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(g, t + 0.008); a.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(a); a.connect(actx.destination); o.start(t); o.stop(t + d + 0.03);
  } catch { /* ignore */ }
};

/* ---------- Small pieces ---------- */
function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  const mv = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (!className.includes("nh")) {
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      e.currentTarget.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-5px)`;
    }
  };
  return <div className={`card rv ${className}`} onMouseMove={mv} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}>{children}</div>;
}
const Sec = ({ id, eb, title, sub, alt, children }: { id: string; eb: string; title: string; sub?: string; alt?: boolean; children: ReactNode }) => (
  <section id={id} className={alt ? "alt" : ""}><div className="w"><div className="rv"><div className="eb">{eb}</div><h2>{title}</h2><p className="sub">{sub}</p></div>{children}</div></section>
);
const Letters = ({ s, off = 0 }: { s: string; off?: number }) => <>{[...s].map((c, i) => <i key={i} className="ch" style={{ "--i": i + off } as CSSProperties}>{c === " " ? "\u00a0" : c}</i>)}</>;

function CountUp({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => { const p = Math.min(1, (t - t0) / 1800); setV(Math.round(to * (1 - Math.pow(1 - p, 4)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{v.toLocaleString("en-IN")}{suffix}</span>;
}

function Typer({ words }: { words: string[] }) {
  const [i, setI] = useState(0), [n, setN] = useState(0), [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i], full = !del && n === w.length;
    const t = setTimeout(() => {
      if (!del && n < w.length) setN(n + 1); else if (!del) setDel(true);
      else if (n > 0) setN(n - 1); else { setDel(false); setI((i + 1) % words.length); }
    }, full ? 1500 : del ? 35 : 75);
    return () => clearTimeout(t);
  }, [n, del, i, words]);
  return <span className="typer">{words[i].slice(0, n)}<i /></span>;
}

function FiftyField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, x = c.getContext("2d")!;
    type P = { x: number; y: number; hx: number; hy: number; vx: number; vy: number; r: number };
    let ps: P[] = [], w = 0, h = 0, raf = 0, on = true, fr = 0, k = "#3b82f6";
    const m = { x: -999, y: -999 };
    const build = () => {
      const r = c.parentElement!.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height; c.width = w * d; c.height = h * d; x.setTransform(d, 0, 0, d, 0, 0);
      const W = Math.floor(w), H = Math.floor(h), o = document.createElement("canvas"); o.width = W; o.height = H;
      const g = o.getContext("2d")!, mob = w < 700;
      g.font = `800 ${Math.min(h * 0.85, w * (mob ? 0.8 : 0.5))}px "Space Grotesk", Inter, sans-serif`;
      g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("50", mob ? W / 2 : W * 0.72, H * 0.5);
      const data = g.getImageData(0, 0, W, H).data, step = mob ? 9 : 7;
      ps = [];
      for (let yy = 0; yy < H; yy += step) for (let xx = 0; xx < W; xx += step)
        if (data[(yy * W + xx) * 4 + 3] > 128) ps.push({ x: Math.random() * w, y: Math.random() * h, hx: xx, hy: yy, vx: 0, vy: 0, r: 1 + Math.random() * 1.3 });
    };
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
    const draw = () => {
      if (!on) return;
      if (fr++ % 30 === 0) k = getComputedStyle(document.documentElement).getPropertyValue("--b2").trim() || k;
      x.clearRect(0, 0, w, h); x.fillStyle = k; x.globalAlpha = 0.9;
      for (const p of ps) {
        const dx = m.x - p.x, dy = m.y - p.y, d2 = dx * dx + dy * dy;
        if (d2 < 16900) { const d = Math.sqrt(d2) || 1, f = (130 - d) / 130; p.vx -= (dx / d) * f * 2.4; p.vy -= (dy / d) * f * 2.4; }
        p.vx = (p.vx + (p.hx - p.x) * 0.035) * 0.86; p.vy = (p.vy + (p.hy - p.y) * 0.035) * 0.86;
        p.x += p.vx; p.y += p.vy;
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.3); x.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) { cancelAnimationFrame(raf); draw(); } });
    io.observe(c); build(); draw();
    void document.fonts.ready.then(build);
    addEventListener("resize", build); addEventListener("pointermove", move, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener("resize", build); removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={ref} aria-hidden />;
}

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const s = Math.max(0, Math.floor((START.getTime() - now) / 1000));
  return { cd: [["Days", Math.floor(s / 86400)], ["Hours", Math.floor(s / 3600) % 24], ["Mins", Math.floor(s / 60) % 60], ["Secs", s % 60]] as [string, number][], clock: new Date(now).toLocaleTimeString("en-GB") };
}

interface WItem { label: string; icon: LucideIcon }
function SpinWheel({ items, onChange, onPick, hub, label }: { items: WItem[]; onChange?: (i: number) => void; onPick?: (i: number) => void; hub: (i: number) => ReactNode; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const st = useRef({ cur: 0, tgt: 0, raf: 0, last: 0, idle: 0, sel: 0, drag: false, px: 0, moved: false, size: 380 });
  const [sel, setSel] = useState(0);
  const n = items.length;
  const cb = useRef({ onChange, n });
  cb.current = { onChange, n };

  const draw = () => {
    const s = st.current, N = cb.current.n, R = s.size * 0.36;
    for (let i = 0; i < N; i++) {
      const el = els.current[i]; if (!el) continue;
      const d = ((((i - s.cur) + N / 2) % N) + N) % N - N / 2;
      const a = (d / N) * Math.PI * 2 - Math.PI / 2, near = Math.max(0, 1 - Math.abs(d));
      el.style.transform = `translate(${(Math.cos(a) * R).toFixed(2)}px,${(Math.sin(a) * R).toFixed(2)}px) scale(${(0.8 + near * 0.4).toFixed(3)})`;
      el.style.opacity = (0.45 + near * 0.55).toFixed(3);
      el.style.zIndex = String(Math.round(near * 10));
    }
    const k = ((Math.round(s.cur) % N) + N) % N;
    if (k !== s.sel) { s.sel = k; setSel(k); tone(640 + k * 55, 0.04, 0.03); cb.current.onChange?.(k); }
  };
  const tick = (t: number) => {
    const s = st.current, dt = Math.min(0.05, (t - s.last) / 1000 || 0.016); s.last = t;
    s.cur += (s.tgt - s.cur) * (1 - Math.exp(-dt * 9));
    if (Math.abs(s.tgt - s.cur) < 0.0008 && !s.drag) { s.cur = s.tgt; draw(); s.raf = 0; return; }
    draw(); s.raf = requestAnimationFrame(tick);
  };
  const kick = () => { const s = st.current; if (!s.raf) { s.last = performance.now(); s.raf = requestAnimationFrame(tick); } };
  const snapSoon = () => { const s = st.current; clearTimeout(s.idle); s.idle = window.setTimeout(() => { s.tgt = Math.round(s.tgt); kick(); }, 130); };
  const go = (i: number) => {
    const s = st.current, base = Math.round(s.tgt); let d = i - (((base % n) + n) % n);
    if (d > n / 2) d -= n; if (d < -n / 2) d += n;
    s.tgt = base + d; kick();
  };

  useEffect(() => {
    const el = box.current!, s = st.current;
    const size = () => { s.size = el.clientWidth || 380; draw(); };
    const ro = new ResizeObserver(size); ro.observe(el); size();
    const wheel = (e: WheelEvent) => { e.preventDefault(); s.tgt += Math.max(-120, Math.min(120, e.deltaY)) / 260; kick(); snapSoon(); };
    const move = (e: PointerEvent) => { if (!s.drag) return; const dx = e.clientX - s.px; if (Math.abs(dx) > 5) s.moved = true; s.px = e.clientX; s.tgt -= dx / 85; kick(); };
    const up = () => { if (!s.drag) return; s.drag = false; snapSoon(); setTimeout(() => { s.moved = false; }, 0); };
    el.addEventListener("wheel", wheel, { passive: false });
    addEventListener("pointermove", move); addEventListener("pointerup", up);
    return () => { ro.disconnect(); el.removeEventListener("wheel", wheel); removeEventListener("pointermove", move); removeEventListener("pointerup", up); cancelAnimationFrame(s.raf); clearTimeout(s.idle); s.raf = 0; };
  }, []);

  return (
    <div ref={box} className="sw" data-lenis-prevent="" tabIndex={0} role="listbox" aria-label={label}
      onPointerDown={(e) => { const s = st.current; s.drag = true; s.moved = false; s.px = e.clientX; }}
      onKeyDown={(e) => {
        const s = st.current;
        if (["ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); s.tgt = Math.round(s.tgt) + 1; kick(); }
        else if (["ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); s.tgt = Math.round(s.tgt) - 1; kick(); }
        else if (e.key === "Enter") onPick?.(s.sel);
      }}>
      <div className="swring" />
      {items.map((it, i) => {
        const I = it.icon;
        return (
          <button key={it.label} ref={(e) => { els.current[i] = e; }} role="option" aria-selected={sel === i} className={`swi ${sel === i ? "on" : ""}`}
            onClick={() => { if (st.current.moved) return; if (i === sel) onPick?.(i); else go(i); }}>
            <span className="swd"><I size={20} strokeWidth={1.8} /></span><span>{it.label}</span>
          </button>
        );
      })}
      <div className="swhub"><div key={sel}>{hub(sel)}</div></div>
    </div>
  );
}

function RadialMenu({ items, open, onPick, hub, label }: { items: WItem[]; open: boolean; onPick: (i: number) => void; hub: (i: number) => ReactNode; label: string }) {
  const box = useRef<HTMLDivElement>(null), halo = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const st = useRef({ ang: -Math.PI / 2, tgt: -Math.PI / 2, op: 0, opT: 0, raf: 0, last: 0, idle: 0, hi: 0, size: 440, step: 0 });
  const [hi, setHi] = useState(0);
  const n = items.length, step = (Math.PI * 2) / n;
  st.current.step = step;
  const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const back = (t: number) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
  const aOf = (i: number) => i * step - Math.PI / 2;
  const nearest = (a: number) => Math.round((a + Math.PI / 2) / step);

  const draw = () => {
    const s = st.current, R = s.size * 0.36;
    for (let i = 0; i < n; i++) {
      const el = els.current[i]; if (!el) continue;
      const t = clamp(s.op * 1.5 - (i / n) * 0.5), e = back(t), a = aOf(i);
      const prox = Math.max(0, 1 - Math.abs(wrap(a - s.ang)) / (step * 1.15));
      el.style.transform = `translate(${(Math.cos(a) * R * e).toFixed(2)}px,${(Math.sin(a) * R * e).toFixed(2)}px) scale(${(Math.max(0.01, e) * (1 + 0.2 * prox)).toFixed(3)})`;
      el.style.opacity = clamp(t * 1.4).toFixed(3);
    }
    if (halo.current) {
      const e = back(clamp(s.op * 1.5 - 0.3));
      halo.current.style.transform = `translate(${(Math.cos(s.ang) * R * e).toFixed(2)}px,${(Math.sin(s.ang) * R * e).toFixed(2)}px) scale(${Math.max(0.01, e).toFixed(3)})`;
      halo.current.style.opacity = clamp(s.op * 1.6).toFixed(3);
    }
    const k = ((nearest(s.ang) % n) + n) % n;
    if (k !== s.hi) { s.hi = k; setHi(k); tone(620 + k * 60, 0.04, 0.03); }
  };
  const tick = (t: number) => {
    const s = st.current, dt = Math.min(0.05, (t - s.last) / 1000 || 0.016); s.last = t;
    s.op += (s.opT - s.op) * (1 - Math.exp(-dt * 6.5));
    const dA = wrap(s.tgt - s.ang); s.ang += dA * (1 - Math.exp(-dt * 12));
    if (Math.abs(dA) < 0.0005 && Math.abs(s.opT - s.op) < 0.002) { s.op = s.opT; s.ang = s.tgt; draw(); s.raf = 0; return; }
    draw(); s.raf = requestAnimationFrame(tick);
  };
  const kick = () => { const s = st.current; if (!s.raf) { s.last = performance.now(); s.raf = requestAnimationFrame(tick); } };
  const snapSoon = () => { const s = st.current; clearTimeout(s.idle); s.idle = window.setTimeout(() => { s.tgt = aOf(nearest(s.tgt)); kick(); }, 140); };
  const stepBy = (d: number) => { const s = st.current; s.tgt = aOf(nearest(s.tgt) + d); kick(); };
  const aim = (x: number, y: number, set: boolean) => {
    const r = box.current!.getBoundingClientRect(), dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2), dist = Math.hypot(dx, dy);
    if (dist < r.width * 0.2) return -1;
    const a = Math.atan2(dy, dx), s = st.current;
    if (set) { s.tgt = s.ang + wrap(a - s.ang); kick(); snapSoon(); }
    return ((nearest(a) % n) + n) % n;
  };

  useEffect(() => { st.current.opT = open ? 1 : 0; kick(); }, [open]);
  useEffect(() => {
    const el = box.current!, s = st.current; let lastStep = 0;
    const size = () => { s.size = el.clientWidth || 440; draw(); };
    const ro = new ResizeObserver(size); ro.observe(el); size();
    const wheel = (e: WheelEvent) => { e.preventDefault(); const now = performance.now(); if (now - lastStep > 110 && Math.abs(e.deltaY) > 2) { lastStep = now; stepBy(e.deltaY > 0 ? 1 : -1); } };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => { ro.disconnect(); el.removeEventListener("wheel", wheel); cancelAnimationFrame(s.raf); clearTimeout(s.idle); s.raf = 0; };
  }, []);

  return (
    <div ref={box} className="rm" data-lenis-prevent="" tabIndex={0} role="menu" aria-label={label}
      onPointerMove={(e) => { aim(e.clientX, e.clientY, true); }}
      onPointerDown={(e) => { aim(e.clientX, e.clientY, true); }}
      onClick={(e) => { const k = aim(e.clientX, e.clientY, false); if (k >= 0) onPick(k); }}
      onKeyDown={(e) => {
        if (["ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); stepBy(1); }
        else if (["ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); stepBy(-1); }
        else if (e.key === "Enter") onPick(st.current.hi);
      }}>
      <div className="rmring" /><div className="rmhalo" ref={halo} />
      {items.map((it, i) => { const I = it.icon; return (
        <button key={it.label} type="button" role="menuitem" ref={(e) => { els.current[i] = e; }} className={`rmi ${hi === i ? "on" : ""}`}>
          <span className="rmd"><I size={20} strokeWidth={1.8} /></span><span>{it.label}</span>
        </button>); })}
      <div className="swhub"><div key={hi}>{hub(hi)}</div></div>
    </div>
  );
}

const Ico = ({ i: I, s = 24 }: { i: LucideIcon; s?: number }) => <span className="ico"><I size={s} strokeWidth={1.8} /></span>;
const TI: LucideIcon[] = [Cpu, Shield, Activity, Zap, Lightbulb];
const INFO_I: LucideIcon[] = [Wifi, Coffee, Key, ShieldCheck];
const HLI: LucideIcon[][] = [[Award, Building2], [Users, Flame], [Zap, Trophy]];
const SCH: string[][][] = [
  [["08:30 AM – 10:00 AM", "Reporting & Verification", "Check-in, badge collection, and kit distribution.", "Main Auditorium Hall"], ["10:00 AM – 11:00 AM", "Inauguration Ceremony", "Welcome address, keynote speaker, and track briefing.", "Main Auditorium"], ["11:00 AM", "Hackathon Hacking Starts", "Problem statements unlocked and live coding commences.", "CS Department Labs"], ["06:00 PM – 08:00 PM", "Mentorship Round 1", "Technical reviews and feedback from industry mentors.", "Lab Complex 2"]],
  [["09:00 AM – 11:00 AM", "Mentorship Round 2", "Progress evaluation and prototype validation.", "Lab Complex 2"], ["02:00 PM", "Final Code Freeze & Submission", "Project submission window closes.", "Online Portal"], ["03:00 PM – 05:00 PM", "Final Judging & Presentation", "Top teams pitch to panel of judges.", "Seminar Hall 1"], ["05:30 PM – 06:30 PM", "Valedictory & Prize Distribution", "Winners announcement and closing remarks.", "Main Auditorium"]],
];
function Schedule() {
  const [d, setD] = useState(0);
  return (
    <div>
      <div className="tabs">{["Day 1", "Day 2"].map((t, i) => <button key={t} className={d === i ? "on" : ""} onClick={() => setD(i)}>{t}</button>)}</div>
      <ol className="tl2" key={d}>{SCH[d].map(([t, e, x, v], i) => <li key={e} style={{ "--i": i } as CSSProperties}><b><Clock size={14} />{t}</b><span>{e}<small>{x}</small><small className="vn"><MapPin size={12} />{v}</small></span></li>)}</ol>
    </div>
  );
}
const PSL = [
  { id: "PS-01", t: 0, title: "Real-Time Edge AI for Disaster Management", lv: "Hard" },
  { id: "PS-02", t: 1, title: "Decentralized Academic Credential Verification System", lv: "Medium" },
  { id: "PS-03", t: 2, title: "Predictive Patient Triage Platform for Emergency Rooms", lv: "Hard" },
  { id: "PS-04", t: 3, title: "Intelligent Micro-Grid Energy Distribution Optimizer", lv: "Medium" },
];
function PsCard({ q }: { q: (typeof PSL)[number] }) {
  return (
    <div className="psc">
      <div className="pst"><span className="pid">{q.id}</span><span className={`lv ${q.lv === "Hard" ? "hard" : "med"}`}>{q.lv}</span></div>
      <h4>{q.title}</h4>
      <small><Lock size={13} />Detailed spec unlocks on Day 1</small>
    </div>
  );
}
const PCOUNT = [4, 3, 3, 4, 2];

function Countdown() {
  const { cd } = useCountdown();
  return <div className="cd rv">{cd.map(([l, v]) => <div key={l}><b>{String(v).padStart(2, "0")}</b><small>{l}</small></div>)}</div>;
}
const HudClock = () => <span>{useCountdown().clock}</span>;

function Field({ label, type = "text", value, onChange, req = true }: { label: string; type?: string; value: string; onChange: (v: string) => void; req?: boolean }) {
  const [show, setShow] = useState(false);
  const pw = type === "password";
  return (
    <label className="f">{label}
      <input type={pw && show ? "text" : type} value={value} required={req} onChange={(e) => onChange(e.target.value)} />
      {pw && <button type="button" className="eye" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>}
    </label>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [route, setRoute] = useState<Route>(parse());
  const [user, setUser] = useState<User | null>(() => load<User>("c50u"));
  const [team, setTeam] = useState<Team | null>(() => load<Team>("c50t"));
  const [paid, setPaid] = useState(false);
  const [accom, setAccom] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalIn, setModalIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [wheel, setWheel] = useState(false);
  const [mute, setMute] = useState(muted);
  const [theme, setTheme] = useState<string>(() => load<string>("c50theme") ?? "");
  const cur = useRef<HTMLDivElement>(null);
  const pb = useRef<HTMLDivElement>(null);

  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2600); };
  const nav = (r: Route, id?: string) => {
    setOpen(false); setWheel(false);
    location.hash = r === "home" ? "#/" : `#/${r}`;
    setRoute(r);
    setTimeout(() => (id ? scrollToEl(id) : lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo({ top: 0 })), 90);
  };
  const login = (u: User, msg: string) => { setUser(u); save("c50u", u); nav("profile"); say(msg); };
  const logout = () => { setUser(null); save("c50u", null); nav("home"); say("Logged out"); };

  useEffect(() => { const f = () => setRoute(parse()); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []);
  useEffect(() => { const t = setTimeout(() => { setLoading(false); setModal(true); setTimeout(() => setModalIn(true), 30); }, 2300); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const sc = () => { const h = document.documentElement; h.style.setProperty("--hp", String(Math.min(1, scrollY / innerHeight))); if (pb.current) pb.current.style.transform = `scaleX(${scrollY / Math.max(1, h.scrollHeight - innerHeight)})`; };
    let tx = -99, ty = -99, cx = -99, cy = -99, ra = 0;
    const loop = () => { cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; if (cur.current) cur.current.style.transform = `translate(${cx}px,${cy}px)`; ra = requestAnimationFrame(loop); };
    loop();
    let lb: HTMLElement | null = null;
    const mv = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest?.<HTMLElement>(".btn") ?? null;
      if (lb && lb !== b) lb.style.translate = "";
      lb = b;
      if (b) { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.18}px ${(e.clientY - r.top - r.height / 2) * 0.3}px`; }
      if (!cur.current) return;
      tx = e.clientX; ty = e.clientY;
      cur.current.classList.toggle("big2", !!(e.target as HTMLElement).closest?.("a,button,.card,input"));
    };
    addEventListener("scroll", sc, { passive: true }); addEventListener("pointermove", mv, { passive: true });
    return () => { cancelAnimationFrame(ra); removeEventListener("scroll", sc); removeEventListener("pointermove", mv); };
  }, []);
  useEffect(() => { if (theme) document.documentElement.dataset.theme = theme; else delete document.documentElement.dataset.theme; }, [theme]);
  useEffect(() => { // hover + click sounds (audio starts after the first tap, per browser rules)
    let last: Element | null = null;
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest?.(".btn,.links button,.card,.swi,.rmi,#rwbtn,.faqq");
      if (t && t !== last) { last = t; tone(920, 0.05, 0.028); } else if (!t) last = null;
    };
    const down = (e: PointerEvent) => {
      try { actx ??= new AudioContext(); void actx.resume(); } catch { /* ignore */ }
      if ((e.target as HTMLElement).closest?.(".btn,.faqq")) tone(600, 0.08, 0.045);
    };
    addEventListener("pointerover", over, { passive: true }); addEventListener("pointerdown", down, { passive: true });
    return () => { removeEventListener("pointerover", over); removeEventListener("pointerdown", down); };
  }, []);
  useEffect(() => {
    const l = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis = l; let id = 0;
    const raf = (t: number) => { l.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); l.destroy(); lenis = null; };
  }, []);
  useEffect(() => { // reveal-on-scroll for every .rv
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: 0.12 });
    const t = setTimeout(() => document.querySelectorAll(".rv:not(.in)").forEach((el) => io.observe(el)), 60);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [route]);

  const items: [string, string, () => void][] = [
    ["⌂", "Home", () => nav("home")], ["ℹ", "About", () => nav("about")], ["◈", "Tracks", () => nav("home", "tracks")],
    ["✦", "Events", () => nav("home", "events")], ["?", "FAQ", () => nav("home", "faq")], ["✉", "Contact", () => nav("home", "contact")],
    user ? ["◉", "Profile", () => nav("profile")] : ["◉", "Login", () => nav("login")],
  ];

  return (
    <>
      <div id="mesh"><i /><i /><i /></div><div id="grain" /><div id="pb" ref={pb} />
      {loading && <div id="ld"><div className="lg">Compute<b> 50</b></div><span /><div className="ldspin" /><pre className="ldcode"><span>{"> compute --init"}</span><span>{"> loading 48 hours of ideas..."}</span><span>{"> ready."}</span></pre><div className="ldtip">TIP // Assemble your team early — great ideas need great teammates.</div></div>}
      <div id="cur" ref={cur} />

      <button id="mutebtn" className={mute ? "off" : ""} aria-label="Toggle sound" onClick={() => { muted = !muted; setMute(muted); save("c50mute", muted); if (!muted) tone(600, 0.08, 0.045); }} />
      <button id="rwbtn" aria-label="Quick menu" onClick={() => { setWheel(!wheel); tone(420, 0.16, 0.04, 720); }}><i /></button>
      <div className={`rwol ${wheel ? "open" : ""}`}>
        <div className="rwbg" onClick={() => setWheel(false)} />
        <div className="rwheel">
          <RadialMenu label="Quick menu" open={wheel} items={items.map(([, name], i) => ({ label: name, icon: [HomeIcon, Info, Target, Calendar, HelpCircle, Mail, user ? UserIcon : LogIn][i] }))}
            onPick={(i) => items[i][2]()} hub={(i) => <><h3>{items[i][1]}</h3><p>Move around the ring, scroll, or use arrow keys · click to open</p></>} />
        </div>
        <button className="rwback" onClick={() => setWheel(false)}>← Back</button>
      </div>

      <nav><div className="w">
        <a href="#/" className="logo" onClick={() => setRoute("home")}>{LOGO && <img src={LOGO} alt="" />}Compute<b> 50</b></a>
        <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
        <div className={`links ${open ? "open" : ""}`}>
          <button className={`lk ${route === "home" ? "on" : ""}`} onClick={() => nav("home")}>Home</button>
          <button className={`lk ${route === "about" ? "on" : ""}`} onClick={() => nav("about")}>About</button>
          <button className="lk" onClick={() => nav("home", "tracks")}>Hackathon</button>
          {user && <button className={`lk ${route === "profile" ? "on" : ""}`} onClick={() => nav("profile")}>Profile</button>}
          <button className="lk" aria-label="Toggle light or dark theme" onClick={() => { const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; const n = dark ? "light" : "dark"; setTheme(n); save("c50theme", n); }}>◐</button>
          {user ? <button className="btn s o" onClick={logout}>Logout</button> : <button className="btn s" onClick={() => nav("login")}>Login</button>}
        </div>
      </div></nav>

      <main key={route} className="pgfade">
        {route === "home" && <Home user={user} nav={nav} say={say} />}
        {route === "about" && <About />}
        {(route === "login" || route === "register") && <Auth mode={route} nav={nav} onDone={login} />}
        {route === "profile" && (user
          ? <Profile {...{ user, team, paid, accom, say }} setUser={(u) => { setUser(u); save("c50u", u); }} setTeam={(t) => { setTeam(t); save("c50t", t); }} setPaid={setPaid} setAccom={setAccom} />
          : <Auth mode="login" nav={nav} onDone={login} />)}
      </main>

      {modal && (
        <div className={`modal ${modalIn ? "in" : ""}`} onClick={() => setModal(false)}>
          <div className="card nh" onClick={(e) => e.stopPropagation()}>
            <span className="pill">ANNOUNCEMENT</span><h3 style={{ marginTop: 10 }}>Registrations for Compute 50 Hackathon are now officially open!</h3><p style={{ margin: "8px 0 20px" }}>Join the WhatsApp group for updates and teammates.</p>
            <div className="row"><a className="btn" href="https://chat.whatsapp.com/" target="_blank" rel="noreferrer">Join group</a><button className="btn o" onClick={() => setModal(false)}>Dismiss</button></div>
          </div>
        </div>
      )}
      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
    </>
  );
}

/* ---------- Home ---------- */
function Home({ user, nav, say }: { user: User | null; nav: (r: Route, id?: string) => void; say: (m: string) => void }) {
  const sp = useRef<HTMLDivElement>(null);
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [tr, setTr] = useState(0);
  const [trk, setTrk] = useState<number | null>(null);
  const heroMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    e.currentTarget.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    if (sp.current) { sp.current.style.left = `${e.clientX - r.left}px`; sp.current.style.top = `${e.clientY - r.top}px`; sp.current.style.opacity = "1"; }
  };
  const shapes: [string, string, string, string, string][] = [["r1", "6%", "14%", "90px", "7s"], ["r2", "82%", "10%", "150px", "9s"], ["r3", "88%", "62%", "64px", "6s"], ["r2 hm", "4%", "66%", "110px", "8s"]];
  const ids = ["powered", "prize", "about", "tracks", "people", "sponsors", "events", "faq"];
  const [act, setAct] = useState("");
  useEffect(() => {
    const f = () => { let c = ""; ids.forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.45) c = id; }); setAct(c); };
    let q = 0; const t = () => { cancelAnimationFrame(q); q = requestAnimationFrame(f); };
    addEventListener("scroll", t, { passive: true }); f();
    return () => { cancelAnimationFrame(q); removeEventListener("scroll", t); };
  }, []);
  return (
    <>
      <aside className="rail" aria-label="Sections">{ids.map((id) => <button key={id} className={act === id ? "on" : ""} data-l={id} aria-label={id} onClick={() => scrollToEl(id)} />)}</aside>
      <section className="hero" onMouseMove={heroMove} onMouseLeave={() => sp.current && (sp.current.style.opacity = "0")}>
        <FiftyField /><div className="sp" ref={sp} />
        {shapes.map(([c, l, t, s, d], i) => <div key={i} className={`pl ${c}`} style={{ left: l, top: t, "--s": s, "--t": d, "--d": 30 + i * 22 } as CSSProperties}><i /></div>)}
        <div className="scr" /><i className="hud tl" /><i className="hud tr" /><i className="hud bl" /><i className="hud br" />
        <div className="hud-top"><span>COMPUTE // 50</span><HudClock /></div>
        <div className="w">
          <div className="eb rv">CSEA, PSG Tech Presents · 2-Day National Hackathon</div>
          <h1><Letters s="Compute" /> <span><Letters s="50" off={8} /></span></h1>
          <p className="tag rv">50 Hours of Non-Stop Code, Innovation, &amp; Engineering Excellence.<br />Ship <Typer words={["intelligent systems", "secure platforms", "connected hardware", "your wildest idea"]} /></p>
          <p className="dt rv">October 15 – 16, 2026 · PSG College of Technology, Coimbatore</p>
          <Countdown />
          <div className="row rv">
            {user ? <button className="btn" onClick={() => nav("profile")}>My profile</button> : <><button className="btn" onClick={() => nav("register")}>Register</button><button className="btn o" onClick={() => nav("login")}>Login</button></>}
          </div>
          <div className="inst rv">{[["PSG", "PSG Tech"], ["CS", "CSEA Department"]].map(([a, b]) => <span className="mk" key={a}><i>{a}</i>{b}</span>)}</div>
        </div>
      </section>

      <div className="mq"><div className="mt">{Array(4).fill(["Build", "Ship", "Compete", "50 Hours", "₹ 2,50,000+", "5 Tracks"]).flat().map((t, i) => <span key={i}>{t}</span>)}</div></div>

      <section className="stats"><div className="w"><div className="grid">
        {[[50, "", "Hours of continuous code"], [5, "", "Tracks"], [500, "+", "Participant teams"], [1000, "+", "CSEA members"]].map(([n, x, l]) => <div key={l as string} className="rv"><b><CountUp to={n as number} suffix={x as string} /></b><span>{l}</span></div>)}
      </div>
      <div className="rv reg"><div className="regtop"><span><CountUp to={128} /> of 500 teams registered</span><b>26%</b></div><div className="bar"><i /></div></div>
      </div></section>

      <Sec id="powered" eb="Powered by" title="Our Partners" alt>
        <div className="grid">{[["PSG College of Technology", "Leading autonomous institute committed to engineering and research perfection."], ["CSEA Association", "Computer Science & Engineering Association organizing high-impact technical symposiums."], ["National Innovation Hub", "Welcoming 500+ participant teams from top engineering institutions across India."]].map(([a, b], i) => <Card key={a}><Ico i={[ShieldCheck, Award, Users][i]} /><span className="pill">Powered by</span><h3 style={{ marginTop: 12 }}>{a}</h3><p>{b}</p></Card>)}</div>
      </Sec>

      <Sec id="prize" eb="Prize Pool" title="Rewards worth">
        <div className="big rv"><CountUp to={250000} prefix="₹ " suffix="+" /></div>
        <p className="sub rv">Compete for substantial cash prizes, trophies, sponsor bounties, and career opportunities.</p>
        <div className="podium rv">{[["2nd", "₹ 60,000", "2", "Runner Up"], ["1st", "₹ 1,00,000", "1", "Grand Winner"], ["3rd", "₹ 40,000", "3", "Second Runner Up"]].map(([a, b, n, t]) => <div key={a} className={`pod p${n}`}>{n === "1" ? <Trophy size={28} /> : n === "2" ? <Medal size={26} /> : <Award size={26} />}<b>{b}</b><span>{a}</span><small>{t}</small></div>)}</div>
        <p className="sub rv" style={{ marginTop: 18 }}>1st place also gets a winner trophy, direct internship interviews and swag kits.</p>
        <div className="grid" style={{ marginTop: 24 }}><Card><Ico i={Gift} /><p>Category Prizes · Track Best Hacks</p><h3><CountUp to={50000} prefix="₹ " suffix=" total" /></h3><p>Best Women Team · Best Hardware Innovation · Best Web3 Build</p></Card></div>
      </Sec>

      <Sec id="about" eb="About the hackathon" title="Empowering Next-Gen Innovators" sub="Compute 50 is designed to test your problem-solving limits, rapid prototyping, and engineering collaborative skills." alt>
        <div className="grid">{[["Rapid Prototyping", "Transform raw problem statements into working software prototypes within 48 continuous hours with technical mentor guidance."], ["Real Industry Challenges", "Tackle tracks curated alongside industry mentors, focusing on AI, decentralization, sustainability, and open domain builds."], ["Collaborative Ecosystem", "Connect with fellow student hackers, tech leaders, sponsor engineers, and academic veterans in an encouraging community."]].map(([a, b], i) => <Card key={a}><Ico i={[Rocket, Target, HeartHandshake][i]} /><h3>{a}</h3><p>{b}</p></Card>)}</div>
        <div className="two rv" style={{ marginTop: 28 }}>
          <div>{[["Team size", "2 - 4 Members"], ["Mode", "In-Person (Offline)"], ["Venue", "PSG College of Technology, Peelamedu, Coimbatore"], ["Eligibility", "UG / PG Students"]].map(([a, b], i) => <div className="fact" key={a}><span className="fl"><Ico i={[Users, Monitor, MapPin, GraduationCap][i]} s={16} />{a}</span><b>{b}</b></div>)}</div>
          <Schedule />
        </div>
      </Sec>

      <Sec id="tracks" eb="Tracks" title="Choose your domain" sub="Pick a track and tackle its problem statements.">
        <div className="rv">
          <div className="wheel">
            <SpinWheel label="Hackathon tracks" items={D.tracks.map(([t], i) => ({ label: t, icon: TI[i] }))} onChange={setTr} onPick={(i) => setTrk(i)}
              hub={(i) => <><Ico i={TI[i]} s={22} /><h3>{D.tracks[i][0]}</h3><p>{D.tracks[i][1]}</p><small className="swh">Click to view problem statements</small></>} />
          </div>
          <div className="row wbtn"><button className="btn s o" onClick={() => setTrk(tr)}>View problem statements</button></div>
          <div className="wgrid grid">{D.tracks.map(([t, p], i) => <div className="card" key={t} onClick={() => setTrk(i)}><div className="trh"><Ico i={TI[i]} /><span className="pill">{PCOUNT[i]} problem statements</span></div><h3>{t}</h3><p>{p}</p><span className="more">Explore track details <ArrowRight size={14} /></span></div>)}</div>
        </div>
        <div className="rv psprev">
          <div className="psh"><h3><FileText size={20} />Problem statements preview</h3><span className="pill">Released on Day 1</span></div>
          <div className="psgrid">{PSL.map((q) => <PsCard key={q.id} q={q} />)}</div>
        </div>
      </Sec>

      <Sec id="rules" eb="Rules" title="Rules & participant info" alt>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
          <Card className="nh"><Ico i={ShieldAlert} /><h3>Hackathon rules &amp; guidelines</h3>{D.rules.map((r) => <p key={r} className="ps ic"><CheckCircle2 size={17} />{r}</p>)}</Card>
          <Card className="nh"><Ico i={Info} /><h3>Important participant information</h3>{D.info.map((r, i) => { const I = INFO_I[i]; return <p key={r} className="ps ic"><I size={17} />{r}</p>; })}</Card>
        </div>
      </Sec>

      <Sec id="people" eb="People" title="Speakers & Judges">
        <div className="grid">{D.ppl.map(([n, d, ty], i) => <Card key={i}><div className="av">{ini(n)}</div><span className="pill">{ty}</span><h3>{n}</h3><p>{d}</p></Card>)}</div>
      </Sec>

      <Sec id="sponsors" eb="Sponsors" title="Backed by the best" alt>
        {D.tiers.map(([tier, list]) => (
          <div key={tier}><h3 className="rv" style={{ margin: "20px 0 12px", color: "var(--mut)", fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase" }}>{tier}</h3>
            <div className="grid">{list.map((s) => <Card key={s}><span className="mk"><i>{ini(s)}</i><b>{s}</b></span></Card>)}</div></div>))}
      </Sec>

      <Sec id="events" eb="Series" title="Compute 50 Events" sub="Warm-up events leading to the main hackathon.">
        <div className="grid">{D.ev.map(([n, d, m, s, x]) => (
          <Card key={n}><Ico i={Calendar} /><span className="pill ok">{s}</span><h3 style={{ marginTop: 12 }}>{n}</h3><p>{x}</p><p>{d} · {m}</p>
            <button className="btn s o" style={{ marginTop: 16 }} disabled={s === "Closed"} onClick={() => (user ? say(`Registered for ${n}`) : nav("register"))}>Register</button></Card>))}</div>
      </Sec>

      <Sec id="faq" eb="FAQ" title="Questions, answered" alt>
        <div className="rv" style={{ maxWidth: 720 }}>{D.faq.map(([q, a], i) => (
          <div className="faqi" key={q}>
            <button className="faqq" aria-expanded={openQ === i} onClick={() => setOpenQ(openQ === i ? null : i)}><span className="fl"><HelpCircle size={17} />{q}</span><i className="faqicon" /></button>
            <div className={`faqa-wrap ${openQ === i ? "open" : ""}`}><div className="faqa-inner"><p>{a}</p></div></div>
          </div>))}</div>
      </Sec>

      <footer id="contact"><div className="w">
        <div className="grid rv">{D.ct.map(([a, b], i) => <div key={a}><Ico i={[MapPin, Mail, Phone][i]} s={18} /><h4>{a}</h4>{b.includes("@") ? <a href={`mailto:${b}`}>{b}</a> : <p>{b}</p>}</div>)}<div><Ico i={Clock} s={18} /><h4>Office hours</h4><p>Monday – Saturday: 9:00 AM – 6:00 PM IST</p></div></div>
        National 2-Day Hackathon hosted by the Computer Science and Engineering Association (CSEA) at PSG College of Technology. © 2026
      </div></footer>
      {trk !== null && (
        <div className="modal in" onClick={() => setTrk(null)}>
          <div className="card nh psm" onClick={(e) => e.stopPropagation()}>
            <button className="x" aria-label="Close" onClick={() => setTrk(null)}>×</button>
            <div className="psmh"><Ico i={TI[trk]} s={26} /><div><span className="pill">Track {trk + 1} of {D.tracks.length}</span><h3>{D.tracks[trk][0]}</h3></div></div>
            <p className="psd">{D.tracks[trk][1]}</p>
            <div className="pslist">
              {PSL.filter((q) => q.t === trk).map((q) => <PsCard key={q.id} q={q} />)}
              {trk === 4 && <div className="psc"><h4>Bring your own problem</h4><small>Pitch a novel solution that crosses domain boundaries. Any domain is welcome.</small></div>}
            </div>
            <p className="psn">{PCOUNT[trk]} problem statements in this track · all released on Day 1</p>
            <div className="row" style={{ justifyContent: "flex-start", gap: 10, marginTop: 18 }}>
              <button className="btn s" onClick={() => { setTrk(null); nav(user ? "profile" : "register"); }}>Register for this track</button>
              <button className="btn s o" onClick={() => setTrk(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- About ---------- */
function About() {
  return (
    <>
      <section><div className="w"><div className="eb rv">About</div><h1 className="rv" style={{ fontSize: "clamp(36px,6vw,60px)" }}>Where ideas compute.</h1></div></section>
      <section className="alt"><div className="w"><div className="grid">
        {([["About PSG College of Technology", "PSG College of Technology, established in 1951 by PSG & Sons’ Charities Trust, is an autonomous government-aided engineering institution in Coimbatore, Tamil Nadu. Renowned for academic quality and industry collaborations, PSG Tech continues to nurture leaders across engineering domains.", ["NIRF Top Ranked Engineering Institution", "70+ Years of Academic Innovation"]], ["About CSEA", "The Computer Science and Engineering Association (CSEA) is the flagship student body of the CSE Department at PSG College of Technology. CSEA organizes technical symposiums, hackathons, guest lectures, and coding competitions to foster student developer communities.", ["1000+ Active Student Members", "Annual Flagship Tech Festival Host"]], ["About Compute 50", "Compute 50 represents 50 continuous hours of technical creation and engineering challenges. Conceived as a celebration of computing milestone, Compute 50 brings together developers from across the country to craft impactful solutions to pressing real-world challenges.", ["50 Hours Continuous Coding", "National Innovation Challenge"]]] as [string, string, string[]][]).map(([t, p, hl], i) => <Card key={t}><Ico i={[Building2, Code2, Cpu][i]} /><h3>{t}</h3><p>{p}</p><div>{hl.map((h, j) => { const I = HLI[i][j]; return <span key={h} className="pill"><I size={12} /> {h}</span>; })}</div></Card>)}
      </div></div></section>
      <Sec id="theme" eb="2026 Edition" title={'Event Theme: "Engineering The Future"'} sub="The overarching theme for Compute 50 centers on bridging bleeding-edge technological paradigms with sustainable societal needs. Teams are encouraged to push boundaries across artificial intelligence, decentralized architecture, urban infrastructure, and human wellness." alt>
        <div className="grid">{[["Global Impact", "Solutions designed for real scale and global usability."], ["Ethical & Secure", "Focus on data privacy, safety, and responsible engineering."], ["Functional MVP", "Working prototypes with real-time execution capability."]].map(([a, b], i) => <Card key={a}><Ico i={[Globe, Shield, Terminal][i]} /><h3>{a}</h3><p>{b}</p></Card>)}</div>
      </Sec>
      <Sec id="clubs" eb="Community" title="Affiliated clubs">
        <div className="grid">{D.clubs.map(([n, d, ab]) => <Card key={n}><span className="mk"><i>{ab}</i><b>{n}</b></span><p style={{ marginTop: 10 }}>{d}</p></Card>)}</div>
      </Sec>
    </>
  );
}

/* ---------- Auth ---------- */
function Auth({ mode, nav, onDone }: { mode: "login" | "register"; nav: (r: Route) => void; onDone: (u: User, m: string) => void }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", college: "", dept: "", year: "", pw: "" });
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const reg = mode === "register";
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (f.pw.length < 6) return setErr("Password must be at least 6 characters.");
    onDone({ name: f.name || f.email.split("@")[0], email: f.email, phone: f.phone, college: f.college, dept: f.dept, year: f.year }, reg ? "Account created" : "Welcome back");
  };
  return (
    <section><div className="w"><form className="form card nh" style={{ padding: 32 }} onSubmit={submit}>
      <h2>{reg ? "Create your account" : "Welcome back"}</h2>
      {reg && <><Field label="Name" value={f.name} onChange={set("name")} /><Field label="Phone" type="tel" value={f.phone} onChange={set("phone")} /><Field label="College" value={f.college} onChange={set("college")} />
        <div className="two2"><Field label="Department" value={f.dept} onChange={set("dept")} /><Field label="Year" value={f.year} onChange={set("year")} /></div></>}
      <Field label="Email" type="email" value={f.email} onChange={set("email")} />
      <Field label="Password" type="password" value={f.pw} onChange={set("pw")} />
      {err && <p className="err" role="alert">{err}</p>}
      {!reg && <p style={{ marginBottom: 14 }}><button type="button" className="lnk">Forgot password?</button></p>}
      <button className="btn" style={{ width: "100%" }}>{reg ? "Create account" : "Log in"}</button>
      <div className="dv">or</div>
      <button type="button" className="btn g" style={{ marginTop: 0 }} onClick={() => onDone({ name: "Google User", email: "user@gmail.com", phone: "", college: "", dept: "", year: "" }, "Signed in with Google")}>Continue with Google</button>
      <p className="dv">{reg ? "Have an account? " : "New here? "}<button type="button" className="lnk" onClick={() => nav(reg ? "login" : "register")}>{reg ? "Log in" : "Register"}</button></p>
    </form></div></section>
  );
}

/* ---------- Profile ---------- */
interface PP { user: User; team: Team | null; paid: boolean; accom: boolean; say: (m: string) => void; setUser: (u: User) => void; setTeam: (t: Team) => void; setPaid: (b: boolean) => void; setAccom: (b: boolean) => void }
function Profile({ user, team, paid, accom, say, setUser, setTeam, setPaid, setAccom }: PP) {
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState(user);
  const [tn, setTn] = useState("");
  const [mem, setMem] = useState("");
  const status = !team ? "Not registered" : FEE && !paid ? "Pending payment" : "Confirmed";
  return (
    <section className="pg"><div className="w">
      <div className="eb rv">Profile</div><h1 className="rv">Hi, {user.name}</h1>
      <div className="pgrid">
        <Card className="nh"><h3>Your details</h3>
          {edit ? <>{(["name", "phone", "college", "dept", "year"] as const).map((k) => <Field key={k} label={k[0].toUpperCase() + k.slice(1)} req={false} value={d[k]} onChange={(v) => setD({ ...d, [k]: v })} />)}
            <button className="btn s" onClick={() => { setUser(d); setEdit(false); say("Details saved"); }}>Save changes</button></>
            : <><p>{user.email}</p><p>{user.phone || "Add your phone"}</p><p>{user.college || "Add your college"} {user.dept && `· ${user.dept}`} {user.year}</p><button className="btn s o" style={{ marginTop: 14 }} onClick={() => setEdit(true)}>Edit details</button></>}
        </Card>
        <Card className="nh"><h3>Registration</h3><p>Compute 50 · Oct 15 – 16, 2026</p>
          <div className="st" style={{ marginTop: 12 }}><span>Status</span><span className={`pill ${status === "Confirmed" ? "ok" : "wt"}`}>{status}</span></div></Card>
        <Card className="nh"><h3>Hackathon team</h3>
          {team ? <><p><b>{team.name}</b></p>{team.members.map((m, i) => <p key={m}>{m} {i === 0 && <span className="pill">Leader</span>}</p>)}
            {team.members.length < 4 && <div className="rowi" style={{ marginTop: 12 }}><input placeholder="Member email" value={mem} onChange={(e) => setMem(e.target.value)} /><button className="btn s" onClick={() => { if (mem) { setTeam({ ...team, members: [...team.members, mem] }); setMem(""); say("Member added"); } }}>Add</button></div>}</>
            : <div className="rowi" style={{ marginTop: 12 }}><input placeholder="Team name" value={tn} onChange={(e) => setTn(e.target.value)} /><button className="btn s" onClick={() => { if (tn) { setTeam({ name: tn, members: [user.name] }); say("Team created"); } }}>Create team</button></div>}
        </Card>
        <Card className="nh"><h3>Payment</h3>
          {!FEE ? <p>No fee for this event.</p> : paid
            ? <div className="st"><span className="pill ok">Paid ₹{FEE}</span><button className="lnk" onClick={() => say("Receipt downloaded")}>Download receipt</button></div>
            : <div className="st"><span className="pill wt">Pending ₹{FEE}</span><button className="btn s" disabled={!team} onClick={() => { setPaid(true); say("Payment received"); }}>{team ? "Pay now" : "Create a team first"}</button></div>}
        </Card>
        <Card className="nh"><h3>Accommodation</h3>
          {accom ? <span className="pill wt">Requested · awaiting approval</span> : <button className="btn s o" style={{ marginTop: 8 }} onClick={() => { setAccom(true); say("Accommodation requested"); }}>Request accommodation</button>}
        </Card>
      </div>
    </div></section>
  );
}
