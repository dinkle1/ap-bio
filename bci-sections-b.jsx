// SECTIONS 4, 5, 6

// =============================================================================
// SECTION 4 — Decoding: how a computer reads thoughts
// Interactive: choose imagined action; see live signal → features → classifier → output

function DecoderDemo() {
  const intents = [
    { id:'left',  label:'imagined: left hand',  emoji:'←', baseConf: 94, color: 'var(--electric)' },
    { id:'right', label:'imagined: right hand', emoji:'→', baseConf: 91, color: 'var(--electric)' },
    { id:'foot',  label:'imagined: foot',       emoji:'↓', baseConf: 84, color: 'var(--signal)' },
    { id:'speech',label:'attempted speech',     emoji:'◌', baseConf: 88, color: '#9aff9c' },
  ];
  const [active, setActive] = useState('right');
  const [noise, setNoise] = useState(15); // 0-100 noise level
  // Confidence drops as noise rises
  const cur = intents.find(i => i.id === active);
  cur.conf = Math.max(28, Math.round(cur.baseConf - noise * 0.65));

  // For the bar visualization output
  const out = intents.map(i => i.id === active
    ? { ...i, p: cur.conf / 100 }
    : { ...i, p: (1 - cur.conf / 100) / 3 * (0.5 + Math.random() * 0.8) }
  );

  // EEG channels
  const channels = ['M1·L', 'M1·R', 'S1·L', 'S1·R', 'PMC', 'SMA'];

  // Features (toy spectral power)
  const features = [
    { band: 'µ (8–13Hz)', power: active === 'left' ? 85 : 25 },
    { band: 'β (13–30Hz)', power: active === 'right' ? 80 : 30 },
    { band: 'γ (>30Hz)',   power: active === 'speech' ? 78 : 40 },
    { band: 'θ (4–7Hz)',   power: active === 'foot' ? 72 : 35 },
  ];

  return (
    <div className="panel" style={{ overflow:'hidden' }}>
      <div className="panel__chrome">
        <span className="panel__chrome-name">decoder · live</span>
        <span>30kHz sampling · LSTM · 4-class motor imagery · {noise > 50 ? <span style={{color:'var(--danger)'}}>LOW CONFIDENCE</span> : <span style={{color: noise > 25 ? 'var(--warn)' : '#9aff9c'}}>OK</span>}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: '1.1fr 1fr 1fr 1.2fr', gap: 0 }}>
        {/* COL 1: raw signal */}
        <div style={{ padding: '20px', borderRight: '1px solid var(--line)' }}>
          <Stage label="01" title="Raw signal" sub="multichannel cortex" />
          {channels.map((c, i) => (
            <div key={c} style={{ display:'grid', gridTemplateColumns: '46px 1fr', alignItems:'center', gap: 8, marginBottom: 4 }}>
              <span className="mono" style={{ color: 'var(--mute-2)' }}>{c}</span>
              <EEGLine width={210} height={28} seed={i+10} speed={0.8 + i*0.1} amp={(active === 'foot' && i === 5 ? 1.6 : active === 'left' && i === 0 ? 1.6 : 1) * (1 + noise/40)} color={noise > 50 ? 'rgba(255,122,122,0.85)' : 'rgba(76,240,255,0.85)'} glow={false} dense={false} />
            </div>
          ))}
        </div>

        {/* COL 2: feature extraction */}
        <div style={{ padding: '20px', borderRight: '1px solid var(--line)' }}>
          <Stage label="02" title="Features" sub="spectral bands" />
          {features.map((f, i) => (
            <div key={f.band} style={{ marginBottom: 16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--mute)' }}>{f.band}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--electric)' }}>{Math.round(f.power)}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(190,210,255,0.08)', borderRadius: 99 }}>
                <div style={{
                  width: `${f.power}%`, height: '100%',
                  background: f.power > 60 ? 'var(--electric)' : 'var(--signal)',
                  borderRadius: 99,
                  transition: 'width 0.8s cubic-bezier(.5,0,.2,1)',
                  boxShadow: f.power > 60 ? '0 0 10px var(--electric)' : 'none',
                }} />
              </div>
            </div>
          ))}
          {/* spectrogram visualization */}
          <SpectrogramMini active={active} />
        </div>

        {/* COL 3: classifier diagram */}
        <div style={{ padding: '20px', borderRight: '1px solid var(--line)' }}>
          <Stage label="03" title="Classifier" sub="recurrent neural net" />
          <NeuralNetMini active={active} />
        </div>

        {/* COL 4: output */}
        <div style={{ padding: '20px' }}>
          <Stage label="04" title="Output" sub="decoded intent" />
          {out.map((o, i) => (
            <div key={o.id} style={{
              marginBottom: 8, padding: '10px 12px',
              border: `1px solid ${o.id === active ? 'rgba(76,240,255,0.5)' : 'var(--line)'}`,
              background: o.id === active ? 'rgba(76,240,255,0.07)' : 'transparent',
              borderRadius: 8,
              transition: 'all 0.4s ease',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: o.id === active ? 'var(--electric)' : 'var(--mute)' }}>
                  <span style={{ fontSize: 14, marginRight: 6 }}>{o.emoji}</span>{o.label}
                </span>
                <span className="mono" style={{ color: o.id === active ? 'var(--electric)' : 'var(--mute-2)', fontSize: 11 }}>{Math.round(o.p * 100)}%</span>
              </div>
              <div style={{ height: 2, background: 'rgba(190,210,255,0.08)', borderRadius: 99 }}>
                <div style={{
                  width: `${o.p * 100}%`, height: '100%',
                  background: o.id === active ? 'var(--electric)' : 'var(--mute-2)',
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          ))}
          {/* device action */}
          <div style={{ marginTop: 22, padding: '14px 16px', border: '1px solid var(--line-2)', borderRadius: 8, background: 'var(--void-2)' }}>
            <div className="mono" style={{ color: 'var(--mute-2)', marginBottom: 6 }}>device command →</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--electric)' }}>
              {active === 'left'  && 'cursor.move(-1, 0)'}
              {active === 'right' && 'cursor.move(+1, 0)'}
              {active === 'foot'  && 'wheelchair.forward()'}
              {active === 'speech'&& 'tts.speak("hello")'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--line)', padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span className="mono" style={{ color: 'var(--mute)', whiteSpace: 'nowrap' }}>NOISE</span>
          <input type="range" min="0" max="80" value={noise} onChange={e => setNoise(+e.target.value)}
                 style={{ flex: 1, accentColor: noise > 50 ? 'var(--danger)' : 'var(--electric)', maxWidth: 220 }} />
          <span className="mono" style={{ color: noise > 50 ? 'var(--danger)' : noise > 25 ? 'var(--warn)' : 'var(--electric)', minWidth: 36, textAlign:'right' }}>{noise}%</span>
          <span className="mono" style={{ color: 'var(--mute-2)', fontSize: 10 }}>drag to add interference</span>
        </div>
        <div style={{ display:'flex', gap: 8, flexWrap: 'wrap', justifyContent:'flex-end' }}>
          {intents.map(i => (
            <button key={i.id} className="chip" onClick={() => setActive(i.id)} style={{
              borderColor: active === i.id ? 'rgba(76,240,255,0.5)' : 'var(--line-2)',
              color: active === i.id ? 'var(--electric)' : 'var(--mute)',
              cursor: 'pointer',
            }}>
              <span className="dot" style={{ background: active === i.id ? 'var(--electric)' : 'var(--mute-2)' }} />
              {i.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stage({ label, title, sub }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="mono" style={{ color: 'var(--electric)', marginBottom: 6 }}>{label} / 04</div>
      <div style={{ fontFamily:'var(--serif)', fontSize: 22, lineHeight: 1.1 }}>{title}</div>
      <div className="mono" style={{ color: 'var(--mute-2)', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function SpectrogramMini({ active }) {
  // Tiny faux spectrogram heatmap
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width = 240, H = c.height = 60;
    let t = 0; let raf;
    const draw = () => {
      t += 0.06;
      // shift left
      const img = ctx.getImageData(2, 0, W - 2, H);
      ctx.putImageData(img, 0, 0);
      // new column at right
      for (let y = 0; y < H; y++) {
        const freq = y / H;
        const seedAmp =
          active === 'left'   ? Math.exp(-Math.pow(freq - 0.2, 2) * 30) :
          active === 'right'  ? Math.exp(-Math.pow(freq - 0.45, 2) * 30) :
          active === 'foot'   ? Math.exp(-Math.pow(freq - 0.1, 2) * 30) :
                                Math.exp(-Math.pow(freq - 0.75, 2) * 30);
        const v = seedAmp * (0.6 + 0.4 * Math.sin(t + freq * 8)) + (Math.random() * 0.1);
        const a = Math.max(0, Math.min(1, v));
        ctx.fillStyle = `rgba(76,240,255,${a * 0.9})`;
        ctx.fillRect(W - 2, y, 2, 1);
      }
      raf = requestAnimationFrame(draw);
    };
    ctx.fillStyle = 'rgba(7,16,30,1)'; ctx.fillRect(0, 0, W, H);
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return (
    <div style={{ marginTop: 14 }}>
      <div className="mono" style={{ color: 'var(--mute-2)', marginBottom: 6 }}>spectrogram · M1</div>
      <canvas ref={ref} style={{ width: '100%', height: 60, borderRadius: 6, border: '1px solid var(--line)' }} />
    </div>
  );
}

function NeuralNetMini({ active }) {
  // Three-layer net animation; activation based on `active`
  const layers = [
    [0,1,2,3,4,5], // input (channels)
    [0,1,2,3,4,5,6,7], // hidden
    [0,1,2,3], // output (4 classes)
  ];
  const W = 280, H = 280;
  const xs = [40, 140, 240];
  const ys = layers.map((l, li) => l.map((_, i) => 32 + (i + 0.5) * (H - 64) / l.length));

  // map active to highlight output index
  const outIdx = { left: 0, right: 1, foot: 2, speech: 3 }[active];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow:'visible' }}>
      {/* edges */}
      {layers[0].map((_, i) =>
        layers[1].map((__, j) => (
          <line key={`e0-${i}-${j}`}
            x1={xs[0]} y1={ys[0][i]} x2={xs[1]} y2={ys[1][j]}
            stroke="rgba(108,160,255,0.18)" strokeWidth="0.6" />
        ))
      )}
      {layers[1].map((_, j) =>
        layers[2].map((__, k) => {
          const hot = k === outIdx;
          return (
            <line key={`e1-${j}-${k}`}
              x1={xs[1]} y1={ys[1][j]} x2={xs[2]} y2={ys[2][k]}
              stroke={hot ? 'rgba(76,240,255,0.6)' : 'rgba(108,160,255,0.18)'}
              strokeWidth={hot ? 1.2 : 0.6} />
          );
        })
      )}
      {/* nodes */}
      {layers[0].map((_, i) => (
        <circle key={`n0-${i}`} cx={xs[0]} cy={ys[0][i]} r="4" fill="var(--signal)" />
      ))}
      {layers[1].map((_, j) => (
        <circle key={`n1-${j}`} cx={xs[1]} cy={ys[1][j]} r="4.5"
          fill="rgba(76,240,255,0.6)" stroke="var(--electric)" strokeWidth="0.5" />
      ))}
      {layers[2].map((_, k) => {
        const hot = k === outIdx;
        return (
          <g key={`n2-${k}`}>
            <circle cx={xs[2]} cy={ys[2][k]} r={hot ? 8 : 5}
              fill={hot ? '#4cf0ff' : 'rgba(108,160,255,0.4)'} />
            {hot && <circle cx={xs[2]} cy={ys[2][k]} r="14" fill="none" stroke="#4cf0ff" opacity="0.4">
              <animate attributeName="r" from="8" to="18" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="1.4s" repeatCount="indefinite" />
            </circle>}
          </g>
        );
      })}
      {/* labels */}
      <text x={xs[0]} y={H - 6} textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--mute-2)">channels</text>
      <text x={xs[1]} y={H - 6} textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--mute-2)">hidden</text>
      <text x={xs[2]} y={H - 6} textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--mute-2)">class</text>
    </svg>
  );
}

function Section4() {
  return (
    <section className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(106,160,255,0.025), transparent)' }}>
      <div className="container">
        <SectionHeader
          num="04"
          title='Teaching a computer to <em>read your mind.</em>'
          sub="Recording is half the job. The other half is figuring out what a pattern of firings means. The trick is to train a model to recognize it, the same way you would train one to recognize a face."
        />
        <Reveal>
          <DecoderDemo />
        </Reveal>
        <div style={{ display:'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, marginTop: 80 }}>
          {[
            { stat:'2D', label:'cursor control', detail:'Early systems hit 70–80% accuracy moving a cursor in two dimensions.' },
            { stat:'3D', label:'robotic arms', detail:'More recent systems guide arms to reach for objects in 3D space.' },
            { stat:'90', label:'characters/min', detail:<>A 2021 BrainGate participant typed by imagining handwriting — approaching smartphone texting speed.<FN n={7}/></> },
            { stat:'62', label:'words/min · speech', detail:<>Speech BCIs decode attempted speech directly from cortex, in near-real time.<FN n={8}/></> },
          ].map((m, i) => (
            <Reveal key={m.stat} delay={i * 80}>
              <div style={{ borderTop: '1px solid var(--electric)', paddingTop: 16 }}>
                <div style={{ fontFamily:'var(--serif)', fontSize: 56, lineHeight: 1, color: 'var(--electric)' }}>{m.stat}</div>
                <div className="mono" style={{ color: 'var(--text)', marginTop: 6 }}>{m.label}</div>
                <div className="body" style={{ fontSize: 13, marginTop: 8 }}>{m.detail}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="body" style={{ marginTop: 80, maxWidth: 760, fontSize: 17 }}>
            Underneath all of this sits one concept: <strong>neuroplasticity.</strong> Patients who use BCIs regularly show <em style={{color:'var(--text)', fontStyle:'italic'}}>improvements</em> in signal quality over time, because their brain adapts to aim its signals at the decoder. The brain learns to speak the machine&rsquo;s language. The decoder learns the patient&rsquo;s brain. They meet in the middle.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 5 — What can BCIs actually do?
function UseCaseCard({ num, title, sub, bullets, viz, accent }) {
  const [ref, hov] = useHover();
  return (
    <div ref={ref} style={{
      border: '1px solid var(--line)',
      borderRadius: 14,
      padding: '28px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))',
      transition: 'all 0.4s ease',
      transform: hov ? 'translateY(-4px)' : 'translateY(0)',
      borderColor: hov ? accent : 'var(--line)',
    }}>
      <div className="mono" style={{ color: accent, marginBottom: 12 }}>{num} / 03 · USE CASE</div>
      <h3 className="h3" style={{ fontSize: 30, marginBottom: 6 }}>{title}</h3>
      <p className="body" style={{ fontSize: 14, marginBottom: 22 }}>{sub}</p>
      <div style={{ height: 160, marginBottom: 22, position:'relative' }}>{viz}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {bullets.map((b, i) => (
          <li key={i} className="body" style={{ fontSize: 13, paddingLeft: 16, position:'relative', marginBottom: 6 }}>
            <span style={{ position:'absolute', left: 0, top: 8, width: 6, height: 6, background: accent, borderRadius: 2 }} />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function useHover() {
  const ref = useRef(null);
  const [h, setH] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const enter = () => setH(true); const leave = () => setH(false);
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); };
  }, []);
  return [ref, h];
}

function CommunicationViz() {
  const phrases = ['hello.', 'i love you.', 'thank you.', 'water, please.', "i'm here."];
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let i = 0; let raf;
    const cur = phrases[idx];
    const step = () => {
      i++;
      setTyped(cur.slice(0, i));
      if (i < cur.length) raf = setTimeout(step, 80 + Math.random() * 60);
      else raf = setTimeout(() => setIdx(x => (x + 1) % phrases.length), 1600);
    };
    raf = setTimeout(step, 200);
    return () => clearTimeout(raf);
  }, [idx]);
  // Reset when idx changes
  useEffect(() => { setTyped(''); }, [idx]);
  return (
    <div style={{ height: '100%', display:'flex', flexDirection:'column', justifyContent:'center', background: 'var(--void-2)', borderRadius: 8, border: '1px solid var(--line)', padding: '16px 18px' }}>
      <div className="mono" style={{ color: 'var(--mute-2)', marginBottom: 10 }}>typing · thought-to-text</div>
      <div style={{ fontFamily:'var(--serif)', fontSize: 32, color: 'var(--electric)', minHeight: '1.2em' }}>
        {typed}<span style={{ animation:'blink 1s steps(2) infinite' }}>|</span>
      </div>
      <div style={{ marginTop: 'auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span className="mono" style={{ color: 'var(--mute-2)' }}>brainGate · home use</span>
        <span className="mono" style={{ color: 'var(--electric)' }}>{Math.round((typed.length / Math.max(phrases[idx].length, 1)) * 90)} cpm</span>
      </div>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

function ArmViz() {
  // animated arm reaching for cube
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => { setT(v => (v + 0.012) % 1); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const easeInOut = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const phase = easeInOut((Math.sin(t * Math.PI * 2) + 1) / 2);
  // arm position
  const sx = 30, sy = 30;
  const ex = 30 + phase * 140;
  const ey = 30 + phase * 90;
  return (
    <div style={{ height: '100%', background: 'var(--void-2)', borderRadius: 8, border: '1px solid var(--line)', padding: 12, position:'relative' }}>
      <div className="mono" style={{ color: 'var(--mute-2)', position:'absolute', top: 12, left: 14 }}>FES · grasp</div>
      <svg viewBox="0 0 220 140" width="100%" height="100%">
        {/* target object */}
        <rect x="160" y="100" width="22" height="22" fill="none" stroke="var(--electric)" strokeWidth="1.2" />
        <rect x="160" y="100" width="22" height="22" fill={phase > 0.85 ? 'rgba(76,240,255,0.18)' : 'transparent'} />
        {/* shoulder */}
        <circle cx={sx} cy={sy} r="3" fill="var(--electric)" />
        {/* arm segments */}
        <line x1={sx} y1={sy} x2={(sx+ex)/2} y2={(sy+ey)/2 - 18} stroke="var(--electric)" strokeWidth="2" />
        <line x1={(sx+ex)/2} y1={(sy+ey)/2 - 18} x2={ex} y2={ey} stroke="var(--electric)" strokeWidth="2" />
        {/* gripper */}
        <g transform={`translate(${ex},${ey})`}>
          <line x1="0" y1="0" x2="14" y2="-8" stroke="var(--electric)" strokeWidth="1.4" />
          <line x1="0" y1="0" x2="14" y2="8" stroke="var(--electric)" strokeWidth="1.4" />
        </g>
        {/* signal back to brain */}
        <text x="14" y="22" fontFamily="var(--mono)" fontSize="9" fill="var(--mute-2)">cortex</text>
        <text x="184" y="98" fontFamily="var(--mono)" fontSize="9" fill="var(--mute-2)" textAnchor="end">target</text>
      </svg>
    </div>
  );
}

function PainViz() {
  // closed-loop: detect pain signature, deliver counter-stim
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => { setT(v => v + 0.025); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  // pain signal = bursts; counter stim activates when burst threshold crossed
  const W = 220, H = 130, N = 200;
  let painPath = '';
  let stimPath = '';
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * W;
    const u = (i / N) * 8 + t;
    const burst = Math.max(0, Math.sin(u * 0.4)) * 16;
    const y = 40 + Math.sin(u * 2) * 4 + (Math.random() - 0.5) * 2 - burst;
    painPath += (i === 0 ? 'M' : 'L') + x + ',' + y + ' ';
    const stim = burst > 8 ? (Math.sin(u * 12) * 8) : 0;
    const sy = 100 + stim;
    stimPath += (i === 0 ? 'M' : 'L') + x + ',' + sy + ' ';
  }
  return (
    <div style={{ height: '100%', background: 'var(--void-2)', borderRadius: 8, border: '1px solid var(--line)', padding: 12, position:'relative' }}>
      <div className="mono" style={{ color: 'var(--mute-2)', position:'absolute', top: 12, left: 14 }}>closed loop · detect → counter-stim</div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <text x="14" y="42" fontFamily="var(--mono)" fontSize="9" fill="var(--danger)">pain</text>
        <text x="14" y="115" fontFamily="var(--mono)" fontSize="9" fill="var(--electric)">stim</text>
        <line x1="0" y1="70" x2={W} y2="70" stroke="var(--line)" strokeDasharray="2 4" />
        <path d={painPath} stroke="var(--danger)" strokeWidth="1.4" fill="none" />
        <path d={stimPath} stroke="var(--electric)" strokeWidth="1.4" fill="none" />
      </svg>
    </div>
  );
}

function Section5() {
  return (
    <section id="do" className="section">
      <div className="container">
        <SectionHeader
          num="05"
          title='From the lab to <em>real life.</em>'
          sub="Three places BCIs are working today for people with paralysis. Most success has been in communication. Motor restoration and pain management are catching up fast."
        />
        <div style={{ display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <Reveal>
            <UseCaseCard num="01" title="Communication" accent="var(--electric)"
              sub="The strongest, most consistent BCI result: giving voice back to people who can't speak or type."
              viz={<CommunicationViz />}
              bullets={[
                'Cursor control · email · web · text-to-speech',
                'For ALS, locked-in syndrome, high-cervical injury',
                'BrainGate participants use BCIs for thousands of hours at home',
              ]} />
          </Reveal>
          <Reveal delay={120}>
            <UseCaseCard num="02" title="Restoring movement" accent="var(--signal)"
              sub="BCI reads the brain's 'move' command. FES fires the muscles directly, bypassing the spinal injury."
              viz={<ArmViz />}
              bullets={[
                'Pick up objects · pour water · shake hands',
                'Cervical SCI · functional electrical stimulation',
                'Early clinical trials are working, slowly',
              ]} />
          </Reveal>
          <Reveal delay={240}>
            <UseCaseCard num="03" title="Pain management" accent="#9aff9c"
              sub="Closed-loop BCIs detect neural pain signatures and deliver counter-stimulation in real time."
              viz={<PainViz />}
              bullets={[
                'Chronic neuropathic pain, common after SCI',
                'Non-pharmacological alternative to opioids',
                'Emerging area · early but promising',
              ]} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 6 — Brain-Spine Interface (walking again)
function BrainSpineFlow() {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => { setPulse(p => (p + 0.005) % 1); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 5 staged stops with positions
  const W = 1100, H = 540;

  // multi-pulse positions on the main path
  const pathD = 'M 130 120 L 350 120 L 470 220 L 350 350 L 130 350 L 130 460 L 940 460 L 940 220';
  return (
    <div className="panel" style={{ overflow:'hidden' }}>
      <div className="panel__chrome">
        <span className="panel__chrome-name">brain → wireless decoder → spinal stimulator → legs</span>
        <span>Lorach et al., Nature 2023</span>
      </div>
      <div style={{ padding: '40px 20px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow:'visible' }}>
          <defs>
            <filter id="bs-glow"><feGaussianBlur stdDeviation="3" /></filter>
            <linearGradient id="bs-grad" x1="0" x2="1">
              <stop offset="0" stopColor="#4cf0ff" />
              <stop offset="0.5" stopColor="#6aa0ff" />
              <stop offset="1" stopColor="#9aff9c" />
            </linearGradient>
          </defs>

          {/* main flow path — invisible but used as guideline */}
          <path id="bsi-path" d={pathD} stroke="rgba(190,210,255,0.18)" strokeWidth="1" fill="none" strokeDasharray="2 4" />

          {/* travelling pulses along path */}
          {[0, 0.18, 0.36, 0.54, 0.72].map(off => (
            <PathPulse key={off} t={(pulse + off) % 1} />
          ))}

          {/* Stop 1: brain / cortex electrode */}
          <Station x={130} y={120} title="01 · CORTEX" sub="implanted array · M1"
            renderInside={(
              <g stroke="var(--electric)" strokeWidth="1.2" fill="none">
                <ellipse cx="0" cy="0" rx="22" ry="18" />
                {[0,1,2,3].map(i => [0,1,2,3].map(j => (
                  <rect key={`e-${i}-${j}`} x={-12 + i * 6} y={-10 + j * 6} width="2" height="2" fill="var(--electric)" stroke="none" />
                )))}
              </g>
            )}
          />

          {/* Stop 2: wireless transmitter */}
          <Station x={350} y={120} title="02 · TRANSMIT" sub="wireless · through skin"
            renderInside={(
              <g stroke="var(--electric)" strokeWidth="1.2" fill="none">
                <circle cx="0" cy="0" r="6" />
                <path d="M -10 -2 Q 0 -14, 10 -2" />
                <path d="M -16 -4 Q 0 -22, 16 -4" />
                <path d="M -22 -6 Q 0 -30, 22 -6" />
              </g>
            )}
          />

          {/* Stop 3: decoder (laptop-ish) */}
          <Station x={470} y={220} title="03 · DECODER" sub="real-time inference"
            renderInside={(
              <g stroke="var(--electric)" strokeWidth="1.2" fill="none">
                <rect x="-18" y="-12" width="36" height="22" rx="2" />
                <line x1="-12" y1="-5" x2="12" y2="-5" stroke="rgba(76,240,255,0.6)" strokeWidth="0.8" />
                <line x1="-12" y1="0" x2="6" y2="0" stroke="rgba(76,240,255,0.6)" strokeWidth="0.8" />
                <line x1="-12" y1="5" x2="10" y2="5" stroke="rgba(76,240,255,0.6)" strokeWidth="0.8" />
              </g>
            )}
          />

          {/* Stop 4: command radio back */}
          <Station x={350} y={350} title="04 · COMMAND" sub="walk pattern → spine"
            renderInside={(
              <g stroke="var(--signal)" strokeWidth="1.2" fill="none">
                <path d="M -18 0 L 18 0" />
                <path d="M 10 -6 L 18 0 L 10 6" />
                <text x="0" y="-12" textAnchor="middle" fontFamily="var(--mono)" fontSize="8" fill="var(--signal)">STEP</text>
              </g>
            )}
          />

          {/* Stop 5: spinal stim */}
          <Station x={130} y={350} title="05 · STIM" sub="epidural · lumbar"
            renderInside={(
              <g stroke="var(--signal)" strokeWidth="1.2" fill="none">
                <rect x="-14" y="-8" width="28" height="16" rx="2" />
                {[0,1,2,3].map(i => <circle key={i} cx={-10 + i * 6.5} cy="0" r="1.4" fill="var(--signal)" />)}
              </g>
            )}
          />

          {/* Stop 6: muscles (legs walking) */}
          <Station x={940} y={460} title="06 · MUSCLES" sub="contract in sequence" muted
            renderInside={(
              <WalkingLegs phase={pulse} />
            )}
          />

          {/* Stop 7: recovery feedback (closed loop) */}
          <Station x={940} y={220} title="07 · RECOVERY" sub="nervous system rewires" muted accent="#9aff9c"
            renderInside={(
              <g stroke="#9aff9c" strokeWidth="1.2" fill="none">
                <circle cx="0" cy="0" r="14" />
                <path d="M -7 0 Q 0 -8, 7 0 Q 0 8, -7 0" />
                <path d="M -3 -3 L 3 3 M 3 -3 L -3 3" />
              </g>
            )}
          />
        </svg>
      </div>
    </div>
  );
}

function Station({ x, y, title, sub, renderInside, muted, accent }) {
  const stroke = muted ? 'rgba(190,210,255,0.25)' : (accent || 'rgba(76,240,255,0.7)');
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r="46" fill="rgba(76,240,255,0.04)" stroke={stroke} strokeWidth="1" strokeDasharray="2 4" />
      <circle r="34" fill="var(--void-2)" stroke={stroke} strokeWidth="1.2" />
      {renderInside}
      <text y="64" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" letterSpacing="2" fill="var(--text)">{title}</text>
      <text y="80" textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--mute)">{sub}</text>
    </g>
  );
}

function PathPulse({ t }) {
  const [pos, setPos] = useState({ x: 130, y: 120 });
  useEffect(() => {
    const p = document.getElementById('bsi-path');
    if (!p) return;
    const len = p.getTotalLength();
    const pt = p.getPointAtLength(t * len);
    setPos({ x: pt.x, y: pt.y });
  }, [t]);
  return (
    <g>
      <circle cx={pos.x} cy={pos.y} r="10" fill="#4cf0ff" opacity="0.15" />
      <circle cx={pos.x} cy={pos.y} r="3" fill="#9af9ff" />
    </g>
  );
}

function WalkingLegs({ phase }) {
  // tiny walking legs SVG
  const cycle = (phase * 6) % 1;
  const a = Math.sin(cycle * Math.PI * 2) * 24; // hip angle
  const a2 = -a;
  return (
    <g stroke="#9aff9c" strokeWidth="1.4" fill="none">
      {/* hips */}
      <circle cx="0" cy="-10" r="2" fill="#9aff9c" />
      {/* left leg */}
      <g transform={`rotate(${a})`}>
        <line x1="0" y1="-10" x2="0" y2="6" />
        <line x1="0" y1="6" x2={Math.sin(cycle * Math.PI * 2 + Math.PI/4) * 4} y2="18" />
      </g>
      {/* right leg */}
      <g transform={`rotate(${a2})`}>
        <line x1="0" y1="-10" x2="0" y2="6" />
        <line x1="0" y1="6" x2={Math.sin(cycle * Math.PI * 2 + 5*Math.PI/4) * 4} y2="18" />
      </g>
    </g>
  );
}

function Section6() {
  return (
    <section id="walk" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(154,255,156,0.025), transparent)' }}>
      <div className="container">
        <SectionHeader
          num="06"
          eyebrow="The Breakthrough"
          title='A paralyzed man walked again. The system <em>might be healing him.</em>'
          sub="In 2023, a Nature paper described something that would have seemed impossible a decade ago: a wireless brain-spine interface let a paralyzed man walk naturally, and may be helping his nervous system rewire itself."
        />
        <Reveal>
          <BrainSpineFlow />
        </Reveal>

        <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 100, alignItems: 'start' }}>
          <Reveal>
            <p className="body">
              The system reads neural signals from the participant&rsquo;s motor cortex, specifically the signals generated when he <em>intends</em> to walk. Those signals are wirelessly decoded in real time, then transmitted to an epidural stimulator implanted near the lumbar spinal cord, below the injury. The stimulator activates muscle groups in the correct sequence<FN n={4}/>.
              <br/><br/>
              The brain&rsquo;s intent. Over the injury. Directly to the legs. The participant didn&rsquo;t just walk in a lab. He climbed stairs. He crossed uneven ground. After months of rehab, he began showing signs of neurological <em style={{color:'var(--text)', fontStyle:'italic'}}>recovery</em>, which means the system may not just be compensating for the injury, but helping the nervous system rewire itself.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <blockquote className="pullquote">
              The system didn&rsquo;t just help him walk. It may have helped his nervous system start to heal.
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Section4, Section5, Section6, DecoderDemo, BrainSpineFlow, useHover });
