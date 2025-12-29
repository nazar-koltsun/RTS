'use client';

import styles from './PurchaseSection.module.css';

// Format amount with $ and commas
// Rules based on examples:
// - Amounts < $1,000: always show .00
// - $1,000 (whole number): no .00
// - $10,000.00, $100,000.00: show .00 (even if whole number)
// - $1,000,000 (whole number): no .00
// - Amounts with cents: always show the cents
const formatAmount = (value) => {
  if (!value || value === '') return '$0.00';
  // Remove any existing formatting ($, commas)
  const numericValue = value.toString().replace(/[$,]/g, '');
  if (numericValue === '' || numericValue === '.') return '$0.00';

  // Parse as float to handle decimals properly
  const numValue = parseFloat(numericValue);
  if (isNaN(numValue)) return '$0.00';

  // Handle decimal numbers
  const parts = numericValue.split('.');
  const integerPart = parts[0] || '0';
  const decimalPart = parts[1] !== undefined ? parts[1] : '';

  // Check if it's a whole number
  const isWholeNumber =
    decimalPart === '' || parseFloat('0.' + decimalPart) === 0;

  // Add commas to integer part using regex
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Format decimal part
  let formattedDecimal = '';
  if (numValue < 1000) {
    // Always show .00 for amounts < 1000
    formattedDecimal = '.00';
  } else if (!isWholeNumber) {
    // Show the actual decimal part (pad to 2 digits if needed)
    formattedDecimal =
      '.' +
      (decimalPart.length >= 2
        ? decimalPart.substring(0, 2)
        : decimalPart.padEnd(2, '0'));
  } else {
    // For whole numbers >= 1000
    // Show .00 for 10,000 and 100,000, but not for 1,000 or 1,000,000
    const intValue = parseInt(integerPart, 10);
    if (intValue === 1000 || intValue >= 1000000) {
      // Don't show .00 for exactly 1,000 or >= 1,000,000
      formattedDecimal = '';
    } else {
      // Show .00 for other whole numbers (like 10,000, 100,000)
      formattedDecimal = '.00';
    }
  }

  return '$' + formattedInteger + formattedDecimal;
};

// Parse formatted amount to raw number string
const parseAmount = (formattedValue) => {
  // Remove $ and commas, keep numbers and decimal point
  return formattedValue.replace(/[$,]/g, '');
};

const PurchaseSection = ({
  invoices,
  onRemoveAll,
  onSubmitPurchase,
  generateCoverPages,
  onGenerateCoverPagesChange,
  isSubmitDisabled = false,
}) => {
  // Calculate total amount from all invoices
  const calculateTotalAmount = () => {
    return invoices.reduce((total, invoice) => {
      const amount = parseFloat(parseAmount(invoice.amount || '0')) || 0;
      return total + amount;
    }, 0);
  };

  // Format total amount for display
  const formatTotalAmount = () => {
    const total = calculateTotalAmount();
    return formatAmount(total.toString());
  };

  return (
    <div className={styles.purchaseSection}>
      <button
        className={styles.removeButton}
        onClick={onRemoveAll}
        disabled={invoices.length === 0}
      >
        Remove ({invoices.length})
      </button>

      <div className={styles.purchaseMiddle}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={generateCoverPages}
            onChange={(e) => onGenerateCoverPagesChange(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>
            Generate RTS Invoice Cover Pages
          </span>
        </label>

        <div className={styles.amountDivider}></div>

        <div className={styles.amountText}>
          Amount:{' '}
          <span className={styles.amountTextAmount}>{formatTotalAmount()}</span>
        </div>
      </div>

      <button
        className={styles.submitButton}
        onClick={onSubmitPurchase}
        disabled={isSubmitDisabled}
      >
        Submit purchase
      </button>
    </div>
  );
};

export default PurchaseSection;
