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

const InvoiceSearchPage = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - replace with actual data fetching
  const [tableData, setTableData] = useState([]);

  const handleView = () => {
    // Mock search result - replace with actual API call
    if (invoiceNumber === '6834') {
      setTableData([
        {
          invoiceNumber: '6834',
          customerName: 'PACE LOGISTICS INC',
          invoiceDate: '12/18/2025',
          batchNumber: '14588232',
          purchaseOrder: '31450-36401',
          description: '',
          invoiceAmount: '$150.00',
          balance: '$150.00',
        },
      ]);
      setCurrentPage(1);
    } else {
      setTableData([]);
    }
  };

  const totalRows = tableData.length;
  const startRow = totalRows > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

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
            isDisabled={true}
            onChange={(e) => setReferenceNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleView()}
          />
          <Button
            className={styles.viewButton}
            onClick={handleView}
            disabled={!invoiceNumber || invoiceNumber.trim() === ''}
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
            {tableData.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.emptyState}></td>
              </tr>
            ) : (
              tableData.map((row, index) => (
                <tr key={index} className={styles.tableRow}>
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
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            aria-label="Previous page"
          >
            <ArrowLeftIcon />
          </button>
          <button
            className={styles.paginationButton}
            disabled={endRow >= totalRows}
            onClick={() => setCurrentPage(currentPage + 1)}
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
