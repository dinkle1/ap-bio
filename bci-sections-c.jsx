// SECTIONS 7, 8, 9, CLOSING, BIBLIOGRAPHY

// =============================================================================
// SECTION 7 — Limitations: honest gap analysis
function Section7() {
  const limits = [
    { k:'Signal degradation', curr: 60, gap: 40, body:<>Implanted arrays slowly get walled off by scar tissue. Even working BrainGate arrays show meaningful signal loss over years<FN n={3} />.</> },
    { k:'The surgery problem', curr: 25, gap: 75, body:'Every implanted BCI still requires brain surgery. That is a high bar for a technology meant to help severely disabled people.' },
    { k:'Training burden',     curr: 45, gap: 55, body:'Hours of calibration before first use. The amount varies wildly between individuals, and we do not know why.' },
    { k:'Coverage gaps',       curr: 35, gap: 65, body:'Discrete movements: largely solved. Continuous, fluid coordination, like walking naturally for an hour or playing piano, is much harder.' },
    { k:'Cost & access',       curr: 15, gap: 85, body:'Hundreds of thousands of dollars per system. They exist almost exclusively in research settings today.' },
  ];

  return (
    <section id="limits" className="section">
      <div className="container">
        <SectionHeader
          num="07"
          title='The hard problems we <em>haven&rsquo;t solved.</em>'
          sub="BCIs are severely limited. The bars below show roughly where the field is on each problem, against what it would need to be for a real consumer product."
        />
        <Reveal>
          <div className="panel" style={{ padding: '28px 32px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 24, fontFamily:'var(--mono)', fontSize: 11, letterSpacing:'0.16em', textTransform:'uppercase' }}>
              <span style={{ color: 'var(--electric)' }}>● where we are</span>
              <span style={{ color: 'var(--mute-2)' }}>○ how far to go</span>
            </div>
            {limits.map((l, i) => (
              <Reveal key={l.k} delay={i * 80}>
                <LimitRow data={l} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LimitRow({ data }) {
  return (
    <div style={{
      display:'grid', gridTemplateColumns: '260px 1fr 1fr',
      gap: 32, alignItems:'center',
      padding: '20px 0', borderTop: '1px solid var(--line)',
    }}>
      <div>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: 0, fontWeight: 400 }}>{data.k}</h3>
      </div>
      <div>
        <div style={{ display:'flex', alignItems:'center', height: 26, position: 'relative' }}>
          <div style={{ width:'100%', height: 4, background: 'rgba(190,210,255,0.06)', borderRadius: 99, position:'relative' }}>
            <div style={{ width: `${data.curr}%`, height: '100%', background: 'var(--electric)', borderRadius: 99, boxShadow:'0 0 12px var(--electric)' }} />
            <div style={{ position:'absolute', left: `${data.curr}%`, top: -4, width: 12, height: 12, marginLeft: -6, borderRadius: '50%', background: 'var(--electric)', boxShadow:'0 0 12px var(--electric)' }} />
            {/* gap markers */}
            <div style={{ position:'absolute', left:`${data.curr}%`, right: 0, top:-2, height: 8, borderTop: '1px dashed rgba(190,210,255,0.3)' }} />
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop: 6, fontFamily:'var(--mono)', fontSize: 10, color: 'var(--mute-2)' }}>
          <span>{data.curr}% there</span>
          <span>{data.gap}% to go</span>
        </div>
      </div>
      <div>
        <p className="body" style={{ fontSize: 14, margin: 0 }}>{data.body}</p>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION 8 — Ethics: who owns your brain data?
function EthicsPanel() {
  const items = [
    { q:'Who owns your neural data?', a:'Most countries have no laws addressing neural data privacy. Only a handful of U.S. states have begun to as well (Boonstra, 2025). As this field continues to evolve, more laws need to be put in place to ensure that personal data is safe.' },
    { q:'What happens when the company shuts down?', a:'Not hypothetical. In 2024, Neuralink faced scrutiny over long-term device support after thread retraction in the first patient raised durability questions. If you have an implant and the maker goes bankrupt, who maintains it? Who removes it safely? These are some of the questions that need to be answered before BCIs become widely available for public use.' },
    { q:'Is "voluntary consent" really voluntary?', a:'People with severe paralysis are often desperate. When a BCI is your only hope of communicating with your family, the line between hope and informed consent gets blurry. Bioethicists call this "therapeutic misconception".', n:5 },
    { q:'What about enhancement?', a:'Once BCIs reliably restore function in injured people, the next question is whether they should also enhance healthy ones. Better memory, faster reaction time or possibly even brain-to-brain communication are all now possible, however is this ethical for the evolution of the human race?' },
  ];
  const [open, setOpen] = useState(0);
  return (
    <div className="panel" style={{ overflow:'hidden' }}>
      <div className="panel__chrome">
        <span className="panel__chrome-name">unresolved · open questions</span>
        <span>{items.length} questions science can&rsquo;t answer alone</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns: '1fr 1.4fr' }}>
        <div style={{ borderRight: '1px solid var(--line)' }}>
          {items.map((it, i) => (
            <button key={i} onClick={() => setOpen(i)} style={{
              display:'block', textAlign:'left', width:'100%',
              padding: '24px 28px',
              borderBottom: i < items.length - 1 ? '1px solid var(--line)' : '0',
              background: open === i ? 'rgba(76,240,255,0.05)' : 'transparent',
              color: 'inherit', cursor:'pointer',
              borderLeft: `2px solid ${open === i ? 'var(--electric)' : 'transparent'}`,
              transition: 'all 0.25s ease',
            }}>
              <div className="mono" style={{ color: open === i ? 'var(--electric)' : 'var(--mute-2)', marginBottom: 8 }}>Q.0{i+1}</div>
              <div style={{ fontFamily:'var(--serif)', fontSize: 22, lineHeight: 1.1, color: open === i ? 'var(--text)' : 'var(--mute)' }}>{it.q}</div>
            </button>
          ))}
        </div>
        <div style={{ padding: '40px 44px', position:'relative', minHeight: 420 }}>
          <div className="mono" style={{ color: 'var(--electric)', marginBottom: 16 }}>OPEN QUESTION · 0{open+1}</div>
          <h3 className="h3" style={{ fontSize: 36, marginBottom: 22, maxWidth: 560 }}>{items[open].q}</h3>
          <p className="body" style={{ fontSize: 17, maxWidth: 560 }}>
            {items[open].a}
            {items[open].n && <FN n={items[open].n} />}
          </p>
          {/* decorative scan */}
          <EthicsBg />
        </div>
      </div>
    </div>
  );
}

function EthicsBg() {
  // animated scan-lines / glyph in corner
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width = 280, H = c.height = 280;
    let t = 0; let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.02;
      // outer arcs
      ctx.strokeStyle = 'rgba(76,240,255,0.18)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(W/2, H/2, 40 + i * 24, t * (0.2 + i*0.05), t * (0.2 + i*0.05) + Math.PI * 1.4);
        ctx.stroke();
      }
      // center brain glyph
      ctx.fillStyle = 'rgba(76,240,255,0.7)';
      ctx.beginPath();
      ctx.arc(W/2, H/2, 4, 0, Math.PI*2);
      ctx.fill();
      // ticks
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2 + t * 0.3;
        const r1 = 96, r2 = 102;
        ctx.strokeStyle = 'rgba(76,240,255,0.25)';
        ctx.beginPath();
        ctx.moveTo(W/2 + Math.cos(a) * r1, H/2 + Math.sin(a) * r1);
        ctx.lineTo(W/2 + Math.cos(a) * r2, H/2 + Math.sin(a) * r2);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{ position:'absolute', right: 20, bottom: 20, width: 180, height: 180, opacity: 0.6, pointerEvents:'none' }} />;
}

function Section8() {
  return (
    <section id="ethics" className="section">
      <div className="container">
        <SectionHeader
          num="08"
          eyebrow="Ethics"
          title='Who <em>owns</em> your brain data?'
          sub="BCIs don't just raise engineering problems. They raise questions about consent, ownership, and what it means to share the most intimate data a human can produce."
        />
        <Reveal>
          <EthicsPanel />
        </Reveal>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 9 — Timeline of what's next
function Timeline() {
  const eras = [
    {
      label:'TODAY', tag:'2025',
      items:[
        { h:'Wired implants in clinical trials', d:'BrainGate, Synchron, Neuralink, and Onward run small cohort studies with big results.' },
        { h:'Walk-again proofs of concept', d:'Brain-spine interface in <i>Nature</i>. Speech BCIs near texting speed.' },
        { h:'No consumer products yet', d:'Everything is still research, no consumer products yet' },
      ]
    },
    {
      label:'NEAR', tag:'2025–2030',
      items:[
        { h:'Fully wireless, fully implanted', d:'Battery-powered, no cable through skin. Eliminates infection risk.' },
        { h:'>1,000-electrode arrays', d:'10× the channel count of a Utah array. More neurons → finer control.' },
        { h:'Bidirectional BCIs', d:'Not just brain → device, but device → brain. You feel what your hand touches.' },
      ]
    },
    {
      label:'FAR', tag:'2030+',
      items:[
        { h:'High-quality non-invasive', d:'Next-gen EEG, functional ultrasound, and optical methods that work without cutting.' },
        { h:'Neural-data regulation', d:'Laws catch up to brain data the way HIPAA caught up to medical records.' },
        { h:'The enhancement debate', d:'Healthy users want BCIs too. The first real policy fights begin.' },
      ]
    },
  ];
  return (
    <div style={{ position: 'relative' }}>
      {/* timeline line */}
      <div style={{ position:'absolute', left: 0, right: 0, top: 60, height: 1, background:'linear-gradient(90deg, var(--electric), var(--signal), rgba(190,210,255,0.1))' }} />
      <div style={{ display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
        {eras.map((e, i) => (
          <Reveal key={e.label} delay={i * 120}>
            <div>
              <div style={{ position:'relative', minHeight: 110, marginBottom: 16 }}>
                <div style={{ position:'absolute', left: 0, top: 54, width: 14, height: 14, borderRadius: '50%', background: i === 0 ? '#4cf0ff' : '#0a1424', border: '2px solid #4cf0ff', boxShadow: i === 0 ? '0 0 12px var(--electric)' : 'none', marginTop:-7 }} />
                <div style={{ position:'absolute', left: 28, top: 50 }}>
                  <div className="mono" style={{ color: 'var(--electric)' }}>{e.label}</div>
                  <div style={{ fontFamily:'var(--serif)', fontSize: 38, lineHeight: 1.1, marginTop: 4 }}>{e.tag}</div>
                </div>
              </div>
              <div style={{ paddingLeft: 28 }}>
                {e.items.map((it, j) => (
                  <div key={j} style={{ padding: '14px 0', borderTop: '1px solid var(--line)' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.1, marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: it.h }} />
                    <div className="body" style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: it.d }} />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Section9() {
  return (
    <section id="next" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(76,240,255,0.025), transparent)' }}>
      <div className="container">
        <SectionHeader
          num="10"
          title='The next <em>ten years.</em>'
          sub="The BCI field is moving fast, and not always in obvious directions. Here are the frontiers worth watching."
        />
        <Reveal>
          <Timeline />
        </Reveal>
      </div>
    </section>
  );
}

// =============================================================================
// CLOSING
function Closing() {
  return (
    <section className="section" style={{ borderTop:'1px solid var(--line)' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems:'start' }}>
          <Reveal>
            <div>
              <Eyebrow>Why this matters</Eyebrow>
              <h2 className="h2" style={{ marginTop: 18, fontSize: 'clamp(48px, 7vw, 100px)' }}>
                For 5.4 million Americans living with paralysis, recovery has meant <em>learning to live with loss.</em><br/>
                <span style={{color: 'var(--electric)'}}>BCIs propose something different.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div>
              <p className="lead" style={{ marginBottom: 28 }}>
                Restoration. Not adaptation. Not a workaround. Not learning to live with it.
              </p>
              <p className="body">
                But the path from a research lab to a bedside tool is long, expensive, and complicated by questions that go well beyond neuroscience. Who gets access? Who decides what&rsquo;s safe enough? Who protects the most intimate data ever collected about a human being?
                <br/><br/>
                <strong>The science is extraordinary. The questions it raises are even bigger.</strong>
              </p>
              <div style={{ marginTop: 60, padding: '20px 24px', border: '1px solid var(--line)', borderRadius: 10, background: 'rgba(76,240,255,0.04)' }}>
                <div className="mono" style={{ color: 'var(--electric)', marginBottom: 8 }}>BIG NUMBERS</div>
                <div style={{ display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily:'var(--serif)', fontSize: 32, color: 'var(--text)' }}>5.4M</div>
                    <div className="mono" style={{ color: 'var(--mute-2)' }}>U.S. paralysis</div>
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--serif)', fontSize: 32, color: 'var(--text)' }}>~100</div>
                    <div className="mono" style={{ color: 'var(--mute-2)' }}>BCI implant subjects total</div>
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--serif)', fontSize: 32, color: 'var(--text)' }}>2023</div>
                    <div className="mono" style={{ color: 'var(--mute-2)' }}>first walking BSI</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// BIBLIOGRAPHY
function Biblio() {
  const refs = [
    { n:1, a:'Wolpaw, J. R., Birbaumer, N., McFarland, D. J., Pfurtscheller, G., & Vaughan, T. M.', y:'2002',
      t:'Brain–computer interfaces for communication and control.', j:'Clinical Neurophysiology 113(6), 767–791.',
      doi:'10.1016/S1388-2457(02)00057-3', pmid:'12048038',
      url:'https://doi.org/10.1016/S1388-2457(02)00057-3' },
    { n:2, a:'Saibene, A., Caglioni, M., Corchs, S., & Gasparini, F.', y:'2023',
      t:'EEG-based BCIs on motor imagery paradigm using wearable technologies: A systematic review.', j:'Sensors 23(5), 2798.',
      doi:'10.3390/s23052798', pmid:'36905004',
      url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC10007053/' },
    { n:3, a:'Rubin, D. B., Ajiboye, A. B., Barefoot, L., et al.', y:'2023',
      t:'Interim safety profile from the feasibility study of the BrainGate neural interface system.', j:'Neurology 100(11), e1177–e1192.',
      doi:'10.1212/WNL.0000000000201707', pmid:'36639237',
      url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC10074470/' },
    { n:4, a:'Lorach, H., Galvez, A., Spagnolo, V., et al.', y:'2023',
      t:'Walking naturally after spinal cord injury using a brain–spine interface.', j:'Nature 618(7963), 126–133.',
      doi:'10.1038/s41586-023-06094-5', pmid:'37225984',
      url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC10232367/' },
    { n:5, a:'Boonstra, J. T.', y:'2025',
      t:'Ethical imperatives in the commercialization of brain-computer interfaces.', j:'IBRO Neuroscience Reports 19, 718–724.',
      doi:'10.1016/j.ibneur.2025.10.004',
      url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC12553070/' },
    { n:6, a:'Slutzky, M. W.', y:'2019',
      t:'Brain-machine interfaces: Powerful tools for clinical treatment and neuroscientific investigations.', j:'The Neuroscientist 25(2), 139–154.',
      doi:'10.1177/1073858418775355', pmid:'29772957',
      url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC6611552/' },
    { n:7, a:'Willett, F. R., Avansino, D. T., Hochberg, L. R., Henderson, J. M., & Shenoy, K. V.', y:'2021',
      t:'High-performance brain-to-text communication via handwriting.', j:'Nature 593(7858), 249–254.',
      doi:'10.1038/s41586-021-03506-2', pmid:'33981047',
      url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC8163299/' },
    { n:8, a:'Willett, F. R., Kunz, E. M., Fan, C., et al.', y:'2023',
      t:'A high-performance speech neuroprosthesis.', j:'Nature 620(7976), 1031–1036.',
      doi:'10.1038/s41586-023-06377-x', pmid:'37498468',
      url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC10468393/' },
  ];
  return (
    <section id="refs" className="section" style={{ borderTop:'1px solid var(--line)' }}>
      <div className="container">
        <Reveal>
          <Eyebrow>Bibliography</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="h2" style={{ marginTop: 18, marginBottom: 50 }}>References &amp; further reading.</h2>
        </Reveal>
        <Reveal delay={140}>
          <div className="mono" style={{ color: 'var(--mute-2)', marginBottom: 24 }}>
            All sources peer-reviewed · indexed on PubMed or PMC · open-access full-text where noted
          </div>
        </Reveal>
        <div>
          {refs.map((r, i) => (
            <Reveal key={r.n} delay={i * 60}>
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                 style={{ display:'grid', gridTemplateColumns:'80px 1fr 200px', gap: 24,
                          padding: '24px 0', borderTop: '1px solid var(--line)',
                          alignItems:'baseline', transition:'all 0.25s ease' }}
                 onMouseEnter={e => e.currentTarget.style.background = 'rgba(76,240,255,0.03)'}
                 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ fontFamily:'var(--serif)', fontSize: 36, color:'var(--electric)' }}>{r.n}</div>
                <div>
                  <div className="body" style={{ fontSize: 14, color: 'var(--mute)' }}>{r.a} ({r.y})</div>
                  <div style={{ fontFamily:'var(--serif)', fontSize: 22, color: 'var(--text)', marginTop: 4, lineHeight: 1.2 }}>{r.t}</div>
                  <div className="mono" style={{ color: 'var(--mute-2)', marginTop: 8 }}>{r.j}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="mono" style={{ color:'var(--electric)' }}>{r.pmid ? `PMID ${r.pmid}` : 'OPEN ACCESS'}</div>
                  <div className="mono" style={{ color:'var(--mute-2)', marginTop: 4 }}>doi: {r.doi}</div>
                  <div className="mono" style={{ color:'var(--electric)', marginTop: 8 }}>read ↗</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 120, paddingTop: 40, borderTop: '1px solid var(--line)',
                      display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap: 20 }}>
          <div>
            <div className="mono" style={{ color: 'var(--electric)' }}>SIGNAL / PATH</div>
            <div className="body" style={{ fontSize: 13, marginTop: 4 }}>An interactive essay on brain-computer interfaces &amp; paralysis.</div>
          </div>
          <div className="mono" style={{ color: 'var(--mute-2)' }}>AP Biology · End of Year · 2026</div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Section7, Section8, Section9, Closing, Biblio });
