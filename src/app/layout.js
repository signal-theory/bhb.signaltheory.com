import "./globals.css";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "B*tch With Your Ballot - Babes Helpin' Babes at Signal Theory",
  description: "It's no secret that things are a bit of a sh*t show right now. If you've got something to say about it, say it with your vote.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body>
          <AppProvider>
            <Navbar />
            {children}
          </AppProvider>
        </body>
    </html>
  );
}
