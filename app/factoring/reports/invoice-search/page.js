'use client';

import { useState } from 'react';
import styles from './page.module.css';
import SearchInput from '@/app/components/SearchInput';
import Button from '@/app/components/Button';
import SearchIcon from '@/app/components/icons/SearchIcon';
import PrintIcon from '@/app/components/icons/PrintIcon';
import DownloadIcon from '@/app/components/icons/DownloadIcon';
import FilterIcon from '@/app/components/icons/FilterIcon';
import ArrowLeftIcon from '@/app/components/icons/ArrowLeftIcon';
import ArrowRightIcon from '@/app/components/icons/ArrowRightIcon';
import { supabase } from '@/lib/supabase';
import InvoiceDetails from './components/InvoiceDetails';

const InvoiceSearchPage = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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

  const handleView = async () => {
    // At least one field must be provided
    const hasInvoiceNumber = invoiceNumber && invoiceNumber.trim() !== '';
    const hasReferenceNumber = referenceNumber && referenceNumber.trim() !== '';

    if (!hasInvoiceNumber && !hasReferenceNumber) {
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      // Build query based on search criteria
      let query = supabase.from('invoices').select('*');

      // Search by invoice number if provided
      if (hasInvoiceNumber) {
        query = query.ilike('invoice_number', `%${invoiceNumber.trim()}%`);
      }

      // Search by po_number if reference number is provided
      if (hasReferenceNumber) {
        query = query.ilike('po_number', `%${referenceNumber.trim()}%`);
      }

      const { data, error: queryError } = await query.order('created_at', {
        ascending: false,
      });

      if (queryError) {
        throw queryError;
      }

      // Map database fields to display fields
      const mappedData = (data || []).map((invoice) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number || '',
        customerName: invoice.customer_name || '',
        invoiceDate: formatDate(invoice.invoice_date || invoice.created_at),
        batchNumber: invoice.batch_number || '',
        purchaseOrder: invoice.po_number || '',
        description: invoice.description || invoice.notes || '',
        invoiceAmount: formatCurrency(invoice.amount),
        balance: formatCurrency(invoice.balance || invoice.amount),
      }));

      setTableData(mappedData);
    } catch (err) {
      console.error('Error searching invoices:', err);
      setError(err.message || 'Failed to search invoices. Please try again.');
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalRows = tableData.length;
  const startRow = totalRows > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);
  const paginatedData = tableData.slice(startRow - 1, endRow);

  // Reset to first page when data changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle row click to show invoice details
  const handleRowClick = (row) => {
    setSelectedInvoice(row);
  };

  // Handle back from invoice details
  const handleBackFromDetails = () => {
    setSelectedInvoice(null);
  };

  // If an invoice is selected, show the details view
  if (selectedInvoice) {
    return (
      <div className={styles.container}>
        {/* Report Selection */}
        <div className={styles.reportSelection}>
          <div className={styles.selectReportLabel}>Select Report</div>

          <div className={styles.reportDropdown}>
            <span>Invoice Search</span>
            <svg className={styles.dropdownArrow} viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" fill="#0000008a"></path>
            </svg>
          </div>
        </div>

        <InvoiceDetails
          invoiceId={selectedInvoice.id}
          invoiceNumber={selectedInvoice.invoiceNumber}
          onBack={handleBackFromDetails}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Report Selection */}
      <div className={styles.reportSelection}>
        <div className={styles.selectReportLabel}>Select Report</div>

        <div className={styles.reportDropdown}>
          <span>Invoice Search</span>
          <svg className={styles.dropdownArrow} viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" fill="#0000008a"></path>
          </svg>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchInputs}>
          <SearchInput
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleView()}
          />
          <SearchInput
            placeholder="Reference Number"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleView()}
          />
          <Button
            className={styles.viewButton}
            onClick={handleView}
            disabled={
              ((!invoiceNumber || invoiceNumber.trim() === '') &&
                (!referenceNumber || referenceNumber.trim() === '')) ||
              loading
            }
          >
            View
          </Button>
        </div>
        <div className={styles.actionIcons}>
          <SearchIcon fill="#a8a8a8" />
          <PrintIcon />
          <DownloadIcon fill="#a8a8a8" />
          <FilterIcon fill="#a8a8a8" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeaderCell}>Invoice Number</th>
              <th className={styles.tableHeaderCell}>Customer Name</th>
              <th className={styles.tableHeaderCell}>Invoice Date</th>
              <th className={styles.tableHeaderCell}>Batch Number</th>
              <th className={styles.tableHeaderCell}>Purchase Order</th>
              <th className={styles.tableHeaderCell}>Description</th>
              <th className={styles.tableHeaderCell}>Invoice Amount</th>
              <th className={styles.tableHeaderCell}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className={styles.emptyState}>
                  <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.emptyState}></td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={styles.tableRow}
                  onClick={() => handleRowClick(row)}
                >
                  <td className={styles.tableCell}>{row.invoiceNumber}</td>
                  <td className={styles.tableCell}>{row.customerName}</td>
                  <td className={styles.tableCell}>{row.invoiceDate}</td>
                  <td className={styles.tableCell}>{row.batchNumber}</td>
                  <td className={styles.tableCell}>{row.purchaseOrder}</td>
                  <td className={styles.tableCell}>{row.description}</td>
                  <td className={styles.tableCell}>{row.invoiceAmount}</td>
                  <td className={styles.tableCell}>{row.balance}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationLeft}>
          <span className={styles.rowsPerPageLabel}>Rows per page:</span>
          <div className={styles.rowsPerPageDropdown}>
            <span>{rowsPerPage}</span>
            <svg className={styles.dropdownArrow} viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" fill="#0000008a"></path>
            </svg>
          </div>
        </div>
        <div className={styles.paginationRight}>
          <span className={styles.paginationInfo}>
            {startRow}-{endRow} of {totalRows}
          </span>
          <button
            className={styles.paginationButton}
            disabled={currentPage === 1 || loading}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ArrowLeftIcon />
          </button>
          <button
            className={styles.paginationButton}
            disabled={endRow >= totalRows || loading}
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSearchPage;
