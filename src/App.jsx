import { useState, useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Nunito:wght@400;500;600;700&display=swap');

  :root {
    --bg: #1a1207;
    --bg2: #221a0d;
    --surface: #2d2210;
    --border: #3d3018;
    --gold: #e8b84b;
    --gold2: #f5d07a;
    --sage: #7aab7e;
    --rose: #d4756b;
    --cream: #f5edd8;
    --muted: #8a7a5a;
    --text: #f0e6c8;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  .app { max-width: 680px; margin: 0 auto; padding: 2.5rem 1.5rem 5rem; position: relative; }
  .orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
  .orb1 { width: 400px; height: 400px; background: rgba(232,184,75,0.07); top: -100px; right: -100px; }
  .orb2 { width: 300px; height: 300px; background: rgba(122,171,126,0.06); bottom: 100px; left: -80px; }
  .header { text-align: center; margin-bottom: 2.5rem; position: relative; z-index: 1; animation: fadeDown 0.6s ease; }
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
  .logo-row { display: flex; align-items: center; justify-content: center; gap: 0.6rem; margin-bottom: 0.5rem; }
  .spark { font-size: 2rem; animation: pulse 3s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
  .app-name { font-family: 'Fraunces', serif; font-size: 2.2rem; font-weight: 700; color: var(--gold); letter-spacing: -0.02em; }
  .tagline { font-size: 0.88rem; color: var(--muted); font-style: italic; font-family: 'Fraunces', serif; }
  .usage-bar { background: var(--surface); border: 1px solid var(--border); border-radius: 40px; padding: 0.6rem 1.2rem; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; position: relative; z-index: 1; }
  .usage-label { font-size: 0.8rem; color: var(--muted); flex: 1; }
  .usage-sparks { display: flex; gap: 4px; }
  .usage-spark { font-size: 1rem; transition: opacity 0.3s; }
  .usage-spark.spent { opacity: 0.2; filter: grayscale(1); }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 1.75rem; margin-bottom: 1.25rem; position: relative; z-index: 1; animation: fadeUp 0.5s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .card-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold); font-weight: 700; margin-bottom: 1.1rem; }
  .domains { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin-bottom: 1.5rem; }
  .domain-btn { background: var(--bg2); border: 1.5px solid var(--border); border-radius: 12px; padding: 0.75rem 0.5rem; cursor: pointer; text-align: center; transition: all 0.2s; font-family: 'Nunito', sans-serif; color: var(--muted); }
  .domain-btn:hover { border-color: var(--gold); color: var(--text); }
  .domain-btn.active { border-color: var(--gold); background: rgba(232,184,75,0.1); color: var(--gold2); }
  .domain-icon { font-size: 1.5rem; display: block; margin-bottom: 0.3rem; }
  .domain-name { font-size: 0.78rem; font-weight: 600; }
  .field-label { font-size: 0.88rem; font-weight: 600; color: var(--text); margin-bottom: 0.5rem; display: block; }
  textarea, select { width: 100%; background: var(--bg2); border: 1.5px solid var(--border); border-radius: 12px; padding: 0.9rem 1rem; font-family: 'Nunito', sans-serif; font-size: 0.9rem; color: var(--text); outline: none; transition: border-color 0.2s; resize: none; }
  textarea::placeholder { color: var(--muted); }
  textarea:focus, select:focus { border-color: var(--gold); }
  select option { background: var(--bg2); }
  .meta-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1rem 0 1.5rem; }
  .btn-generate { width: 100%; padding: 1rem; border: none; border-radius: 14px; background: linear-gradient(135deg, var(--gold) 0%, #c98e28 100%); color: #1a1207; font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
  .btn-generate:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(232,184,75,0.3); }
  .btn-generate:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .loading { text-align: center; padding: 2.5rem; }
  .loading-anim { display: flex; justify-content: center; gap: 8px; margin-bottom: 1rem; }
  .loading-dot { width: 8px; height: 8px; background: var(--gold); border-radius: 50%; animation: bounce 1.2s ease-in-out infinite; }
  .loading-dot:nth-child(2) { animation-delay: 0.15s; }
  .loading-dot:nth-child(3) { animation-delay: 0.3s; }
  @keyframes bounce { 0%,80%,100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-10px); opacity: 1; } }
  .loading-text { font-family: 'Fraunces', serif; font-style: italic; color: var(--muted); font-size: 0.9rem; }
  .result-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
  .result-domain-icon { font-size: 2rem; }
  .result-title { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 700; color: var(--gold2); }
  .result-subtitle { font-size: 0.8rem; color: var(--muted); margin-top: 2px; }
  .habits-grid { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; }
  .habit-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 1rem 1.25rem; display: flex; gap: 1rem; align-items: flex-start; animation: fadeUp 0.4s ease both; }
  .habit-card:nth-child(1){animation-delay:0.05s} .habit-card:nth-child(2){animation-delay:0.12s} .habit-card:nth-child(3){animation-delay:0.19s} .habit-card:nth-child(4){animation-delay:0.26s} .habit-card:nth-child(5){animation-delay:0.33s}
  .habit-number { min-width: 28px; height: 28px; border-radius: 50%; background: rgba(232,184,75,0.15); border: 1px solid rgba(232,184,75,0.3); color: var(--gold); font-size: 0.78rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
  .habit-content { flex: 1; }
  .habit-name { font-weight: 700; font-size: 0.95rem; color: var(--cream); margin-bottom: 0.25rem; }
  .habit-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.4rem; }
  .habit-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .tag { font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
  .tag-time { background: rgba(122,171,126,0.15); color: var(--sage); }
  .tag-freq { background: rgba(232,184,75,0.12); color: var(--gold); }
  .tag-impact { background: rgba(212,117,107,0.15); color: var(--rose); }
  .conseil-box { background: rgba(122,171,126,0.08); border: 1px solid rgba(122,171,126,0.2); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; }
  .conseil-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--sage); font-weight: 700; margin-bottom: 0.4rem; }
  .conseil-text { font-size: 0.87rem; color: var(--text); line-height: 1.6; font-family: 'Fraunces', serif; font-style: italic; }
  .action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .btn-action { padding: 0.75rem; border-radius: 10px; font-family: 'Nunito', sans-serif; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.15s; border: 1.5px solid var(--border); background: transparent; color: var(--text); }
  .btn-action:hover { border-color: var(--gold); color: var(--gold); }
  .btn-action.copied { border-color: var(--sage); color: var(--sage); }
  .paywall { text-align: center; padding: 2.5rem 2rem; position: relative; overflow: hidden; }
  .paywall::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(232,184,75,0.08), transparent 70%); }
  .paywall-icon { font-size: 3rem; margin-bottom: 1rem; }
  .paywall h2 { font-family: 'Fraunces', serif; font-size: 1.5rem; font-weight: 700; color: var(--gold2); margin-bottom: 0.5rem; }
  .paywall p { color: var(--muted); font-size: 0.88rem; line-height: 1.6; margin-bottom: 1.75rem; }
  .price-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 2rem; border-radius: 40px; background: linear-gradient(135deg, var(--gold), #c98e28); color: #1a1207; font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 700; border: none; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
  .price-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(232,184,75,0.35); }
  .price-sub { margin-top: 0.75rem; font-size: 0.78rem; color: var(--muted); }
  .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(80px); background: var(--sage); color: #1a1207; padding: 0.65rem 1.4rem; border-radius: 40px; font-size: 0.85rem; font-weight: 700; transition: transform 0.3s; z-index: 999; white-space: nowrap; }
  .toast.show { transform: translateX(-50%) translateY(0); }
  @media (max-width: 500px) {
    .domains { grid-template-columns: repeat(2, 1fr); }
    .meta-row { grid-template-columns: 1fr; }
    .action-row { grid-template-columns: 1fr; }
  }
