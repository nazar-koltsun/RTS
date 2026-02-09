'use client';

import FormInput from '@/app/components/FormInput';
import styles from './CustomerExtraFields.module.css';

const CustomerExtraFields = ({
  invoiceId,
  customerEmail,
  customerPhone,
  creditRating,
  paymentCheck,
  paymentDate,
  paymentStatus,
  paymentAmount,
  formatAmount,
  parseAmount,
  onCustomerEmailChange,
  onCustomerPhoneChange,
  onCreditRatingChange,
  onPaymentCheckChange,
  onPaymentDateChange,
  onPaymentStatusChange,
  onPaymentAmountChange,
  inputClassName,
}) => {
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and phone number symbols: +, -, (, ), spaces, and .
    const phoneRegex = /^[0-9+\-() .]*$/;
    if (phoneRegex.test(value)) {
      onCustomerPhoneChange(value);
    }
  };

  const handleNumberChange = (value, onChange) => {
    // Allow only numbers and decimal point
    const numberRegex = /^\d*\.?\d*$/;
    if (numberRegex.test(value) || value === '') {
      onChange(value);
    }
  };

  // Convert stored date (MM/DD/YYYY or YYYY-MM-DD) to YYYY-MM-DD for date input
  const getDateInputValue = () => {
    if (!paymentDate || paymentDate.trim() === '' || paymentDate === '-') {
      return '';
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(paymentDate)) {
      return paymentDate;
    }
    const mmDdYyyyMatch = paymentDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (mmDdYyyyMatch) {
      const [, month, day, year] = mmDdYyyyMatch;
      return `${year}-${month}-${day}`;
    }
    return '';
  };

  return (
    <div className={styles.filesPreviewForm}>
      <div className={styles.filesPreviewContact}>
        <FormInput
          id={`customer-email-${invoiceId}`}
          name="customerEmail"
          type="email"
          label="Customer Email"
          className={inputClassName}
          value={customerEmail || ''}
          onChange={(e) => onCustomerEmailChange(e.target.value)}
        />

        <FormInput
          id={`customer-phone-${invoiceId}`}
          name="customerPhone"
          type="text"
          inputMode="tel"
          label="Customer Phone"
          className={inputClassName}
          value={customerPhone || ''}
          onChange={handlePhoneChange}
        />

        <div className={`${inputClassName} ${styles.selectWrapper}`}>
          <label
            htmlFor={`credit-rating-${invoiceId}`}
            className={styles.selectLabel}
          >
            Credit Rating
          </label>
          <select
            id={`credit-rating-${invoiceId}`}
            name="creditRating"
            className={styles.selectInput}
            value={creditRating || '-'}
            onChange={(e) => onCreditRatingChange(e.target.value)}
          >
            <option value="-">-</option>
            <option value="A">A - Excellent</option>
            <option value="B">B - Good</option>
            <option value="C">C - Average</option>
            <option value="D">D - Poor</option>
          </select>
        </div>
      </div>
      <div className={styles.paymentFields}>
        <FormInput
          id={`payment-check-${invoiceId}`}
          name="paymentCheck"
          type="text"
          label="Payment Check"
          className={inputClassName}
          value={paymentCheck || ''}
          onChange={(e) => onPaymentCheckChange(e.target.value)}
        />

        <FormInput
          id={`payment-date-${invoiceId}`}
          name="paymentDate"
          type="date"
          label="Payment Date"
          className={inputClassName}
          value={getDateInputValue()}
          onChange={(e) => {
            const dateValue = e.target.value;
            if (!dateValue || dateValue.trim() === '') {
              onPaymentDateChange('-');
            } else {
              const [year, month, day] = dateValue.split('-');
              onPaymentDateChange(`${month}/${day}/${year}`);
            }
          }}
          placeholder="-"
        />

        <div className={`${inputClassName} ${styles.selectWrapper}`}>
          <label
            htmlFor={`payment-status-${invoiceId}`}
            className={styles.selectLabel}
          >
            Payment Status
          </label>
          <select
            id={`payment-status-${invoiceId}`}
            name="paymentStatus"
            className={styles.selectInput}
            value={paymentStatus || '-'}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
          >
            <option value="-">-</option>
            <option value="Processed">Processed</option>
          </select>
        </div>

        <FormInput
          id={`payment-amount-${invoiceId}`}
          name="paymentAmount"
          type="text"
          label="Payment Amount"
          className={inputClassName}
          value={formatAmount(paymentAmount)}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue === '') {
              onPaymentAmountChange('');
              return;
            }
            const rawValue = parseAmount(inputValue);
            if (/^\d*\.?\d*$/.test(rawValue)) {
              onPaymentAmountChange(rawValue);
            }
          }}
          inputMode="decimal"
        />
      </div>
    </div>
  );
};

export default CustomerExtraFields;
