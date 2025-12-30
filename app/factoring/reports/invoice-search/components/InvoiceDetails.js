'use client';

import { useState, useEffect } from 'react';
import styles from './InvoiceDetails.module.css';
import { supabase } from '@/lib/supabase';

const InvoiceDetails = ({ invoiceId, invoiceNumber, onBack }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (!invoiceId) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', invoiceId)
          .single();

        if (queryError) {
          throw queryError;
        }

        setInvoiceData(data);
      } catch (err) {
        console.error('Error fetching invoice details:', err);
        setError(err.message || 'Failed to load invoice details.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  // Format amount as currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '';
    return `$${numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  // Format date as MM/DD/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch {
      return '';
    }
  };

  // Helper function to get documents array from invoice data
  const getDocumentsArray = () => {
    let documents = invoiceData?.documents || [];

    console.log('Raw documents data:', documents, 'Type:', typeof documents);

    // If documents is a string, try to parse it as JSON
    if (typeof documents === 'string') {
      try {
        documents = JSON.parse(documents);
        console.log('Parsed documents from JSON:', documents);
      } catch (err) {
        console.error('Error parsing documents:', err);
        documents = [];
      }
    }

    // Ensure documents is an array
    if (!Array.isArray(documents)) {
      console.warn('Documents is not an array, converting:', documents);
      // If it's a single string, wrap it in an array
      if (typeof documents === 'string' && documents.trim() !== '') {
        documents = [documents];
      } else {
        documents = [];
      }
    }

    // Filter out any null, undefined, or empty string values
    const filtered = documents.filter(
      (doc) => doc && typeof doc === 'string' && doc.trim() !== ''
    );

    console.log('Filtered documents array:', filtered);
    return filtered;
  };

  // Handle viewing documents - open all documents in separate windows
  const handleViewDocuments = (e) => {
    e.preventDefault();

    const documents = getDocumentsArray();

    console.log('Documents found:', documents.length, documents);

    if (documents.length === 0) {
      alert('No documents available for this invoice.');
      return;
    }

    // Validate URLs before opening
    const invalidUrls = [];
    documents.forEach((url, index) => {
      try {
        if (!url || typeof url !== 'string' || url.trim() === '') {
          invalidUrls.push({
            index: index + 1,
            reason: 'Empty or invalid URL',
          });
          return;
        }
        new URL(url); // Validate URL format
      } catch (urlError) {
        invalidUrls.push({ index: index + 1, reason: 'Invalid URL format' });
      }
    });

    if (invalidUrls.length > 0) {
      alert(
        `Some document URLs are invalid:\n${invalidUrls
          .map((u) => `Document ${u.index}: ${u.reason}`)
          .join('\n')}\n\n` + `Please check the invoice data in the database.`
      );
      return;
    }

    // Show helpful message about potential bucket errors
    console.log(
      `Opening ${documents.length} document(s). If you see "Bucket not found" errors, ensure:`
    );
    console.log('1. The "invoice-documents" bucket exists in Supabase Storage');
    console.log('2. Storage policies are configured (see STORAGE_SETUP.md)');
    console.log('3. The files exist in the bucket');

    // Open all documents immediately in a synchronous loop
    // Browsers allow multiple popups if they're all opened in the same synchronous execution
    // (without setTimeout delays which break the user interaction chain)
    const openedWindows = [];
    documents.forEach((docUrl, index) => {
      try {
        console.log(
          `Opening document ${index + 1}/${documents.length}:`,
          docUrl
        );
        const newWindow = window.open(
          docUrl,
          `_blank_${index}`, // Unique window name to allow multiple windows
          'noopener,noreferrer'
        );

        // Check if popup was blocked
        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed === 'undefined'
        ) {
          console.warn(`Popup blocked for document ${index + 1}:`, docUrl);
          openedWindows.push({ index: index + 1, success: false, url: docUrl });
        } else {
          console.log(`Successfully opened document ${index + 1}`);
          openedWindows.push({ index: index + 1, success: true, url: docUrl });
        }
      } catch (error) {
        console.error(`Error opening document ${index + 1}:`, docUrl, error);
        openedWindows.push({
          index: index + 1,
          success: false,
          url: docUrl,
          error,
        });
      }
    });

    // Report results
    const successful = openedWindows.filter((w) => w.success).length;
    const blocked = openedWindows.filter((w) => !w.success).length;

    console.log(`Opened ${successful} out of ${documents.length} documents`);

    if (blocked > 0) {
      console.warn(`${blocked} document(s) were blocked by popup blocker`);
      if (blocked > 0) {
        // Some opened, some blocked - log to console only
        console.warn(
          `Only ${successful} of ${documents.length} documents opened. ${blocked} were blocked.`
        );
      }
    }
  };

  // Check if documents are available
  const hasDocuments = getDocumentsArray().length > 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  if (!invoiceData) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.selectReportLabel}>Select Report</div>
          <div className={styles.reportDropdown}>
            <span>Invoice Search</span>
            <svg className={styles.dropdownArrow} viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" fill="#0000008a"></path>
            </svg>
          </div>
          <div className={styles.breadcrumb}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              className={styles.breadcrumbLink}
            >
              Invoice Search
            </a>{' '}
            <span className={styles.breadcrumbSeparator}>›</span> Invoice #
            {invoiceNumber || invoiceData.invoice_number || ''}
          </div>
        </div>
        <div className={styles.headerRight}>
          <div
            className={styles.viewDocuments}
            onClick={handleViewDocuments}
            style={{
              cursor: hasDocuments ? 'pointer' : 'not-allowed',
              opacity: hasDocuments ? 1 : 0.5,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="#0091EA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke="#0091EA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>View documents</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left Column - Invoice Details Summary */}
        <div className={styles.leftColumn}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Invoice Details Summary</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeaderCell}>Purchase Date</th>
                    <th className={styles.tableHeaderCell}>Invoice #</th>
                    <th className={styles.tableHeaderCell}>Load #</th>
                    <th className={styles.tableHeaderCell}>Amount</th>
                    <th className={styles.tableHeaderCell}>Fee</th>
                    <th className={styles.tableHeaderCell}>Purchase File #</th>
                    <th className={styles.tableHeaderCell}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.tableCell}>
                      {formatDate(
                        invoiceData.invoice_date || invoiceData.created_at
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {invoiceData.invoice_number || '-'}
                    </td>
                    <td className={styles.tableCell}>
                      {invoiceData.load_number || '-'}
                    </td>
                    <td className={styles.tableCell}>
                      {formatCurrency(invoiceData.amount)}
                    </td>
                    <td className={styles.tableCell}>
                      {formatCurrency(invoiceData.fee || 0)}
                    </td>
                    <td className={styles.tableCell}>
                      {invoiceData.purchase_file_number ||
                        invoiceData.batch_number ||
                        '-'}
                    </td>
                    <td className={styles.tableCell}>
                      {invoiceData.description || invoiceData.notes || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payments</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeaderCell}>Check #</th>
                    <th className={styles.tableHeaderCell}>Payment Date</th>
                    <th className={styles.tableHeaderCell}>Payment Type</th>
                    <th className={styles.tableHeaderCell}>Status</th>
                    <th className={styles.tableHeaderCell}>Reserve Earned</th>
                    <th className={styles.tableHeaderCell}>Amount</th>
                    <th className={styles.tableHeaderCell}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="7" className={styles.emptyState}>
                      Payment information available after invoice is paid.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Notes</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeaderCell}>Date</th>
                    <th className={styles.tableHeaderCell}>By</th>
                    <th className={styles.tableHeaderCell}>Action</th>
                    <th className={styles.tableHeaderCell}>Reasons</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.notes && invoiceData.notes.trim() !== '' ? (
                    <tr>
                      <td className={styles.tableCell}>
                        {formatDate(
                          invoiceData.updated_at || invoiceData.created_at
                        )}
                      </td>
                      <td className={styles.tableCell}>admin</td>
                      <td className={styles.tableCell}>Note Added</td>
                      <td className={styles.tableCell}>{invoiceData.notes}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="4" className={styles.emptyState}>
                        No notes provided.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Details */}
        <div className={styles.rightColumn}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Customer Details</h2>
            <div className={styles.customerCard}>
              <div className={styles.customerField}>
                <span className={styles.customerLabel}>Customer:</span>
                <span className={styles.customerValue}>
                  {invoiceData.customer_name || '-'}
                </span>
              </div>
              <div className={styles.customerField}>
                <span className={styles.customerLabel}>Customer Phone:</span>
                <span className={styles.customerValue}>
                  {invoiceData.customer_phone || '-'}
                </span>
              </div>
              <div className={styles.customerField}>
                <span className={styles.customerLabel}>Customer Email:</span>
                <span className={styles.customerValue}>
                  {invoiceData.customer_email || '-'}
                </span>
              </div>
              <div className={styles.customerField}>
                <span className={styles.customerLabel}>Avg Days to Pay:</span>
                <span className={styles.customerValue}>
                  {invoiceData.avg_days_to_pay
                    ? `${invoiceData.avg_days_to_pay} Days (Over The Last 60 Days)`
                    : '-'}
                </span>
              </div>
              <div className={styles.customerField}>
                <span className={styles.customerLabel}>Credit Rating:</span>
                <div className={styles.creditRating}>
                  <div className={styles.creditIcon}>C</div>
                  <span className={styles.creditText}>Average</span>
                </div>
              </div>
              <div className={styles.customerField}>
                <span className={styles.customerLabel}>Last Changed:</span>
                <span className={styles.customerValue}>
                  {formatDate(invoiceData.updated_at || invoiceData.created_at)}
                </span>
              </div>
              <div className={styles.viewCreditLink}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  View Credit Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
