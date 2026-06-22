import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/QueryProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata = {
    title: 'Music Generator',
    description: 'Seed-based music catalogue generator'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
            <QueryProvider>
                {children}
            </QueryProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}