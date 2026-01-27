import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reveal Footer Effect',
  description: 'Next.js App Router with Reveal Footer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <Navigation />

    
         
            {children}
         

     
      </body>
    </html>
  );
}