`;

const DOMAINS = [
  { id: "sante", icon: "🌿", name: "Santé" },
  { id: "sport", icon: "⚡", name: "Sport" },
  { id: "mental", icon: "🧘", name: "Mental" },
  { id: "sommeil", icon: "🌙", name: "Sommeil" },
  { id: "social", icon: "🤝", name: "Social" },
  { id: "creativite", icon: "🎨", name: "Créativité" },
];

const DURATIONS = ["5 min/jour", "10 min/jour", "15-20 min/jour", "30 min/jour", "+1h/jour"];
const LEVELS = ["Débutant complet", "Quelques habitudes déjà", "Régulier mais bloqué", "Avancé, je veux aller plus loin"];
const LOADING_PHRASES = ["Analyse de ta situation…", "Création d'habitudes sur-mesure…", "Ajout de la touche magique…"];
const MAX_FREE = 3;

export default function App() {
  const [domain, setDomain] = useState(null);
  const [situation, setSituation] = useState("");
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [loading, setLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState(0);
  const [result, setResult] = useState(null);
  const [usage, setUsage] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setLoadingPhrase(p => (p + 1) % LOADING_PHRASES.length), 1400);
    return () => clearInterval(iv);
  }, [loading]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  };

  const generate = async () => {
    if (!domain || !situation.trim()) return;
    if (usage >= MAX_FREE) { setShowPaywall(true); return; }
    setLoading(true);
    setResult(null);
    setShowPaywall(false);
    try {
      const domainLabel = DOMAINS.find(d => d.id === domain)?.name;
      const prompt = `Tu es un coach bien-être bienveillant et expert en formation d'habitudes.

