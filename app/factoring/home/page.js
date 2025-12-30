'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { checkSessionAgeAndLogout } from '@/lib/supabase';
import styles from './page.module.css';
import Link from 'next/link';

// Card component for reusable card containers
function Card({ children, className }) {
  return <div className={`${styles.card} ${className || ''}`}>{children}</div>;
}

// Section Header component
function SectionHeader({
  title,
  subtitle = '',
  linkText,
  onLinkClick,
  showInfoIcon,
}) {
  return (
    <div className={styles.sectionHeader}>
      <h3 className={styles.sectionTitle}>
        {title}
        {subtitle && <span className={styles.sectionSubtitle}>{subtitle}</span>}
        {showInfoIcon && (
          <Image
            src={'/info-icon.svg'}
            alt="Info Icon"
            className={styles.infoIcon}
            width={14}
            height={14}
          />
        )}
      </h3>
      {linkText && (
        <Link href="/" onClick={onLinkClick} className={styles.sectionLink}>
          {linkText}
        </Link>
      )}
    </div>
  );
}

// Status Item component - displays large number with label below
function StatusItem({ label, value, subLabel }) {
  return (
    <div className={styles.statusItem}>
      <div className={styles.statusItemContainer}>
        <div
          className={cn(
            styles.statusValue,
            subLabel && styles.statusValueSmall
          )}
        >
          {value}
        </div>
        <div
          className={cn(
            styles.statusLabel,
            subLabel && styles.statusLabelSmall
          )}
        >
          {label}
        </div>
        {subLabel && <div className={styles.statusSubLabel}>{subLabel}</div>}
      </div>
    </div>
  );
}

