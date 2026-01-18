import './Controls.css';

export function Controls({
  isPlaying,
  onTogglePlay,
  onSkipBack,
  onSkipForward,
  onRestart,
  wpm,
  onWpmChange,
  currentWpm,
  autoMode,
  onAutoModeChange,
  autoMinWpm,
  onAutoMinWpmChange,
  autoMaxWpm,
  onAutoMaxWpmChange,
  progress,
  currentIndex,
  totalWords,
  onSeek,
  onFullscreen,
  disabled
}) {
  return (
    <div className="controls">
      <div className="controls-main">
        <button
          className="control-btn"
          onClick={onRestart}
          disabled={disabled}
          title="Restart"
        >
          ⏮
        </button>

        <button
          className="control-btn"
          onClick={() => onSkipBack(10)}
          disabled={disabled}
          title="Back 10 words"
        >
          ⏪
        </button>

        <button
          className="control-btn control-btn-play"
          onClick={onTogglePlay}
          disabled={disabled}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          className="control-btn"
          onClick={() => onSkipForward(10)}
          disabled={disabled}
          title="Forward 10 words"
        >
          ⏩
        </button>

        <button
          className="control-btn"
          onClick={onFullscreen}
          title="Full screen"
        >
          ⛶
        </button>
      </div>

      <div className="progress-section">
        <input
          type="range"
          className="progress-bar"
          min="0"
          max={Math.max(1, totalWords - 1)}
          value={currentIndex}
          onChange={(e) => onSeek(parseInt(e.target.value))}
          disabled={disabled}
        />
        <div className="progress-info">
          <span>{currentIndex + 1} / {totalWords}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="speed-section">
        <div className="speed-manual">
          <label>
            Speed: <strong>{autoMode ? currentWpm : wpm} WPM</strong>
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            step="10"
            value={wpm}
            onChange={(e) => onWpmChange(parseInt(e.target.value))}
            disabled={autoMode}
          />
        </div>

        <div className="speed-auto">
          <label className="auto-toggle">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => onAutoModeChange(e.target.checked)}
            />
            Auto speed ramp
          </label>

          {autoMode && (
            <div className="auto-range">
              <div className="auto-input">
                <label>Min</label>
                <input
                  type="number"
                  min="100"
                  max={autoMaxWpm - 50}
                  step="10"
                  value={autoMinWpm}
                  onChange={(e) => onAutoMinWpmChange(parseInt(e.target.value))}
                />
              </div>
              <div className="auto-input">
                <label>Max</label>
                <input
                  type="number"
                  min={autoMinWpm + 50}
                  max="1200"
                  step="10"
                  value={autoMaxWpm}
                  onChange={(e) => onAutoMaxWpmChange(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
