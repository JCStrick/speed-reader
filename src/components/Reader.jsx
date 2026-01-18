import { useEffect, useCallback, useRef } from 'react';
import { WordDisplay } from './WordDisplay';
import { Controls } from './Controls';
import './Reader.css';

export function Reader({ reader, onClose }) {
  const containerRef = useRef(null);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          reader.togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          reader.skipBack(e.shiftKey ? 50 : 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          reader.skipForward(e.shiftKey ? 50 : 10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          reader.setWpm(prev => Math.min(1000, prev + 25));
          break;
        case 'ArrowDown':
          e.preventDefault();
          reader.setWpm(prev => Math.max(100, prev - 25));
          break;
        case 'KeyF':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            reader.pause();
            onClose?.();
          }
          break;
        case 'KeyR':
          e.preventDefault();
          reader.restart();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reader, handleFullscreen, onClose]);

  return (
    <div className="reader" ref={containerRef}>
      <div className="reader-header">
        <button className="reader-close" onClick={onClose}>
          ← Back
        </button>
        <div className="reader-shortcuts">
          <span>Space: Play/Pause</span>
          <span>←→: Skip</span>
          <span>↑↓: Speed</span>
          <span>F: Fullscreen</span>
        </div>
      </div>

      <div className="reader-display">
        <WordDisplay word={reader.currentWord} />
      </div>

      <Controls
        isPlaying={reader.isPlaying}
        onTogglePlay={reader.togglePlay}
        onSkipBack={reader.skipBack}
        onSkipForward={reader.skipForward}
        onRestart={reader.restart}
        wpm={reader.wpm}
        onWpmChange={reader.setWpm}
        currentWpm={reader.currentWpm}
        autoMode={reader.autoMode}
        onAutoModeChange={reader.setAutoMode}
        autoMinWpm={reader.autoMinWpm}
        onAutoMinWpmChange={reader.setAutoMinWpm}
        autoMaxWpm={reader.autoMaxWpm}
        onAutoMaxWpmChange={reader.setAutoMaxWpm}
        progress={reader.progress}
        currentIndex={reader.currentIndex}
        totalWords={reader.totalWords}
        onSeek={reader.goToIndex}
        onFullscreen={handleFullscreen}
        disabled={reader.totalWords === 0}
      />
    </div>
  );
}
