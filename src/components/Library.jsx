import { getLibrary, deleteDocument } from '../utils/storage';
import './Library.css';

export function Library({ documents, onSelect, onRefresh }) {
  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirm('Delete this document?')) {
      deleteDocument(id);
      onRefresh();
    }
  };

  if (documents.length === 0) {
    return (
      <div className="library library-empty">
        <p>No documents yet. Paste text or upload a file to get started.</p>
      </div>
    );
  }

  return (
    <div className="library">
      <h3>Library</h3>
      <div className="library-list">
        {documents.map(doc => {
          const progress = doc.wordCount > 0
            ? Math.round((doc.currentIndex / doc.wordCount) * 100)
            : 0;

          return (
            <div
              key={doc.id}
              className="library-item"
              onClick={() => onSelect(doc)}
            >
              <div className="library-item-info">
                <h4>{doc.title}</h4>
                <span className="library-item-meta">
                  {doc.wordCount} words • {progress}% complete
                </span>
              </div>

              <div className="library-item-progress">
                <div
                  className="library-item-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="library-item-actions">
                <button
                  className="library-btn library-btn-resume"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(doc);
                  }}
                >
                  {doc.currentIndex > 0 ? 'Resume' : 'Start'}
                </button>
                <button
                  className="library-btn library-btn-delete"
                  onClick={(e) => handleDelete(e, doc.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
