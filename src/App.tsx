import React, { useState, useRef } from 'react';
import { Menu, Delete, RotateCcw, Keyboard, Volume2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function App() {
  const [mode, setMode] = useState<'talk' | 'entry'>('talk');
  
  // Custom Dictionary with some useful defaults
  const [dictionary, setDictionary] = useState<Record<string, string>>({
    'UP': 'Merhaba',
    'DOWN': 'Nasılsın',
    'RIGHT': 'Evet',
    'LEFT': 'Hayır',
    'UP,UP': 'Teşekkürler'
  });

  const [currentSequence, setCurrentSequence] = useState<Direction[]>([]);
  const [confirmedText, setConfirmedText] = useState<string[]>([]);
  
  // Modals
  const [isSaving, setIsSaving] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);
  const [newWord, setNewWord] = useState('');

  // Derived states
  const currentSequenceKey = currentSequence.join(',');
  const previewWord = dictionary[currentSequenceKey] || '';

  // Pointer tracking for Swipe & Trail
  const startPos = useRef<{ x: number, y: number } | null>(null);
  const trailRef = useRef<SVGPolylineElement>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    startPos.current = { x: e.clientX, y: e.clientY };
    
    if (trailRef.current) {
      trailRef.current.setAttribute('points', `${x},${y}`);
      trailRef.current.style.opacity = '1';
      trailRef.current.style.transition = 'none';
    }
    
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startPos.current || !e.isPrimary) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (trailRef.current) {
      const pts = trailRef.current.getAttribute('points') || '';
      trailRef.current.setAttribute('points', pts + ` ${x},${y}`);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!startPos.current || !e.isPrimary) return;
    
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    // Minimum distance to register a swipe
    if (absDx > 30 || absDy > 30) {
      let dir: Direction;
      if (absDx > absDy) {
        dir = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        dir = dy > 0 ? 'DOWN' : 'UP';
      }
      setCurrentSequence(prev => [...prev, dir]);
    }
    
    // Fade out trail
    if (trailRef.current) {
      trailRef.current.style.transition = 'opacity 0.3s ease';
      trailRef.current.style.opacity = '0';
      setTimeout(() => {
        if (trailRef.current && trailRef.current.style.opacity === '0') {
          trailRef.current.setAttribute('points', '');
        }
      }, 300);
    }
    
    startPos.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleStop = () => {
    if (mode === 'talk') {
      if (previewWord) {
        setConfirmedText(prev => [...prev, previewWord]);
      }
      setCurrentSequence([]);
    } else {
      // Entry Mode
      if (currentSequence.length > 0) {
        setIsSaving(true);
      }
    }
  };

  const handleSaveWord = () => {
    const finalWord = newWord.trim();
    if (finalWord) {
      if (isSaving) {
        setDictionary(prev => ({
          ...prev,
          [currentSequenceKey]: finalWord
        }));
        setCurrentSequence([]);
      } else if (isManualInput) {
        setConfirmedText(prev => [...prev, finalWord]);
      }
    }
    setNewWord('');
    setIsSaving(false);
    setIsManualInput(false);
  };

  const speakText = (text: string) => {
    if (!text) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Clear queue
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to set language to Turkish since commands are primarily in TR
      utterance.lang = 'tr-TR';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Cihazınızda metin okuma özelliği desteklenmiyor.");
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0F1115] bg-[radial-gradient(circle_at_center,#1A1D24_0%,#0F1115_100%)] font-sans text-[#E0E0E0] overflow-hidden select-none">
      
      {/* Header */}
      <header className="flex flex-none items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0F1115]/80 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-white" />
          <h1 className="text-[22px] font-sans tracking-tight pt-1 text-white font-bold">Sliding System</h1>
        </div>
        <button
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/20 ${
            mode === 'talk'
              ? 'bg-[#E63946] text-white hover:bg-[#E63946]/90'
              : 'bg-[#2A9D8F] text-white hover:bg-[#2A9D8F]/90'
          }`}
          onClick={() => {
            setMode(mode === 'talk' ? 'entry' : 'talk');
            setCurrentSequence([]); // Reset on mode switch
          }}
        >
          {mode === 'talk' ? 'Entry' : 'Talk'}
        </button>
      </header>

      {/* Text Area */}
      <div className="shrink-0 flex items-center justify-center flex-col min-h-[180px] p-5 text-center">
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2">
          {confirmedText.map((word, i) => (
            <span key={i} className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight">
              {word}
            </span>
          ))}
          {mode === 'talk' && previewWord && (
            <span className="text-white/25 text-3xl sm:text-5xl font-extrabold tracking-tight">
              {previewWord}
            </span>
          )}
          {confirmedText.length === 0 && (!previewWord || mode === 'entry') && (
            <span className="text-white/10 text-3xl sm:text-5xl font-extrabold tracking-tight pointer-events-none">
              Drafting...
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Area (Swipe Area + Stop Area) */}
      <div className="flex-1 flex flex-col relative w-full items-center justify-center">
        
        {/* Swipe Area */}
        <div className="flex-1 w-full max-w-[500px] relative p-6 sm:p-10 flex items-stretch">
          <div 
            className="flex-1 w-full relative bg-white/[0.02] border-2 border-white/10 rounded-[32px] touch-none flex flex-col items-center justify-center overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            {/* Background Hint Graphics */}
            <div className="absolute inset-0 pointer-events-none text-white/30">
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[2px] font-semibold">Up</span>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[2px] font-semibold">Down</span>
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[2px] font-semibold -rotate-90">Left</span>
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[2px] font-semibold rotate-90">Right</span>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <ArrowUp strokeWidth={3} className="absolute top-0 w-6 h-6" />
                  <ArrowDown strokeWidth={3} className="absolute bottom-0 w-6 h-6" />
                  <ArrowLeft strokeWidth={3} className="absolute left-0 w-6 h-6" />
                  <ArrowRight strokeWidth={3} className="absolute right-0 w-6 h-6" />
                  <div className="w-8 h-8 rounded-full border-[3px] border-current" />
                </div>
              </div>
            </div>

            {/* Live Swipe Trail */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 w-full">
              <polyline 
                ref={trailRef}
                points="" 
                fill="none" 
                stroke={mode === 'entry' ? "rgba(230,57,70,0.8)" : "rgba(42,157,143,0.8)"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Sequence Status Indicator */}
            {currentSequence.length > 0 && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-none z-20">
                {/* Preview Badge */}
                {mode === 'talk' && previewWord && (
                  <div className="text-white/80 font-semibold bg-black/40 border border-white/10 backdrop-blur-md px-4 py-2 rounded-lg shadow-xl text-lg">
                    {previewWord}
                  </div>
                )}
                {mode === 'entry' && previewWord && (
                  <div className="text-[#E63946] font-semibold bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg text-sm shadow-xl border border-[#E63946]/30">
                    Mevcut: "{previewWord}"
                  </div>
                )}
                
                {/* Arrows Container */}
                <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-xl shadow-xl border border-white/10">
                  {currentSequence.map((dir, i) => {
                    const Icon = dir === 'UP' ? ArrowUp : dir === 'DOWN' ? ArrowDown : dir === 'LEFT' ? ArrowLeft : ArrowRight;
                    return (
                      <span key={i} className={`p-2 rounded-lg shadow-inner ${mode === 'entry' ? 'bg-[#E63946]/20 text-[#E63946]' : 'bg-[#2A9D8F]/20 text-[#2A9D8F]'}`}>
                        <Icon size={20} strokeWidth={3} />
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stop Area */}
        <button 
          className="h-24 w-full shrink-0 bg-gradient-to-b from-white/[0.02] to-white/[0.05] border-t border-white/10 flex flex-col items-center justify-center active:bg-white/[0.08] transition-colors"
          onClick={handleStop}
        >
          <span className="text-base tracking-[4px] text-white/60 font-bold uppercase pointer-events-none">Tap to Finalize Word</span>
          {mode === 'entry' && <span className="text-xs text-white/30 uppercase tracking-[1px] mt-1">(Or open keyboard to map new word)</span>}
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="shrink-0 grid grid-cols-4 px-2 py-3 border-t border-white/5 bg-[#0F1115]/80 backdrop-blur-lg relative z-20 pb-safe">
        <button onClick={() => setConfirmedText([])} className="flex flex-col items-center p-3 text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5">
          <Delete className="w-6 h-6 mb-1.5" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Clear</span>
        </button>
        <button onClick={() => setConfirmedText(prev => prev.slice(0, -1))} className="flex flex-col items-center p-3 text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5">
          <RotateCcw className="w-6 h-6 mb-1.5" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Undo</span>
        </button>
        <button onClick={() => setIsManualInput(true)} className="flex flex-col items-center p-3 text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5">
          <Keyboard className="w-6 h-6 mb-1.5" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Type</span>
        </button>
        <button onClick={() => speakText(confirmedText.join(' '))} className="flex flex-col items-center p-3 text-[#2A9D8F] hover:text-[#2A9D8F]/80 transition-colors rounded-xl hover:bg-white/5">
          <Volume2 className="w-6 h-6 mb-1.5" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Speak</span>
        </button>
      </div>

      {/* Save Word / Keyboard Modal Overlay */}
      {(isSaving || isManualInput) && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => {
            setIsSaving(false);
            setIsManualInput(false);
            setNewWord('');
          }}
        >
          <div className="bg-[#1A1D24] border border-white/10 rounded-[1.5rem] p-6 w-full max-w-[320px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-sans font-bold tracking-tight mb-5 text-center text-white">
              {isSaving ? 'Map Action' : 'Enter Word'}
            </h3>
            
            {isSaving && currentSequence.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 justify-center bg-black/40 p-3 rounded-2xl border border-white/5">
                {currentSequence.map((dir, i) => {
                  const Icon = dir === 'UP' ? ArrowUp : dir === 'DOWN' ? ArrowDown : dir === 'LEFT' ? ArrowLeft : ArrowRight;
                  return (
                    <span key={i} className="p-1.5 bg-[#E63946]/20 shadow-sm rounded-lg text-[#E63946]">
                      <Icon size={18} strokeWidth={3} />
                    </span>
                  );
                })}
              </div>
            )}
            
            <input 
              type="text" 
              autoFocus
              className="w-full bg-[#0F1115] border border-white/10 text-center rounded-xl outline-none py-3.5 px-4 mb-6 text-lg font-medium text-white placeholder:text-white/30 focus:border-[#2A9D8F] transition-colors"
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              placeholder="Type word..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveWord();
              }}
            />
            
            <div className="flex justify-between gap-3">
              <button 
                className="flex-1 px-4 py-3 text-white/60 font-medium bg-white/5 hover:bg-white/10 rounded-xl transition-colors tracking-wide"
                onClick={() => {
                  setIsSaving(false);
                  setIsManualInput(false);
                  setNewWord('');
                  setCurrentSequence([]);
                }}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-4 py-3 bg-[#2A9D8F] text-white hover:bg-[#2A9D8F]/90 rounded-xl font-medium shadow-[0_0_15px_rgba(42,157,143,0.3)] transition-colors tracking-wide"
                onClick={handleSaveWord}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
