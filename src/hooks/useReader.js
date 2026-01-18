import { useState, useEffect, useRef, useCallback } from 'react';
import { splitIntoWords, getDelayMultiplier } from '../utils/orp';
import { updateProgress } from '../utils/storage';

export function useReader(documentId) {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);
  const [autoMode, setAutoMode] = useState(false);
  const [autoMinWpm, setAutoMinWpm] = useState(200);
  const [autoMaxWpm, setAutoMaxWpm] = useState(600);

  const timerRef = useRef(null);
  const wordsRef = useRef([]);
  const indexRef = useRef(0);

  // Keep refs in sync
  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  // Load text
  const loadText = useCallback((text, startIndex = 0) => {
    const wordList = splitIntoWords(text);
    setWords(wordList);
    setCurrentIndex(startIndex);
    setIsPlaying(false);
  }, []);

  // Calculate current WPM in auto mode
  const getCurrentWpm = useCallback(() => {
    if (!autoMode) return wpm;

    const progress = wordsRef.current.length > 0
      ? indexRef.current / wordsRef.current.length
      : 0;

    return Math.round(autoMinWpm + (autoMaxWpm - autoMinWpm) * progress);
  }, [autoMode, wpm, autoMinWpm, autoMaxWpm]);

  // Advance to next word
  const advance = useCallback(() => {
    if (indexRef.current >= wordsRef.current.length - 1) {
      setIsPlaying(false);
      return;
    }

    const newIndex = indexRef.current + 1;
    setCurrentIndex(newIndex);

    // Save progress periodically
    if (documentId && newIndex % 10 === 0) {
      updateProgress(documentId, newIndex);
    }
  }, [documentId]);

  // Schedule next word
  const scheduleNext = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const currentWpm = getCurrentWpm();
    const baseInterval = 60000 / currentWpm;
    const word = wordsRef.current[indexRef.current] || '';
    const multiplier = getDelayMultiplier(word);
    const interval = baseInterval * multiplier;

    timerRef.current = setTimeout(() => {
      advance();
      if (indexRef.current < wordsRef.current.length - 1) {
        scheduleNext();
      }
    }, interval);
  }, [advance, getCurrentWpm]);

  // Play/pause control
  const play = useCallback(() => {
    if (words.length === 0) return;
    setIsPlaying(true);
  }, [words.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Navigation
  const skipBack = useCallback((count = 10) => {
    setCurrentIndex(prev => Math.max(0, prev - count));
  }, []);

  const skipForward = useCallback((count = 10) => {
    setCurrentIndex(prev => Math.min(words.length - 1, prev + count));
  }, [words.length]);

  const goToIndex = useCallback((index) => {
    setCurrentIndex(Math.max(0, Math.min(words.length - 1, index)));
  }, [words.length]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  // Handle playing state changes
  useEffect(() => {
    if (isPlaying && words.length > 0) {
      scheduleNext();
    } else if (!isPlaying && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, scheduleNext, words.length]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (documentId && indexRef.current > 0) {
        updateProgress(documentId, indexRef.current);
      }
    };
  }, [documentId]);

  return {
    // State
    words,
    currentWord: words[currentIndex] || '',
    currentIndex,
    totalWords: words.length,
    progress: words.length > 0 ? (currentIndex / (words.length - 1)) * 100 : 0,
    isPlaying,
    wpm,
    currentWpm: getCurrentWpm(),
    autoMode,
    autoMinWpm,
    autoMaxWpm,

    // Actions
    loadText,
    play,
    pause,
    togglePlay,
    skipBack,
    skipForward,
    goToIndex,
    restart,
    setWpm,
    setAutoMode,
    setAutoMinWpm,
    setAutoMaxWpm
  };
}
