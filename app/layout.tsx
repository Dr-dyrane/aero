import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Space_Grotesk, DM_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProviders } from './providers'
import { ThemeToggle } from '@/modules/ui'
import './globals.css'

/* ── Bio-Digital Hybrid Font System ─────────────────────────────── */

// Geist — UI (body, buttons, labels)
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

// Space Grotesk — Headings
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

// Satoshi — Numbers (Score, Vault)
// Using DM Mono as stand-in for Satoshi until premium font files are added.
// Replace with local Satoshi font when available.
const satoshi = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-satoshi',
})


export const metadata: Metadata = {
  title: 'AERO',
  description: 'Rebranding Addiction as an Elite Bio-Investment. Track your Aero Score, protect your Bio-Vault, and earn real-world merits.',
  generator: 'AERO',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#F5F7FA' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="eclipse"
      className={`${geist.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${satoshi.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#00F5FF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="AERO" />
      </head>
      <body className="font-sans antialiased">
        <AppProviders>
          {children}
        </AppProviders>
        <Analytics />

        {/* Service Worker Registration */}
        {/* Sovereign Protocol: Automated PWA Updates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                let refreshing = false;

                // Sync the protocol: Reload when new SW takes over
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                  if (refreshing) return;
                  refreshing = true;
                  window.location.reload();
                });

                function registerServiceWorker() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                      console.log('Protocol Registered');

                      // Check for updates on load
                      if (registration.waiting) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                      }

                      // Listen for future updates
                      registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Protocol update detected: Force active
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                          }
                        });
                      });

                      // Periodic Background Check (Every 1 hour)
                      setInterval(() => {
                        registration.update();
                      }, 3600000);
                    })
                    .catch(error => {
                      console.error('Protocol sync failed:', error);
                    });
                }

                registerServiceWorker();

                // Re-check protocol on visibility change
                document.addEventListener('visibilitychange', () => {
                  if (document.visibilityState === 'visible') {
                    navigator.serviceWorker.getRegistration().then(reg => {
                      if (reg) reg.update();
                    });
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
