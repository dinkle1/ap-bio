// SECTIONS 1-3
// Section 1: What is a BCI? — Animated 3-step pipeline (Brain → Decode → Act)
function PipelineDiagram() {
  const ref = useRef(null);
  const [, inView] = useInView(0.4);
  // Animate signal traveling through stages
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => {
      setPhase(p => (p + 0.006) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Three stops along the path
  const stops = [
    { label: 'RECORD', detail: 'electrodes pick up cortical firing', icon: 'brain', x: 90 },
    { label: 'DECODE', detail: 'model maps signal → intention', icon: 'cpu', x: 480 },
    { label: 'ACT', detail: 'command sent to device', icon: 'arm', x: 870 },
  ];
  const W = 1000, H = 220;
  // Path between three stops
  const pathD = `M 130 ${H/2} C 250 ${H/2 - 40}, 350 ${H/2 + 40}, 480 ${H/2}
                  S 720 ${H/2 - 30}, 870 ${H/2}`;

  // Helper: position along path (approx using SVG getPointAtLength)
  const [pt, setPt] = useState({ x: 130, y: H/2 });
  useEffect(() => {
    const p = ref.current?.querySelector('#pipeline-path');
    if (!p) return;
    const len = p.getTotalLength();
    const pos = p.getPointAtLength(phase * len);
    setPt({ x: pos.x, y: pos.y });
  }, [phase]);

  return (
    <div ref={ref} className="panel" style={{ overflow:'hidden' }}>
      <div className="panel__chrome">
        <span className="panel__chrome-name">pipeline · brain → decoder → device</span>
        <span>3-step model · Wolpaw et al. 2002</span>
      </div>
      <div style={{ padding: '40px 30px 30px', position:'relative' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow:'visible' }}>
          <defs>
            <linearGradient id="line-grad" x1="0" x2="1">
              <stop offset="0" stopColor="#6aa0ff" stopOpacity="0.2" />
              <stop offset="0.5" stopColor="#4cf0ff" stopOpacity="0.8" />
              <stop offset="1" stopColor="#6aa0ff" stopOpacity="0.2" />
            </linearGradient>
            <filter id="pulse-glow">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* dotted reference path (background) */}
          <path d={pathD} stroke="rgba(190,210,255,0.18)" strokeDasharray="3 6" strokeWidth="1" fill="none" />
          {/* the trodden path (revealed up to phase) */}
          <path id="pipeline-path" d={pathD} stroke="url(#line-grad)" strokeWidth="2" fill="none" />

          {/* travelling pulse */}
          <circle cx={pt.x} cy={pt.y} r="14" fill="#4cf0ff" opacity="0.18" filter="url(#pulse-glow)" />
          <circle cx={pt.x} cy={pt.y} r="5" fill="#9af9ff" />
          <circle cx={pt.x} cy={pt.y} r="2" fill="#fff" />

          {/* Stops */}
          {stops.map((s, i) => {
            const active = phase * (stops.length) > i && phase * (stops.length) < i + 1.1;
            return (
              <g key={s.label} transform={`translate(${s.x}, ${H/2})`}>
                <circle r="36" fill="rgba(76,240,255,0.04)" stroke={active ? '#4cf0ff' : 'rgba(190,210,255,0.2)'} strokeWidth="1" />
                <circle r="26" fill="var(--void-2)" stroke={active ? '#4cf0ff' : 'rgba(190,210,255,0.3)'} strokeWidth="1.2" />
                <PipelineIcon kind={s.icon} active={active} />
                <text y="62" textAnchor="middle" fontFamily="var(--mono)" fontSize="11" letterSpacing="3" fill="#e6eef9">{s.label}</text>
                <text y="80" textAnchor="middle" fontFamily="var(--sans)" fontSize="12" fill="rgba(230,238,249,0.5)">{s.detail}</text>
                <text y="-46" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" letterSpacing="2" fill="rgba(76,240,255,0.85)">0{i+1}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="panel__chrome" style={{ borderBottom: 0, borderTop: '1px solid var(--line)' }}>
        <span style={{ color: 'var(--mute)' }}>latency: simulated · 218ms p50</span>
        <span style={{ display:'flex', gap: 18, fontFamily:'var(--mono)' }}>
          <span style={{color: 'var(--electric)'}}>● record</span>
          <span style={{color: 'var(--signal)'}}>● decode</span>
          <span style={{color: '#9aff9c'}}>● act</span>
        </span>
      </div>
    </div>
  );
}

function PipelineIcon({ kind, active }) {
  const c = active ? '#4cf0ff' : '#a5b5cf';
  if (kind === 'brain') {
    // simplified brain shape
    return (
      <g stroke={c} strokeWidth="1.3" fill="none">
        <path d="M-10,-8 C-14,-8 -16,-3 -13,1 C-15,4 -13,8 -9,8 L-2,8 L-2,-8 Z" />
        <path d="M10,-8 C14,-8 16,-3 13,1 C15,4 13,8 9,8 L2,8 L2,-8 Z" />
        <line x1="-7" y1="-4" x2="-3" y2="-4" />
        <line x1="-7" y1="2" x2="-3" y2="2" />
        <line x1="3" y1="-4" x2="7" y2="-4" />
        <line x1="3" y1="2" x2="7" y2="2" />
      </g>
    );
  }
  if (kind === 'cpu') {
    return (
      <g stroke={c} strokeWidth="1.3" fill="none">
        <rect x="-9" y="-9" width="18" height="18" rx="2" />
        <rect x="-4" y="-4" width="8" height="8" />
        {[-12,-12,12,12].map((v,i)=>null)}
        {[-6,0,6].map(p => <line key={'h'+p} x1="-12" y1={p} x2="-9" y2={p} />)}
        {[-6,0,6].map(p => <line key={'v'+p} x1={p} y1="-12" x2={p} y2="-9" />)}
        {[-6,0,6].map(p => <line key={'r'+p} x1="9" y1={p} x2="12" y2={p} />)}
        {[-6,0,6].map(p => <line key={'b'+p} x1={p} y1="9" x2={p} y2="12" />)}
      </g>
    );
  }
  if (kind === 'arm') {
    // robotic arm / gripper
    return (
      <g stroke={c} strokeWidth="1.3" fill="none">
        <line x1="-10" y1="8" x2="-2" y2="-2" />
        <line x1="-2" y1="-2" x2="6" y2="-8" />
        <circle cx="-10" cy="8" r="2" />
        <circle cx="-2" cy="-2" r="2.4" />
        <line x1="6" y1="-8" x2="10" y2="-12" />
        <line x1="6" y1="-8" x2="3" y2="-12" />
      </g>
    );
  }
  return null;
}

function Section1() {
  return (
    <section id="what" className="section">
      <div className="container">
        <SectionHeader
          num="01"
          eyebrow="The Big Idea"
          title='What is a <em>brain-computer<br/>interface</em>?'
          sub="A direct link from your brain to a machine, no hands, no voice, no muscle in between. Three steps: record, decode, act."
          align="split"
        />
        <Reveal>
          <PipelineDiagram />
        </Reveal>

        <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, marginTop: 80 }}>
          {[
            { n:'01', h:'Record', body: 'Sensors pick up electrical signals from the brain, whether at the scalp, on the surface, or from the cortex itself.', accent:'var(--electric)' },
            { n:'02', h:'Decode', body: 'A machine-learning model learns to recognize what those patterns mean: left hand vs. right, A vs. B, walk vs. stop.', accent:'var(--signal)' },
            { n:'03', h:'Act', body: 'The system fires a command to an external device: a cursor, a robotic arm, a wheelchair, a spinal stimulator.', accent:'#9aff9c' },
          ].map((c, i) => (
            <Reveal key={c.n} delay={i*80}>
              <div style={{ borderTop: `1px solid ${c.accent}`, paddingTop: 20 }}>
                <div className="mono" style={{ color: c.accent, marginBottom: 14 }}>{c.n} / 03</div>
                <h3 className="h3" style={{ marginBottom: 12 }}>{c.h}</h3>
                <p className="body" style={{ fontSize: 15 }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <p className="body" style={{ marginTop: 100, maxWidth: 720, fontSize: 17 }}>
            The idea goes back decades. A landmark 2002 paper by Jonathan Wolpaw and colleagues<FN n={1} /> was the first to formally lay out the framework that modern BCIs still follow: electrical activity recorded from the scalp could serve as a reliable, non-muscular channel for people who cannot move or speak. The science gets complicated fast. The core idea stays simple: your brain is talking, and we are finally learning how to listen.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 2 — The brain doesn't know it's paralyzed
// Animated: signal flow from brain → down spinal cord → cut → BCI bypass
function SpinalBypass() {
  const ref = useRef(null);
  const [mode, setMode] = useState('intact'); // intact | injured | bypass
  const [auto, setAuto] = useState(true);

  // auto-cycle
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setMode(m => m === 'intact' ? 'injured' : m === 'injured' ? 'bypass' : 'intact');
    }, 3800);
    return () => clearInterval(id);
  }, [auto]);

  // Signal pulses
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => { setPulse(p => (p + 0.008) % 1); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const W = 700, H = 520;
  // Body silhouette path coords
  const brainCx = 350, brainCy = 80;
  const cordPath = `M 350 130 L 350 ${mode === 'injured' || mode === 'bypass' ? 240 : 380}`;
  const cordPath2 = `M 350 ${mode === 'injured' || mode === 'bypass' ? 280 : 380} L 350 380`;
  // Bypass curve from brain → external decoder → spinal stim below injury
  const bypassPath = `M 380 90 Q 540 110, 580 240 Q 580 320, 420 320`;

  // tick-marks along the cord
  return (
    <div className="panel" style={{ position:'relative', overflow:'hidden' }}>
      <div className="panel__chrome">
        <span className="panel__chrome-name">signal pathway · pre/post injury</span>
        <span>{mode === 'intact' ? 'intact spinal cord' : mode === 'injured' ? 'cervical injury · signal blocked' : 'BCI bypass · signal routed'}</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0 }}>
        <div style={{ position:'relative', padding: 30 }}>
          <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%">
            <defs>
              <radialGradient id="brain-grad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#4cf0ff" stopOpacity="0.35" />
                <stop offset="1" stopColor="#4cf0ff" stopOpacity="0" />
              </radialGradient>
              <filter id="pulse-blur"><feGaussianBlur stdDeviation="2.5" /></filter>
            </defs>

            {/* body silhouette — minimal */}
            <g stroke="rgba(190,210,255,0.2)" strokeWidth="1" fill="none">
              <ellipse cx={brainCx} cy={brainCy} rx="60" ry="48" />
              {/* shoulders */}
              <path d="M 270 165 Q 350 145, 430 165" />
              {/* torso outline */}
              <path d="M 270 165 L 250 400 Q 350 430, 450 400 L 430 165" />
              {/* arms */}
              <path d="M 268 175 L 220 320 L 215 410" />
              <path d="M 432 175 L 480 320 L 485 410" />
              {/* legs */}
              <path d="M 320 410 L 305 520" />
              <path d="M 380 410 L 395 520" />
            </g>

            {/* brain glow + circuits */}
            <circle cx={brainCx} cy={brainCy} r="70" fill="url(#brain-grad)" />
            <g stroke="rgba(76,240,255,0.65)" strokeWidth="1" fill="none">
              <path d="M310,70 C320,55 345,55 350,70 C355,55 380,55 390,70 C400,80 390,95 380,95 M310,70 C300,80 310,95 320,95 M340,95 L360,95" />
              <path d="M325,82 L335,82 M365,82 L375,82" />
            </g>
            {/* firing dots */}
            {[0,1,2,3,4].map(i => {
              const a = i / 5 * Math.PI * 2 + pulse * 6;
              const x = brainCx + Math.cos(a) * 32;
              const y = brainCy + Math.sin(a) * 26;
              return <circle key={i} cx={x} cy={y} r="1.6" fill="#9af9ff" opacity={0.5 + 0.5*Math.sin(pulse*10 + i)} />;
            })}

            {/* SPINAL CORD */}
            {/* intact line (full when intact) */}
            <line x1="350" y1="130" x2="350" y2="380"
              stroke={mode === 'intact' ? 'rgba(76,240,255,0.6)' : 'rgba(190,210,255,0.2)'}
              strokeWidth={mode === 'intact' ? '2.5' : '1.5'}
              strokeDasharray={mode === 'intact' ? '0' : '2 4'} />

            {/* Injury marker */}
            {(mode === 'injured' || mode === 'bypass') && (
              <g>
                <line x1="335" y1="252" x2="365" y2="268" stroke="var(--danger)" strokeWidth="2" />
                <line x1="365" y1="252" x2="335" y2="268" stroke="var(--danger)" strokeWidth="2" />
                <text x="385" y="265" fontFamily="var(--mono)" fontSize="10" letterSpacing="2" fill="var(--danger)">C5 LESION</text>
              </g>
            )}

            {/* signals — intact: flow brain → legs */}
            {mode === 'intact' && [0, 0.25, 0.5, 0.75].map(off => {
              const p = (pulse + off) % 1;
              const y = 130 + p * 250;
              return <circle key={off} cx="350" cy={y} r="3" fill="#4cf0ff" opacity={1 - p} />;
            })}

            {/* signals — injured: flow brain → stops at injury */}
            {mode === 'injured' && [0, 0.3, 0.6].map(off => {
              const p = (pulse + off) % 1;
              const stopY = 240;
              const y = 130 + p * (stopY - 130);
              return <circle key={off} cx="350" cy={y} r="3" fill="#4cf0ff" opacity={1 - p * 0.4} />;
            })}

            {/* BYPASS path */}
            {mode === 'bypass' && (
              <g>
                {/* external decoder box */}
                <rect x="540" y="200" width="80" height="40" rx="3" fill="var(--void-2)" stroke="var(--electric)" strokeWidth="1.5" />
                <text x="580" y="218" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" letterSpacing="2" fill="var(--electric)">DECODER</text>
                <text x="580" y="232" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" letterSpacing="2" fill="var(--electric)">+ STIM</text>
                {/* bypass curve */}
                <path d={bypassPath} stroke="var(--electric)" strokeWidth="2" fill="none" strokeDasharray="0" />
                <path d={bypassPath} stroke="var(--electric)" strokeWidth="6" fill="none" opacity="0.18" filter="url(#pulse-blur)" />
                {/* travelling pulse along bypass */}
                {[0, 0.33, 0.66].map(off => {
                  const p = (pulse + off) % 1;
                  // sample along path approximately using svg
                  return <BypassPulse key={off} t={p} pathRef={ref} />;
                })}
                {/* continuation pulse below injury */}
                {[0, 0.5].map(off => {
                  const p = (pulse + off) % 1;
                  const y = 320 + p * 60;
                  return <circle key={'b'+off} cx="350" cy={y} r="3" fill="#9aff9c" opacity={1-p*0.4} />;
                })}
              </g>
            )}

            {/* electrode array on brain when in bypass mode */}
            {mode === 'bypass' && (
              <g>
                <g transform={`translate(${brainCx-26},${brainCy-58})`}>
                  {[0,1,2,3,4,5].map(i=>{
                    const r = i % 3, c = Math.floor(i / 3);
                    return <rect key={i} x={r*10} y={c*8} width="4" height="4" fill="var(--electric)" />;
                  })}
                </g>
                <line x1={brainCx+12} y1={brainCy-50} x2="540" y2="210" stroke="var(--electric)" strokeWidth="0.6" strokeDasharray="2 3" />
              </g>
            )}
          </svg>
        </div>

        <div style={{ padding: 30, borderLeft: '1px solid var(--line)' }}>
          <div className="mono" style={{ color: 'var(--electric)', marginBottom: 18 }}>WALK THROUGH ↓</div>
          {[
            { id:'intact', t:'Intact', d:'The brain commands. The spinal cord delivers. The body moves.' },
            { id:'injured', t:'Injured', d:'The brain is still trying. The cord is severed. The signal goes nowhere.' },
            { id:'bypass', t:'Bypass', d:'A BCI reads cortical intent and routes it past the injury to a stimulator below.' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => { setMode(s.id); setAuto(false); }}
              style={{
                display:'block', textAlign:'left', width: '100%',
                padding: '14px 16px', marginBottom: 8,
                background: mode === s.id ? 'rgba(76,240,255,0.06)' : 'transparent',
                border: `1px solid ${mode === s.id ? 'rgba(76,240,255,0.4)' : 'var(--line)'}`,
                borderRadius: 8,
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 4 }}>
                <span style={{ fontFamily:'var(--serif)', fontSize: 22, color: mode === s.id ? 'var(--electric)' : 'var(--text)' }}>{s.t}</span>
                <span className="mono" style={{ color: 'var(--mute-2)' }}>{s.id === mode ? '◉' : '○'}</span>
              </div>
              <div className="body" style={{ fontSize: 13, color: 'var(--mute)' }}>{s.d}</div>
            </button>
          ))}
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
            <div className="mono" style={{ color: 'var(--mute-2)' }}>auto-cycle</div>
            <button onClick={() => setAuto(a => !a)} className="chip" style={{ marginTop: 8, color: auto ? 'var(--electric)' : 'var(--mute)' }}>
              <span className="dot" style={{ background: auto ? 'var(--electric)' : 'var(--mute-2)' }} />
              {auto ? 'playing' : 'paused'} · click to {auto ? 'pause' : 'play'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BypassPulse({ t, pathRef }) {
  const [pos, setPos] = useState({ x: 380, y: 90 });
  useEffect(() => {
    const paths = pathRef.current?.querySelectorAll('path');
    if (!paths) return;
    const target = Array.from(paths).find(p => p.getAttribute('d')?.startsWith('M 380 90'));
    if (!target) return;
    const len = target.getTotalLength();
    const p = target.getPointAtLength(t * len);
    setPos({ x: p.x, y: p.y });
  }, [t]);
  return <circle cx={pos.x} cy={pos.y} r="3.4" fill="#9af9ff" />;
}

function Section2() {
  return (
    <section className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(76,240,255,0.025), transparent)' }}>
      <div className="container">
        <SectionHeader
          num="02"
          eyebrow="The Surprising Thing"
          title='The brain doesn&rsquo;t know <em>it&rsquo;s paralyzed.</em>'
          sub="When the spinal cord is severed, the brain keeps broadcasting. Motor cortex lights up exactly the way it would in an uninjured person. BCIs are just building a new receiver."
          align="split"
        />
        <Reveal>
          <SpinalBypass />
        </Reveal>

        <div style={{ display:'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, marginTop: 100, alignItems: 'start' }}>
          <Reveal>
            <blockquote className="pullquote">
              The brain is still broadcasting.<br/>BCIs are just building a new receiver.
            </blockquote>
          </Reveal>
          <Reveal delay={100}>
            <p className="body">
              The spinal cord acts like a cable between your brain and your body. Paralysis happens when that cable gets cut. The brain is still sending messages like &ldquo;move my left hand&rdquo; or &ldquo;take a step,&rdquo; but those messages cannot get through. They are being broadcast into silence.
              <br/><br/>
              Neuroscientists have shown that when a person with paralysis simply <em style={{color:'var(--text)', fontStyle:'italic'}}>imagines</em> moving their arm, their motor cortex lights up with nearly the same activity as it would in an uninjured person. <strong>That neural activity is the raw material a BCI works with.</strong>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 3 — Reading the brain: invasive vs noninvasive
// Interactive: three modalities (EEG / ECoG / Utah). Click to compare signal quality.

function ModalitySigViz({ kind }) {
  // Each modality produces different signal characteristics
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  useEffect(() => {
    let raf;
    const cfg = {
      eeg:   { count: 4, amp: 6,  noise: 0.9, spike: 0.0,  res: 'low' },
      ecog:  { count: 6, amp: 10, noise: 0.4, spike: 0.4,  res: 'medium' },
      utah:  { count: 8, amp: 14, noise: 0.15, spike: 1.0, res: 'high' },
    }[kind];
    let t = 0;
    const tick = () => {
      t += 0.04;
      refs.forEach((r, i) => {
        const el = r.current;
        if (!el) return;
        const W = 240, H = 28, N = 200, cy = H/2;
        let d = '';
        for (let k = 0; k <= N; k++) {
          const x = (k / N) * W;
          const u = (k / N) * 4 + t + i * 0.6;
          let y = cy
            + (Math.sin(u * 1.7) + Math.sin(u * 3.3 + i)) * cfg.amp * 0.5 * cfg.noise
            + (Math.random() - 0.5) * cfg.amp * cfg.noise * 0.6;
          // crisp spikes for utah
          if (cfg.spike > 0 && Math.sin(u * 0.7 + i * 1.3) > 0.97) {
            y -= 14 * cfg.spike;
          }
          d += (k === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
        }
        el.setAttribute('d', d);
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [kind]);

  return (
    <div>
      {refs.map((r, i) => (
        <svg key={i} width="100%" viewBox="0 0 240 28" preserveAspectRatio="none" style={{ display:'block' }}>
          <path ref={r} stroke={kind === 'utah' ? '#4cf0ff' : kind === 'ecog' ? '#6aa0ff' : '#a5b5cf'} strokeWidth="1" fill="none" />
        </svg>
      ))}
    </div>
  );
}

function ModalityCard({ kind, title, sub, pros, cons, signalAmp, signalBar, spatialRes, spatialBar, risk, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign:'left', width:'100%', padding: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))',
        border: `1px solid ${active ? 'rgba(76,240,255,0.55)' : 'var(--line)'}`,
        borderRadius: 14,
        boxShadow: active ? '0 0 0 4px rgba(76,240,255,0.06), 0 30px 60px -30px rgba(76,240,255,0.4)' : 'none',
        transition: 'all 0.4s ease',
        cursor: 'pointer', color: 'inherit', fontFamily: 'var(--sans)',
        display: 'flex', flexDirection: 'column',
      }}>
      <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 4 }}>
          <span className="mono" style={{ color: active ? 'var(--electric)' : 'var(--mute)' }}>{kind}</span>
          <span className="mono" style={{ color: 'var(--mute-2)' }}>{active ? '◉ selected' : '○ click'}</span>
        </div>
        <div className="h3" style={{ fontSize: 32, marginTop: 6 }}>{title}</div>
        <div className="body" style={{ fontSize: 13, marginTop: 6, color: 'var(--mute)' }}>{sub}</div>
      </div>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)', background: 'rgba(7,16,30,0.5)' }}>
        <div className="mono" style={{ color: 'var(--mute-2)', marginBottom: 8 }}>recorded signal · sample</div>
        <ModalitySigViz kind={kind.toLowerCase()} />
      </div>
      <div style={{ padding: '18px 22px' }}>
        <ValueRow label="signal amplitude" value={signalAmp} bar={signalBar} />
        <ValueRow label="spatial resolution" value={spatialRes} bar={spatialBar} />
        <RiskRow level={risk} />
      </div>
      <div style={{ padding: '0 22px 18px', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
        <div>
          <div className="mono" style={{ color: '#9aff9c', marginBottom: 6 }}>+ PROS</div>
          {pros.map((p, i) => <div key={i} className="body" style={{ fontSize: 13, marginBottom: 4 }}>{p}</div>)}
        </div>
        <div>
          <div className="mono" style={{ color: 'var(--warn)', marginBottom: 6 }}>− CONS</div>
          {cons.map((p, i) => <div key={i} className="body" style={{ fontSize: 13, marginBottom: 4 }}>{p}</div>)}
        </div>
      </div>
    </button>
  );
}

function ValueRow({ label, value, bar }) {
  const color = bar > 66 ? 'var(--electric)' : bar > 33 ? 'var(--signal)' : 'var(--mute)';
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 4 }}>
        <span className="mono" style={{ color: 'var(--mute)' }}>{label}</span>
        <span style={{ fontFamily:'var(--mono)', fontSize: 11, color: color, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      </div>
      <div style={{ height: 3, background: 'rgba(190,210,255,0.08)', borderRadius: 99, overflow:'hidden' }}>
        <div style={{ width: `${bar}%`, height: '100%', background: color, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function RiskRow({ level }) {
  const idx = { LOW: 0, MEDIUM: 1, HIGH: 2 }[level];
  const colors = ['#9aff9c', 'var(--warn)', 'var(--danger)'];
  const labels = ['LOW', 'MED', 'HIGH'];
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
        <span className="mono" style={{ color: 'var(--mute)' }}>surgical risk</span>
        <span className="mono" style={{ color: colors[idx], fontWeight: 600 }}>{level}</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 4 }}>
        {labels.map((l, i) => (
          <div key={l} style={{
            height: 6,
            background: i === idx ? colors[i] : 'rgba(190,210,255,0.08)',
            boxShadow: i === idx ? `0 0 10px ${colors[i]}` : 'none',
            borderRadius: 2,
            transition: 'all 0.4s ease',
          }} />
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 4, marginTop: 4 }}>
        {labels.map((l, i) => (
          <span key={l} className="mono" style={{ fontSize: 9, color: i === idx ? colors[i] : 'var(--mute-2)', textAlign:'center' }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function Section3() {
  return (
    <section id="how" className="section">
      <div className="container">
        <SectionHeader
          num="03"
          eyebrow="Modalities"
          title='Two ways to <em>listen</em> to a brain.'
          sub="The biggest divide in BCI: do you need to cut the skull open? Three real systems sit on a spectrum from cap-on-head to electrodes-in-cortex. Each makes a trade."
          align="split"
        />
        <Section3Cards />

        <Reveal>
          <p className="body" style={{ marginTop: 70, maxWidth: 760, fontSize: 17 }}>
            EEG signals recorded at the scalp are blurry. Thousands of neurons fire at once and their signals smear together, like trying to hear a single conversation in a stadium<FN n={2} />. Implanted arrays pick up individual neurons instead. The signal quality is far better, but brain surgery carries real risks, and scar tissue gradually degrades the array over time<FN n={3} />. ECoG, a grid on the cortex&rsquo;s surface, sits between the two and is where many researchers are now focusing. Spatial resolution drops from roughly 50&ndash;100 µm at the cortex to several centimetres at the scalp, a difference of three orders of magnitude<FN n={6} />.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Section3Cards() {
  const [sel, setSel] = useState('utah');
  return (
    <div style={{ display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      <Reveal>
        <ModalityCard kind="EEG" title="Cap on head" sub="Electrodes sit on the scalp. No incision, no implant."
          signalAmp="10–100 µV" signalBar={22}
          spatialRes="~5–9 cm" spatialBar={15}
          risk="LOW"
          pros={["No surgery required","Cheap, portable","Re-usable across patients"]}
          cons={["Smeared by skull & scalp","Noise-prone","Slow data rates"]}
          active={sel === 'EEG'} onClick={() => setSel('EEG')} />
      </Reveal>
      <Reveal delay={100}>
        <ModalityCard kind="ECoG" title="Grid on cortex" sub="Electrodes placed on the brain surface, under the skull, not in it."
          signalAmp="~50–100 µV" signalBar={62}
          spatialRes="~1–3 mm" spatialBar={58}
          risk="MEDIUM"
          pros={["5–10× stronger signal than EEG","Less invasive than penetrating arrays","Promising for speech decoding"]}
          cons={["Still requires craniotomy","Hospital-only","Smaller patient pool"]}
          active={sel === 'ECoG'} onClick={() => setSel('ECoG')} />
      </Reveal>
      <Reveal delay={200}>
        <ModalityCard kind="Utah" title="In the cortex" sub="100 hair-thin electrodes implanted directly into motor cortex."
          signalAmp="100 µV – 1 mV spikes" signalBar={94}
          spatialRes="~50–100 µm" spatialBar={96}
          risk="HIGH"
          pros={["Single-neuron resolution","Drives the dramatic demos","Best for fine motor control"]}
          cons={["Brain surgery required","Scarring degrades signal","Long-term unknowns"]}
          active={sel === 'Utah'} onClick={() => setSel('Utah')} />
      </Reveal>
    </div>
  );
}

Object.assign(window, { Section1, Section2, Section3, PipelineDiagram, SpinalBypass });
