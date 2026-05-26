import "./globals.css";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Providers } from "../services/provider";
import ErrorBoundary from "../common/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Movies",
  description: "A personal movie collection manager. Add, edit and track your favourite films.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div
          className={`${inter.className} bg-background bg-[url('../assets/images/waves.png')] bg-contain bg-no-repeat bg-bottom`}
        >
          <ErrorBoundary>
            <Providers>
              <ToastContainer />
              {children}
            </Providers>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
