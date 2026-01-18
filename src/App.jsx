import { useState, useEffect, useCallback } from 'react';
import { useReader } from './hooks/useReader';
import { InputForm } from './components/InputForm';
import { Library } from './components/Library';
import { Reader } from './components/Reader';
import { getLibrary, saveDocument } from './utils/storage';
import './App.css';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'reader'
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);

  const reader = useReader(activeDocId);

  // Load library on mount
  useEffect(() => {
    setDocuments(getLibrary());
  }, []);

  const refreshLibrary = useCallback(() => {
    setDocuments(getLibrary());
  }, []);

  const handleNewDocument = useCallback((doc) => {
    const newDoc = {
      ...doc,
      id: Date.now().toString(),
      currentIndex: 0,
      createdAt: Date.now()
    };

    saveDocument(newDoc);
    refreshLibrary();

    setActiveDocId(newDoc.id);
    reader.loadText(newDoc.text, 0);
    setView('reader');
  }, [reader, refreshLibrary]);

  const handleSelectDocument = useCallback((doc) => {
    setActiveDocId(doc.id);
    reader.loadText(doc.text, doc.currentIndex || 0);
    setView('reader');
  }, [reader]);

  const handleCloseReader = useCallback(() => {
    reader.pause();
    refreshLibrary();
    setView('home');
    setActiveDocId(null);
  }, [reader, refreshLibrary]);

  if (view === 'reader') {
    return (
      <Reader
        reader={reader}
        onClose={handleCloseReader}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Speed Reader</h1>
        <p>Read faster with RSVP and ORP highlighting</p>
      </header>

      <main className="app-main">
        <InputForm onSubmit={handleNewDocument} />
        <Library
          documents={documents}
          onSelect={handleSelectDocument}
          onRefresh={refreshLibrary}
        />
      </main>

      <footer className="app-footer">
        <p>
          Tip: Use <kbd>Space</kbd> to play/pause, <kbd>←</kbd><kbd>→</kbd> to skip,{' '}
          <kbd>↑</kbd><kbd>↓</kbd> to adjust speed
        </p>
      </footer>
    </div>
  );
}

export default App;
