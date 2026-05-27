// Hero — animated neural network background + editorial headline
function NeuralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf, t = 0;
    let nodes = [];
    let pulses = []; // travelling pulses along edges

    const resize = () => {
      const r = cvs.getBoundingClientRect();
      W = r.width; H = r.height;
      cvs.width = W * dpr; cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // seed nodes
      const count = Math.floor((W * H) / 18000);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.3 + 0.6,
        f: Math.random() * 0.6 + 0.4, // firing phase
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -9999, y: -9999, active: false };
    const onMove = (e) => {
      const r = cvs.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; mouse.x = mouse.y = -9999; };
    cvs.addEventListener('mousemove', onMove);
    cvs.addEventListener('mouseleave', onLeave);

    // spawn pulse between two nodes
    const spawnPulse = (i, j) => {
      pulses.push({ i, j, t: 0, speed: 0.6 + Math.random() * 0.8 });
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      // move nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // Edges — connect close-enough pairs; mouse attracts
      const maxD = 130;
      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxD) edges.push([i, j, d]);
        }
      }

      // Draw edges
      for (const [i, j, d] of edges) {
        const a = nodes[i], b = nodes[j];
        const alpha = (1 - d / maxD) * 0.22;
        // boost lines near mouse
        let glow = 0;
        if (mouse.active) {
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const md = Math.hypot(mx - mouse.x, my - mouse.y);
          if (md < 160) glow = (1 - md / 160) * 0.55;
        }
        ctx.strokeStyle = `rgba(108,160,255,${alpha + glow * 0.6})`;
        ctx.lineWidth = 0.6 + glow * 1.4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // occasionally spawn a pulse on a random edge
      if (Math.random() < 0.12 && edges.length) {
        const [i, j] = edges[Math.floor(Math.random() * edges.length)];
        spawnPulse(i, j);
      }

      // Draw nodes
      for (const n of nodes) {
        const firing = 0.5 + 0.5 * Math.sin(t * 1.8 + n.f * 10);
        const mD = mouse.active ? Math.hypot(n.x - mouse.x, n.y - mouse.y) : 9999;
        const near = mD < 140 ? (1 - mD / 140) : 0;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + near * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(76,240,255,${0.35 + firing * 0.25 + near * 0.5})`;
        ctx.fill();
        if (near > 0.5) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 8 + near * 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(76,240,255,${0.04 + near * 0.07})`;
          ctx.fill();
        }
      }

      // Advance pulses
      pulses = pulses.filter(p => p.t < 1);
      for (const p of pulses) {
        p.t += 0.025 * p.speed;
        const a = nodes[p.i], b = nodes[p.j];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = '#9af9ff';
        ctx.shadowColor = '#4cf0ff';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      cvs.removeEventListener('mousemove', onMove);
      cvs.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

function Hero() {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      paddingBottom: 80, overflow: 'hidden',
      borderBottom: '1px solid var(--line)',
    }}>
      {/* background neural canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <NeuralCanvas />
        {/* radial vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, transparent 30%, var(--void) 95%)',
          pointerEvents: 'none',
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* meta row */}
        <Reveal>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 60, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--mute)' }}>
            <span>An interactive essay · AP Bio · 2026</span>
            <span style={{ display:'flex', gap: 16, alignItems:'center' }}>
              <span className="chip"><span className="dot" />signal: live</span>
              <span>SCROLL ↓</span>
            </span>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <Eyebrow>Brain-Computer Interfaces · Paralysis · Restoration</Eyebrow>
        </Reveal>

        <Reveal delay={200}>
          <h1 className="display" style={{
            fontSize: 'clamp(56px, 10vw, 152px)',
            margin: '28px 0 0',
            maxWidth: '14ch',
          }}>
            What if you could move <em>again</em>, <span className="muted">just by thinking?</span>
          </h1>
        </Reveal>

        <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: 60, marginTop: 60, alignItems: 'end' }}>
          <Reveal delay={280}>
            <p className="lead" style={{ maxWidth: 560 }}>
              For millions of people living with paralysis, the brain is intact. It still fires the signal to move, to type, to take a step. The cable to the body is what got cut. <strong style={{color:'var(--text)'}}>Brain-computer interfaces</strong> intercept those signals, learn what they mean, and route them around the damage.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="panel" style={{ maxWidth: 420, justifySelf: 'end' }}>
              <div className="panel__chrome">
                <span className="panel__chrome-name">cortex.recording · M1</span>
                <span>32ch · 30kHz</span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <EEGLine width={380} height={56} speed={1.2} seed={1} />
                <EEGLine width={380} height={56} speed={0.9} seed={3} color="var(--signal)" />
                <EEGLine width={380} height={56} speed={1.4} seed={5} color="var(--electric)" amp={0.7} />
                <div style={{ display:'flex', justifyContent:'space-between', marginTop: 6, fontFamily:'var(--mono)', fontSize: 10, color: 'var(--mute-2)' }}>
                  <span>0s</span><span>/</span><span>2s</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, NeuralCanvas });
