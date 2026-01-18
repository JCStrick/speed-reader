const LIBRARY_KEY = 'speedreader_library';
const SETTINGS_KEY = 'speedreader_settings';

/**
 * Get all documents from library
 */
export function getLibrary() {
  try {
    const data = localStorage.getItem(LIBRARY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save document to library
 */
export function saveDocument(doc) {
  const library = getLibrary();
  const existingIndex = library.findIndex(d => d.id === doc.id);

  if (existingIndex >= 0) {
    library[existingIndex] = { ...library[existingIndex], ...doc };
  } else {
    library.unshift({
      id: doc.id || Date.now().toString(),
      title: doc.title || 'Untitled',
      text: doc.text,
      wordCount: doc.wordCount,
      currentIndex: doc.currentIndex || 0,
      createdAt: doc.createdAt || Date.now(),
      updatedAt: Date.now()
    });
  }

  localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  return library;
}

/**
 * Update document progress
 */
export function updateProgress(id, currentIndex) {
  const library = getLibrary();
  const doc = library.find(d => d.id === id);

  if (doc) {
    doc.currentIndex = currentIndex;
    doc.updatedAt = Date.now();
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  }

  return library;
}

/**
 * Delete document from library
 */
export function deleteDocument(id) {
  const library = getLibrary().filter(d => d.id !== id);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  return library;
}

/**
 * Get app settings
 */
export function getSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch {
    return getDefaultSettings();
  }
}

/**
 * Save app settings
 */
export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getDefaultSettings() {
  return {
    wpm: 300,
    autoMode: false,
    autoMinWpm: 200,
    autoMaxWpm: 600,
    theme: 'dark'
  };
}
