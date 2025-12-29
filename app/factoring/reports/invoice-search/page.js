'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

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
          <svg className={styles.dropdownArrow} viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" fill="#0000008a"></path></svg>
        </div>

      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchInputs}>
          <div className={styles.searchInputWrapper}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                stroke="#65676e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 14L11.1 11.1"
                stroke="#65676e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Invoice Number"
              className={styles.searchInput}
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleView()}
            />
          </div>
          <div className={styles.searchInputWrapper}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                stroke="#65676e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 14L11.1 11.1"
                stroke="#65676e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Reference Number"
              className={styles.searchInput}
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleView()}
            />
          </div>
          <button className={styles.viewButton} onClick={handleView}>
            View
          </button>
        </div>
        <div className={styles.actionIcons}>
          <button className={styles.iconButton} aria-label="Search">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                stroke="#65676e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 17.5L13.875 13.875"
                stroke="#65676e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className={styles.iconButton} aria-label="Print">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5V3.33333C5 2.89131 5.17559 2.46738 5.48816 2.15482C5.80072 1.84226 6.22464 1.66667 6.66667 1.66667H13.3333C13.7754 1.66667 14.1993 1.84226 14.5118 2.15482C14.8244 2.46738 15 2.89131 15 3.33333V7.5M5 7.5H3.33333C2.89131 7.5 2.46738 7.67559 2.15482 7.98816C1.84226 8.30072 1.66667 8.72464 1.66667 9.16667V14.1667C1.66667 14.6087 1.84226 15.0326 2.15482 15.3452C2.46738 15.6577 2.89131 15.8333 3.33333 15.8333H5M5 7.5V15.8333M15 7.5H16.6667C17.1087 7.5 17.5326 7.67559 17.8452 7.98816C18.1577 8.30072 18.3333 8.72464 18.3333 9.16667V14.1667C18.3333 14.6087 18.1577 15.0326 17.8452 15.3452C17.5326 15.6577 17.1087 15.8333 16.6667 15.8333H15M15 7.5V15.8333M15 11.6667H5"
                stroke="#65676e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className={styles.iconButton} aria-label="Download">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 13.3333V3.33333M10 13.3333L6.66667 10M10 13.3333L13.3333 10M3.33333 16.6667H16.6667"
                stroke="#65676e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className={styles.iconButton} aria-label="Filter">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 5H17.5M5 10H15M7.5 15H12.5"
                stroke="#65676e"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
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
            <Image
              src="/caretdown.svg"
              alt="Dropdown"
              width={12}
              height={12}
              className={styles.dropdownArrow}
            />
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke={currentPage === 1 ? '#ccc' : '#65676e'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={styles.paginationButton}
            disabled={endRow >= totalRows}
            onClick={() => setCurrentPage(currentPage + 1)}
            aria-label="Next page"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke={endRow >= totalRows ? '#ccc' : '#65676e'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSearchPage;
