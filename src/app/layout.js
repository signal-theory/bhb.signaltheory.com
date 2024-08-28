import { METADATABASE_API_URL } from '@/app/lib/constants';
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import Cursor from './components/Cursor';

export const metadata = {
  metadataBase: new URL(METADATABASE_API_URL),
  title: "B*tch With Your Ballot - Babes Helpin' Babes at Signal Theory",
  description: "If you've got something to b*tch about, say it with your vote.",
  openGraph: {
    images: [
      {
        url: '/og-image.jpg',
        alt: 'B*tch With Your Ballot',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
          <Cursor />
        </AppProvider>
      </body>
    </html>
  );
}