import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FundingPortal — Apply for Funding",
  description: "Submit and track your funding application online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
              <span>© {new Date().getFullYear()} FundingPortal</span>
              <div className="flex gap-4">
                <a href="/privacy" className="hover:text-brand-600">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-brand-600">
                  Terms of Service
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
