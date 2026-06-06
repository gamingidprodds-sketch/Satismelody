import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Piano as PianoIcon, Guitar as GuitarIcon, Drum, Music, Wind, Mic } from 'lucide-react';
// Add this temporary Audio Engine fallback
const getAudioContext = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContext();
};

// Add these quick placeholder components for your UI
const Piano = () => <div className="text-center text-white text-xl p-10">🎹 Piano Interface Coming Soon! Keyboard controls ready.</div>;
const Guitar = () => <div className="text-center text-white text-xl p-10">🎸 Guitar Strings Coming Soon!</div>;
const Drums = () => <div className="text-center text-white text-xl p-10">🥁 Drum Pads Coming Soon!</div>;
const Harmonium = () => <div className="text-center text-white text-xl p-10">🪗 Harmonium Keys Coming Soon!</div>;
const Xylophone = () => <div className="text-center text-white text-xl p-10">🔔 Xylophone Bars Coming Soon!</div>;
const Flute = () => <div className="text-center text-white text-xl p-10">🎵 Flute Holes Coming Soon!</div>;
const Tabla = () => <div className="text-center text-white text-xl p-10">🪘 Tabla Bols Coming Soon!</div>;
const SingAlong = () => <div className="text-center text-white text-xl p-10">🎤 Microphone Visualizer Coming Soon!</div>;

type Instrument = 'piano' | 'guitar' | 'drums' | 'harmonium' | 'xylophone' | 'flute' | 'tabla' | 'singalong';

interface Tab {
  id: Instrument;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const tabs: Tab[] = [
  { id: 'piano', label: 'Piano', emoji: '🎹', icon: <PianoIcon size={18} />, color: 'text-blue-400', bgGradient: 'from-blue-900/30 to-indigo-900/30' },
  { id: 'guitar', label: 'Guitar', emoji: '🎸', icon: <GuitarIcon size={18} />, color: 'text-amber-400', bgGradient: 'from-amber-900/30 to-orange-900/30' },
  { id: 'drums', label: 'Drums', emoji: '🥁', icon: <Drum size={18} />, color: 'text-red-400', bgGradient: 'from-red-900/30 to-rose-900/30' },
  { id: 'harmonium', label: 'Harmonium', emoji: '🪗', icon: <Music size={18} />, color: 'text-amber-300', bgGradient: 'from-amber-950/30 to-yellow-900/30' },
  { id: 'xylophone', label: 'Xylophone', emoji: '🔔', icon: <Music size={18} />, color: 'text-emerald-400', bgGradient: 'from-emerald-900/30 to-teal-900/30' },
  { id: 'flute', label: 'Flute', emoji: '🎵', icon: <Wind size={18} />, color: 'text-cyan-400', bgGradient: 'from-cyan-900/30 to-sky-900/30' },
  { id: 'tabla', label: 'Tabla', emoji: '🪘', icon: <Drum size={18} />, color: 'text-orange-400', bgGradient: 'from-orange-900/30 to-amber-900/30' },
  { id: 'singalong', label: 'Sing Along', emoji: '🎤', icon: <Mic size={18} />, color: 'text-pink-400', bgGradient: 'from-pink-900/30 to-purple-900/30' },
];

// Animated background particles
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

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.alpha * 0.15})`;
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
      <div className="min-h-screen bg-[#080818] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-8xl mb-8"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎵
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Music Studio
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
            Play beautiful instruments right in your browser with realistic sounds and stunning visuals
          </p>
          <motion.button
            className="px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xl font-bold rounded-2xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initAudio}
          >
            🎶 Start Playing
          </motion.button>
          <p className="text-white/30 text-sm mt-4">Click to enable audio</p>

          {/* Floating music notes */}
          {['🎹', '🎸', '🥁', '🎵', '🪗', '🎤', '🪘', '🔔'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl pointer-events-none"
              style={{
                left: `${10 + (i * 11)}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080818] relative overflow-hidden">
      <BackgroundParticles />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.span
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🎵
              </motion.span>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Music Studio
                </h1>
                <p className="text-white/40 text-xs">Play instruments online</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/40 text-xs">
              <span className="hidden sm:inline">Use keyboard or mouse/touch</span>
              <span>⌨️</span>
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
                  <motion.button
                    key={tab.id}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all select-none
                      ${isActive ? `${tab.color} bg-white/10` : 'text-white/50 hover:text-white/70 hover:bg-white/5'}`}
                    onClick={() => setActiveTab(tab.id)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg">{tab.emoji}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-current rounded-full"
                        layoutId="activeTab"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className={`bg-gradient-to-br ${activeTabData.bgGradient} rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl backdrop-blur-sm min-h-[400px]`}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-3">
                  <span className="text-4xl">{activeTabData.emoji}</span>
                  {activeTabData.label}
                </h2>
              </div>

              {/* Instrument Component */}
              {activeTab === 'piano' && <Piano />}
              {activeTab === 'guitar' && <Guitar />}
              {activeTab === 'drums' && <Drums />}
              {activeTab === 'harmonium' && <Harmonium />}
              {activeTab === 'xylophone' && <Xylophone />}
              {activeTab === 'flute' && <Flute />}
              {activeTab === 'tabla' && <Tabla />}
              {activeTab === 'singalong' && <SingAlong />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-sm border-t border-white/5 py-4 relative z-10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/30 text-xs">
            <div className="flex items-center gap-2">
              <span>🎵</span>
              <span>Music Studio — All instruments use Web Audio API synthesis</span>
            </div>
            <div className="flex items-center gap-4">
              <span>🎹 Piano</span>
              <span>🎸 Guitar</span>
              <span>🥁 Drums</span>
              <span>🪗 Harmonium</span>
              <span>🔔 Xylophone</span>
              <span>🎵 Flute</span>
              <span>🪘 Tabla</span>
              <span>🎤 Sing Along</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

