import { useState, useRef, useCallback } from "react";

type CardType = "mariage" | "bapteme" | "deces" | "reunion_physique" | "reunion_ligne" | "sante"
             | "fiancailles" | "naissance" | "commemoration" | "conference" | "webinaire" | "urgence";

interface CardState {
  type: CardType;
  photoFF: string | null; photoFB: string | null;
  photoCouple: string | null; photoBebe: string | null;
  photoDefunt: string | null;
  epoux: string; epouse: string;
  prenomBebe: string; parents: string;
  nomDefunt: string;
  rencontreVideo: string | null;
  dateMarriage: string; lieuMarriage: string;
  dateBapteme: string; lieuBapteme: string;
  dateDeces: string; lieuDeces: string;
  dateEnterrement: string; lieuEnterrement: string;
  but: string; agenda: string[];
  dateReunion: string; lieuReunion: string;
  plateforme: string; lienReunion: string;
  videoSante: string | null;
  audioUrl: string | null; audioDuration: number;
  message: string;
  // Naissance
  poids: string; taille: string; heureNaissance: string;
  // Conférence / Webinaire
  titre: string; photoIntervenant: string | null; nomIntervenant: string;
  // Urgence
  typeUrgence: string; etablissement: string;
}

const defaultCard = (type: CardType): CardState => ({
  type,
  photoFF: null, photoFB: null, photoCouple: null, photoBebe: null, photoDefunt: null,
  epoux: "", epouse: "", prenomBebe: "", parents: "", nomDefunt: "",
  rencontreVideo: null,
  dateMarriage: "", lieuMarriage: "",
  dateBapteme: "", lieuBapteme: "",
  dateDeces: "", lieuDeces: "", dateEnterrement: "", lieuEnterrement: "",
  but: "", agenda: ["", "", "", "", "", ""],
  dateReunion: "", lieuReunion: "", plateforme: "", lienReunion: "",
  videoSante: null,
  audioUrl: null, audioDuration: 0,
  message: "",
  poids: "", taille: "", heureNaissance: "",
  titre: "", photoIntervenant: null, nomIntervenant: "",
  typeUrgence: "", etablissement: "",
});

// ─── Photo Slot compact ───────────────────────────────────────────────────────
function Photo({ value, onChange, label }: { value: string | null; onChange: (v: string | null) => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => onChange(ev.target?.result as string);
    r.readAsDataURL(f);
  };
  return (
    <div className="relative w-14 h-14 flex-shrink-0 cursor-pointer group" onClick={() => ref.current?.click()}>
      {value
        ? <img src={value} className="w-full h-full object-cover rounded-lg" alt={label} />
        : <div className="w-full h-full rounded-lg border border-dashed border-white/40 bg-white/10 flex flex-col items-center justify-center hover:bg-white/20 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50 mb-0.5">
              <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
            </svg>
            <span className="text-[8px] text-white/40 text-center leading-tight px-0.5">{label}</span>
          </div>
      }
      {value && (
        <button onClick={e => { e.stopPropagation(); onChange(null); }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={handle} className="hidden" />
    </div>
  );
}

// ─── Champ texte inline ───────────────────────────────────────────────────────
function Field({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder: string; className?: string }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`bg-transparent border-b border-white/25 focus:border-white/70 outline-none text-white placeholder-white/30 text-xs w-full ${className}`} />
  );
}

// ─── Date + Lieu compacts ─────────────────────────────────────────────────────
function DateRow({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/15 border border-white/20">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60 flex-shrink-0">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <span className="text-white/50 text-[10px] flex-shrink-0">{label}</span>
      <input type="date" value={value} onChange={e => onChange(e.target.value)}
        className="bg-transparent outline-none text-white text-[10px] flex-1 min-w-0" />
    </div>
  );
}

function DateTimeRow({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/15 border border-white/20">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60 flex-shrink-0">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <span className="text-white/50 text-[10px] flex-shrink-0">{label}</span>
      <input type="datetime-local" value={value} onChange={e => onChange(e.target.value)}
        className="bg-transparent outline-none text-white text-[10px] flex-1 min-w-0" />
    </div>
  );
}

function LieuRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/15 border border-white/20">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60 flex-shrink-0">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Lieu"
        className="bg-transparent outline-none text-white placeholder-white/30 text-[10px] flex-1" />
    </div>
  );
}

