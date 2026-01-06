'use client';

import FormInput from '@/app/components/FormInput';
import styles from './CustomerExtraFields.module.css';

const CustomerExtraFields = ({
  invoiceId,
  customerEmail,
  customerPhone,
  onCustomerEmailChange,
  onCustomerPhoneChange,
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
    </div>
  );
};

export default CustomerExtraFields;
