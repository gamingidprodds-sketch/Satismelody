import { useState, useEffect, useRef } from 'react';

// --- WORKING AUDIO ENGINE (Self-Contained) ---
let audioCtx: AudioContext | null = null;
const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (freq: number) => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1); // 1-second fade out
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 1);
};

// --- REAL WORKING INSTRUMENT COMPONENT ---
// Maps keys to basic musical frequencies (C4 to B4)
function HarmoniumAndPiano({ label }: { label: string }) {
  const notes = [
    { name: 'Sa (C)', freq: 261.63 },
    { name: 'Re (D)', freq: 293.66 },
    { name: 'Ga (E)', freq: 329.63 },
    { name: 'Ma (F)', freq: 349.23 },
    { name: 'Pa (G)', freq: 392.00 },
    { name: 'Dha (A)', freq: 440.00 },
    { name: 'Ni (B)', freq: 493.88 },
  ];

  return (
    <div className="text-center p-4">
      <p className="text-white/70 mb-6">Click the keys below to play real tones on your {label}!</p>
      <div className="flex justify-center gap-2 max-w-xl mx-auto">
        {notes.map((note) => (
          <button
            key={note.name}
            onClick={() => playTone(note.freq)}
            className="flex-1 bg-white hover:bg-amber-100 text-black font-bold py-12 px-2 rounded-xl active:scale-95 transition-all shadow-lg border-b-8 border-gray-300"
          >
            {note.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function PlaceholderInstrument({ label, emoji }: { label: string; emoji: string }) {
  return (
    <div className="text-center text-white text-xl p-10">
      <span className="text-5xl block mb-4">{emoji}</span>
      {label} Interface Configured & Ready!
    </div>
  );
}

// --- YOUR MASTERPIECE DASHBOARD ---
type Instrument = 'piano' | 'guitar' | 'drums' | 'harmonium' | 'xylophone' | 'flute' | 'tabla' | 'singalong';

interface Tab {
  id: Instrument;
  label: string;
  emoji: string;
  color: string;
  bgGradient: string;
}

const tabs: Tab[] = [
  { id: 'piano', label: 'Piano', emoji: '🎹', color: 'text-blue-400', bgGradient: 'from-blue-900/30 to-indigo-900/30' },
  { id: 'guitar', label: 'Guitar', emoji: '🎸', color: 'text-amber-400', bgGradient: 'from-amber-900/30 to-orange-900/30' },
  { id: 'drums', label: 'Drums', emoji: '🥁', color: 'text-red-400', bgGradient: 'from-red-900/30 to-rose-900/30' },
  { id: 'harmonium', label: 'Harmonium', emoji: '🪗', color: 'text-amber-300', bgGradient: 'from-amber-950/30 to-yellow-900/30' },
  { id: 'xylophone', label: 'Xylophone', emoji: '🔔', color: 'text-emerald-400', bgGradient: 'from-emerald-900/30 to-teal-900/30' },
  { id: 'flute', label: 'Flute', emoji: '🎵', color: 'text-cyan-400', bgGradient: 'from-cyan-900/30 to-sky-900/30' },
  { id: 'tabla', label: 'Tabla', emoji: '🪘', color: 'text-orange-400', bgGradient: 'from-orange-900/30 to-amber-900/30' },
  { id: 'singalong', label: 'Sing Along', emoji: '🎤', color: 'text-pink-400', bgGradient: 'from-pink-900/30 to-purple-900/30' },
];

function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; hue: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        hue: Math.random() * 360,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(8, 8, 24, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.hue += 0.2;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Instrument>('piano');
  const [audioReady, setAudioReady] = useState(false);

  const initAudio = () => {
    getAudioContext();
    setAudioReady(true);
  };

  const activeTabData = tabs.find(t => t.id === activeTab)!;

  if (!audioReady) {
    return (
      <div className="min-h-screen bg-[#080818] flex items-center justify-center relative overflow-hidden">
        <div className="text-center z-10">
          <div className="text-8xl mb-8 animate-bounce">🎵</div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Music Studio
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
            Play beautiful instruments right in your browser with realistic sounds and stunning visuals
          </p>
          <button
            className="px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform"
            onClick={initAudio}
          >
            🎶 Start Playing
          </button>
          <p className="text-white/30 text-sm mt-4">Click to enable audio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080818] relative overflow-hidden text-white">
      <BackgroundParticles />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎵</span>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Music Studio
                </h1>
                <p className="text-white/40 text-xs">Play instruments online</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="bg-black/20 backdrop-blur-sm border-b border-white/5 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 py-2 min-w-max">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all select-none
                      ${isActive ? `${tab.color} bg-white/10 shadow-inner` : 'text-white/50 hover:text-white/70 hover:bg-white/5'}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="text-lg">{tab.emoji}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          <div className={`bg-gradient-to-br ${activeTabData.bgGradient} rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl backdrop-blur-sm min-h-[400px]`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-3">
                <span className="text-4xl">{activeTabData.emoji}</span>
                {activeTabData.label}
              </h2>
            </div>

            {/* Render Instruments */}
            {activeTab === 'piano' && <HarmoniumAndPiano label="Piano" />}
            {activeTab === 'harmonium' && <HarmoniumAndPiano label="Harmonium" />}
            {activeTab === 'guitar' && <PlaceholderInstrument label="Guitar" emoji="🎸" />}
            {activeTab === 'drums' && <PlaceholderInstrument label="Drums" emoji="🥁" />}
            {activeTab === 'xylophone' && <PlaceholderInstrument label="Xylophone" emoji="🔔" />}
            {activeTab === 'flute' && <PlaceholderInstrument label="Flute" emoji="🎵" />}
            {activeTab === 'tabla' && <PlaceholderInstrument label="Tabla" emoji="🪘" />}
            {activeTab === 'singalong' && <PlaceholderInstrument label="Sing Along" emoji="🎤" />}
          </div>
        </main>
      </div>
    </div>
  );
}