Génère un plan d'habitudes personnalisé EN FRANÇAIS pour cette personne.

Domaine : ${domainLabel}
Temps disponible : ${duration}
Niveau actuel : ${level}
Situation / objectif : ${situation}

Réponds UNIQUEMENT avec ce JSON valide, sans texte autour :
{
  "titre": "Titre accrocheur du plan (max 8 mots)",
  "intro": "Phrase d'introduction chaleureuse et motivante (1-2 phrases)",
  "habitudes": [
    {
      "nom": "Nom court de l'habitude",
      "description": "Explication concrète et actionnable (2-3 phrases max)",
      "duree": "ex: 5 min",
      "frequence": "ex: Chaque matin",
      "impact": "ex: Énergie ++"
    }
  ],
  "conseil": "Un conseil personnalisé profond et inspirant (2-3 phrases)"
}

Génère entre 4 et 5 habitudes. Sois concret, chaleureux, jamais générique.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json",
"x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
"anthropic-version": "2023-06-01",
"anthropic-dangerous-direct-browser-access": "true"},
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult({ ...parsed, domainId: domain });
      setUsage(u => u + 1);
    } catch (e) {
      showToast("Erreur de génération, réessaie !");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    const text = `✨ ${result.titre}\n\n${result.intro}\n\n${result.habitudes.map((h, i) =>
      `${i + 1}. ${h.nom}\n${h.description}\n⏱ ${h.duree} · 🔁 ${h.frequence} · 💥 ${h.impact}`
    ).join("\n\n")}\n\n💡 ${result.conseil}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Plan copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const domainData = DOMAINS.find(d => d.id === result?.domainId);
  const remaining = MAX_FREE - usage;

  return (
    <>
      <style>{CSS}</style>
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="app">
        <div className="header">
          <div className="logo-row">
            <span className="spark">✨</span>
            <span className="app-name">HabitSpark</span>
          </div>
          <div className="tagline">Ton coach d'habitudes personnalisé par IA</div>
        </div>
        <div className="usage-bar">
          <span className="usage-label">
            {remaining > 0
              ? `${remaining} plan${remaining > 1 ? "s" : ""} gratuit${remaining > 1 ? "s" : ""} restant${remaining > 1 ? "s" : ""}`
              : "Passe à Pro pour continuer ✨"}
          </span>
          <div className="usage-sparks">
            {Array.from({ length: MAX_FREE }).map((_, i) => (
              <span key={i} className={`usage-spark ${i < usage ? "spent" : ""}`}>✨</span>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-label">Ton domaine</div>
          <div className="domains">
            {DOMAINS.map(d => (
              <button key={d.id} className={`domain-btn ${domain === d.id ? "active" : ""}`} onClick={() => setDomain(d.id)}>
                <span className="domain-icon">{d.icon}</span>
                <span className="domain-name">{d.name}</span>
              </button>
            ))}
          </div>
          <div className="card-label">Ta situation</div>
          <textarea rows={3} placeholder="Ex : Je manque d'énergie le matin, je veux mieux dormir et me sentir plus zen…" value={situation} onChange={e => setSituation(e.target.value)} />
          <div className="meta-row">
            <div>
              <label className="field-label" style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.4rem" }}>Temps disponible</label>
              <select value={duration} onChange={e => setDuration(e.target.value)}>
                {DURATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label" style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.4rem" }}>Ton niveau</label>
              <select value={level} onChange={e => setLevel(e.target.value)}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <button className="btn-generate" onClick={generate} disabled={!domain || !situation.trim() || loading}>
            {loading ? "✨ Création en cours…" : "✨ Générer mon plan d'habitudes"}
          </button>
        </div>
        {loading && (
          <div className="card loading">
            <div className="loading-anim">
              <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
            </div>
            <div className="loading-text">{LOADING_PHRASES[loadingPhrase]}</div>
          </div>
        )}
        {showPaywall && !loading && (
          <div className="card paywall">
            <div className="paywall-icon">🌟</div>
            <h2>Tu adores HabitSpark !</h2>
            <p>Tu as utilisé tes 3 plans gratuits.<br />Passe à Pro pour des plans illimités et des rappels personnalisés.</p>
            <button className="price-btn" onClick={() => showToast("Paiement bientôt disponible !")}>✨ Passer à Pro — 9€/mois</button>
            <div className="price-sub">Annulable à tout moment · Satisfait ou remboursé 14 jours</div>
          </div>
        )}
        {result && !loading && (
          <div className="card" ref={resultRef}>
            <div className="result-header">
              <span className="result-domain-icon">{domainData?.icon}</span>
              <div>
                <div className="result-title">{result.titre}</div>
                <div className="result-subtitle">{result.habitudes.length} habitudes · {duration}</div>
              </div>
            </div>
            <div className="habits-grid">
              {result.habitudes.map((h, i) => (
                <div className="habit-card" key={i}>
                  <div className="habit-number">{i + 1}</div>
                  <div className="habit-content">
                    <div className="habit-name">{h.nom}</div>
                    <div className="habit-desc">{h.description}</div>
                    <div className="habit-tags">
                      <span className="tag tag-time">⏱ {h.duree}</span>
                      <span className="tag tag-freq">🔁 {h.frequence}</span>
                      <span className="tag tag-impact">💥 {h.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="conseil-box">
              <div className="conseil-label">💡 Le conseil du coach</div>
              <div className="conseil-text">{result.conseil}</div>
            </div>
            <div className="action-row">
              <button className={`btn-action ${copied ? "copied" : ""}`} onClick={copyResult}>{copied ? "✓ Copié !" : "Copier mon plan"}</button>
              <button className="btn-action" onClick={() => { setResult(null); setSituation(""); setDomain(null); }}>Nouveau plan</button>
            </div>
          </div>
        )}
      </div>
      <div className={`toast ${toast.show ? "show" : ""}`}>{toast.msg}</div>
    </>
  );
    }
