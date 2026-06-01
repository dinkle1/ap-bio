// SECTION: Companies building this — Neuralink (invasive) vs Kernel (non-invasive)
// Interactive: hover/click to inspect parts; slider to "open the skull" comparison.

function NeuralinkViz({ hot }) {
  // Stylized: brain cross-section + N1 chip + threads going into cortex
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => { setT(v => v + 0.012); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Generate thread paths going from chip down into cortex
  const threads = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 18; i++) {
      const angle = (-Math.PI / 2) + (i - 8.5) * 0.07;
      const len = 60 + Math.random() * 30;
      const ex = 175 + Math.cos(angle) * len;
      const ey = 110 + Math.sin(angle) * len + 30;
      const cx = 175 + Math.cos(angle) * (len * 0.5) + (Math.random() - 0.5) * 8;
      const cy = 95 + Math.sin(angle) * (len * 0.5) + (Math.random() - 0.5) * 8 + 30;
      arr.push({ ex, ey, cx, cy, seed: i });
    }
    return arr;
  }, []);

  return (
    <svg viewBox="0 0 350 280" width="100%" style={{ display: 'block', maxHeight: 280 }}>
      <defs>
        <radialGradient id="brain-cs" cx="0.5" cy="0.55" r="0.5">
          <stop offset="0" stopColor="#1a2a44" />
          <stop offset="1" stopColor="#0a1424" />
        </radialGradient>
        <linearGradient id="chip-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#9af9ff" />
          <stop offset="1" stopColor="#4cf0ff" />
        </linearGradient>
        <filter id="nl-glow"><feGaussianBlur stdDeviation="2.5" /></filter>
      </defs>

      {/* skull outline */}
      <path d="M 60 120 Q 80 30, 175 28 Q 270 30, 290 120 L 290 180 L 60 180 Z"
            fill="none" stroke="rgba(190,210,255,0.2)" strokeWidth="1" />
      {/* brain cross section */}
      <path d="M 70 130 Q 85 50, 175 48 Q 265 50, 280 130 L 280 175 Q 175 200, 70 175 Z"
            fill="url(#brain-cs)" stroke="rgba(108,160,255,0.4)" strokeWidth="0.8" />

      {/* gyri texture */}
      {[0, 1, 2, 3, 4].map(i => (
        <path key={i}
          d={`M ${85 + i * 40} 75 Q ${100 + i * 40} 85, ${85 + i * 40} 95 Q ${70 + i * 40} 105, ${85 + i * 40} 115`}
          fill="none" stroke="rgba(108,160,255,0.25)" strokeWidth="0.8" />
      ))}

      {/* N1 implant — round chip seated in skull */}
      <g transform="translate(175 65)">
        <circle r="22" fill="rgba(76,240,255,0.06)" filter="url(#nl-glow)" />
        <circle r="18" fill="var(--void)" stroke="url(#chip-grad)" strokeWidth="1.5" />
        <circle r="14" fill="rgba(76,240,255,0.05)" stroke="rgba(76,240,255,0.4)" strokeWidth="0.6" strokeDasharray="2 2" />
        <text y="2" textAnchor="middle" fontFamily="var(--mono)" fontSize="7" letterSpacing="1.5" fill="#9af9ff">N1</text>
        <text y="10" textAnchor="middle" fontFamily="var(--mono)" fontSize="5" letterSpacing="1" fill="rgba(154,249,255,0.6)">1024 CH</text>
      </g>

      {/* Threads going into cortex */}
      {threads.map((th, i) => {
        const flash = ((t * 2 + i * 0.3) % 4) < 0.2;
        return (
          <g key={i}>
            <path d={`M 175 80 Q ${th.cx} ${th.cy}, ${th.ex} ${th.ey}`}
              stroke={hot ? '#4cf0ff' : 'rgba(76,240,255,0.55)'}
              strokeWidth="0.6" fill="none" />
            <circle cx={th.ex} cy={th.ey} r="1.2"
              fill={flash ? '#9af9ff' : 'rgba(108,160,255,0.7)'} />
            {flash && <circle cx={th.ex} cy={th.ey} r="3" fill="#4cf0ff" opacity="0.4" />}
          </g>
        );
      })}

      {/* signal travelling back up a random thread */}
      {threads.map((th, i) => {
        const phase = ((t * 0.6 + i * 0.13) % 1);
        if (phase > 0.9) return null;
        const x = th.ex + (175 - th.ex) * (1 - phase);
        const y = th.ey + (80 - th.ey) * (1 - phase);
        return <circle key={'p' + i} cx={x} cy={y} r="1.6" fill="#9af9ff" opacity={1 - phase * 0.7} />;
      })}

      {/* labels */}
      <line x1="220" y1="65" x2="270" y2="40" stroke="rgba(190,210,255,0.4)" strokeWidth="0.6" />
      <text x="272" y="38" fontFamily="var(--mono)" fontSize="9" letterSpacing="1.5" fill="var(--electric)">N1 chip</text>
      <text x="272" y="50" fontFamily="var(--mono)" fontSize="7" fill="var(--mute)">+ R1 robot install</text>

      <line x1="160" y1="170" x2="80" y2="220" stroke="rgba(190,210,255,0.4)" strokeWidth="0.6" />
      <text x="78" y="234" fontFamily="var(--mono)" fontSize="9" letterSpacing="1.5" fill="var(--electric)" textAnchor="end">cortical threads</text>
      <text x="78" y="246" fontFamily="var(--mono)" fontSize="7" fill="var(--mute)" textAnchor="end">{`< 1/16 hair width`}</text>

      <text x="175" y="265" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" letterSpacing="3" fill="rgba(154,249,255,0.55)">CORTEX · MOTOR · M1</text>
    </svg>
  );
}