// ─── Micro compact ────────────────────────────────────────────────────────────
function Mic({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  const [rec, setRec] = useState(false);
  const [sec, setSec] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      recRef.current = mr;
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const r = new FileReader();
        r.onload = ev => setCard(p => ({ ...p, audioUrl: ev.target?.result as string, audioDuration: sec }));
        r.readAsDataURL(blob);
      };
      mr.start(); setRec(true); setSec(0);
      timerRef.current = setInterval(() => setSec(s => { if (s >= 59) { stop(); return 60; } return s + 1; }), 1000);
    } catch { alert("Microphone inaccessible."); }
  }, [sec]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    recRef.current?.stop(); setRec(false);
  }, []);

  if (card.audioUrl) return (
    <div className="flex items-center gap-2">
      <audio src={card.audioUrl} controls className="h-7 flex-1" style={{ minWidth: 0 }} />
      <button onClick={() => setCard(p => ({ ...p, audioUrl: null }))} className="text-red-300 text-xs flex-shrink-0">×</button>
    </div>
  );

  return (
    <button onClick={rec ? stop : start}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${rec ? "bg-red-500 text-white animate-pulse" : "bg-white/20 hover:bg-white/30 text-white"}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm6 10a1 1 0 0 1 2 0 8 8 0 0 1-7 7.94V21h2a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2h2v-2.06A8 8 0 0 1 4 11a1 1 0 0 1 2 0 6 6 0 0 0 12 0z"/>
      </svg>
      {rec ? `${sec}s` : "Audio"}
    </button>
  );
}

// ─── Vidéo slot compact ───────────────────────────────────────────────────────
function VideoSlot({ value, onChange, label = "Vidéo (max 30s)" }: { value: string | null; onChange: (v: string | null) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const v = document.createElement("video"); v.preload = "metadata";
    v.onloadedmetadata = () => {
      if (v.duration > 30) { alert("Max 30 secondes."); return; }
      const r = new FileReader();
      r.onload = ev => onChange(ev.target?.result as string);
      r.readAsDataURL(f);
    };
    v.src = URL.createObjectURL(f);
  };
  return (
    <div className="relative">
      {value
        ? <>
            <video src={value} controls className="w-full rounded-lg" style={{ maxHeight: 80 }} />
            <button onClick={() => onChange(null)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px]">×</button>
          </>
        : <button onClick={() => ref.current?.click()}
            className="w-full h-14 rounded-lg border border-dashed border-white/30 bg-white/10 hover:bg-white/20 flex items-center justify-center gap-2 text-white/50 hover:text-white transition-colors text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
            {label}
          </button>
      }
      <input ref={ref} type="file" accept="video/*" onChange={handle} className="hidden" />
    </div>
  );
}

// ─── Header commun des carreaux ───────────────────────────────────────────────
function CardHeader({ title, emoji }: { title: string; emoji: string }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between border-b border-white/20">
      <div>
        <p className="text-[9px] tracking-[2px] text-white/40 uppercase">Info-Wallou</p>
        <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
      </div>
      <span className="text-3xl">{emoji}</span>
    </div>
  );
}

