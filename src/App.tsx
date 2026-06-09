import React, { useState, useRef, useEffect } from 'react';
import { Menu, Delete, RotateCcw, Keyboard, Volume2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function App() {
  const [mode, setMode] = useState<'talk' | 'entry'>('talk');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [dictionary, setDictionary] = useState<Record<string, string>>({
    'UP': 'Merhaba',
    'DOWN': 'Nasılsın',
    'RIGHT': 'Evet',
    'LEFT': 'Hayır',
    'UP,UP': 'Teşekkürler'
  });

  const [currentSequence, setCurrentSequence] = useState<Direction[]>([]);
  const [confirmedText, setConfirmedText] = useState<string[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);
  const [newWord, setNewWord] = useState('');

  const currentSequenceKey = currentSequence.join(',');
  const previewWord = dictionary[currentSequenceKey] || '';

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
    
    if (absDx > 30 || absDy > 30) {
      let dir: Direction;
      if (absDx > absDy) {
        dir = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        dir = dy > 0 ? 'DOWN' : 'UP';
      }
      setCurrentSequence(prev => [...prev, dir]);
    }
    
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
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Cihazınızda metin okuma özelliği desteklenmiyor.");
    }
  };

  // Add a fade in effect on mount
  useEffect(() => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F7F6F3] font-sans text-[#111111] overflow-hidden select-none">
      
      {/* Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#111111]/10 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className="relative w-64 h-full bg-[#FBFBFA] border-r border-[#EAEAEA] shadow-[4px_0_24px_rgba(0,0,0,0.04)] flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center gap-3 mb-10">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded border border-[#EAEAEA] bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.95] transition-transform"
              >
                <Menu className="w-5 h-5 text-[#2F3437]" strokeWidth={2.5} />
              </button>
              <h2 className="text-xl font-sans tracking-tight pt-0.5 text-[#111111] font-semibold">Menu</h2>
            </div>
            
            <nav className="flex flex-col gap-2">
              <button className="text-left px-4 py-3 bg-[#EAEAEA]/50 text-[#111111] font-medium rounded-md transition-colors tracking-wide">Talk</button>
              <button className="text-left px-4 py-3 text-[#787774] font-medium hover:bg-[#EAEAEA]/30 hover:text-[#111111] rounded-md transition-colors tracking-wide">Config</button>
              <button className="text-left px-4 py-3 text-[#787774] font-medium hover:bg-[#EAEAEA]/30 hover:text-[#111111] rounded-md transition-colors tracking-wide">Settings</button>
              <button className="text-left px-4 py-3 text-[#787774] font-medium hover:bg-[#EAEAEA]/30 hover:text-[#111111] rounded-md transition-colors tracking-wide">About</button>
            </nav>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-none items-center justify-between px-6 py-5 bg-[#F7F6F3] z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            className="w-8 h-8 rounded border border-[#EAEAEA] bg-white flex items-center justify-center active:scale-[0.95] transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            onClick={() => setIsMenuOpen(true)}
          >
             <Menu className="w-5 h-5 text-[#2F3437]" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-sans tracking-tight pt-0.5 text-[#111111] font-semibold">Glide & Write</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={`px-5 py-2.5 rounded-md text-sm font-semibold tracking-wide transition-all border shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.98] ${
              mode === 'talk' 
                ? 'bg-[#EDF3EC] text-[#346538] border-[#EDF3EC] hover:bg-[#E1EDE0]' 
                : 'bg-[#E1F3FE] text-[#1F6C9F] border-[#E1F3FE] hover:bg-[#D0EBFD]'
            }`}
            onClick={() => {
              setMode(mode === 'talk' ? 'entry' : 'talk');
              setCurrentSequence([]); 
            }}
          >
            {mode === 'talk' ? 'Talk On' : 'Entry On'}
          </button>
        </div>
      </header>

      {/* Text Area */}
      <div className="shrink-0 flex items-center justify-center flex-col min-h-[100px] sm:min-h-[160px] p-4 sm:p-8 text-center max-w-4xl mx-auto w-full">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3">
          {confirmedText.map((word, i) => (
            <span key={i} className="text-[#111111] text-4xl sm:text-6xl font-serif tracking-tight leading-[1.1]">
              {word}
            </span>
          ))}
          {mode === 'talk' && previewWord && (
            <span className="text-[#787774] text-4xl sm:text-6xl font-serif tracking-tight leading-[1.1] opacity-60">
              {previewWord}
            </span>
          )}
          {confirmedText.length === 0 && (!previewWord || mode === 'entry') && (
            <span className="text-[#787774] text-4xl sm:text-6xl font-serif tracking-tight leading-[1.1] opacity-30 pointer-events-none">
              Drafting...
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Area (Swipe Area + Stop Area) */}
      <div className="flex-1 flex flex-col relative w-full items-center justify-center max-w-lg mx-auto">
        
        {/* Swipe Area */}
        <div className="flex-1 w-full relative p-4 sm:p-8 flex items-center justify-center">
          <div 
            className="aspect-square w-full max-w-[320px] relative bg-[#FFFFFF] border border-[#EAEAEA] rounded-[16px] touch-none flex flex-col items-center justify-center overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_32px_rgba(0,0,0,0.04)] transition-shadow duration-300"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            {/* Background Hint Graphics */}
            <div className="absolute inset-0 pointer-events-none text-[#787774]/20">
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.1em] font-semibold">Up</span>
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.1em] font-semibold">Down</span>
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.1em] font-semibold -rotate-90">Left</span>
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.1em] font-semibold rotate-90">Right</span>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <ArrowUp strokeWidth={2.5} className="absolute top-0 w-5 h-5 text-[#787774]" />
                  <ArrowDown strokeWidth={2.5} className="absolute bottom-0 w-5 h-5 text-[#787774]" />
                  <ArrowLeft strokeWidth={2.5} className="absolute left-0 w-5 h-5 text-[#787774]" />
                  <ArrowRight strokeWidth={2.5} className="absolute right-0 w-5 h-5 text-[#787774]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#787774]" />
                </div>
              </div>
            </div>

            {/* Live Swipe Trail */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <polyline 
                ref={trailRef}
                points="" 
                fill="none" 
                stroke={mode === 'entry' ? "#9F2F2D" : "#346538"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-60"
              />
            </svg>

            {/* Sequence Status Indicator */}
            {currentSequence.length > 0 && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-20">
                {/* Preview Badge */}
                {mode === 'talk' && previewWord && (
                  <div className="text-[#111111] font-medium bg-white border border-[#EAEAEA] px-5 py-2.5 rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-base tracking-tight">
                    {previewWord}
                  </div>
                )}
                {mode === 'entry' && previewWord && (
                  <div className="text-[#9F2F2D] font-medium bg-[#FDEBEC] border border-[#FDEBEC] px-4 py-2 rounded-md text-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    Existing: "{previewWord}"
                  </div>
                )}
                
                {/* Arrows Container */}
                <div className="flex gap-1.5 p-1.5 bg-white rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#EAEAEA]">
                  {currentSequence.map((dir, i) => {
                    const Icon = dir === 'UP' ? ArrowUp : dir === 'DOWN' ? ArrowDown : dir === 'LEFT' ? ArrowLeft : ArrowRight;
                    return (
                      <span key={i} className={`p-1.5 rounded-sm ${mode === 'entry' ? 'bg-[#FDEBEC] text-[#9F2F2D]' : 'bg-[#EDF3EC] text-[#346538]'}`}>
                        <Icon size={16} strokeWidth={2.5} />
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
          className="h-16 sm:h-20 w-[calc(100%-2rem)] sm:w-[calc(100%-5rem)] shrink-0 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[8px] flex flex-col items-center justify-center active:scale-[0.98] transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] mt-2 mb-4 sm:mb-8"
          onClick={handleStop}
        >
          <span className="text-[11px] tracking-[0.15em] text-[#2F3437] font-semibold uppercase pointer-events-none">Finalize Word</span>
          {mode === 'entry' && <span className="text-[10px] text-[#787774] mt-1 font-mono">Click to map action</span>}
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="shrink-0 max-w-4xl mx-auto w-full grid grid-cols-4 px-4 sm:px-6 py-4 sm:py-6 border-t border-[#EAEAEA] bg-[#F7F6F3] relative z-20 pb-safe gap-2 sm:gap-4">
        <button onClick={() => setConfirmedText([])} className="flex flex-col items-center justify-center p-3 sm:p-4 text-[#787774] hover:text-[#111111] hover:bg-white border border-transparent hover:border-[#EAEAEA] transition-all rounded-lg active:scale-[0.95]">
          <Delete className="w-5 h-5 mb-2" strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-[0.05em] uppercase">Clear</span>
        </button>
        <button onClick={() => setConfirmedText(prev => prev.slice(0, -1))} className="flex flex-col items-center justify-center p-4 text-[#787774] hover:text-[#111111] hover:bg-white border border-transparent hover:border-[#EAEAEA] transition-all rounded-lg active:scale-[0.95]">
          <RotateCcw className="w-5 h-5 mb-2" strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-[0.05em] uppercase">Undo</span>
        </button>
        <button onClick={() => setIsManualInput(true)} className="flex flex-col items-center justify-center p-4 text-[#787774] hover:text-[#111111] hover:bg-white border border-transparent hover:border-[#EAEAEA] transition-all rounded-lg active:scale-[0.95]">
          <Keyboard className="w-5 h-5 mb-2" strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-[0.05em] uppercase">Type</span>
        </button>
        <button onClick={() => speakText(confirmedText.join(' '))} className="flex flex-col items-center justify-center p-4 text-[#111111] bg-white border border-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all rounded-lg active:scale-[0.95]">
          <Volume2 className="w-5 h-5 mb-2" strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-[0.05em] uppercase">Speak</span>
        </button>
      </div>

      {/* Save Word / Keyboard Modal Overlay */}
      {(isSaving || isManualInput) && (
        <div 
          className="fixed inset-0 z-[200] bg-[#111111]/10 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => {
            setIsSaving(false);
            setIsManualInput(false);
            setNewWord('');
          }}
        >
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl p-8 w-full max-w-[360px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] transform transition-transform animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-sans font-medium tracking-tight mb-6 text-[#111111]">
              {isSaving ? 'Map Action' : 'Enter Word'}
            </h3>
            
            {isSaving && currentSequence.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 items-center border-b border-[#EAEAEA] pb-6">
                {currentSequence.map((dir, i) => {
                  const Icon = dir === 'UP' ? ArrowUp : dir === 'DOWN' ? ArrowDown : dir === 'LEFT' ? ArrowLeft : ArrowRight;
                  return (
                    <span key={i} className="p-2 bg-[#FDEBEC] rounded-md text-[#9F2F2D] border border-[#FDEBEC]/50">
                      <Icon size={16} strokeWidth={2.5} />
                    </span>
                  );
                })}
              </div>
            )}
            
            <input 
              type="text" 
              autoFocus
              className="w-full bg-[#F7F6F3] border border-[#EAEAEA] rounded-md outline-none py-3 px-4 mb-8 text-base font-medium text-[#111111] placeholder:text-[#787774] focus:border-[#111111] focus:bg-white transition-colors"
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              placeholder="Type your word..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveWord();
              }}
            />
            
            <div className="flex justify-end gap-3">
              <button 
                className="px-5 py-2.5 text-[#787774] text-sm font-medium hover:text-[#111111] transition-colors"
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
                className="px-6 py-2.5 bg-[#111111] text-[#FFFFFF] hover:bg-[#2F3437] rounded-md text-sm font-medium transition-all active:scale-[0.98]"
                onClick={handleSaveWord}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
