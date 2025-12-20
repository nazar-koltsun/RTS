import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ConditionalLayout from './components/ConditionalLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'RTS Pro',
  description: 'RTS platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
