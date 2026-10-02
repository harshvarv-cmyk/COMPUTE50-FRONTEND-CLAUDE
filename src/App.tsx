import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent, type ReactNode } from "react";
import Lenis from "lenis";
import "./style.css";
import "./extra.css";

/* ---------- Content (same placeholders as your original) ---------- */
const START = new Date("2027-02-20T09:00:00+05:30");
const FEE = 0; // set a number if a fee applies
const D = {
  al: ["Alumni Partner I", "Alumni Partner II", "Alumni Partner III"],
  tracks: [["AI & Machine Learning", "Build intelligent systems that solve real-world campus and industry problems."], ["Web & Cloud", "Scalable, delightful products for the open web."], ["Cybersecurity", "Detect, defend and secure modern digital infrastructure."], ["IoT & Embedded", "Connected hardware that senses, decides and acts."], ["Open Innovation", "Bring your own problem statement."]],
  ppl: [["Speaker Name", "Keynote Speaker, Company"], ["Judge Name", "Principal Engineer, Company"], ["Judge Name", "Founder, Startup"], ["Judge Name", "Professor, PSG Tech"]],
  tiers: [["Gold", ["Sponsor A", "Sponsor B"]], ["Silver", ["Sponsor C", "Sponsor D", "Sponsor E"]], ["Community", ["Partner F", "Partner G"]]] as [string, string[]][],
  ev: [["Code Sprint", "Dec 12", "Online", "Open"], ["Design Jam", "Jan 10", "Offline", "Open"], ["Cloud Workshop", "Jan 24", "Hybrid", "Upcoming"], ["Ideathon", "Feb 07", "Online", "Upcoming"]],
  faq: [["Who can participate?", "Any undergraduate or postgraduate student from a recognised institution."], ["Is there a registration fee?", "Details will be announced here; payment status appears in your profile."], ["Is accommodation available?", "Yes, limited rooms for outstation teams. Request it from your profile."], ["Where is the venue?", "PSG College of Technology, Coimbatore."], ["What is the team size?", "2 to 4 members per team."]],
  clubs: [["Club One", "One-line description of the club."], ["Club Two", "One-line description of the club."], ["Club Three", "One-line description of the club."], ["Club Four", "One-line description of the club."]],
  ct: [["Organising Team", "organiser@example.com"], ["Sponsorship", "sponsors@example.com"], ["Registrations", "help@example.com"]],
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

function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, x = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const m = { x: -999, y: -999 };
    const ps = Array.from({ length: 80 }, () => ({ x: Math.random() * 1400, y: Math.random() * 900, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 }));
    const size = () => { const r = c.parentElement!.getBoundingClientRect(), d = devicePixelRatio || 1; w = r.width; h = r.height; c.width = w * d; c.height = h * d; x.setTransform(d, 0, 0, d, 0, 0); };
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
    let on = true;
    const draw = () => {
      if (!on) return;
      x.clearRect(0, 0, w, h);
      const k = getComputedStyle(document.documentElement).getPropertyValue("--b2").trim() || "#3b82f6";
      x.fillStyle = k; x.strokeStyle = k;
      const n = w < 700 ? 40 : 80;
      for (let i = 0; i < n; i++) {
        const p = ps[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        x.globalAlpha = 0.7; x.beginPath(); x.arc(p.x, p.y, 1.8, 0, 6.3); x.fill();
        for (let j = i + 1; j < n; j++) {
          const q = ps[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) { x.globalAlpha = (1 - d / 120) * 0.35; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke(); }
        }
        const dm = Math.hypot(p.x - m.x, p.y - m.y);
        if (dm < 170) { x.globalAlpha = (1 - dm / 170) * 0.8; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(m.x, m.y); x.stroke(); p.x += (m.x - p.x) * 0.006; p.y += (m.y - p.y) * 0.006; }
      }
      raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) { cancelAnimationFrame(raf); draw(); } });
    io.observe(c);
    size(); draw();
    addEventListener("resize", size); addEventListener("pointermove", move, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener("resize", size); removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={ref} aria-hidden />;
}

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const s = Math.max(0, Math.floor((START.getTime() - now) / 1000));
  return { cd: [["Days", Math.floor(s / 86400)], ["Hours", Math.floor(s / 3600) % 24], ["Mins", Math.floor(s / 60) % 60], ["Secs", s % 60]] as [string, number][], clock: new Date(now).toLocaleTimeString("en-GB") };
}

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
    const sc = () => { const h = document.documentElement; if (pb.current) pb.current.style.transform = `scaleX(${scrollY / Math.max(1, h.scrollHeight - innerHeight)})`; };
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
      const t = (e.target as HTMLElement).closest?.(".btn,.links button,.card,.rwseg,.wseg,#rwbtn,.faqq");
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
  const [hi, setHi] = useState(0);

  return (
    <>
      <div id="mesh"><i /><i /><i /></div><div id="grain" /><div id="pb" ref={pb} />
      {loading && <div id="ld"><div className="lg">Compute<b> 50</b></div><span /><div className="ldspin" /><div className="ldtip">TIP // Assemble your team early — great ideas need great teammates.</div></div>}
      <div id="cur" ref={cur} />

      <button id="mutebtn" className={mute ? "off" : ""} aria-label="Toggle sound" onClick={() => { muted = !muted; setMute(muted); save("c50mute", muted); if (!muted) tone(600, 0.08, 0.045); }} />
      <button id="rwbtn" aria-label="Quick menu" onClick={() => { setWheel(!wheel); tone(420, 0.16, 0.04, 720); }}><i /></button>
      <div className={`rwol ${wheel ? "open" : ""}`}>
        <div className="rwbg" onClick={() => setWheel(false)} />
        <div className="rwheel">
          {items.map(([ic, name, fn], i) => {
            const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
            return <div key={name} className={`rwseg ${hi === i ? "hi" : ""}`} style={{ "--ux": Math.cos(a), "--uy": Math.sin(a) } as CSSProperties} onMouseEnter={() => setHi(i)} onClick={fn}><div className="rdot">{ic}</div><span>{name}</span></div>;
          })}
          <div className="rwhub"><h3>{items[hi][1]}</h3><p>Tap to jump</p></div>
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
            <h3>Join the WhatsApp group</h3><p style={{ margin: "8px 0 20px" }}>Get updates, find teammates and ask questions.</p>
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
        <Particles /><div className="sp" ref={sp} />
        {shapes.map(([c, l, t, s, d], i) => <div key={i} className={`pl ${c}`} style={{ left: l, top: t, "--s": s, "--t": d, "--d": 30 + i * 22 } as CSSProperties}><i /></div>)}
        <div className="scr" /><i className="hud tl" /><i className="hud tr" /><i className="hud bl" /><i className="hud br" />
        <div className="hud-top"><span>COMPUTE // 50</span><HudClock /></div>
        <div className="w">
          <div className="eb rv">CSEA · PSG College of Technology</div>
          <h1><Letters s="Compute" /> <span><Letters s="50" off={8} /></span></h1>
          <p className="tag rv">Build what's next in 48 hours.<br />Ship <Typer words={["intelligent systems", "secure platforms", "connected hardware", "your wildest idea"]} /></p>
          <p className="dt rv">Feb 20 – 21, 2027 · Coimbatore</p>
          <Countdown />
          <div className="row rv">
            {user ? <button className="btn" onClick={() => nav("profile")}>My profile</button> : <><button className="btn" onClick={() => nav("register")}>Register</button><button className="btn o" onClick={() => nav("login")}>Login</button></>}
          </div>
          <div className="inst rv">{[["PSG", "PSG Tech"], ["CS", "CSEA"], ["IN", "Infinitum"]].map(([a, b]) => <span className="mk" key={a}><i>{a}</i>{b}</span>)}</div>
        </div>
      </section>

      <div className="mq"><div className="mt">{Array(4).fill(["Build", "Ship", "Compete", "48 Hours", "₹5,00,000", "5 Tracks"]).flat().map((t, i) => <span key={i}>{t}</span>)}</div></div>

      <section className="stats"><div className="w"><div className="grid">
        {[[48, "", "Hours of building"], [5, "", "Tracks"], [500, "+", "Hackers (target)"], [25, "+", "Mentors"]].map(([n, x, l]) => <div key={l as string} className="rv"><b><CountUp to={n as number} suffix={x as string} /></b><span>{l}</span></div>)}
      </div></div></section>

      <Sec id="powered" eb="Powered by" title="Our Partners" alt>
        <div className="grid"><Card><span className="pill">Title Sponsor</span><h3 style={{ marginTop: 12 }}>Your Brand Here</h3></Card>
          {D.al.map((a) => <Card key={a}><span className="pill">Alumni</span><h3 style={{ marginTop: 12 }}>{a}</h3></Card>)}</div>
      </Sec>

      <Sec id="prize" eb="Prize Pool" title="Rewards worth">
        <div className="big rv"><CountUp to={500000} prefix="₹ " /></div>
        <div className="grid" style={{ marginTop: 20 }}>{[["1st", "₹ 2,00,000"], ["2nd", "₹ 1,25,000"], ["3rd", "₹ 75,000"], ["Track winners", "₹ 1,00,000"]].map(([a, b]) => <Card key={a}><p>{a}</p><h3>{b}</h3></Card>)}</div>
      </Sec>

      <Sec id="about" eb="About" title="The Hackathon" sub="Two days of building, mentoring and shipping, hosted by CSEA at PSG Tech." alt>
        <div className="two rv">
          <div>{[["Team size", "2 – 4"], ["Mode", "Offline"], ["Venue", "PSG Tech, Coimbatore"], ["Eligibility", "All college students"]].map(([a, b]) => <div className="fact" key={a}><span>{a}</span><b>{b}</b></div>)}</div>
          <ul className="sch">{[["Day 1", "09:00 Inauguration · 10:00 Hacking begins · 22:00 Mentor check-in"], ["Day 2", "10:00 Mid-review · 15:00 Final submissions · 17:00 Demos & awards"]].map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
        </div>
      </Sec>

      <Sec id="tracks" eb="Tracks" title="Choose your domain" sub="Pick a track and tackle its problem statements.">
        <div className="rv">
          <div className="wheel">
            {D.tracks.map(([t], i) => {
              const a = (i / D.tracks.length) * Math.PI * 2 - Math.PI / 2;
              return <div key={t} className={`wseg ${tr === i ? "on" : ""}`} style={{ "--ux": Math.cos(a), "--uy": Math.sin(a) } as CSSProperties} onMouseEnter={() => setTr(i)} onClick={() => setTr(i)}><i className="wdot" /><span>{t}</span></div>;
            })}
            <div className="whub"><h3>{D.tracks[tr][0]}</h3><p>{D.tracks[tr][1]}</p></div>
          </div>
          <div className="wgrid grid">{D.tracks.map(([t, p]) => <div className="card" key={t}><h3>{t}</h3><p>{p}</p></div>)}</div>
        </div>
      </Sec>

      <Sec id="people" eb="People" title="Speakers & Judges" alt>
        <div className="grid">{D.ppl.map(([n, d], i) => <Card key={i}><div className="av">{ini(n)}</div><h3>{n}</h3><p>{d}</p></Card>)}</div>
      </Sec>

      <Sec id="sponsors" eb="Sponsors" title="Backed by the best">
        {D.tiers.map(([tier, list]) => (
          <div key={tier}><h3 className="rv" style={{ margin: "20px 0 12px", color: "var(--mut)", fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase" }}>{tier}</h3>
            <div className="grid">{list.map((s) => <Card key={s}><span className="mk"><i>{ini(s)}</i><b>{s}</b></span></Card>)}</div></div>))}
      </Sec>

      <Sec id="events" eb="Series" title="Compute 50 Events" sub="Warm-up events leading to the main hackathon." alt>
        <div className="grid">{D.ev.map(([n, d, m, s]) => (
          <Card key={n}><span className={`pill ${s === "Open" ? "ok" : ""}`}>{s}</span><h3 style={{ marginTop: 12 }}>{n}</h3><p>{d} · {m}</p>
            <button className="btn s o" style={{ marginTop: 16 }} disabled={s !== "Open"} onClick={() => (user ? say(`Registered for ${n}`) : nav("register"))}>Register</button></Card>))}</div>
      </Sec>

      <Sec id="faq" eb="FAQ" title="Questions, answered">
        <div className="rv" style={{ maxWidth: 720 }}>{D.faq.map(([q, a], i) => (
          <div className="faqi" key={q}>
            <button className="faqq" aria-expanded={openQ === i} onClick={() => setOpenQ(openQ === i ? null : i)}><span>{q}</span><i className="faqicon" /></button>
            <div className={`faqa-wrap ${openQ === i ? "open" : ""}`}><div className="faqa-inner"><p>{a}</p></div></div>
          </div>))}</div>
      </Sec>

      <footer id="contact"><div className="w">
        <div className="grid rv">{D.ct.map(([a, b]) => <div key={a}><h4>{a}</h4><a href={`mailto:${b}`}>{b}</a></div>)}<div><h4>Follow</h4><a href="#/">Instagram</a> · <a href="#/">LinkedIn</a> · <a href="#/">X</a></div></div>
        © 2027 CSEA, PSG College of Technology
      </div></footer>
    </>
  );
}

/* ---------- About ---------- */
function About() {
  return (
    <>
      <section><div className="w"><div className="eb rv">About</div><h1 className="rv" style={{ fontSize: "clamp(36px,6vw,60px)" }}>Where ideas compute.</h1></div></section>
      <section className="alt"><div className="w"><div className="grid">
        {[["PSG Tech", "PSG College of Technology, Coimbatore, is a leading engineering institution known for academic rigour and industry ties."], ["CSEA", "The Computer Science and Engineering Association runs technical events, workshops and talks led by students."], ["Compute 50", "A two-day hackathon built around one question: what can you ship when the clock is ticking?"]].map(([t, p]) => <Card key={t}><h3>{t}</h3><p>{p}</p></Card>)}
      </div></div></section>
      <Sec id="clubs" eb="Community" title="Affiliated clubs">
        <div className="grid">{D.clubs.map(([n, d]) => <Card key={n}><span className="mk"><i>{ini(n)}</i><b>{n}</b></span><p style={{ marginTop: 10 }}>{d}</p></Card>)}</div>
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
        <Card className="nh"><h3>Registration</h3><p>Compute 50 · Feb 20 – 21, 2027</p>
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
