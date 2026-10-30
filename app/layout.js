import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Sheggar Wheels | Peer-to-Peer Car Rental Addis Ababa',
  description: 'Rent premium vehicles or list your car for rent in Addis Ababa with Sheggar Wheels.',
};

export default function RootLayout({ children }) {
  return (
<html lang="en" data-scroll-behavior="smooth"><body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );}