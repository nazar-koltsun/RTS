'use client';

import { useEffect } from 'react';
import FormInput from '@/app/components/FormInput';
import styles from './CustomerExtraFields.module.css';

const CustomerExtraFields = ({
  invoiceId,
  customerEmail,
  customerPhone,
  paymentCheck,
  paymentDate,
  paymentStatus,
  onCustomerEmailChange,
  onCustomerPhoneChange,
  onPaymentCheckChange,
  onPaymentDateChange,
  onPaymentStatusChange,
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

  // Get today's date in MM/DD/YYYY format
  const getTodayDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Set default date if empty
  useEffect(() => {
    if (!paymentDate || paymentDate.trim() === '') {
      onPaymentDateChange(getTodayDate());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to set initial default

  // Format date from YYYY-MM-DD to MM/DD/YYYY for display
  const formatDateForInput = (dateString) => {
    // If empty, use today's date
    if (!dateString || dateString.trim() === '') {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    // If already in YYYY-MM-DD format, return as is (for date input)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // If in MM/DD/YYYY format, convert to YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [month, day, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateString;
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
          value={formatDateForInput(paymentDate)}
          onChange={(e) => {
            const dateValue = e.target.value;
            if (dateValue) {
              // Convert YYYY-MM-DD to MM/DD/YYYY
              const [year, month, day] = dateValue.split('-');
              onPaymentDateChange(`${month}/${day}/${year}`);
            } else {
              // If cleared, set to today's date
              const today = new Date();
              const month = String(today.getMonth() + 1).padStart(2, '0');
              const day = String(today.getDate()).padStart(2, '0');
              const year = today.getFullYear();
              onPaymentDateChange(`${month}/${day}/${year}`);
            }
          }}
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
      </div>
    </div>
  );
};

export default CustomerExtraFields;
