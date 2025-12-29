'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import styles from './page.module.css';
import Image from 'next/image';
import FormInput from '@/app/components/FormInput';
import FilesPreviewBlock from './components/FilesPreviewBlock';
import PurchaseSection from './components/PurchaseSection';

const STORAGE_KEY = 'invoices_data';

// Convert File to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Convert base64 to File-like object
const base64ToFile = (base64String, fileName, mimeType) => {
  const byteString = atob(base64String.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
};

// Save invoices to localStorage
const saveInvoicesToStorage = async (invoices) => {
  try {
    const invoicesToSave = await Promise.all(
      invoices.map(async (invoice) => {
        const documents = await Promise.all(
          invoice.documents.map(async (doc) => {
            // If we have a File object, convert it to base64
            if (doc.file && doc.file instanceof File) {
              const base64 = await fileToBase64(doc.file);
              return {
                id: doc.id,
                name: doc.name,
                fileBase64: base64,
                fileName: doc.file.name,
                fileType: doc.file.type,
              };
            }
            // If fileBase64 already exists (from localStorage), keep it (without file object)
            if (doc.fileBase64) {
              return {
                id: doc.id,
                name: doc.name,
                fileBase64: doc.fileBase64,
                fileName: doc.fileName,
                fileType: doc.fileType,
              };
            }
            // Fallback: return doc without file/blobUrl
            return {
              id: doc.id,
              name: doc.name,
            };
          })
        );
        return {
          ...invoice,
          documents,
        };
      })
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoicesToSave));
  } catch (error) {
    console.error('Error saving invoices to localStorage:', error);
  }
};

// Load invoices from localStorage
const loadInvoicesFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const invoices = JSON.parse(stored);
    return invoices.map((invoice) => {
      const documents = invoice.documents.map((doc) => {
        // If we have base64 data, convert it back to File
        if (doc.fileBase64 && doc.fileName && doc.fileType) {
          const file = base64ToFile(doc.fileBase64, doc.fileName, doc.fileType);
          // Create blob URL for preview
          const blobUrl = URL.createObjectURL(file);
          return {
            id: doc.id,
            name: doc.name || doc.fileName,
            file,
            blobUrl,
          };
        }
        // Fallback: return doc as-is (shouldn't happen, but handle gracefully)
        return {
          id: doc.id,
          name: doc.name,
        };
      });
      return {
        ...invoice,
        documents,
      };
    });
  } catch (error) {
    console.error('Error loading invoices from localStorage:', error);
    return null;
  }
};