export default function Factoring() {
  const router = useRouter();

  // Check session age on mount - logout if session is older than 2 hours
  useEffect(() => {
    checkSessionAgeAndLogout((path) => router.push(path));
  }, [router]);

  // Data for the page
  const unfundedInvoices = {
    held: 0,
    pending: 0,
    denied: 0,
  };

  const currentPurchase = {
    submittedDate: '12/22/2025 at 11:46 CST',
    submitted: 12,
    purchased: 12,
    status: 'processed',
  };

  const topDebtors = [
    {
      name: 'TOTAL QUALITY LOGISTICS',
      amount: 28052.5,
      color: '#005799',
    },
    {
      name: 'SCOTLYNN USA DIVISION INC',
      amount: 22800,
      color: '#0064af',
    },
    {
      name: 'INTEGRITY EXPRESS',
      amount: 17297,
      color: '#0070c5',
    },
    {
      name: 'ARRIVE LOGISTICS DBA DM',
      amount: 16100,
      color: '#0083ca',
    },
    {
      name: 'JEAR LOGISTICS, LLC',
      amount: 15418.75,
      color: '#0093e3',
    },
    { name: 'OTHERS', amount: 500108.94, color: '#00a5ff' },
  ];

  const purchasedInvoices = {
    actionNeeded: 0,
    nearingRecourse: 4,
  };

  const accountsReceivable = 599777.19;
  const reserves = -150.0;

  const recentPurchases = [
    { date: '12/22/2025', amount: 33684.75, invoices: 12 },
    { date: '12/19/2025', amount: 29056.5, invoices: 9 },
    { date: '12/18/2025', amount: 10773.67, invoices: 9 },
  ];

  const accountRep = {
    name: 'Josh Jansen',
    phone: '913.335.9010',
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      {/* Top instruction banner */}
      <div className={styles.instructionBanner}>
        To guarantee same-day processing, invoices must include all
        documentation and be submitted before 12:00 PM CST
      </div>

      {/* Main content area */}
      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Unfunded Invoices Last 35 Days */}
          <Card className={styles.unfundedCard}>
            <SectionHeader
              title="Unfunded Invoices"
              subtitle="Last 35 days"
              linkText="View all"
              showInfoIcon
            />
            <div className={cn(styles.statusGrid, styles.statusGridUnfunded)}>
              <StatusItem label="Held" value={unfundedInvoices.held} />
              <StatusItem label="Pending" value={unfundedInvoices.pending} />
              <StatusItem label="Denied" value={unfundedInvoices.denied} />
            </div>
          </Card>

          {/* Current Purchase Status */}
          <Card className={styles.purchaseStatusCard}>
            <SectionHeader title="Current Purchase Status" />
            <div className={styles.purchaseStatusContent}>
              <p className={styles.submittedDate}>
                Submitted on {currentPurchase.submittedDate}
              </p>
              <picture>
                <source
                  media="(min-width: 2000px)"
                  srcSet="/images/progressbar-big.png"
                />
                <img
                  className={styles.progressBar}
                  src="/images/progressbar.png"
                  alt="Progress Bar"
                  width={670}
                  height={16}
                />
              </picture>
              <div className={styles.processedMessage}>
                <div className={styles.processedHeading}>Processed</div>
                <div className={styles.processedText}>
                  Your purchase has been processed. If you have not received
                  your funds by 8:00 AM CST next business day, please reach out
                  to your account representative.
                </div>
              </div>

              <div className={styles.statusLabels}>
                <div className={styles.submittedLabel}>
                  {currentPurchase.submitted} Submitted
                </div>
                <div className={styles.purchasedLabel}>
                  <span className={styles.purchasedIcon}></span>
                  {currentPurchase.purchased} Purchased
                </div>
              </div>

              <div className={styles.viewDetailsContainer}>
                <Link href="/" className={styles.viewDetailsLink}>
                  View Purchase Details
                </Link>
              </div>
            </div>
          </Card>

          {/* Top Debtors */}
          <Card className={styles.debtorsCard}>
            <SectionHeader title="Top Debtors" />
            <div className={styles.debtorsContent}>
              <div className={styles.debtorsList}>
                {topDebtors.map((debtor, index) => (
                  <div key={index} className={styles.debtorItem}>
                    <span
                      className={styles.debtorColorSquare}
                      style={{ backgroundColor: debtor.color }}
                    ></span>
                    <div className={styles.debtorInfoContainer}>
                      <div className={styles.debtorName}>{debtor.name}</div>
                      <div className={styles.debtorAmount}>
                        {formatCurrency(debtor.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.pieChartContainer}>
                <Image
                  src="/images/diagram.png"
                  alt="Top Debtors Distribution"
                  width={271}
                  height={270}
                  className={styles.pieChart}
                  unoptimized
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Purchased Invoices */}
          <Card className={styles.purchasedCard}>
            <SectionHeader
              title="Purchased Invoices"
              linkText="View report"
              showInfoIcon
            />
            <div className={styles.statusList}>
              <StatusItem
                label="Action Needed"
                value={purchasedInvoices.actionNeeded}
              />
              <StatusItem
                label="Nearing Recourse"
                value={purchasedInvoices.nearingRecourse}
                subLabel="60 Days and Older"
              />
            </div>
          </Card>

          {/* Accounts Receivable */}
          <div className={styles.accountCardContainer}>
            <Card className={styles.accountCard}>
              <SectionHeader title="Accounts Receivable" linkText="View" />
              <div className={styles.accountAmount}>
                {formatCurrency(accountsReceivable)}
              </div>
            </Card>

            {/* Reserves */}
            <Card className={styles.accountCard}>
              <SectionHeader title="Reserves" linkText="View" />
              <div className={styles.accountAmount}>
                {formatCurrency(reserves)}
              </div>
            </Card>
          </div>

          {/* Recent Purchases */}
          <Card className={styles.recentPurchasesCard}>
            <SectionHeader title="Recent Purchases" linkText="View all" />
            <table className={styles.purchasesTable}>
              <thead>
                <tr>
                  <th>Purchase Date</th>
                  <th>Wire Amount</th>
                  <th>Invoices</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((purchase, index) => (
                  <tr key={index}>
                    <td>{purchase.date}</td>
                    <td>{formatCurrency(purchase.amount)}</td>
                    <td>{purchase.invoices}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Your Account Rep */}
          <Card className={styles.accountRepCard}>
            <SectionHeader title="Your Account Rep" />
            <div className={styles.accountRepContent}>
              <div className={styles.accountRepInfo}>
                <svg
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  fill="#0083ca"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 14H4V8l8 5 8-5zm-8-7L4 6h16z"></path>
                </svg>
                <span className={styles.repName}>{accountRep.name}</span>
              </div>
              <div className={styles.accountRepInfo}>
                <svg
                  fill="#666666"
                  width={24}
                  height={24}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02z"></path>
                </svg>
                <span className={styles.repPhone}>{accountRep.phone}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
