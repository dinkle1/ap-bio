// Shared utilities and small components
const { useEffect, useRef, useState, useMemo, useCallback, createContext, useContext } = React;

// ---- Hooks ----
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, shown];
}

function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useRaf(active, cb) {
  useEffect(() => {
    if (!active) return;
    let r;
    let last = performance.now();
    const tick = (t) => {
      cb((t - last) / 1000, t);
      last = t;
      r = requestAnimationFrame(tick);
    };
    r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [active, cb]);
}

// ---- Components ----
function Reveal({ children, delay = 0, as = 'div', ...rest }) {
  const [ref, shown] = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${rest.className || ''}`}
      style={{ ...(rest.style || {}), transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
}

function Eyebrow({ children, num }) {
  return (
    <span className="eyebrow">
      {num ? <span style={{color: 'var(--mute-2)', fontVariantNumeric: 'tabular-nums'}}>{num}</span> : null}
      {num ? <span style={{color: 'var(--mute-2)'}}>/</span> : null}
      {children}
    </span>
  );
}

// APA in-text citations
const CITATIONS = {
  1: 'Wolpaw et al., 2002',
  2: 'Saibene et al., 2023',
  3: 'Hochberg et al., 2023',
  4: 'Lorach et al., 2023',
  5: 'Boonstra, 2025',
  6: 'Slutzky, 2019',
};
function FN({ n }) {
  const txt = CITATIONS[n] || `Ref ${n}`;
  return (
    <span style={{
      fontFamily: 'var(--mono)',
      fontSize: '0.78em',
      color: 'var(--electric)',
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
      marginLeft: 4,
    }}>({txt})</span>
  );
}

// Nav
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className="nav" style={{
      borderBottomColor: scrolled ? 'var(--line-2)' : 'transparent',
      background: scrolled ? 'rgba(7,16,30,0.7)' : 'rgba(7,16,30,0.0)',
    }}>
      <div className="nav__brand">
        <span className="dot"></span>
        <span style={{letterSpacing: '0.12em'}}>SIGNAL / PATH</span>
        <span style={{color: 'var(--mute-2)', marginLeft: 6}}>· brain ↔ machine</span>
      </div>
      <div className="nav__links">
        <a href="#what">What</a>
        <a href="#how">How</a>
        <a href="#do">Do</a>
        <a href="#walk">Walk</a>
        <a href="#limits">Limits</a>
        <a href="#ethics">Ethics</a>
        <a href="#next">Next</a>
      </div>
      <a className="nav__cta" href="#refs">References ↘</a>
    </nav>
  );
}

// A simple "scroll progress" bar — fixed at top
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 60,
      pointerEvents: 'none'
    }}>
      <div style={{
        width: `${p * 100}%`, height: '100%',
        background: 'linear-gradient(90deg, var(--signal), var(--electric))',
        boxShadow: '0 0 14px var(--electric)',
        transition: 'width 0.1s linear',
      }} />
    </div>
  );
}

// SectionHeader: optional eyebrow + display title + optional subtitle, always stacked
function SectionHeader({ num, eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 64 }}>
      {eyebrow && (
        <Reveal>
          <Eyebrow num={num}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={eyebrow ? 80 : 0}>
        <h2 className="h2" style={{ marginTop: eyebrow ? 16 : 0, maxWidth: '22ch' }}
          dangerouslySetInnerHTML={{ __html: title }} />
      </Reveal>
      {sub && (
        <Reveal delay={140}>
          <p className="body" style={{ fontSize: 17, color: 'var(--mute)', maxWidth: '62ch', marginTop: 18, lineHeight: 1.65 }}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

// Animated EEG-style line — used in many places
function EEGLine({ width = 320, height = 60, color = 'var(--electric)', speed = 1, amp = 1, seed = 1, glow = true, dense = true }) {
  const ref = useRef(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const path = svg.querySelector('path');
    let t = 0;
    let raf;
    const W = width, H = height;
    const cx = H / 2;
    const N = dense ? 220 : 120;
    const noise = (x) => {
      // smooth pseudo-noise
      return Math.sin(x * 1.3 + seed * 7.1) * 0.5
           + Math.sin(x * 2.7 + seed * 3.4) * 0.3
           + Math.sin(x * 5.1 + seed * 1.7) * 0.15;
    };
    const draw = () => {
      t += 0.035 * speed;
      let d = '';
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * W;
        const u = (i / N) * 4 + t;
        // occasional spikes
        const spikeChance = (Math.sin(u * 0.9 + seed) > 0.92) ? 1 : 0;
        let y = cx + noise(u) * 8 * amp;
        if (spikeChance) y -= 14 * amp;
        d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2) + ' ';
      }
      path.setAttribute('d', d);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height, speed, amp, seed, dense]);
  return (
    <svg ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <filter id={`glow-${seed}`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
      {glow && <path d="" stroke={color} strokeWidth="2.2" fill="none" opacity="0.35" filter={`url(#glow-${seed})`} />}
      <path d="" stroke={color} strokeWidth="1.4" fill="none" />
    </svg>
  );
}

Object.assign(window, { useReveal, useInView, useRaf, Reveal, Eyebrow, FN, Nav, ScrollProgress, SectionHeader, EEGLine });
