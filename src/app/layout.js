
import { METADATABASE_API_URL } from '@/app/lib/constants';
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import Cursor from './components/Cursor';

export const metadata = {
  metadataBase: new URL(METADATABASE_API_URL),
  title: "B*tch With Your Ballot - Babes Helpin' Babes at Signal Theory",
  description: "It's no secret that things are a bit of a sh*t show right now. If you've got something to say about it, say it with your vote.",
  openGraph: {
    images: [
      {
        url: '/og-image.jpg', // Replace with your image URL
        alt: 'B*tch With Your Ballot', // Optional: Add an alt description for the image
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
