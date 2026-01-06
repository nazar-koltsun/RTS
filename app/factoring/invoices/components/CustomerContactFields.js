'use client';

import FormInput from '@/app/components/FormInput';
import styles from './FilesPreviewBlock.module.css';

const CustomerContactFields = ({
  invoiceId,
  customerEmail,
  customerPhone,
  onCustomerEmailChange,
  onCustomerPhoneChange,
}) => {
  return (
    <div className={styles.filesPreviewForm}>
      <div className={styles.filesPreviewInputs}>
        <FormInput
          id={`customer-email-${invoiceId}`}
          name="customerEmail"
          type="email"
          label="Customer Email"
          value={customerEmail || ''}
          onChange={(e) => onCustomerEmailChange(e.target.value)}
          required
        />

        <FormInput
          id={`customer-phone-${invoiceId}`}
          name="customerPhone"
          type="tel"
          label="Customer Phone"
          value={customerPhone || ''}
          onChange={(e) => onCustomerPhoneChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default CustomerContactFields;