const Invoices = () => {
  // Initialize state from localStorage
  const [invoices, setInvoices] = useState(() => {
    if (typeof window !== 'undefined') {
      const loaded = loadInvoicesFromStorage();
      return loaded || [];
    }
    return [];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHeaderActive, setIsHeaderActive] = useState(() => {
    if (typeof window !== 'undefined') {
      const loaded = loadInvoicesFromStorage();
      return loaded && loaded.length > 0;
    }
    return false;
  });
  const [openPreviewId, setOpenPreviewId] = useState(null);
  const [generateCoverPages, setGenerateCoverPages] = useState(true);
  const bundleInputRef = useRef(null);
  const documentInputRefs = useRef({});
  const previewFileInputRefs = useRef({});
  const isInitialLoad = useRef(true);

  const handleCreateInvoice = () => {
    const newInvoice = {
      id: Date.now(),
      invoiceNumber: '',
      customerName: '',
      poNumber: '',
      amount: '',
      documents: [],
      notes: '',
    };
    setInvoices([...invoices, newInvoice]);
    setIsHeaderActive(true);
  };

  const handleDeleteInvoice = (id) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
    setInvoices(updatedInvoices);
    if (updatedInvoices.length === 0) {
      setIsHeaderActive(false);
    }
  };

  const handleInvoiceChange = (id, field, value) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, [field]: value } : invoice
      )
    );
  };

  // Format amount with $ and commas
  const formatAmount = (value) => {
    if (!value || value === '') return '';
    // Remove any existing formatting ($, commas)
    const numericValue = value.toString().replace(/[$,]/g, '');
    if (numericValue === '' || numericValue === '.') return '';

    // Handle decimal numbers
    const parts = numericValue.split('.');
    const integerPart = parts[0] || '';
    const decimalPart = parts[1] !== undefined ? '.' + parts[1] : '';

    if (integerPart === '' && decimalPart === '') return '';

    // Add commas to integer part using regex
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return '$' + formattedInteger + decimalPart;
  };

  // Parse formatted amount to raw number string
  const parseAmount = (formattedValue) => {
    // Remove $ and commas, keep numbers and decimal point
    return formattedValue.replace(/[$,]/g, '');
  };

  // Check if all text fields are filled
  const isAllFieldsFilled = (invoice) => {
    return (
      invoice.invoiceNumber?.trim() !== '' &&
      invoice.customerName?.trim() !== '' &&
      invoice.poNumber?.trim() !== '' &&
      invoice.amount?.trim() !== ''
    );
  };

  // Mark initial load as complete after first render
  useEffect(() => {
    isInitialLoad.current = false;
  }, []);

  // Save invoices to localStorage whenever they change (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad.current) {
      saveInvoicesToStorage(invoices);
    }
  }, [invoices]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleBundleUpload(files);
  };

  const handleBundleSelect = (e) => {
    const files = Array.from(e.target.files);
    handleBundleUpload(files);
  };

  const handleBundleUpload = (files) => {
    // TODO: Implement bundle upload logic
    console.log('Bundle upload:', files);
  };

  const handleDocumentUpload = (invoiceId, files) => {
    // Filter only PDF files
    const pdfFiles = Array.from(files).filter(
      (file) => file.type === 'application/pdf'
    );

    if (pdfFiles.length === 0) {
      // Optional: Show error message to user
      return;
    }

    // Create documents with blob URLs for preview
    const newDocuments = pdfFiles.map((file, index) => {
      const blobUrl = URL.createObjectURL(file);
      return {
        id: Date.now() + index,
        name: file.name,
        file: file,
        blobUrl: blobUrl,
      };
    });

    setInvoices(
      invoices.map((invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              documents: [...invoice.documents, ...newDocuments],
            }
          : invoice
      )
    );
  };

  const handleDocumentButtonClick = (invoiceId) => {
    const inputRef = documentInputRefs.current[invoiceId];
    if (inputRef) {
      inputRef.click();
    }
  };

  const handleDocumentFileSelect = (invoiceId, e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleDocumentUpload(invoiceId, files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleTogglePreview = (invoiceId) => {
    setOpenPreviewId(openPreviewId === invoiceId ? null : invoiceId);
  };

  const handlePreviewFileSelect = (invoiceId, e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleDocumentUpload(invoiceId, files);
    }
    e.target.value = '';
  };

  const handleNotesChange = (invoiceId, value) => {
    handleInvoiceChange(invoiceId, 'notes', value);
  };

  const handleDeleteDocument = (invoiceId, documentId) => {
    // Clean up blob URL before deleting
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    const document = invoice?.documents.find((doc) => doc.id === documentId);
    if (document?.blobUrl) {
      URL.revokeObjectURL(document.blobUrl);
    }

    setInvoices(
      invoices.map((invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              documents: invoice.documents.filter(
                (doc) => doc.id !== documentId
              ),
            }
          : invoice
      )
    );
  };

  // Handle remove all invoices
  const handleRemoveAll = () => {
    setInvoices([]);
    setIsHeaderActive(false);
  };

  // Check if all invoices are valid (all fields filled + documents uploaded)
  const areAllInvoicesValid = () => {
    if (invoices.length === 0) return false;
    return invoices.every(
      (invoice) =>
        isAllFieldsFilled(invoice) &&
        invoice.documents &&
        invoice.documents.length > 0
    );
  };

  // Handle submit purchase
  const handleSubmitPurchase = () => {
    // TODO: Implement submit to database logic
    console.log('Submitting purchase:', {
      invoices,
      generateCoverPages,
    });
  };

  return (
    <div className={styles.container}>
      {/* Instruction Banner */}
      <div className={styles.instructionBanner}>
        To guarantee same-day processing, invoices must include all
        documentation and be submitted before 12:00 PM CST
      </div>

      {/* Action Buttons Section */}
      <div className={styles.actionsSection}>
        <button
          className={styles.createInvoiceButton}
          onClick={handleCreateInvoice}
        >
          <Image
            src="/blue-plus-icon.svg"
            className={styles.createInvoiceIcon}
            alt="Create Invoice"
            width={15}
            height={15}
          />
          Create an invoice
        </button>

        <div
          className={`${styles.uploadBundleArea} ${
            isDragging ? styles.uploadBundleAreaDragging : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => bundleInputRef.current?.click()}
        >
          <input
            ref={bundleInputRef}
            type="file"
            multiple
            onChange={handleBundleSelect}
            className={styles.fileInput}
          />
          <Image
            src="/upload-icon.svg"
            className={styles.uploadBundleIcon}
            alt="Upload Bundle"
            width={20}
            height={20}
          />
          <span className={styles.uploadBundleText}>Upload Bundle</span>
        </div>
      </div>

      {/* Table Container */}
      <div className={styles.tableContainer}>
        {/* Table Header */}
        <div
          className={cn(
            styles.tableHeader,
            isHeaderActive && styles.tableHeaderActive
          )}
        >
          <div className={styles.tableHeaderCell}>
            <Image
              src="/month-icon.svg"
              className={styles.monthIcon}
              alt="Month"
              width={20}
              height={20}
            />
          </div>
          <div className={styles.tableHeaderCell}>INVOICE #</div>
          <div className={styles.tableHeaderCell}>CUSTOMER</div>
          <div className={styles.tableHeaderCell}>PO #</div>
          <div className={styles.tableHeaderCell}>AMOUNT</div>
          <div className={styles.tableHeaderCell}>
            DOCUMENTS
            <Image
              src="/info-icon-second.svg"
              className={styles.infoIcon}
              alt="Info"
              width={18}
              height={18}
            />
          </div>
        </div>

        {/* Empty State */}
        {invoices.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateText}>No invoices found.</div>
            <div className={styles.emptyStateSubtext}>
              Click or drag files above to create one.
            </div>
          </div>
        )}

        {/* Invoice Rows */}
        {invoices.map((invoice) => (
          <div key={invoice.id} className={styles.invoiceRow}>
            <div
              className={cn(
                styles.invoiceRowLeftBorder,
                isAllFieldsFilled(invoice) &&
                  invoice.documents?.length > 0 &&
                  styles.invoiceRowLeftBorderWithDocuments,
                isAllFieldsFilled(invoice) &&
                  (!invoice.documents || invoice.documents.length === 0) &&
                  styles.invoiceRowLeftBorderFilled
              )}
            ></div>
            <div
              className={cn(
                styles.invoiceRowContent,
                openPreviewId === invoice.id &&
                  styles.invoiceRowContentWithPreview
              )}
            >
              {/* Delete Button */}
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteInvoice(invoice.id)}
                aria-label="Delete invoice"
              >
                <Image
                  src="/delete-icon.svg"
                  alt="Delete"
                  width={24}
                  height={24}
                />
              </button>

              {/* Invoice # Input */}
              <FormInput
                id={`invoice-number-${invoice.id}`}
                name="invoiceNumber"
                type="text"
                label="Invoice #"
                className={styles.inputWrapper}
                value={invoice.invoiceNumber}
                onChange={(e) =>
                  handleInvoiceChange(
                    invoice.id,
                    'invoiceNumber',
                    e.target.value
                  )
                }
              />

              {/* Customer Name Input */}
              <FormInput
                id={`customer-name-${invoice.id}`}
                name="customerName"
                type="text"
                label="Customer Name"
                className={styles.inputWrapper}
                value={invoice.customerName}
                onChange={(e) =>
                  handleInvoiceChange(
                    invoice.id,
                    'customerName',
                    e.target.value
                  )
                }
              />

              {/* PO # Input */}
              <FormInput
                id={`po-number-${invoice.id}`}
                name="poNumber"
                type="text"
                label="PO #"
                className={styles.inputWrapper}
                value={invoice.poNumber}
                onChange={(e) =>
                  handleInvoiceChange(invoice.id, 'poNumber', e.target.value)
                }
              />

              {/* Amount Input */}
              <FormInput
                id={`amount-${invoice.id}`}
                name="amount"
                type="text"
                label="Amount"
                className={styles.inputWrapper}
                value={formatAmount(invoice.amount)}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  // Allow empty string
                  if (inputValue === '') {
                    handleInvoiceChange(invoice.id, 'amount', '');
                    return;
                  }

                  // Remove $ and commas for validation
                  const rawValue = parseAmount(inputValue);

                  // Only allow numbers and decimal point
                  if (/^\d*\.?\d*$/.test(rawValue)) {
                    handleInvoiceChange(invoice.id, 'amount', rawValue);
                  }
                }}
                inputMode="decimal"
              />

              {/* Documents Column */}
              <div className={styles.documentsColumn}>
                <div className={styles.documentIconWrapper}>
                  <button
                    className={styles.documentButton}
                    onClick={() => handleDocumentButtonClick(invoice.id)}
                    type="button"
                  >
                    <div className={styles.documentIconContainer}>
                      <Image
                        className={styles.documentIcon}
                        src="/document-icon.svg"
                        alt="Document"
                        width={20}
                        height={20}
                      />
                      <span className={styles.documentBadge}>
                        {invoice.documents.length}
                      </span>
                    </div>

                    <div className={styles.documentPlus}>
                      <Image
                        className={styles.documentPlusIcon}
                        src="/plus-icon.svg"
                        alt="Plus"
                        width={20}
                        height={20}
                      />
                    </div>
                  </button>
                  <input
                    ref={(el) => (documentInputRefs.current[invoice.id] = el)}
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => handleDocumentFileSelect(invoice.id, e)}
                    className={styles.fileInput}
                  />
                </div>
                <button
                  className={cn(
                    styles.showFilesBtn,
                    openPreviewId === invoice.id && styles.showFilesBtnActive
                  )}
                  onClick={() => handleTogglePreview(invoice.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 10.79 7.2"
                    width={12}
                    height={12}
                  >
                    <g id="arrow-left">
                      <path
                        d="M10.79,1.12a.47.47,0,0,0-.16-.31L9.8.11A.44.44,0,0,0,9.47,0a.49.49,0,0,0-.32.16L5.48,4.41a.12.12,0,0,1-.08,0,.13.13,0,0,1-.09,0L1.64.16A.47.47,0,0,0,1,.11L.16.81A.47.47,0,0,0,0,1.12a.42.42,0,0,0,.11.32L5.05,7.05a.45.45,0,0,0,.34.15.45.45,0,0,0,.35-.15l4.94-5.61A.41.41,0,0,0,10.79,1.12Z"
                        fill="#666666"
                      />
                    </g>
                  </svg>
                </button>
              </div>

              {/* Files Preview Block */}
              {openPreviewId === invoice.id && (
                <>
                  <input
                    ref={(el) =>
                      (previewFileInputRefs.current[invoice.id] = el)
                    }
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => handlePreviewFileSelect(invoice.id, e)}
                    className={styles.fileInput}
                  />
                  <FilesPreviewBlock
                    invoiceId={invoice.id}
                    documents={invoice.documents}
                    notes={invoice.notes}
                    onDeleteDocument={handleDeleteDocument}
                    onNotesChange={handleNotesChange}
                    fileInputClick={() =>
                      previewFileInputRefs.current[invoice.id]?.click()
                    }
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Purchase/Submit Section */}
      <PurchaseSection
        invoices={invoices}
        onRemoveAll={handleRemoveAll}
        onSubmitPurchase={handleSubmitPurchase}
        generateCoverPages={generateCoverPages}
        onGenerateCoverPagesChange={setGenerateCoverPages}
        isSubmitDisabled={!areAllInvoicesValid()}
      />
    </div>
  );
};

export default Invoices;
