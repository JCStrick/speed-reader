import { useState, useRef } from 'react';
import { parseFile, getTitleFromFile } from '../utils/fileParser';
import { splitIntoWords } from '../utils/orp';
import './InputForm.css';

export function InputForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleTextSubmit = () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    const words = splitIntoWords(text);
    onSubmit({
      title: title.trim() || 'Pasted Text',
      text: text.trim(),
      wordCount: words.length
    });

    setText('');
    setTitle('');
    setError('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      const extractedText = await parseFile(file);
      const words = splitIntoWords(extractedText);

      if (words.length === 0) {
        throw new Error('No readable text found in file');
      }

      onSubmit({
        title: getTitleFromFile(file),
        text: extractedText,
        wordCount: words.length
      });

      setText('');
      setTitle('');
    } catch (err) {
      setError(err.message || 'Failed to parse file');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const wordCount = splitIntoWords(text).length;

  return (
    <div className="input-form">
      <div className="input-header">
        <h2>Add Content</h2>
      </div>

      <div className="input-title">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="input-textarea">
        <textarea
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          rows={8}
        />
        {text && (
          <span className="word-count">{wordCount} words</span>
        )}
      </div>

      {error && <div className="input-error">{error}</div>}

      <div className="input-actions">
        <button
          className="btn btn-primary"
          onClick={handleTextSubmit}
          disabled={!text.trim() || isLoading}
        >
          Start Reading
        </button>

        <span className="divider">or</span>

        <label className="btn btn-secondary file-upload">
          {isLoading ? 'Loading...' : 'Upload File'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.docx,.md"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </label>
      </div>

      <p className="supported-formats">
        Supports PDF, TXT, DOCX, and Markdown files
      </p>
    </div>
  );
}
