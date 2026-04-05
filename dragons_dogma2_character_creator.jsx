import { useState, useRef, useCallback } from "react";

const HAIR_COLORS = ['#1a0d00','#3d2200','#7a4f1e','#b07530','#d4a853','#f0d090','#e8e0d0','#c0b8b0','#808080','#404040','#d44000','#8b1a1a','#1a1a4e','#2d4a1e'];
const EYE_COLORS = ['#3d2800','#5c3d1e','#8b6914','#4a7a2e','#1e4a3d','#1e3d7a','#3d1e7a','#6b4a8b','#a0a0a0','#c0c8d4'];

const FACE_SLIDERS = [
  {id:'face_width', name:'Largura do Rosto', val:50},
  {id:'face_depth', name:'Profundidade do Rosto', val:50},
  {id:'jaw_width', name:'Largura da Mandíbula', val:45},
  {id:'jaw_height', name:'Altura da Mandíbula', val:50},
  {id:'cheekbone_h', name:'Altura das Maçãs', val:55},
  {id:'cheekbone_w', name:'Largura das Maçãs', val:50},
  {id:'forehead_h', name:'Altura da Testa', val:50},
  {id:'forehead_w', name:'Largura da Testa', val:50},
];
const EYE_SLIDERS = [
  {id:'eye_size', name:'Tamanho dos Olhos', val:50},
  {id:'eye_depth', name:'Profundidade dos Olhos', val:50},
  {id:'eye_spacing', name:'Espaço entre Olhos', val:50},
  {id:'eye_angle', name:'Ângulo dos Olhos', val:50},
  {id:'brow_height', name:'Altura das Sobrancelhas', val:55},
  {id:'brow_thickness', name:'Espessura Sobrancelhas', val:50},
];
const NOSE_SLIDERS = [
  {id:'nose_height', name:'Altura do Nariz', val:50},
  {id:'nose_width', name:'Largura do Nariz', val:50},
  {id:'nose_tip', name:'Ponta do Nariz', val:50},
  {id:'mouth_width', name:'Largura da Boca', val:50},
  {id:'lip_thickness', name:'Volume dos Lábios', val:45},
  {id:'mouth_height', name:'Altura da Boca', val:50},
];
const BODY_SLIDERS = [
  {id:'body_height', name:'Altura', val:55},
  {id:'body_build', name:'Constituição', val:50},
  {id:'muscle_mass', name:'Massa Muscular', val:50},
  {id:'shoulder_w', name:'Largura dos Ombros', val:55},
];
const COLOR_SLIDERS = [
  {id:'skin_tone', name:'Tom da Pele', val:50},
  {id:'skin_texture', name:'Textura da Pele', val:40},
  {id:'wrinkle_depth', name:'Profundidade Rugas', val:20},
  {id:'age', name:'Aparência de Idade', val:30},
];

const ALL_SLIDERS = [...FACE_SLIDERS, ...EYE_SLIDERS, ...NOSE_SLIDERS, ...BODY_SLIDERS, ...COLOR_SLIDERS];
const initSliders = () => Object.fromEntries(ALL_SLIDERS.map(s => [s.id, s.val]));

const gold = '#c8952a';
const dark = '#1a1208';
const parchment = '#e8d5a0';

