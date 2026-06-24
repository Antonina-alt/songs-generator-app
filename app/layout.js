import './globals.css';
import appMetadata from '@/data/app/metadata.json';
import { QueryProvider } from '@/components/QueryProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import Script from 'next/script';
import { DEFAULT_REGION } from '@/lib/songs/constants';

export const metadata = appMetadata;

export default function RootLayout({ children }) {
    return (
        <html lang={DEFAULT_REGION}>
            <body>
                <Script src="/vendor/mespeak/mespeak.js" strategy="beforeInteractive" />
                <AppRouterCacheProvider>
                    <QueryProvider>{children}</QueryProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
