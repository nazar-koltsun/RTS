'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import styles from './page.module.css';

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
        <a href="#" onClick={onLinkClick} className={styles.sectionLink}>
          {linkText}
        </a>
      )}
    </div>
  );
}

// Status Item component - displays large number with label below
function StatusItem({ label, value, subLabel }) {
  return (
    <div className={styles.statusItem}>
      <div className={styles.statusItemContainer}>
        <div className={cn(styles.statusValue, subLabel && styles.statusValueSmall)}>{value}</div>
        <div className={cn(styles.statusLabel, subLabel && styles.statusLabelSmall)}>{label}</div>
        {subLabel && <div className={styles.statusSubLabel}>{subLabel}</div>}
      </div>
    </div>
  );
}

export default function Factoring() {
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
      percentage: 5,
      color: '#4A90E2',
    },
    {
      name: 'SCOTLYNN USA DIVISION INC',
      amount: 22800,
      percentage: 4,
      color: '#5BA3F0',
    },
    {
      name: 'INTEGRITY EXPRESS',
      amount: 17297,
      percentage: 3,
      color: '#6CB4FE',
    },
    {
      name: 'ARRIVE LOGISTICS DBA DM',
      amount: 16100,
      percentage: 3,
      color: '#7DC5FF',
    },
    {
      name: 'JEAR LOGISTICS, LLC',
      amount: 15418.75,
      percentage: 3,
      color: '#8ED6FF',
    },
    { name: 'OTHERS', amount: 500108.94, percentage: 83, color: '#00A3FF' },
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
    phone: '913.335.9000',
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
            <div className={styles.statusGrid}>
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
              <Image className={styles.progressBar} src="/images/progressbar.png" alt="Progress Bar" width={670} height={16} />
              <div className={styles.processedMessage}>
                <div className={styles.processedHeading}>Processed</div>
                <div className={styles.processedText}>
                  Your purchase has been processed. If you have not received
                  your funds by 8:00 AM CST next business day, please reach out
                  to your account representative.
                </div>
              </div>
              <a href="#" className={styles.viewDetailsLink}>
                View Purchase Details
              </a>
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
                    <div className={styles.debtorName}>{debtor.name}</div>
                    <div className={styles.debtorAmount}>
                      {formatCurrency(debtor.amount)}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.pieChartContainer}>
                <Image
                  src="https://via.placeholder.com/120x120/00A3FF/FFFFFF?text=Pie+Chart"
                  alt="Top Debtors Distribution"
                  width={120}
                  height={120}
                  className={styles.pieChart}
                  unoptimized
                />
                <div className={styles.pieChartLegend}>
                  {topDebtors.map((debtor, index) => (
                    <div key={index} className={styles.legendItem}>
                      <span
                        className={styles.legendDot}
                        style={{ backgroundColor: debtor.color }}
                      ></span>
                      <span className={styles.legendText}>
                        {debtor.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
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
              <div className={styles.repNameHeading}>{accountRep.name}</div>
              <div className={styles.accountRepInfo}>
                <svg
                  className={styles.repIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 3h12v10H2V3zm1 1v8h10V4H3zm1 2l4 2.5L12 6v1l-4 2.5L4 7V6z"
                    fill="currentColor"
                  />
                </svg>
                <span className={styles.repName}>{accountRep.name}</span>
              </div>
              <div className={styles.accountRepInfo}>
                <svg
                  className={styles.repIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.65 11.24a.678.678 0 0 1-.582-.306l-1.562-2.156a.678.678 0 0 1-.126-.58l.228-1.008a.678.678 0 0 0-.122-.58L5.654 1.328z"
                    fill="currentColor"
                  />
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