const styles = {
  wrap: {
    fontFamily: "'Crimson Text', Georgia, serif",
    background: 'linear-gradient(135deg, #1a1208 0%, #2a1f0a 50%, #1a1208 100%)',
    borderRadius: 12,
    overflow: 'hidden',
    color: parchment,
    minHeight: 500,
    border: '1px solid #c8952a44',
  },
  header: {
    background: 'linear-gradient(180deg, #c8952a22 0%, transparent 100%)',
    borderBottom: '1px solid #c8952a55',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    fontFamily: "'Cinzel', serif",
    fontSize: 13,
    fontWeight: 700,
    color: gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  body: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    minHeight: 500,
  },
  sidebar: {
    borderRight: '1px solid #c8952a33',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  main: {
    padding: '20px 24px',
    overflowY: 'auto',
    maxHeight: 600,
  },
  uploadZone: (hasImg) => ({
    border: `1px dashed ${hasImg ? '#c8952a99' : '#c8952a55'}`,
    borderRadius: 8,
    padding: 16,
    textAlign: 'center',
    cursor: 'pointer',
    background: '#c8952a08',
    minHeight: 140,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    position: 'relative',
  }),
  analyzeBtn: (disabled) => ({
    width: '100%',
    padding: '10px',
    background: disabled ? '#6a5018' : 'linear-gradient(135deg, #c8952a, #8a6018)',
    border: 'none',
    borderRadius: 6,
    color: dark,
    fontFamily: "'Cinzel', serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.5,
    cursor: disabled ? 'not-allowed' : 'pointer',
    textTransform: 'uppercase',
    opacity: disabled ? 0.6 : 1,
  }),
  pill: (active) => ({
    fontSize: 10,
    padding: '3px 10px',
    border: `1px solid ${active ? gold : '#c8952a44'}`,
    borderRadius: 20,
    color: active ? gold : '#8a7040',
    cursor: 'pointer',
    fontFamily: "'Cinzel', serif",
    letterSpacing: 0.5,
    background: active ? '#c8952a11' : 'transparent',
  }),
  sectionTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: 10,
    letterSpacing: 3,
    color: gold,
    textTransform: 'uppercase',
    margin: '0 0 14px',
    paddingBottom: 8,
    borderBottom: '1px solid #c8952a33',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  slidersGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px 32px',
    marginBottom: 24,
  },
  status: {
    padding: 12,
    borderRadius: 6,
    border: '1px solid #c8952a33',
    background: '#c8952a08',
    fontSize: 13,
    color: '#8a7040',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  copyBtn: {
    marginTop: 16,
    width: '100%',
    padding: 10,
    background: 'transparent',
    border: '1px solid #c8952a66',
    borderRadius: 6,
    color: gold,
    fontFamily: "'Cinzel', serif",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 2,
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
};

function Slider({ name, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#c8952a99', fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>{name}</span>
        <span style={{ fontSize: 12, color: parchment, fontWeight: 600, minWidth: 24, textAlign: 'right' }}>{value}</span>
      </div>
      <input
        type="range" min={0} max={100} step={1} value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: gold, cursor: 'pointer', height: 3 }}
      />
    </div>
  );
}

function SliderGroup({ title, sliders, values, onChange }) {
  return (
    <>
      <div style={styles.sectionTitle}>
        <span style={{ display:'inline-block', width:4, height:4, background:gold, borderRadius:'50%' }}/>
        {title}
      </div>
      <div style={styles.slidersGrid}>
        {sliders.map(s => (
          <Slider key={s.id} name={s.name} value={values[s.id]} onChange={v => onChange(s.id, v)} />
        ))}
      </div>
      <div style={{ height:1, background:'linear-gradient(90deg,transparent,#c8952a44,transparent)', margin:'4px 0 20px' }}/>
    </>
  );
}

