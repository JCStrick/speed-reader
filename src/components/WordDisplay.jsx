import { getORP } from '../utils/orp';
import './WordDisplay.css';

export function WordDisplay({ word }) {
  if (!word) {
    return (
      <div className="word-display">
        <span className="word-placeholder">Ready</span>
      </div>
    );
  }

  const { left, orp, right } = getORP(word);

  return (
    <div className="word-display">
      <div className="word-container">
        <span className="word-left">{left}</span>
        <span className="word-orp">{orp}</span>
        <span className="word-right">{right}</span>
      </div>
      <div className="focus-line" />
    </div>
  );
}
