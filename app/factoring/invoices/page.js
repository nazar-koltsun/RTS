'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const bundleInputRef = useRef(null);

  const handleCreateInvoice = () => {
    const newInvoice = {
      id: Date.now(),
      invoiceNumber: '',
      customerName: '',
      poNumber: '',
      amount: '',
      documents: [],
    };
    setInvoices([...invoices, newInvoice]);
  };

  const handleDeleteInvoice = (id) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
  };

  const handleInvoiceChange = (id, field, value) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, [field]: value } : invoice
      )
    );
  };

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
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              documents: [
                ...invoice.documents,
                ...files.map((file, index) => ({
                  id: Date.now() + index,
                  name: file.name,
                  file: file,
                })),
              ],
            }
          : invoice
      )
    );
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
        <div className={styles.tableHeader}>
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
            <div className={styles.invoiceRowLeftBorder}></div>
            <div className={styles.invoiceRowContent}>
              {/* Delete Button */}
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteInvoice(invoice.id)}
                aria-label="Delete invoice"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                    stroke="#666666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Invoice # Input */}
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Invoice #"
                  value={invoice.invoiceNumber}
                  onChange={(e) =>
                    handleInvoiceChange(
                      invoice.id,
                      'invoiceNumber',
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Customer Name Input */}
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Customer Name"
                  value={invoice.customerName}
                  onChange={(e) =>
                    handleInvoiceChange(
                      invoice.id,
                      'customerName',
                      e.target.value
                    )
                  }
                />
              </div>

              {/* PO # Input */}
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="PO #"
                  value={invoice.poNumber}
                  onChange={(e) =>
                    handleInvoiceChange(invoice.id, 'poNumber', e.target.value)
                  }
                />
              </div>

              {/* Amount Input */}
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Amount"
                  value={invoice.amount}
                  onChange={(e) =>
                    handleInvoiceChange(invoice.id, 'amount', e.target.value)
                  }
                />
              </div>

              {/* Documents Column */}
              <div className={styles.documentsColumn}>
                <div className={styles.documentIconWrapper}>
                  <svg
                    className={styles.documentIcon}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="#666666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="#666666"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {invoice.documents.length > 0 && (
                    <span className={styles.documentBadge}>
                      {invoice.documents.length}
                    </span>
                  )}
                </div>
                <svg
                  className={styles.chevronIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="#666666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoices;