function KernelViz({ hot }) {
  // Stylized: head profile + Kernel Flow helmet with optical modules
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => { setT(v => v + 0.014); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // modules on helmet — arranged along arc
  const modules = useMemo(() => {
    const arr = [];
    const N = 14;
    for (let i = 0; i < N; i++) {
      const angle = -Math.PI * 0.55 + (i / (N - 1)) * Math.PI * 1.1;
      arr.push({
        x: 175 + Math.cos(angle) * 100,
        y: 115 + Math.sin(angle) * 100,
        angle, i
      });
    }
    return arr;
  }, []);

  return (
    <svg viewBox="0 0 350 280" width="100%" style={{ display: 'block', maxHeight: 280 }}>
      <defs>
        <radialGradient id="kn-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff8a4c" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ff8a4c" stopOpacity="0" />
        </radialGradient>
        <filter id="kn-blur"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>

      {/* head profile (no skin tone — wireframe) */}
      <g stroke="rgba(190,210,255,0.4)" strokeWidth="1" fill="none">
        {/* head ellipse + neck */}
        <ellipse cx="175" cy="120" rx="62" ry="78" />
        <path d="M 155 200 L 155 240" />
        <path d="M 195 200 L 195 240" />
        <line x1="135" y1="240" x2="215" y2="240" />
        {/* features (minimal) */}
        <circle cx="185" cy="118" r="2" fill="rgba(190,210,255,0.4)" />
        <path d="M 200 135 Q 210 145, 200 155" />
        <path d="M 180 165 L 200 167" />
      </g>

      {/* helmet — arc with modules */}
      <path d={`M ${modules[0].x} ${modules[0].y} ${modules.map(m => `L ${m.x} ${m.y}`).join(' ')}`}
            fill="none" stroke="rgba(255,138,76,0.45)" strokeWidth="1.4" />

      {/* light beams from modules into cortex */}
      {modules.map((m, i) => {
        const beat = (t + i * 0.18) % 1;
        const beamLen = 22 + 6 * Math.sin(t * 3 + i);
        const bx = 175 + (m.x - 175) * 0.5;
        const by = 115 + (m.y - 115) * 0.5;
        return (
          <g key={i}>
            {/* beam */}
            <line x1={m.x} y1={m.y} x2={bx} y2={by}
                  stroke="rgba(255,138,76,0.5)" strokeWidth="0.8" />
            {/* photon dot travelling inward & outward */}
            <circle
              cx={m.x + (bx - m.x) * beat}
              cy={m.y + (by - m.y) * beat}
              r={1.6}
              fill={hot ? '#ffaa6a' : '#ff8a4c'} />
            {/* module body */}
            <circle cx={m.x} cy={m.y} r="6" fill="var(--void)" stroke="#ff8a4c" strokeWidth="1.2" />
            <circle cx={m.x} cy={m.y} r="2.5" fill="#ff8a4c" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />
            <circle cx={m.x} cy={m.y} r="10" fill="url(#kn-glow)" />
          </g>
        );
      })}

      {/* cortex glow at the very center where signals integrate */}
      <circle cx="175" cy="100" r="36" fill="rgba(255,138,76,0.08)" filter="url(#kn-blur)" />
      <circle cx="175" cy="100" r="14" fill="none" stroke="rgba(255,138,76,0.4)" strokeDasharray="2 3" />

      {/* labels */}
      <line x1="245" y1="55" x2="280" y2="40" stroke="rgba(190,210,255,0.4)" strokeWidth="0.6" />
      <text x="282" y="38" fontFamily="var(--mono)" fontSize="9" letterSpacing="1.5" fill="#ff8a4c">Flow2 helmet</text>
      <text x="282" y="50" fontFamily="var(--mono)" fontSize="7" fill="var(--mute)">52 modules · fNIRS</text>

      <line x1="100" y1="130" x2="68" y2="170" stroke="rgba(190,210,255,0.4)" strokeWidth="0.6" />
      <text x="66" y="182" fontFamily="var(--mono)" fontSize="9" letterSpacing="1.5" fill="#ff8a4c" textAnchor="end">infrared pulses</text>
      <text x="66" y="194" fontFamily="var(--mono)" fontSize="7" fill="var(--mute)" textAnchor="end">measure oxygenation</text>

      <text x="175" y="265" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" letterSpacing="3" fill="rgba(255,138,76,0.55)">CORTEX · BLOOD-OXYGEN</text>
    </svg>
  );
}

function CompanyCard({ kind, name, tag, viz, specs, body, link, accent, active, onClick }) {
  return (
    <div onClick={onClick}
      style={{
        flex: 1,
        border: `1px solid ${active ? accent : 'var(--line)'}`,
        borderRadius: 14,
        background: active
          ? `linear-gradient(180deg, ${accent}11, transparent 70%)`
          : 'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))',
        boxShadow: active ? `0 0 0 4px ${accent}11, 0 30px 60px -30px ${accent}44` : 'none',
        transition: 'all 0.4s ease',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
      }}>
      {/* chrome */}
      <div className="panel__chrome" style={{ background: active ? 'rgba(7,16,30,0.6)' : 'transparent' }}>
        <span style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span style={{ color: 'var(--text)', fontFamily:'var(--mono)' }}>{kind}</span>
        </span>
        <span style={{ color: 'var(--mute-2)' }}>{active ? 'SELECTED' : 'CLICK TO COMPARE'}</span>
      </div>

      <div style={{ padding: '28px 32px' }}>
        <div className="mono" style={{ color: accent, marginBottom: 8 }}>{tag}</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 56, lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em' }}>
          {name}
        </div>
        <div className="body" style={{ fontSize: 15, color: 'var(--mute)', minHeight: 70 }}>{body}</div>
      </div>

      {/* big viz */}
      <div style={{
        background: 'var(--void-2)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        padding: '20px 0',
      }}>
        {viz}
      </div>

      {/* specs grid */}
      <div style={{ padding: '24px 32px' }}>
        {specs.map((s, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '120px 1fr',
            gap: 16, padding: '8px 0',
            borderBottom: i < specs.length - 1 ? '1px dashed var(--line)' : '0',
            alignItems: 'baseline',
          }}>
            <span className="mono" style={{ color: 'var(--mute-2)' }}>{s.k}</span>
            <span style={{
              fontFamily: s.big ? 'var(--serif)' : 'var(--sans)',
              fontSize: s.big ? 22 : 14,
              color: s.big ? accent : 'var(--text)',
              fontWeight: s.big ? 400 : 400,
            }}>{s.v}</span>
          </div>
        ))}
      </div>

      <a href={link} target="_blank" rel="noopener noreferrer"
         onClick={e => e.stopPropagation()}
         style={{
           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
           padding: '18px 32px',
           borderTop: '1px solid var(--line)',
           background: 'rgba(7,16,30,0.5)',
           color: accent, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
         }}>
        <span>visit {name.toLowerCase()}</span>
        <span>↗</span>
      </a>
    </div>
  );
}

