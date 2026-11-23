import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PBS Meter Tester Directory',
  description: 'Directory portal for PBS Meter Testers and Supervisors',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
