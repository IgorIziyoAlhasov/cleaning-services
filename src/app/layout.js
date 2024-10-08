// app/layout.js

import './globals.css';

export const metadata = {
  title: 'Cleaning Services Registration',
  description: 'Client and Business Center registration for cleaning services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}