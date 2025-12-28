'use client';

import { useRef } from 'react';
import styles from './FilesPreviewBlock.module.css';

const FilesPreviewBlock = ({
  invoiceId,
  documents,
  notes,
  onDeleteDocument,
  onNotesChange,
  fileInputClick,
}) => {
  const notesInputRef = useRef(null);

  const handleNotesButtonClick = () => {
    notesInputRef.current?.focus();
  };

  return (
    <div className={styles.filesPreviewBlock}>
      <div className={styles.filesPreviewContent}>
        {/* Add File Button */}
        <div className={styles.addFileSection}>
          <button
            className={styles.addFileButton}
            onClick={fileInputClick}
            type="button"
          >
            <div className={styles.addFileIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
              >
                <path
                  d="M12 4v16m8-8H4"
                  stroke="#999999"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </button>
          <div className={styles.addFileText}>Add File</div>
        </div>

        {/* Document Previews */}
        {documents.length > 0 && (
          <div className={styles.documentsPreview}>
            {documents.map((doc) => {
              const handleViewDocument = () => {
                if (doc.blobUrl) {
                  window.open(doc.blobUrl, '_blank', 'noopener,noreferrer');
                }
              };

              return (
                <div key={doc.id} className={styles.documentPreview}>
                  <div className={styles.documentPreviewContent}>
                    {doc.blobUrl ? (
                      <iframe
                        src={doc.blobUrl}
                        className={styles.documentPreviewIframe}
                        title={doc.name}
                      />
                    ) : (
                      <>
                        <div className={styles.documentPreviewIcon}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            width={16}
                            height={16}
                          >
                            <rect
                              width="16"
                              height="16"
                              fill="#4CAF50"
                              rx="2"
                            />
                            <path
                              d="M5 6h6M5 9h6M5 12h4"
                              stroke="white"
                              strokeWidth="1"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div className={styles.documentPreviewText}>
                          <div className={styles.documentPreviewLines}>
                            <div className={styles.documentPreviewLine}></div>
                            <div className={styles.documentPreviewLine}></div>
                            <div className={styles.documentPreviewLine}></div>
                          </div>
                        </div>
                      </>
                    )}
                    {/* Hover Overlay */}
                    {doc.blobUrl && (
                      <div className={styles.documentPreviewOverlay}>
                        <button
                          className={styles.closeOverlayButton}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width={16}
                            height={16}
                          >
                            <path
                              d="M18 6L6 18M6 6l12 12"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        <button
                          className={styles.viewDocumentButton}
                          type="button"
                          onClick={handleViewDocument}
                        >
                          VIEW
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={styles.documentPreviewName}>{doc.name}</div>
                  <button
                    className={styles.deleteDocumentButton}
                    onClick={() => onDeleteDocument(invoiceId, doc.id)}
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={16}
                      height={16}
                    >
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="#666666"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className={styles.notesSection}>
        <button
          className={styles.addNotesButton}
          type="button"
          onClick={handleNotesButtonClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={16}
            height={16}
          >
            <path
              d="M12 4v16m8-8H4"
              stroke="#999999"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={16}
            height={16}
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              fill="none"
              stroke="#999999"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.addNotesText}>ADD NOTES</span>
        </button>
        <div className={styles.notesInputWrapper}>
          <textarea
            ref={notesInputRef}
            className={styles.notesInput}
            value={notes || ''}
            onChange={(e) => onNotesChange(invoiceId, e.target.value)}
            placeholder=""
            maxLength={255}
          />
          <div className={styles.notesCharCount}>
            {(notes || '').length}/255
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesPreviewBlock;
