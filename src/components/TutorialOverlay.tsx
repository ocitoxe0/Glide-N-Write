import React, { useEffect, useState } from 'react';
import { useTranslation } from '../i18n';
import { TutorialStatus, TutorialState } from '../hooks/useTutorial';
import { Globe, X } from 'lucide-react';

interface TutorialOverlayProps {
  tutorialState: TutorialState;
  setLanguageSelected: () => void;
  startTutorial: () => void;
  skipTutorial: () => void;
  askLater: () => void;
  nextStep: (step: number) => void;
  finishTutorial: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  tutorialState,
  setLanguageSelected,
  startTutorial,
  skipTutorial,
  askLater,
  nextStep,
  finishTutorial
}) => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (tutorialState.status !== 'running') return;

    const updateRect = () => {
      let targetElement = document.querySelector(`[data-tutorial="step-${tutorialState.step}"]`);
      
      // Removed fallback logic because menu opening is now explicit
      if (targetElement) {
        setTargetRect(targetElement.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    const observer = new MutationObserver(updateRect);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateRect);
      window.visualViewport.addEventListener('scroll', updateRect);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateRect);
        window.visualViewport.removeEventListener('scroll', updateRect);
      }
    };
  }, [tutorialState.status, tutorialState.step]);

  if (tutorialState.status === 'language_selection') {
    return (
      <div className="fixed inset-0 z-[9999] bg-text/40 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-surface border border-border shadow-2xl rounded-2xl p-6 sm:p-8 max-w-md w-full flex flex-col gap-6 animate-in zoom-in-95 duration-300">
          <div className="flex flex-col gap-2 text-center">
            <Globe className="w-12 h-12 text-text mx-auto mb-2 opacity-80" />
            <h2 className="text-2xl font-bold text-text">Select Language</h2>
            <p className="text-muted text-sm">{t('tutorial.selectLanguage')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto hide-scrollbar p-1">
            {availableLanguages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setLanguageSelected();
                }}
                className={`p-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${language === lang.code ? 'bg-text text-surface shadow-md border-transparent' : 'bg-surface/50 border-border text-text hover:border-[#D5D5D5]'}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tutorialState.status === 'prompt') {
    return (
      <div className="fixed inset-0 z-[9999] bg-text/40 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-surface border border-border shadow-2xl rounded-2xl p-6 sm:p-8 max-w-md w-full flex flex-col gap-6 animate-in zoom-in-95 duration-300">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-bold text-text">{t('tutorial.promptTitle')}</h2>
            <p className="text-muted text-sm">{t('tutorial.promptDesc')}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={startTutorial}
              className="w-full py-3.5 bg-text text-surface font-semibold rounded-xl active:scale-[0.98] transition-transform shadow-md"
            >
              {t('tutorial.btnYes')}
            </button>
            <button
              onClick={askLater}
              className="w-full py-3.5 bg-surface text-text border border-border font-medium rounded-xl hover:bg-canvas active:scale-[0.98] transition-all"
            >
              {t('tutorial.btnLater')}
            </button>
            <button
              onClick={skipTutorial}
              className="w-full py-3.5 bg-transparent text-muted font-medium rounded-xl hover:text-text transition-colors"
            >
              {t('tutorial.btnNo')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (tutorialState.status === 'running') {
    const step = tutorialState.step;
    const title = t(`tutorial.step${step}Title`);
    const desc = t(`tutorial.step${step}Desc`);

    const hasNextBtn = [7, 10, 17].includes(step);
    const hasFinishBtn = step === 18;

    return (
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* Overlay Background with Cutout (4 divs approach for pointer-events) */}
        {targetRect ? (
          <>
            <div className="absolute top-0 left-0 right-0 bg-text/40 pointer-events-auto" style={{ height: Math.max(0, targetRect.top - 4) }} />
            <div className="absolute left-0 bg-text/40 pointer-events-auto" style={{ top: Math.max(0, targetRect.top - 4), height: targetRect.height + 8, width: Math.max(0, targetRect.left - 4) }} />
            <div className="absolute right-0 bg-text/40 pointer-events-auto" style={{ top: Math.max(0, targetRect.top - 4), height: targetRect.height + 8, width: Math.max(0, window.innerWidth - (targetRect.left + targetRect.width + 4)) }} />
            <div className="absolute bottom-0 left-0 right-0 bg-text/40 pointer-events-auto" style={{ top: targetRect.top + targetRect.height + 4 }} />
          </>
        ) : (
          <div className="absolute inset-0 bg-text/40 pointer-events-auto" />
        )}

        {/* Highlight Border */}
        {targetRect && (
          <div
            className="absolute border-2 border-white rounded-xl transition-all duration-300 pointer-events-none"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              boxShadow: '0 0 0 4px rgba(255,255,255,0.2)'
            }}
          />
        )}

        {/* Content Tooltip */}
        <div
          className="absolute bg-surface border border-border rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-w-sm w-[90%] pointer-events-auto transition-all duration-300 flex flex-col gap-3"
          style={{
            top: targetRect ? (targetRect.top > window.innerHeight / 2 ? 32 : 'auto') : '50%',
            bottom: targetRect ? (targetRect.top > window.innerHeight / 2 ? 'auto' : 32) : 'auto',
            left: '50%',
            transform: targetRect ? 'translateX(-50%)' : 'translate(-50%, -50%)',
          }}
        >
            <button onClick={finishTutorial} className="absolute top-3 right-3 text-muted hover:text-text">
                <X className="w-4 h-4" />
            </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-text text-surface text-xs font-bold flex items-center justify-center shrink-0">
              {step}
            </span>
            <h3 className="font-bold text-text">{title}</h3>
          </div>
          <p className="text-sm text-muted leading-relaxed">{desc}</p>

          {(hasNextBtn || hasFinishBtn) && (
            <div className="flex justify-end mt-2">
              <button
                onClick={() => hasFinishBtn ? finishTutorial() : nextStep(step + 1)}
                className="px-4 py-2 bg-text text-surface text-sm font-semibold rounded-lg shadow-sm active:scale-[0.98] transition-transform"
              >
                {hasFinishBtn ? t('tutorial.finish') : t('tutorial.next')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