function Section8b() {
  const [sel, setSel] = useState('both');
  return (
    <section id="companies" className="section" style={{ borderTop: '1px solid var(--line)', background: 'linear-gradient(180deg, transparent, rgba(108,160,255,0.025), transparent)' }}>
      <div className="container">
        <SectionHeader
          num="09"
          title='Two bets on the <em>same brain.</em>'
          sub="Two of the most-watched BCI companies are betting on opposite strategies. Neuralink goes inside the skull for maximum signal. Kernel stays outside for maximum access. Click either card to focus."
        />

        {/* axis label */}
        <Reveal>
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            marginBottom: 16, padding: '14px 24px',
            border: '1px solid var(--line)', borderRadius: 999,
            background: 'rgba(7,16,30,0.4)',
          }}>
            <span className="mono" style={{ color: 'var(--electric)' }}>← MAX SIGNAL · MAX RISK</span>
            <span className="mono" style={{ color: 'var(--mute)' }}>SURGICAL AXIS</span>
            <span className="mono" style={{ color: '#ff8a4c' }}>MAX ACCESS · MAX REACH →</span>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ display: 'flex', gap: 20 }}>
            <CompanyCard
              kind="INVASIVE · IMPLANTED"
              name="Neuralink"
              tag="founded 2016 · USA"
              accent="var(--electric)"
              active={sel === 'neuralink' || sel === 'both'}
              onClick={() => setSel(sel === 'neuralink' ? 'both' : 'neuralink')}
              link="https://neuralink.com/"
              body="A coin-sized N1 implant is placed in motor cortex by a surgical robot. Hair-thin threads spread out and listen to individual neurons. First human implant was Noland Arbaugh in early 2024."
              viz={<NeuralinkViz hot={sel === 'neuralink'} />}
              specs={[
                { k: 'approach',     v: 'Skull-penetrating implant', big: true },
                { k: 'channels',     v: '1,024 electrodes across 64 ultra-thin threads' },
                { k: 'signal type',  v: 'Single-neuron action potentials' },
                { k: 'surgery',      v: 'R1 robot · craniectomy · ~2 hours' },
                { k: 'humans',       v: '~5 patients in PRIME trial as of 2025' },
                { k: 'best for',     v: 'High-bandwidth motor control, future speech' },
                { k: 'tradeoff',     v: 'Brain surgery, scarring over years, long-term unknowns' },
              ]}
            />
            <CompanyCard
              kind="NON-INVASIVE · WEARABLE"
              name="Kernel"
              tag="founded 2016 · USA"
              accent="#ff8a4c"
              active={sel === 'kernel' || sel === 'both'}
              onClick={() => setSel(sel === 'kernel' ? 'both' : 'kernel')}
              link="https://www.kernel.com/"
              body="A helmet you put on. 52 modules pulse infrared light into the cortex and measure how blood oxygenation changes. No incision, no implant. Already in clinics studying depression treatment response and early cognitive decline."
              viz={<KernelViz hot={sel === 'kernel'} />}
              specs={[
                { k: 'approach',     v: 'Wearable optical helmet', big: true },
                { k: 'modality',     v: 'TD-fNIRS (time-domain near-infrared spectroscopy)' },
                { k: 'channels',     v: '~2,800 channels from 52 modules' },
                { k: 'surgery',      v: 'None. Put it on, scan in 30 minutes.' },
                { k: 'humans',       v: 'Hundreds of scans across partner clinics' },
                { k: 'best for',     v: 'Brain health tracking, depression, MCI detection' },
                { k: 'tradeoff',     v: 'Slower signal, lower spatial precision than implants' },
              ]}
            />
          </div>
        </Reveal>

        {/* comparison row — quick-glance */}
        <Reveal delay={120}>
          <div style={{ marginTop: 40 }}>
            <CompareBar
              title="signal quality"
              left={{ label: 'Neuralink', v: 95, color: 'var(--electric)' }}
              right={{ label: 'Kernel',   v: 55, color: '#ff8a4c' }}
            />
            <CompareBar
              title="invasiveness"
              left={{ label: 'Neuralink', v: 95, color: 'var(--electric)' }}
              right={{ label: 'Kernel',   v: 5, color: '#ff8a4c' }}
              warn
            />
            <CompareBar
              title="access (people who can use it today)"
              left={{ label: 'Neuralink', v: 8, color: 'var(--electric)' }}
              right={{ label: 'Kernel',   v: 85, color: '#ff8a4c' }}
            />
            <CompareBar
              title="time to first scan"
              left={{ label: 'Neuralink', v: 95, color: 'var(--electric)', text: '~2 hr surgery + recovery' }}
              right={{ label: 'Kernel',   v: 18, color: '#ff8a4c', text: '30 min, walk-in' }}
              warn
            />
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="body" style={{ marginTop: 60, maxWidth: 760, fontSize: 17 }}>
            Two companies. Two different ideas about what a BCI is even for. Neuralink is going after motor restoration in people with severe disability, where the bandwidth gain is worth a craniotomy. Kernel is going after brain health for everyone, where the surgical cost is zero and the signal is good enough to track depression treatment response or detect early signs of cognitive decline. The next decade will likely include both.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CompareBar({ title, left, right, warn }) {
  // 0 = left dominant, 100 = right dominant. We show two bars filling from the middle.
  const total = left.v + right.v;
  const lPct = total ? (left.v / total) * 100 : 50;
  const rPct = 100 - lPct;
  return (
    <div style={{ padding: '14px 0', borderTop: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span className="mono" style={{ color: left.color }}>{left.label}</span>
        <span className="mono" style={{ color: 'var(--mute-2)', letterSpacing: '0.16em', textTransform:'uppercase' }}>{title}</span>
        <span className="mono" style={{ color: right.color }}>{right.label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            width: `${lPct}%`, height: 6, borderRadius: 99,
            background: left.color,
            boxShadow: `0 0 12px ${left.color}`,
            transition: 'width 0.7s cubic-bezier(.5,0,.2,1)',
          }} />
        </div>
        <div style={{ width: 1, height: 16, background: 'rgba(190,210,255,0.4)' }} />
        <div style={{ flex: 1 }}>
          <div style={{
            width: `${rPct}%`, height: 6, borderRadius: 99,
            background: right.color,
            boxShadow: `0 0 12px ${right.color}`,
            transition: 'width 0.7s cubic-bezier(.5,0,.2,1)',
          }} />
        </div>
      </div>
      {(left.text || right.text) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span className="mono" style={{ color: 'var(--mute)', fontSize: 10 }}>{left.text || `${left.v}%`}</span>
          <span className="mono" style={{ color: 'var(--mute)', fontSize: 10 }}>{right.text || `${right.v}%`}</span>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Section8b, CompanyCard, NeuralinkViz, KernelViz });