export default function App() {
  const [sliders, setSliders] = useState(initSliders());
  const [hairColor, setHairColor] = useState(HAIR_COLORS[1]);
  const [eyeColor, setEyeColor] = useState(EYE_COLORS[5]);
  const [vocation, setVocation] = useState('Fighter');
  const [gender, setGender] = useState('Masculine');
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMediaType, setImageMediaType] = useState('image/jpeg');
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState('Envie uma foto para gerar os sliders automaticamente');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const supported = ['image/jpeg','image/png','image/gif','image/webp'];
    const mt = supported.includes(file.type) ? file.type : 'image/jpeg';
    setImageMediaType(mt);
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target.result.split(',')[1];
      setImageBase64(b64);
      setImagePreview(ev.target.result);
      setStatus('Foto carregada! Clique em "Analisar Rosto" para gerar os sliders.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(e => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setStatus('');

    const prompt = `You are an expert at Dragon's Dogma 2 character creation. Analyze this face photo and return ONLY a JSON object with numeric values (0-100) for each slider. Return this exact JSON with no other text:
{"face_width":50,"face_depth":50,"jaw_width":45,"jaw_height":50,"cheekbone_h":55,"cheekbone_w":50,"forehead_h":50,"forehead_w":50,"eye_size":50,"eye_depth":50,"eye_spacing":50,"eye_angle":50,"brow_height":55,"brow_thickness":50,"nose_height":50,"nose_width":50,"nose_tip":50,"mouth_width":50,"lip_thickness":45,"mouth_height":50,"body_height":55,"body_build":50,"muscle_mass":50,"shoulder_w":55,"skin_tone":50,"skin_texture":40,"wrinkle_depth":20,"age":30,"hair_color_index":1,"eye_color_index":5}
Analyze: face shape, eye shape/size, nose, lips, skin tone (darker=higher), age, closest hair color index (0-13), closest eye color index (0-9). Gender: ${gender}. Vocation: ${vocation}.`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: imageMediaType, data: imageBase64 } },
              { type: "text", text: prompt }
            ]
          }]
        })
      });

      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.text || '').join('') || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);

      if (parsed.hair_color_index !== undefined)
        setHairColor(HAIR_COLORS[Math.min(parseInt(parsed.hair_color_index), HAIR_COLORS.length-1)]);
      if (parsed.eye_color_index !== undefined)
        setEyeColor(EYE_COLORS[Math.min(parseInt(parsed.eye_color_index), EYE_COLORS.length-1)]);

      setSliders(prev => {
        const next = { ...prev };
        Object.keys(parsed).forEach(k => { if (k in next) next[k] = parsed[k]; });
        return next;
      });
      setStatus('Análise concluída! Os sliders foram ajustados com base no seu rosto.');
    } catch (err) {
      setStatus('Erro na análise: ' + (err.message || 'Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const groups = [
      ['Estrutura do Rosto', FACE_SLIDERS],
      ['Olhos', EYE_SLIDERS],
      ['Nariz & Boca', NOSE_SLIDERS],
      ['Físico', BODY_SLIDERS],
      ['Aparência', COLOR_SLIDERS],
    ];
    const lines = [`=== Dragon's Dogma 2 — Configuração do Arisen ===`, `Vocação: ${vocation} | Gênero: ${gender}`, ''];
    groups.forEach(([title, sls]) => {
      lines.push(`--- ${title} ---`);
      sls.forEach(s => lines.push(`${s.name}: ${sliders[s.id]}`));
      lines.push('');
    });
    lines.push(`Cor dos Cabelos: ${hairColor}`);
    lines.push(`Cor dos Olhos: ${eyeColor}`);
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const updateSlider = (id, val) => setSliders(prev => ({ ...prev, [id]: val }));

  return (
    <div style={styles.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        input[type=range] { -webkit-appearance: none; appearance: none; height: 3px; background: #2a1f0a; border-radius: 2px; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #c8952a; border: 2px solid #1a1208; cursor: pointer; }
        input[type=range]::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #c8952a; border: 2px solid #1a1208; cursor: pointer; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={{ width:40, height:40, border:'1px solid #c8952a66', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg viewBox="0 0 24 24" width={20} height={20} stroke="#c8952a" fill="none" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0-12l-4 4m4-4l4 4M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2"/>
          </svg>
        </div>
        <div style={styles.logo}>
          Dragon's Dogma II
          <span style={{ display:'block', fontSize:9, color:'#8a7040', letterSpacing:3, fontWeight:400 }}>Character Creator Assistant</span>
        </div>
        <div style={{ width:1, height:32, background:'#c8952a44' }}/>
        <div style={{ fontSize:13, color:'#8a7040', fontStyle:'italic' }}>Análise facial → Sliders do Arisen</div>
      </div>

      <div style={styles.body}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Upload */}
          <div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:11, color:'#8a7040', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Foto de Referência</div>
            <div
              style={styles.uploadZone(!!imagePreview)}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width:'100%', aspectRatio:1, objectFit:'cover', borderRadius:6, border:'1px solid #c8952a44' }} />
              ) : (
                <>
                  <div style={{ width:40, height:40, border:'1px solid #c8952a66', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg viewBox="0 0 24 24" width={20} height={20} stroke="#c8952a" fill="none" strokeWidth={1.5}>
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21"/>
                    </svg>
                  </div>
                  <div style={{ fontSize:12, color:'#8a7040', fontStyle:'italic' }}>
                    <strong style={{ color:gold, fontStyle:'normal' }}>Envie sua foto</strong><br/>ou arraste aqui
                  </div>
                </>
              )}
            </div>
          </div>

          {imagePreview && (
            <button style={styles.analyzeBtn(loading)} onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analisando...' : 'Analisar Rosto'}
            </button>
          )}

          {/* Vocation */}
          <div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:11, color:'#8a7040', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Vocação</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {['Fighter','Archer','Mage','Thief','M. Spearhand','Sorcerer'].map(v => (
                <button key={v} style={styles.pill(vocation===v)} onClick={() => setVocation(v)}>{v}</button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:11, color:'#8a7040', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Gênero</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {[['Masculine','Masculino'],['Feminine','Feminino']].map(([v,label]) => (
                <button key={v} style={styles.pill(gender===v)} onClick={() => setGender(v)}>{label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={styles.main}>
          {/* Status */}
          <div style={styles.status}>
            {loading ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, color:gold, fontSize:12, fontFamily:"'Cinzel',serif", letterSpacing:1 }}>
                <div style={{ width:14, height:14, border:'2px solid #c8952a33', borderTopColor:gold, borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                O Senhor do Dragão analisa o Arisen...
              </div>
            ) : status}
          </div>

          <SliderGroup title="Estrutura do Rosto" sliders={FACE_SLIDERS} values={sliders} onChange={updateSlider} />
          <SliderGroup title="Olhos" sliders={EYE_SLIDERS} values={sliders} onChange={updateSlider} />
          <SliderGroup title="Nariz & Boca" sliders={NOSE_SLIDERS} values={sliders} onChange={updateSlider} />
          <SliderGroup title="Físico Geral" sliders={BODY_SLIDERS} values={sliders} onChange={updateSlider} />

          {/* Color section */}
          <div style={styles.sectionTitle}>
            <span style={{ display:'inline-block', width:4, height:4, background:gold, borderRadius:'50%' }}/>
            Cor & Aparência
          </div>
          <div style={styles.slidersGrid}>
            {COLOR_SLIDERS.map(s => (
              <Slider key={s.id} name={s.name} value={sliders[s.id]} onChange={v => updateSlider(s.id, v)} />
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px 32px', marginBottom:24 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <span style={{ fontSize:10, color:'#c8952a99', fontFamily:"'Cinzel',serif", letterSpacing:1 }}>Cor dos Cabelos</span>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {HAIR_COLORS.map(c => (
                  <div key={c} onClick={() => setHairColor(c)} style={{ width:22, height:22, borderRadius:'50%', background:c, border:`2px solid ${hairColor===c ? gold : 'transparent'}`, cursor:'pointer', transform: hairColor===c ? 'scale(1.15)' : 'scale(1)', transition:'all 0.15s' }} />
                ))}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <span style={{ fontSize:10, color:'#c8952a99', fontFamily:"'Cinzel',serif", letterSpacing:1 }}>Cor dos Olhos</span>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {EYE_COLORS.map(c => (
                  <div key={c} onClick={() => setEyeColor(c)} style={{ width:22, height:22, borderRadius:'50%', background:c, border:`2px solid ${eyeColor===c ? gold : 'transparent'}`, cursor:'pointer', transform: eyeColor===c ? 'scale(1.15)' : 'scale(1)', transition:'all 0.15s' }} />
                ))}
              </div>
            </div>
          </div>

          <button style={styles.copyBtn} onClick={handleCopy}>{copied ? 'Copiado! ✓' : 'Copiar Configurações ↗'}</button>
          <div style={{ fontSize:12, color:'#6a5030', fontStyle:'italic', textAlign:'center', marginTop:8 }}>
            Dica: ajuste os sliders após a análise para personalizar ainda mais
          </div>
        </div>
      </div>
    </div>
  );
}
