'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import FormInput from '@/app/components/FormInput';
import styles from './EditPaymentModal.module.css';

const EditPaymentModal = ({
  isOpen,
  onClose,
  invoiceId,
  invoiceData,
  onSave,
}) => {
  const [paymentForm, setPaymentForm] = useState({
    paymentCheck: '',
    paymentDate: '',
    paymentStatus: '-',
    paymentAmount: '',
  });
  const [saving, setSaving] = useState(false);

  const getDateInputValue = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  const formatAmount = (value) => {
    if (!value || value === '') return '';
    const numericValue = String(value).replace(/[$,]/g, '');
    if (numericValue === '' || numericValue === '.') return '';
    const parts = numericValue.split('.');
    const integerPart = parts[0] || '';
    const decimalPart = parts[1] !== undefined ? '.' + parts[1] : '';
    if (integerPart === '' && decimalPart === '') return '';
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + formattedInteger + decimalPart;
  };

  const parseAmount = (formattedValue) =>
    formattedValue.replace(/[$,]/g, '');

  useEffect(() => {
    if (isOpen && invoiceData) {
      setPaymentForm({
        paymentCheck: invoiceData.payment_check || '',
        paymentDate: getDateInputValue(invoiceData.payment_date) || '',
        paymentStatus: invoiceData.payment_status || '-',
        paymentAmount:
          invoiceData.payment_amount != null
            ? String(invoiceData.payment_amount)
            : '',
      });
    }
  }, [isOpen, invoiceData]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSave = async () => {
    if (!invoiceId) return;
    setSaving(true);
    try {
      const paymentDateVal = paymentForm.paymentDate?.trim();
      let paymentDateFormatted = null;
      if (paymentDateVal) {
        const [year, month, day] = paymentDateVal.split('-');
        paymentDateFormatted = `${year}-${month}-${day}`;
      }
      const paymentAmountVal = parseAmount(paymentForm.paymentAmount);
      const paymentAmount =
        paymentAmountVal !== '' ? parseFloat(paymentAmountVal) : null;

      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          payment_check: paymentForm.paymentCheck?.trim() || null,
          payment_date: paymentDateFormatted,
          payment_status:
            paymentForm.paymentStatus?.trim() && paymentForm.paymentStatus !== '-'
              ? paymentForm.paymentStatus
              : null,
          payment_amount: paymentAmount,
        })
        .eq('id', invoiceId);

      if (updateError) throw updateError;

      onSave({
        payment_check: paymentForm.paymentCheck?.trim() || null,
        payment_date: paymentDateFormatted,
        payment_status:
          paymentForm.paymentStatus?.trim() && paymentForm.paymentStatus !== '-'
            ? paymentForm.paymentStatus
            : null,
        payment_amount: paymentAmount,
      });

      onClose();
    } catch (err) {
      console.error('Error updating payment:', err);
      alert('Failed to update payment: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Edit Payment</h3>
        <div className={styles.form}>
          <FormInput
            id="modal-payment-check"
            label="Payment Check"
            value={paymentForm.paymentCheck}
            onChange={(e) =>
              setPaymentForm((p) => ({
                ...p,
                paymentCheck: e.target.value,
              }))
            }
          />
          <FormInput
            id="modal-payment-date"
            type="date"
            label="Payment Date"
            value={paymentForm.paymentDate}
            onChange={(e) =>
              setPaymentForm((p) => ({
                ...p,
                paymentDate: e.target.value,
              }))
            }
          />
          <div className={styles.selectWrapper}>
            <label htmlFor="modal-payment-status" className={styles.label}>
              Payment Status
            </label>
            <select
              id="modal-payment-status"
              className={styles.select}
              value={paymentForm.paymentStatus}
              onChange={(e) =>
                setPaymentForm((p) => ({
                  ...p,
                  paymentStatus: e.target.value,
                }))
              }
            >
              <option value="-">-</option>
              <option value="Processed">Processed</option>
            </select>
          </div>
          <FormInput
            id="modal-payment-amount"
            label="Payment Amount"
            value={formatAmount(paymentForm.paymentAmount)}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') {
                setPaymentForm((p) => ({ ...p, paymentAmount: '' }));
                return;
              }
              const raw = parseAmount(val);
              if (/^\d*\.?\d*$/.test(raw)) {
                setPaymentForm((p) => ({ ...p, paymentAmount: raw }));
              }
            }}
            inputMode="decimal"
          />
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPaymentModal;
