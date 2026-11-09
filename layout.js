import './globals.css';

export const metadata = {
  title: 'Inventory & Sales Enterprise System',
  description: 'Barcode-enabled inventory tracking, sales POS, and role-based permissions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}