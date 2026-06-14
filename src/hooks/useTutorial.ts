import { useState, useEffect } from 'react';

const CURRENT_TUTORIAL_VERSION = 1;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export type TutorialStatus = 'pending' | 'language_selection' | 'prompt' | 'running' | 'completed' | 'skipped' | 'later' | 'idle';

export interface TutorialState {
  version: number;
  status: TutorialStatus;
  lastPromptTime: number;
  step: number;
}

export const useTutorial = () => {
  const [tutorialState, setTutorialState] = useState<TutorialState>(() => {
    const saved = localStorage.getItem('gw_tutorial');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if we need to show the prompt again due to 'later'
        if (parsed.status === 'later' && Date.now() - parsed.lastPromptTime > TWENTY_FOUR_HOURS) {
          return { ...parsed, status: 'prompt' };
        }
        // If there's a new version, reset to pending
        if ((parsed.version || 0) < CURRENT_TUTORIAL_VERSION) {
          return { ...parsed, status: 'pending' };
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse tutorial state', e);
      }
    }
    return {
      version: 0, // 0 forces it to trigger pending logic
      status: 'pending',
      lastPromptTime: 0,
      step: 1
    };
  });

  useEffect(() => {
    localStorage.setItem('gw_tutorial', JSON.stringify(tutorialState));
  }, [tutorialState]);

  useEffect(() => {
    if (tutorialState.status === 'pending') {
      setTutorialState(prev => ({
        ...prev,
        status: 'language_selection'
      }));
    }
  }, [tutorialState.status]);

  const setLanguageSelected = () => {
    setTutorialState(prev => ({ ...prev, status: 'prompt' }));
  };

  const startTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      status: 'running',
      step: 1,
      version: CURRENT_TUTORIAL_VERSION
    }));
  };

  const skipTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      status: 'skipped',
      version: CURRENT_TUTORIAL_VERSION
    }));
  };

  const askLater = () => {
    setTutorialState(prev => ({
      ...prev,
      status: 'later',
      lastPromptTime: Date.now(),
      version: CURRENT_TUTORIAL_VERSION
    }));
  };

  const nextStep = (targetStep: number) => {
    setTutorialState(prev => {
      if (prev.status !== 'running') return prev;
      if (prev.step === targetStep - 1 || targetStep === prev.step + 1) {
        return { ...prev, step: targetStep };
      }
      return prev;
    });
  };

  const finishTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      status: 'completed',
      version: CURRENT_TUTORIAL_VERSION
    }));
  };

  const forceStart = () => {
    setTutorialState(prev => ({
      ...prev,
      status: 'running',
      step: 1,
      version: CURRENT_TUTORIAL_VERSION
    }));
  };

  return {
    tutorialState,
    setLanguageSelected,
    startTutorial,
    skipTutorial,
    askLater,
    nextStep,
    finishTutorial,
    forceStart
  };
};
