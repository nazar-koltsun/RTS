'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import CustomerExtraFields from './CustomerExtraFields';
import styles from './FilesPreviewBlock.module.css';

const FilesPreviewBlock = ({
  invoiceId,
  documents,
  notes,
  customerEmail,
  customerPhone,
  paymentCheck,
  paymentDate,
  paymentStatus,
  onDeleteDocument,
  onNotesChange,
  onCustomerEmailChange,
  onCustomerPhoneChange,
  onPaymentCheckChange,
  onPaymentDateChange,
  onPaymentStatusChange,
  fileInputClick,
  inputClassName,
}) => {
  const notesInputRef = useRef(null);
  const [isNotesExpanded, setIsNotesExpanded] = useState(!!notes);

  const handleNotesButtonClick = () => {
    setIsNotesExpanded(true);
    // Focus the textarea after a short delay to ensure it's rendered
    setTimeout(() => {
      notesInputRef.current?.focus();
    }, 0);
  };

  const handleCloseNotes = () => {
    setIsNotesExpanded(false);
  };

  return (
    <>
      <CustomerExtraFields
        invoiceId={invoiceId}
        customerEmail={customerEmail}
        customerPhone={customerPhone}
        paymentCheck={paymentCheck}
        paymentDate={paymentDate}
        paymentStatus={paymentStatus}
        onCustomerEmailChange={onCustomerEmailChange}
        onCustomerPhoneChange={onCustomerPhoneChange}
        onPaymentCheckChange={onPaymentCheckChange}
        onPaymentDateChange={onPaymentDateChange}
        onPaymentStatusChange={onPaymentStatusChange}
        inputClassName={inputClassName}
      />
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
                <Image
                  src="/plus-icon.svg"
                  alt="Add File"
                  width={14}
                  height={14}
                />
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
                              onDeleteDocument(invoiceId, doc.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width={14}
                              height={14}
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
          {!isNotesExpanded ? (
            <button
              className={styles.addNotesButton}
              type="button"
              onClick={handleNotesButtonClick}
            >
              <Image
                src="/notes-icon.svg"
                alt="Add Notes"
                width={20}
                height={20}
              />
              <span className={styles.addNotesText}>ADD NOTES</span>
            </button>
          ) : (
            <div className={styles.notesInputWrapper}>
              <Image
                src="/notes-icon.svg"
                alt="Notes"
                width={20}
                height={20}
                className={styles.notesIcon}
              />
              <input
                ref={notesInputRef}
                name="notes"
                id="notes"
                className={styles.notesInput}
                value={notes || ''}
                onChange={(e) => onNotesChange(invoiceId, e.target.value)}
                placeholder=""
                maxLength={255}
              />
              <button
                className={styles.closeNotesButton}
                type="button"
                onClick={handleCloseNotes}
              >
                <Image
                  src="/close-icon.svg"
                  alt="Close"
                  width={15}
                  height={15}
                />
              </button>
              <div className={styles.notesCharCount}>
                {(notes || '').length}/255
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilesPreviewBlock;