// ─── Diagramme Soleil compact ─────────────────────────────────────────────────
function SunDiagram({ agenda, setAgenda, but, setBut }: { agenda: string[]; setAgenda: (a: string[]) => void; but: string; setBut: (v: string) => void }) {
  const W = 260; const H = 230;
  const cx = W / 2; const cy = H / 2;
  const rc = 28; const R = 88;
  const angles = [-90, -30, 30, 90, 150, 210];
  const pts = angles.map(deg => {
    const rad = deg * Math.PI / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad), lx: cx + rc * Math.cos(rad), ly: cy + rc * Math.sin(rad) };
  });
  return (
    <div className="relative mx-auto" style={{ width: W, height: H }}>
      <svg className="absolute inset-0 pointer-events-none" width={W} height={H}>
        {pts.map((p, i) => <line key={i} x1={p.lx} y1={p.ly} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />)}
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="rgba(255,255,255,0.45)" />)}
        <circle cx={cx} cy={cy} r={rc} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ left: cx - 26, top: cy - 14, width: 52 }}>
        <span className="text-white text-[9px] font-black opacity-60">BUT</span>
        <input type="text" value={but} onChange={e => setBut(e.target.value)} placeholder="Objectif"
          className="w-full bg-transparent text-white text-[8px] text-center outline-none placeholder-white/25 leading-tight" />
      </div>
      {pts.map((p, i) => (
        <div key={i} className="absolute" style={{ left: p.x - 32, top: p.y - 10, width: 64 }}>
          <input type="text" value={agenda[i] || ""} onChange={e => { const a = [...agenda]; a[i] = e.target.value; setAgenda(a); }}
            placeholder={`Point ${i + 1}`}
            className="w-full bg-transparent border-b border-white/25 text-white text-[9px] text-center outline-none placeholder-white/20" />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARREAUX
// ═══════════════════════════════════════════════════════════════════════════════

function CarreauMariage({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#7c1d3f,#be185d,#831843)" }}>
      <CardHeader title="Mariage" emoji="💍" />

      {/* Photos parents */}
      <div className="px-4 py-2 grid grid-cols-2 gap-3 border-b border-white/15">
        <div className="flex items-center gap-2">
          <Photo value={card.photoFF} onChange={v => setCard(p => ({ ...p, photoFF: v }))} label="Parents fille" />
          <span className="text-white/40 text-[9px] uppercase">Parents fille</span>
        </div>
        <div className="flex items-center gap-2">
          <Photo value={card.photoFB} onChange={v => setCard(p => ({ ...p, photoFB: v }))} label="Parents garçon" />
          <span className="text-white/40 text-[9px] uppercase">Parents garçon</span>
        </div>
      </div>

      {/* Fille = Garçon */}
      <div className="px-4 py-2 flex items-center gap-2 border-b border-white/15">
        <div className="flex flex-col items-center gap-1 flex-1">
          <Photo value={card.photoCouple} onChange={v => setCard(p => ({ ...p, photoCouple: v }))} label="Fille" />
          <Field value={card.epouse} onChange={v => setCard(p => ({ ...p, epouse: v }))} placeholder="Nom fille" className="text-center" />
        </div>
        <span className="text-white text-xl font-black bg-white/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">=</span>
        <div className="flex flex-col items-center gap-1 flex-1">
          <Photo value={card.photoBebe} onChange={v => setCard(p => ({ ...p, photoBebe: v }))} label="Garçon" />
          <Field value={card.epoux} onChange={v => setCard(p => ({ ...p, epoux: v }))} placeholder="Nom garçon" className="text-center" />
        </div>
      </div>

      {/* Vidéo + Audio côte à côte */}
      <div className="px-4 py-2 border-b border-white/15">
        <p className="text-[9px] text-white/40 uppercase mb-1">Rencontre entre parents</p>
        <div className="flex gap-2 items-start">
          <div className="flex-1"><VideoSlot value={card.rencontreVideo} onChange={v => setCard(p => ({ ...p, rencontreVideo: v }))} label="Vidéo" /></div>
          <div className="flex-1 pt-1"><Mic card={card} setCard={setCard} /></div>
        </div>
      </div>

      {/* Date + Lieu */}
      <div className="px-4 py-2 grid grid-cols-2 gap-2">
        <DateRow value={card.dateMarriage} onChange={v => setCard(p => ({ ...p, dateMarriage: v }))} label="Date" />
        <LieuRow value={card.lieuMarriage} onChange={v => setCard(p => ({ ...p, lieuMarriage: v }))} />
      </div>
    </div>
  );
}

function CarreauBapteme({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  const genre = card.message === "fille" || card.message === "garcon" ? card.message : null;
  const isFille = genre === "fille"; const isGarcon = genre === "garcon";
  const bg = isFille ? "linear-gradient(135deg,#831843,#db2777,#9d174d)" : isGarcon ? "linear-gradient(135deg,#1e3a5f,#1d4ed8,#1e3a5f)" : "linear-gradient(135deg,#0c4a6e,#0284c7,#075985)";

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: bg }}>
      <CardHeader title="Baptême" emoji="👶" />

      {/* Photos couple (gauche) + bébé décalé (droite) */}
      <div className="px-4 py-3 flex gap-4 border-b border-white/15">
        <div className="flex flex-col items-center gap-1">
          <Photo value={card.photoCouple} onChange={v => setCard(p => ({ ...p, photoCouple: v }))} label="Couple" />
          <Field value={card.parents} onChange={v => setCard(p => ({ ...p, parents: v }))} placeholder="Parents" className="text-center w-14" />
        </div>
        {/* Bébé légèrement décalé vers le bas */}
        <div className="flex flex-col items-center gap-1 mt-5">
          <div className="relative">
            <Photo value={card.photoBebe} onChange={v => setCard(p => ({ ...p, photoBebe: v }))} label="Bébé" />
            {genre && (
              <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-sm shadow border border-white/30 ${isFille ? "bg-pink-400" : "bg-blue-400"}`}>
                {isFille ? "🎀" : "👦"}
              </div>
            )}
          </div>
          <div className="flex items-center gap-0.5 w-14">
            <span className="text-white/50 text-[9px] font-bold">BB</span>
            <Field value={card.prenomBebe} onChange={v => setCard(p => ({ ...p, prenomBebe: v }))} placeholder="Prénom" className="text-center" />
          </div>
        </div>
        {/* Sélecteur genre */}
        <div className="flex flex-col gap-1 justify-center ml-auto">
          <button onClick={() => setCard(p => ({ ...p, message: "fille" }))}
            className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border transition-all ${isFille ? "bg-pink-400 border-pink-300 text-white" : "bg-white/10 border-white/20 text-white/50"}`}>
            🎀 Fille
          </button>
          <button onClick={() => setCard(p => ({ ...p, message: "garcon" }))}
            className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border transition-all ${isGarcon ? "bg-blue-400 border-blue-300 text-white" : "bg-white/10 border-white/20 text-white/50"}`}>
            👦 Garçon
          </button>
        </div>
      </div>

      {/* Audio */}
      <div className="px-4 py-2 border-b border-white/15">
        <Mic card={card} setCard={setCard} />
      </div>

      {/* Date + Lieu */}
      <div className="px-4 py-2 grid grid-cols-2 gap-2">
        <DateRow value={card.dateBapteme} onChange={v => setCard(p => ({ ...p, dateBapteme: v }))} label="Date" />
        <LieuRow value={card.lieuBapteme} onChange={v => setCard(p => ({ ...p, lieuBapteme: v }))} />
      </div>
    </div>
  );
}

function CarreauDeces({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#1c1917,#44403c,#292524)" }}>
      <CardHeader title="Décès" emoji="🕯️" />

      {/* Photo + Date décès + Nom */}
      <div className="px-4 py-2 flex gap-3 border-b border-white/15">
        <Photo value={card.photoDefunt} onChange={v => setCard(p => ({ ...p, photoDefunt: v }))} label="Photo" />
        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          <DateRow value={card.dateDeces} onChange={v => setCard(p => ({ ...p, dateDeces: v }))} label="Décès" />
          <Field value={card.nomDefunt} onChange={v => setCard(p => ({ ...p, nomDefunt: v }))} placeholder="Nom complet du défunt" className="font-semibold" />
        </div>
      </div>

      {/* Fleur + message */}
      <div className="px-4 py-2 flex flex-col items-center gap-1 border-b border-white/15">
        <span className="text-2xl">🌹</span>
        <Field value={card.message} onChange={v => setCard(p => ({ ...p, message: v }))} placeholder="Message de condoléances..." className="text-center italic" />
      </div>

      {/* Lieu pleine largeur */}
      <div className="px-4 py-1.5 border-b border-white/15">
        <LieuRow value={card.lieuDeces} onChange={v => setCard(p => ({ ...p, lieuDeces: v }))} />
      </div>

      {/* Date enterrement pleine largeur */}
      <div className="px-4 py-1.5 border-b border-white/15">
        <DateRow value={card.dateEnterrement} onChange={v => setCard(p => ({ ...p, dateEnterrement: v }))} label="Enterrement" />
      </div>

      {/* Audio */}
      <div className="px-4 py-2">
        <Mic card={card} setCard={setCard} />
      </div>
    </div>
  );
}

function CarreauReunionPhysique({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#78350f,#d97706,#92400e)" }}>
      <CardHeader title="Réunion Physique" emoji="🤝" />

      {/* Participants */}
      <div className="px-4 py-1.5 flex gap-1 border-b border-white/15">
        {[0,1,2,3,4].map(i => <span key={i} className="text-base opacity-60">👤</span>)}
      </div>

      {/* Soleil BUT */}
      <div className="border-b border-white/15">
        <SunDiagram but={card.but} setBut={v => setCard(p => ({ ...p, but: v }))}
          agenda={card.agenda} setAgenda={a => setCard(p => ({ ...p, agenda: a }))} />
      </div>

      {/* Date + Lieu */}
      <div className="px-4 py-2 grid grid-cols-2 gap-2">
        <DateTimeRow value={card.dateReunion} onChange={v => setCard(p => ({ ...p, dateReunion: v }))} label="Date" />
        <LieuRow value={card.lieuReunion} onChange={v => setCard(p => ({ ...p, lieuReunion: v }))} />
      </div>
    </div>
  );
}

function CarreauReunionLigne({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#3b0764,#7c3aed,#4c1d95)" }}>
      <CardHeader title="Réunion en Ligne" emoji="💻" />

      {/* Connexion à distance */}
      <div className="px-4 py-1.5 flex gap-2 items-center border-b border-white/15">
        <span className="text-base opacity-60">👤</span>
        <span className="text-white/30 text-xs">—</span>
        <span className="text-base opacity-60">📡</span>
        <span className="text-white/30 text-xs">—</span>
        <span className="text-base opacity-60">👤</span>
        <span className="text-white/30 text-[9px] ml-auto">En ligne</span>
      </div>

      {/* Soleil BUT */}
      <div className="border-b border-white/15">
        <SunDiagram but={card.but} setBut={v => setCard(p => ({ ...p, but: v }))}
          agenda={card.agenda} setAgenda={a => setCard(p => ({ ...p, agenda: a }))} />
      </div>

      {/* Plateforme + Lien */}
      <div className="px-4 py-2 space-y-1.5 border-b border-white/15">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/15 border border-white/20">
          <span className="text-[10px]">📡</span>
          <input type="text" value={card.plateforme} onChange={e => setCard(p => ({ ...p, plateforme: e.target.value }))}
            placeholder="Zoom, Teams, WhatsApp..." className="bg-transparent outline-none text-white placeholder-white/30 text-[10px] flex-1" />
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/15 border border-white/20">
          <span className="text-[10px]">🔗</span>
          <input type="text" value={card.lienReunion} onChange={e => setCard(p => ({ ...p, lienReunion: e.target.value }))}
            placeholder="Lien de connexion" className="bg-transparent outline-none text-white placeholder-white/30 text-[10px] flex-1" />
        </div>
      </div>

      {/* Date */}
      <div className="px-4 py-2">
        <DateTimeRow value={card.dateReunion} onChange={v => setCard(p => ({ ...p, dateReunion: v }))} label="Date/heure" />
      </div>
    </div>
  );
}

function CarreauSante({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#14532d,#16a34a,#166534)" }}>
      <CardHeader title="Santé" emoji="🏥" />

      {/* Vidéo — zone principale */}
      <div className="px-4 py-3 border-b border-white/15">
        <VideoSlot value={card.videoSante} onChange={v => setCard(p => ({ ...p, videoSante: v }))} label="Vid — cliquer pour ajouter (max 30s)" />
      </div>

      {/* Date auto */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/15 border border-white/20">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className="text-white/50 text-[10px]">Date (auto)</span>
          <span className="text-white text-[10px] font-bold ml-auto">{new Date().toLocaleDateString("fr-FR")}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Fiançailles ─────────────────────────────────────────────────────────────
function CarreauFiancailles({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#78350f,#b45309,#92400e)" }}>
      <CardHeader title="Fiançailles" emoji="💛" />
      <div className="px-4 py-3 flex items-center justify-around border-b border-white/15">
        <div className="flex flex-col items-center gap-1">
          <Photo value={card.photoFF} onChange={v => setCard(p => ({ ...p, photoFF: v }))} label="Elle" />
          <Field value={card.epouse} onChange={v => setCard(p => ({ ...p, epouse: v }))} placeholder="Prénom" className="text-center w-14" />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl">♡</span>
          <span className="text-white/30 text-[9px]">∞</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Photo value={card.photoFB} onChange={v => setCard(p => ({ ...p, photoFB: v }))} label="Lui" />
          <Field value={card.epoux} onChange={v => setCard(p => ({ ...p, epoux: v }))} placeholder="Prénom" className="text-center w-14" />
        </div>
      </div>
      <div className="px-4 py-2 border-b border-white/15">
        <Field value={card.message} onChange={v => setCard(p => ({ ...p, message: v }))} placeholder="Texte d'annonce de fiançailles..." className="italic text-center" />
      </div>
      <div className="px-4 py-2 border-b border-white/15">
        <Mic card={card} setCard={setCard} />
      </div>
      <div className="px-4 py-2 grid grid-cols-2 gap-2">
        <DateRow value={card.dateMarriage} onChange={v => setCard(p => ({ ...p, dateMarriage: v }))} label="Cérémonie" />
        <LieuRow value={card.lieuMarriage} onChange={v => setCard(p => ({ ...p, lieuMarriage: v }))} />
      </div>
    </div>
  );
}

// ─── Naissance ────────────────────────────────────────────────────────────────
function CarreauNaissance({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#713f12,#ca8a04,#78350f)" }}>
      <CardHeader title="Naissance" emoji="🌟" />
      <div className="px-4 py-2 flex gap-3 items-start border-b border-white/15">
        <div className="flex flex-col items-center gap-1">
          <Photo value={card.photoBebe} onChange={v => setCard(p => ({ ...p, photoBebe: v }))} label="Bébé" />
          <Field value={card.prenomBebe} onChange={v => setCard(p => ({ ...p, prenomBebe: v }))} placeholder="Prénom" className="text-center w-14 font-bold" />
        </div>
        <div className="flex-1 flex flex-col gap-1.5 justify-center mt-1">
          <div className="flex gap-1.5 items-center px-2 py-1 rounded bg-white/15 border border-white/20">
            <span className="text-[10px]">⚖️</span>
            <input type="text" value={card.poids} onChange={e => setCard(p => ({ ...p, poids: e.target.value }))}
              placeholder="Poids (kg)" className="bg-transparent outline-none text-white placeholder-white/30 text-[10px] flex-1" />
          </div>
          <div className="flex gap-1.5 items-center px-2 py-1 rounded bg-white/15 border border-white/20">
            <span className="text-[10px]">📏</span>
            <input type="text" value={card.taille} onChange={e => setCard(p => ({ ...p, taille: e.target.value }))}
              placeholder="Taille (cm)" className="bg-transparent outline-none text-white placeholder-white/30 text-[10px] flex-1" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 mt-2">
          <Photo value={card.photoCouple} onChange={v => setCard(p => ({ ...p, photoCouple: v }))} label="Parents" />
          <Field value={card.parents} onChange={v => setCard(p => ({ ...p, parents: v }))} placeholder="Parents" className="text-center w-14" />
        </div>
      </div>
      <div className="px-4 py-2 grid grid-cols-2 gap-2 border-b border-white/15">
        <DateRow value={card.dateBapteme} onChange={v => setCard(p => ({ ...p, dateBapteme: v }))} label="Née le" />
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/15 border border-white/20">
          <span className="text-white/50 text-[10px]">🕐</span>
          <input type="time" value={card.heureNaissance} onChange={e => setCard(p => ({ ...p, heureNaissance: e.target.value }))}
            className="bg-transparent outline-none text-white text-[10px] flex-1" />
        </div>
      </div>
      <div className="px-4 py-2">
        <LieuRow value={card.lieuBapteme} onChange={v => setCard(p => ({ ...p, lieuBapteme: v }))} />
      </div>
    </div>
  );
}

// ─── Commémoration ────────────────────────────────────────────────────────────
function CarreauCommemoration({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)" }}>
      <CardHeader title="Commémoration" emoji="🕊️" />
      <div className="px-4 py-2 flex gap-3 border-b border-white/15">
        <Photo value={card.photoDefunt} onChange={v => setCard(p => ({ ...p, photoDefunt: v }))} label="Photo" />
        <div className="flex-1 flex flex-col gap-1.5 justify-center">
          <Field value={card.nomDefunt} onChange={v => setCard(p => ({ ...p, nomDefunt: v }))} placeholder="Nom du défunt" className="font-bold text-sm" />
          <DateRow value={card.dateDeces} onChange={v => setCard(p => ({ ...p, dateDeces: v }))} label="Décédé le" />
        </div>
      </div>
      <div className="px-4 py-2 flex flex-col items-center gap-1 border-b border-white/15">
        <span className="text-xl">🕊️</span>
        <Field value={card.message} onChange={v => setCard(p => ({ ...p, message: v }))} placeholder="Hommage, pensée, prière..." className="text-center italic" />
      </div>
      <div className="px-4 py-1.5 border-b border-white/15">
        <DateRow value={card.dateEnterrement} onChange={v => setCard(p => ({ ...p, dateEnterrement: v }))} label="Cérémonie" />
      </div>
      <div className="px-4 py-1.5 border-b border-white/15">
        <LieuRow value={card.lieuDeces} onChange={v => setCard(p => ({ ...p, lieuDeces: v }))} />
      </div>
      <div className="px-4 py-2">
        <Mic card={card} setCard={setCard} />
      </div>
    </div>
  );
}

// ─── Conférence ───────────────────────────────────────────────────────────────
function CarreauConference({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#134e4a,#0f766e,#115e59)" }}>
      <CardHeader title="Conférence" emoji="🎙️" />
      <div className="px-4 py-2 border-b border-white/15">
        <input type="text" value={card.titre} onChange={e => setCard(p => ({ ...p, titre: e.target.value }))}
          placeholder="Titre de la conférence"
          className="bg-transparent border-b border-white/30 focus:border-white/70 outline-none text-white placeholder-white/30 text-sm font-bold w-full text-center" />
      </div>
      <div className="px-4 py-2 flex gap-3 items-center border-b border-white/15">
        <Photo value={card.photoIntervenant} onChange={v => setCard(p => ({ ...p, photoIntervenant: v }))} label="Intervenant" />
        <div className="flex-1 flex flex-col gap-1">
          <Field value={card.nomIntervenant} onChange={v => setCard(p => ({ ...p, nomIntervenant: v }))} placeholder="Nom de l'intervenant" />
          <Field value={card.but} onChange={v => setCard(p => ({ ...p, but: v }))} placeholder="Thème / Sujet" />
        </div>
      </div>
      <div className="px-4 py-1.5 border-b border-white/15">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/15 border border-white/20">
          <span className="text-[10px]">🪑</span>
          <input type="text" value={card.message} onChange={e => setCard(p => ({ ...p, message: e.target.value }))}
            placeholder="Capacité / Entrée libre" className="bg-transparent outline-none text-white placeholder-white/30 text-[10px] flex-1" />
        </div>
      </div>
      <div className="px-4 py-2 grid grid-cols-2 gap-2">
        <DateTimeRow value={card.dateReunion} onChange={v => setCard(p => ({ ...p, dateReunion: v }))} label="Date" />
        <LieuRow value={card.lieuReunion} onChange={v => setCard(p => ({ ...p, lieuReunion: v }))} />
      </div>
    </div>
  );
}

// ─── Webinaire ────────────────────────────────────────────────────────────────
function CarreauWebinaire({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#1e1b4b,#4338ca,#312e81)" }}>
      <CardHeader title="Webinaire" emoji="📡" />
      <div className="px-4 py-2 border-b border-white/15">
        <input type="text" value={card.titre} onChange={e => setCard(p => ({ ...p, titre: e.target.value }))}
          placeholder="Titre du webinaire"
          className="bg-transparent border-b border-white/30 focus:border-white/70 outline-none text-white placeholder-white/30 text-sm font-bold w-full text-center" />
      </div>
      <div className="px-4 py-2 flex gap-3 items-center border-b border-white/15">
        <Photo value={card.photoIntervenant} onChange={v => setCard(p => ({ ...p, photoIntervenant: v }))} label="Orateur" />
        <div className="flex-1 flex flex-col gap-1">
          <Field value={card.nomIntervenant} onChange={v => setCard(p => ({ ...p, nomIntervenant: v }))} placeholder="Nom de l'orateur" />
          <Field value={card.but} onChange={v => setCard(p => ({ ...p, but: v }))} placeholder="Sujet abordé" />
        </div>
      </div>
      <div className="px-4 py-2 space-y-1.5 border-b border-white/15">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/15 border border-white/20">
          <span className="text-[10px]">📡</span>
          <input type="text" value={card.plateforme} onChange={e => setCard(p => ({ ...p, plateforme: e.target.value }))}
            placeholder="Zoom, Teams, YouTube Live..." className="bg-transparent outline-none text-white placeholder-white/30 text-[10px] flex-1" />
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/15 border border-white/20">
          <span className="text-[10px]">🔗</span>
          <input type="text" value={card.lienReunion} onChange={e => setCard(p => ({ ...p, lienReunion: e.target.value }))}
            placeholder="Lien d'inscription" className="bg-transparent outline-none text-white placeholder-white/30 text-[10px] flex-1" />
        </div>
      </div>
      <div className="px-4 py-2">
        <DateTimeRow value={card.dateReunion} onChange={v => setCard(p => ({ ...p, dateReunion: v }))} label="Date/heure" />
      </div>
    </div>
  );
}

// ─── Urgence Médicale ─────────────────────────────────────────────────────────
function CarreauUrgence({ card, setCard }: { card: CardState; setCard: React.Dispatch<React.SetStateAction<CardState>> }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg,#450a0a,#b91c1c,#7f1d1d)" }}>
      <CardHeader title="Urgence Médicale" emoji="🚨" />
      <div className="px-4 py-2 border-b border-white/15">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-red-900/60 border border-red-400/40">
          <span className="text-base animate-pulse">🚨</span>
          <input type="text" value={card.typeUrgence} onChange={e => setCard(p => ({ ...p, typeUrgence: e.target.value }))}
            placeholder="Type d'urgence (ex: accident, épidémie...)"
            className="bg-transparent outline-none text-white placeholder-white/30 text-xs font-bold flex-1" />
        </div>
      </div>
      <div className="px-4 py-2 space-y-1.5 border-b border-white/15">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/10 border border-white/20">
          <span className="text-[10px]">🏥</span>
          <input type="text" value={card.etablissement} onChange={e => setCard(p => ({ ...p, etablissement: e.target.value }))}
            placeholder="Établissement / Contact" className="bg-transparent outline-none text-white placeholder-white/30 text-[10px] flex-1" />
        </div>
        <LieuRow value={card.lieuDeces} onChange={v => setCard(p => ({ ...p, lieuDeces: v }))} />
      </div>
      <div className="px-4 py-2 border-b border-white/15">
        <textarea value={card.message} onChange={e => setCard(p => ({ ...p, message: e.target.value }))}
          placeholder="Instructions / Consignes à suivre..."
          rows={2}
          className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 outline-none text-white placeholder-white/30 text-[10px] resize-none" />
      </div>
      <div className="px-4 py-2">
        <DateTimeRow value={card.dateReunion} onChange={v => setCard(p => ({ ...p, dateReunion: v }))} label="Date/heure" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════════════════════════

type TemplateGroup = { group: string; items: { type: CardType; label: string; emoji: string; bg: string }[] };

const TEMPLATE_GROUPS: TemplateGroup[] = [
  {
    group: "Vie de famille",
    items: [
      { type: "mariage",      label: "Mariage",      emoji: "💍", bg: "from-rose-900 to-pink-700" },
      { type: "fiancailles",  label: "Fiançailles",  emoji: "💛", bg: "from-amber-900 to-yellow-700" },
    ],
  },
  {
    group: "Naissance & Baptême",
    items: [
      { type: "bapteme",   label: "Baptême",   emoji: "👶", bg: "from-sky-900 to-blue-600" },
      { type: "naissance", label: "Naissance", emoji: "🌟", bg: "from-yellow-900 to-amber-600" },
    ],
  },
  {
    group: "Décès & Mémoire",
    items: [
      { type: "deces",          label: "Décès",          emoji: "🕯️", bg: "from-stone-800 to-stone-600" },
      { type: "commemoration",  label: "Commémoration",  emoji: "🕊️", bg: "from-indigo-950 to-indigo-800" },
    ],
  },
  {
    group: "Réunions",
    items: [
      { type: "reunion_physique", label: "Réunion Physique", emoji: "🤝", bg: "from-amber-900 to-orange-700" },
      { type: "conference",       label: "Conférence",       emoji: "🎙️", bg: "from-teal-900 to-teal-700" },
    ],
  },
  {
    group: "En ligne",
    items: [
      { type: "reunion_ligne", label: "Réunion en Ligne", emoji: "💻", bg: "from-violet-900 to-purple-700" },
      { type: "webinaire",     label: "Webinaire",        emoji: "📡", bg: "from-indigo-900 to-blue-800" },
    ],
  },
  {
    group: "Santé",
    items: [
      { type: "sante",   label: "Santé",           emoji: "🏥", bg: "from-emerald-900 to-green-700" },
      { type: "urgence", label: "Urgence Médicale", emoji: "🚨", bg: "from-red-950 to-red-800" },
    ],
  },
];

export default function InfoWallou() {
  const [selected, setSelected] = useState<CardType | null>(null);
  const [card, setCard] = useState<CardState>(defaultCard("mariage"));
  const [showPublish, setShowPublish] = useState(false);

  const handleSelect = (type: CardType) => { setSelected(type); setCard(defaultCard(type)); };

  const downloadCard = () => {
    const el = document.getElementById("iw-card");
    if (!el) return;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Info-Wallou</title>
<style>body{margin:0;padding:16px;background:#0f172a;display:flex;justify-content:center;align-items:flex-start;min-height:100vh;font-family:sans-serif;}</style>
</head><body>${el.outerHTML}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `info-wallou-${card.type}-${Date.now()}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  const renderCard = () => {
    const p = { card, setCard };
    switch (selected) {
      case "mariage":          return <CarreauMariage {...p} />;
      case "fiancailles":      return <CarreauFiancailles {...p} />;
      case "bapteme":          return <CarreauBapteme {...p} />;
      case "naissance":        return <CarreauNaissance {...p} />;
      case "deces":            return <CarreauDeces {...p} />;
      case "commemoration":    return <CarreauCommemoration {...p} />;
      case "reunion_physique": return <CarreauReunionPhysique {...p} />;
      case "conference":       return <CarreauConference {...p} />;
      case "reunion_ligne":    return <CarreauReunionLigne {...p} />;
      case "webinaire":        return <CarreauWebinaire {...p} />;
      case "sante":            return <CarreauSante {...p} />;
      case "urgence":          return <CarreauUrgence {...p} />;
    }
  };

  // Écran de choix
  if (!selected) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-white tracking-tight">Info-Wallou</h1>
          <p className="text-gray-500 text-xs mt-1">Choisissez un carreau · Remplissez · Publiez ou téléchargez</p>
        </div>
        <div className="space-y-5">
          {TEMPLATE_GROUPS.map(g => (
            <div key={g.group}>
              <p className="text-[10px] uppercase tracking-[2px] text-gray-600 mb-2">{g.group}</p>
              <div className="grid grid-cols-2 gap-3">
                {g.items.map(t => (
                  <button key={t.type} onClick={() => handleSelect(t.type)}
                    className={`bg-gradient-to-br ${t.bg} rounded-xl p-4 flex items-center gap-3 border border-white/10 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left`}>
                    <span className="text-3xl flex-shrink-0">{t.emoji}</span>
                    <span className="text-white font-bold text-sm leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-4 text-[10px] text-gray-600">
          <span>📷 Photos</span><span>🎬 Vidéo 30s</span><span>🎤 Audio 1min</span>
        </div>
      </div>
    </div>
  );

  // Écran édition
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 py-6 px-4">
      <div className="max-w-sm mx-auto">
        <button onClick={() => setSelected(null)} className="mb-4 text-gray-500 hover:text-white text-xs transition-colors">
          ← Retour
        </button>

        <div id="iw-card">{renderCard()}</div>

        <p className="text-center text-[9px] text-gray-700 mt-1 uppercase tracking-widest">
          Les Enfants d'Adam · Info-Wallou · {new Date().toLocaleDateString("fr-FR")}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={downloadCard}
            className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg py-2 text-xs font-semibold transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Télécharger
          </button>
          <button onClick={() => setShowPublish(true)}
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 text-xs font-semibold transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Publier
          </button>
        </div>
      </div>

      {showPublish && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-xs p-5">
            <h3 className="text-sm font-bold text-white mb-1">Publier</h3>
            <p className="text-xs text-gray-500 mb-4">Choisissez la page de destination</p>
            <div className="space-y-1.5">
              {[["Ma page Famille","/famille"],["Page Santé","/sante"],["Page Activités","/activite"],["Page Solidarité","/solidarite"]].map(([label, path]) => (
                <button key={path} onClick={() => { setShowPublish(false); alert(`Prêt pour "${label}". Publication en déploiement.`); }}
                  className="w-full text-left px-3 py-2 border border-gray-700 rounded-lg hover:bg-white/10 text-xs text-gray-200 transition-colors">
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => setShowPublish(false)} className="mt-3 w-full py-1.5 text-xs text-gray-600 hover:text-gray-400">Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
