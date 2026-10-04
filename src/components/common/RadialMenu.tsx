import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { tone } from '../../lib/sound';

export interface WheelItem {
  label: string;
  icon: LucideIcon;
}

interface RadialMenuProps {
  items: WheelItem[];
  open: boolean;
  onPick: (index: number) => void;
  hub: (index: number) => ReactNode;
  label: string;
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const back = (t: number) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

/**
 * Radial menu: items spring out from the centre, a glowing ring follows the pointer around the wheel
 * (with easing, then settles on the nearest item), icons near the ring grow slightly, and every item
 * passed makes a soft tick. Also works with the mouse wheel, arrow keys + Enter, and touch.
 */
export function RadialMenu({ items, open, onPick, hub, label }: RadialMenuProps) {
  const box = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const st = useRef({ ang: -Math.PI / 2, tgt: -Math.PI / 2, op: 0, opT: 0, raf: 0, last: 0, idle: 0, hi: 0, size: 440 });
  const [hi, setHi] = useState(0);

  const n = items.length;
  const step = (Math.PI * 2) / n;
  const aOf = (i: number) => i * step - Math.PI / 2;
  const nearest = (a: number) => Math.round((a + Math.PI / 2) / step);

  const draw = () => {
    const s = st.current;
    const R = s.size * 0.36;
    for (let i = 0; i < n; i++) {
      const el = els.current[i];
      if (!el) continue;
      const t = clamp(s.op * 1.5 - (i / n) * 0.5);
      const e = back(t);
      const a = aOf(i);
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
    if (k !== s.hi) {
      s.hi = k;
      setHi(k);
      tone(620 + k * 60, 0.04, 0.03);
    }
  };

  const tick = (t: number) => {
    const s = st.current;
    const dt = Math.min(0.05, (t - s.last) / 1000 || 0.016);
    s.last = t;
    s.op += (s.opT - s.op) * (1 - Math.exp(-dt * 6.5));
    const dA = wrap(s.tgt - s.ang);
    s.ang += dA * (1 - Math.exp(-dt * 12));
    if (Math.abs(dA) < 0.0005 && Math.abs(s.opT - s.op) < 0.002) {
      s.op = s.opT;
      s.ang = s.tgt;
      draw();
      s.raf = 0;
      return;
    }
    draw();
    s.raf = requestAnimationFrame(tick);
  };

  const kick = () => {
    const s = st.current;
    if (!s.raf) {
      s.last = performance.now();
      s.raf = requestAnimationFrame(tick);
    }
  };

  const snapSoon = () => {
    const s = st.current;
    clearTimeout(s.idle);
    s.idle = window.setTimeout(() => {
      s.tgt = aOf(nearest(s.tgt));
      kick();
    }, 140);
  };

  const stepBy = (d: number) => {
    const s = st.current;
    s.tgt = aOf(nearest(s.tgt) + d);
    kick();
  };

  const aim = (x: number, y: number, set: boolean) => {
    const el = box.current;
    if (!el) return -1;
    const r = el.getBoundingClientRect();
    const dx = x - (r.left + r.width / 2);
    const dy = y - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < r.width * 0.2) return -1;
    const a = Math.atan2(dy, dx);
    const s = st.current;
    if (set) {
      s.tgt = s.ang + wrap(a - s.ang);
      kick();
      snapSoon();
    }
    return ((nearest(a) % n) + n) % n;
  };

  useEffect(() => {
    st.current.opT = open ? 1 : 0;
    kick();
    if (open) box.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const s = st.current;
    let lastStep = 0;
    const size = () => {
      s.size = el.clientWidth || 440;
      draw();
    };
    const ro = new ResizeObserver(size);
    ro.observe(el);
    size();
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now - lastStep > 110 && Math.abs(e.deltaY) > 2) {
        lastStep = now;
        stepBy(e.deltaY > 0 ? 1 : -1);
      }
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener('wheel', wheel);
      cancelAnimationFrame(s.raf);
      clearTimeout(s.idle);
      s.raf = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={box}
      className="rm"
      data-nosound=""
      tabIndex={0}
      role="menu"
      aria-label={label}
      onPointerMove={(e) => {
        aim(e.clientX, e.clientY, true);
      }}
      onPointerDown={(e) => {
        aim(e.clientX, e.clientY, true);
      }}
      onClick={(e) => {
        const k = aim(e.clientX, e.clientY, false);
        if (k >= 0) onPick(k);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          stepBy(1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          stepBy(-1);
        } else if (e.key === 'Enter') {
          onPick(st.current.hi);
        }
      }}
    >
      <div className="rmring" />
      <div className="rmhalo" ref={halo} />
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <button
            key={it.label}
            type="button"
            role="menuitem"
            ref={(e) => {
              els.current[i] = e;
            }}
            className={`rmi ${hi === i ? 'on' : ''}`}
          >
            <span className="rmd">
              <Icon size={20} strokeWidth={1.8} />
            </span>
            <span>{it.label}</span>
          </button>
        );
      })}
      <div className="rmhub">
        <div key={hi}>{hub(hi)}</div>
      </div>
    </div>
  );
}
